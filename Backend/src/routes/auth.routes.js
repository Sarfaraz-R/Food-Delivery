import express from 'express';
import { signUp, login, logout } from '../controllers/auth.controllers.js';
import { validate } from '../middlewares/validation.middlewares.js';
import { signUpValidation, loginValidation } from '../validators/validation.js';

const router = express.Router();

router.route('/signup').post(signUpValidation(), validate, signUp);

router.route('/login').post(loginValidation(), validate, login);

router.route('/logout').get(logout);

export default router;
