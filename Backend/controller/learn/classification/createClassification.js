const ClassificationModel = require("../../../model/ClassificationModel");
exports.createClassification = async (req, res) => {
  const { title, description, icon, category } = req.body;
  try {
    const data = {
      title,
      description,
      icon,
      category,
    };
    const Classification = await ClassificationModel.create(data);
    if (!Classification) {
      return res.status(404).send("Classification not Created");
    }
    res.status(200).json({ message: "Classification Created Successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error in Creating Classification (No Duplicates)",
      error: error.errorResponse.errmsg,
    });
  }
};
