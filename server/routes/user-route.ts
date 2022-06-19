import { Router } from "express";
const router = Router();

import { register, login, setAvatar, getAllUsersExId, logout } from "../controllers/user-controllers";

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
/**Get all users except a certain Id */
router.get("/allUsersExceptId/:id", getAllUsersExId);
router.get("/logout/:id", logout);

export default router;
