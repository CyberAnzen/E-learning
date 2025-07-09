// src/pages/LearnPage.jsx
import React, { useEffect } from "react";
import { BookOpen, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CourseCard from "../components/Learn/CourseCard";
import CourseCardSkeleton from "../components/Learn/CourseSkeleton";
import AddCourse from "../components/Admin/Learn/AddClassification";
import ModifyClassification from "../components/Admin/Learn/ModifyClassification";
import { useAppContext } from "../context/AppContext";
import Usefetch from "../hooks/Usefetch";

const LessonNum = "6857f03a773f44b68582060b";

const LearnPage = () => {
  const navigate = useNavigate();
  const { fp } = useAppContext();
  const isAdmin = true;

  const { Data, loading } = Usefetch("classification", "get", null, {
    "x-client-fp": fp,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const courses = (Data?.classification || []).map((c) => ({
    id: c._id,
    title: c.title,
    description: c.description,
    icon: c.icon,
    category: c.category,
    progress: c.progress || 0,
    completedLessons: c.completedLessons || 0,
    totalLessons: c.lessonCount || 0,
  }));

  const overallProgress = Data?.overallProgress || 0;

  const handleCourseClick = (id) => navigate(`/lesson/${id}/${LessonNum}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black mt-22">
      <div className="container mx-auto px-4 sm:px-6 py-12">
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
          <div className="hidden sm:flex items-center gap-4">
            <BarChart className="w-6 h-6 text-gray-400" />
            <div className="text-right">
              <p className="text-sm text-gray-400">Overall Progress</p>
              {loading ? (
                <div className="w-12 h-6 bg-gray-600 rounded animate-pulse" />
              ) : (
                <p className="text-xl font-semibold text-white">
                  {overallProgress}%
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin ? (
            loading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))
            ) : (
              <>
                <AddCourse handleRetry={null} />
                {courses.map((course) => (
                  <ModifyClassification
                    key={course.id}
                    course={course}
                    handleRetry={null}
                    onCourseClick={handleCourseClick}
                  />
                ))}
              </>
            )
          ) : loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))
          ) : courses.length ? (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onCourseClick={handleCourseClick}
              />
            ))
          ) : null}
        </div>

        {!loading && courses.length === 0 && !isAdmin && (
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
  );
};

export default LearnPage;
