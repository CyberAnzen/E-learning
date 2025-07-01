const ClassificationModel = require("../../../model/ClassificationModel");
const cacheManager = require('../../../cache/cacheManager');
//const customError = require("../../../utils/customError");
exports.updateClassification = async (req, res) => {
  const { id } = req.params;
  const { title, description, icon, category } = req.body;

  try {
    const newdata = {
      title,
      description,
      icon,
      category,
    };

    const update = await ClassificationModel.findByIdAndUpdate(id, newdata, {
      new: true,
      runValidators: true,
    });

    if (!update) {
      return res.status(404).json({ message: "Classification not found" });
    }
    // Refresh the cache after update
    let cacheStatus = await cacheManager.refreshCache('classificationCache');
    if (cacheStatus.success) {
      console.log('Cache refreshed successfully after update');
      return res.status(200).json({
        success: true,
        message: "Classification updated successfully and cache refreshed",
        data: update,
      });
    } else {
      console.error("Cache refresh failed after update:", cacheStatus.error);
      return res.status(207).json({
        success: false,
        message: "Classification updated, but cache refresh failed",
        error: cacheStatus.error || "Unknown error",
      });
    }


   // res.status(200).json({ data: update });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Update operation unsuccessful", details: error.message });
  }
};
