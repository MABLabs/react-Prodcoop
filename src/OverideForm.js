import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Switch from 'react-flexible-switch';
import axios from 'axios';

class OverideForm extends Component {
    constructor(props) {
      super(props);

      this.state = {
          override: false,
          light:    false, 
          door:     false,
          heat:     false,
          fan:      false,
          value:    false
      }

      autoBind(this);

      this.state = {
        prop: 0
      };

}

checkValid() {
//        var sPat = /^[A-Za-z ]*$/;
//        var siPat = /^[A-Za-z0-9//]*$/;
//        var iPat = /^\d+$/;

        var valid = {};
//            valid.experiment     = iPat.test(this.state.experiment) ? '' : 'bad experiment - number only';
//            valid.btest       = iPat.test(this.state.btest) ? '' : 'bad test - number only';
//            valid.bfirst       = iPat.test(this.state.bfirst) ? '' : 'bad first cage - number only';
//            valid.blast       = iPat.test(this.state.blast) ? '' : 'bad last cage - number only';
//            valid.piname =  sPat.test(this.state.piname) ? '' : 'bad PI name - no numbers allowed';
//            valid.piext     = iPat.test(this.state.piext) ? '' : 'bad PI extension - number only';
//            valid.scode      = siPat.test(this.state.scode) ? '' : 'bad strain code - no spaces allowed';

        return valid;
}

componentDidMount() {

axios.get('/api/current_status/')
.then((response) => {
  this.setState({'override': response.data.over})
  this.setState({'light': response.data.light})
  this.setState({'door': response.data.door})
  this.setState({'heat': response.data.heat})
  this.setState({'fan': response.data.fan})
  })
 .catch((error)   => { console.log(error.message); });
}

handleChange(event) {
      event.preventDefault();

      var stateChange = {};
      stateChange[event.target.name] = event.target.value;
      stateChange.newInfo = true;

      this.setState(stateChange);
}

sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

overrideChange (active) {
  var url = ""
  if (active) {
     this.setState({override: true});
     console.log("Override On");
     url = `/api/override_on/`;
  } else {
     this.setState({override: false});
     url = `/api/override_off/`;
     console.log("Override Off");
  }

  axios.get(url);
  this.setState({ value: active });
}

lightsChange (active) {
  var url = ""
  if (active) {
     this.setState({light: true});
     console.log("Lights On");
     url = `/api/lights_on/`;
  } else {
     this.setState({light: false});
     url = `/api/lights_off/`;
     console.log("Lights Off");
  }

  axios.get(url);
  this.setState({ value: active })
}

doorChange (active) {

   this.doorOn();
   setTimeout(function() {this.doorOff();}.bind(this), 30000);

  this.setState({ value: active })
}

doorOn () {
  var url = ""

     url = `/api/door_on/`;
     axios.get(url);
     console.log("Door On");

}

doorOff () {
  var url = ""

     url = `/api/door_off/`;
     axios.get(url);
     console.log("Door Off");

}

heatChange (active) {
  var url = ""
  if (active) {
     this.setState({heat: true});
     console.log("Heat On");
     url = `/api/heat_on/`;
  } else {
     this.setState({heat: false});
     url = `/api/heat_off/`;
     console.log("heat Off");
  }

  axios.get(url);
  this.setState({ value: active })
}

fanChange (active) {
  var url = ""
  if (active) {
     this.setState({fan: true});
     console.log("Fan On");
     url = `/api/fan_on/`;
  } else {
     this.setState({fan: false});
     url = `/api/fan_off/`;
     console.log("Fan Off");
  }

  axios.get(url);
  this.setState({ value: active })
}

render() {

var red = {color: 'rgb(255,0,0)', fontSize: '1.6em'};
var valid = this.checkValid();
var vs = (name) => (valid[name].length === 0) ? <span></span>: <span style={red} title={valid[name]}>*</span>;

return <div>
         <h1>Coop Override</h1>
{/*         <div onChange={this.handleChange} > */}
           <div className="App-entry">
             <b>Override Lock</b><Switch value={this.state.override} circleStyles={{ onColor: 'green', offColor: 'grey'}} onChange={this.overrideChange} labels={{ on: 'On', off: 'Off' }} /><br />
             <b>Activate Light</b><Switch value={this.state.light} circleStyles={{ onColor: 'green', offColor: 'grey'}} onChange={this.lightsChange} labels={{ on: 'On', off: 'Off' }} /><br />
             <b>Activate Door</b><Switch circleStyles={{ onColor: 'green', offColor: 'blue'}} onChange={this.doorChange} labels={{ on: 'Init', off: 'Init' }} /><br />
             <b>Activate Heat</b><Switch value={this.state.heat} circleStyles={{ onColor: 'green', offColor: 'grey'}} onChange={this.heatChange} labels={{ on: 'On', off: 'Off' }} /><br />
             <b>Activate Fan</b><Switch value={this.state.fan} circleStyles={{ onColor: 'green', offColor: 'grey'}} onChange={this.fanChange} labels={{ on: 'On', off: 'Off' }} /><br />
           <hr />
           </div>
{/*         </div> */}
       </div>
  }
}

export default OverideForm;
