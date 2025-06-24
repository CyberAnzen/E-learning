const ClassificationModel = require("../../../model/ClassificationModel");
const Lesson = require("../../../model/LessonModel");

exports.getallClassification = async (req, res) => {
  try {
    // 1. Fetch all classifications as plain objects
    const classifications = await ClassificationModel.find().lean();

    // 2. Process each classification: add lesson count & next lessonNum
    const results = await Promise.all(
      classifications.map(async (cls) => {
        const lessonCount = await ClassificationModel.countLessons(cls._id);
        const nextLessonNum = await Lesson.getNextLessonNumber(cls._id);

        delete cls.__v;
        delete cls.createdAt;
        delete cls.updatedAt;

        return {
          ...cls,
          lessonCount,
          nextLessonNum,
        };
      })
    );

    // 3. Return everything
    res.status(200).json({ data: { overallProgress: 50, results } });
  } catch (error) {
    console.error("Failed to fetch classifications with counts:", error);
    res
      .status(500)
      .json({ error: "Error fetching classifications and lesson counts" });
  }
};
