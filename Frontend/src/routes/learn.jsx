import React, { useState, useEffect, useRef } from "react";
import { BookOpen, BarChart } from "lucide-react";
import { useNavigate,  } from "react-router-dom";
import CourseCard from "../components/Learn/CourseCard";
import CourseCardSkeleton from "../components/Learn/CourseSkeleton";
import AddCourse from "../components/Admin/Learn/AddClassification";
import ModifyClassification from "../components/Admin/Learn/ModifyClassification";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const LessonNum = "6857f03a773f44b68582060b";
/**
 * Learning Center page component
 * Displays courses with loading skeletons and progress tracking
 */
const LearnPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const retryTimeoutRef = useRef(null);
  const isadmin = true;
  const loadCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${BACKEND_URL}/classification/`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const { data } = await response.json();
      const transformedCourses = (data.results || []).map((course) => ({
        id: course._id,
        title: course.title,
        description: course.description,
        icon: course.icon,
        category: course.category,
        progress: course.progress || 0,
        completedLessons: course.completedLessons || 0,
        totalLessons: course.lessonCount || 0,
      }));
      setCourses(transformedCourses);
      setOverallProgress(data.overallProgress || 0);
      setError(null); // Clear error on success
      clearTimeout(retryTimeoutRef.current); // Clear any scheduled retry
      setIsLoading(false); // Stop loading only on success
    } catch (err) {
      console.error("Error fetching courses:", err);
      // Schedule an auto-retry after 5 seconds
      retryTimeoutRef.current = setTimeout(() => {
        loadCourses();
      }, 5000);
    }
  }; // Scroll to top and disable page scrolling on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Fetch courses on component mount and cleanup on unmount
  useEffect(() => {
    loadCourses();
    return () => {
      clearTimeout(retryTimeoutRef.current); // Cleanup to prevent memory leaks
    };
  }, []);

  // Handle course navigation
  const handleCourseClick = (courseId) => {
    navigate(`/lesson/${courseId}/${LessonNum}`);
  };

  // Handle manual retry (optional, kept for user control)
  const handleRetry = () => {
    clearTimeout(retryTimeoutRef.current); // Cancel any scheduled retry
    loadCourses(); // Trigger immediate retry
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 mt-22 to-black">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          {/* Header section */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                Learning Center
              </h1>
              <p className="text-gray-400">
                Explore our comprehensive cybersecurity courses
              </p>
            </div>
            {/* Overall progress indicator */}
            <div className="hidden sm:flex items-center gap-4">
              <BarChart className="w-6 h-6 text-gray-400" />
              <div className="text-right">
                <p className="text-sm text-gray-400">Overall Progress</p>
                {isLoading ? (
                  <div className="w-12 h-6 bg-gray-600 rounded animate-pulse"></div>
                ) : (
                  <p className="text-xl font-semibold text-white">
                    {overallProgress}%
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Retry feedback
          {error && isLoading && (
            <div className="mb-8 p-4 bg-yellow-900/50 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-300">{error}</p>
              <button
                onClick={handleRetry}
                className="mt-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200"
              >
                Retry Now
              </button>
            </div>
          )} */}
          {/* Course grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!isadmin ? (
              isLoading ? (
                Array.from({ length: 9 }).map((_, index) => (
                  <CourseCardSkeleton key={index} />
                ))
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onCourseClick={handleCourseClick}
                  />
                ))
              ) : null
            ) : isLoading ? (
              Array.from({ length: 9 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))
            ) : (
              <>
                {" "}
                <AddCourse handleRetry={handleRetry} />
                {courses.map((course) => (
                  <ModifyClassification
                    key={course.id}
                    course={course}
                    handleRetry={handleRetry}
                    onCourseClick={handleCourseClick}
                  />
                ))}
              </>
            )}
          </div>
          {/* Empty state */}
          {!isLoading && courses.length === 0 && !isadmin && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No courses available
              </h3>
              <p className="text-gray-500">
                Check back later for new learning opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
