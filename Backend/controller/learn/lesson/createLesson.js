const LessonModel = require("../../../model/LessonModel");
const ClassificationModel = require("../../../model/ClassificationModel");
const { normalizeImagePaths } = require("./Normalizer/normalizeImagePaths");
const {
  normalizeMediaUrls,
} = require("./Normalizer/HTMLNormalizer.js");
const { deletePublicFiles } = require("./helper/deletePublicFiles ");

exports.createLesson = async (req, res) => {
  try {
    const { classificationId, content = {}, tasks = {} } = req.body;
    const lessonNum = Number(req.body.lessonNum);

    if (!classificationId) {
      return res.status(400).json({ message: "classificationId is required" });
    }

    // 1) classification exists?
    const classificationExists = await ClassificationModel.exists({
      _id: classificationId,
    });
    if (!classificationExists) {
      return res.status(404).json({ message: "Invalid classificationId" });
    }

    // 3) normalize your addedImages → images_URL
    const images_URL = normalizeImagePaths(req.body.addedImages || []);

    // 4) normalize only the tasks.content.mainContent
    const normalizedTasks = {
      ...tasks,
      content: {
        ...(tasks.content || {}),
        mainContent: normalizeMediaUrls(tasks.content?.mainContent || ""),
      },
    };

    // 5) build the payload matching your schema
    const payload = {
      classificationId,
      lessonNum,
      lesson: req.body.lesson,
      icon: req.body.icon,
      images_URL,
      content, // leave content untouched
      tasks: normalizedTasks,
    };

    // 6) create & save
    const lesson = await LessonModel.create(payload);
    if (!lesson) {
      return res.status(500).json({ message: "Failed to create lesson" });
    }

    // 7) respond
    res.status(200).json({ message: "Lesson created successfully", lesson });
    //Post Cleanup
    const All_URL = normalizeImagePaths(req.body.allImages || []);
    const addedSet = new Set(images_URL);
    const removed = All_URL.filter((u) => !addedSet.has(u));
    await deletePublicFiles(removed);
  } catch (error) {
    console.error("Lesson creation error:", error);
    return res.status(400).json({ message: "Lesson Not Created", error });
  }
};
