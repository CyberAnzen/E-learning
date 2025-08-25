//const ClassificationModel = require("../../../model/ClassificationModel");
//const Lesson = require("../../../model/LessonModel");
const Learn_Progress = require("../../../model/LearnProgressModel");
const cacheManager = require("../../../cache/cacheManager");
const customError = require("../../../utilies/customError");

exports.getallClassification = async (req, res) => {
  const user = req.user;

  try {
    const cacheData = cacheManager.getCache("classificationCache");

    if (!cacheData || !Array.isArray(cacheData.data)) {
      throw new customError("No classification found", 404);
    }

    const classification = cacheData.data;

    if (classification.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No classification found",
      });
    }

    const completed = await Learn_Progress.countCompletedPerClassification(
      user._id
    );

    // Map of classificationId → completed count
    const completedMap = new Map();
    completed.forEach((item) => {
      completedMap.set(item.classificationId.toString(), item.totalCompleted);
    });

    // Remove timestamps and merge completed count
    const finalClassification = classification.map((item) => {
      const obj = { ...item };
      if (user.role == "User") {
        delete obj.createdAt;
        delete obj.updatedAt;
      }

      return {
        ...obj,
        totalCompleted: completedMap.get(item._id.toString()) || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        classification: finalClassification,
      },
    });
  } catch (error) {
    console.error("Failed to fetch classifications with counts:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching classifications and lesson counts",
    });
  }
};
