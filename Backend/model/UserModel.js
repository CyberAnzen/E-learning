const mongoose = require("mongoose");
const { Schema } = mongoose;
const currentYear = new Date().getFullYear() % 100;
const getRandomAvatar = require("../controller/user/profile/avator/getRandomAvator");
const TeamModel = require("./TeamModel");
// Detailed user schema
const UserModel = new mongoose.Schema(
  {
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Teams",
      validate: {
        validator: async function (value) {
          if (!value) return true; // Allow null or undefined
          const teamExists = await TeamModel.exists({ _id: value });
          return !!teamExists;
        },
        message: "Team with the given ID does not exist",
      },
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userRole: { type: String, default: "User", enum: ["User", "Admin"] },
    phoneNo: {
      type: Number,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: function (v) {
          return v != null && /^[6-9]\d{9}$/.test(v.toString());
        },
        message: "Phone number must be a valid 10-digit Indian mobile number",
      },
      set: (v) => (v === null ? undefined : v),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    regNumber: {
      type: String,
      required: true,
      unique: true,
      set: (v) => v.toUpperCase(),
      match: /^RA\d{2}\d{9,11}$/,
      validate: {
        validator: function (v) {
          const yearPart = parseInt(v.slice(2, 4), 10);
          return yearPart <= currentYear;
        },
        message: `Admission year in regNumber cannot be in the future.`,
      },
    },
    officialEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    userDetails: {
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        set: (v) => v.trim().replace(/\s+/g, " "),
      },
      dept: {
        type: String,
        required: true,
        trim: true,
        enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AI", "DS"],
      },
      section: {
        type: String,
        required: true,
        match: /^[A-Z]$/,
      },

      gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"],
      },
      year: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
    },
    profile: {
      socialLinks: {
        type: Array,
        default: [],
        validate: {
          validator: function (v) {
            return v.every(
              (link) => typeof link === "string" && link.startsWith("http")
            );
          },
          message: "All social links must be valid URLs",
        },
      },
      skills: {
        type: Array,
        default: [],
        validate: {
          validator: function (v) {
            return v.every(
              (skill) => typeof skill === "string" && skill.length > 0
            );
          },
          message: "All skills must be non-empty strings",
        },
      },
      avator: {
        type: String,

        validate: {
          validator: function (v) {
            return typeof v === "string" && v.startsWith("/avator/");
          },
          message: "Avatar path must start with '/avator/'",
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

UserModel.pre("save", function (next) {
  if (!this.profile.avator || this.profile.avator === "") {
    const result = getRandomAvatar(this.userDetails.gender);

    if (!result.success || !result.avator || !result.avator.path) {
      return next(new Error("Failed to get random avatar"));
    }

    this.profile.avator = `${result.avator.path}${result.avator.name}`;
  }
  next();
});
UserModel.index({ teamId: 1 });

UserModel.statics.UpdateTeamId = async function (
  teamId,
  userId,
  rollbackTeamOnFail = false
) {
  if (teamId) {
    const exists = await TeamModel.exists({ _id: teamId });
    if (!exists) throw new Error("Team with the given ID does not exist");
  }

  const user = await this.findById(userId);
  if (!user) throw new Error("No User record found");

  if (user.teamId?.toString() === teamId?.toString()) {
    return { updated: false, user };
  }

  try {
    user.teamId = teamId;
    await user.save();
    return { updated: true, user };
  } catch (err) {
    if (rollbackTeamOnFail && teamId) {
      await TeamModel.deleteOne({ _id: teamId }).catch(() => {});
    }
    throw err;
  }
};

const User = mongoose.model("Users", UserModel);

module.exports = { User };
