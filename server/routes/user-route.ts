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
  getUserConcats,
  // addConcats
} from "../controllers/user-controllers";
import { checkUser } from "../middlewares/authMiddleware";

/* for front end */
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
/**Get all users except a certain Id */
router.get("/allUsersExceptId/:id", getAllUsersExId);
router.get("/logout/:id", logout);

/** Concats */
router.use(checkUser);
router.get("/getUserConcats/", getUserConcats);
// router.post("/addUserConcats/", addConcats);


/* for back end */
router.get("/backend/", getUsers);
router.patch("/backend/:_id", editUser);
/* Suspend a User*/
router.patch("/backend/Suspend:id", suspendUser);

export default router;
