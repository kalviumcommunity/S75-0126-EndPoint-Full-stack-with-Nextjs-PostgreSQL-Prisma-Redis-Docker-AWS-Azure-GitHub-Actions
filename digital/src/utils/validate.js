import validator from "validator";

export const validateEmail = (email) => {
  return validator.isEmail(email);
};

export const validateText = (text) => {
  return !validator.isEmpty(text.trim());
};
