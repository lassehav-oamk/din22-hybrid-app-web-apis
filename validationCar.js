const Ajv = require("ajv");
const ajv = new Ajv()

const schema = 
  {
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "title": "Root Schema",
    "type": "object",
    "default": {},
    "required": [
        "carType",
        "numberOfDoors",
        "manufacturer",
        "engineType"
    ],
    "properties": {
        "carType": {
            "title": "The carType Schema",
            "type": "string",
            "default": "",
            "examples": [
                "sedan"
            ]
        },
        "numberOfDoors": {
            "title": "The numberOfDoors Schema",
            "type": "integer",
            "default": 0,
            "examples": [
                4
            ]
        },
        "manufacturer": {
            "title": "The manufacturer Schema",
            "type": "string",
            "default": "",
            "examples": [
                "BMW"
            ]
        },
        "engineType": {
            "title": "The engineType Schema",
            "type": "string",
            "default": "",
            "examples": [
                "gasoline"
            ]
        }
    },
    "examples": [{
        "carType": "sedan",
        "numberOfDoors": 4,
        "manufacturer": "BMW",
        "engineType": "gasoline"
    }]
}

const data = {
  foo: 8,
  bar: "abc",
}

const validate = ajv.compile(schema)
const valid = validate(data)
if (!valid) console.log(validate.errors);

console.log(valid);
