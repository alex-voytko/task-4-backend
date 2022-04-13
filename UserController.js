import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { validationResult } from "express-validator";
import moment from "moment";
import User from "./User.js";
import config from "./config.js";

class UserController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Registration error", errors });
      }
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "This user has already exists" });
      }
      const hashedPassword = bcryptjs.hashSync(password, 12);
      const user = new User({
        ...req.body,
        password: hashedPassword,
        signUpDate: moment().format("DD.MM.YYYY"),
      });
      await user.save();
      return res.json({ message: "User has successfully registered" });
    } catch (e) {
      res.status(400).json({ message: "Registration error" });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: `${email} has not found` });
      }
      if (user.isBlocked) {
        return res.status(400).json({ message: `This user has been blocked` });
      }
      const validPassword = await bcryptjs.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Incorrect password` });
      }
      await user.update({
        lastVisit: moment().format("Do of MMMM, HH:mm"),
        isOnline: true,
      });
      const token = jsonwebtoken.sign(
        {
          userId: user._id,
        },
        config.secret,
        { expiresIn: "2h" }
      );
      return res.json({
        token,
        userId: user._id,
        user: user.name,
      });
    } catch (error) {
      return res.status(400).json({ message: "Login error" });
    }
  }
  async getAll(req, res) {
    try {
      const users = await User.find();
      return res.json(users);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
  async update(req, res) {
    try {
      if (!req.body._id) {
        res.status(400).json({ message: "Id not specified" });
      }
      const updatedUser = await User.findByIdAndUpdate(req.body._id, req.body, {
        new: true,
      });
      return res.json(updatedUser);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
  async delete(req, res) {
    try {
      if (!req.params.id) {
        res.status(400).json({ message: "Id not specified" });
      }
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      return res.json(deletedUser);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}

export default new UserController();
