const ClassificationModel = require("../../../model/ClassificationModel");

exports.getallClassification = async (req, res) => {
  try {
    // 1. Fetch all classifications as plain objects
    const classifications = await ClassificationModel.find().lean();

    // 2. For each classification, count lessons and clean up fields
    const results = await Promise.all(
      classifications.map(async (cls) => {
        // countLessons is your static method
        const lessonCount = await ClassificationModel.countLessons(cls._id);

        // remove unwanted metadata
        delete cls.__v;
        delete cls.createdAt;
        delete cls.updatedAt;

        // attach the count
        return {
          ...cls,
          lessonCount,
        };
      })
    );

    // 3. Return the array with counts
    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Failed to fetch classifications with counts:", error);
    res
      .status(500)
      .json({ error: "Error fetching classifications and lesson counts" });
  }
};
