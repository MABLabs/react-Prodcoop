import React, { Component } from 'react';
import autoBind from 'react-autobind';
import axios from 'axios';
//import myData from './data.json';

class SettingsForm extends Component {

    constructor(props) {
      super(props);

      autoBind(this);

/*      this.state = 
      {
        latitude: myData.latitude,
        longitude: myData.longitude,
        dooropen: myData.dooropenOffset,
        doorclose: myData.doorcloseOffset,
        lighton: myData.lightonOffset,
        lightoff: myData.lightoffOffset,
        heaton: myData.heatOn,
        heatoff: myData.heatOff,
        fanon: myData.fanOn,
        fanoff: myData.fanOff
      };*/
      this.state = {
        latitude: 0,
        longitude: 0,
        dooropen: 0,
        doorclose: 0,
        lighton: 0,
        lightoff: 0,
        heaton: 0,
        heatoff: 0,
        fanon: 0,
        fanoff: 0
      };
}

checkValid() {
//        var sPat = /^[A-Za-z ]*$/;
//        var siPat = /^[A-Za-z0-9//]*$/;
        //var iPat = /^\d+$/;
        var iPat = /^-{0,1}\d*\.{0,1}\d+$/;

        var valid = {};
        valid.latitude     = iPat.test(this.state.latitude) ? '' : 'bad latitude - number only';
        valid.longitude    = iPat.test(this.state.longitude) ? '' : 'bad longitude - number only';
        valid.dooropen     = iPat.test(this.state.dooropen) ? '' : 'bad door open - number only';
        valid.doorclose    = iPat.test(this.state.doorclose) ? '' : 'bad door close - number only';
        valid.lighton      = iPat.test(this.state.lighton) ? '' : 'bad light on - number only';
        valid.lightoff     = iPat.test(this.state.lightoff) ? '' : 'bad light off - number only';
        valid.heaton       = iPat.test(this.state.heaton) ? '' : 'bad heat on - number only';
        valid.heatoff      = iPat.test(this.state.heatoff) ? '' : 'bad heat off - number only';
        valid.fanon        = iPat.test(this.state.fanon) ? '' : 'bad fan on - number only';
        valid.fanoff       = iPat.test(this.state.fanoff) ? '' : 'bad fan off - number only';

        return valid;
}

handleChange(event) {
      event.preventDefault();

      var stateChange = {};
      stateChange[event.target.name] = event.target.value;
      stateChange.newInfo = true;

      this.setState(stateChange);
}

saveData() {

//   const [latitude, longitude, dooropen, doorclose, lighton, lightoff, heaton, heatoff, fanon, fanoff] = [...this.state];
   const latitude  = this.state.latitude, 
         longitude = this.state.longitude, 
         dooropen  = this.state.dooropen,
         doorclose = this.state.doorclose,
         lighton   = this.state.lighton,
         lightoff  = this.state.lightoff,
         heaton    = this.state.heaton,
         heatoff   = this.state.heatoff,
         fanon     = this.state.fanon,
         fanoff    = this.state.fanoff;

//   var url = `/api/myData/${this.state.latitude}/${this.state.longitude}/${this.state.dooropenOffset}/${this.state.doorcloseOffset}/${this.state.lightonOffset}/${this.state.lightoffOffset}/${this.state.heatOn}/${this.state.heatOff}/${this.state.fanOn}/${this.state.fanOff}`;
   var url = `/api/myData/${latitude}/${longitude}/${dooropen}/${doorclose}/${lighton}/${lightoff}/${heaton}/${heatoff}/${fanon}/${fanoff}`;
   console.log('URL = ', url);

//   var instance = axios.create({
//       baseURL: 'http://localhost:8080/',
//       timeout: 1000,
//       headers: { "Access-Control-Allow-Origin": "*" }
//   });
      
   axios.get(url);
}

render() {

this.state = this.props.myData;

var red = {color: 'rgb(255,0,0)', fontSize: '1.6em'};
var valid = this.checkValid();
var vs = (name) => (valid[name].length === 0) ? <span></span>: <span style={red} title={valid[name]}>*</span>;

console.log('render state = ', this.state);

return <div>
         <h1>Coop Settings</h1>
         <div onChange={this.handleChange} >
           <div className="App-entry">
           <label>Latitude:</label> <input  size="12" name="latitude" value={this.state.latitude} /> {vs('latitude')}<br /><br />
           <label>Longitude:</label> <input  size="12" name="longitude" value={this.state.longitude} /> {vs('longitude')}<br /><br />
           <label>Door Open Offset:</label> <input  size="3" name="dooropen" value={this.state.dooropen} /> {vs('dooropen')}min
           <label>Door Close Offset:</label> <input  size="3" name="doorclose" value={this.state.doorclose} /> {vs('doorclose')}min<br /><br />
           <label>Light On Offset:</label> <input  size="3" name="lighton" value={this.state.lighton} /> {vs('lighton')}min
           <label>Light Off Offset:</label> <input  size="3" name="lightoff" value={this.state.lightoff} /> {vs('lightoff')}min<br /><br />
           <label>Heat On Temperature:</label> <input  size="3" name="heaton" value={this.state.heaton} /> {vs('heaton')}deg
           <label>Heat Off Temperature:</label> <input  size="3" name="heatoff" value={this.state.heatoff} /> {vs('heatoff')}deg<br /><br />
           <label>Fan On Temperature:</label> <input  size="3" name="fanon" value={this.state.fanon} /> {vs('fanon')}deg
           <label>Fan Off Temperature:</label> <input  size="3" name="fanoff" value={this.state.fanoff} /> {vs('fanoff')}deg<br /><br />
           </div>
         <button type="button" onClick={this.saveData}>Save and Update</button>&nbsp;
         </div>
       </div>
  }
}

export default SettingsForm;
