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
  Shield,
  Terminal,
  Zap,
  Code,
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
    isEditMode ? "patch" : "post",
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

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "web":
        return <Terminal className="w-5 h-5" />;
      case "crypto":
        return <Shield className="w-5 h-5" />;
      case "pwn":
        return <Zap className="w-5 h-5" />;
      case "security":
        return <Shield className="w-5 h-5" />;
      default:
        return <Code className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "intermediate":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "hard":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "advanced":
        return "text-purple-400 bg-purple-500/10 border-purple-500/30";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-slate-700/50 backdrop-blur-sm rounded-xl border border-slate-600/40 flex items-center justify-center">
                  {getCategoryIcon(form.category)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {isEditMode ? "Update Challenge" : "Create New Challenge"}
                  </h1>
                  <p className="text-slate-400 text-sm">
                    {isEditMode
                      ? "Modify challenge details"
                      : "Add a new CTF challenge"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border border-slate-600/40 hover:border-slate-500/50 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <RotateCcw size={16} className="mr-2" />
                Reset Form
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {(fetchLoading || loading || error || fetchError || Data) && (
          <div className="mb-6">
            <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 rounded-xl p-4">
              {fetchLoading && (
                <p className="text-blue-400 flex items-center">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading challenge data...
                </p>
              )}
              {loading && (
                <p className="text-blue-400 flex items-center">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isEditMode
                    ? "Updating challenge..."
                    : "Creating challenge..."}
                </p>
              )}
              {fetchError && (
                <p className="text-red-400">
                  Error loading challenge: {fetchError}
                </p>
              )}
              {error && <p className="text-red-400">Error: {error}</p>}
              {Data && (
                <p className="text-emerald-400">
                  ✓ Challenge {isEditMode ? "updated" : "created"} successfully!
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-blue-400" />
                  Basic Information
                </h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Challenge Title *
                    </label>
                    <input
                      id="title"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Enter challenge title"
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all backdrop-blur-sm"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-slate-300 mb-2"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the challenge..."
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all backdrop-blur-sm resize-vertical"
                    />
                  </div>

                  {/* Category, Difficulty, Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Category
                      </label>
                      <input
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="e.g., Web, Crypto, Pwn"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="difficulty"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Difficulty *
                      </label>
                      <select
                        id="difficulty"
                        name="difficulty"
                        value={form.difficulty}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all backdrop-blur-sm appearance-none cursor-pointer"
                      >
                        {difficultyOptions.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="bg-slate-800 text-white"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="score"
                        className="block text-sm font-medium text-slate-300 mb-2"
                      >
                        Score
                      </label>
                      <input
                        id="score"
                        name="score"
                        type="number"
                        value={form.score}
                        onChange={handleChange}
                        placeholder="100"
                        min="1"
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  {/* Flag */}
                  <div>
                    <label
                      htmlFor="flag"
                      className="block text-sm font-medium text-slate-300 mb-2"
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
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all backdrop-blur-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Tags and Hints Card */}
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-400" />
                  Tags & Hints
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Tags
                    </label>
                    <div className="space-y-3">
                      {form.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {form.tags.map((tag, index) => (
                            <div key={index}>
                              {editingTag === index ? (
                                <div className="inline-flex items-center px-3 py-1.5 bg-slate-700/50 border border-slate-500/50 rounded-lg text-sm">
                                  <Tag
                                    size={12}
                                    className="mr-2 text-blue-400"
                                  />
                                  <input
                                    value={editTagText}
                                    onChange={(e) =>
                                      setEditTagText(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                      handleEditTagKeyPress(e, index)
                                    }
                                    className="bg-transparent border-none outline-none text-white w-20"
                                    autoFocus
                                  />
                                  <button
                                    type="button"
                                    onClick={() => saveTagEdit(index)}
                                    className="ml-2 text-emerald-400 hover:text-emerald-300"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelTagEdit}
                                    className="ml-1 text-red-400 hover:text-red-300"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <span className="inline-flex items-center px-3 py-1.5 bg-slate-700/30 border border-slate-600/40 rounded-lg text-sm text-slate-300 hover:bg-slate-600/30 transition-colors">
                                  <Tag
                                    size={12}
                                    className="mr-2 text-blue-400"
                                  />
                                  {tag}
                                  <button
                                    type="button"
                                    onClick={() => startEditingTag(tag, index)}
                                    className="ml-2 text-slate-400 hover:text-blue-400"
                                  >
                                    <Edit2 size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 text-slate-400 hover:text-red-400"
                                  >
                                    <X size={12} />
                                  </button>
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleTagKeyPress}
                          placeholder="Add a tag"
                          className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={addTag}
                          className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 text-blue-400 rounded-lg transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hints */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Hints
                    </label>
                    <div className="space-y-3">
                      {form.hints.length > 0 && (
                        <div className="space-y-2">
                          {form.hints.map((hint, index) => (
                            <div key={index}>
                              {editingHint === index ? (
                                <div className="flex items-center gap-2 p-3 bg-slate-700/50 border border-slate-500/50 rounded-lg">
                                  <Lightbulb
                                    size={14}
                                    className="text-yellow-400 flex-shrink-0"
                                  />
                                  <input
                                    value={editHintText}
                                    onChange={(e) =>
                                      setEditHintText(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                      handleEditHintKeyPress(e, index)
                                    }
                                    className="flex-1 bg-transparent border-none outline-none text-white text-sm"
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
                                    className="w-16 bg-transparent border-none outline-none text-white text-sm text-center"
                                    placeholder="Cost"
                                    type="number"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => saveHintEdit(index)}
                                    className="text-emerald-400 hover:text-emerald-300"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelHintEdit}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600/40 rounded-lg hover:bg-slate-600/30 transition-colors cursor-pointer"
                                  onClick={() => startEditingHint(hint, index)}
                                >
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <Lightbulb
                                      size={14}
                                      className="text-yellow-400 flex-shrink-0"
                                    />
                                    <span className="text-slate-300 text-sm truncate">
                                      {hint.text}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                                      {hint.cost}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        removeHint(hint);
                                      }}
                                      className="text-slate-400 hover:text-red-400"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          value={newHint}
                          onChange={(e) => setNewHint(e.target.value)}
                          onKeyPress={handleHintKeyPress}
                          placeholder="Add a hint"
                          className="flex-1 px-3 py-2 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
                        />
                        <input
                          value={newHintCost}
                          onChange={(e) => setNewHintCost(e.target.value)}
                          onKeyPress={handleHintKeyPress}
                          placeholder="Cost"
                          type="number"
                          min="0"
                          className="w-20 px-3 py-2 bg-slate-900/50 border border-slate-600/40 rounded-lg text-white placeholder-slate-500 focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all text-sm"
                        />
                        <button
                          type="button"
                          onClick={addHint}
                          className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/50 text-yellow-400 rounded-lg transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - File Management */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6 sticky top-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-400" />
                  Attachments
                </h2>

                {/* Existing Files */}
                {isEditMode && existingAttachments.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center justify-between">
                      <span>Existing Files</span>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {existingAttachments.length}
                      </span>
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {existingAttachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600/40 rounded-lg"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <Upload
                              size={14}
                              className="text-blue-400 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-slate-300 text-sm font-medium truncate">
                                {file.name || file.filename}
                              </p>
                              <p className="text-slate-500 text-xs">
                                {file.size
                                  ? (file.size / 1024 / 1024).toFixed(2) + " MB"
                                  : "Unknown size"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExistingFile(index)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* File Upload */}
                <div className="relative border-2 border-dashed border-slate-600/50 rounded-lg p-6 text-center hover:border-blue-400/50 transition-all mb-4">
                  <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-300 text-sm mb-1">
                    Drop files here or click to upload
                  </p>
                  <p className="text-slate-500 text-xs mb-3">
                    Multiple files supported
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
                    className="inline-flex items-center px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 text-blue-400 rounded-lg transition-all text-sm"
                    onClick={() =>
                      document.getElementById("attachments").click()
                    }
                  >
                    <Plus size={14} className="mr-1" />
                    Add Files
                  </button>
                </div>

                {/* New Files */}
                {form.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center justify-between">
                      <span>New Files</span>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs">
                        {form.attachments.length}
                      </span>
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {form.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-700/30 border border-slate-600/40 rounded-lg"
                        >
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            <Upload
                              size={14}
                              className="text-emerald-400 flex-shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-slate-300 text-sm font-medium truncate">
                                {file.name}
                              </p>
                              <p className="text-slate-500 text-xs">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-slate-600/30">
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Tags:</span>
                      <span>{form.tags.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hints:</span>
                      <span>{form.hints.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Files:</span>
                      <span>{form.attachments.length}</span>
                    </div>
                    {isEditMode && (
                      <div className="flex justify-between">
                        <span>Existing Files:</span>
                        <span>{existingAttachments.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-600/30 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                {form.difficulty && (
                  <span
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${getDifficultyColor(
                      form.difficulty
                    )}`}
                  >
                    {form.difficulty.charAt(0).toUpperCase() +
                      form.difficulty.slice(1)}
                  </span>
                )}
                {form.category && (
                  <span className="text-slate-400 text-sm flex items-center">
                    {getCategoryIcon(form.category)}
                    <span className="ml-2">{form.category}</span>
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || fetchLoading}
                className="w-full sm:w-auto px-8 py-3 bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-slate-600/50 disabled:cursor-not-allowed border border-blue-400/50 hover:border-blue-400/70 text-blue-400 hover:text-blue-300 font-semibold rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                {loading || fetchLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isEditMode ? "Updating..." : "Creating..."}
                  </div>
                ) : isEditMode ? (
                  "Update Challenge"
                ) : (
                  "Create Challenge"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
