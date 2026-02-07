import { body } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const signUpValidation = () => {
  return [
    body('username')
      .trim()
      .notEmpty()
      .withMessage('Username cannot be empty')
      .toLowerCase()
      .isLength({ min: 3 })
      .withMessage(`Username must be minimum 3 characters long`),

    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email cannot be empty')
      .toLowerCase()
      .isEmail()
      .withMessage('Invalid email format'),

    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage('password must be atLeast 5 characters long'),
  ];
};

export const loginValidation = () => {
  return [
    body().custom((value, { req }) => {
      if (!req.body.email && !req.body.username)
        throw new ApiError(404, 'Either email or username is Required');
      return true; //move to next validation
    }),
    // custom() lets you write your own validation logic

    // express-validator gives you:

    // value → current field value (unused here)

    // req → full request object
    body('email')
      .trim()
      .optional()
      .toLowerCase()
      .isEmail()
      .withMessage('Invalid email format'),

    body('username')
      .trim()
      .optional()
      .isLength({ min: 3 })
      .withMessage('Username must be atLeast 3 characters long'),

    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 5 })
      .withMessage('password must be atLeast 5 characters long'),
  ];
};
