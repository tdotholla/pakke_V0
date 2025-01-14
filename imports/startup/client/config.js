import { Accounts } from 'meteor/std:accounts-ui'
import analytics from '/lib/analytics/analytics.min.js';

Meteor.startup(() => {
    //=====  HTML Attributes for Facebook opengraph api =====
  $('html').attr({
    'xmlns': 'https://www.w3.org/1999/xhtml',
    'xmlns:fb': 'https://ogp.me/ns/fb#',
    'lang': 'en'
  });
  
  if (((location.host.indexOf('localhost:3000') !== 0)) && (location.host.indexOf('www.pakke.us') !== 0) && (location.host.indexOf('pakkestage.meteorapp.com') !== 0) ) {
    console.log('redirecting...');
      location.replace("https://www.pakke.us")
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        // console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function(err) {
        // registration failed :(
        console.warning('ServiceWorker registration failed: ', err);
      });
    });
  }
});

if (Meteor.isDevelopment) {
   analytics.debug(); 
} 

Bert.defaults = {
  hideDelay: 3500,
  // Accepts: a number in milliseconds.
  style: 'fixed-bottom',
  // Accepts: fixed-top, fixed-bottom, growl-top-left,   growl-top-right,
  // growl-bottom-left, growl-bottom-right.
  type: 'pk-info',
  // Accepts: default, success, info, warning, danger.
  icon: 'fa-info-circle'
};

Accounts.ui.config({
  requestPermissions: {
    // facebook: ["email", "user_birthday", "user_location", "user_hometown"],
    facebook: ["email", "public_profile", "user_friends"],
    google: [
    "https://www.googleapis.com/auth/userinfo.profile", 
    // "https://www.googleapis.com/auth/user.addresses.read", 
    // "https://www.googleapis.com/auth/user.birthday.read", 
    // "https://www.googleapis.com/auth/user.phonenumbers.read"
    ]
  },
  requestOfflineToken: {
    google: true
  },
  profilePath: '/profile',
  onSubmitHook: (error, state) => {
    console.log(state)
    // if (state = "Symbol(SIGN_IN)") {
    //   console.log("logging in.."); 
    //   return;
    // }
    if (Meteor.user() ) {
      // console.log(Meteor.user());
      return
    }
    if (!error) { Bert.alert("Check your inbox for a sign-in link!", 
      "pk-success", "growl-top-left", "fa-thumbs-up", )  
    } 

    if (error) {
      console.warn(error.error);
      Bert.alert(error.reason || error.split('.')[2], 
      "pk-info", "growl-top-right", "fa-exclamation-triangle")}
    // console.info("still running...")
    return 
  },
  // onPreSignUpHook: (options) => {
  //       console.info("onPreSignUpHook")

  //   // console.log(options)
  // },
  // onPostSignUpHook: (options, user) => {
  //       console.info("onPostSignUpHook")

  //   // console.log(options)
  // },
  // onSignedInHook: () => {
  //       console.info("onSignedInHook")

  //   // console.log("signedin")
  // }
});

Accounts.onLoginFailure(function(error) {
  Bert.alert(error.error.reason, "pk-info", "growl-top-right", "fa-info")
});

// Accounts.onLogin(function(loginDetails) {
//   Bert.alert("Welcome!", "pk-success", "growl-top-left")
//   console.log(loginDetails)
// });

// Accounts.onEmailVerificationLink(function(token, done){
//   Accounts.verifyEmail(token); //then logs in
//   //remove old emaila address what position is it? 
// });

// Facebook: https://developers.facebook.com/docs/authentication/permissions/
// Google: https://developers.google.com/identity/protocols/googlescopes