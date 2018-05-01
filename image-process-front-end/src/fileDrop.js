import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';

class Basic extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(files) {
    if (files.length == 0){
      alert("please select a valid file (.jpg, .jpeg, .png, .tiff)");
      return(false);
    }

    const reader = new FileReader();
    var file = files[0]
    reader.readAsDataURL(file);
    reader.onloadend = (event) => {
      file["base64"] = event.target.result;
      file["base64Trim"] = this.removeBase64Header(event.target.result);
      file["uuid"] = this.createUUID();
      this.setState({
        files
      });
      this.uploadBase64();
    };
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

  getImageType = (str) => {
    return(str.replace(/image\//g, ""));
  }

  removeBase64Header = (str) => {
    var needle = 'base64,';
    var charsToTrim = str.indexOf(needle) + needle.length;
    return(str.substring(charsToTrim));
  }

  uploadBase64 = () => {
    console.log('ready to upload base64');
    console.log(this.state.files[0]);
    var uuid = this.state.files[0]["uuid"];
    var base64String = this.state.files[0]["base64"];
    var imageType = this.getImageType(this.state.files[0]["type"]);

    const postData = {
      "img_ID": uuid,
       'do': {'hist_eq': false,
              'contrast': false,
              'log_comp': false,
              'reverse': false},
      "img_metadata" : {
        "hist_eq": [0, 255],
        "contrast": 2,
        "log_comp": false,
        "reverse": false,
        'format': imageType
      },
      "img_orig": base64String
    };

    console.log(postData);
    axios.post("http://minerva.colab.duke.edu:5000/send_img", postData).then( (response) => {
			console.log(response);
		})
  }

  doHistogramEqualization = () => {
    alert("Histogram Equalization");
    var uuid = this.state.files[0]["uuid"];
    const postData = {
      "img_ID": uuid,
    };
    console.log(postData);
    axios.post("http://minerva.colab.duke.edu:5000/view_proc", postData).then( (response) => {
			console.log(response);
		})
  }

  doContrastStretching = () => {
    alert("Contrast Stretching");
  }

  doLogCompression = () => {
    alert("Log Compression");
  }

  doReverseVideo = () => {
    alert("Reverse Video");
  }

  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone
          accept=".jpg,.jpeg,.png,.tiff"
          onDrop={this.onDrop.bind(this)}>
            <p>Try dropping some files here, or click to select files (.jpg, .jpeg, .png, or .tiff) to upload.</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {
              this.state.files.map(f => <li key={f.name}><img className="uploaded_img" src={f.base64}></img>
                                   <br/>
                                   <span className="og_file_name">{f.name}</span>
                                   <br/>
                                   <span className="og_file_size">{f.size} bytes</span>
                                   <br/>
                                   <button onClick={this.doHistogramEqualization}>Histogram Equalization</button>
                                   <br/>
                                   <button onClick={this.doContrastStretching}>Contrast Stretching</button>
                                   <br/>
                                   <button onClick={this.doLogCompression}>Log Compression</button>
                                   <br/>
                                   <button onClick={this.doReverseVideo}>Reverse Video</button>

                                   </li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}

<Basic />

export default Basic;
