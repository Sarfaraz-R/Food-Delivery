import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/async-handler.js';
import { validationResult } from 'express-validator';

export const validate = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  // console.log(errors);
  if (errors.isEmpty()) return next();

  throw new ApiError(400, {
    error: errors.array(),
  });
});
