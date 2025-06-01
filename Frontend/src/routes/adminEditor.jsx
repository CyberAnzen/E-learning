import { useState, useEffect, useRef } from "react";
import Content from "./content";
import { Maximize2, Shield, X } from "lucide-react";

const courseData = [
  // Placeholder for initial course data
];

const AdminEditor = () => {
  const [chapters, setChapters] = useState(courseData);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState({
    id: Date.now(),
    chapter: "",
    icon: Shield,
    completed: false,
    content: {
      title: "",
      author: "",
      duration: "",
      image: "",
      description: "",
      questions: [],
    },
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const sidePreviewRef = useRef(null);
  const fullPreviewRef = useRef(null);

  // Sync formData with editingChapter
  useEffect(() => {
    if (editingChapter) {
      setFormData(editingChapter);
    }
  }, [editingChapter]);

  // Prevent scroll propagation for side-by-side preview
  useEffect(() => {
    const handleWheel = (e) => {
      const el = sidePreviewRef.current;
      if (!el) return;

      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight;
      const atTop = el.scrollTop === 0;

      if (
        (e.deltaY > 0 && atBottom) || // Scrolling down at bottom
        (e.deltaY < 0 && atTop) // Scrolling up at top
      ) {
        e.preventDefault();
      }
    };

    const el = sidePreviewRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (el) {
        el.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // Prevent scroll propagation for full-screen preview
  useEffect(() => {
    if (!isPreviewOpen) return;

    const handleWheel = (e) => {
      const el = fullPreviewRef.current;
      if (!el) return;

      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight;
      const atTop = el.scrollTop === 0;

      if (
        (e.deltaY > 0 && atBottom) || // Scrolling down at bottom
        (e.deltaY < 0 && atTop) // Scrolling up at top
      ) {
        e.preventDefault();
      }
    };

    const el = fullPreviewRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (el) {
        el.removeEventListener("wheel", handleWheel);
      }
    };
  }, [isPreviewOpen]);

  // Manage body overflow for full-screen modal
  useEffect(() => {
    if (isPreviewOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isPreviewOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingChapter) {
      setChapters(
        chapters.map((chap) =>
          chap.id === editingChapter.id ? formData : chap
        )
      );
    } else {
      setChapters([...chapters, formData]);
    }
    setFormData({
      id: Date.now(),
      chapter: "",
      icon: Shield,
      completed: false,
      content: {
        title: "",
        author: "",
        duration: "",
        image: "",
        description: "",
        questions: [],
      },
    });
    setEditingChapter(null);
  };

  const handleDelete = (id) => {
    setChapters(chapters.filter((chap) => chap.id !== id));
  };

  const addQuestion = () => {
    if (newQuestion.trim()) {
      setFormData({
        ...formData,
        content: {
          ...formData.content,
          questions: [...formData.content.questions, newQuestion],
        },
      });
      setNewQuestion("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900  to-black mt-13 min-h-screen relative p-5">
      <h1 className="text-4xl font-bold mb-12 text-center">
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          Course Content Editor
        </span>
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Editor Form */}
        <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-300">
                Chapter Title
              </label>
              <input
                type="text"
                className="w-full bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 text-white border border-cyan-500/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                value={formData.content.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, title: e.target.value },
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-300">
                Author
              </label>
              <input
                type="text"
                className="w-full bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 text-white border as border-cyan-500/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                value={formData.content.author}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, author: e.target.value },
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-300">
                Image URL
              </label>
              <input
                type="url"
                className="w-full bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 text-white border border-cyan-500/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                value={formData.content.image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: { ...formData.content, image: e.target.value },
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-300">
                Description
              </label>
              <textarea
                className="w-full bg-gray-900/50 backdrop-blur-sm rounded-lg p-3 text-white border border-cyan-500/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                rows="4"
                value={formData.content.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    content: {
                      ...formData.content,
                      description: e.target.value,
                    },
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-cyan-300">
                Questions
              </label>
              <div className="space-y-3">
                {formData.content.questions.map((question, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-lg p-2 text-white border border-cyan-500/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      value={question}
                      onChange={(e) => {
                        const newQuestions = [...formData.content.questions];
                        newQuestions[index] = e.target.value;
                        setFormData({
                          ...formData,
                          content: {
                            ...formData.content,
                            questions: newQuestions,
                          },
                        });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          content: {
                            ...formData.content,
                            questions: formData.content.questions.filter(
                              (_, i) => i !== index
                            ),
                          },
                        })
                      }
                      className="text-red-400 hover:text-red-300 text-xl font-bold w-8 h-8 flex items-center justify-center bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-gray-900/50 backdrop-blur-sm rounded-lg p-2 text-white border border-cyan-500/20 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Add new question"
                  />
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingChapter(null);
                  setFormData({
                    id: Date.now(),
                    chapter: "",
                    icon: Shield,
                    completed: false,
                    content: {
                      title: "",
                      author: "",
                      duration: "",
                      image: "",
                      description: "",
                      questions: [],
                    },
                  });
                }}
                className="bg-gray-700/50 hover:bg-gray-600/50 px-6 py-2 rounded-lg transition-all border border-gray-500/30 hover:border-gray-400/30"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
              >
                {editingChapter ? "Update Chapter" : "Add Chapter"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div className="bg-gradient-to-br from-gray-800/50 via-gray-800/30 to-gray-900/50 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-6 text-cyan-300">
              Live Preview
            </h2>
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="
    relative inline-flex items-center justify-center
    bg-cyan-400/10 backdrop-blur-lg
    border border-white/20
    text-white p-3 rounded-2xl
    shadow-[0_4px_30px_rgba(0,0,0,0.1)]
    transition transform duration-300 ease-in-out
    hover:scale-105 hover:bg-cyan-300/20 hover:border-white/30 hover:shadow-[0_6px_40px_rgba(0,0,0,0.15)]
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/40
    overflow-hidden
  "
            >
              <Maximize2 className="w-5 h-5  text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="sr-only">Open Preview</span>
              <span
                className="
      absolute inset-0 bg-white/20 opacity-0
      transition-opacity duration-500 ease-out
      hover:opacity-10
    "
              />
            </button>
          </div>
          <div
            ref={sidePreviewRef}
            className="mt-4 max-h-[80vh] overflow-y-auto"
          >
            <Content chapters={[formData]} isPreview />
          </div>
        </div>
      </div>

      {/* Full-Screen Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-xl z-50 p-8">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded-lg transition-colors group"
          >
            <X className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          </button>
          <div ref={fullPreviewRef} className="h-full overflow-y-auto">
            <Content chapters={[formData]} isPreview />
          </div>
        </div>
      )}

      {/* Existing Chapters List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-cyan-300">
          Existing Chapters
        </h2>
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl p-6 rounded-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(0,0,0,0.3)] transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h3 className="text-lg font-medium text-white">
                  {chapter.content.title}
                </h3>
                <p className="text-cyan-400/80 text-sm">
                  {chapter.content.author}
                </p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setEditingChapter(chapter)}
                  className="flex-1 sm:flex-none bg-blue-500/80 hover:bg-blue-600/80 px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)] hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(chapter.id)}
                  className="flex-1 sm:flex-none bg-red-500/80 hover:bg-red-600/80 px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
