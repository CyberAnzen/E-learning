import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

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
import AdminEditor from "../components/Admin/Content/adminEditor";
import { AppContext, AppContextProvider } from "../context/AppContext";
import AdminButtons from "../components/Admin/Content/AdminButtons";
import DeleteModal from "../components/Admin/layout/DeleteModal";
// Define backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Content = ({
  selectedChapterId,
  isPreview = false,
  PreviewData,
  PreviewScreen = false,
  ClassificationId,
  focusedSection,
}) => {
  const { id } = useParams(); // Get chapter ID from URL
  //------AppContext Variable------------------------
  const { Admin } = useContext(AppContext);
  const { LearnAdd, setLearnAdd } = useContext(AppContext);
  const { classificationId, setClassificationId } = useContext(AppContext); //globally storing the Classification ID

  //------Delete Modal States-----------------------------------
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
  useEffect(() => {
    if (selectedChapterId == null) setselectedChapterId();
  }, []);

  // Function to transform API response to match expected structure
  const transformLessonData = (data) => {
    // Ensure tasks is always an array
    const tasksArray = Array.isArray(data.tasks) ? data.tasks : [data.tasks];
    return {
      id: data._id,
      classsificationID: data.classificationId,
      chapter: data.lesson,
      icon: data.icon || "Shield",
      completed: false,
      content: data.content,
      tasks: tasksArray.map((task, index) => ({
        id: task.id || task._id,
        title: task.title || `Task ${index + 1}`,
        completed: task.completed || false,
        content: {
          description: task.content.description,
          objectives: task.content.objectives,
          mainContent:
            task.content.mainContent || task.content.maincontent || "",
          questions: Array.isArray(task.content.questions)
            ? task.content.questions.map((q) => ({
                ...q,
                id: q.id || q._id,
              }))
            : [],
        },
      })),
    };
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/lesson/delete/${selectedChapterId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete lesson");
      }

      // Close modal and trigger refresh
      setShowDeleteConfirm(false);
      setIsDeleting(false);
      handleRetry();
    } catch (error) {
      console.error("Delete API Error:", error.message);
      setIsDeleting(false);
      // You might want to show an error message to the user
    }
  };
  // ─── EFFECT: Fetch lesson data when selectedChapterId changes ───────────
  // Create reusable UI reset function
  const resetUIState = () => {
    if (!isPreview) {
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
  };
  //-----------EFFECT: for the Preview in the Admin panel to force open sections in fullscreen based on focus field
  // In Content.jsx
  useEffect(() => {
    if (Admin && isPreview) {
      if (focusedSection === null) {
        setFullScreenSection(null);
        setActiveSection(null);
        setShowQuestionInterface(false);
      } else if (focusedSection === "mainContent") {
        setFullScreenSection("content");
      } else if (focusedSection === "questions") {
        setShowQuestionInterface(true);
      } else if (focusedSection === "objectives") {
        setActiveSection("objectives");
      }
    }
  }, [focusedSection]);

  // ─── EFFECT: Fetch lesson data when dependencies change ───────────
  useEffect(() => {
    if (selectedChapterId == null && !isPreview) return;

    let isMounted = true;

    const fetchOrProcessData = async () => {
      try {
        if (isPreview && PreviewData) {
          // PREVIEW MODE: Use directly passed preview data
          const fullChapter = transformLessonData(PreviewData);
          if (isMounted) {
            setCurrentChapter(fullChapter);
            if (fullChapter.tasks.length > 0) {
              setCurrentTask(fullChapter.tasks[0]);
            } else {
              setCurrentTask(null);
            }
            resetUIState();
          }
        } else if (selectedChapterId && ClassificationId) {
          // LIVE MODE: Fetch data from backend
          const response = await fetch(
            `${BACKEND_URL}/lesson/${ClassificationId}/${selectedChapterId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch lesson data");
          }

          const { data } = await response.json();
          if (isMounted) {
            // Update global classification ID if needed
            if (classificationId !== selectedChapterId) {
              setClassificationId(selectedChapterId);
            }

            const fullChapter = transformLessonData(data);
            setCurrentChapter(fullChapter);
            if (fullChapter.tasks.length > 0) {
              setCurrentTask(fullChapter.tasks[0]);
            } else {
              setCurrentTask(null);
            }
            resetUIState();
          }
        }
      } catch (error) {
        console.error("Data loading error:", error);
        // Optionally set an error state to display to the user
      }
    };

    fetchOrProcessData();

    // Cleanup to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [
    selectedChapterId,
    isPreview,
    PreviewData,
    ClassificationId,
    setClassificationId,
  ]);
  // console.log(currentChapter.classsificationID);

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
    if (isPreview) {
      return; // Skip reset in preview mode
    }
    setSubmitted(false);
    setAnswers({});
    setCurrentStep(0);
    setCompletedSteps([]);
    setActiveSection(null);
    setFullScreenSection(null);
    setShowQuestionInterface(false);
  }, [currentTask, isPreview]);

  // ─── EFFECT: Listen for scroll to toggle `scrolled` ───────────────────────
  // useEffect(() => {
  //   const handleScroll = () => setScrolled(window.scrollY > 20);
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     setLearnAdd(false);
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    // Prevent scrolling
    document.body.style.overflow = "auto";
    document.body.style.position = "auto";
    document.documentElement.style.overflow = "auto";

    // Optional: Prevent touchmove to block scrolling more robustly
    const preventTouchMove = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.documentElement.style.overflow = "";
      document.removeEventListener("touchmove", preventTouchMove);
    };
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
    return !isPreview && currentChapter
      ? currentChapter.chapter.toLowerCase().replace(/\s+/g, "_")
      : "";
  };

  // Loading state
  if (!currentChapter || !currentTask) {
    return (
<div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No courses available
              </h3>
              <p className="text-gray-500">
                Check back later for new learning opportunities.
              </p>
            </div>
    );
  }

  const taskIdx = currentChapter.tasks.findIndex(
    (t) => t.id === currentTask.id
  );
  const isFirstTask = taskIdx === 0;
  const isLastTask = taskIdx === currentChapter.tasks.length - 1;
  // console.log(currentTask.content.mainContent);

  // ─── JSX RETURN ──────────────────────────────────────────────────────────

  // //  ADMIN LAYOUT MOUNTING
  // if (!isPreview && LearnAdd && Admin) {
  //   return <AdminEditor />;
  // } //Users Component
  {
    return (
      <section
        className={`bg-gradient-to-br from-black via-gray-900 to-black ${
          isPreview ? "mt-0 " : "mt-23"
        } min-h-screen  relative`}
      >
        {Admin && !isPreview && (
          // 1) Absolute wrapper takes no space in the document flow
          <div className="absolute inset-2 pointer-events-none">
            {/* 
      2) This inner div is the only one in the flow of scrolling; 
         it sits at the top of the page and scrolls normally.
    */}
            <div className="sticky top-1/6 md:top-1/7 lg:top-[20%] flex justify-end pointer-events-auto z-10">
              {/* 
        3) Margin-right to pull it in from the edge, gap-2 to space buttons
      */}
              <div className="mr-10 flex gap-2">
                <AdminButtons setShowDeleteConfirm={setShowDeleteConfirm} />
              </div>
            </div>
          </div>
        )}
        {/*Header */}
        <ContentHeader
          currentChapter={currentChapter}
          scrolled={scrolled}
          taskProgress={taskProgress}
        />
        {/*Radar and Main content  */}
        <div
          className={`flex flex-col gap-8 px-4 py-8 max-w-7xl mx-auto ${
            PreviewScreen ? "w-screen" : "lg:flex-row"
          }`}
        >
          <ChapterProgress
            overallProgress={overallProgress}
            tasks={currentChapter.tasks}
            currentTaskId={currentTask.id}
            PreviewScreen={PreviewScreen}
          />

          <div
            className={`w-full ${PreviewScreen ? "" : "lg:w-7/12"} order-2 ${
              PreviewScreen ? "" : "lg:order-1"
            }`}
          >
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
                        {currentTask.content.objectives.map(
                          (objective, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 bg-gray-700/30 rounded"
                            >
                              <DotSquare className="w-5 h-5 text-green-400" />
                              <span className="text-gray-200">{objective}</span>
                            </div>
                          )
                        )}
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
                text-xl duration-200 text-white flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
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
              <div
                className={`mt-8 flex flex-col ${
                  PreviewScreen ? "" : "sm:flex-row"
                } gap-4 justify-between items-center`}
              >
                <div
                  className={`flex gap-4 w-full ${
                    PreviewScreen ? "" : "sm:w-auto"
                  }`}
                >
                  <button
                    onClick={navigateToPrevious}
                    disabled={isFirstTask}
                    className={`flex-1 ${
                      PreviewScreen ? "" : "sm:flex-none"
                    } px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600
            transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
                  >
                    <ChevronLeft className="w-5 h-5" /> Previous
                  </button>
                  <button
                    onClick={navigateToNext}
                    disabled={isLastTask}
                    className={`flex-1 ${
                      PreviewScreen ? "" : "sm:flex-none"
                    } px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600
            transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
                  >
                    Next <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                {!Admin && (
                  <div
                    className={`flex justify-end w-full ${
                      PreviewScreen ? "" : "sm:w-auto"
                    }`}
                  >
                    <SubmitButton
                      isSubmitted={submitted}
                      completedSteps={completedSteps}
                      totalObjectives={currentTask.content.objectives.length}
                      onSubmit={handleSubmit}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/*FullScreen components*/}
        <AnimatePresence>
          {fullScreenSection === "content" && (
            <FullScreenReader
              section="content"
              content={
                <>
                  {/* <div className="mb-8 rounded-xl overflow-hidden  shadow-2xl max-w-[70%] mx-auto">
                      <img
                        src={currentChapter.content.image}
                        alt={currentChapter.content.title}
                        className="w-full rounded-xl h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
                      />
                    </div> */}
                  <div className="prose prose-invert max-w-[95%] mx-auto">
                    <center>
                      <h1 className="md:text-5xl lg:text-5xl xl:text-4xl font-extrabold mb-7">
                        {currentChapter.content.title}
                      </h1>
                    </center>
                    <main
                      className="leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: currentTask.content.mainContent,
                      }}
                    />
                    {/* <div>{currentTask.content.mainContent}</div> */}
                  </div>
                </>
              }
              title="Chapter Content"
              icon={<Lightbulb className="w-6 h-6 text-yellow-400" />}
              onClose={handleCloseFullScreen}
              isPreview={isPreview}
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
          isPreview={isPreview}
        />
        {/*Delete pop up Modal Component*/}
        <DeleteModal
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          isDeleting={isDeleting}
          handleDelete={handleDelete}
          modaltitle="Delete Classification"
          message={
            <div>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-white">
                {currentChapter?.chapter}
              </span>
              ? This action{" "}
              <span className="font-semibold text-red-400">cannot</span> be
              undone.
            </div>
          }
        />{" "}
      </section>
    );
  }
};

export default Content;
