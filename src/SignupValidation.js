function Validation(values) {
  let error = {};
  const email_Pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const password_Pattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (values.name === "") {
    error.name = "Name should not be empty";
  } else {
    error.name = "";
  }

  if (values.email === "") {
    error.email = "Name should not be empty";
  } else if (!email_Pattern.test(values.email)) {
    error.email = `Email didn't match`;
  } else {
    error.email = "";
  }

  if (values.password === "") {
    error.password = `Password should not be empty`;
  } else if (!password_Pattern.test(values.password)) {
    error.password = `Password didn't match`;
  } else {
    error.password = "";
  }
  return error;
}

export default Validation;
