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

const userInitialState = {
  name: "",
  email: "",
  age: "",
};

function SimpleForm() {
  // State to track the form inputs
  const [user, setUser] = useState(userInitialState);
  // State to track validation errors
  const [error, setError] = useState({});

  if (process.env.NODE_ENV === "development") console.log("[Dev] user", user);
  console.log("error", error);
  if (process.env.NODE_ENV === "production") console.log("[Prod] user", user);
  console.log("error", error);

  /*
    Input box onChange handler + validation
  */

  const handlerOnChange = (event) => {
    const { name, value } = event.target;

    // 1. UPDATE FORM STATE
    setUser((user) => {
      return {
        ...user,
        [name]: value,
      };
    });

    // 2. VALIDATION
    // Validate and get errors, if any
    // validate return the error message to us if there is one
    // else it will be null
    const errorMessage = validateField(event);

    // 3. UPDATE ERROR STATE
    setError((error) => {
      // Make a shallow copy
      const newError = { ...error };

      // if there is an error message
      if (errorMessage) {
        // Add the error message to the error state
        newError[name] = errorMessage;
      } else {
        // else it means that this field is valid
        // So we should remove the previous error message if any
        // delete keyword is used to remove a key/value pair from obj
        delete newError[name];
      }

      // Return the new error state
      return newError;
    });
  };

  // validate - validateField
  const validateField = (event) => {
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
    // const result = null; // Replace null with JOI validation here
    const result = Joi.validate(user, schema, { abortEarly: false });
    const { error } = result;
    if (!error) {
      console.log("user", user);
      // return user;
      // Call API to post the user to backend
    } else {
      const errorData = {};
      for (let item of error.details) {
        const name = item.path[0];
        const message = item.message;
        errorData[name] = message;
      }
      setError(errorData);
      console.log("errorData", errorData);
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
            value={user.name}
          />
          {error.name && <p className="error">{error.name}</p>}
          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            onChange={handlerOnChange}
            value={user.email}
          />
          {error.email && <p className="error">{error.email}</p>}
          <label>Age:</label>
          <input
            type="number"
            name="age"
            placeholder="Enter age"
            onChange={handlerOnChange}
            value={user.age}
          />
          {error.age && <p className="error">{error.age}</p>}
          <button>Submit</button>
        </form>
      </div>    
  );
}

export default SimpleForm;
