const Ajv = require("ajv");
const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    foo: {type: "integer", maximum: 5},
    bar: {type: "string"},
    timestamp: { type: "string", format: "date"}
  },
  required: ["foo"],
  additionalProperties: false,
}

const data = {
  fos: 3,
  bar: "abc",
  timestamp: "2020-05-06"
}

const validate = ajv.compile(schema)
const valid = validate(data)
if (!valid) console.log(validate.errors);

console.log(valid);
