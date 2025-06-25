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
} from "lucide-react";
import Content from "../../../routes/content";
import RichTextEditor from "./RichTextEditor";

// Create a context for the focused section
const FocusedSectionContext = createContext();
import Placeholder from "./Placeholder.json";
// Initial placeholder data matching the JSON structure

const AdminEditor = (isEditing = false, OldData) => {
  const initialData = isEditing && OldData ? OldData : Placeholder;

  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [chapters, setChapters] = useState([]);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState(initialData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newObjective, setNewObjective] = useState("");
  const [focusedSection, setFocusedSection] = useState(null);

  const sidePreviewRef = useRef(null);
  const fullPreviewRef = useRef(null);
  const objectivesContainerRef = useRef(null);
  const questionsContainerRef = useRef(null);

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
      <div className="bg-gradient-to-br from-gray-900 via-black mt-23 to-gray-900 min-h-screen p-5">
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
                        CLASSIFICATION ID
                      </label>
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.classificationId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            classificationId: e.target.value,
                          })
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
                        value={formData.lessonNum}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lessonNum: parseInt(e.target.value) || 1,
                          })
                        }
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
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.icon}
                        onChange={(e) =>
                          setFormData({ ...formData, icon: e.target.value })
                        }
                        placeholder="e.g., Shield, Terminal, Lock"
                        onFocus={() => setFocusedSection("icon")}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-400 border-b border-cyan-500/30 pb-2 font-mono">
                      CONTENT DETAILS
                    </h3>
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
                        onFocus={() => setFocusedSection("contentTitle")}
                      />
                    </div>
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
                      <input
                        type="text"
                        className="w-full bg-gray-800/50 rounded-lg p-3 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono shadow-lg shadow-cyan-500/10"
                        value={formData.content.duration}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            content: {
                              ...formData.content,
                              duration: e.target.value,
                            },
                          })
                        }
                        placeholder="e.g., 30-minutes"
                        required
                        onFocus={() => setFocusedSection("contentDuration")}
                      />
                    </div>
                    <div>
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
                    <div>
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
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg hover:bg-green-500/30 text-green-400 transition-all flex items-center gap-2 shadow-lg shadow-green-500/10"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="font-mono">ADD QUESTION</span>
                      </button>
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
                            <select
                              className="w-full bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
                              value={question.type}
                              onChange={(e) =>
                                updateQuestion(qIndex, "type", e.target.value)
                              }
                            >
                              <option value="text">Text Answer</option>
                              <option value="multiple-choice">
                                Multiple Choice
                              </option>
                              <option value="multiple-select">
                                Multiple Select
                              </option>
                            </select>
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
                                <select
                                  className="w-full bg-gray-700/50 rounded-lg p-2 text-white border border-cyan-500/30 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all font-mono"
                                  value={question.correctAnswer}
                                  onChange={(e) =>
                                    updateQuestion(
                                      qIndex,
                                      "correctAnswer",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="">
                                    Select correct answer
                                  </option>
                                  {question.options?.map((option, oIndex) => (
                                    <option key={oIndex} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
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
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-white font-medium transition-all font-mono shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30"
                    >
                      <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {editingChapter ? "UPDATE CHAPTER" : "SAVE CHAPTER"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="fixed top-18 right-5 bg-gray-900/50 max-h-[85vh] max-w-[50vw] rounded-xl p-6 backdrop-blur-sm border mt-8 border-purple-500/30 shadow-2xl shadow-purple-500/10">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <Signal className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl text-purple-300 font-semibold font-mono">
                    LIVE PREVIEW
                  </h2>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="p-2 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 text-purple-400 transition-all shadow-lg shadow-purple-500/10"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
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
            <div className="fixed inset-0 bg-black/95 z-50 p-8 overflow-y-auto">
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
            </div>
          )}
        </section>
      </div>
    </FocusedSectionContext.Provider>
  );
};

export default AdminEditor;
