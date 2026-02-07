import asyncHandler from '../utils/async-handler';
import ApiError from '../utils/ApiError.js';
import {User} from '../models/user.models.js';
import jwt from 'jsonwebtoken';

export const verifyAuth = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) throw new ApiError(401, 'Access token missing');

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }

  const user = await User.findById(decodedToken?._id).select(
    '-password -refreshToken',
  );

  if (!user) throw new ApiError(401, 'User doest not exist');

  req.user = Object.freeze(user);

  next();
});
