import apiResponse from "../utils/apiResponse.js";

const userMiddleware = {
  registerMiddleware: async (req, res, next) => {
    try {
      const { email, mobile, password, zipCode } = req.body;
      if (!email) return apiResponse.error(res, "Email is required");
      else if (!mobile)
        return apiResponse.error(res, "Mobile number is required");
      else if (!password) return apiResponse.error(res, "Password is required");
      else if (!zipCode) return apiResponse.error(res, "Zip Code is required");
      return next();
    } catch (err) {
      return apiResponse.error(res, err.message, 400);
    }
  },

  loginMiddleware: (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log("middleware--",req.body)
      if (!email) return apiResponse.error(res, "email is required");
      else if (!password) return apiResponse.error(res, "password is required");
      return next();
    } catch (err) {
      return apiResponse.error(res, err.message, 400);
    }
  },
};


export default userMiddleware;