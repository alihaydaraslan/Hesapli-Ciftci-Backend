const joi = require("joi");
const APIError = require("../../utils/errors");

class authValidation {
  constructor() {}
  static register = async (req, res, next) => {
    try {
      await joi
        .object({
          name: joi.string().trim().min(2).max(50).required().messages({
            "string.base": "Ýsim alaný normal metin olmalýdýr!",
            "string.empty": "Ýsim alaný boþ olamaz!",
            "string.min": "Ýsim en az 2 karakterden oluþmalýdýr!",
            "string.max": "Ýsim en fazla 50 karakterden oluþmalýdýr!",
            "string.required": "Ýsim alaný zorunludur!",
          }),
          lastname: joi.string().trim().min(2).max(50).required().messages({
            "string.base": "Soyad alaný normal metin olmalýdýr!",
            "string.empty": "Soyad alaný boþ olamaz!",
            "string.min": "Soyad en az 2 karakterden oluþmalýdýr!",
            "string.max": "Soyad en fazla 50 karakterden oluþmalýdýr!",
            "string.required": "Soyad alaný zorunludur!",
          }),
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(100)
            .required()
            .messages({
              "string.base": "Email alaný normal metin olmalýdýr!",
              "string.empty": "Email alaný boþ olamaz!",
              "string.min": "Email en az 3 karakterden oluþmalýdýr!",
              "string.email": "Lütfen geçerli bir email adresi giriniz!",
              "string.max": "Email en fazla 50 karakterden oluþmalýdýr!",
              "string.required": "Email alaný zorunludur!",
            }),
          password: joi.string().trim().min(6).max(36).required().messages({
            "string.base": "Þifre alaný normal metin olmalýdýr!",
            "string.empty": "Þifre alaný boþ olamaz!",
            "string.min": "Þifre en az 6 karakterden oluþmalýdýr!",
            "string.max": "Þifre en fazla 36 karakterden oluþmalýdýr!",
            "string.required": "Þifre alaný zorunludur!",
          }),
          phone: joi
            .string()
            .trim()
            .strict()
            .regex(/^[0-9]{10}$/)
            .messages({
              "string.pattern.base": `Telefon numarasý 10 haneden oluþmalýdýr!`,
            })
            .required(),
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message)
        throw new APIError(error.details[0].message, 400);
      else throw new APIError("Lütfen doðrulama kurallarýna uyun!", 400);
    }
    next();
  };

  static login = async (req, res, next) => {
    try {
      await joi
        .object({
          email: joi
            .string()
            .email()
            .trim()
            .min(3)
            .max(100)
            //.required()
            .messages({
              "string.base": "Email alaný normal metin olmalýdýr!",
              "string.empty": "Email alaný boþ olamaz!",
              "string.min": "Email en az 3 karakterden oluþmalýdýr!",
              "string.email": "Lütfen geçerli bir email adresi giriniz!",
              "string.max": "Email en fazla 50 karakterden oluþmalýdýr!",
              //"string.required": "Email field is required!",
            }),
          password: joi.string().trim().min(6).max(36).required().messages({
            "string.base": "Þifre alaný normal metin olmalýdýr!",
            "string.empty": "Þifre alaný boþ olamaz!",
            "string.min": "Þifre en az 6 karakterden oluþmalýdýr!",
            "string.max": "Þifre en fazla 36 karakterden oluþmalýdýr!",
            "string.required": "Þifre alaný zorunludur!",
          }),
          phone: joi
            .string()
            .trim()
            .strict()
            .regex(/^[0-9]{10}$/)
            .messages({
              "string.pattern.base": `Telefon numarasý 10 haneden oluþmalýdýr!`,
            }),
        })
        .validateAsync(req.body);
    } catch (error) {
      if (error.details && error?.details[0].message)
        throw new APIError(error.details[0].message, 400);
      else throw new APIError("Lütfen doðrulama kurallarýna uyun!", 400);
    }
    next();
  };
}

module.exports = authValidation;
