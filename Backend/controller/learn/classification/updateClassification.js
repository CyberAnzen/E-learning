const ClassificationModel = require("../../../model/ClassificationModel");

exports.updateClassification = async (req, res) => {
  const { title, description, icon, category, id } = req.body;

  try {
    const newdata = {
      title,
      description,
      icon,
      category,
    };

    const update = await ClassificationModel.findByIdAndUpdate(id, newdata, {
      new: true,
    });

    if (!update) {
      return res.status(404).json({ message: "Classification not found" });
    }

    res.status(200).json({ data: update });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Update operation unsuccessful", details: error.message });
  }
};
