import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import { GridLoader } from 'react-spinners';

// import Event from './Event';
import Event2 from './Event2';
// import Events from '/imports/startup/collections/events';

class EventList extends Component {
  constructor(props) {
        super(props)
        this.state = {
          eventHost: {},
          soldOut: false
        }
    }
  render() {
    return (
        this.props.events.map((event) => {
          if (!this.props.ready) {
            return (
                <GridLoader 
                loading={!this.props.ready} 
                color='#226199'
                size={20}
                margin='2px' />
                )
          } else {
            return <Event2 event={event} key={event._id} />
          }
        })
      )
    }
  };


export default withTracker(() => {
  let eventsSub = Meteor.subscribe('events_all');

  return {
    ready: eventsSub.ready(),
    events: Events.find({}, {
      sort: { date: 1 }
    }).fetch()
  }
})(EventList);
