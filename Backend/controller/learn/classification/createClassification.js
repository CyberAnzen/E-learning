const ClassificationModel = require("../../../model/ClassificationModel");

exports.createClassification = async (req, res) => {
  const { title, description, icon, category } = req.body;

  // 1. Basic validation
  if (!title || !description || !icon || !category) {
    return res.status(400).json({
      message: "All fields (title, description, icon, category) are required",
    });
  }

  try {
    // 2. Optional: Prevent duplicates (based on title or other unique field)
    const existing = await ClassificationModel.findOne({ title });
    if (existing) {
      return res.status(409).json({
        message: "Classification with this title already exists",
      });
    }

    // 3. Create classification
    const newClassification = await ClassificationModel.create({
      title,
      description,
      icon,
      category,
    });

    res.status(201).json({
      message: "Classification created successfully",
    });
  } catch (error) {
    console.error("Error creating classification:", error);
    res.status(500).json({
      message: "Server error while creating classification",
      error: error.message || "Unknown error",
    });
  }
};
