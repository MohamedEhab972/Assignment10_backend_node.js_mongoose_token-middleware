import { generateToken } from "../../common/utils/token.js";
import { userModel } from "../../database/model/user.model.js";
import jwt from "jsonwebtoken";

export const createUser = async (data) => {
  const { name, email, phone, password, age } = data;
  const exsistUser = await userModel.findOne({ email });
  if (exsistUser) {
    return { message: "User already exists" };
  }
  const user = await userModel.create({ name, email, phone, password, age });
  return { message: "User created successfully", data: user };
};

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await userModel.findOne({ email, password });
  if (!user) {
    return { message: "User not found" };
  }
  const token = await generateToken(user);
  return { message: "logged in successfully", token };
};

export const updateUser = async (token, data) => {
  const user = await userModel.findById(token.id);
  if (!user) return { message: "User not found" };

  const { name, email, phone, age } = data;

  if (email && email !== user.email) {
    const taken = await userModel.findOne({ email });
    if (taken) return { message: "Email already taken" };
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (phone !== undefined) user.phone = phone;
  if (age !== undefined) user.age = age;

  await user.save();
  return { message: "User updated successfully", data: user };
};

export const deleteUser = async (token) => {
  const user = await userModel.findById(token.id);
  if (!user) return { message: "User not found" };
  await user.remove();
  return { message: "User deleted successfully" };
};

export const getUserById = async (token) => {
  const user = await userModel.findById(token.id);
  if (!user) return { message: "User not found" };
  return { message: "User found successfully", data: user };
};
