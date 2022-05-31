import { addMessage, getMessages } from "../controllers/message-controllers";
import { checkUser } from "../middlewares/authMiddleware";
import { Router } from "express";
const router = Router();

router.use(checkUser);
router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

export default router;
