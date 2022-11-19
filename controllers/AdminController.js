const trainer = require("../models/trainer.model")

exports.getAllTrainer = (req, res) => {
   
  
  // { status: "NA"}
    trainer.find()
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

  exports.updateStatus =(req,res) => {
    console.log(req.body.testData);
    trainer.updateOne({ _id: req.params.id }, {status: req.body.testData })
    .then((result) => {
      if (result.modifiedCount > 0) {
        res.status(200).json({ message: "Update successful !" });
      } else {
        res.status(401).json({ message: "not authorized" });
      }
    });
  }