import { useState, useEffect } from "react";
import Content from "./content";
import { Shield } from "lucide-react";

// Initial courseData for AdminEditor
const courseData = [
  {
    id: 1,
    chapter: "Introduction to Cybersecurity",
    icon: Shield,
    completed: true,
    content: {
      title: "Understanding Cyber Threats",
      author: "Dr. Sarah Chen",
      duration: "45 minutes",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
      description:
        "Learn about the fundamental concepts of cybersecurity and common threats in today's digital landscape.",
      questions: [
        "What are the main types of cyber threats?",
        "How do you identify a potential security breach?",
      ],
    },
  },
  {
    id: 2,
    chapter: "Ethical Hacking Basics",
    icon: Shield, // Note: Original code uses Terminal, but keeping Shield as per formData default
    completed: false,
    content: {
      title: "Getting Started with Penetration Testing",
      author: "Mark Rodriguez",
      duration: "60 minutes",
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2070",
      description:
        "Explore the fundamentals of ethical hacking and learn the basics of penetration testing.",
      questions: [
        "What is the difference between black hat and white hat hacking?",
        "What are the essential tools for penetration testing?",
      ],
    },
  },
  {
    id: 3,
    chapter: "Social Engineering",
    icon: Shield, // Note: Original code uses Brain, but keeping Shield as per formData default
    completed: false,
    content: {
      title: "Psychology of Cyber Attacks",
      author: "Dr. Emily Watson",
      duration: "30 minutes",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070",
      description:
        "Understanding the psychological aspects of social engineering attacks and how to prevent them.",
      questions: [
        "What are common social engineering techniques?",
        "How can you protect against phishing attacks?",
      ],
    },
  },
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

  useEffect(() => {
    if (editingChapter) {
      setFormData(editingChapter);
    }
  }, [editingChapter]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingChapter) {
      // Update existing chapter
      setChapters(
        chapters.map((chap) =>
          chap.id === editingChapter.id ? formData : chap
        )
      );
    } else {
      // Add new chapter
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Course Content Editor
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Form */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Chapter Title
              </label>
              <input
                type="text"
                className="w-full bg-gray-700 rounded-lg p-3 text-white"
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
              <label className="block mb-2 text-sm font-medium">Author</label>
              <input
                type="text"
                className="w-full bg-gray-700 rounded-lg p-3 text-white"
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
              <label className="block mb-2 text-sm font-medium">
                Image URL
              </label>
              <input
                type="url"
                className="w-full bg-gray-700 rounded-lg p-3 text-white"
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
              <label className="block mb-2 text-sm font-medium">
                Description
              </label>
              <textarea
                className="w-full bg-gray-700 rounded-lg p-3 text-white"
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
              <label className="block mb-2 text-sm font-medium">
                Questions
              </label>
              <div className="space-y-2">
                {formData.content.questions.map((question, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 rounded-lg p-2 text-white"
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
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-gray-700 rounded-lg p-2 text-white"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Add new question"
                  />
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
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
                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg"
              >
                {editingChapter ? "Update Chapter" : "Add Chapter"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-bold mb-6">Live Preview</h2>
          <Content chapters={[formData]} isPreview />
        </div>
      </div>

      {/* Existing Chapters List */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Existing Chapters</h2>
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-gray-800 p-4 rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium">{chapter.content.title}</h3>
                <p className="text-gray-400 text-sm">
                  {chapter.content.author}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingChapter(chapter)}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(chapter.id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
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
