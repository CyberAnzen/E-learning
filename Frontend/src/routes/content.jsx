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
import FullscreenAnswerPage from "../components/content/FullScreenAnswerPage";
import TerminalDesign from "../components/content/Terminal";
import SubmitButton from "../components/content/SubmitButton";
import ContentHeader from "../components/content/ContentHeader";
import ChapterProgress from "../components/content/ChapterProgress";
import "../content.css";

// ────────────────────────────────────────────────────────────────────────────
// Dummy "full" data map (read‐only) for looking up by ID
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
              type: "multiple-choice",
              options: [
                "Over 1,000",
                "Over 2,200",
                "Over 5,000",
                "Over 10,000",
              ],
              correctAnswer: "Over 2,200",
              hint: "The number is mentioned in the content - over 2,200",
            },
            {
              id: "q3",
              text: "Which of the following are key areas where cybersecurity is relevant? (Select all that apply)",
              type: "multiple-select",
              options: [
                "Strong password policies to protect emails",
                "Business protection of devices and data",
                "Personal information security",
                "Network security",
                "Social media marketing",
              ],
              correctAnswers: [
                "Strong password policies to protect emails",
                "Business protection of devices and data",
                "Personal information security",
                "Network security",
              ],
              hint: "Look for the areas mentioned in the cybersecurity relevance section",
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
          mainContent: `Security professionals use various tools to protect systems and networks. Common categories include:

Network Scanning Tools:
- Nmap: Network discovery and security auditing
- Masscan: High-speed port scanner
- Zmap: Internet-wide network scanner

Vulnerability Assessment:
- Nessus: Comprehensive vulnerability scanner
- OpenVAS: Open-source vulnerability assessment
- Qualys: Cloud-based security platform

Web Application Testing:
- Burp Suite: Web application security testing
- OWASP ZAP: Web application security scanner
- Nikto: Web server scanner`,
          questions: [
            {
              id: "q4",
              text: "Which tool is primarily used for network discovery and security auditing?",
              type: "multiple-choice",
              options: ["Burp Suite", "Nmap", "Nessus", "OWASP ZAP"],
              correctAnswer: "Nmap",
              hint: "Look for tools mentioned in the Network Scanning Tools section",
            },
            {
              id: "q5",
              text: "Name three essential security tools mentioned in the lesson and their primary purposes.",
              type: "text",
              hint: "Choose from any of the tools mentioned in the scanning, vulnerability assessment, or web application testing sections",
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
          mainContent: `Penetration testing (or pentesting) is the practice of testing a computer system, network, or web application to find vulnerabilities that an attacker could exploit.

Types of Hackers:
- White Hat Hackers: Ethical hackers who help organizations improve security
- Black Hat Hackers: Malicious hackers who exploit vulnerabilities for personal gain
- Gray Hat Hackers: Fall between white and black hat, may find vulnerabilities without permission but don't exploit them maliciously

Penetration Testing Phases:
1. Planning and Reconnaissance
2. Scanning and Enumeration  
3. Gaining Access
4. Maintaining Access
5. Analysis and Reporting`,
          questions: [
            {
              id: "q6",
              text: "What is the difference between black hat and white hat hacking?",
              type: "text",
              hint: "Think about the intentions and ethics behind each type of hacking",
            },
            {
              id: "q7",
              text: "Which type of hacker helps organizations improve their security?",
              type: "multiple-choice",
              options: [
                "Black Hat Hackers",
                "White Hat Hackers",
                "Gray Hat Hackers",
                "Script Kiddies",
              ],
              correctAnswer: "White Hat Hackers",
              hint: "Look for the type that works ethically to help organizations",
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
          mainContent: `Reconnaissance is the first phase of a penetration test. 

Passive Reconnaissance:
- Gathering public data from websites, social media, DNS records
- Tools: whois, Google dorking, social media analysis
- No direct interaction with target systems

Active Reconnaissance:
- Direct interaction with target systems
- Tools: nmap, ping, traceroute
- May be detected by target systems

Common Tools:
- whois: Domain registration information
- nslookup: DNS lookup utility
- nmap: Network mapping and port scanning`,
          questions: [
            {
              id: "q8",
              text: "Which of the following are passive reconnaissance techniques? (Select all that apply)",
              type: "multiple-select",
              options: [
                "Google dorking",
                "Port scanning with nmap",
                "Whois lookups",
                "Social media analysis",
                "Ping sweeps",
              ],
              correctAnswers: [
                "Google dorking",
                "Whois lookups",
                "Social media analysis",
              ],
              hint: "Passive techniques don't directly interact with target systems",
            },
            {
              id: "q9",
              text: "What nmap flag is commonly used to perform a TCP SYN scan?",
              type: "multiple-choice",
              options: ["-sS", "-sT", "-sU", "-sP"],
              correctAnswer: "-sS",
              hint: "Think about the SYN scan option in nmap",
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
          mainContent: `Firewalls filter network traffic based on predefined rules. In Linux, iptables or ufw are commonly used. UFW (Uncomplicated Firewall) is a simpler frontend for iptables.

Common UFW Commands:
- ufw enable: Enable the firewall
- ufw allow 22: Allow SSH (port 22)
- ufw allow 80: Allow HTTP (port 80)
- ufw allow 443: Allow HTTPS (port 443)
- ufw deny 23: Deny Telnet (port 23)
- ufw status: Check firewall status

Firewall Types:
- Packet Filtering: Examines packets and allows/denies based on rules
- Stateful Inspection: Tracks connection states
- Application Layer: Inspects application-specific data`,
          questions: [
            {
              id: "q10",
              text: "What command enables UFW and allows SSH (port 22)?",
              type: "text",
              hint: "You need two commands: one to enable UFW and another to allow SSH",
            },
            {
              id: "q11",
              text: "Which type of firewall tracks connection states?",
              type: "multiple-choice",
              options: [
                "Packet Filtering",
                "Stateful Inspection",
                "Application Layer",
                "Network Address Translation",
              ],
              correctAnswer: "Stateful Inspection",
              hint: "Look for the firewall type that monitors connection states",
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
          mainContent: `IDS (Intrusion Detection System) passively monitors traffic and alerts on suspicious activity. IPS (Intrusion Prevention System) actively blocks or mitigates threats in real-time.

Popular IDS/IPS Tools:
- Snort: Open-source network intrusion detection
- Suricata: High-performance network IDS/IPS
- OSSEC: Host-based intrusion detection
- Fail2ban: Intrusion prevention for log files

Key Differences:
- IDS: Detection and alerting only
- IPS: Detection, alerting, and active blocking
- HIDS: Host-based monitoring
- NIDS: Network-based monitoring`,
          questions: [
            {
              id: "q12",
              text: "What is the main difference between IDS and IPS?",
              type: "multiple-choice",
              options: [
                "IDS is faster than IPS",
                "IDS only detects and alerts, while IPS actively blocks threats",
                "IPS is open-source, IDS is commercial",
                "There is no difference",
              ],
              correctAnswer:
                "IDS only detects and alerts, while IPS actively blocks threats",
              hint: "Think about passive monitoring vs. active blocking",
            },
            {
              id: "q13",
              text: "Which of the following are popular IDS/IPS tools? (Select all that apply)",
              type: "multiple-select",
              options: ["Snort", "Suricata", "OSSEC", "Nmap", "Fail2ban"],
              correctAnswers: ["Snort", "Suricata", "OSSEC", "Fail2ban"],
              hint: "Look for tools mentioned in the Popular IDS/IPS Tools section",
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
  const [showFullscreenAnswerPage, setShowFullscreenAnswerPage] =
    useState(false);
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

  // ─── NEW: Track if Objectives or Content have been opened ───────────────
  const [objectivesOpened, setObjectivesOpened] = useState(false);
  const [contentOpened, setContentOpened] = useState(false);

  // NEW: Overall progress state
  const [overallProgress, setOverallProgress] = useState({
    percentage: 0,
    completed: 0,
    total: 0,
  });

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
    setShowFullscreenAnswerPage(false);
    setTaskProgress(0);
    setSubmitted(false);
    setAnswers({});
    setCurrentStep(0);
    setCompletedSteps([]);
    setObjectivesOpened(false);
    setContentOpened(false);
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

    // Calculate overall progress
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
    if (section === "content") {
      setContentOpened(true);
    }
  };

  const handleCloseFullScreen = () => {
    setFullScreenSection(null);
    document.body.style.overflow = "auto";
  };

  const handleOpenFullscreenAnswers = () => {
    setShowFullscreenAnswerPage(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseFullscreenAnswers = () => {
    setShowFullscreenAnswerPage(false);
    document.body.style.overflow = "auto";
  };

  const getChapterPath = () => {
    return currentChapter
      ? currentChapter.chapter.toLowerCase().replace(/\s+/g, "_")
      : "";
  };

  // If the chapter or task isn't loaded yet, show a placeholder
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

      {/* ─── MAIN CONTENT CONTAINER ──────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 px-4 py-8 max-w-7xl mx-auto">
        {/* Extracted ChapterProgress */}
        <ChapterProgress
          overallProgress={overallProgress}
          tasks={currentChapter.tasks}
          currentTaskId={currentTask.id}
        />

        {/* ─── LEFT COLUMN: TASK CARD ────────────────────────────────────── */}
        <div className="w-full lg:w-7/12 order-2 lg:order-1">
          <div className="flex justify-center">
            <div className="bg-gray-800/30 rounded-xl w-full max-w-3xl p-6 backdrop-blur-sm border border-gray-700/50 overflow-hidden">
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
                    title={
                      <div className="flex items-center">
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

                  {/* ─── Chapter Content ────────────────────────── */}
                  <div
                    className="border border-gray-700/50 rounded-lg overflow-hidden mb-4 cursor-pointer"
                    onClick={() => {
                      setActiveSection(null);
                      handleOpenFullScreen("content");
                    }}
                  >
                    <div
                      className="cyber-button w-full px-4 py-3 bg-transparent border border-[#01ffdb]/20
                  font-medium rounded-lg hover:bg-transparent
                  transition-all  font-mono relative overflow-hidden text-xltransition-colors duration-200 text-white flex items-center gap-3"
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

              {/* ─── Questions ───────────────────────────── */}
              <div className="border border-gray-700/50 rounded-lg overflow-hidden mb-4">
                <button
                  onClick={() => {
                    setActiveSection(null);
                    handleOpenFullscreenAnswers();
                  }}
                  className="cyber-button w-full px-4 py-3 bg-[#01ffdb]/10 border border-[#01ffdb]/50
                  font-medium rounded-lg hover:bg-[#01ffdb]/20 
                  transition-all  font-mono relative overflow-hidden text-xltransition-colors duration-200 text-white flex items-center gap-3"
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
          </div>

          {/* ─── Navigation Buttons ─────────────────────────────────────────── */}
          {!isPreview && (
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex gap-4 w-full sm:w-auto">
                <button
                  onClick={navigateToPrevious}
                  disabled={isFirstTask}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
                <button
                  onClick={navigateToNext}
                  disabled={isLastTask}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              </div>{" "}
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

      {/* ─── Full‐Screen Content Modal ───────────────────────────────────── */}
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

      {/* ─── Fullscreen Answer Page ─────────────────────────────────────────── */}
      <FullscreenAnswerPage
        isOpen={showFullscreenAnswerPage}
        onClose={handleCloseFullscreenAnswers}
        questions={currentTask?.content?.questions || []}
        answers={answers}
        taskId={currentTask?.id}
        onAnswerSubmit={handleAnswerSubmit}
        isSubmitted={submitted}
        ip={ip}
        chapterId={currentChapter?.id}
        chapterPath={getChapterPath()}
      />
    </section>
  );
};

export default Content;
