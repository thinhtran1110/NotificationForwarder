const express = require("express");

const { InfoController, NotificationController } = require("../../controllers");

const router = express.Router();

router.get("/info", InfoController.info);
router.post("/notification", NotificationController.notificationForward);

module.exports = router;
