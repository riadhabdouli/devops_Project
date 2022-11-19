const { response } = require("express");
const express = require("express");
const trainer = require("../models/trainer.model");
const HireReq = require("../models/hire.model");


const router = express.Router();


exports.getAllTrainer = (req, res) => {
  // {status: 'Activate'}
    trainer.find({status: 'Activated'})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving trainers."
      });
    });
  }

  exports.hireTrainer = async (req,res) => {
    try {
      const newHireReq = new HireReq({
        trainerId: req.body.trainerId,
        memberId : req.body.memberId,
        memberName: req.body.memberName,
        height: req.body.height,
        weight: req.body.weight
      });
      
      let hireData = await newHireReq.save();
      if(hireData){
        //console.log(hireData);
      return res.status(200).send({
        message: "Hiring request Send successfully !",
        data: hireData
      });
    }
    } catch (err) {
      return res.status(400).send({
        message: err.message,
        data: err,
      });
    }
  }

  exports.getHireReq = (req,res) => { 
    HireReq.find({trainerId : req.param("id")})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving trainers."
      });
    });
  }

