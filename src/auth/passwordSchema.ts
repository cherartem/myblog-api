import PasswordValidator from "password-validator";

const passwordSchema = new PasswordValidator()
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .symbols();

export default passwordSchema;
