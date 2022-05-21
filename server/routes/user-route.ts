import { Router } from "express";
const router = Router();

const {
  register,
  login,
  setAvatar,
  getAllUsers,
  logout,
} = require("../controllers/user-controllers");

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", getAllUsers);
router.get("/logout/:id", logout);

module.exports = router;
