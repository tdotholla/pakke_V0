import React, { Component } from 'react';

export default class VenueOption extends Component {
	render() {
  	return (
			<div>
        <ul>
        <li> img: {this.props.venue.image} </li>
        <li> Name: {this.props.venue.nickname} </li>
        <li> Address: {this.props.venue.city} </li>
        <input type="radio" value={this.props.venue.venueId} name={this.props.venue.nickname} />
        <label htmlFor={this.props.venue.venueId}> {this.props.venue.nickname} </label>
        </ul>
      </div>
		);
	}
}

		// venueOption = <venueOption venueId = {venueId}> 
// 		image, radio button, 