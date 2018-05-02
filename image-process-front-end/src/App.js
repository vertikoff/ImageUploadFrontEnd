import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Basic from './fileDrop.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">BME 590s Image Processor</h1>
        </header>
        <Basic />
      </div>
    );
  }
}

export default App;
