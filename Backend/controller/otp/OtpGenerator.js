const { DetailedUser } = require("../../model/UserModel"); // Use DetailedUser for detailed registration
const OTP = require("../../model/OTPModel")

exports.OtpGenerator = async (req, res) => {
    try {
        const { regNumber, email } = req.body;
        let request;

        if (regNumber) {
            // When reg_number is provided, query by user_details.reg_no
            request = { "userDetails.regNumber": regNumber };
        } else if (email) {
            // When email is provided, query against both email and official_email fields
            request = { 
                $or: [
                    { "userDetails.email": email },
                    { "userDetails.officialEmail": email }
                ]
            };
        } else {
            return res.status(400).send("No registration number or email provided");
        }

        // Select the necessary fields, including official_email for cases where email might match that field.
        const user = await DetailedUser.findOne(request)
            .select("userDetails.email userDetails.officialEmail userDetails.regnumber _id username");
        
        if (!user) {
            return res.status(400).send("User not found");
        }

        // Check if an OTP document already exists for this user (by email or reg_no)
        const existingOTP = await OTP.findOne({
            $or: [
                { email: user.userDetails.email },
                { regNumber: user.userDetails.regNumber },
            ]
        });
        if (existingOTP) {
            await OTP.deleteOne({ _id: existingOTP._id });
            console.log("Existing OTP document deleted.");
        }

        // Generate a 6-digit OTP between 100000 and 999999
        const otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        console.log(`Generated OTP: ${otp}`);

        // Use the email provided in the request if available; otherwise, fall back to user_details.email.
        const finalEmail = email ? email : user.userDetails.email;

        const info = {
            otp: otp,
            email: finalEmail,
            user_id: user._id,
            username: user.username,
            regNumber: user.userDetails.regNumber,
            officialEmail: user.userDetails.officialEmail
        };

        // Create new OTP document
        const otpEntry = await OTP.create(info);
        if (!otpEntry) {
            return res.status(500).send("OTP not created");
        }

        res.status(200).json({ message: "OTP generated successfully", userId: user._id });
    } catch (error) {
        console.error("Error in otp_generator:", error);
        res.status(500).send("Error in OTP generation");
    }
};