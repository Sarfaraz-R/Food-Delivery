export const userRolesEnum = {
  USER: 'user',
  ADMIN: 'admin',
};

export const AvailableUserRoles = Object.values(userRolesEnum);

export const refreshTokenCookieOptions = {
  maxAge:7*24*60*60*1000,
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
};

export const accessTokenCookieOptions={
  maxAge:15*60*1000,
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
}
