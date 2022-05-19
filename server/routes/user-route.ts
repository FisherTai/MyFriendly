const router = require("express").Router();
const {
  register,
  login,
  setAvatar,
  getAllUsers,
} = require("../controllers/user-controllers");

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);

module.exports = router;
