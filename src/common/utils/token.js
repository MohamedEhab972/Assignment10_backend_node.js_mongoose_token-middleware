import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
  return token;
};
