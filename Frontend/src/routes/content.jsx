import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  CheckCircle,
  ChevronRight,
  Brain,
  Shield,
  Terminal,
  Menu,
  X,
  ChevronLeft,
  Medal,
  Flag,
  Target,
  AlertCircle,
  BookOpen,
  Lightbulb,
  Lock,
  Check,
  ChevronDown,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CollapsibleSection from "../components/content/colapsable";
import FullScreenReader from "../components/content/FullscreenReader";
import TerminalDesign from "../components/content/Terminal";
import SubmitButton from "../components/content/SubmitButton";
import Sidebar from "../components/layout/Sidebar";
// **Default Course Data**
const defaultCourseData = [
  {
    id: 1,
    chapter: "Introduction to Cybersecurity",
    icon: Shield,
    completed: true,
    content: {
      title: "Introduction to Cybersecurity",
      author: "Dr. Sarah Chen",
      duration: "45 minutes",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
    },
    tasks: [
      {
        id: "task-1",
        title: "Understanding Cyber Threats",
        completed: false,
        content: {
          description: `Learn about the fundamental concepts of cybersecurity and common threats in today's digital landscape.`,
          objectives: [
            "Understand the basics of cybersecurity",
            "Identify common cyber threats",
            "Learn basic security terminology",
          ],
          mainContent: `Before teaching you the technical hands-on aspects of ethical hacking, you'll need to understand more about what a penetration tester's job responsibilities are and what processes are followed in performing pentests.

The importance and relevancy of cybersecurity are ever-increasing and can be in every walk of life. News headlines fill our screens, reporting yet another hack or data leak.

Cybersecurity is relevant to all people in the modern world, including:
- Strong password policies to protect emails
- Business protection of devices and data
- Personal information security
- Network security

A Penetration test or pentest is an ethically-driven attempt to test and analyse security defences. It involves using the same tools and techniques that malicious actors might use, but for defensive purposes.

According to Security Magazine, a cybersecurity industry magazine, there are over 2,200 cyber attacks every day - 1 attack every 39 seconds.`,
          questions: [
            {
              id: "q1",
              text: "What is the primary goal of a penetration test?",
              type: "text",
              answer: "",
              hint: "Think about the ethical aspects and defensive nature of the activity",
            },
            {
              id: "q2",
              text: "How many cyber attacks occur daily according to Security Magazine?",
              type: "text",
              answer: "",
              hint: "The number is mentioned in the content - over 2,200",
            },
          ],
        },
      },
      {
        id: "task-2",
        title: "Basic Security Tools",
        completed: false,
        content: {
          description:
            "Introduction to essential security tools and their usage.",
          objectives: [
            "Learn about common security tools",
            "Understand basic tool usage",
            "Practice with sample scenarios",
          ],
          mainContent: "Content for basic security tools...",
          questions: [
            {
              id: "q3",
              text: "Name three essential security tools mentioned in the lesson",
              type: "text",
              answer: "",
              hint: "Look for tools mentioned in the scanning and monitoring sections",
            },
          ],
        },
      },
    ],
  },
  {
    id: 2,
    chapter: "Ethical Hacking Basics",
    icon: Terminal,
    completed: true,
    content: {
      title: "Getting Started with Penetration Testing",
      author: "Mark Rodriguez",
      duration: "60 minutes",
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2070",
    },
    tasks: [
      {
        id: "task-3",
        title: "Penetration Testing Basics",
        completed: false,
        content: {
          description:
            "Explore the fundamentals of ethical hacking and penetration testing.",
          objectives: ["Understand penetration testing basics"],
          mainContent: `Before teac.`,
          questions: [
            {
              id: "q4",
              text: "tsting.",
              type: "text",
              answer: "",
            },
            {
              id: "q4",
              text: "What is the difference between black hat and white hat hacking?",
              type: "text",
              answer: "",
            },
          ],
        },
      },
      {
        id: "task-3",
        title: "Penetration Testing Basics",
        completed: true,
        content: {
          description:
            "Explore the fundamentals of ethical hacking and penetration testing.",
          objectives: ["Understand penetration testing basics"],
          mainContent: "Content for penetration testing...",
          questions: [
            {
              id: "q4",
              text: "What is the difference asdfsdafffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffssssssssssbetween black hat and white hat hacking?",
              type: "text",
              answer: "",
            },
            {
              id: "q4",
              text: "What is the difference between black hat and white hat hacking?",
              type: "text",
              answer: "",
            },
          ],
        },
      },
      {
        id: "task-3",
        title: "Penetration Testing Basics",
        completed: true,
        content: {
          description:
            "Explore the fundamentals of ethical hacking and penetration testing.",
          objectives: ["Understand penetration testing basics"],
          mainContent: `Before teaching you the technical hands-on aspects of ethical hacking, you'll need to understand more about what a penetration tester's job responsibilities are and what processes are followed in performing pentests.

The importance and relevancy of cybersecurity are ever-increasing and can be in every walk of life. News headlines fill our screens, reporting yet another hack or data leak.

Cybersecurity is relevant to all people in the modern world, including:
- Strong password policies to protect emails
- Business protection of devices and data
- Personal information security
- Network security

A Penetration test or pentest is an ethically-driven attempt to test and analyse security defences. It involves using the same tools and techniques that malicious actors might use, but for defensive purposes.

According to Security Magazine, a cybersecurity industry magazine, there are over 2,200 cyber attacks every day - 1 attack every 39 seconds.`,
          questions: [
            {
              id: "q4",
              text: "What is the difference sdfdsfdsfasdfsadfsadfasdfsdfsadfsdafasdfsadfasdfasbetween black hat and white hat hacking?",
              type: "text",
              answer: "",
            },
            {
              id: "q4",
              text: "What is the difference between black hat and white hat hacking?",
              type: "text",
              answer: "",
            },
          ],
        },
      },
    ],
  },
];

// **Content Component**

const Content = ({ chapters = defaultCourseData, isPreview = false }) => {
  // **State Variables**
  const [activeSection, setActiveSection] = useState(null);
  const [fullScreenSection, setFullScreenSection] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(chapters[1]);
  const [currentTask, setCurrentTask] = useState(currentChapter.tasks[0]);
  const [taskProgress, setTaskProgress] = useState(0);
  const courseData = chapters;
  const [selectedChapter, setSelectedChapter] = useState(courseData[0]);
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [answers, setAnswers] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [ip, setIp] = useState(
    "192.168.0." + Math.floor(Math.random() * 100 + 1)
  );
  // New state for step tracking
  const [isDesktop, setIsDesktop] = useState(true);
  const [IsOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const isOpen = isPinned || isButtonHovered || isSidebarHovered;
  // **Effect Hooks**
  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setIp(data.ip))
      .catch(() => {
        // Keep the random IP if fetching fails
      });
  }, []);
  useEffect(() => {
    // Close all dropdowns
    setActiveSection(null);
    setSelectedChapter(currentChapter);

    // Scroll to top smoothly
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Optional: Reset step tracking for new chapter
    setCompletedSteps([]);
    setCurrentStep(0);
  }, [currentChapter]); // This will run whenever currentChapter changes

  useEffect(() => {
    const completedTasks = currentChapter.tasks.filter(
      (task) => task.completed
    ).length;
    const progress = Math.round(
      (completedTasks / currentChapter.tasks.length) * 100
    );
    setTaskProgress(progress);
  }, [currentChapter]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // **Functions**
  const handleAnswerSubmit = (taskId, questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [`${taskId}-${questionId}`]: answer,
    }));
  };

  const handleAnswerChange = (question, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    console.log("Submitted answers:", answers);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDesktopSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleStepComplete = (stepIndex) => {
    if (!completedSteps.includes(stepIndex)) {
      setCompletedSteps([...completedSteps, stepIndex]);
    }
    if (stepIndex < currentTask.content.objectives.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const isStepLocked = (stepIndex) => {
    if (stepIndex === 0) return false;
    return !completedSteps.includes(stepIndex - 1);
  };

  // Navigation logic
  const currentChapterIndex = chapters.findIndex(
    (ch) => ch.id === currentChapter.id
  );
  const currentTaskIndex = currentChapter.tasks.findIndex(
    (task) => task.id === currentTask.id
  );
  const isFirstTask = currentChapterIndex === 0 && currentTaskIndex === 0;
  const isLastTask =
    currentChapterIndex === chapters.length - 1 &&
    currentTaskIndex === currentChapter.tasks.length - 1;

  const navigateToNext = () => {
    if (currentTaskIndex < currentChapter.tasks.length - 1) {
      setCurrentTask(currentChapter.tasks[currentTaskIndex + 1]);
    } else if (currentChapterIndex < chapters.length - 1) {
      const nextChapter = chapters[currentChapterIndex + 1];
      setCurrentChapter(nextChapter);
      setCurrentTask(nextChapter.tasks[0]);
    }
  };

  const navigateToPrevious = () => {
    if (currentTaskIndex > 0) {
      setCurrentTask(currentChapter.tasks[currentTaskIndex - 1]);
    } else if (currentChapterIndex > 0) {
      const prevChapter = chapters[currentChapterIndex - 1];
      setCurrentChapter(prevChapter);
      setCurrentTask(prevChapter.tasks[prevChapter.tasks.length - 1]);
    }
  };

  const navigateChapter = (direction) => {
    const currentIndex = courseData.findIndex(
      (chapter) => chapter.id === selectedChapter.id
    );
    const newIndex =
      direction === "next"
        ? Math.min(currentIndex + 1, courseData.length - 1)
        : Math.max(currentIndex - 1, 0);
    const newChapter = courseData[newIndex];
    setCurrentChapter(newChapter);
    setCurrentTask(newChapter.tasks[0]);
    setSelectedChapter(newChapter);
  };

  const handleTaskSubmit = () => {
    const taskAnswers = currentTask.content.questions.map((q) => ({
      question: q.text,
      answer: answers[`${currentTask.id}-${q.id}`] || "",
    }));
    console.log(`Submitted answers for task ${currentTask.id}:`, taskAnswers);
  };

  const handleOpenFullScreen = (section) => {
    setFullScreenSection(section);
    document.body.style.overflow = "hidden";
  };

  const handleCloseFullScreen = () => {
    setFullScreenSection(null);
    document.body.style.overflow = "auto";
  };

  // Get chapter path for terminal display
  const getChapterPath = () => {
    return currentChapter.chapter.toLowerCase().replace(/\s+/g, "_");
  };

  // **JSX Return**
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-black mt-13 min-h-screen relative">
      {!isPreview && (
        <Sidebar
          courseData={courseData}
          currentChapter={currentChapter}
          onChapterSelect={(chapter) => {
            setCurrentChapter(chapter);
            setCurrentTask(chapter.tasks[0]);
            setSelectedChapter(chapter);
          }}
          title="Course Contents"
        />
      )}

      {/* **Main Content Area** */}
      <main
        className={
          " min-h-screen min-w-screen text-white  transition-all duration-300 mx-auto flex flex-col "
        }
      >
        <section className="">
          {/* Room Header */}
          <div className="mb-6 lg:min-w-[95vw] text-green-400 text-sm">
            <div className="bg-black/20 lg:min-w-full text-white p-5 border border-gray-800 rounded shadow-md">
              {/* SSH-like Header Line */}
              <div className="flex flex-wrap items-center gap-2 mb-3 text-base sm:text-lg md:text-xl font-semibold">
                <span className="text-green-500">
                  {currentChapter.content.author}@kali
                </span>
                <span className="text-white">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white">$</span>
                <span className="text-green-300">{currentChapter.chapter}</span>
                <span className="animate-pulse text-green-500">▍</span>
              </div>

              {/* SSH-like Meta Info */}
              <div className="flex flex-wrap gap-6 text-gray-400 text-xs sm:text-sm pl-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-white" />
                  <span>User: {currentChapter.content.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span>Duration: {currentChapter.content.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-white" />
                  <span>Difficulty: Easy</span>
                </div>
              </div>

              {/* Terminal-style login line */}
              <div className="pl-4 text-green-500 text-xs sm:text-sm">
                Last login: {new Date().toLocaleString()} on tty1
              </div>

              {/* System update command */}
              <div className="pl-4 mt-4 text-green-500 text-xs sm:text-sm">
                $ sudo system-update
              </div>

              {/* Update progress */}
              <div className="pl-4 mt-2 text-white text-xs sm:text-sm">
                Updating system...
              </div>
              <div className="pl-4 mt-2">
                <div className="relative h-4 bg-gray-800 overflow-hidden shadow-inner w-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-green-500 to-green-700 transition-all duration-700 ease-in-out"
                    style={{ width: `${taskProgress}%` }}
                  />
                  <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-r from-transparent via-green-400/30 to-green-500/10 blur-sm pointer-events-none animate-pulse" />
                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-[11px] font-semibold">
                    {taskProgress}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* **Task Content #* */}
          <center>
            <div className="bg-gray-800/30 rounded-xl max-w-8/10 p-6  backdrop-blur-sm border  border-gray-700/50  overflow-hidden">
              <div className="mb-6 font-mono text-green-400  ">
                <div className="flex items-center gap-3 mb-6">
                  <Flag className="w-6 h-6 text-green-400" />
                  <h2 className="text-lg sm:text-xl font-semibold">
                    Task {currentTask.id.split("-")[1]}: {currentTask.title}
                  </h2>
                </div>
                <div className="overflow-y-auto  pr-2 ">
                  {/* **Learning Objectives** */}
                  <CollapsibleSection
                    title="Learning Objectives"
                    icon={<Target className="w-5 h-5 text-blue-400" />}
                    isOpen={activeSection === "objectives"}
                    onToggle={() =>
                      setActiveSection(
                        activeSection === "objectives" ? null : "objectives"
                      )
                    }
                    onFullScreen={() => handleOpenFullScreen("objectives")}
                  >
                    <div className="space-y-4">
                      {currentTask.content.objectives.map(
                        (objective, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-4 rounded-lg border transition-all duration-300 ${
                              currentStep === index
                                ? "bg-gray-700/50 border-blue-500/50"
                                : "bg-gray-800/30 border-gray-700/50"
                            } ${isStepLocked(index) ? "opacity-50" : ""}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                {completedSteps.includes(index) ? (
                                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-green-400" />
                                  </div>
                                ) : isStepLocked(index) ? (
                                  <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <span className="text-blue-400">
                                      {index + 1}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <p className="text-gray-300">{objective}</p>
                              </div>
                              {!completedSteps.includes(index) &&
                                !isStepLocked(index) && (
                                  <button
                                    onClick={() => handleStepComplete(index)}
                                    className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300 flex items-center gap-2"
                                  >
                                    Complete{" "}
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                )}
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </CollapsibleSection>
                  {/* **Chapter Content** */}
                  <CollapsibleSection
                    title="Chapter Content"
                    icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}
                    isOpen={activeSection === "content"}
                    onToggle={() =>
                      setActiveSection(
                        activeSection === "content" ? null : "content"
                      )
                    }
                    onFullScreen={() => handleOpenFullScreen("content")}
                  >
                    <div className="mb-8 rounded-xl overflow-hidden shadow-2xl max-w-[80%] mx-auto">
                      <img
                        src={currentChapter.content.image}
                        alt={currentChapter.content.title}
                        className="w-full rounded-xl h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
                      />
                    </div>
                    <div className="prose prose-invert">
                      <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {currentTask.content.mainContent}
                      </div>
                    </div>
                  </CollapsibleSection>
                </div>
              </div>
              {/* **Terminal Questions** */}
              <div className="space-y-6">
                <TerminalDesign
                  ip={ip}
                  chapterId={currentChapter.id}
                  chapterPath={getChapterPath()}
                  questions={currentTask.content.questions}
                  answers={answers}
                  taskId={currentTask.id}
                  onAnswerSubmit={handleAnswerSubmit}
                  isSubmitted={submitted}
                  completedSteps={completedSteps}
                  totalObjectives={currentTask.content.objectives.length}
                />

                <div className="min-w-full flex justify-end ">
                  <SubmitButton
                    isSubmitted={submitted}
                    completedSteps={completedSteps}
                    totalObjectives={currentTask.content.objectives.length}
                    onSubmit={handleSubmit}
                    className="w-2/3 lg:w-2/6 max-h-16 p-2.5"
                  />
                </div>
              </div>
            </div>
          </center>

          {/* **Navigation Buttons** */}
          {!isPreview && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={navigateToPrevious}
                  disabled={isFirstTask}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                <button
                  onClick={navigateToNext}
                  disabled={isLastTask}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-700/50 text-white rounded-lg hover:bg-gray-600/50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Fullscreen Reader */}
      <AnimatePresence>
        {fullScreenSection && (
          <FullScreenReader
            section={fullScreenSection}
            content={
              fullScreenSection === "objectives" ? (
                <div className="space-y-4">
                  {currentTask.content.objectives.map((objective, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative p-4 rounded-lg border transition-all duration-300 ${
                        currentStep === index
                          ? "bg-gray-700/50 border-blue-500/50"
                          : "bg-gray-800/30 border-gray-700/50"
                      } ${isStepLocked(index) ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {completedSteps.includes(index) ? (
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="w-5 h-5 text-green-400" />
                            </div>
                          ) : isStepLocked(index) ? (
                            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                              <Lock className="w-5 h-5 text-gray-400" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <span className="text-blue-400">{index + 1}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-300">{objective}</p>
                        </div>
                        {!completedSteps.includes(index) &&
                          !isStepLocked(index) && (
                            <button
                              onClick={() => handleStepComplete(index)}
                              className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300 flex items-center gap-2"
                            >
                              Complete <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : fullScreenSection === "content" ? (
                <>
                  <div className="mb-8 rounded-xl overflow-hidden shadow-2xl max-w-[70%] mx-auto">
                    <img
                      src={currentChapter.content.image}
                      alt={currentChapter.content.title}
                      className="w-full rounded-xl h-64 sm:h-72 md:h-80 lg:h-96 object-cover"
                    />
                  </div>
                  <div className="prose prose-invert max-w-[95%]  mx-auto">
                    <h1 className="text-gray-300 text-md md:text-lg  leading-relaxed whitespace-pre-wrap ">
                      {currentTask.content.mainContent}
                    </h1>
                  </div>
                </>
              ) : (
                <TerminalDesign
                  ip={ip}
                  chapterId={currentChapter.id}
                  chapterPath={getChapterPath()}
                  questions={currentTask.content.questions}
                  answers={answers}
                  taskId={currentTask.id}
                  onAnswerSubmit={handleAnswerSubmit}
                  isSubmitted={submitted}
                  isFullScreen={true}
                  completedSteps={completedSteps}
                  totalObjectives={currentTask.content.objectives.length}
                />
              )
            }
            title={
              fullScreenSection === "objectives"
                ? "Learning Objectives"
                : fullScreenSection === "content"
                ? "Chapter Content"
                : "Terminal Questions"
            }
            icon={
              fullScreenSection === "objectives" ? (
                <Target className="w-6 h-6 text-blue-400" />
              ) : fullScreenSection === "content" ? (
                <Lightbulb className="w-6 h-6 text-yellow-400" />
              ) : (
                <Terminal className="w-6 h-6 text-green-400" />
              )
            }
            onClose={handleCloseFullScreen}
          />
        )}
      </AnimatePresence>

      {/* **Mobile Overlay** */}
      {!isPreview && (
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      )}

      {/* **CSS for Typing Animation** */}
      <style jsx global>{`
        .typing-animation {
          overflow: hidden;
          border-right: 2px solid #4ade80;
          white-space: nowrap;
          animation: typing 3s steps(40, end),
            blink-caret 0.75s step-end infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.7);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }

        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes blink-caret {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: #4ade80;
          }
        }
      `}</style>
    </section>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Content />
    </div>
  );
}

export default App;
