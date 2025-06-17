import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  Flag,
  Target,
  Lightbulb,
  DotSquare,
  Terminal,
  MoveRightIcon,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CollapsibleSection from "../components/content/colapsable";
import FullScreenReader from "../components/content/FullscreenReader";
import QuestionInterface from "../components/content/AnswerPage/QuestionInterface";
import TerminalDesign from "../components/content/Terminal";
import SubmitButton from "../components/content/SubmitButton";
import ContentHeader from "../components/content/ContentHeader";
import ChapterProgress from "../components/content/ChapterProgress";
import "../content.css";

// Define backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Content = ({ selectedChapterId, isPreview = false }) => {
  // ─── State Variables ─────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState(null);
  const [fullScreenSection, setFullScreenSection] = useState(null);
  const [showQuestionInterface, setShowQuestionInterface] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [answers, setAnswers] = useState({});
  const [ip, setIp] = useState(
    "192.168.0." + Math.floor(Math.random() * 100 + 1)
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [objectivesOpened, setObjectivesOpened] = useState(false);
  const [contentOpened, setContentOpened] = useState(false);
  const [overallProgress, setOverallProgress] = useState({
    percentage: 0,
    completed: 0,
    total: 0,
  });

  // Function to transform API response to match expected structure
  const transformLessonData = (data) => {
    return {
      id: data._id,
      chapter: data.lesson,
      icon: data.icon || "Shield", // Default icon if null
      completed: false, // Progress not provided by API
      content: data.content,
      tasks: data.tasks.content.map((task, index) => ({
        id: task._id,
        title: `Task ${index + 1}`, // API doesn't provide task titles
        completed: false, // Progress not provided by API
        content: {
          description: task.description,
          objectives: task.objectives,
          mainContent: task.mainContent,
          // Ensure questions have proper IDs
          questions: task.questions.map((q) => ({
            ...q,
            id: q._id, // Map MongoDB _id to expected id property
          })),
        },
      })),
    };
  };

  // ─── EFFECT: Fetch lesson data when selectedChapterId changes ───────────
  useEffect(() => {
    if (selectedChapterId == null) return;

    let isMounted = true;

    const fetchLesson = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/lesson/${selectedChapterId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch lesson data");
        }
        const { data } = await response.json();
        if (isMounted) {
          const fullChapter = transformLessonData(data);
          setCurrentChapter(fullChapter);
          if (fullChapter && fullChapter.tasks.length > 0) {
            setCurrentTask(fullChapter.tasks[0]);
          } else {
            setCurrentTask(null);
          }
          // Reset UI state on chapter change
          setActiveSection(null);
          setFullScreenSection(null);
          setShowQuestionInterface(false);
          setTaskProgress(0);
          setSubmitted(false);
          setAnswers({});
          setCurrentStep(0);
          setCompletedSteps([]);
          setObjectivesOpened(false);
          setContentOpened(false);
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
        // Optionally set an error state to display to the user
      }
    };

    fetchLesson();

    // Cleanup to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [selectedChapterId]);

  // ─── EFFECT: Recalculate taskProgress when currentChapter changes ─────────
  useEffect(() => {
    if (!currentChapter) return;
    const completedCount = currentChapter.tasks.filter(
      (t) => t.completed
    ).length;
    const percentage = Math.round(
      (completedCount / currentChapter.tasks.length) * 100
    );
    setTaskProgress(percentage);
    setOverallProgress({
      percentage,
      completed: completedCount,
      total: currentChapter.tasks.length,
    });
  }, [currentChapter]);

  // ─── EFFECT: Reset answers & steps when currentTask changes ────────────────
  useEffect(() => {
    setSubmitted(false);
    setAnswers({});
    setCurrentStep(0);
    setCompletedSteps([]);
  }, [currentTask]);

  // ─── EFFECT: Listen for scroll to toggle `scrolled` ───────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── EFFECT: Fetch public IP once on mount ───────────────────────────────
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => {});
  }, []);

  // ─── HANDLERS ─────────────────────────────────────────────────────────────
  const handleAnswerSubmit = (questionId, answerValue) => {
    setAnswers((prev) => ({
      ...prev,
      [`${currentTask.id}-${questionId}`]: answerValue,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log("Submitted answers for task:", currentTask.id, answers);
  };

  const handleStepComplete = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps((prev) => [...prev, stepIndex]);
    }
    if (stepIndex < currentTask.content.objectives.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const isStepLocked = (stepIndex) => {
    if (stepIndex === 0) return false;
    return !completedSteps.includes(stepIndex - 1);
  };

  const navigateToNext = () => {
    if (!currentChapter || !currentTask) return;
    const idx = currentChapter.tasks.findIndex((t) => t.id === currentTask.id);
    if (idx < currentChapter.tasks.length - 1) {
      setCurrentTask(currentChapter.tasks[idx + 1]);
    }
  };

  const navigateToPrevious = () => {
    if (!currentChapter || !currentTask) return;
    const idx = currentChapter.tasks.findIndex((t) => t.id === currentTask.id);
    if (idx > 0) {
      setCurrentTask(currentChapter.tasks[idx - 1]);
    }
  };

  const handleOpenFullScreen = (section) => {
    setFullScreenSection(section);
    document.body.style.overflow = "hidden";
    if (section === "content") {
      setContentOpened(true);
    }
  };

  const handleCloseFullScreen = () => {
    setFullScreenSection(null);
    document.body.style.overflow = "auto";
  };

  const handleOpenQuestionInterface = () => {
    setShowQuestionInterface(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseQuestionInterface = () => {
    setShowQuestionInterface(false);
    document.body.style.overflow = "auto";
  };

  const getChapterPath = () => {
    return currentChapter
      ? currentChapter.chapter.toLowerCase().replace(/\s+/g, "_")
      : "";
  };

  // Loading state
  if (!currentChapter || !currentTask) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading chapter…
      </div>
    );
  }

  const taskIdx = currentChapter.tasks.findIndex(
    (t) => t.id === currentTask.id
  );
  const isFirstTask = taskIdx === 0;
  const isLastTask = taskIdx === currentChapter.tasks.length - 1;

  // ─── JSX RETURN ──────────────────────────────────────────────────────────
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-black mt-23 min-h-screen relative">
      <ContentHeader
        currentChapter={currentChapter}
        scrolled={scrolled}
        taskProgress={taskProgress}
      />
      <div className="flex flex-col lg:flex-row gap-8 px-4 py-8 max-w-7xl mx-auto">
        <ChapterProgress
          overallProgress={overallProgress}
          tasks={currentChapter.tasks}
          currentTaskId={currentTask.id}
        />
        <div className="w-full lg:w-7/12 order-2 lg:order-1">
          <main className="flex justify-center">
            <div className="bg-gray-800/30 rounded-xl w-full max-w-3xl p-6 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
              <div className="mb-6 font-mono text-green-400">
                <div className="flex items-center gap-3 mb-6">
                  <Flag className="w-6 h-6 text-green-400" />
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Task {currentTask.id.split("-")[1]}: {currentTask.title}
                  </h2>
                </div>
                <div className="overflow-y-auto pr-2">
                  <CollapsibleSection
                    title={
                      <div className="relative flex justify-center items-center w-full">
                        <Target className="w-5 h-5 text-blue-400" />
                        <span className="ml-2">Learning Objectives</span>
                        {objectivesOpened && (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        )}
                      </div>
                    }
                    isOpen={activeSection === "objectives"}
                    onToggle={() => {
                      const next =
                        activeSection === "objectives" ? null : "objectives";
                      setActiveSection(next);
                      if (next === "objectives") setObjectivesOpened(true);
                    }}
                  >
                    <div className="space-y-2">
                      {currentTask.content.objectives.map((objective, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 p-2 bg-gray-700/30 rounded"
                        >
                          <DotSquare className="w-5 h-5 text-green-400" />
                          <span className="text-gray-200">{objective}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                  <div
                    className="border border-gray-700/50 rounded-lg overflow-hidden mb-4 cursor-pointer"
                    onClick={() => {
                      setActiveSection(null);
                      handleOpenFullScreen("content");
                    }}
                  >
                    <div
                      className="cyber-button w-full px-4 py-3 bg-transparent border border-[#01ffdb]/20
                      font-medium rounded-lg hover:bg-transparent transition-all font-mono relative overflow-hidden
                      text-xl  duration-200 text-white flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center justify- gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-medium">
                          Chapter Content
                        </span>
                        {contentOpened && (
                          <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                        )}
                      </div>
                      <MoveRightIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-700/50 rounded-lg overflow-hidden mb-4">
                <button
                  onClick={() => {
                    setActiveSection(null);
                    handleOpenQuestionInterface();
                  }}
                  className="cyber-button w-full px-4 py-3 bg-[#01ffdb]/10 border border-[#01ffdb]/50
                  font-medium rounded-lg hover:bg-[#01ffdb]/20 transition-all font-mono relative overflow-hidden
                  text-xl duration-200 text-white flex items-center gap-3"
                >
                  <Terminal className="w-5 h-5 text-white" />
                  <span className="font-medium">Answer Questions</span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-gray-200">
                      {
                        Object.keys(answers).filter((key) =>
                          key.startsWith(currentTask.id)
                        ).length
                      }
                      /{currentTask.content.questions.length}
                    </span>
                    {submitted && (
                      <CheckCircle className="w-4 h-4 text-green-200" />
                    )}
                    <MoveRightIcon className="w-5 h-5 text-white" />
                  </div>
                </button>
              </div>
            </div>
          </main>
          {!isPreview && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={navigateToPrevious}
                  disabled={isFirstTask}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600
                  transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                <button
                  onClick={navigateToNext}
                  disabled={isLastTask}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600
                  transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-end w-full sm:w-auto">
                <SubmitButton
                  isSubmitted={submitted}
                  completedSteps={completedSteps}
                  totalObjectives={currentTask.content.objectives.length}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {fullScreenSection === "content" && (
          <FullScreenReader
            section="content"
            content={
              <>
                <div className="mb-8 rounded-xl overflow-hidden shadow-2xl max-w-[70%] mx-auto">
                  <img
                    src={currentChapter.content.image}
                    alt={currentChapter.content.title}
                    className="w-full rounded-xl h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
                  />
                </div>
                <div className="prose prose-invert max-w-[95%] mx-auto">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {currentTask.content.mainContent}
                  </p>
                </div>
              </>
            }
            title="Chapter Content"
            icon={<Lightbulb className="w-6 h-6 text-yellow-400" />}
            onClose={handleCloseFullScreen}
          />
        )}
      </AnimatePresence>

      <QuestionInterface
        isOpen={showQuestionInterface}
        onClose={handleCloseQuestionInterface}
        questions={currentTask?.content?.questions || []}
        answers={answers}
        onAnswerSubmit={handleAnswerSubmit}
        isSubmitted={submitted}
        ip={ip}
        chapterId={currentChapter?.id}
        chapterPath={getChapterPath()}
        lessonId={selectedChapterId}
      />
    </section>
  );
};

export default Content;
