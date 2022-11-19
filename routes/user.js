const router = require("express").Router();
const express = require("express");
const UserController = require("../controllers/UserController");


router.get('/user-list',UserController.getAllTrainer);
router.post('/hire',UserController.hireTrainer);

router.get('/hire/:id',UserController.getHireReq);

module.exports = router;
