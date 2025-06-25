import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image,
  Video,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Upload,
  X,
  Loader,
} from "lucide-react";

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing your content...",
  uploadApiUrl = "/lesson/create/media",
  onFocusedSection,
  leftFocusedSection,
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isBulletMode, setIsBulletMode] = useState(false);
  const [isNumberMode, setIsNumberMode] = useState(false);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const contentRef = useRef(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value;
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  }, []);

  // Restore cursor position
  const restoreCursorPosition = useCallback((range) => {
    if (range && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        try {
          selection.addRange(range);
        } catch (e) {
          const newRange = document.createRange();
          newRange.selectNodeContents(editorRef.current);
          newRange.collapse(false);
          selection.addRange(newRange);
        }
      }
    }
  }, []);

  // Save state to history for undo functionality
  const saveToHistory = useCallback(
    (content) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  // Get current line element
  const getCurrentLine = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;

    let node = selection.getRangeAt(0).startContainer;
    while (node && node !== editorRef.current) {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        (node.tagName === "DIV" ||
          node.tagName === "P" ||
          node.classList?.contains("bullet-line"))
      ) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };

  // Check if current line is a bullet
  const isCurrentLineBullet = () => {
    const line = getCurrentLine();
    return line && line.classList?.contains("bullet-line");
  };

  // Check if current line is numbered
  const isCurrentLineNumbered = () => {
    const line = getCurrentLine();
    return line && line.classList?.contains("numbered-line");
  };

  // Get next number for numbered list
  const getNextNumber = () => {
    const lines = editorRef.current.querySelectorAll(".numbered-line");
    return lines.length + 1;
  };

  // Create bullet line (with increased size)
  const createBulletLine = (text = "") => {
    const div = document.createElement("div");
    div.className = "bullet-line flex items-start my-3 text-gray-300";
    div.innerHTML = `
      <span class="bullet-marker text-cyan-400 font-bold mr-3 mt-0.5 select-none text-2xl">•</span>
      <span class="bullet-content flex-1 outline-none text-xl" contenteditable="true">${text}</span>
    `;
    return div;
  };

  // Create numbered line (with increased size)
  const createNumberedLine = (number, text = "") => {
    const div = document.createElement("div");
    div.className = "numbered-line flex items-start my-3 text-gray-300";
    div.innerHTML = `
      <span class="number-marker text-cyan-400 font-bold mr-3 mt-0.5 select-none min-w-[24px] text-xl">${number}.</span>
      <span class="bullet-content flex-1 outline-none text-xl" contenteditable="true">${text}</span>
    `;
    return div;
  };

  // Handle bullet list
  const handleBulletList = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const lines = selectedText.split("\n").filter((line) => line.trim());
      const bulletContainer = document.createElement("div");

      lines.forEach((line) => {
        const bulletLine = createBulletLine(line.trim());
        bulletContainer.appendChild(bulletLine);
      });

      range.deleteContents();
      range.insertNode(bulletContainer);

      const firstContent = bulletContainer.querySelector(".bullet-content");
      if (firstContent) {
        const newRange = document.createRange();
        newRange.selectNodeContents(firstContent);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      const bulletLine = createBulletLine();
      range.insertNode(bulletLine);

      const content = bulletLine.querySelector(".bullet-content");
      if (content) {
        const newRange = document.createRange();
        newRange.selectNodeContents(content);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }

    setIsBulletMode(true);
    handleContentChange();
  };

  // Handle numbered list
  const handleNumberedList = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const lines = selectedText.split("\n").filter((line) => line.trim());
      const numberContainer = document.createElement("div");

      lines.forEach((line, index) => {
        const numberedLine = createNumberedLine(index + 1, line.trim());
        numberContainer.appendChild(numberedLine);
      });

      range.deleteContents();
      range.insertNode(numberContainer);

      const firstContent = numberContainer.querySelector(".bullet-content");
      if (firstContent) {
        const newRange = document.createRange();
        newRange.selectNodeContents(firstContent);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      const nextNumber = getNextNumber();
      const numberedLine = createNumberedLine(nextNumber);
      range.insertNode(numberedLine);

      const content = numberedLine.querySelector(".bullet-content");
      if (content) {
        const newRange = document.createRange();
        newRange.selectNodeContents(content);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }

    setIsNumberMode(true);
    handleContentChange();
  };

  // Renumber all numbered lists
  const renumberLists = () => {
    const numberedLines = editorRef.current.querySelectorAll(".numbered-line");
    numberedLines.forEach((line, index) => {
      const marker = line.querySelector(".number-marker");
      if (marker) {
        marker.textContent = `${index + 1}.`;
      }
    });
  };

  // Italic custom Function
  const executeItalic = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed) {
      console.warn("No text selected for italic formatting");
      return;
    }

    const range = sel.getRangeAt(0);
    const txt = range.toString();
    if (!txt) {
      console.warn("Empty selection for italic formatting");
      return;
    }

    const p = document.createElement("span");
    p.setAttribute("class", "italic");
    p.textContent = txt;

    range.deleteContents();
    range.insertNode(p);
    sel.removeAllRanges();

    const newRange = document.createRange();
    newRange.setStartAfter(p);
    newRange.collapse(true);
    sel.addRange(newRange);

    const html = editorRef.current.innerHTML;
    onChange(html);
    saveToHistory(html);
  };

  // Handle key events for bullets
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      const currentLine = getCurrentLine();

      if (
        currentLine &&
        (currentLine.classList.contains("bullet-line") ||
          currentLine.classList.contains("numbered-line"))
      ) {
        e.preventDefault();

        const content = currentLine.querySelector(".bullet-content");
        const isEmpty = !content || content.textContent.trim() === "";

        if (isEmpty) {
          const normalDiv = document.createElement("div");
          normalDiv.className = "my-2 text-gray-300 text-lg";
          normalDiv.innerHTML = "<br>";
          currentLine.parentNode.insertBefore(
            normalDiv,
            currentLine.nextSibling
          );
          currentLine.remove();

          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(normalDiv);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);

          setIsBulletMode(false);
          setIsNumberMode(false);
        } else {
          let newLine;
          if (currentLine.classList.contains("bullet-line")) {
            newLine = createBulletLine();
          } else {
            const nextNumber = getNextNumber();
            newLine = createNumberedLine(nextNumber);
          }

          currentLine.parentNode.insertBefore(newLine, currentLine.nextSibling);

          const newContent = newLine.querySelector(".bullet-content");
          if (newContent) {
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(newContent);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }

          if (currentLine.classList.contains("numbered-line")) {
            setTimeout(renumberLists, 0);
          }
        }

        handleContentChange();
        return;
      }
    }

    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "z":
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case "y":
          e.preventDefault();
          handleRedo();
          break;
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeItalic();
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
      }
    }
  }, []);

  // Handle input with debounced history saving
  const handleInput = useCallback(() => {
    handleContentChange();

    clearTimeout(window.historyTimeout);
    window.historyTimeout = setTimeout(() => {
      if (editorRef.current) {
        saveToHistory(editorRef.current.innerHTML);
      }
    }, 500);
  }, [handleContentChange, saveToHistory]);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const content = history[newIndex];
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        }, 0);
      }
    }
  }, [historyIndex, history, onChange]);

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const content = history[newIndex];
      if (editorRef.current) {
        editorRef.current.innerHTML = content;
        onChange(content);
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        }, 0);
      }
    }
  }, [historyIndex, history, onChange]);

  // Attach event listeners
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("keydown", handleKeyDown);
      return () => {
        editor.removeEventListener("keydown", handleKeyDown);
        clearTimeout(window.historyTimeout);
      };
    }
  }, [handleKeyDown]);

  // Execute formatting commands
  const executeCommand = useCallback(
    (command, value = null) => {
      editorRef.current?.focus();

      if (command === "insertUnorderedList") {
        handleBulletList();
        return;
      }

      if (command === "insertOrderedList") {
        handleNumberedList();
        return;
      }

      if (command === "executeItalic") {
        executeItalic();
        return;
      }

      if (command === "foreColor" && value) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
          const range = selection.getRangeAt(0);
          const selectedText = range.toString();
          const colorClass = getColorClass(value);
          const span = document.createElement("span");
          span.className = colorClass;
          span.textContent = selectedText;
          range.deleteContents();
          range.insertNode(span);
          selection.removeAllRanges();
        }
      } else if (command === "fontSize" && value) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
          const range = selection.getRangeAt(0);
          const selectedText = range.toString();
          const sizeClass = getFontSizeClass(value);
          const span = document.createElement("span");
          span.className = sizeClass;
          span.textContent = selectedText;
          range.deleteContents();
          range.insertNode(span);
          selection.removeAllRanges();
        }
      } else {
        document.execCommand(command, false, value);
      }

      setTimeout(() => {
        if (editorRef.current) {
          const content = editorRef.current.innerHTML;
          onChange(content);
          saveToHistory(content);
        }
      }, 0);
    },
    [onChange, saveToHistory]
  );

  // Get color class for text
  const getColorClass = (color) => {
    const colorMap = {
      "#ffffff": "text-white",
      "#22d3ee": "text-cyan-400",
      "#3b82f6": "text-blue-500",
      "#10b981": "text-emerald-500",
      "#f97316": "text-orange-500",
      "#ef4444": "text-red-500",
      "#8b5cf6": "text-violet-500",
      "#f59e0b": "text-amber-500",
    };
    return colorMap[color] || "text-gray-300";
  };

  // Get font size class
  const getFontSizeClass = (size) => {
    const sizeMap = {
      1: "text-xs",
      2: "text-sm",
      3: "text-base",
      4: "text-lg",
      5: "text-xl",
      6: "text-2xl",
    };
    return sizeMap[size] || "text-base";
  };

  // File upload function
  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    setIsUploading(true);
    setUploadType(type);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(uploadApiUrl, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      if (result.success && result.path) {
        return result.path;
      } else {
        throw new Error("Upload failed: No path returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      return URL.createObjectURL(file);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadType("");
      }, 1000);
    }
  };

  // Create a text element after media insertion
  const createTextElement = () => {
    const textDiv = document.createElement("div");
    textDiv.className =
      "my-3 text-gray-300 text-lg min-h-[1.5rem] leading-relaxed";
    textDiv.innerHTML = "<br>";
    textDiv.contentEditable = true;
    return textDiv;
  };

  // Handle image upload with class names
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const cursorPos = saveCursorPosition();
    const imagePath = await uploadFile(file, "image");
    const imageId = `img_${Date.now()}`;

    const imageContainer = document.createElement("div");
    imageContainer.className = "w-full flex justify-center my-6";
    imageContainer.setAttribute("data-image-id", imageId);

    imageContainer.innerHTML = `
      <div class="media-container">
        <img 
          src="${imagePath}" 
          alt="Uploaded image" 
          class="media-element image"
          onclick="window.previewImage && window.previewImage('${imagePath}')"
        />
      </div>
    `;

    const textElement = createTextElement();

    if (cursorPos && editorRef.current.contains(cursorPos.startContainer)) {
      try {
        restoreCursorPosition(cursorPos);
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        range.insertNode(textElement);
        range.insertNode(imageContainer);

        const textRange = document.createRange();
        textRange.selectNodeContents(textElement);
        textRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(textRange);
      } catch (e) {
        editorRef.current.appendChild(imageContainer);
        editorRef.current.appendChild(textElement);

        const textRange = document.createRange();
        textRange.selectNodeContents(textElement);
        textRange.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(textRange);
      }
    } else {
      editorRef.current.appendChild(imageContainer);
      editorRef.current.appendChild(textElement);

      const textRange = document.createRange();
      textRange.selectNodeContents(textElement);
      textRange.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(textRange);
    }

    handleContentChange();
    saveToHistory(editorRef.current.innerHTML);
  };

  // Handle video upload with class names
  const handleVideoUpload = async (file) => {
    if (!file || !file.type.startsWith("video/")) return;

    const cursorPos = saveCursorPosition();
    const videoPath = await uploadFile(file, "video");
    const videoId = `video_${Date.now()}`;

    const videoContainer = document.createElement("div");
    videoContainer.className = "w-full flex justify-center my-6";
    videoContainer.setAttribute("data-video-id", videoId);

    videoContainer.innerHTML = `
      <div class="media-container">
        <video 
          controls 
          class="media-element video"
          preload="metadata"
        >
          <source src="${videoPath}" type="${file.type}">
          Your browser does not support the video tag.
        </video>
      </div>
    `;

    const textElement = createTextElement();

    if (cursorPos && editorRef.current.contains(cursorPos.startContainer)) {
      try {
        restoreCursorPosition(cursorPos);
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        range.insertNode(textElement);
        range.insertNode(videoContainer);

        const textRange = document.createRange();
        textRange.selectNodeContents(textElement);
        textRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(textRange);
      } catch (e) {
        editorRef.current.appendChild(videoContainer);
        editorRef.current.appendChild(textElement);

        const textRange = document.createRange();
        textRange.selectNodeContents(textElement);
        textRange.collapse(true);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(textRange);
      }
    } else {
      editorRef.current.appendChild(videoContainer);
      editorRef.current.appendChild(textElement);

      const textRange = document.createRange();
      textRange.selectNodeContents(textElement);
      textRange.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(textRange);
    }

    handleContentChange();
    saveToHistory(editorRef.current.innerHTML);
  };

  // Global functions for image preview
  useEffect(() => {
    window.previewImage = (src) => {
      setPreviewImageSrc(src);
      setShowImagePreview(true);
    };

    return () => {
      delete window.previewImage;
    };
  }, []);

  // Insert link
  const insertLink = () => {
    if (linkUrl && linkText) {
      executeCommand(
        "insertHTML",
        `<a href="${linkUrl}" class="text-cyan-400 hover:text-cyan-300 underline transition-colors font-medium" target="_blank">${linkText}</a>`
      );
      setLinkUrl("");
      setLinkText("");
      setShowLinkModal(false);
    }
  };

  // Drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        handleImageUpload(file);
      } else if (file.type.startsWith("video/")) {
        handleVideoUpload(file);
      }
    });
  };

  const toolbarButtons = [
    { icon: Bold, command: "bold", title: "Bold (Ctrl+B)" },
    // { icon: Italic, command: "executeItalic", title: "Italic (Ctrl+I)" },
    { icon: Underline, command: "underline", title: "Underline (Ctrl+U)" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { icon: AlignLeft, command: "justifyLeft", title: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", title: "Align Center" },
    { icon: AlignRight, command: "justifyRight", title: "Align Right" },
  ];

  return (
    <div className="relative">
      <div
        onFocus={onFocusedSection}
        onBlur={leftFocusedSection}
        className="bg-gray-900/50 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-sm h-[500px] flex flex-col shadow-2xl"
      >
        {isUploading && (
          <div className="bg-gray-800/90 p-3 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <Loader className="w-4 h-4 text-cyan-400 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between text-sm text-gray-300 mb-1">
                  <span>Uploading {uploadType}...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800/80 p-3 border-b border-cyan-500/20 flex flex-wrap gap-2 z-10">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-cyan-500/20 border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4 text-gray-300 group-hover:text-cyan-400" />
          </button>

          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-cyan-500/20 border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4 text-gray-300 group-hover:text-cyan-400" />
          </button>

          <div className="w-px bg-gray-600/50 mx-2" />

          {toolbarButtons.map(({ icon: Icon, command, title }) => (
            <button
              key={command}
              type="button"
              onClick={() => executeCommand(command)}
              className="p-2 rounded-lg bg-gray-700/50 hover:bg-cyan-500/20 border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200 group"
              title={title}
            >
              <Icon className="w-4 h-4 text-gray-300 group-hover:text-cyan-400" />
            </button>
          ))}

          <div className="w-px bg-gray-600/50 mx-2" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-cyan-500/20 border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200 group disabled:opacity-50"
            title="Upload Image"
          >
            <Image className="w-4 h-4 text-gray-300 group-hover:text-cyan-400" />
          </button>

          <button
            type="button"
            onClick={() => videoInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-cyan-500/20 border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200 group disabled:opacity-50"
            title="Upload Video"
          >
            <Video className="w-4 h-4 text-gray-300 group-hover:text-cyan-400" />
          </button>

          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-cyan-500/20 border border-gray-600/50 hover:border-cyan-400/50 transition-all duration-200 group"
            title="Insert Link"
          >
            <Link className="w-4 h-4 text-gray-300 group-hover:text-cyan-400" />
          </button>

          <div className="w-px bg-gray-600/50 mx-2" />

          <select
            onChange={(e) => executeCommand("fontSize", e.target.value)}
            className="px-3 py-1 bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 text-sm hover:border-cyan-400/50 focus:border-cyan-400 focus:outline-none transition-all duration-200"
            defaultValue="3"
          >
            <option value="1">Very Small</option>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
            <option value="5">Very Large</option>
            <option value="6">Huge</option>
          </select>
        </div>

        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto p-6 relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className={`text-gray-300 leading-relaxed focus:outline-none relative min-h-full ${
              dragOver
                ? "bg-cyan-500/10 border-2 border-dashed border-cyan-400 rounded-lg p-4"
                : ""
            }`}
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && handleImageUpload(e.target.files[0])
          }
          className="hidden"
        />

        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          onChange={(e) =>
            e.target.files?.[0] && handleVideoUpload(e.target.files[0])
          }
          className="hidden"
        />

        {dragOver && (
          <div className="absolute inset-0 bg-cyan-500/20 border-2 border-dashed border-cyan-400 rounded-xl flex items-center justify-center z-20">
            <div className="text-center text-cyan-400">
              <Upload className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Drop images or videos here</p>
            </div>
          </div>
        )}
      </div>

      {showLinkModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-cyan-500/30 shadow-2xl">
            <h3 className="text-xl text-white mb-4 font-semibold">
              Insert Link
            </h3>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text"
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white mb-3 focus:border-cyan-400 focus:outline-none transition-all duration-200"
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white mb-4 focus:border-cyan-400 focus:outline-none transition-all duration-200"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white transition-all duration-200"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {showImagePreview && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowImagePreview(false)}
              className="absolute -top-4 -right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImageSrc}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #6b7280;
          pointer-events: none;
        }

        [contenteditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
          color: #d1d5db;
          font-size: 1.125rem;
        }

        [contenteditable] div {
          margin: 0.5rem 0;
          line-height: 1.6;
          color: #d1d5db;
          font-size: 1.125rem;
        }

        [contenteditable] strong {
          font-weight: 700;
        }

        [contenteditable] em {
          font-style: italic;
        }

        [contenteditable] .italic {
          font-style: italic;
        }

        [contenteditable] u {
          text-decoration: underline;
        }

        .bullet-line {
          display: flex;
          align-items: flex-start;
          margin: 1rem 0;
          color: #d1d5db;
        }

        .numbered-line {
          display: flex;
          align-items: flex-start;
          margin: 1rem 0;
          color: #d1d5db;
        }

        .bullet-marker {
          color: #22d3ee;
          font-weight: bold;
          margin-right: 0.75rem;
          margin-top: 0.125rem;
          font-size: 1.5rem;
          user-select: none;
          flex-shrink: 0;
        }

        .number-marker {
          color: #22d3ee;
          font-weight: bold;
          margin-right: 0.75rem;
          margin-top: 0.125rem;
          font-size: 1.25rem;
          user-select: none;
          flex-shrink: 0;
        }

        .bullet-content {
          flex: 1;
          outline: none;
          min-height: 1.5rem;
          font-size: 1.25rem;
          line-height: 1.75rem;
        }

        .bullet-content:empty:before {
          content: " ";
          white-space: pre;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
