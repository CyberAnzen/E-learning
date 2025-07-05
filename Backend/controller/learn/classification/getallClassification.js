//const ClassificationModel = require("../../../model/ClassificationModel");
//const Lesson = require("../../../model/LessonModel");
const cacheManager=require('../../../cache/cacheManager')
const customError=require('../../../utilies/customError')

exports.getallClassification = async (req, res) => {
  try {
    const cacheData=cacheManager.getCache('classificationCache')
    if(!cacheData || !Array.isArray(cacheData.data)){
      throw new customError("No classification found",404)
    }

    const classification=cacheData.data
    if(classification.length===0){
      return res.status(404).json({
                success: false,
                message: 'No classificaton found'
            });
    }

     
    res.status(200).json({
      success: true,
       data: { overallProgress: 50, classification } });
  } catch (error) {
    console.error("Failed to fetch classifications with counts:", error);
    res
      .status(500)
      .json({ 
        success: false,
        error: "Error fetching classifications and lesson counts" });
  }
};
