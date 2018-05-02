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
      var img = new Image;
      img.onload = () => {
        var originalImage = this.state.tableData;
        originalImage[0]["size"] = img.height + ' x ' + img.width;
        this.setState({
          tableData: [newTableData]
        })
      };
      img.src = reader.result;

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
        "size": "N/A",
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


  doProcessing = (dataPayload, action) => {
    console.log(dataPayload);
    axios.post("http://minerva.colab.duke.edu:5000/send_img", dataPayload).then( (response) => {
      console.log(response);
      var newTableData = {
        "base_64": this.createBase64Header(response.data.img_metadata.format) + response.data.img_proc,
        "description": action,
        "ts_uploaded": response.data.img_metadata.time,
        "time_to_process": response.data.img_metadata.proc_time,
        "size": response.data.img_metadata.img_size[0] + ' x ' + response.data.img_metadata.img_size[1],
        "type": this.getImageType(response.data.img_metadata.format)
      };

      this.addImageToTable(newTableData)
		})
    .catch(function (error) {
      console.error("======= axios error =============");
      alert("There was an issue processing your image. Please try again.");
    });
  }

  doHistogramEqualization = () => {
    var uuid = this.createUUID();
    var base64TrimString = this.state.files[0]["base64Trim"];
    var imageType = this.getImageType(this.state.files[0]["type"], true);
    const postData = {
      "img_ID": uuid,
       'do': {'hist_eq': true,
              'contrast': false,
              'log_comp': true,
              'reverse': false},
      "img_metadata" : {
        "hist_eq": true,
        "contrast": [30, 100],
        "log_comp": true,
        "reverse": false,
        'format': imageType
      },
      "img_orig": base64TrimString
    };
    this.doProcessing(postData, "Histogram Equalization");
  }

  isContrastValueValid = (value, min, max) => {
    if(!Number.isInteger(value)){
      return(false);
    }
    if(min <= value && value <= max){
      return(true)
    } else {
      return(false)
    }
  }

  doContrastStretching = () => {
    var min = parseInt(prompt("start range (min = 0)", 0));
    if(!this.isContrastValueValid(min, 0, 100)){
      alert("Invalid Contrast Start Range. Value must be integer between 0 and 100.");
      return(false);
    }
    var max = parseInt(prompt("end range (min = " + min + ". max = 100)", 100));
    if(!this.isContrastValueValid(max, min, 100)){
      alert("Invalid Contrast End Range. Value must be integer between your entered minimum (" + min + ") and 100.");
      return(false);
    }

    console.log("min: " + min + '. max: ' + max);
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
        "hist_eq": false,
        "contrast": [min, max],
        "log_comp": false,
        "reverse": false,
        'format': imageType
      },
      "img_orig": base64TrimString
    };
    this.doProcessing(postData, "Contrast Stretching");
  }

  addImageToTable = (imageObject) => {
    this.setState({
      tableData: this.state.tableData.concat(imageObject)
    });
  }

  doLogCompression = () => {
    var uuid = this.createUUID();
    var base64TrimString = this.state.files[0]["base64Trim"];
    var imageType = this.getImageType(this.state.files[0]["type"], true);
    const postData = {
      "img_ID": uuid,
       'do': {'hist_eq': false,
              'contrast': false,
              'log_comp': true,
              'reverse': false},
      "img_metadata" : {
        "hist_eq": false,
        "contrast": [30, 100],
        "log_comp": true,
        "reverse": false,
        'format': imageType
      },
      "img_orig": base64TrimString
    };
    this.doProcessing(postData, "Log Compression");
  }

  doReverseVideo = () => {
    var uuid = this.createUUID();
    var base64TrimString = this.state.files[0]["base64Trim"];
    var imageType = this.getImageType(this.state.files[0]["type"], true);
    const postData = {
      "img_ID": uuid,
       'do': {'hist_eq': false,
              'contrast': false,
              'log_comp': false,
              'reverse': true},
      "img_metadata" : {
        "hist_eq": false,
        "contrast": [30, 100],
        "log_comp": false,
        "reverse": true,
        'format': imageType
      },
      "img_orig": base64TrimString
    };
    this.doProcessing(postData, "Reverse Video");
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
            <button onClick={this.doReverseVideo} className="standard-btn">Reverse Video</button>
            <button onClick={this.reloadPage} className="standard-btn revert-btn">Upload New Image</button>
          </div>
        }
        {this.state.showImageUploadUI ? <div className="dropzone">
          <Dropzone
          accept=".jpg,.jpeg,.png,.tiff"
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
