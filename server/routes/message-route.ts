const { addMessage, getMessages } = require("../controllers/message-controllers");
import { Router } from "express";
const router = Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

module.exports = router;
