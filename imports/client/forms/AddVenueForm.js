import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AutoFields  from 'uniforms-material/AutoFields';
import AutoForm    from 'uniforms-material/AutoForm';
import SubmitField from 'uniforms-material/SubmitField';
import TextField   from 'uniforms-material/TextField';
import ErrorsField from 'uniforms-material/ErrorsField';

import '../../startup/collections/schemas';

const styles = theme => ({

})
// This will render an automatic, validated form, with labelled fields, inline
// validation and a submit button. If model will be present, form will be filled
// with appropriate values.
class AddVenueForm extends Component {
  constructor(props) {
    super(props);
    this.formRef = null;
  }


  handleSubmit(doc) {
      Meteor.call('addVenue', doc);
  }; 

  handleSuccess() {
      Bert.alert("Your Profile Was Updated!", "success");
      $('#hostProfileModal').modal('toggle');

  };

  handleFailure() {
      Bert.alert("Sorry, Something Went Wrong", "danger", "growl-top-right");
  };
  render() {
    const { classes } = this.props;

    const model = Schema.Venue.clean({});
    const omitFields = ["venueId", "hostId"];
    //ALLOWS FOR DEFAULT VALUES TO GET PULLED INTO FORM VALUES FOR VALIDATION/SUBMISSION. 
    //WITHOUT THIS, AUTOVALUES/DEFAULTVALUES ARE EMPTY WHEN FORM IS SUBMITTED!!!
    return (
        // <AutoForm schema={Schema.Event} onSubmit={doc => handleSubmit(doc)} model={model} onSubmitSuccess={() => console.log('Promise resolved!')}
        // onSubmitFailure={() => console.log('Promise rejected!')}/>
      <AutoForm  
      schema={Schema.Venue} 
      onSubmit={this.handleSubmit} 
      model={model}
      onSubmitSuccess={this.handleSuccess} 
      onSubmitFailure={this.handleFailure} 
      >

        <AutoFields omitFields={omitFields}/>
        <SubmitField value="Submit"  />
        <ErrorsField />
      </AutoForm>
    );

  }
}
export default withStyles(styles)(AddVenueForm);
