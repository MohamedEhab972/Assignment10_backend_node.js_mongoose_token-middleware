import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = await jwt.verify(authorization, "secret");
  req.user = token;
  next();
};
