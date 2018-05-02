import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import ImageTable from './table.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Basic extends React.Component {
  constructor() {
    super()
    this.state = {
      files: [],
      tableData: [],
      showImageUploadUI: true
     }
  }

  onDrop(files) {
    if (files.length == 0){
      alert("please select a valid file (.jpg, .jpeg, .png, .tiff)");
      return(false);
    }
    if(files.length > 1){
      alert("note: multiple file upload not supported. Only the first image selected has been uploaded.");
    }

    const reader = new FileReader();
    var file = files[0]
    console.log(file);
    reader.readAsDataURL(file);
    reader.onloadend = (event) => {
      file["base64"] = event.target.result;
      file["base64Trim"] = this.removeBase64Header(event.target.result);
      file["uuid"] = this.createUUID();
      this.setState({
        files: files
      });

      // CRV update the data to display in the results table
      var newTableData = {
        "base_64": event.target.result,
        "description": "Original",
        "ts_uploaded": this.getCurrentTSHumanReadable(),
        "time_to_process": "N/A",
        "size": file.size,
        "type": this.getImageType(file.type, true)
      };

      this.addImageToTable(newTableData)

      // CRV toggle the retry button and the image upload UI
      this.setState({
        showImageUploadUI: false
      })
    };
  }

  getCurrentTSHumanReadable = () => {
    var ts = new Date();
    return(ts.toUTCString());
  }
  createUUID = () => {
    // CRV solution from: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  getImageType = (str, optionalAddPeriod) => {
    var prefix = '';
    if(optionalAddPeriod){
      prefix = '.';
    }
    return(prefix + str.replace(/image\//g, ""));
  }

  removeBase64Header = (str) => {
    var needle = 'base64,';
    var charsToTrim = str.indexOf(needle) + needle.length;
    return(str.substring(charsToTrim));
  }

  createBase64Header = (fileType) => {
      var fileType = fileType.replace(/\./g, "");
      return('data:image/' + fileType + ';base64,');
  }

  doHistogramEqualization = () => {
    console.log('ready to upload base64');
    console.log(this.state.files[0]);
    var uuid = this.state.files[0]["uuid"];
    var base64TrimString = this.state.files[0]["base64Trim"];
    var imageType = this.getImageType(this.state.files[0]["type"], true);
    this.state.files[0]["edited"] = "";

    const postData = {
      "img_ID": uuid,
       'do': {'hist_eq': false,
              'contrast': true,
              'log_comp': false,
              'reverse': false},
      "img_metadata" : {
        "hist_eq": 100,
        "contrast": [30, 100],
        "log_comp": false,
        "reverse": false,
        'format': imageType
      },
      "img_orig": base64TrimString
    };

    console.log(postData);
    axios.post("http://minerva.colab.duke.edu:5000/send_img", postData).then( (response) => {
			this.fetchImage()
		})
  }

  fetchImage = (uuid, action) => {
    const postData = {
      "img_ID": uuid,
    };
    console.log(postData);
    axios.post("http://minerva.colab.duke.edu:5000/view_proc", postData).then( (response) => {
      console.log(response);
      var newTableData = {
        "base_64": this.createBase64Header(response.data.img_metadata.format) + response.data.img_proc,
        "description": action,
        "ts_uploaded": response.data.img_metadata.time,
        "time_to_process": "N/A",
        "size": response.data.img_metadata.img_size,
        "type": this.getImageType(response.data.img_metadata.format)
      };

      this.addImageToTable(newTableData)
		})
  }

  doContrastStretching = () => {
    var uuid = this.createUUID();
    var base64TrimString = this.state.files[0]["base64Trim"];
    var imageType = this.getImageType(this.state.files[0]["type"], true);
    const postData = {
      "img_ID": uuid,
       'do': {'hist_eq': false,
              'contrast': true,
              'log_comp': false,
              'reverse': false},
      "img_metadata" : {
        "hist_eq": 100,
        "contrast": [30, 100],
        "log_comp": false,
        "reverse": false,
        'format': imageType
      },
      "img_orig": base64TrimString
    };

    console.log(postData);
    axios.post("http://minerva.colab.duke.edu:5000/send_img", postData).then( (response) => {
			this.fetchImage(uuid, "contrast stretching");
		})
  }

  addImageToTable = (imageObject) => {
    this.setState({
      tableData: this.state.tableData.concat(imageObject)
    });
  }

  doLogCompression = () => {
    alert("Log Compression");
  }

  doReverseVideo = () => {
    alert("Reverse Video");
  }
  reloadPage = () => {
    window.location.reload();
  }

  render() {
    return (
      <section>



        {this.state.showImageUploadUI ? null :
          <div>
            <button onClick={this.doHistogramEqualization} className="standard-btn">Histogram Equalization</button>
            <button onClick={this.doContrastStretching} className="standard-btn">Contrast Stretching</button>
            <button onClick={this.doLogCompression} className="standard-btn">Log Compression</button>
            <button onClick={this.reloadPage} className="standard-btn revert-btn">Upload New Image</button>
          </div>
        }
        {this.state.showImageUploadUI ? <div className="dropzone">
          <Dropzone
          accept=".jpg,.jpeg,.png,.tiff"
          multiple="false"
          onDrop={this.onDrop.bind(this)}>
            <p>Drop a file here, or click to select file to upload.</p>
            <b>required:<br/>(.jpg, .jpeg, .png, or .tiff)</b>
          </Dropzone>
        </div> : null }
        {this.state.showImageUploadUI ? null :
          <MuiThemeProvider>
            <ImageTable tableData={this.state.tableData} />
          </MuiThemeProvider>
        }
        </section>
        // <aside>
        //   <ul>
        //     {
        //       this.state.files.map(f => <li key={f.name}><img className="uploaded_img" src={f.base64}></img>
        //                            <br/>
        //                            <span className="og_file_name">{f.name}</span>
        //                            <br/>
        //                            <span className="og_file_size">{f.size} bytes</span>
        //                            <br/>
        //
        //                            <br/>
        //                            <img id="edit1" src=""></img>
        //                            <br/>
        //
        //                            <br/>
        //
        //                            <br/>
        //
        //                            </li>)
        //     }
        //   </ul>
        // </aside>

    );
  }
}

<Basic />

export default Basic;
