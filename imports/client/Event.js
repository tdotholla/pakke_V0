import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Event extends Component {

  render() {
    // const dateArray = this.props.event.date.split('/');
    // const monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // let monthNumber = Number(dateArray[0]);
    // let date = dateArray[1];
    // let month = monthArray[(monthNumber - 1)];

    //turn into progressbar component w/ props: 
    let count = 0;
    if (this.props.event.guests) {
      count = this.props.event.guests.length;
    }
    let weight = ((count / this.props.event.size) * 100).toFixed();
    const style2 = {
      width: `${weight}%`
    };

    let remainingTickets = this.props.event.size - count
    return (

      <div className='eventCard'>

        <Link className='event-card-link' to={`/event/${this.props.event._id}`}>


          <img className="eventCard_img" src={this.props.event.image} alt={this.props.event.byline} />
          <h4 className="eventCard_name">{this.props.event.byline}</h4>
          <p className="eventCard_loc">{this.props.event.eventAddress.city}, {this.props.event.eventAddress.zip}</p>
          <p>{this.props.event.price}$ per person | {remainingTickets} tickets remain</p>
        </Link>

        <div className="progress">
              <div className="progress-bar" role="progressbar" aria-valuenow={weight} aria-valuemin="0" aria-valuemax="100" style={style2}>
                {weight}%
              </div>
            </div>
      </div>
    )
  }
}
