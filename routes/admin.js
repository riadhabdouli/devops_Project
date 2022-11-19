const router = require("express").Router();
const express = require("express");
const AdminController = require("../controllers/AdminController");
const middleware = require("../middleware/middleware");


router.get("/home/", AdminController.getAllTrainer);
router.put("/home/:id", AdminController.updateStatus);


module.exports = router;
