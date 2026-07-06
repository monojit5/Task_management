import express from 'express';
import { login, register } from '../controllers/userController.js';
import { validate } from './../validator/validateMiddleware.js';
import { loginSchema, registerSchema } from '../validator/userValidate.js';
const userRoute = express.Router();
userRoute.post("/register", validate(registerSchema), register);
userRoute.post("/login", validate(loginSchema), login)
export default userRoute;