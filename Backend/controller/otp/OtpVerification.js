const { DetailedUser } = require("../../model/UserModel"); // Use DetailedUser for detailed registration
const OTP = require("../../model/OTPModel")

exports.OtpVerification = async (req, res) => {
  try {
    const { otp, email, regNumber } = req.body;
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
        // Find the user from DetailedUser using the reg_no and matching either email or official_email from user_details
        const user = await DetailedUser.findOne({
          "userDetails.reg_no": otps.reg_no,
          $or: [
            { "userDetails.email": otps.email },
            { "userDetails.officialEmail": otps.email }
          ]
        }).select("userDetails.email userDetails.officialEmail _id username password");
        
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.status(200).json({ message: "OTP verified" });
      } else {
        return res.status(400).json({ message: "OTP is not verified" });
      }
    }
  } catch (error) {
    console.error("Error in verifying OTP", error);
    res.status(500).json({ message: "Error in verifying OTP" });
  }
};