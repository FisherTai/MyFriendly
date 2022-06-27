import { Router } from "express";
import { checkUser } from "../middlewares/authMiddleware";
import { sendInvite, setInviteState, getSelfSendedInvities, getSelfReceivedInvities } from "../controllers/invitation-controllers";

const router = Router();

/** for front end */
router.use(checkUser);
router.post("/", sendInvite);
/** change state */
router.patch("/:_id", setInviteState);
/** get sended invities by token id */
router.get("/getInvitiesBySender/", getSelfSendedInvities);
/** get received invities by token id*/
router.get("/getInvitiesByReceiver/", getSelfReceivedInvities);

export default router;
