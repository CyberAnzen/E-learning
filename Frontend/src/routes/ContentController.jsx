import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/sidebar/Sidebar";
import Content from "./content";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Terminal, Lock, Brain, Code, BookOpen } from "lucide-react";
import "../content.css";
import Usefetch from "../hooks/Usefetch";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getIconForLesson = (lessonNum) => {
  const icons = [Shield, Terminal, Lock, Brain, Code];
  return icons[lessonNum % icons.length];
};

const ContentController = () => {
  const { ClassificationId, LessonId } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState([]);

  const { Data, loading, error } = Usefetch(
    `classification/sidebar/${ClassificationId}`
  );

  useEffect(() => {
    if (Data && Array.isArray(Data.data)) {
      const transformedData = Data.data.map((lesson) => ({
        id: lesson._id,
        chapter: lesson.lesson,
        icon: getIconForLesson(lesson.lessonNum),
        completed: false,
      }));
      setCourseData(transformedData);
    }
  }, [Data]);

  const currentChapter = courseData.find((chapter) => chapter.id === LessonId);

  useEffect(() => {
    if (!loading && courseData.length > 0 && (!LessonId || !currentChapter)) {
      navigate(`/lesson/${ClassificationId}/${courseData[0].id}`, {
        replace: true,
      });
    }
  }, [
    loading,
    courseData,
    LessonId,
    currentChapter,
    ClassificationId,
    navigate,
  ]);

  const handleChapterSelect = (chapterItem) => {
    navigate(`/lesson/${ClassificationId}/${chapterItem.id}`);
  };

  return (
    <div className="flex max-h-full overflow-hidden">
      <Sidebar
        isPreview={false}
        courseData={courseData}
        currentChapter={currentChapter || {}}
        onChapterSelect={handleChapterSelect}
        title="Course Contents"
        ClassificationId={ClassificationId}
      />
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading...
          </div>
        ) : error ? (
          <div className="text-center h-screen flex flex-col justify-center">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No courses available
            </h3>
            <p className="text-gray-500">
              Check back later for new learning opportunities.
            </p>
          </div>
        ) : currentChapter ? (
          <Content
            selectedChapterId={LessonId}
            ClassificationId={ClassificationId}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No chapter selected or invalid chapter ID.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentController;
