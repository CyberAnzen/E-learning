import React, { useState, useEffect, useRef, createContext } from "react";
import {
  Maximize2,
  Shield,
  X,
  Plus,
  Trash2,
  Save,
  RotateCcw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Content from "../../../routes/content";
import RichTextEditor from "./RichTextEditor";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
import { IconDropdown } from "./AdminEditor/IconDropdown";

/**
 * Enhanced Classification Dropdown Component
 * Styled with the same beautiful animations as the icon dropdown
 */
import { ClassificationDropdown } from "./AdminEditor/ClassificationDropdown";

/**
 * Enhanced Question Type Dropdown Component
 * Styled with the same beautiful animations
 */
import { QuestionTypeDropdown } from "./AdminEditor/QuestionTypeDropdown";

/**
 * Enhanced Correct Answer Dropdown Component for Multiple Choice Questions
 */
import { CorrectAnswerDropdown } from "./AdminEditor/CorrectAnswerDropdown";

import SaveModal from "../layout/SaveModal";

const AdminEditor = ({ update = false }) => {
  const { lessonId } = useParams();
  const [allImageUrls, setAllImageUrls] = useState([]);
  const [currentImageUrls, setCurrentImageUrls] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const initialClassificationId = location.state?.ClassificationId || null;

  // Added state for storing fetched lesson data
  const [oldLessonData, setOldLessonData] = useState(null);
  const [isLoading, setIsLoading] = useState(update); // Only show loading in update mode
  const [ClassificationId, setClassificationId] = useState(
    initialClassificationId
  );
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [formData, setFormData] = useState(null); // Initialize as null, will be set properly
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newObjective, setNewObjective] = useState("");
  const [focusedSection, setFocusedSection] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const retryTimeoutRef = useRef(null);
  const sidePreviewRef = useRef(null);
  const fullPreviewRef = useRef(null);
  const objectivesContainerRef = useRef(null);
  const questionsContainerRef = useRef(null);

  // Fetched data - now holds the array of classifications directly
  const [ClassificationsData, setClassificationsData] = useState([]);
  const [minLessonNum, setMinLessonNum] = useState(1);

  // Initialize form data for new lessons
  useEffect(() => {
    if (!update) {
      const initialData = {
        ...Placeholder,
        classificationId: initialClassificationId,
      };
      setFormData(initialData);
      setIsLoading(false);
    }
  }, [update, initialClassificationId]);

  // Fetch lesson data for updates
  useEffect(() => {
    // Only fetch if we're in update mode and have the required parameters
    if (!update || !initialClassificationId || !lessonId) {
      return;
    }

    // Define async fetch function
    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${BACKEND_URL}/lesson/${initialClassificationId}/${lessonId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lesson");
        }

        const { data } = await response.json();
        // Store fetched data in state
        setOldLessonData(data);

        // Immediately set form data with fetched data
        setFormData(data);
        setAllImageUrls(data.allImages || []);
        setCurrentImageUrls(data.addedImages || []);
        setClassificationId(data.classificationId);
      } catch (err) {
        // console.error("Error fetching lesson:", err);
        setErrorMessage("Failed to load lesson data. Retrying...");
        // Set up retry with timeout
        retryTimeoutRef.current = setTimeout(fetchLesson, 5000);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the fetch function
    fetchLesson();

    // Cleanup on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [update, initialClassificationId, lessonId]);

  // Fetch classifications data
  useEffect(() => {
    const FetchClassifications = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/classification/`);
        if (!response.ok) {
          throw new Error("Failed to fetch classifications");
        }
        const { data } = await response.json();
        setClassificationsData(data.classification);
      } catch (err) {
        // console.error("Error fetching classifications:", err);
        retryTimeoutRef.current = setTimeout(
          () => FetchClassifications(),
          5000
        );
      }
    };

    FetchClassifications();
  }, []);

  // Update formData when ClassificationId changes (for new lessons)
  useEffect(() => {
    if (formData && !update) {
      setFormData((prev) => ({ ...prev, classificationId: ClassificationId }));
    }
  }, [ClassificationId, update]);

  // Set minimum lesson number for new lessons
  useEffect(() => {
    if (!ClassificationsData || ClassificationsData.length === 0 || update)
      return;

    const selected = ClassificationsData?.find(
      (c) => c._id === ClassificationId
    );

    if (selected) {
      const nextLessonNum = selected.lessonCount + 1;
      setMinLessonNum(nextLessonNum);
      setFormData((prev) => ({
        ...prev,
        lessonNum: nextLessonNum,
        classificationId: ClassificationId,
      }));
    }
  }, [ClassificationsData, ClassificationId, update]);

  // Reset function for update mode
  const handleReset = () => {
    if (update && oldLessonData) {
      setFormData({ ...oldLessonData });
      setAllImageUrls(oldLessonData.allImages || []);
      setCurrentImageUrls(oldLessonData.addedImages || []);
      setClassificationId(oldLessonData.classificationId);
      setNewObjective("");
      setSuccessMessage("Form reset to original values");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const updatedFormData = {
      ...formData,
      allImages: allImageUrls,
      addedImages: currentImageUrls,
      classificationId: ClassificationId,
      content: { ...formData.content },
      tasks: {
        ...formData.tasks,
        content: {
          ...formData.tasks.content,
          questions: formData.tasks.content.questions.map((q) => ({ ...q })),
        },
      },
    };

    // Conditionally handle create vs update
    let url, method;
    if (update && oldLessonData) {
      url = `${BACKEND_URL}/lesson/update`;
      method = "PATCH";
    } else {
      url = `${BACKEND_URL}/lesson/create`;
      method = "POST";
      // Remove _id fields for new lessons
      delete updatedFormData._id;
      delete updatedFormData.content._id;
      delete updatedFormData.tasks._id;
      updatedFormData.tasks.content.questions =
        updatedFormData.tasks.content.questions.map((q) => {
          const { _id, ...rest } = q;
          return rest;
        });
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFormData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${update ? "update" : "create"} lesson`);
      }

      const result = await response.json();
      // console.log(
      //   `Lesson ${update ? "updated" : "created"} successfully:`,
      //   result
      // );

      setSuccessMessage(
        `Lesson ${update ? "updated" : "created"} successfully`
      );
      setTimeout(() => {
        setSuccessMessage("");
        navigate(
          `/lesson/${result.lesson.classificationId}/${result.lesson._id}`
        );
      }, 3000);
    } catch (err) {
      // console.error(`Error ${update ? "updating" : "creating"} lesson:`, err);
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
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
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: { ...formData.tasks.content, questions: updatedQuestions },
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
    if (!updatedQuestions[questionIndex].options)
      updatedQuestions[questionIndex].options = [];
    updatedQuestions[questionIndex].options.push("");
    setFormData({
      ...formData,
      tasks: {
        ...formData.tasks,
        content: { ...formData.tasks.content, questions: updatedQuestions },
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
        content: { ...formData.tasks.content, questions: updatedQuestions },
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
        content: { ...formData.tasks.content, questions: updatedQuestions },
      },
    });
  };

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, [focusedSection]);

  // Get current classification name
  const getCurrentClassificationName = () => {
    const classification = ClassificationsData?.find(
      (c) => c._id === ClassificationId
    );
    return classification?.name || "Selected Classification";
  };

  // Show loading state when data is being fetched
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-black via-gray-900 to-black mt-23 min-h-screen p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2">Loading...</h2>
          <p className="text-gray-400">
            {update ? "Fetching lesson data..." : "Initializing editor..."}
          </p>
        </div>
      </div>
    );
  }

  // Don't render the form until formData is available
  if (!formData) {
    return (
      <div className="bg-gradient-to-br from-black via-gray-900 to-black mt-23 min-h-screen p-5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-gray-400">Failed to load form data</p>
        </div>
      </div>
    );
  }

  return (
    <FocusedSectionContext.Provider
      value={{ focusedSection, setFocusedSection }}
    >
      <div className="bg-gradient-to-br from-black via-gray-900 to-black mt-23 min-h-screen p-5">
        <section className="lg:mt-0 xl:-ml-20 lg:max-w-[45vw] xl:max-w-[100vw]">
          <div className="max-w-7xl mx-auto">
            <div className="text-left mb-8">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                {update ? "Update Lesson" : "Add New Lessons"}
              </h1>
              <p className="text-gray-400 font-mono">
                Select the appropriate Classification
              </p>
              {successMessage && (
                <div className="my-2  max-w-[30vw] p-4 rounded-lg shadow-lg bg-green-500/10 border border-green-500/20 text-green-700">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="my-2 max-w-[30vw] p-4 rounded-lg shadow-lg bg-red-500/10 border border-red-500/20 text-red-700">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 rounded-xl p-6 backdrop-blur-sm border border-cyan-500/30 shadow-2xl shadow-cyan-500/10">
                <div className="flex items-center gap-3 mb-6 border-b border-cyan-500/30 pb-4">
                  <Shield className="w-8 h-8 text-cyan-400" />
                  <h1 className="text-2xl font-bold text-cyan-300 font-mono">
                    COURSE EDITOR
                  </h1>
                  {update && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="ml-auto px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 text-orange-400 transition-all flex items-center gap-2 shadow-lg shadow-orange-500/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="font-mono text-sm">RESET</span>
                    </button>
                  )}
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
                        classifications={ClassificationsData || []}
                        selectedId={ClassificationId}
                        onSelect={(selectedId) =>
                          setClassificationId(selectedId)
                        }
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
                        value={formData?.lessonNum || minLessonNum}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (update || value >= minLessonNum) {
                            setFormData((prev) => ({
                              ...prev,
                              lessonNum: value,
                            }));
                          }
                        }}
                        min={update ? 1 : minLessonNum}
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
                        value={formData?.lesson || ""}
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
                        selectedIcon={formData?.icon || ""}
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
                        value={formData?.content?.author || ""}
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
                          value={
                            formData?.content?.duration?.split("-")[0] || ""
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: {
                                ...formData.content,
                                duration: `${e.target.value}-${
                                  formData?.content?.duration?.split("-")[1] ||
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
                            formData?.content?.duration?.split("-")[1] ||
                            "minutes"
                          }
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              content: {
                                ...formData.content,
                                duration: `${
                                  formData?.content?.duration?.split("-")[0] ||
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
                        value={formData?.tasks?.title || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tasks: {
                              ...formData.tasks,
                              title: e.target.value,
                            },
                          })
                        }
                        required
                        onFocus={() => setFocusedSection("taskTitle")}
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        CONTENT TITLE
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData?.content?.title || ""}
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
                      {formData?.tasks?.content?.mainContent && (
                        <RichTextEditor
                          value={formData?.tasks?.content?.mainContent}
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
                          allImageUrls={allImageUrls}
                          setAllImageUrls={setAllImageUrls}
                          currentImageUrls={currentImageUrls}
                          setCurrentImageUrls={setCurrentImageUrls}
                          onFocusedSection={() =>
                            setFocusedSection("mainContent")
                          }
                          leftFocusedSection={() => setFocusedSection(null)}
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-cyan-300 mb-2 font-mono text-sm tracking-wider">
                        OBJECTIVES
                      </label>
                      <div
                        ref={objectivesContainerRef}
                        onFocus={() => setFocusedSection("objectives")}
                        onBlur={(e) => {
                          const relatedTarget = e.relatedTarget;
                          if (
                            !relatedTarget ||
                            !objectivesContainerRef.current.contains(
                              relatedTarget
                            )
                          ) {
                            setFocusedSection(null);
                          }
                        }}
                        className="space-y-2"
                      >
                        {formData?.tasks?.content?.objectives?.map(
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
                        !relatedTarget ||
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
                    {formData?.tasks?.content?.questions?.map(
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
                                    <span className="flex justify-center align-middle items-center w-5 h-5 border-1 rounded-full">
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
                                          const newAnswers = e.target.checked
                                            ? [...currentAnswers, option]
                                            : currentAnswers.filter(
                                                (ans) => ans !== option
                                              );
                                          updateQuestion(
                                            qIndex,
                                            "correctAnswers",
                                            newAnswers
                                          );
                                        }}
                                        className={`rounded-full h-5 w-5 accent-teal-400 transition-opacity duration-200 cursor-pointer ${
                                          question.correctAnswers?.includes(
                                            option
                                          )
                                            ? "opacity-100"
                                            : "opacity-50 hover:opacity-75"
                                        }`}
                                      />
                                    </span>
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
                  </button>
                  <h2 className="text-xl text-purple-300 font-semibold font-mono">
                    LIVE PREVIEW
                  </h2>
                </div>
                <section className="flex items-center gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-500/20 border border-purple-500/50 rounded-lg text-purple-200 font-medium transition-all font-mono shadow-lg shadow-purple-500/10 hover:bg-purple-500/30 hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      {isSubmitting
                        ? "SAVING..."
                        : update
                        ? "UPDATE LESSON"
                        : "SAVE LESSON"}
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

          <SaveModal
            showSaveConfirm={showDeleteConfirm}
            setShowSaveConfirm={setShowDeleteConfirm}
            isSaving={isSubmitting}
            handleSave={handleSubmit}
            modaltitle={`${update ? "Update" : "Save"} Confirmation`}
            message={
              <span>
                Are you sure you want to save{" "}
                <span className="text-emerald-500/80 font-bold">
                  "{formData?.content?.title || "Untitled Lesson"}"
                </span>{" "}
                under the{" "}
                <span className="font-bold text-emerald-500/80">
                  "{getCurrentClassificationName()}"
                </span>{" "}
                ?
                {update
                  ? " This will update the existing lesson."
                  : " This will create a new lesson."}
              </span>
            }
          />
        </section>
      </div>
    </FocusedSectionContext.Provider>
  );
};

export default AdminEditor;
