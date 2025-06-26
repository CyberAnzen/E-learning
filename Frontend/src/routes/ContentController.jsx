// File: src/components/ContentController.jsx

import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/sidebar/Sidebar";
import Content from "./content";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Terminal, Lock, Brain, Code } from "lucide-react"; // Import icons for chapters
import "../content.css";

// Backend URL from environment variables (e.g., Vite's import.meta.env)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Function to assign icons based on lesson number
const getIconForLesson = (lessonNum) => {
  const icons = [Shield, Terminal, Lock, Brain, Code];
  return icons[lessonNum % icons.length]; // Cycle through icons
};

const ContentController = () => {
  const { ClassificationId, LessonId } = useParams(); // Get chapter ID from URL
  const navigate = useNavigate(); // For URL navigation
  const [courseData, setCourseData] = useState([]); // Store fetched data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  // Fetch data from the endpoint
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `${BACKEND_URL}/classification/sidebar/${ClassificationId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }
        const { data } = await response.json();

        // Transform fetched data to match Sidebar's expected structure
        const transformedData = data.map((lesson) => ({
          id: lesson._id,
          chapter: lesson.lesson,
          icon: getIconForLesson(lesson.lessonNum), // Assign an icon
          completed: false, // Default value (no completion data in API)
        }));

        setCourseData(transformedData);
      } catch (err) {
        setError("Failed to load course data. Please try again.");
        console.error("Error fetching course data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, []); // Empty dependency array: fetch once on mount

  // Derive the current chapter from the URL `id`
  const currentChapter = courseData.find((chapter) => chapter.id === LessonId);
  // Redirect to the first chapter if `id` is missing or invalid
  useEffect(() => {
    if (courseData.length > 0 && (!LessonId || !currentChapter)) {
      navigate(`/lesson/${ClassificationId}/${courseData[0].id}`);
    }
  }, [LessonId, navigate, courseData, currentChapter, ClassificationId]);

  // Handler: when the user clicks a chapter tile in Sidebar
  const handleChapterSelect = (chapterItem) => {
    navigate(`/lesson/${ClassificationId}/${chapterItem.id}`);
  };

  return (
    <div className="flex max-h-full overflow-hidden">
      {/* Sidebar: passes courseData, currentChapter, and selection callback */}
      <Sidebar
        isPreview={false}
        courseData={courseData}
        currentChapter={currentChapter || {}}
        onChapterSelect={handleChapterSelect}
        title="Course Contents"
        ClassificationId={ClassificationId}
      />
      {/* Main Content: renders based on loading, error, or chapter selection */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            {error}
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
