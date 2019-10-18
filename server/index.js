/*jshint esversion: 6 */
// import express
const express = require('express');
const passport = require('passport');
const SpotifyStrategy = require('passport-spotify').Strategy;
const key = require('./config/key');

const app = express();


passport.use(
  new SpotifyStrategy(
    {
      clientID: key.spotifyClientID,
      clientSecret: key.spotifyClientSecret,
      callbackURL: 'http://localhost:5000/auth/spotify/callback'
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
      User.findOrCreate({ spotifyId: profile.id }, function(err, user) {
        console.log ('accessToken');
        return done(err, user);
      });
    }
  )
);
app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private']
  }),
  function(req, res) {
  }
);
app.get(
  '/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
    showDialog: true
  }),
  function(req, res) {
    // The request will be redirected to spotify for authentication, so this
    // function will not be called.
  }
);



//https://accounts.spotify.com/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fspotify%2Fauth%2Fspotify%2Fcallback&client_id=a4cb222af76b42e485724b0e9366fc41

// app =  Express app to register this route handler
// get = Watch for incoming requests with this method
// '/' = Watch for requests trying to access'/'
// req = Object representing the incoming request
// res = Object representing the outgoing response
//   res.send({ hi: 'there'}); = Immiediately send some JSON back to who ever
// made this request


const PORT = process.env.PORT || 5000;
app.listen(PORT);
