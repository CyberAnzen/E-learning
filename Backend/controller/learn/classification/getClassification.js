const ClassificationModel = require("../../../model/ClassificationModel");
exports.getClassification = async (req, res) => {
  const { id } = req.params;
  try {
    const classification = await ClassificationModel.findById(id);
    if (!classification) {
      return res.status(500).json({ error: "Classification does not exist" });
    }
    res.status(200).json({ data: classification });
  } catch (error) {
    res.status(404).json({ error: "Error in Fetching the Classification" });
  }
};
