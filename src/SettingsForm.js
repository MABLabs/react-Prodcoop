import React, { Component } from 'react';
import autoBind from 'react-autobind';
import axios from 'axios';
//import myData from './data.json';

class SettingsForm extends Component {

    constructor(props) {
      super(props);

      autoBind(this);

       this.state = this.props.myData;
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
      };
      this.state = {
        latitude: 0,
        longitude: 0,
        dooropenOffset: 0,
        doorcloseOffset: 0,
        lightonOffset: 0,
        lightoffOffset: 0,
        heatOn: 0,
        heatOff: 0,
        fanOn: 0,
        fanOff: 0
      };*/
}
/*
componentDidMount() {
  this.state = this.props.myData;
}
*/
checkValid() {
//        var sPat = /^[A-Za-z ]*$/;
//        var siPat = /^[A-Za-z0-9//]*$/;
        //var iPat = /^\d+$/;
        var iPat = /^-{0,1}\d*\.{0,1}\d+$/;

        var valid = {};
        valid.latitude     = iPat.test(this.state.latitude) ? '' : 'bad latitude - number only';
        valid.longitude    = iPat.test(this.state.longitude) ? '' : 'bad longitude - number only';
        valid.dooropen     = iPat.test(this.state.dooropenOffset) ? '' : 'bad door open - number only';
        valid.doorclose    = iPat.test(this.state.doorcloseOffset) ? '' : 'bad door close - number only';
        valid.lighton      = iPat.test(this.state.lightonOffset) ? '' : 'bad light on - number only';
        valid.lightoff     = iPat.test(this.state.lightoffOffset) ? '' : 'bad light off - number only';
        valid.heaton       = iPat.test(this.state.heatOn) ? '' : 'bad heat on - number only';
        valid.heatoff      = iPat.test(this.state.heatOff) ? '' : 'bad heat off - number only';
        valid.fanon        = iPat.test(this.state.fanOn) ? '' : 'bad fan on - number only';
        valid.fanoff       = iPat.test(this.state.fanOff) ? '' : 'bad fan off - number only';

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
         dooropen  = this.state.dooropenOffset,
         doorclose = this.state.doorcloseOffset,
         lighton   = this.state.lightonOffset,
         lightoff  = this.state.lightoffOffset,
         heaton    = this.state.heatOn,
         heatoff   = this.state.heatOff,
         fanon     = this.state.fanOn,
         fanoff    = this.state.fanOff;

//   var url = `/api/myData/${this.state.latitude}/${this.state.longitude}/${this.state.dooropenOffset}/${this.state.doorcloseOffset}/${this.state.lightonOffset}/${this.state.lightoffOffset}/${this.state.heatOn}/${this.state.heatOff}/${this.state.fanOn}/${this.state.fanOff}`;
   var url = `/api/myData/${latitude}/${longitude}/${dooropen}/${doorclose}/${lighton}/${lightoff}/${heaton}/${heatoff}/${fanon}/${fanoff}`;
   console.log('URL = ', url);

//   var instance = axios.create({
//       baseURL: 'http://localhost:8080/',
//       timeout: 1000,
//       headers: { "Access-Control-Allow-Origin": "*" } 
//   });
      
   axios.get(url);

   //Update props for sibling
   this.props.myData.latitude = parseFloat(this.state.latitude);
   this.props.myData.longitude = parseIFloat(this.state.longitude);
   this.props.myData.dooropenOffset = parseInt(this.state.dooropenOffset);
   this.props.myData.doorcloseOffset = parseInt(this.state.doorcloseOffset);
   this.props.myData.lightonOffset = parseInt(this.state.lightonOffset);
   this.props.myData.lightoffOffset = parseInt(this.state.lightoffOffset);
   this.props.myData.heatOn = parseInt(this.state.heatOn);
   this.props.myData.heatOff = parseInt(this.state.heatOff);
   this.props.myData.fanOn = parseInt(this.state.fanOn);
   this.props.myData.fanOff = parseInt(this.state.fanOff);
   //console.log('Props = ', this.props.myData);
}

render() {

var red = {color: 'rgb(255,0,0)', fontSize: '1.6em'};
var valid = this.checkValid();
var vs = (name) => (valid[name].length === 0) ? <span></span>: <span style={red} title={valid[name]}>*</span>;

//console.log('render state = ', this.state);

return <div>
         <h1>Coop Settings</h1>
         <div onChange={this.handleChange} >
           <div className="App-entry">
           <label>Latitude:</label> <input  size="12" name="latitude" value={this.state.latitude} /> {vs('latitude')}<br /><br />
           <label>Longitude:</label> <input  size="12" name="longitude" value={this.state.longitude} /> {vs('longitude')}<br /><br />
           <label>Door Open Offset:</label> <input  size="3" name="dooropenOffset" value={this.state.dooropenOffset} /> {vs('dooropen')}min
           <label>Door Close Offset:</label> <input  size="3" name="doorcloseOffset" value={this.state.doorcloseOffset} /> {vs('doorclose')}min<br /><br />
           <label>Light On Offset:</label> <input  size="3" name="lightonOffset" value={this.state.lightonOffset} /> {vs('lighton')}min
           <label>Light Off Offset:</label> <input  size="3" name="lightoffOffset" value={this.state.lightoffOffset} /> {vs('lightoff')}min<br /><br />
           <label>Heat On Temperature:</label> <input  size="3" name="heatOn" value={this.state.heatOn} /> {vs('heaton')}deg
           <label>Heat Off Temperature:</label> <input  size="3" name="heatOff" value={this.state.heatOff} /> {vs('heatoff')}deg<br /><br />
           <label>Fan On Temperature:</label> <input  size="3" name="fanOn" value={this.state.fanOn} /> {vs('fanon')}deg
           <label>Fan Off Temperature:</label> <input  size="3" name="fanOff" value={this.state.fanOff} /> {vs('fanoff')}deg<br /><br />
           </div>
         <button type="button" onClick={this.saveData}>Save and Update</button>&nbsp;
         </div>
       </div>
  }
}

export default SettingsForm;
