const TeamModal = require("../../../../../model/TeamModel");

exports.getTeamDetails = async (req, res) => {
  try {
    const UserId = req.user.id;

    const teamDetails = await TeamModal.getTeamByUserId(UserId);
    if (!teamDetails) {
      return res.status(404).json({ error: "Team not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Team fetched",
      data: teamDetails,
    });
  } catch (error) {
    console.error("Error fetching team details:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
