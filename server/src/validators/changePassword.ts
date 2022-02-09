import * as yup from "yup";

const changePassword = {
  newPassword: yup
    .string()
    .required("This field is required")
    .min(2, "Min of 2 characters"),
};

export const changePasswordSchema = yup.object().shape({
  ...changePassword,
});
