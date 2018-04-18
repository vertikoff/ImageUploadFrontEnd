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
    reader.onload = (event) => {
      file["base64"] = event.target.result;
      this.setState({
        files
      });
      console.log(this.state);
    };

    // Loop through all uploaded files
    for(var i=0; i < files.length; i++){
      var file = files[i]
      reader.readAsDataURL(file);
    }
  }


  render() {
    return (
      <section>
        <div className="dropzone">
          <Dropzone onDrop={this.onDrop.bind(this)}>
            <p>Try dropping some files here, or click to select files to upload.</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Dropped files</h2>
          <ul>
            {
              this.state.files.map(f => <li key={f.name}><img src={f.base64}></img><br/>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}

<Basic />

export default Basic;
