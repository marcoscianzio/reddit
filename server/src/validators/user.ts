import * as yup from "yup";

const user = {
  username: yup
    .string()
    .required("This field is required")
    .min(2, "Min of 2 characters"),
  password: yup
    .string()
    .required("This field is required")
    .min(2, "Min of 2 characters"),
};

export const userSchema = yup.object().shape({
  ...user,
});
