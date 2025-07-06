const ClassificationModel = require("../../model/ClassificationModel");
const customError = require("../../utilies/customError");

const fetchClassification = async () => {
  try {
    // 1. Fetch all classifications as plain objects
    const classifications = await ClassificationModel.find().lean();
    if (!classifications || classifications.length === 0) {
      throw new customError("No classifications found", 404);
    }
    // 2. Process each classification: add lesson count & next lessonNum
    const Classification = await Promise.all(
      classifications.map(async (cls) => {
        const lessonCount = await ClassificationModel.countLessons(cls._id);
        // const nextLessonNum = await Lesson.getNextLessonNumber(cls._id);

        delete cls.__v;
        delete cls.createdAt;
        delete cls.updatedAt;
        // console.log(lessonCount);

        return {
          ...cls,
          lessonCount,
          // nextLessonNum,
        };
      })
    );

    return {
      data: Classification,
      success: true,
    };
  } catch (error) {
    console.error(
      "[cacheManager => fetcher]Failed to fetch classifications for caching:",
      error.error || error.message
    );
    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch classifications",
      error: error.message || "Unknown error",
    };
  }
};

module.exports = fetchClassification;
