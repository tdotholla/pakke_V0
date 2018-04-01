import { Meteor } from 'meteor/meteor';

//check for settings file
console.log("-= Settings: Checking... =-");
if (!Meteor.settings.public.keys) {
    console.log("--------------= SETTINGS FAILED. (USE 'NPM RUN' INSTEAD OF 'METEOR' AT COMMAND LINE) =--------------");
} else {console.log ("-= Settings: Loaded =-");}

if (Meteor.users.find().count() == 0) {
  console.log("CREATING FIRST USER: SOUP");
  const soupId = Accounts.createUser({
      username: "Soup",
      email: "soup@pakke.us",
      password: "password",
      avatar: 'https://www.pakke.us/img/brand/PAKKE_circle.png',
      name: "Souper Youzer",
      firstName: "Souper",
      lastName: "Youzer"
  });

}

Meteor.users.allow({
  update: (uid, doc) => {return uid ;},
  remove: () => true,
});

const SOUP = Meteor.users.findOne({username: 'Soup'});
if ( SOUP ) {
    // console.log(SOUP);
    // Roles.addUsersToRoles( Kiel._id ,  ["admin"] );
    // Meteor.call('addRole', SOUP._id, ['admin'])
    Roles.addUsersToRoles(SOUP._id, 'admin', Roles.GLOBAL_GROUP)

    // Roles.setUserRoles( SOUP._id , 'admin');
    console.log("-= ADMIN: 'Soup' is Admin =-");
  
} else {
 console.log("-= ADMIN: No Admin =-");
}

Accounts.validateNewUser(function(user) {
    console.log('Validating...');
    const user_email = user.emails[0].address;
    let existing_user = Meteor.users.findOne({ 'services.facebook.email' : user_email}) || Meteor.users.findOne({ 'services.google.email' : user_email}) || Meteor.users.findOne({ 'emails.0.address' : user_email}) ;
    if (existing_user) {
      let socialID;
      let email = existing_user.emails[0].address;

      if (existing_user.services.facebook) {
        socialID = existing_user.services.facebook.id
        email = existing_user.services.facebook.email
      }

      if (existing_user.services.google) {
        socialID = existing_user.services.google.id
        email = existing_user.services.google.email
      }
      console.log("User Exists Already");
      throw new Meteor.Error(500, "A user already exists with e-mail: " + email);
    } else {
      console.log("New User!");
      return true;
    }
});



// // this is for handling # in verifyEmail url
// (function () {
//     "use strict";
//     Accounts.urls.resetPassword = function (token) {
//         return Meteor.absoluteUrl('reset-password/' + token);
//     };
//     Accounts.urls.verifyEmail = function (token) {
//         return Meteor.absoluteUrl('verify-email/' + token);
//     };
//     Accounts.urls.enrollAccount = function (token) {
//         return Meteor.absoluteUrl('enroll-account/' + token);
//     };

// })();