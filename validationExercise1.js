const exampleSchema ={
  "$schema": "http://json-schema.org/draft-07/schema",
  "$id": "http://example.com/example.json",
  "title": "Root Schema",
  "type": "object",
  "default": {},
  "required": [
      "username",
      "email",
      "password"
  ],
  "properties": {
      "username": {
          "title": "The username Schema",
          "type": "string",
          "default": "",
          "examples": [
              "foobar"
          ]
      },
      "email": {
          "title": "The email Schema",
          "type": "string",
          "default": "",
          "format": "email",
          "examples": [
              "some@email.com"
          ]
      },
      "password": {
          "title": "The password Schema",
          "type": "string",
          "default": "",
          "examples": [
              "12345678"
          ]
      }
  },
  "examples": [{
      "username": "foobar",
      "email": "some@email.com",
      "password": "12345678"
  }]
}

const Ajv = require("ajv");
const ajv = new Ajv();

const validate = ajv.compile(exampleSchema);

const exercise1TestData = {
  username: "foobar",
  email: "test@some.com",
  password: "12345678"
};

const valid = validate(exercise1TestData);
console.log(valid);
if (!valid) console.log(validate.errors);