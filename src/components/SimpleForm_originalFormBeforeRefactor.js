import styles from "./SimpleForm.module.css";
import { useState } from "react";
import Joi from "joi-browser";

// Create our schema
// This schema is used to validate our form data
// key: value
const schema = {
  // form field name: Joi validation rule
  // schema[name]
  name: Joi.string().min(2).max(20).required(),
  // schema[email]
  email: Joi.string().email().required(),
  // schema[age]
  age: Joi.number().min(1).max(100).required(),
};

function SimpleForm() {
  // State to track the form inputs
  const [user, setUser] = useState({
    name: "",
    email: "",
    age: 0,
  });
  // State to track validation errors
  const [error, setError] = useState({});

  console.log("error", error);

  /*
    Input box onChange handler + validation
  */

  const handlerOnChange = (event) => {
    const { name, value } = event.target;

    // validate return the error message to us if there is one
    // else it will null
    const errorMessage = validate(event);

    console.log("errorMessage", errorMessage);

    // UPDATE THE ERROR STATE
    // make a shallow copy of error state
    let errorData = { ...error };

    if (errorMessage) {
      // Add the error message to the error state
      errorData[name] = errorMessage;
    } else {
      // remove the previous error if any
      delete errorData[name];
    }

    setError(errorData);

    // UPDATING THE FORM STATE
    let userData = { ...user };
    userData[name] = value;

    setUser(userData);
  };

  // validate - validateField
  const validate = (event) => {
    // Insert validate function code here

    // Destructure the name and value
    const { name, value } = event.target;

    // Create an object with the name and value to validate
    // e.g. { name: "John"}
    // e.g. { age: 18 }
    const objToCompare = { [name]: value };

    // Create a subschema with the name and validation rules
    // e.g. { name: Joi.string().min(1).max(20).required() }
    // e.g. { age: Joi.number().min(1).max(100).required() }
    const subSchema = { [name]: schema[name] };

    // To validate, we use Joi.validate()
    // Syntax: Joi.validate(formData, subSchema)
    // This returns an obj with error msg if there is one
    // if there is no error, it will return null
    const result = Joi.validate(objToCompare, subSchema);

    console.log("result", result);

    const { error } = result;

    // If error is defined - return error.details[0].message
    // else return null
    return error ? error.details[0].message : null;
  };

  /*
    Submit handler
  */
  const handlerOnSubmit = (event) => {
    event.preventDefault();
    const result = null; // Replace null with JOI validation here
    const { error } = result;
    if (!error) {
      console.log(user);
      return user;
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }
      setError(errorData);
      console.log(errorData);
      return errorData;
    }
  };

  return (
    <div className={styles.container}>
      <h2>SimpleForm</h2>
      <form onSubmit={handlerOnSubmit}>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          onChange={handlerOnChange}
        />
        {error.name && <p className="error" style={{color: 'red'}}>{error.name}</p>}
        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email address"
          onChange={handlerOnChange}
        />
        {error.email && <p className="error" style={{color: 'red'}}>{error.email}</p>}
        <label>Age:</label>
        <input
          type="number"
          name="age"
          placeholder="Enter age"
          onChange={handlerOnChange}
        />
        {error.age && <p className="error" style={{color: 'red'}}>{error.age}</p>}
        <button>Submit</button>
      </form>
    </div>
  );
}

export default SimpleForm;
