import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Events from '../startup/collections/events';

class EventDetail extends Component {

  state = {
    event: {},
  }

  componentDidMount() {
    const allEvents = this.props.allEvents;
    const eventId = this.props.match.params.id;
    for (var i = 0; i < allEvents.length; i++) {
      if (allEvents[i]._id === eventId) {
        console.log(allEvents[i])
        this.setState({
          event: allEvents[i]
        });
      }
    }
  }

  attendEvent() {
    console.log('submit attendee')
    let eventId = this.state.event._id;
    let thisUser = this.props.thisUser.username;
    let thisUserId = this.props.thisUserId
		Meteor.call("attendEvent", thisUserId, eventId);
    
    Bert.alert("Your are attending this event", "success", "growl-top-right");
  }


  render() {
    return (
      <div>
        <h1>Event Name: {this.state.event.byline}</h1>
        <h2>Event Date: {this.state.event.date}</h2>
        <p>Event Description: {this.state.event.description}</p>
        <button onClick={this.attendEvent.bind(this)} className="btn btn-lg btn-success">Attend Event</button>
      </div>
    )
  }
}

export default withTracker(() => {
  let eventsSub = Meteor.subscribe('events_current');
  return {
    allEvents: Events.find({}).fetch(),
    thisUser: Meteor.user(),
    thisUserId: Meteor.userId(),
  }
})(EventDetail);

