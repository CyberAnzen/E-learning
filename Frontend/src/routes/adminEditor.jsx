import { useState, useEffect, useRef } from "react";
import { Maximize2, Shield, X } from "lucide-react";
import Content from "./content";

// Initial placeholder data
const placeholderData = {
  id: 1,
  chapter: "Sample Chapter",
  icon: null,
  completed: false,
  content: {
    title: "Introduction to Course Creation",
    author: "Course Admin",
    duration: "30 minutes",
    image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg",
    description: "Start creating your course content here.",
  },
  tasks: [
    {
      id: "task-1",
      title: "Getting Started",
      completed: false,
      content: {
        description: "Begin your course creation journey",
        objectives: [
          "Create course structure",
          "Add content",
          "Set up assessments",
        ],
        mainContent:
          "Welcome to the course creation system. This is a placeholder content that will be replaced as you add your own material.",
        questions: [
          {
            id: "q1",
            text: "Sample question 1?",
            type: "text",
            hint: "This is a placeholder question",
          },
        ],
      },
    },
  ],
};

const AdminEditor = () => {
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  const [chapters, setChapters] = useState([placeholderData]);
  const [editingChapter, setEditingChapter] = useState(null);
  const [formData, setFormData] = useState(placeholderData);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const sidePreviewRef = useRef(null);
  const fullPreviewRef = useRef(null);

  useEffect(() => {
    if (editingChapter) {
      setFormData(editingChapter);
    }
  }, [editingChapter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      tasks: [
        {
          id: `task-${Date.now()}`,
          title: formData.content.title,
          completed: false,
          content: {
            description: formData.content.description,
            objectives: [],
            mainContent: formData.content.description,
            questions: formData.content.questions.map((q, idx) => ({
              id: `q${idx + 1}`,
              text: q,
              type: "text",
              hint: "Enter your answer",
            })),
          },
        },
      ],
    };

    if (editingChapter) {
      setChapters(
        chapters.map((chap) =>
          chap.id === editingChapter.id ? updatedFormData : chap
        )
      );
    } else {
      setChapters([...chapters, updatedFormData]);
    }

    setFormData(placeholderData);
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
          questions: [...(formData.content.questions || []), newQuestion],
        },
      });
      setNewQuestion("");
    }
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen p-5 mt-23">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Editor Form */}
        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Chapter Title</label>
              <input
                type="text"
                className="w-full bg-gray-900/50 rounded p-2 text-white border border-gray-700"
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
              <label className="block text-white mb-2">Author</label>
              <input
                type="text"
                className="w-full bg-gray-900/50 rounded p-2 text-white border border-gray-700"
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
              <label className="block text-white mb-2">Description</label>
              <textarea
                className="w-full bg-gray-900/50 rounded p-2 text-white border border-gray-700"
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
                rows="4"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Image URL</label>
              <input
                type="url"
                className="w-full bg-gray-900/50 rounded p-2 text-white border border-gray-700"
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
              <label className="block text-white mb-2">Questions</label>
              <div className="space-y-2">
                {formData.content.questions?.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-gray-900/50 rounded p-2 text-white border border-gray-700"
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
                      onClick={() => {
                        const newQuestions = formData.content.questions.filter(
                          (_, i) => i !== index
                        );
                        setFormData({
                          ...formData,
                          content: {
                            ...formData.content,
                            questions: newQuestions,
                          },
                        });
                      }}
                      className="px-3 py-1 bg-red-500/50 rounded hover:bg-red-600/50"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-gray-900/50 rounded p-2 text-white border border-gray-700"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Add new question"
                  />
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="px-4 py-2 bg-blue-500/50 rounded hover:bg-blue-600/50"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-green-500/50 rounded hover:bg-green-600/50"
              >
                {editingChapter ? "Update Chapter" : "Add Chapter"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div className="bg-gray-800/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-white">Live Preview</h2>
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="p-2 bg-gray-700/50 rounded hover:bg-gray-600/50"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
          <div
            ref={sidePreviewRef}
            className="max-h-[80vh] max-w-[40vw] overflow-y-auto"
          >
            <Content
              selectedChapterId={selectedChapterId}
              isPreview={true}
              PreviewData={placeholderData}
              PreviewScreen={true}
            />
          </div>
        </div>
      </div>

      {/* Full Screen Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 p-8">
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-700/50 rounded"
          >
            <X className="w-6 h-6" />
          </button>
          <div ref={fullPreviewRef} className="h-full overflow-y-auto">
            <Content
              selectedChapterId={selectedChapterId}
              isPreview={true}
              PreviewData={placeholderData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEditor;
