import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { BarLoader } from 'react-spinners';

import AutoFields  from 'uniforms-material/AutoFields';
import AutoField  from 'uniforms-material/AutoField';
import HiddenField from 'uniforms-material/HiddenField'; 
import QuickForm  from 'uniforms-material/QuickForm';
import AutoForm    from 'uniforms-material/AutoForm';
import SubmitField from 'uniforms-material/SubmitField';
import ErrorsField from 'uniforms-material/ErrorsField';

import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import Venues from '/imports/startup/collections/venues';
import AddVenueModal from './AddVenueModal.js'
import EditVenueButton from './EditVenueButton.js'; 

const styles = {
    card: {
        maxWidth: 120,
        minWidth: 100,
        margin: '1rem',
    },
    image: {
        height: 75,
    },
    content: {
      padding: 2,
    },
    typo: {
        marginTop: 5,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
      padding: 2,
      // justifyContent: 'space-between',
    },
    flexRow: {
      display:'flex', 
      flexDirection: 'row', 
      alignItems:'center', 
      alignContent:'space-between'
    },
    logo: {
        maxWidth: 75,
    },
    hidden: {
      display: 'none'
    },
    radio: {
      width: '100%',
      height: '1rem',
      paddingBottom: '.5rem'
    }
};
class VenuesFormComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: ""
    }
  }
  
  // componentDidMount = () => {
  //   console.log(this.props)
  //   if (this.props.venues) {
  //     console.log(this.props.venues)
  //     this.setState({selected: this.props.venues[0]._id})
  //   } else {
  //     console.log("nope")
  //   }
  // }
  static getDerivedStateFromProps(props, state) {
    // console.log(props)
    if (props.venues && props.venues.length) {
      if (state.selected !== props.venues[0]._id) {
      return {selected: props.venues[0]._id}
    } }
    return null
  }
  
  handleChange = event => {
    this.setState({ selected: event.target.value });
  }
  handleSubmit = doc => {
    // console.log(doc)
    Meteor.call('addEvent', doc);
    // this.props.handleClose();
    //REDIRECT TO PROFILE/HOSTING PAGE (OR EVENTS PAGE)
    //ADD URL TO /PROFILE TO CATCH WHICH TAB I WANT TO NAVIGATE TO


    const adminEmailProps = [
      "noreply@pakke.us",
      "EVENTS: EVENT CREATED",
      eventCreatedAdminTemplate(Meteor.user(), doc)
    ];

    //send admin email
    if (Meteor.isProduction) {
        Meteor.call('sendEmail', "kiel@pakke.us", ...adminEmailProps);
        let crmParams = {
          "Event Owner": Meteor.user().username,
          "Subject": doc.byline ,
          "Start DateTime" : doc.date,
          "End DateTime": doc.date + duration
        };
        Meteor.call('crmInsert', 'event', crmParams);
    } else {
        console.log (doc)
    }
  }; 

  handleSuccess(){
    Bert.alert("Your Event Was Posted!", "success");
  };

  handleFailure() {
    Bert.alert("Sorry, Something Went Wrong", "danger", "growl-top-right");
  };
  render() {
    if (this.props.loading) {
      return (
        <BarLoader 
          loading={this.props.loading} 
          color='#2964ff'
          width={-1}
          height={5}
        />
      )
    }

  	return (
      <React.Fragment>
        <AutoField name="venueId" value={this.state.selected} type="hidden" style={styles.hidden} label={false}/>
      	<div className="venuesList" >
          { (this.props.venues && this.props.venues.length) ? (
            <React.Fragment>
              <Typography variant="subheading" align="center">Select a Place for your PAKKE. </Typography>
              <div style={styles.flexRow}>
                  <AddVenueModal />
        		      {this.props.venues.map((venue) => {
                    return (
                      <Card style={styles.card} key={venue._id}>
                        <CardMedia style={styles.media} image={venue.image ? venue.image : `/img/holders/holder_venue_200.png` }>
                          {/* <EditVenueButton /> */}
                        </CardMedia> 
                        <CardContent style={styles.content}>
                          <Typography gutterBottom variant="subheading" align="center">
                            <em>"{venue.nickname}"</em>
                          </Typography>
                          <Typography component="p" variant="caption" gutterBottom>{venue.address.street}, {venue.address.zip}</Typography>
                          <Typography component="p" variant="caption" gutterBottom>{venue.type}: Holds {venue.capacity}</Typography>
                          <Radio 
                          style={styles.radio}
                          checked={this.state.selected === venue._id} 
                          onChange={this.handleChange}
                          value={venue._id}
                          name="venueId"
                          id={`vri_${venue._id}`}
                          aria-label={venue.nickname}
                          />
                        </CardContent>
                      </Card>
                      )
                    }
                  )          
                }

              </div>
            </React.Fragment>
            ) : (
            <div>
              <Typography variant="subheading" align="center">Add a new place and use it later!</Typography>
              <AddVenueModal />
            </div>
            )
          }
        </div>
      </React.Fragment>
    )
  }
}
            
export default VenuesForm = withTracker((props) => {
  let handle = Meteor.subscribe('my_venues');
  let loading = !handle.ready();
  if (!loading) {
    return {
      venues: Venues.find({ hostId: Meteor.userId() }).fetch()
    } 
  }
  return { loading }
})(VenuesFormComponent);


