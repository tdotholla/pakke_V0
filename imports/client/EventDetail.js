import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { withStyles } from '@material-ui/core/styles';
import Events from '../startup/collections/events';
import { BarLoader } from 'react-spinners';
import {Helmet} from "react-helmet";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';

import analytics from '/lib/analytics/analytics.min.js';
import Venues from '/imports/startup/collections/venues.js';
import PageError from './PageError.js';
import EventMap from './EventMap.js'
import EventGuests from './EventGuests.js'
import EventInterestModal from './forms/EventInterestModal.js'
import EventPurchaseModal from './forms/EventPurchaseModal.js'

import eventPurchasedTemplate from './email/eventPurchasedTemplate';
import eventPurchasedAdminTemplate from './email/eventPurchasedAdminTemplate';
import eventPurchasedHostTemplate from './email/eventPurchasedHostTemplate';

const styles = {
  grid: {
    flexGrow: 1,
  },
  container: {
    maxWidth: 960,
    margin: 'auto',
  },
  table: {
    fontSize: 16,
    border: 'none',
    maxWidth: '20rem'
  },
  image: {
    height: 0,
    margin: 'auto',
    paddingTop: '56.25%'
  },
  avatar: {
    width: '90px',
    height: '90px',
    margin: '.5rem auto 1rem'
  },
  cell: {
    fontSize: 14,
    paddingLeft: 'auto',
    paddingRight: 'auto'
  },
  padded: {
    padding: '0 2rem',
  },
  card: {
      // maxWidth: 240,
      minWidth: 100,
      margin: '1rem',
  },
  content: {
    padding: '2px 7px',
  },
  media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
  },
}

let intervalId = 0; 
function scrollStep() {
    // Check if we're at the top already. If so, stop scrolling by clearing the interval
    if (window.pageYOffset === 0) {
        clearInterval(intervalId);
    }
    window.scroll(0, window.pageYOffset - 50);
}
function scrollToTop() {
    // Call the function scrollStep() every 16.66 millisecons
    intervalId = setInterval(scrollStep, 16.66);
}

const loginAlert = () => {
  // scrollToTop();   
  window.scrollTo({top: 0, behavior: "smooth"});
  Bert.alert({
    message: "Please Log In First.", 
    type: "login-alert",
    style: "growl-top-left",
    icon: 'fa-sign-in'
  });
}
const waitAlert = () => Bert.alert("Please Check Your E-mail.", "fixed-bottom", "growl-top-right");

class EventDetailsComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   let eventHost, venue;
  //   if (nextProps.event) {
  //     eventHost = Meteor.users.findOne(nextProps.event.hostId)
  //     if (nextProps.event.venueId) {
  //       // venue = eventHost.profile.venues.filter((v) => (v.venueId === nextProps.event.venueId))
  //       venue = Venues.find({ events: { $in: [nextProps.event._id] } }).fetch();
  //       // console.log(venue)
  //     }
  //     return {
  //       eventHost: eventHost,
  //       venue: venue
  //     };
  //   } else return null
  // }

  componentWillmount() {
    
    //FORCE FACEBOOK API TO PARSE ALL FB_OBJECTS ON PAGE.
    FB.XFBML.parse()
  // let eventsHandle = Meteor.subscribe('event', match.params.id);
  // let event = Events.findOne( match.params.id );
  // let venueHandle = Meteor.subscribe('event.venue', match.params.id)
  // let hostHandle = Meteor.subscribe('event.host', match.params.id);
  // let userHandle = Meteor.subscribe('currentUser', Meteor.userId() );
  }
  componentWillUnmount() {
    // console.log(eventsHandle);
    // eventsHandle.stop();
    // event.stop()
    // venueHandle.stop()
    // hostHandle.stop();
    // userHandle.stop()
  }

  handleAddGuest = () => {
    const user = this.props.thisUser;
    const event = this.props.event;
    const userEmail = user.emails[0].address;
    const userEmailProps = [
      "Ticket Purchase Confirmation",
      eventPurchasedTemplate(user, event)
    ];
    
    const hostEmailProps = [
      "You've got a new guest to your upcoming PAKKE Experience!",
      eventPurchasedHostTemplate(user, event)
    ];

    const adminEmailProps = [
      `{\u0394 TICKET PURCHASE: ${event.byline} \u0394}`,
      eventPurchasedAdminTemplate(user, event)
    ];

    Bert.alert(`Yay! Check your inbox [${userEmail}] for more info!`, "pk-success");
    Meteor.call('amConfirmed', event._id);
    if (Meteor.isProduction) {
      //EMAIL TO VISITOR
      Meteor.call('sendEmail', userEmail, ...userEmailProps);
      //EMAIL TO HOST
      // let hostEmail = Meteor.users.findOne(event.hostId).emails[0].address;
      // Meteor.call('sendEmail', hostEmail, ...hostEmailProps);
      //EMAIL TO ADMIN
      Meteor.call('sendEmail', "info@pakke.us", ...adminEmailProps);
      analytics.track("New Attendee", {
        category: "Events",
        label: event.byline,
        value: event.price,
        commerce: event.price,
        host: event.hostId,
      })
    } else {
      // console.log(token);
      console.log('emails wouldve been sent if not for development')
    }
  }
  render() {
    if (this.props.loading) {
      return (
        <div>
          <BarLoader 
              loading={this.props.loading} 
              color='#2964ff'
              width={-1}
              height={10}
            />
        </div>
      )
    }

    if (!this.props.event) {
      return <PageError />
    }

    const datefns = new DateFnsUtils();
    const { classes } = this.props;
    const one_day=1000*60*60*24;
    let eventDate = this.props.event.date;
    // const realEventDate = new Date((this.props.event.date * 1) + ((new Date().getTimezoneOffset())*60*1000))
    // const realEventDate = this.props.event.date;eventDate

    // console.log(this.props.event.date, realEventDate);
    // const isExpired = (((realEventDate.getTime() - Date.now())/one_day) <= -1) //EVENT DATE IS YESTERDAY (ALLOW TO BUY UP TO DAY AFTER)
    const isExpired = (eventDate.getTime() < Date.now()) //EVENT DATE & Time is a milLisecond BEFORE CURRENT TIME (ALLOW TO BUY UP TO EVENT TIME)
    const isTBD = (((eventDate.getTime() - Date.now())/one_day) > 364) //DATE IS A YEAR AHEAD 
    const isSoldOut = (this.props.event.confirmedList.length >= this.props.event.size);
    // console.log(this.props)
    return (
      <React.Fragment>
        <Helmet>
          <title>PAKKE Event: {this.props.event.byline}</title>
          <meta http-equiv="CACHE-CONTROL" content="NO-CACHE" />  
          <meta http-equiv="PRAGMA" content="NO-CACHE" /> 
          <meta name="description" content={this.props.event.description}/>
          <meta name="keywords" content={`${this.props.event.description}`}/>
          <meta property="og:title" content={this.props.event.byline} />
          <meta property="og:image" content={this.props.event.image} />
          <meta property="og:image:secure_url" content={this.props.event.image} />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="529" />
          <meta property="og:image:height" content="529" />
          <meta property="og:image:alt" content={this.props.event.byline} />
          <meta property="og:url" content={`https://www.pakke.us/event/${this.props.event._id}`} />
          <meta property="og:description" content={this.props.event.description}/>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={this.props.event.byline} />
          <meta name="twitter:description" content={this.props.event.description} />
          <meta name="twitter:url" content={`https://www.pakke.us/event/${this.props.event._id}`}  />
          <meta name="twitter:image" content={this.props.event.image} />
        </Helmet>
        <Card className={classes.container}>
          <CardMedia image={this.props.event.image ? this.props.event.image : `""`} title='Event Preview' className={classes.image} />
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom >{this.props.event.byline}</Typography>
            <Typography dangerouslySetInnerHTML={{__html: this.props.event.description}} style={styles.padded}/>
            {/* 
            <div className="fb-share-button" id="fb-share-btn" 
              data-href={`https://www.pakke.us/event/${this.props.event._id}`} 
              data-layout="button_count"
              data-size="large" 
              data-mobile-iframe="true"
              style={{margin: '1rem auto'}}>
              <a target="_blank" href={`https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.pakke.us%2Fevent%2F${this.props.event._id}&amp;src=sdkpreparse`} className="fb-xfbml-parse-ignore">Share</a>
            </div>
            */}
              <div className="fb-like"
                data-href={`https://www.pakke.us/event/${this.props.event._id}`} 
                data-layout="button_count" 
                data-action="recommend" 
                data-size="small" 
                data-show-faces="true" 
                data-share="true"
                ></div>
            <Grid 
            container
            alignItems="center"
            direction="row"
            justify="center"
            >

              <Grid item xs={12} sm={5}>
                {this.props.eventHost ? (
                  <Paper elevation={0}>
                    <Grid container direction="column" item alignItems="center">
                      <Grid item ><Typography variant="h5" align="center">Your Host:</Typography></Grid>
                      <Grid item ><Avatar style={styles.avatar} src={this.props.eventHost.profile.avatar} /></Grid>
                      <Grid item ><Typography variant="h6" align="center">{this.props.eventHost.profile.name}</Typography></Grid>
                    </Grid>
                  </Paper> 
                  ) : ( '' )
                }
              </Grid>
              <Grid item xs={12} sm={5}>
              {this.props.event.partner ? (
                <div> 
                  <Button href={this.props.event.partnerLink} target="_blank" className="btn btn-info btn-lg"> Ticket Info </Button>
               </div>
                ) : (
                <div>
                  <Table>
                    <TableBody className={classes.table}>
                      <TableRow>
                        <TableCell className={classes.cell}><h5>WHEN:</h5> </TableCell>
                        <TableCell align="right" className={classes.cell}>
                        {`${datefns.format(eventDate, 'EEEE MMM do @ h:mmaaaaa')}`}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.cell}><h5>PRICE:</h5> </TableCell>
                        <TableCell  align="right" className={classes.cell}>${this.props.event.price}</TableCell>
                      </TableRow>
                        {this.props.thisUser && this.props.event.confirmedList.includes(this.props.thisUser._id) ? (
                        <TableRow>
                          <TableCell className={classes.cell}><h5>WHERE:</h5> </TableCell>
                          <TableCell  align="right" className={classes.cell}>{this.props.venue ? <a target="_blank" rel="noopener"  href={`https://www.google.com/maps/dir/Current+Location/${this.props.venue.address}`} title={`Directions to ${this.props.venue.address}`} >"<em>{this.props.venue.nickname}</em>"</a> : 'TBD' }</TableCell> 
                        </TableRow>
                        ):(null)}
                    </TableBody>
                  </Table>
                  { //BUTTONS ARE OF TYPE: BUY, GET INFO, HIDDEN (ALREADY BOUGHT), SOLD OUT, 
                  //LOGGED IN? 
                    this.props.thisUser ? (
                      //OLD EVENT && HAS A VENUE? 
                      isExpired && this.props.venue ? (
                        <React.Fragment>
                            {/*  
                            //HAD A DISABLED BUTTON, BAD UI PATTERN. 
                            <Button disabled={true} fullWidth={true} variant="outlined" color="secondary">Sold ou!</Button> 
                            //YOU ATTENDED THE EVENT, SO WHAT DO I SHOW YOU AFTERWORDS?
                            //PICTURE GALLERY, COMMENTS, RATINGS, ETC...
                            //VENUECARD INSTEAD, WHICH LEADS TO BOOKING THE VENUE AGAIN.
                            */}
                          <Typography variant="h6" align="center">
                            VENUE:
                          </Typography>
                          <Card style={styles.card} >
                            <CardMedia style={styles.media} image={this.props.venue.image ? this.props.venue.image : `/img/holders/holder_venue_200.png` }>
                              {/* <EditVenueButton /> */}
                            </CardMedia> 
                            <CardContent style={styles.content}>
                              <Typography gutterBottom variant="subtitle1" align="center">
                                <em>"{this.props.venue.nickname}"</em>
                              </Typography>
                              <Typography component="p" variant="caption" gutterBottom>{this.props.venue.address}</Typography>
                              <Typography component="p" variant="caption" gutterBottom>{this.props.venue.type}: Holds {this.props.venue.capacity}</Typography>
                            </CardContent>
                            <CardActions >
                              <Button align="center">Book Venue</Button>
                            </CardActions>
                          </Card>
                        </React.Fragment>
                      ) : this.props.event.confirmedList.includes(this.props.thisUser._id) ? (
                      //USER HAS PURCHASD A TICKET: BELLS & WHISTLES
                      //GET DATE, GET MAP, DISABLE BUTTON, SHOW AS PURCHASED, OUTLINE?
                        <React.Fragment>
                          {/*
                          <TableRow>
                            <TableCell className={classes.cell}><h5>WHERE:</h5> </TableCell>
                            <TableCell  align="right" className={classes.cell}>Nowhere</TableCell> 
                          </TableRow>
                          */}
                          <Paper>
                            <EventMap venueId={this.props.event.venueId} event={this.props.event} />
                          </Paper>
                          <Button disabled={true} fullWidth={true} variant="outlined">Attending!</Button>
                        </React.Fragment>
                      ) : this.props.event.invitedList.includes(this.props.thisUser._id) ? ( 
                      //IF YOU'VE BEEN INVITED, PLEASE BUY A TICKET
                        <EventPurchaseModal  user = {this.props.thisUser} event = {this.props.event}/>
                      ) : this.props.event.appliedList.includes(this.props.thisUser._id) ? (
                      //YOU'VE APPLIED FOR THE PARTY, CHECK EMAIL AND WAIT TO GET ADDED TO INVITED LIST
                        <Button onClick={waitAlert} fullWidth={true}>Applied!</Button>
                      ) : isSoldOut ? (
                        <Button disabled={true} fullWidth={true} variant="outlined" color="secondary">Sold Out!</Button>                         
                      ) : this.props.event.isPrivate ? (
                      //IF THERE IS A WAITING LIST: (private), PLEASE APPLY FOR A TICKET.
                        <EventInterestModal user = {this.props.thisUser} event = {this.props.event}/>
                      ) : this.props.event.price == 0 ? (
                      // IF PRICE IS 0 , DONATE? AND ADD TO TO LIST FOR PARTY.
                        <Button onClick={() => {this.handleAddGuest()}} fullWidth={true} >Join Guestlist</Button> 
                      ) : ( 
                      //OTHERWISE, OPEN PARTY, BUY A TICKET
                        <EventPurchaseModal user = {this.props.thisUser} event = {this.props.event}/>
                      ) 
                    ) : (
                    // OTHERWISE, JUST LANDED, LOG IN TO BUY A TICKET.
                    <Button onClick={loginAlert} fullWidth={true} >Buy Ticket</Button> 
                    )
                  }
                    
                  </div>
                  
              )}
              </Grid>
            </Grid>
            {(this.props.event.hostId == Meteor.userId()) || Roles.userIsInRole(Meteor.userId(), ["admin"]) ? (
            <div>
              <EventGuests event={this.props.event} guests={this.props.guests}/>
            </div>
            ) : '' }
          </CardContent>
        </Card>
      </React.Fragment>
    )
  }
}

export default EventDetails = withTracker(({ match }) => {
  let eventHandle = Meteor.subscribe('event', match.params.id);
  let event = Events.findOne( match.params.id );
  // let venueHandle = Meteor.subscribe('event.venue', match.params.id)
  let userHandle = Meteor.subscribe('currentUser', Meteor.userId() );
  let loading = !eventHandle.ready() && !userHandle.ready()
  let venue, eventHost, guests;
  if ( event ) {
    let hostHandle = Meteor.subscribe('users.event_host', match.params.id);
    let guestsHandle = Meteor.subscribe('users.confirmedList', event.confirmedList );
    let venueHandle = Meteor.subscribe('venue', event.venueId);
    venue = Venues.findOne(event.venueId);
    eventHost = Meteor.users.find({_id: event.hostId}).fetch()[0];
    guests = Meteor.users.find({ _id: { $in: event.confirmedList } } ).fetch();
  }
   
  return {
    loading,
    event,
    venue,
    eventHost,
    guests,
    thisUser: Meteor.users.findOne(Meteor.userId())
  }
})(withStyles(styles)(EventDetailsComponent));


