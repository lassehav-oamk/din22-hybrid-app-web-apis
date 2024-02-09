const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

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

function validateJWT(req, res, next) {}

app.get('/login', httpBasicMw, (req, res) => {
  // create a JWT token
  const jsonwebtoken = jwt.sign({
    username: 'testuser'
  }, "secretkey");

  // send the JWT token in the response
  res.status(200).json({
    token: jsonwebtoken
  });
});

app.get('/jwtProtectedRoute', validateJWT, (req, res) => {
  // at this moment we are sure that the JWT is valid because the validateJWT middleware has been executed
  // now we can send the protected resource

  res.status(200).send('Hello from jwtProtectedRoute!');
});

app.get('/public', (req, res) => {
  res.status(200).send('Hello from public!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});