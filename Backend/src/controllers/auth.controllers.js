import{User }from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/async-handler.js';
import {
  refreshTokenCookieOptions,
  accessTokenCookieOptions,
} from '../constants/constants.js';

const generateToken = async (user, res) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    throw new ApiError(500, 'Error while generating tokens', {
      error: error,
    });
  }
};

const signUp = asyncHandler(async (req, res) => {
  const { username, email, password , role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (existingUser)
    throw new ApiError(409, 'User with username or email already exits');

  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  if (!user) throw new ApiError(500, 'Internal server error');

  res
    .status(201)
    .json(new ApiResponse(201, [], 'User signup successful , please Login..'));
});

const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!email && !username)
    throw new ApiError(400, 'Either username or email is required');

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (!existingUser) throw new ApiError(401, 'User not found');

  if (!existingUser.isPasswordCorrect(password))
    throw new ApiError(401, 'Invalid credentials');

  await generateToken(existingUser, res);

  res.status(200).json(new ApiResponse(200, [], 'User Login successful..'));
});

const logout = asyncHandler(async (req, res) => {
  const user = req.user;
  await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        refreshToken: '',
      },
    },
    {
      new: true,
    },
  );
  res
    .status(200)
    .clearCookie('accessToken', accessTokenCookieOptions)
    .clearCookie('refreshToken', refreshTokenCookieOptions)
    .json(new ApiResponse(200, [], 'User logout successful'));
});

export { signUp, login, logout };
