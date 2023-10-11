import { User } from "../models/user.js";

// Here the user with same email is found and returned
export function getUserByEmail(request) {
  return User.findOne({
    email: request.body.email,
  });
}

// Here the user with same id is found and returned
export function getUserById(userID) {
  return User.findById(userID).select("_id");
}
