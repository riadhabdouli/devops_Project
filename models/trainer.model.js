const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const schema = new mongoose.Schema(
  {
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    email: String,
    password: String,
    status: { type: String, default: "NA" },
        profile_image: { type: String, default: "" },
    profession: { type: String, default: "trainer" },
    intro: { type: String, default: "Empty introduction" },
    status:{ type: String, default: "NA" },
    members: [
      {mid : String , name: String}
    ]
  },
  {
    timestamps: true,
  }
);

schema.pre('save', function(next) {
    var trainer = this;
    // only hash the password if it has been modified (or is new)
    if (!trainer.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(trainer.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            trainer.password = hash;
            next();
        });
    });
});

const trainer = mongoose.model('Trainer', schema);

module.exports = trainer;