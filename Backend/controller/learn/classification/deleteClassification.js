const ClassificationModel = require("../../../model/ClassificationModel");
const cacheManager = require("../../../cache/cacheManager");
//const customError = require("../../../utils/customError");
const LessonModel = require("../../../model/LessonModel");
exports.deleteClassification = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ClassificationModel.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Does not exist or Operation Failed",
      });
    }
    await LessonModel.findByIdAndDelete({ classificationId: id });

    // Refresh the cache after deletion
    let cacheStatus = await cacheManager.refreshCache("classificationCache");
    if (cacheStatus.success) {
      console.log(cacheStatus);
      console.log("cache.data", cacheStatus.data);

      console.log("Cache refreshed successfully after deletion");

      return res.status(200).json({
        success: true,
        message: "Classification deleted successfully and cache refreshed",
      });
    } else {
      console.error("Cache refresh failed after deletion:", cacheStatus.error);
      return res.status(207).json({
        success: false,
        message: "Classification deleted, but cache refresh failed",
        error: cacheStatus.error || "Unknown error",
      });
    }
    //res.status(200).json({ message: "Classification deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Operation unsuccessful" });
  }
};
