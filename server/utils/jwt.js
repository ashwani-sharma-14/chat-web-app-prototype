import jwt from "jsonwebtoken";

const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || "your-access-secret-key";
const refreshTokenSecret =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key";

export const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, accessTokenSecret, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, accessTokenSecret);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshTokenSecret);
};
