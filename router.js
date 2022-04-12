import { Router } from "express";
import UserController from "./UserController.js";
import { check } from "express-validator";

const router = new Router();

router.post(
  "/signup",
  [
    check("email", "Incorrect email").isEmail(),
    check("name", "at least 2 characters must be in the name").isLength({
      min: 2,
    }),
    check("password", "at least 1 character must be in the password").isLength({
      min: 1,
    }),
  ],
  UserController.register
);
router.post("/signin", UserController.login);
router.get("/users", UserController.getAll);
router.put("/users", UserController.update);
router.delete("/users/:id", UserController.delete);

export default router;
