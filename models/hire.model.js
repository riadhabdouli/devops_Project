const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const schema = new mongoose.Schema(
  { 
    trainerId:{ type: String, default: "" },
    memberId:{ type: String, default: "" },
    memberName: { type: String, default: "" },
    height: { type: String, default: "" },
    weight: { type: String, default: "" }
  }
);


const HireReq = mongoose.model('HireReq', schema);

module.exports = HireReq;