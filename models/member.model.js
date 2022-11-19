const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const schema = new mongoose.Schema(
  { 
    first_name: { type: String, default: "" },
    last_name: { type: String, default: "" },
    email: String,
    password: String,
    height: { type: String, default: "" },
    weight: { type: String, default: "" },
    profile_image: { type: String, default: "" },
    profession: { type: String, default: "member" },
  },
  {
    timestamps: true,
  }
);

schema.pre('save', function(next) {
    var member = this;
    // only hash the password if it has been modified (or is new)
    if (!member.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(member.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            member.password = hash;
            next();
        });
    });
});

const Member = mongoose.model('Member', schema);

module.exports = Member;