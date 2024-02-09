const express = require('express');
const app = express();
const port = 3000;

app.use(express.json()) // for parsing application/json

/* Route handlers for
  GET /helloworld
  POST /helloworld accept some data in the request, print it to console

  GET /countries
  GET /countries/:country
*/

function thisIsAMiddleware(req, res, next) {
  console.log('This is a middleware');
  res.status(401).send('You are not authorized to access this resource');
  next();
}

app.get('/helloworld', thisIsAMiddleware, (req, res) => {
  console.log('GET /helloworld');
  

  res.send('Hello, World!');
});

app.post('/helloworld', (req, res) => {
  console.log('POST /helloworld');
  console.log(req.body);

  res.send('Hello, World!');
});

app.get('/countries', (req, res) => {
  console.log('GET /countries');

  const countryData = [
    { name: 'USA', capital: 'Washington, D.C.' },
    { name: 'Canada', capital: 'Ottawa' },
    { name: 'Mexico', capital: 'Mexico City' },
    { name: 'Brazil', capital: 'Brasília' },
    { name: 'Argentina', capital: 'Buenos Aires' },
    { name: 'Chile', capital: 'Santiago' },
  ];

  res.send(countryData);

});

app.get('/countries/:country', (req, res) => {
  console.log('GET /countries/:country');
  console.log(req.params);

  res.send(`You requested data for ${req.params.country}`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})