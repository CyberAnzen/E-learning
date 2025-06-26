const ClassificationModel = require("../../../model/ClassificationModel");
exports.deleteClassification = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ClassificationModel.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(500)
        .json({ message: "Does not exist or Operation Failed" });
    }
    res.status(200).json({ message: "Classification deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Operation unsuccessful" });
  }
};
