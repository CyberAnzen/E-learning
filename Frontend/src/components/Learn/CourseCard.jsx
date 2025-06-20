import React from "react";
import {
  GraduationCap,
  Cpu,
  Shield,
  Terminal,
  BookOpen,
  Brain,
  Lightbulb,
  Network,
  Code,
  Book,
  Globe,
  Server,
  Plus,
  Lock,
} from "lucide-react";

// Icon mapping for course icons
const iconMap = {
  Learning: GraduationCap,
  Tech: Cpu,
  Cybersecurity: Shield,
  Coding: Terminal,
  Knowledge: BookOpen,
  Brain: Brain,
  Ideas: Lightbulb,
  Networks: Network,
  Code: Code,
  Books: Book,
  Web: Globe,
  Server: Server,
  Security: Lock,
  Bulb: Brain, // Map Bulb to Brain, as per the example
};

/**
 * Individual course card component
 * Displays course information with interactive hover effects
 */
const CourseCard = ({ course, onCourseClick }) => {
  const Icon = iconMap[course.icon] || Code;

  return (
    <div className="group relative bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      {/* Header with icon and progress */}
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-gray-700/50 rounded-lg">
          <Icon className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-lg font-semibold text-white">
            {course.progress}%
          </span>
        </div>
      </div>

      {/* Course title and description */}
      <h2 className="text-xl font-semibold text-white mb-2">{course.title}</h2>
      <p className="text-gray-400 mb-4">{course.description}</p>

      {/* Progress bar and stats */}
      <div className="mt-auto">
        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">
            {course.completedLessons} of {course.totalLessons} lessons
          </span>
          <span className="text-cyan-400">{course.category}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <button
        onClick={() => onCourseClick(course.id)}
        className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex hover:cursor-pointer items-center justify-center bg-cyan-500/10 rounded-xl"
        aria-label={`Continue learning ${course.title}`}
      >
        {/* <span className="px-4 py-2 bg-cyan-500 text-white rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          Continue Learning
        </span> */}
      </button>
    </div>
  );
};

export default CourseCard;
