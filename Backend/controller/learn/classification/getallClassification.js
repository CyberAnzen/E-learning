const ClassificationModel = require("../../../model/ClassificationModel");

exports.getallClassification = async (req, res) => {
  try {
    const allClassifications = await ClassificationModel.find({});
    if (!allClassifications) {
      return res.status(500).json({ message: "Failed to Fetch data" });
    }
    res.status(200).json({ data: allClassifications });
  } catch (error) {
    res.status(404).json({ error: "Failed in loading data" });
  }
};
