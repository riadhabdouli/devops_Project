const router = require("express").Router();
const express = require("express");
const MemberController = require("../controllers/MemberController");
const middleware = require("../middleware/middleware");

router.post("/register", MemberController.register);
router.post("/login", MemberController.login);
router.put("/profile/:id", MemberController.updateMember);
router.get("/profile/:id", MemberController.getMember);
router.post("/change-password/:id", MemberController.change_password);

router.post("/profileimg/:id", MemberController.updatePicture);
router.get("/profileimg/:img", MemberController.getImage);


module.exports = router;
