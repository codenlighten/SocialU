const express = require("express");
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

// Load User Model

const User = require('../../models/User');
const keys = require('../../config/keys');
/*@route GET /api/users/test*/
/*@desc Test the users route*/

/*@access Public*/

router.get("/test", (req, res) => {
  res.send("Hello yusers");
});

/*@route POST /api/users/register*/
/*@desc Register the user*/

/*@access Public*/

router.post('/register',(req, res) => {
    const {name,email,password} = req.body;
    /*First check whether the user you are trying to register is already a registered one
    In that case don't allow*/
    User.findOne({email})
    .then(user => {
      if(user){
        return res.status(400).json({message: 'Email is already in use'});
      }else{
        /*Else case create new user*/
        const avatar = gravatar.url(email,{
          s: '200', //size
          r: 'pg', //rating
          d : 'mm' //default
        });
        const newUser = new User({
            name,
            email,
            avatar,
            password
        });

        /*@desc Before storing the user to the database simple hash the password
        and then store it into the database*/
        bcrypt.genSalt(10,(err,salt)=> {
          bcrypt.hash(newUser.password,salt,(err,hash) => {
              newUser.password = hash;
              newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
          });
        });
      }
    });
});

/*@route GET /api/users/login */
/*@desc Login User/Returning JWT token*/
/*@access Public*/

router.post('/login',(req, res, next) => {
    /*Tap the email and password*/
    const {email,password} = req.body;
    /*Find user by email and match the plain text password
    with the hash that is stored in the database*/
    User.findOne({email})
    .then(user => {
        /*If no user exists pertaining to the email*/
        if(!user){
          return res.status(404).json({message : 'User does not exists!'});
        }
        /*If the user does exists as an entity in the database*/
        bcrypt.compare(password,user.password,(err,isMatch) => {
          if(err){
            return res.status(400).json({message : 'Passwords do not match'});
          }
          /*If there is a match*/
          if(isMatch){
              //User Matched
              /*Payload for the JWT*/ 
              const payload = {
                id : user.id,
                name : user.name,
                avatar : user.avatar
              }
              /*Sign the Token*/
              jwt.sign(payload,keys.secretOrKey,{
                expiresIn : 3600
              },(err,token) => {
                res.json({
                  success: true,
                  token: 'Bearer' + token
                });
              }); 
          }
        }); 
    });  
});

/*@route GET /api/users/current*/
/*@desc Return the current user*/
/*@access Private */

router.get('/current',passport.authenticate('jwt',{session: false}),(req, res) => {

  /*Get the current active user*/ 
  res.json({
    id: req.user.id,
    name : req.user.name,
    email : req.user.email
  });
});

module.exports = router;
