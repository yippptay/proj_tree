const { Schema, model } = require("mongoose");
const personSchema = new Schema({
  name: String,
  location: String,
  age: Number,
});

const Person = model("person", personSchema);

module.exports = Person;
