import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  Maximize2,
  Shield,
  X,
  Plus,
  Trash2,
  Save,
  Eye,
  Sigma,
  Signal,
  GraduationCap,
  Cpu,
  Terminal,
  BookOpen,
  Brain,
  Lightbulb,
  Network,
  Code,
  Book,
  Globe,
  Server,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Content from "../../../routes/content";
import RichTextEditor from "./!RichTextEditor";
import { useLocation } from "react-router-dom";

// Icon options for lesson classification with enhanced dropdown styling
const icons = [
  { name: "Learning", icon: GraduationCap },
  { name: "Tech", icon: Cpu },
  { name: "Cybersecurity", icon: Shield },
  { name: "Coding", icon: Terminal },
  { name: "Knowledge", icon: BookOpen },
  { name: "Brain", icon: Brain },
  { name: "Ideas", icon: Lightbulb },
  { name: "Networks", icon: Network },
  { name: "Code", icon: Code },
  { name: "Books", icon: Book },
  { name: "Web", icon: Globe },
  { name: "Server", icon: Server },
  { name: "Security", icon: Lock },
];

// Create a context for the focused section
const FocusedSectionContext = createContext();

// Initial placeholder data matching the JSON structure
import Placeholder from "./Placeholder.json";

// Define backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Enhanced Icon Dropdown Component with beautiful animations
 * Styled similar to the AddCourse component dropdown
 */
const IconDropdown = ({ selectedIcon, onIconSelect, onFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleIconSelect = (icon) => {
    onIconSelect(icon.name);
    setIsOpen(false);
  };

  const selectedIconData =
    icons.find((icon) => icon.name === selectedIcon) || icons[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onFocus && onFocus();
        }}
        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10 flex items-center justify-between hover:bg-cyan-300/20"
      >
        <div className="flex items-center gap-3">
          <selectedIconData.icon className="w-5 h-5 text-cyan-400" />
          <span>{selectedIconData.name}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl shadow-cyan-500/20 max-h-60 overflow-y-auto"
          >
            <div className="p-1 space-y-1">
              {icons.map((icon, index) => (
                <motion.button
                  key={icon.name}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleIconSelect(icon)}
                  className={`w-full flex items-center gap-2 text-cyan-300 hover:bg-gray-700 px-2 py-1 rounded transition-all ${
                    selectedIcon === icon.name
                      ? "bg-cyan-500/20 border border-cyan-500/50"
                      : ""
                  }`}
                >
                  <icon.icon className="w-4 h-4" />
                  <span className="text-sm">{icon.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Enhanced Classification Dropdown Component
 * Styled with the same beautiful animations as the icon dropdown
 */
const ClassificationDropdown = ({
  classifications,
  selectedId,
  onSelect,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (classification) => {
    onSelect(classification._id);
    setIsOpen(false);
  };

  const selectedClassification = classifications.find(
    (c) => c._id === selectedId
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onFocus && onFocus();
        }}
        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10 flex items-center justify-between hover:bg-cyan-300/20"
      >
        <span>
          {selectedClassification
            ? selectedClassification.title
            : "Select a classification"}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl shadow-cyan-500/20 max-h-60 overflow-y-auto"
          >
            <div className="p-1 space-y-1">
              {classifications.map((classification, index) => (
                <motion.button
                  key={classification._id}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(classification)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all font-mono text-sm ${
                    selectedId === classification._id
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-cyan-300"
                  }`}
                >
                  {classification.title}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Enhanced Question Type Dropdown Component
 * Styled with the same beautiful animations
 */
const QuestionTypeDropdown = ({ selectedType, onSelect, onFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const questionTypes = [
    { value: "text", label: "Text Answer" },
    { value: "multiple-choice", label: "Multiple Choice" },
    { value: "multiple-select", label: "Multiple Select" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type) => {
    onSelect(type.value);
    setIsOpen(false);
  };

  const selectedTypeData =
    questionTypes.find((type) => type.value === selectedType) ||
    questionTypes[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onFocus && onFocus();
        }}
        className="w-full bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono flex items-center justify-between hover:bg-cyan-300/20"
      >
        <span>{selectedTypeData.label}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl shadow-cyan-500/20"
          >
            <div className="p-1 space-y-1">
              {questionTypes.map((type, index) => (
                <motion.button
                  key={type.value}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(type)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all font-mono text-sm ${
                    selectedType === type.value
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-cyan-300"
                  }`}
                >
                  {type.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Enhanced Correct Answer Dropdown Component for Multiple Choice Questions
 */
const CorrectAnswerDropdown = ({
  options,
  selectedAnswer,
  onSelect,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          onFocus && onFocus();
        }}
        className="w-full bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono flex items-center justify-between hover:bg-cyan-300/20"
      >
        <span>{selectedAnswer || "Select correct answer"}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl shadow-cyan-500/20 max-h-40 overflow-y-auto"
          >
            <div className="p-1 space-y-1">
              {options?.map((option, index) => (
                <motion.button
                  key={index}
                  type="button"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all font-mono text-sm ${
                    selectedAnswer === option
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-cyan-300"
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

//
const AdminEditor = ({ isEditing = false, OldData }) => {
  const initialData = isEditing && OldData ? OldData : Placeholder;
  const location = useLocation();
  const initialClassificationId = location.state?.ClassificationId || null;
  const [ClassificationId, setClassificationId] = useState(
    initialClassificationId
  );
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [chapters, setChapters] = useState([]);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newObjective, setNewObjective] = useState("");
  const [focusedSection, setFocusedSection] = useState(null);
  const retryTimeoutRef = useRef(null);

  const sidePreviewRef = useRef(null);
  const fullPreviewRef = useRef(null);
  const objectivesContainerRef = useRef(null);
  const questionsContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  //--------------FETCHED DATA-----------------------------
  const [ClassificationsData, setClassicationsData] = useState();
  const [LessonNum, setLessonNum] = useState(1);
  const [minLessonNum, setMinLessonNum] = useState(1);

  //-----------Fetching Functions to get the needed datas
  useEffect(() => {
    const FetchClassifcations = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${BACKEND_URL}/classification/`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const { data } = await response.json();
        setClassicationsData(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        // Schedule an auto-retry after 5 seconds
        retryTimeoutRef.current = setTimeout(() => {
          loadCourses();
        }, 5000);
      }
    };

    FetchClassifcations();
  }, []);
  console.log(ClassificationId);

  useEffect(() => {
    if (!ClassificationsData) return; // wait for data

    const selected = ClassificationsData.Classications.find(
      (c) => c._id === ClassificationId
    );

    if (selected) {
      const nextLessonNum = selected.lessonCount + 1;
      setClassificationId(selected._id);
      setMinLessonNum(nextLessonNum);
      setFormData((prev) => ({
        ...prev,
        lessonNum: nextLessonNum,
      }));
    }
  }, [ClassificationsData, ClassificationId]);

  useEffect(() => {
    if (editingChapter) {
      setFormData(editingChapter);
    }
  }, [editingChapter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      _id: formData._id || `lesson_${Date.now()}`,
      content: {
        ...formData.content,
        _id: formData.content._id || `content_${Date.now()}`,
      },
      tasks: {
        ...formData.tasks,
        _id: formData.tasks._id || `task_${Date.now()}`,
        content: {
          ...formData.tasks.content,
          questions: formData.tasks.content.questions.map((q) => ({
            ...q,
            _id:
              q._id ||
              `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          })),
        },
      },
    };

    if (editingChapter) {
      setChapters(
        chapters.map((chap) =>
          chap._id === editingChapter._id ? updatedFormData : chap
        )
      );
    } else {
      setChapters([...chapters, updatedFormData]);
    }

    setFormData(initialData);
    setEditingChapter(null);
  };

  const handleDelete = (id) => {
    setChapters(chapters.filter((chap) => chap._id !== id));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        tasks: {
          ...formData.tasks,
          content: {
            ...formData.tasks.content,
            objectives: [...formData.tasks.content.objectives, newObjective],
          },
        },
      });
      setNewObjective("");
    }
  };

  const removeObjective = (index) => {
    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: {
          ...formData.tasks.content,
          objectives: formData.tasks.content.objectives.filter(
            (_, i) => i !== index
          ),
        },
      },
    });
  };

  const addQuestion = () => {
    const newQuestion = {
      text: "",
      type: "text",
      correctAnswer: "",
      correctAnswers: [],
      hint: "",
      options: [],
      _id: "",
    };

    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: {
          ...formData.tasks.content,
          questions: [...formData.tasks.content.questions, newQuestion],
        },
      },
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.tasks.content.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };

    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: {
          ...formData.tasks.content,
          questions: updatedQuestions,
        },
      },
    });
  };

  const removeQuestion = (index) => {
    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: {
          ...formData.tasks.content,
          questions: formData.tasks.content.questions.filter(
            (_, i) => i !== index
          ),
        },
      },
    });
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...formData.tasks.content.questions];
    if (!updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options = [];
    }
    updatedQuestions[questionIndex].options.push("");

    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: {
          ...formData.tasks.content,
          questions: updatedQuestions,
        },
      },
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...formData.tasks.content.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;

    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: {
          ...formData.tasks.content,
          questions: updatedQuestions,
        },
      },
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...formData.tasks.content.questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);

    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: {
          ...formData.tasks.content,
          questions: updatedQuestions,
        },
      },
    });
  };
  useEffect(() => {
    document.body.style.overflow = "auto";
  }, [focusedSection]);
  return (
    <FocusedSectionContext.Provider
      value={{ focusedSection, setFocusedSection }}
    >
      <div className="bg-gradient-to-br from-black via-gray-900 to-black mt-23 min-h-screen p-5">
        <section className=" lg:mt-0 xl:-ml-20 lg:max-w-[45vw] xl:max-w-[100vw]">
          <div className="max-w-7xl mx-auto ">
            <div className="text-left mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                CYBER COURSE EDITOR
              </h1>
              <p className="text-gray-400 font-mono ">
                Design cutting-edge cybersecurity curriculum
              </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center gap-3 mb-6 border-b border-cyan-500/30 pb-4">
                  <Shield className="w-8 h-8 text-cyan-400" />
                  <h1 className="text-2xl font-bold text-cyan-300 font-mono">
                    COURSE EDITOR
                  </h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2 font-mono">
                      BASIC INFORMATION
                    </h3>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        CLASSIFICATION
                      </label>
                      <ClassificationDropdown
                        classifications={
                          ClassificationsData?.Classications || []
                        }
                        selectedId={ClassificationId}
                        onSelect={(selectedId) => {
                          setClassificationId(selectedId);
                          setFormData((prev) => ({
                            ...prev,
                            classificationId: selectedId,
                          }));
                        }}
                        onFocus={() => setFocusedSection("classificationId")}
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        LESSON NUMBER
                      </label>
                      <input
                        type="number"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.lessonNum || minLessonNum}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= minLessonNum) {
                            setFormData((prev) => ({
                              ...prev,
                              lessonNum: value,
                            }));
                          }
                        }}
                        min={minLessonNum}
                        required
                        onFocus={() => setFocusedSection("lessonNum")}
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        LESSON TITLE
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.lesson}
                        onChange={(e) =>
                          setFormData({ ...formData, lesson: e.target.value })
                        }
                        required
                        onFocus={() => setFocusedSection("lesson")}
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        ICON
                      </label>
                      <IconDropdown
                        selectedIcon={formData.icon}
                        onIconSelect={(iconName) =>
                          setFormData({ ...formData, icon: iconName })
                        }
                        onFocus={() => setFocusedSection("icon")}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2 font-mono">
                      HEADER DETAILS
                    </h3>

                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        AUTHOR
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.content.author}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            content: {
                              ...formData.content,
                              author: e.target.value,
                            },
                          })
                        }
                        required
                        onFocus={() => setFocusedSection("contentAuthor")}
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        DURATION
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          className="w-1/2 bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                          value={formData.content.duration.split("-")[0] || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: {
                                ...formData.content,
                                duration: `${e.target.value}-${
                                  formData.content.duration.split("-")[1] ||
                                  "minutes"
                                }`,
                              },
                            })
                          }
                          placeholder="Enter number"
                          onFocus={() => setFocusedSection("contentDuration")}
                          required
                        />

                        <select
                          className="w-1/2 bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                          value={
                            formData.content.duration.split("-")[1] || "minutes"
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: {
                                ...formData.content,
                                duration: `${
                                  formData.content.duration.split("-")[0] ||
                                  "30"
                                }-${e.target.value}`,
                              },
                            })
                          }
                          onFocus={() => setFocusedSection("contentDuration")}
                          required
                        >
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                        </select>
                      </div>
                    </div>

                    {/* <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        IMAGE URL
                      </label>
                      <input
                        type="url"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.content.image}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            content: {
                              ...formData.content,
                              image: e.target.value,
                            },
                          })
                        }
                        required
                        onFocus={() => setFocusedSection("contentImage")}
                      />
                    </div> */}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2 font-mono">
                      TASK DETAILS
                    </h3>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        TASK TITLE
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.tasks.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tasks: { ...formData.tasks, title: e.target.value },
                          })
                        }
                        required
                        onFocus={() => setFocusedSection("taskTitle")}
                      />
                    </div>
                    {/* <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        DESCRIPTION
                      </label>
                      <textarea
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.tasks.content.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tasks: {
                              ...formData.tasks,
                              content: {
                                ...formData.tasks.content,
                                description: e.target.value,
                              },
                            },
                          })
                        }
                        required
                        rows="3"
                        onFocus={() => setFocusedSection("taskDescription")}
                      />
                    </div> */}
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        CONTENT TITLE
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.content.title}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            content: {
                              ...formData.content,
                              title: e.target.value,
                            },
                          })
                        }
                        required
                        onFocus={() => setFocusedSection("mainContent")}
                        onBlur={() => setFocusedSection(null)}
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        MAIN CONTENT
                      </label>
                      <RichTextEditor
                        value={formData.tasks.content.mainContent}
                        onChange={(html) => {
                          setFormData({
                            ...formData,
                            tasks: {
                              ...formData.tasks,
                              content: {
                                ...formData.tasks.content,
                                mainContent: html,
                              },
                            },
                          });
                        }}
                        onFocusedSection={() =>
                          setFocusedSection("mainContent")
                        }
                        leftFocusedSection={() => setFocusedSection(null)}

                        // onFocus={() => setFocusedSection("mainContent")}
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        OBJECTIVES
                      </label>
                      <div
                        ref={objectivesContainerRef}
                        onFocus={() => setFocusedSection("objectives")}
                        onBlur={(e) => {
                          console.log("onblur triggered");
                          const relatedTarget = e.relatedTarget;
                          if (
                            relatedTarget === null ||
                            !objectivesContainerRef.current.contains(
                              relatedTarget
                            )
                          ) {
                            setFocusedSection(null);
                          }
                        }}
                        className="space-y-2"
                      >
                        {formData.tasks.content.objectives.map(
                          (objective, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                className="flex-1 bg-gray-800/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                                value={objective}
                                onChange={(e) => {
                                  const newObjectives = [
                                    ...formData.tasks.content.objectives,
                                  ];
                                  newObjectives[index] = e.target.value;
                                  setFormData({
                                    ...formData,
                                    tasks: {
                                      ...formData.tasks,
                                      content: {
                                        ...formData.tasks.content,
                                        objectives: newObjectives,
                                      },
                                    },
                                  });
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => removeObjective(index)}
                                className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 text-red-400 transition-all shadow-lg shadow-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )
                        )}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="flex-1 bg-gray-800/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                            value={newObjective}
                            onChange={(e) => setNewObjective(e.target.value)}
                            placeholder="Add new objective"
                          />
                          <button
                            type="button"
                            onClick={addObjective}
                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 text-cyan-400 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/10"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    ref={questionsContainerRef}
                    onFocus={() => setFocusedSection("questions")}
                    onBlur={(e) => {
                      const relatedTarget = e.relatedTarget;
                      if (
                        relatedTarget === null ||
                        !questionsContainerRef.current.contains(relatedTarget)
                      ) {
                        setFocusedSection(null);
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2 font-mono">
                        QUESTIONS
                      </h3>
                    </div>
                    {formData.tasks.content.questions.map(
                      (question, qIndex) => (
                        <div
                          key={qIndex}
                          className="bg-gray-800/30 rounded-lg p-4 space-y-3 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-cyan-300 font-medium font-mono">
                              QUESTION {qIndex + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeQuestion(qIndex)}
                              className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 text-red-400 transition-all shadow-lg shadow-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div>
                            <label className="block text-cyan-300 mb-1 font-mono text-sm">
                              QUESTION TEXT
                            </label>
                            <textarea
                              className="w-full bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
                              value={question.text}
                              onChange={(e) =>
                                updateQuestion(qIndex, "text", e.target.value)
                              }
                              rows="2"
                            />
                          </div>
                          <div>
                            <label className="block text-cyan-300 mb-1 font-mono text-sm">
                              QUESTION TYPE
                            </label>
                            <QuestionTypeDropdown
                              selectedType={question.type}
                              onSelect={(type) =>
                                updateQuestion(qIndex, "type", type)
                              }
                              onFocus={() => setFocusedSection("questions")}
                            />
                          </div>
                          {(question.type === "multiple-choice" ||
                            question.type === "multiple-select") && (
                            <div>
                              <label className="block text-cyan-300 mb-1 font-mono text-sm">
                                OPTIONS
                              </label>
                              <div className="space-y-2">
                                {question.options?.map((option, oIndex) => (
                                  <div key={oIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      className="flex-1 bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
                                      value={option}
                                      onChange={(e) =>
                                        updateOption(
                                          qIndex,
                                          oIndex,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${oIndex + 1}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeOption(qIndex, oIndex)
                                      }
                                      className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 text-red-400 transition-all shadow-lg shadow-red-500/10"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addOption(qIndex)}
                                  className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 text-cyan-400 transition-all text-sm font-mono shadow-lg shadow-cyan-500/10"
                                >
                                  ADD OPTION
                                </button>
                              </div>
                            </div>
                          )}
                          {(question.type === "text" ||
                            question.type === "multiple-choice") && (
                            <div>
                              <label className="block text-cyan-300 mb-1 font-mono text-sm">
                                CORRECT ANSWER
                              </label>
                              {question.type === "multiple-choice" ? (
                                <CorrectAnswerDropdown
                                  options={question.options}
                                  selectedAnswer={question.correctAnswer}
                                  onSelect={(answer) =>
                                    updateQuestion(
                                      qIndex,
                                      "correctAnswer",
                                      answer
                                    )
                                  }
                                  onFocus={() => setFocusedSection("questions")}
                                />
                              ) : (
                                <textarea
                                  className="w-full bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
                                  value={question.correctAnswer}
                                  onChange={(e) =>
                                    updateQuestion(
                                      qIndex,
                                      "correctAnswer",
                                      e.target.value
                                    )
                                  }
                                  rows="2"
                                />
                              )}
                            </div>
                          )}
                          {question.type === "multiple-select" && (
                            <div>
                              <label className="block text-cyan-300 mb-1 font-mono text-sm">
                                CORRECT ANSWERS (SELECT MULTIPLE)
                              </label>
                              <div className="space-y-1">
                                {question.options?.map((option, oIndex) => (
                                  <label
                                    key={oIndex}
                                    className="flex items-center gap-2 text-cyan-300"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={
                                        question.correctAnswers?.includes(
                                          option
                                        ) || false
                                      }
                                      onChange={(e) => {
                                        const currentAnswers =
                                          question.correctAnswers || [];
                                        let newAnswers;
                                        if (e.target.checked) {
                                          newAnswers = [
                                            ...currentAnswers,
                                            option,
                                          ];
                                        } else {
                                          newAnswers = currentAnswers.filter(
                                            (ans) => ans !== option
                                          );
                                        }
                                        updateQuestion(
                                          qIndex,
                                          "correctAnswers",
                                          newAnswers
                                        );
                                      }}
                                      className="rounded accent-cyan-400"
                                    />
                                    {option}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                          <div>
                            <label className="block text-cyan-300 mb-1 font-mono text-sm">
                              HINT
                            </label>
                            <input
                              type="text"
                              className="w-full bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
                              value={question.hint}
                              onChange={(e) =>
                                updateQuestion(qIndex, "hint", e.target.value)
                              }
                              placeholder="Provide a hint for this question"
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={addQuestion}
                      className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg hover:bg-green-500/30 text-green-400 transition-all flex items-center gap-2 shadow-lg shadow-green-500/10"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-mono">ADD QUESTION</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="fixed top-18 right-5 bg-gray-900/50 max-h-[85vh] max-w-[50vw] rounded-xl p-6 backdrop-blur-sm border mt-8 border-purple-500/30 shadow-2xl shadow-purple-500/10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="p-2 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 text-purple-400 transition-all shadow-lg shadow-purple-500/10"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>{" "}
                  <h2 className="text-xl text-purple-300 font-semibold font-mono">
                    LIVE PREVIEW
                  </h2>
                </div>
                <section className="flex items-center gap-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-200 font-medium transition-all font-mono shadow-lg shadow-purple-500/10 hover:bg-purple-500/30 hover:shadow-purple-500/20"
                  >
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {editingChapter ? "UPDATE CHAPTER" : "SAVE CHAPTER"}
                    </span>
                  </motion.button>
                </section>
              </div>
              <div
                ref={sidePreviewRef}
                className="max-h-[70vh] overflow-y-auto bg-gray-900/20 rounded-lg border border-purple-500/20"
              >
                <Content
                  selectedChapterId={selectedChapterId}
                  isPreview={true}
                  PreviewData={formData}
                  PreviewScreen={false}
                  focusedSection={focusedSection}
                />
              </div>
            </div>
          </div>

          {isPreviewOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 p-8 overflow-y-auto"
            >
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-lg text-white z-10 transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              <div ref={fullPreviewRef} className="w-full h-full">
                <Content
                  selectedChapterId={selectedChapterId}
                  isPreview={true}
                  PreviewData={formData}
                  PreviewScreen={true}
                  focusedSection={focusedSection}
                />
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </FocusedSectionContext.Provider>
  );
};

export default AdminEditor;
