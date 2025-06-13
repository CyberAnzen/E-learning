const ClassificationModel = require("../../../model/ClassificationModel");

exports.getSummary = async (req, res) => {
  const { id } = req.params;
  try {
    const count = await ClassificationModel.countLessons(id);

    if (count <= 0)
      return res.status(500).json({ message: "No lessons were added" });
    if (!count)
      return res.status(500).json({ message: "Failed to Count lessons" });
    const title = await ClassificationModel.getLessonsSummary(id);
    if (!title)
      return res.status(500).json({ message: "Failed to load summary" });
    res.status(200).json({ data: title });
  } catch (error) {
    return res.status(200).json({ message: "Failed in loading summary" });
  }
};
