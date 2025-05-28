import {
  verifyAccessToken,
  verifyRefreshToken,
  generateTokens,
} from "../utils/jwt.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = verifyAccessToken(accessToken);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
          return res.status(401).json({ message: "Refresh token required" });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(
          decoded.userId
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: false,
          secure: true,
        });
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
        });

        req.user = { id: decoded.userId };
        next();
      } catch (refreshError) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
    } else {
      return res.status(401).json({ message: "Invalid access token" });
    }
  }
};
