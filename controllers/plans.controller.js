const { Validator } = require("node-input-validator");
const member = require("../models/member.model");
const trainer = require("../models/trainer.model");
const nPlan = require("../models/nutrition.model");
const wPlan = require("../models/workout.model");
const express = require("express");
const router = express.Router();


exports.editNPlan=(req, res) => {
      const newNplan = new nPlan({
        _id: req.body._id,
        memberId: req.body.memberId,
        Monday: req.body.Monday,
        Tuesday: req.body.Tuesday,
        Wednesday:req.body.Wednesday,
        Thursday:req.body.Thursday,
        Friday: req.body.Friday,
        Saturday: req.body.Saturday,
	    	Sunday:req.body.Sunday
      });
	   
nPlan.updateOne({ _id: req.body._id}, newNplan).then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful !" });
      } else {
        res.status(401).json({ message: "not authorized" });
      }
    });
}

exports.editWPlan=(req, res) => {
  console.log(req.body._id);
  console.log(req.body.memberId);
      const newWplan = new wPlan({
        _id: req.body._id,
        memberId: req.body.memberId,
        Monday: req.body.Monday,
        Tuesday: req.body.Tuesday,
        Wednesday:req.body.Wednesday,
        Thursday:req.body.Thursday,
        Friday: req.body.Friday,
        Saturday: req.body.Saturday,
	    	Sunday:req.body.Sunday
      });
	   
wPlan.updateOne({ _id: req.body._id}, newWplan).then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful !" });
      } else {
        res.status(401).json({ message: "not authorized" });
      }
    });
}

exports.getNPlan = (req,res)=> {
    nPlan.find({ memberId: req.param("id")}).then((nData) => {
      if (nData) {
        res.status(200).json(nData[0]);
      } else {
        res.status(404).json({ message: "Plan not found !" });
      }
    });
  }

  exports.getWPlan = (req,res)=> {
    wPlan.find({ memberId: req.param("id")}).then((wData) => {
      if (wData) {
        res.status(200).json(wData[0]);
      } else {
        res.status(404).json({ message: "Plan not found !" });
      }
    });
  }
