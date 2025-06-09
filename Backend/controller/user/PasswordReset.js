const bcrypt = require('bcryptjs')
const { DetailedUser } = require("../../model/UserModel"); // Use DetailedUser for detailed registration
const OTP = require("../../model/OTPModel")

exports.PasswordReset = async (req, res) => {
  try {
    const hashPassword = async (password) => {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    };
    const { otp, email, regNumber, newPassword } = req.body;
    let request;

    if (regNumber) {
      // When reg_number is provided, query by reg_no
      request = { regNumber: regNumber };
    } else if (email) {
      // When email is provided, query against both email and official_email fields in the OTP collection
      request = { $or: [{ email: email }, { officialEmail: email }] };
    } else {
      return res.status(400).send("No registration number or email provided");
    }

    // Find OTP document from OTP collection
    const otps = await OTP.findOne(request);
    if (!otps) {
      return res.status(400).send("OTP not found");
    } else {
      if (otp == otps.otp) {
        // Hash the new password
        const hashed = await hashPassword(newPassword);
        // Update the user in DetailedUser by matching the reg_no and checking for a matching email or official_email in user_details
        const user = await DetailedUser.findOneAndUpdate(
          {
            "userDetails.regNumber": otps.reNumber,
            $or: [
              { "userDetails.email": otps.email },
              { "userDetails.officialEmail": otps.email }
            ]
          },
          { $set: { password: hashed } }
        );
        if (!user) {
          return res.status(400).send("User not found");
        } else {
          // Delete the OTP document after successful password reset
          await OTP.deleteOne({ _id: otps._id });
          console.log("OTP document deleted after password reset.");
          res.status(200).json({ message: "Password reset" });
        }
      } else {
        return res.status(400).json({ message: "OTP is not verified" });
      }
    }
  } catch (error) {
    console.error("Error in resetting the password", error);
    res.status(500).json({ message: "Error in resetting the password" });
  }
};
