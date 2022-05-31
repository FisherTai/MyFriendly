import { Router } from "express";
const router = Router();

import { register, login, setAvatar, getAllUsers, logout } from "../controllers/user-controllers";

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", getAllUsers);
router.get("/logout/:id", logout);

export default router;
