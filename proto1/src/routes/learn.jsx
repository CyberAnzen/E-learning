import React from "react";
import {
  BookOpen,
  Network,
  Shield,
  Lock,
  Brain,
  Code,
  BarChart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Mock data - in a real app this would come from your backend
const courses = [
  {
    id: 1,
    title: "Network Security",
    description:
      "Learn about securing networks and preventing unauthorized access.",
    icon: Network,
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    category: "Security",
  },
  {
    id: 2,
    title: "Ethical Hacking",
    description:
      "Discover techniques used by ethical hackers to identify vulnerabilities.",
    icon: Shield,
    progress: 30,
    totalLessons: 15,
    completedLessons: 4,
    category: "Security",
  },
  {
    id: 3,
    title: "Cryptography",
    description: "Understand encryption and secure communication principles.",
    icon: Lock,
    progress: 45,
    totalLessons: 10,
    completedLessons: 5,
    category: "Security",
  },
  {
    id: 4,
    title: "AI Security",
    description:
      "Learn about securing AI systems and preventing adversarial attacks.",
    icon: Brain,
    progress: 20,
    totalLessons: 8,
    completedLessons: 2,
    category: "AI",
  },
  {
    id: 5,
    title: "Secure Coding",
    description: "Master the principles of writing secure and robust code.",
    icon: Code,
    progress: 80,
    totalLessons: 14,
    completedLessons: 11,
    category: "Development",
  }, //bg-gradient-to-br from-gray-900 to-gray-800
];

function LearnPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black ">
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
              <p className="text-xl font-semibold text-white">48%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <div
                key={course.id}
                className="group relative bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
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

                <h2 className="text-xl font-semibold text-white mb-2">
                  {course.title}
                </h2>
                <p className="text-gray-400 mb-4">{course.description}</p>

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

                <button
                  onClick={() => {
                    navigate(`/learn/${course.id}`);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex hover:cursor-pointer items-center justify-center bg-cyan-500/10 rounded-xl"
                >
                  {/*   <span className="px-4 py-2 bg-cyan-500 text-white rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Continue Learning
                  </span>*/}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default LearnPage;
