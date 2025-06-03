// File: src/components/Content.jsx

import React, { useState, useEffect } from "react";
import {
  Clock,
  User,
  ChevronRight,
  ChevronLeft,
  Flag,
  Target,
  Lightbulb,
  DotSquareIcon,
  Terminal,
  Maximize2,
  MoveRightIcon,
  DotIcon,
  DotSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CollapsibleSection from "../components/content/colapsable";
import FullScreenReader from "../components/content/FullscreenReader";
import TerminalDesign from "../components/content/Terminal";
import SubmitButton from "../components/content/SubmitButton";
import ContentHeader from "../components/content/ContentHeader";
import "../content.css";

// ────────────────────────────────────────────────────────────────────────────
// Dummy “full” data map (read‐only) for looking up by ID
// ────────────────────────────────────────────────────────────────────────────
const chapterDetailsById = {
  1: {
    id: 1,
    chapter: "Introduction to Cybersecurity",
    icon: null,
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

Cybersecurity is relevant to all people in the modern world, including:
- Strong password policies to protect emails
- Business protection of devices and data
- Personal information security
- Network security

According to Security Magazine, a cybersecurity industry magazine, there are over 2,200 cyber attacks every day - 1 attack every 39 seconds.`,
          questions: [
            {
              id: "q1",
              text: "What is the primary goal of a penetration test?",
              type: "text",
              hint: "Think about the ethical aspects and defensive nature of the activity",
            },
            {
              id: "q2",
              text: "How many cyber attacks occur daily according to Security Magazine?",
              type: "text",
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
              hint: "Look for tools mentioned in the scanning and monitoring sections",
            },
          ],
        },
      },
    ],
  },

  2: {
    id: 2,
    chapter: "Ethical Hacking Basics",
    icon: null,
    completed: false,
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
          mainContent: `Penetration testing (or pentesting) is the practice of testing a computer system, network, or web application to find vulnerabilities that an attacker could exploit.`,
          questions: [
            {
              id: "q4",
              text: "What is the difference between black hat and white hat hacking?",
              type: "text",
            },
          ],
        },
      },
      {
        id: "task-4",
        title: "Reconnaissance Techniques",
        completed: true,
        content: {
          description:
            "Learn how to gather information about targets using passive and active reconnaissance.",
          objectives: [
            "Differentiate passive vs. active recon",
            "Use `whois`, `nslookup`, `nmap` basics",
          ],
          mainContent: `Reconnaissance is the first phase of a penetration test. In passive reconnaissance, you gather public data from websites, social media, DNS records, etc. In active reconnaissance, you interact with the target directly (e.g., sending pings, port scanning).`,
          questions: [
            {
              id: "q5",
              text: "Name one passive reconnaissance tool.",
              type: "text",
            },
            {
              id: "q6",
              text: "What `nmap` flag shows open TCP ports?",
              type: "text",
            },
          ],
        },
      },
    ],
  },

  3: {
    id: 3,
    chapter: "Network Defense Fundamentals",
    icon: null,
    completed: false,
    content: {
      title: "Firewall and IDS/IPS Overview",
      author: "Alex Kim",
      duration: "50 minutes",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2070",
    },
    tasks: [
      {
        id: "task-5",
        title: "Configuring a Basic Firewall",
        completed: false,
        content: {
          description:
            "Understand firewall rules and how to configure a basic iptables or UFW setup.",
          objectives: [
            "Interpret firewall rule syntax",
            "Set up a basic UFW policy",
          ],
          mainContent: `Firewalls filter network traffic based on predefined rules. In Linux, \`iptables\` or \`ufw\` are commonly used. UFW (Uncomplicated Firewall) is a simpler frontend for \`iptables\`.`,
          questions: [
            {
              id: "q7",
              text: "What command enables UFW and allows SSH (port 22)?",
              type: "text",
            },
          ],
        },
      },
      {
        id: "task-6",
        title: "Intro to IDS/IPS",
        completed: false,
        content: {
          description:
            "Learn what an Intrusion Detection System (IDS) and Intrusion Prevention System (IPS) do.",
          objectives: [
            "Define IDS vs. IPS",
            "Give an example of a popular IDS tool",
          ],
          mainContent: `IDS (Intrusion Detection System) passively monitors traffic and alerts on suspicious activity. IPS (Intrusion Prevention System) actively blocks or mitigates threats in real-time.`,
          questions: [
            {
              id: "q8",
              text: "Name one open-source IDS tool.",
              type: "text",
            },
          ],
        },
      },
    ],
  },
  // …Add more chapters as needed…
};

const Content = ({ selectedChapterId, isPreview = false }) => {
  // ─── State Variables ─────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState(null);
  const [fullScreenSection, setFullScreenSection] = useState(null);
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

  // ─── EFFECT: When selectedChapterId changes, look up full data ───────────
  useEffect(() => {
    if (selectedChapterId == null) return;

    const fullChapter = chapterDetailsById[selectedChapterId] || null;
    setCurrentChapter(fullChapter);

    if (fullChapter && fullChapter.tasks.length > 0) {
      setCurrentTask(fullChapter.tasks[0]);
    } else {
      setCurrentTask(null);
    }

    // Reset UI state on chapter change
    setActiveSection(null);
    setFullScreenSection(null);
    setTaskProgress(0);
    setSubmitted(false);
    setAnswers({});
    setCurrentStep(0);
    setCompletedSteps([]);
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
      .catch(() => {
        // Keep the random IP if fetching fails
      });
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
  };

  const handleCloseFullScreen = () => {
    setFullScreenSection(null);
    document.body.style.overflow = "auto";
  };

  const getChapterPath = () => {
    return currentChapter
      ? currentChapter.chapter.toLowerCase().replace(/\s+/g, "_")
      : "";
  };

  // If the chapter or task isn’t loaded yet, show a placeholder
  if (!currentChapter || !currentTask) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Loading chapter…
      </div>
    );
  }

  // Determine whether this is the first or last task in the chapter
  const taskIdx = currentChapter.tasks.findIndex(
    (t) => t.id === currentTask.id
  );
  const isFirstTask = taskIdx === 0;
  const isLastTask = taskIdx === currentChapter.tasks.length - 1;

  // ─── JSX RETURN ──────────────────────────────────────────────────────────
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-black mt-13 min-h-screen relative">
      {/* ─── HEADER (SSH‐like) ────────────────────────────────────────────── */}
      <ContentHeader
        currentChapter={currentChapter}
        scrolled={scrolled}
        taskProgress={taskProgress}
      />

      {/* ─── TASK CARD ────────────────────────────────────────────────────── */}
      <center>
        <div className="bg-gray-800/30 rounded-xl max-w-8/10 p-6 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
          <div className="mb-6 font-mono text-green-400">
            <div className="flex items-center gap-3 mb-6">
              <Flag className="w-6 h-6 text-green-400" />
              <h2 className="text-lg sm:text-xl font-semibold">
                Task {currentTask.id.split("-")[1]}: {currentTask.title}
              </h2>
            </div>

            <div className="overflow-y-auto pr-2">
              {/* ─── Learning Objectives Collapsible ───────────────────── */}
              <CollapsibleSection
                title="Learning Objectives"
                icon={<Target className="w-5 h-5 text-blue-400" />}
                isOpen={activeSection === "objectives"}
                onToggle={() => {
                  // Toggle only this collapsible; do not affect others
                  setActiveSection(
                    activeSection === "objectives" ? null : "objectives"
                  );
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

              {/* ─── Chapter Content (entire div clickable; closes collapsible) ────────────────────────── */}
              <div
                className="border border-gray-700/50 rounded-lg overflow-hidden mb-4 cursor-pointer"
                onClick={() => {
                  // Close the Learning Objectives collapsible before opening fullscreen
                  setActiveSection(null);
                  handleOpenFullScreen("content");
                }}
              >
                <div className="w-full px-4 py-3 bg-gray-800/50 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">
                      Chapter Content
                    </span>
                  </div>
                  <MoveRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* ─── Terminal Questions: Inline on desktop, button on mobile ───────────────────────────── */}
          {/* Inline on screens ≥ 640px */}
          <div className="hidden sm:block border border-gray-700/50 rounded-lg overflow-hidden mb-4">
            <div className="w-full px-4 py-3 bg-gray-800/50 flex items-center gap-3">
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Questions</span>
            </div>
            <div className="p-4 bg-gray-800/30">
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
            </div>
          </div>

          {/* Button on screens < 640px */}
          <div className="block sm:hidden border border-gray-700/50 rounded-lg overflow-hidden mb-4">
            <button
              onClick={() => {
                setActiveSection(null);
                handleOpenFullScreen("questions");
              }}
              className="w-full px-4 py-3 bg-gray-800/50 flex items-center gap-3 hover:bg-gray-700/50 transition-colors duration-200 text-white"
            >
              <Terminal className="w-5 h-5 text-green-400" />
              <span className="font-medium">View Questions</span>
              <MoveRightIcon className="w-5 h-5 text-gray-400 ml-auto" />
            </button>
          </div>

          <div className="flex justify-end">
            <SubmitButton
              isSubmitted={submitted}
              completedSteps={completedSteps}
              totalObjectives={currentTask.content.objectives.length}
              onSubmit={handleSubmit}
              className="w-2/3 lg:w-2/6 max-h-16 p-2.5"
            />
          </div>
        </div>
      </center>

      {/* ─── Navigation Buttons ─────────────────────────────────────────── */}
      {!isPreview && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center px-4">
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

      {/* ─── Full‐Screen Modal ───────────────────────────────────────────── */}
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

        {fullScreenSection === "questions" && (
          <FullScreenReader
            section="questions"
            content={
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
            }
            title="Questions"
            icon={<Terminal className="w-6 h-6 text-green-400" />}
            onClose={handleCloseFullScreen}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Content;
