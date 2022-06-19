import { Router } from "express";
const router = Router();

import {
  register,
  login,
  setAvatar,
  getAllUsersExId,
  logout,
  getUsers,
  editUser,
  suspendUser,
} from "../controllers/user-controllers";

/* for front end */
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
/**Get all users except a certain Id */
router.get("/allUsersExceptId/:id", getAllUsersExId);
router.get("/logout/:id", logout);

/* for back end */
router.get("/backend/", getUsers);
router.patch("/backend/:_id", editUser);
/**TODO: Suspend a User*/
router.patch("/backend/Suspend:id", suspendUser);

export default router;
