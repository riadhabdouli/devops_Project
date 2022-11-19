const { Validator } = require("node-input-validator");
const member = require("../models/member.model");
const trainer = require("../models/trainer.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const mime = require("mime");
const nPlan = require("../models/nutrition.model");
const wPlan = require("../models/workout.model");




exports.register = async (req, res) => {

  const v = new Validator(req.body, {
    first_name: "required|minLength:2|maxLength:100",
    last_name: "required|minLength:2|maxLength:100",
    email: "required|email|unique:Member,email",
    password: "required",
  });
  const matched = await v.check();
  if (!matched) {
    return res.status(422).send(v.errors);
  }
  try {
    const newMember = new member({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password
    });
    
    let memberData = await newMember.save();
    if(memberData){
      await createEmptyPlans(memberData._id);
    return res.status(200).send({
      message: "Registration successfull",
      data: memberData
    });
  }
  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err,
    });
  }
};

exports.login = async (req, res) => {

  const v = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });

  const matched = await v.check();
  if (!matched) {
    return res.status(422).send(v.errors);
  }

  try {
    let memberData = await member.findOne({ email: req.body.email });
    if (memberData) {
      if (bcrypt.compareSync(req.body.password, memberData.password)) {
        let jwt_secret = process.env.JWT_SECRET || "mysecret";
        let token = jwt.sign(
          {
            data: memberData,
          },
          jwt_secret,
          { expiresIn: "1h" }
        );
        return res.status(200).send({
          message: "login success !",
          expiresIn: 3600,
          data: memberData,
          token: token,
        });
      } else {
        return res.status(400).send({
          message: "Incorrect credentials",
          data: {},
        });
      }
    } else {
      let trainerData = await trainer.findOne({ email: req.body.email });
    if (trainerData) {
      if (bcrypt.compareSync(req.body.password, trainerData.password)) {
        let jwt_secret = process.env.JWT_SECRET || "mysecret";
        let token = jwt.sign(
          {
            data: trainerData,
          },
          jwt_secret,
          { expiresIn: "1h" }
        );
        return res.status(200).send({
          message: "login success !",
          expiresIn: 3600,
          data: trainerData,
          token: token,
        });
      } else {
        return res.status(400).send({
          message: "Incorrect credentials",
          data: {},
        });
      }
    } else {
      return res.status(400).send({
        message: "Member is not registered",
        data: {},
      });
    }
  }
  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err,
    });
  }
};


exports.check_auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "mysecret");
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed !" });
  }
};

exports.getMember = (req, res) => {
  member.find({ _id: req.param("id")}).then((memberData) => {
    if(memberData) {
     //console.log(memberData[0].toString());
     res.status(200).json(memberData[0]);
    } else {
      res.status(404).json({ message: "Member not found !" });
    }
  });
};

exports.updateMember = (req, res) => {
  const memberData = new member({
    _id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    weight: req.body.weight,
    height: req.body.height,
    profile_image: req.body.profile_image,
  });
  member.updateOne({ _id: req.params.id }, memberData).then((result) => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Update successful !" });
    } else {
      res.status(401).json({ message: "not authorized" });
    }
  });
};

/* exports.current_user=(req,res)=>{
	return res.status(200).send({
		message:'Current user data successfully fetched',
		data:req.user
	});
}; */

exports.change_password = async (req, res) => {
  try {
    const v = new Validator(req.body, {
      old_password: "required",
      new_password: "required",
      confirm_password: "required|same:new_password",
    });
    const matched = await v.check();

    if (!matched) {
      return res.status(422).send(v.errors);
    }
    //console.log(req.params.id);
    let current_user = await member.findOne({ _id: req.params.id });
    //console.log(current_user);
    if (bcrypt.compareSync(req.body.old_password, current_user.password)) {
      let hashPassword = bcrypt.hashSync(req.body.new_password, 10);
      await member.updateOne(
        {
          _id: current_user._id,
        },
        {
          password: hashPassword,
        }
      );
      let memberData = await member.findOne({ _id: current_user._id });
      let jwt_secret = process.env.JWT_SECRET || "mysecret";
      let token = jwt.sign(
        {
          data: memberData,
        },
        jwt_secret,
        { expiresIn: "12h" }
      );

      return res.status(200).send({
        message: "Password successfully updated",
        data: memberData,
        token: token,
      });
    } else {
      return res.status(400).send({
        message: "Old password does not matched",
        data: {},
      });
    }
  } catch (err) {
    return res.status(400).send({
      message: err.message,
      data: err,
    });
  }
};

exports.updateMember = (req, res) => {
  const memberData = new member({
    _id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    height: req.body.height,
    weight: req.body.weight,
    profile_image: req.body.profile_image,
  });
  member.updateOne({ _id: req.params.id }, memberData).then((result) => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Update successful !" });
    } else {
      res.status(401).json({ message: "not authorized" });
    }
  });
};

exports.updatePicture = (req, res) => {
  var matches = req.body.image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {};
  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }
  let id = req.params.id;
  response.type = matches[1];
  response.data = Buffer.from(matches[2], "base64");
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = mime.extension(type);
  let fileName = id + "-" + Date.now() + "." + extension;
  fs.writeFileSync("./controllers/images/" + fileName, imageBuffer, "utf8");
  member
    .updateOne({ _id: req.params.id }, { profile_image: fileName })
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful !" });
      } else {
        res.status(401).json({ message: "not authorized" });
      }
    });
};

exports.getImage = (req, res) => {
  let img = __dirname + "\\images\\" + req.params.img;
  if (fs.existsSync(img)) {
    console.log("file exist");
  }
  fs.readFile(img, function (err, content) {
    if (err) {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("<hi>No such image</h1>");
    } else {
      //specify the content type in the response will be an image
      res.status(200).json(Buffer.from(content).toString("base64"));
      //res.end(content);
    }
  });
};


async function createEmptyPlans(idMember){
   let a = String(idMember);
   const newNplan = new nPlan({
    memberId: a,
    Monday: ["Breakfast","Lunch","Dinner"],
    Tuesday: ["Breakfast","Lunch","Dinner"],
    Wednesday:["Breakfast","Lunch","Dinner"],
    Thursday:["Breakfast","Lunch","Dinner"],
    Friday: ["Breakfast","Lunch","Dinner"],
    Saturday: ["Breakfast","Lunch","Dinner"],
    Sunday: ["Breakfast","Lunch","Dinner"]
  });
 let NplanData = await newNplan.save();

 const newWplan = new wPlan({
  memberId: a,
  Monday: ["Session 1","Session 2"],
  Tuesday: ["Session 1","Session 2"],
  Wednesday:["Session 1","Session 2"],
  Thursday:["Session 1","Session 2"],
  Friday: ["Session 1","Session 2"],
  Saturday: ["Session 1","Session 2"],
  Sunday: ["Session 1","Session 2"],
});
let WplanData = await newWplan.save();
};

