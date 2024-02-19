const express = require('express');
const app = express();
const Ajv = require('ajv');
const ajv = new Ajv();

const requestBodySchema = require('./schemas/requestBodySchema.json');

// add body parsing
app.use(express.json());



function validateRegistrationBody(req, res, next) {
  // step 1 check if the request has a body
  const body = req.body;
  if(body === undefined) {
    res.status(400).send('Request body is missing');
    return;
  }

  // step 2 use AJV to validate the request body
  const validate = ajv.compile(requestBodySchema);
  const valid = validate(body);

  // step 3 if the request body is invalid, send a 400 response with the errors
  if(!valid) {
    res.status(400).send(validate.errors);
    return;
  }

  // step 4 if the request body is valid, call next()
  next();
};

/*
  Request body:
  {
    username: "foobar",
    email: "test@some.com",
    password: "12345678"
  };
*/
app.post('/register', validateRegistrationBody, (req, res) => {
  res.send('User ' + req.body.username + ' registered successfully');
})

app.listen(3000, () => console.log('Server running on port 3000'));