import React, { useState, useEffect } from "react";
import Usefetch from "../../hooks/Usefetch";
import {
  X,
  Plus,
  Upload,
  Tag,
  Lightbulb,
  RotateCcw,
  Edit2,
} from "lucide-react";
import { useParams } from "react-router-dom";

export default function AddChallenges() {
  const { challengeId } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    score: "",
    flag: "",
    tags: [],
    hints: [],
    attachments: [],
  });

  const [originalForm, setOriginalForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    score: "",
    flag: "",
    tags: [],
    hints: [],
    attachments: [],
  });

  const [newTag, setNewTag] = useState("");
  const [newHint, setNewHint] = useState("");
  const [newHintCost, setNewHintCost] = useState("");
  const [editingHint, setEditingHint] = useState(null);
  const [editHintText, setEditHintText] = useState("");
  const [editHintCost, setEditHintCost] = useState("");
  const [editingTag, setEditingTag] = useState(null);
  const [editTagText, setEditTagText] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingAttachments, setExistingAttachments] = useState([]);

  // Initialize fetch hook in manual POST mode for create/update
  const { Data, error, loading, retry } = Usefetch(
    isEditMode
      ? `challenge/admin/update/${challengeId}`
      : "challenge/admin/create",
    "post",
    null,
    {},
    false
  );

  // Fetch hook for getting existing challenge data
  const {
    Data: existingData,
    error: fetchError,
    loading: fetchLoading,
    retry: fetchRetry,
  } = Usefetch(
    challengeId ? `challenge/admin/${challengeId}` : null,
    "get",
    null,
    {},
    false
  );

  // Effect to determine if we're in edit mode and fetch data
  useEffect(() => {
    if (challengeId) {
      setIsEditMode(true);
      fetchRetry();
    } else {
      setIsEditMode(false);
      resetForm();
    }
  }, [challengeId]);

  // Effect to populate form when existing data is fetched
  useEffect(() => {
    if (existingData?.Challenge && challengeId) {
      const formData = {
        title: existingData?.Challenge.title || "",
        description: existingData?.Challenge.description || "",
        category: existingData?.Challenge.category || "",
        difficulty: existingData?.Challenge.difficulty || "",
        score: existingData?.Challenge.score || "",
        flag: existingData?.Challenge.flag || "",
        tags: existingData?.Challenge.tags || [],
        hints:
          existingData?.Challenge.hint || existingData?.Challenge.hints || [],
        attachments: [], // New files to be uploaded
      };

      setForm(formData);
      setOriginalForm({ ...formData });
      setExistingAttachments(existingData?.Challenge.attachments || []);
    }
  }, [existingData?.Challenge, challengeId]);

  // Reset form to original state
  function resetForm() {
    const emptyForm = {
      title: "",
      description: "",
      category: "",
      difficulty: "",
      score: "",
      flag: "",
      tags: [],
      hints: [],
      attachments: [],
    };

    if (isEditMode) {
      setForm({ ...originalForm });
    } else {
      setForm(emptyForm);
      setOriginalForm(emptyForm);
    }

    setNewTag("");
    setNewHint("");
    setNewHintCost("");
    setEditingHint(null);
    setEditHintText("");
    setEditHintCost("");
    setEditingTag(null);
    setEditTagText("");
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileAdd(e) {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
    e.target.value = "";
  }

  function removeFile(index) {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  }

  function removeExistingFile(index) {
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function addTag() {
    if (newTag.trim() && !form.tags.includes(newTag.trim())) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  }

  function removeTag(tagToRemove) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  }

  function startEditingTag(tag, index) {
    setEditingTag(index);
    setEditTagText(tag);
  }

  function saveTagEdit(index) {
    if (editTagText.trim() && !form.tags.includes(editTagText.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: prev.tags.map((t, i) => (i === index ? editTagText.trim() : t)),
      }));
      setEditingTag(null);
      setEditTagText("");
    }
  }

  function cancelTagEdit() {
    setEditingTag(null);
    setEditTagText("");
  }

  function addHint() {
    if (newHint.trim() && newHintCost.trim()) {
      const exists = form.hints.some((h) => h.text === newHint.trim());
      if (!exists) {
        setForm((prev) => ({
          ...prev,
          hints: [
            ...prev.hints,
            { text: newHint.trim(), cost: parseInt(newHintCost) || 0 },
          ],
        }));
        setNewHint("");
        setNewHintCost("");
      }
    }
  }

  function removeHint(hintToRemove) {
    setForm((prev) => ({
      ...prev,
      hints: prev.hints.filter((h) => h.text !== hintToRemove.text),
    }));
  }

  function startEditingHint(hint, index) {
    setEditingHint(index);
    setEditHintText(hint.text);
    setEditHintCost(hint.cost.toString());
  }

  function saveHintEdit(index) {
    if (editHintText.trim() && editHintCost.trim()) {
      setForm((prev) => ({
        ...prev,
        hints: prev.hints.map((h, i) =>
          i === index
            ? { text: editHintText.trim(), cost: parseInt(editHintCost) || 0 }
            : h
        ),
      }));
      setEditingHint(null);
      setEditHintText("");
      setEditHintCost("");
    }
  }

  function cancelHintEdit() {
    setEditingHint(null);
    setEditHintText("");
    setEditHintCost("");
  }

  function handleTagKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  function handleEditTagKeyPress(e, index) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveTagEdit(index);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelTagEdit();
    }
  }

  function handleHintKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addHint();
    }
  }

  function handleEditHintKeyPress(e, index) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveHintEdit(index);
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelHintEdit();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();

    // Add form fields properly
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("difficulty", form.difficulty);
    formData.append("score", form.score);
    formData.append("flag", form.flag);

    // Add tags as individual entries
    form.tags.forEach((tag) => {
      formData.append("tags", tag);
    });

    // Add hints as JSON string - always send hints field
    formData.append("hints", JSON.stringify(form.hints));

    // Add attachments
    form.attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    // Add existing attachments for update mode
    if (isEditMode && existingAttachments.length > 0) {
      formData.append(
        "existingAttachments",
        JSON.stringify(existingAttachments)
      );
    }

    // Determine the endpoint
    const endpoint = isEditMode
      ? `challenge/admin/update/${challengeId}`
      : "challenge/admin/create";
    const method = isEditMode ? "put" : "post";

    try {
      await retry(endpoint, { data: formData, method });

      // Show success message and reset form if creating
      if (!isEditMode) {
        resetForm();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  }

  const difficultyOptions = [
    { value: "", label: "Select Difficulty" },
    { value: "easy", label: "Easy" },
    { value: "intermediate", label: "Intermediate" },
    { value: "hard", label: "Hard" },
    { value: "advanced", label: "Advanced" },
  ];

  return (
    <section className="min-h-screen w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 lg:py-10 text-green-400">
      <div className="max-w-7xl mx-auto">
        <main className="bg-black border border-green-800 p-4 sm:p-6 lg:p-8 xl:p-10 rounded-2xl shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-400 border-b border-green-800 pb-4 sm:border-b-0 sm:pb-0">
              {isEditMode ? "Update Challenge" : "Add New Challenge"}
            </h1>
            <button
              type="button"
              onClick={resetForm}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-green-300 font-medium rounded-lg transition-all"
            >
              <RotateCcw size={16} className="mr-2" />
              Reset Form
            </button>
          </div>

          {/* Status Messages */}
          {fetchLoading && (
            <p className="text-green-300 mb-4">Loading challenge data...</p>
          )}
          {fetchError && (
            <p className="text-red-500 mb-4">
              Error loading challenge: {fetchError}
            </p>
          )}
          {loading && (
            <p className="text-green-300 mb-4">
              {isEditMode ? "Updating..." : "Submitting..."}
            </p>
          )}
          {error && <p className="text-red-500 mb-4">Error: {error}</p>}
          {Data && (
            <p className="text-green-500 mb-4">
              Success! Challenge {isEditMode ? "updated" : "created"}.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Layout for Desktop/Tablet */}
            <div className="grid grid-cols-1 lg:grid-cols-5 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Main Form Fields */}
              <div className="lg:col-span-3 xl:col-span-2 space-y-6">
                {/* Title */}
                <div className="flex flex-col">
                  <label
                    htmlFor="title"
                    className="mb-2 text-sm font-medium text-green-300"
                  >
                    Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Challenge Title"
                    required
                    className="w-full px-4 py-3 bg-black border border-green-700 rounded-lg text-green-100 placeholder-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col">
                  <label
                    htmlFor="description"
                    className="mb-2 text-sm font-medium text-green-300"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Challenge description"
                    rows={6}
                    required
                    className="w-full px-4 py-3 bg-black border border-green-700 rounded-lg text-green-100 placeholder-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all resize-vertical"
                  />
                </div>

                {/* Category, Difficulty, Score Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  <div className="flex flex-col">
                    <label
                      htmlFor="category"
                      className="mb-2 text-sm font-medium text-green-300"
                    >
                      Category
                    </label>
                    <input
                      id="category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g., Web, Crypto, Pwn"
                      className="w-full px-4 py-3 bg-black border border-green-700 rounded-lg text-green-100 placeholder-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor="difficulty"
                      className="mb-2 text-sm font-medium text-green-300"
                    >
                      Difficulty *
                    </label>
                    <select
                      id="difficulty"
                      name="difficulty"
                      value={form.difficulty}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-black border border-green-700 rounded-lg text-green-100 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all appearance-none cursor-pointer"
                    >
                      {difficultyOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-black text-green-100"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:col-span-2 xl:col-span-1">
                    <label
                      htmlFor="score"
                      className="mb-2 text-sm font-medium text-green-300"
                    >
                      Score
                    </label>
                    <input
                      id="score"
                      name="score"
                      type="number"
                      value={form.score}
                      onChange={handleChange}
                      placeholder="e.g., 100"
                      min="1"
                      className="w-full px-4 py-3 bg-black border border-green-700 rounded-lg text-green-100 placeholder-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Flag */}
                <div className="flex flex-col">
                  <label
                    htmlFor="flag"
                    className="mb-2 text-sm font-medium text-green-300"
                  >
                    Flag *
                  </label>
                  <input
                    id="flag"
                    name="flag"
                    value={form.flag}
                    onChange={handleChange}
                    placeholder="flag{example_flag_here}"
                    required
                    className="w-full px-4 py-3 bg-black border border-green-700 rounded-lg text-green-100 placeholder-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                  />
                </div>

                {/* Tags */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-green-300">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {form.tags.map((tag, index) => (
                        <div key={index}>
                          {editingTag === index ? (
                            <div className="inline-flex items-center px-3 py-1 bg-green-800/30 border border-green-600 rounded-full text-sm text-green-200">
                              <Tag size={12} className="mr-1 flex-shrink-0" />
                              <input
                                value={editTagText}
                                onChange={(e) => setEditTagText(e.target.value)}
                                onKeyPress={(e) =>
                                  handleEditTagKeyPress(e, index)
                                }
                                className="bg-transparent border-none outline-none text-green-200 placeholder-green-400 w-20"
                                placeholder="Tag text"
                              />
                              <button
                                type="button"
                                onClick={() => saveTagEdit(index)}
                                className="ml-2 p-0.5 text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                onClick={cancelTagEdit}
                                className="ml-1 p-0.5 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 bg-green-800/30 border border-green-600 rounded-full text-sm text-green-200">
                              <Tag size={12} className="mr-1" />
                              {tag}
                              <button
                                type="button"
                                onClick={() => startEditingTag(tag, index)}
                                className="ml-2 p-0.5 text-green-400 hover:text-blue-400 transition-colors"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 p-0.5 text-green-400 hover:text-red-400 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        placeholder="Add a tag"
                        className="flex-1 px-4 py-2 bg-black border border-green-700 rounded-lg text-green-100 placeholder-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-black font-medium rounded-lg transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Hints */}
                  <div className="flex flex-col">
                    <label className="mb-2 text-sm font-medium text-green-300">
                      Hints
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {form.hints.map((hint, index) => (
                        <div key={index}>
                          {editingHint === index ? (
                            <div className="inline-flex items-center px-3 py-1 bg-green-800/30 border border-green-600 rounded-full text-sm text-green-200">
                              <Lightbulb
                                size={12}
                                className="mr-1 flex-shrink-0"
                              />
                              <input
                                value={editHintText}
                                onChange={(e) =>
                                  setEditHintText(e.target.value)
                                }
                                onKeyPress={(e) =>
                                  handleEditHintKeyPress(e, index)
                                }
                                className="bg-transparent border-none outline-none text-green-200 placeholder-green-400 w-20"
                                placeholder="Hint text"
                              />
                              <input
                                value={editHintCost}
                                onChange={(e) =>
                                  setEditHintCost(e.target.value)
                                }
                                onKeyPress={(e) =>
                                  handleEditHintKeyPress(e, index)
                                }
                                className="bg-transparent border-none outline-none text-green-200 placeholder-green-400 w-12 ml-1"
                                placeholder="Cost"
                                type="number"
                              />
                              <button
                                type="button"
                                onClick={() => saveHintEdit(index)}
                                className="ml-2 p-0.5 text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                onClick={cancelHintEdit}
                                className="ml-1 p-0.5 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <span
                              className="inline-flex items-center px-3 py-1 bg-green-800/30 border border-green-600 rounded-full text-sm text-green-200 max-w-full cursor-pointer"
                              onClick={() => startEditingHint(hint, index)}
                            >
                              <Lightbulb
                                size={12}
                                className="mr-1 flex-shrink-0"
                              />
                              <span className="truncate">{hint.text}</span>
                              <span className="ml-2 px-1.5 py-0.5 bg-green-600/50 rounded text-xs font-medium">
                                {hint.cost}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeHint(hint);
                                }}
                                className="ml-2 p-0.5 text-green-400 hover:text-red-400 transition-colors flex-shrink-0"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={newHint}
                        onChange={(e) => setNewHint(e.target.value)}
                        onKeyPress={handleHintKeyPress}
                        placeholder="Add a hint"
                        className="flex-1 px-4 py-2 bg-black border border-green-700 rounded-lg text-green-100 placeholder-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                      />
                      <input
                        value={newHintCost}
                        onChange={(e) => setNewHintCost(e.target.value)}
                        onKeyPress={handleHintKeyPress}
                        placeholder="Cost"
                        type="number"
                        min="0"
                        className="w-20 px-4 py-2 bg-black border border-green-700 rounded-lg text-green-100 placeholder-green-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={addHint}
                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg transition-all"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - File Management */}
              <div className="lg:col-span-2 xl:col-span-1 space-y-6">
                <div className="bg-gray-800/30 border border-green-800 rounded-xl p-4 lg:p-6 sticky top-25">
                  <h3 className="text-lg font-semibold text-green-300 mb-4 flex items-center">
                    <Upload size={18} className="mr-2" />
                    Attachments
                  </h3>

                  {/* Existing Files (for edit mode) */}
                  {isEditMode && existingAttachments.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <h4 className="text-sm font-medium text-green-300 flex items-center justify-between">
                        <span>Existing Files</span>
                        <span className="text-xs bg-blue-800/30 px-2 py-1 rounded-full">
                          {existingAttachments.length}
                        </span>
                      </h4>
                      <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                        {existingAttachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between bg-blue-900/20 border border-blue-800/50 rounded-lg p-3"
                          >
                            <div className="flex items-start min-w-0 flex-1">
                              <Upload
                                size={14}
                                className="text-blue-400 mr-2 mt-0.5 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-blue-100 font-medium text-sm truncate">
                                  {file.name || file.filename}
                                </p>
                                <p className="text-blue-600 text-xs">
                                  {file.size
                                    ? (file.size / 1024 / 1024).toFixed(2) +
                                      " MB"
                                    : "Unknown size"}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeExistingFile(index)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all flex-shrink-0 ml-2"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File Upload Area */}
                  <div className="relative border-2 border-dashed border-green-700 rounded-lg p-6 text-center hover:border-green-500 transition-all mb-4">
                    <Upload size={24} className="text-green-500 mx-auto mb-2" />
                    <p className="text-green-300 text-sm mb-2">
                      Drop files here or click to upload
                    </p>
                    <p className="text-green-600 text-xs mb-3">
                      {isEditMode
                        ? "Add new files or replace existing ones"
                        : "Multiple files supported"}
                    </p>
                    <input
                      id="attachments"
                      name="attachments"
                      type="file"
                      multiple
                      onChange={handleFileAdd}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-500 text-black font-medium text-sm rounded-lg transition-all"
                      onClick={() =>
                        document.getElementById("attachments").click()
                      }
                    >
                      <Plus size={14} className="mr-1" />
                      {isEditMode ? "Add More Files" : "Add Files"}
                    </button>
                  </div>

                  {/* New File List */}
                  {form.attachments.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-green-300 flex items-center justify-between">
                        <span>New Files</span>
                        <span className="text-xs bg-green-800/30 px-2 py-1 rounded-full">
                          {form.attachments.length}
                        </span>
                      </h4>
                      <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                        {form.attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between bg-gray-900/50 border border-green-800/50 rounded-lg p-3"
                          >
                            <div className="flex items-start min-w-0 flex-1">
                              <Upload
                                size={14}
                                className="text-green-400 mr-2 mt-0.5 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-green-100 font-medium text-sm truncate">
                                  {file.name}
                                </p>
                                <p className="text-green-600 text-xs">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-all flex-shrink-0 ml-2"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-green-800">
              <div className="text-sm text-green-600 ordersm:order-1">
                <span className="inline-block mr-4">
                  Tags: {form.tags.length}
                </span>
                <span className="inline-block mr-4">
                  Hints: {form.hints.length}
                </span>
                <span className="inline-block mr-4">
                  New Files: {form.attachments.length}
                </span>
                {isEditMode && (
                  <span className="inline-block">
                    Existing Files: {existingAttachments.length}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || fetchLoading}
                className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50 order-1 sm:order-2"
              >
                {isEditMode ? "Update Challenge" : "Create Challenge"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </section>
  );
}
