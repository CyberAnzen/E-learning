const ClassificationModel = require("../../../model/ClassificationModel");
const dataCache=require('../../../cache/structure/dataCache')
const cacheManager = require('../../../cache/cacheManager');
const fetchClassification = require("../../../cache/fetchers/fetchClassification");


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
    let cacheStatus = await cacheManager.refreshCache('classificationCache');

    if (cacheStatus.success) {
      console.log('Cache refreshed successfully and classification created:');
      return res.status(201).json({
        success: true,
        message: "Classification created successfully and cache refreshed",
        data: newClassification,
      });
    }
    else if (!cacheStatus.success && cacheStatus.statusCode === 404) {
      cacheStatus = await cacheManager.registerCache('classificationCache', dataCache, fetchClassification);
      if (cacheStatus.success) {
        console.log('New classificationCache created successfully and classification created:');
        return res.status(201).json({
          success: true,
          message: "Classification created successfully and cache refreshed",
          data: newClassification,
        });
      } else {
        console.error("Cache refresh failed_1:", cacheStatus.error);
        return res.status(500).json({
          success: false,
          message: "creating classification created, but cache refresh failed",
          error: cacheStatus.error || "Unknown error",
        });
      }
    } else {
      console.error("Cache refresh failed:", cacheStatus.message);
      return res.status(cacheStatus.statusCode).json({
        success: false,
        message: "Creating classification created, but cache refresh failed",
        error: cacheStatus.error || "Unknown error",
      });
    }
  } catch (error) {
    console.error("Error creating classification:", error);
    res.status(500).json({
      message: "Server error while creating classification",
      error: error.message || "Unknown error",
    });
  }
};
