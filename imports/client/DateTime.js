import React from 'react';
import {Helmet} from "react-helmet";

import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
// import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import { InlineDateTimePicker } from 'material-ui-pickers/DateTimePicker';
import HiddenField from 'uniforms-material/HiddenField'; 
import AutoField  from 'uniforms-material/AutoField';

export default class DateTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: this.props.value || null,
    }
  }

  handleDateChange = date => {
    // console.log(date)
    this.setState({ selectedDate: date });
  }

  render() {
    return (
    <React.Fragment>
      <Helmet>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <HiddenField name="date" value={this.state.selectedDate} />
          <DateTimePicker style={{width:'100%'}}
            value={this.state.selectedDate}
            label="Select a date"
            openTo="date"
            disablePast
            autoOk
            autoSubmit
            showTodayButton
            onChange={this.handleDateChange}
          />
      </MuiPickersUtilsProvider>
    </React.Fragment>
    );
  }
}
