import React, { Component } from 'react';
import axios from 'axios'
import autoBind from 'react-autobind';
import logo from './RedroosterSmall.png';

import './App.css';

import StatusForm from './StatusForm.js';
import WaterForm from './WaterForm.js';
import SettingsForm from './SettingsForm.js';
import OverideForm from './OverideForm.js';

class App extends Component {
  constructor(props) {
    super(props);

    autoBind(this);

    this.state = {
      value: 'status',
      myData: {
	   "latitude": 0,
	   "longitude": 0,
	   "dooropenOffset": 0,
	   "doorcloseOffset": 0,
	   "lightonOffset": 0,
	   "lightoffOffset": 0,
	   "heatOn": 0,
	   "heatOff": 0,
	   "fanOn": 0,
	   "fanOff": 0
      },
      show: false
    };
  }

  componentDidMount() {
     axios.get('/api/current_parms/')
    .then((response) => { 
        this.setState({'myData': response.data, 'show': true});
     })
     .catch((error)   => { this.setState({'myData': error.message}); console.log('Error in App,js on parm call = ', this.state.myData) });
  }

  handleChange(event) {
    console.log('change: ' + event.target.value);
    this.setState({value: event.target.value});
  }

  render() {
    let activeForm = <div>The Form '{this.state.value}' not yet coded.</div>;
    switch (this.state.value) {
      case 'status':   activeForm = <StatusForm myData={ this.state.myData } />;   break;
      case 'water': activeForm = <WaterForm />;   break;
      case 'settings': activeForm = <SettingsForm myData={ this.state.myData } />;   break;
      case 'overide':  activeForm = <OverideForm />;   break;
      default: console.log(this.state.value, ' has no matching form.');
    }

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to The Coop</h2>
        </div>
        <p className="App-intro">
          Select Coop Function
        </p>
        <select value={this.state.value} onChange={this.handleChange}>
          <option value="status">Coop Status</option>
          <option value="water">Coop Water</option>
          <option value="settings">Coop Settings</option>
          <option value="overide">Coop Override</option>
        </select>
        <hr />
        {this.state.show === true ? <div> {activeForm} </div> : <div><b>Loading Data...</b></div>}
      </div>
    );
  }
}

export default App;
