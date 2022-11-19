const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    memberId: { type: String, default: "" },
    Monday: [{ type: String, default: "" }],
    Tuesday: [{ type: String, default: "" }],
    Wednesday: [{ type: String, default: "" }],
    Thursday: [{ type: String, default: "" }],
    Friday: [{ type: String, default: "" }],
    Saturday: [{ type: String, default: "" }],
    Sunday: [{ type: String, default: "" }]
  },
  {
    timestamps: true,
  }
);

const wplan = mongoose.model("wplan", schema);

module.exports = wplan;
