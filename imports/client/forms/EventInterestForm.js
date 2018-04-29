import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import AutoFields  from 'uniforms-bootstrap3/AutoFields';
import AutoForm    from 'uniforms-bootstrap3/AutoForm';
import SubmitField from 'uniforms-bootstrap3/SubmitField';
import TextField   from 'uniforms-bootstrap3/TextField';
import ErrorsField from 'uniforms-bootstrap3/ErrorsField';

import '../../startup/collections/schemas';

// This will render an automatic, validated form, with labelled fields, inline
// validation and a submit button. If model will be present, form will be filled
// with appropriate values.



// const omitFields = ["submitted","guests", "guestCount", "hostId", "venueId", "eventAddress.address", "eventAddress.coords"];

export default class EventInterestForm extends Component {

  render() {
    const user = this.props.user;
    const eventId = this.props.eventId;
    const handleSubmit = function(doc) {
      
        // Meteor.call('addInterests', doc);
        // add to events.guests.applied(userId)
        Meteor.call('amApplied', eventId, user._id);
        $('#eventInterestsModal').modal('toggle');
    }; 

    const handleSuccess = () => {
        Bert.alert("Thank you for Applying!", "success");
    };

    const handleFailure = () => {
        Bert.alert("Sorry, Something Went Wrong", "danger", "growl-top-right");
    };

    console.log(this);
    const model = user.profile.interests;
    const allKeys = Schema.Interests._schemaKeys;
    const answeredKeys = Object.keys(model);
    const fields = _.sample(_.difference(allKeys, answeredKeys), 3);
    // const model = this.props.user.profile.interests || {};
    // let omitFields = (_.pluck(model, (value,key,object) => value = '')))
    
  //get fields with empty values
  //get sample of 3 fields

    

    return (
      <AutoForm  
      schema={Schema.Interests} 
      model={model} 
      onSubmit={handleSubmit} 
      onSubmitSuccess={handleSuccess} 
      onSubmitFailure={handleFailure} >

          <AutoFields fields = {fields} />
          <SubmitField value="Submit"  />
          <ErrorsField />
      </AutoForm>
    );
  }
}
