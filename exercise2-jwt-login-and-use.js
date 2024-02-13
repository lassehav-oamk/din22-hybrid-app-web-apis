const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

app.use(express.json()) // for parsing application/json

const SUPERSECRETKEYWHICHSHOULDNOTBEINTHECODE = 'secretkey';
const userArray = [];

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SUPERSECRETKEYWHICHSHOULDNOTBEINTHECODE
};

passport.use(new JwtStrategy(jwtOptions, function(jwt_payload, done) { 
  // here I can do whatever I want with the payload
  // the token is valid at this point
  console.log('Yay, token is valid, but we still can do something before passing the control to the route handler');
  console.log('This is the payload: ', jwt_payload);
  // when you are ready, call the done function with the payload as argument

  // for example, find the user information from the database
  // and pass it to the route handler
  const userInformationExample = {
    email: 'example@example.com',
    username: 'example',
    address: 'example street 123',
    id: 123
  }
  done(null, userInformationExample);
}));

function httpBasicMw(req, res, next) {
  // step 1 check if the request has an Authorization header
  const authHeader = req.get('Authorization');
  if(authHeader === undefined) {
    res.status(401).send('You are not authorized to access this resource');
    return;
  }

  // step 2 check if the Authorization header value starts with 'Basic '
  if(!authHeader.startsWith('Basic ')) {
    res.status(401).send('You are not authorized to access this resource');
    return;
  }

  // step 3 decode the base64 encoded string
  // We need to split the string for example "Basic dlfjlkglkdsfsdkjglkdsg"
  const splittedAuthHeader = authHeader.split(' ');
  if(splittedAuthHeader.length !== 2) {
    res.status(401).send('You are not authorized to access this resource');
    return;
  }

  console.log(splittedAuthHeader);
  const base64encodedUsernamePassword = splittedAuthHeader[1];

  const decodedString = Buffer.from(base64encodedUsernamePassword, 'base64').toString('utf-8');
  console.log(decodedString);

  // step 4 split the decoded string into two parts
  const usernamePassword = decodedString.split(':');
  const username = usernamePassword[0];
  const password = usernamePassword[1]; 

  console.log("username: " + username + ", password: " + password);

  // step 5 check if username matches hardcoded username: testuser
  if(username !== 'testuser') {
    res.status(401).send('You are not authorized to access this resource');
    return;
  }

  // step 6 check if password matches hardcoded password: testpassword
  if(password !== 'testpassword') {
    res.status(401).send('You are not authorized to access this resource');
    return;
  }

  next();
}

function validateJWT(req, res, next) {
  const authHeader = req.get('Authorization');
  console.log(authHeader);

  next();
}

/* 
  {
    "username": "testuser",
    "password": "testpassword",
    "email": "blah@example.com"
  }
*/
app.post('/register', (req, res) => {
  // read the username, password and email from the request body
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  // take the password and create a hash from it

  // store the hash into the "database", do not store the plain text password

  // create and store user in the 'database', but our database is just an array
  userArray.push({
    username: username,
    password: password,
    email: email
  });
});

app.get('/login', httpBasicMw, (req, res) => {
  // create a JWT token
  const jsonwebtoken = jwt.sign({
    userId: 123, 
    userAccessLevel: 'admin'
  }, SUPERSECRETKEYWHICHSHOULDNOTBEINTHECODE);

  // send the JWT token in the response
  res.status(200).json({
    token: jsonwebtoken
  });
});

app.get('/jwtProtectedRoute',
         passport.authenticate('jwt', { session: false }),
         (req, res) => {
  // at this moment we are sure that the JWT is valid because the validateJWT middleware has been executed
  // now we can send the protected resource
  console.log('Protected resource has been accessed');

  // the user information is available in req.user
  console.log('User information: ', req.user);

  res.status(200).send('Hello from jwtProtectedRoute!');
});

app.get('/public', (req, res) => {
  res.status(200).send('Hello from public!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});