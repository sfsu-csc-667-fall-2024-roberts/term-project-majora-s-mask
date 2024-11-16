import { insertUser, findUserByUsername } from "./database_operations";

// Insert a new user
insertUser("Joh", "Doe", "johdoe", "johexample.com", "hashedpassword123");

// Find user by username
findUserByUsername("johdoe").then((user) => {
  console.log("User found:", user);
});
