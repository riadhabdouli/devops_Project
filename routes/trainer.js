const router=require('express').Router();
const express = require('express');
const TrainerController=require('../controllers/TrainerController');
const middleware = require("../middleware/middleware");


router.post('/register',TrainerController.register);
router.post('/login',TrainerController.login);
router.put('/update/:id', TrainerController.updateTrainer);
router.get('/profile/:id',TrainerController.getTrainer);
router.post('/change-password/:id',TrainerController.change_password);
router.put('/addmember/:id', TrainerController.addMember);
router.post('/deletemember', TrainerController.deleteMember);
router.get('/:id',TrainerController.getTrainer);

router.post("/profileimg/:id", TrainerController.updatePicture);
router.get("/profileimg/:img", TrainerController.getImage);

module.exports = router;
