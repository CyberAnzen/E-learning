const TeamModal = require("../../../../../model/TeamModel");
exports.createTeam = async (req, res) => {
  const { teamName,description } = req.body;
  const userId = req.user.id;

  if (!teamName) {
    return res.status(400).json({ message: "Team name is required" });
  }

  try {
    const existingTeam = await TeamModal.findOne({ teamName });

    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const newTeam = await TeamModal.createTeam(teamName, description,userId);
    res.status(201).json({
      message: "Team created successfully",
      team: newTeam,
    });
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
