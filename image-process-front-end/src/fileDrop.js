import React, { Component } from 'react';
import Dropzone from 'react-dropzone'

class Basic extends React.Component {
  constructor() {
    super()
    this.state = { files: [] }
  }

  onDrop(files) {
    console.log(files.length)

    const reader = new FileReader();
    var file = files[0]
    reader.readAsDataURL(file);
    reader.onloadend = (event) => {
      file["base64"] = event.target.result;
      file["guid"] = this.createGUID();
      this.setState({
        files
      });
    };
  }

  createGUID = () => {
    // CRV using UNIX ts as GUID
    var ts = (new Date()).getTime();
    return(ts);
  }

  doHistogramEqualization = () => {
    alert("Histogram Equalization");
    console.log(this);
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
          accept=".jpeg,.png,.tiff"
          onDrop={this.onDrop.bind(this)}>
            <p>Try dropping some files here, or click to select files (.jpg, .png, or .tiff) to upload.</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {
              this.state.files.map(f => <li key={f.name}><img class="uploaded_img" src={f.base64}></img>
                                   <br/>
                                   <span class="og_file_name">{f.name}</span>
                                   <br/>
                                   <span class="og_file_size">{f.size} bytes</span>
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
