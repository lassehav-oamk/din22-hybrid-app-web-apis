const express = require('express');
const app = express();

app.get('/httpbasic', (req, res) => {
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

  // step 7 if both username and password match, send a 200 OK 
  // response with text 'Yay execise 1 complete!'
  res.status(200).send('Yay execise 1 complete!');
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});