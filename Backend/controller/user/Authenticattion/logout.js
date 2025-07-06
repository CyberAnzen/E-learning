exports.logout = (req, res) => {
  // Clear the token cookie
  res.cookie("access_token", "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
  });

  // Clear the rememberMe cookie
  res.cookie("refresh_token", "", {
    expires: new Date(0),
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logout successful" });
};
