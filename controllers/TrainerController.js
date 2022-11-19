const { Validator } = require("node-input-validator");
const trainer = require("../models/trainer.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const fs = require("fs");
const member = require('../models/member.model');
const mime = require("mime");
const HireReq = require("../models/hire.model");

exports.register = async (req, res) => {
  const v = new Validator(req.body, {
    first_name: "required|minLength:2|maxLength:100",
    last_name: "required|minLength:2|maxLength:100",
    email: "required|email|unique:Member,email",
    password: "required",
    intro:"required" 
  });
  const matched = await v.check();
  if (!matched) {
    return res.status(422).send(v.errors);
  }

  try {
    const newTrainer = trainer({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      intro : req.body.intro,
      status: "NA"
    });

    let trainerData = await newTrainer.save();
    return res.status(200).send({
      message: "Registration successfull",
      data: trainerData,
    });
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
    let trainerData = await trainer.findOne({ email: req.body.email });
    if (trainerData) {
      //  let trainerData = await trainer.findOne({ email: req.body.email });
      // if(trainerData) {}
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
        message: "Trainer is not registered",
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

exports.getTrainer = (req, res) => {
  trainer.find({ _id: req.param("id") }).then((TrainerData) => {
    if (TrainerData) {
      res.status(200).json(TrainerData[0]);
    } else {
      res.status(404).json({ message: "Trainer not found !" });
    }
  });
};

exports.updateTrainer = (req, res) => {
 // console.log(req.body);
  const trainerData = new trainer({
    _id: req.body.id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    status : req.body.status,
    members: req.body.members,
    profile_image: req.body.profile_image,
    intro : req.body.introduction
  });
  trainer.updateOne({ _id: req.params.id }, trainerData).then((result) => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Update successful !" });
    } else {
      res.status(401).json({ message: "not authorized" });
    }
  });
};
exports.current_user = (req, res) => {
  return res.status(200).send({
    message: "Current user data successfully fetched",
    data: req.user,
  });
};
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
    let current_user = await trainer.findOne({ _id: req.params.id });
    //console.log(current_user);
    if (bcrypt.compareSync(req.body.old_password, current_user.password)) {
      let hashPassword = bcrypt.hashSync(req.body.new_password, 10);
      await trainer.updateOne(
        {
          _id: current_user._id,
        },
        {
          password: hashPassword,
        }
      );
      let trainerData = await trainer.findOne({ _id: current_user._id });
      let jwt_secret = process.env.JWT_SECRET || "mysecret";
      let token = jwt.sign(
        {
          data: trainerData,
        },
        jwt_secret,
        { expiresIn: "12h" }
      );

      return res.status(200).send({
        message: "Password successfully updated",
        data: trainerData,
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
  trainer
    .updateOne({ _id: req.params.id }, { profile_image: fileName })
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful !" });
      } else {
        //console.log("here");
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

exports.addMember = async (req,res) => {
 // console.log(req.body.hireId);
  var memberdat = 
    {mid : req.body.memberId , name:  req.body.memberName};
  //console.log(memberdat);
  let trainerData =await  trainer.findOne({  _id: req.params.id });
   console.log(trainerData);
  //console.log(req.body.memberName); 
 let mail =  req.body.mail ;
  trainer.updateOne({ _id:  req.params.id }, { $push: {members: memberdat} }).then((result) => {
    if (result.modifiedCount > 0) {
      HireReq.deleteOne({_id: req.body.hireId }).then(console.log("succcc"));
      res.status(200).json({ message: "Request accepted !" });
    } else {
      res.status(401).json({ message: "not authorized" });
    }
  });
}

exports.deleteMember=(req,res)=>{
  HireReq.deleteOne({_id: req.body.hireId }).then((result) => {
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Request deleted !" });
    } else {
      res.status(401).json({ message: "not authorized" });
    }
  });
}

