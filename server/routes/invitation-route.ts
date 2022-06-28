import { Router } from "express";

import { checkUser } from "../middlewares/authMiddleware";
import { sendInvite, setInviteState, getSelfSendedInvities, getSelfReceivedInvities, approveInvite, rejectInvite } from "../controllers/invitation-controllers";

const router = Router();

/** for front end */
router.use(checkUser);
router.post("/", sendInvite);
/** change state by id*/
router.patch("/approve/:_id", approveInvite);
router.patch("/reject/:_id", rejectInvite);
router.patch("/:_id", setInviteState);

/** get sended invities by token id */
router.get("/getInvitiesBySender/", getSelfSendedInvities);
/** get received invities by token id*/
router.get("/getInvitiesByReceiver/", getSelfReceivedInvities);

export default router;
