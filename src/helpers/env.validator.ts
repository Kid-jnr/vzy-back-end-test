import * as Joi from "joi";

export const envVarsSchema = Joi.object({
  PORT: Joi.number().default(7000)
});
