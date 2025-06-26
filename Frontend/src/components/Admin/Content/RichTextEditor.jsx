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
  Trash2,
} from "lucide-react";
import "./RichTextEditor.css";

// Define backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const BACKEND_URL_W =
  import.meta.env.VITE_BACKEND_URL_W || "http://localhost:3000";

const RichTextEditor = ({
  value = "",
  onChange = () => {},
  placeholder = "Start typing your content...",
  onFocusedSection = () => {},
  leftFocusedSection = () => {},
  currentImageUrls,
  setCurrentImageUrls,
  allImageUrls,
  setAllImageUrls,
}) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
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

  const [selectedElement, setSelectedElement] = useState(null);

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const contentRef = useRef(null);

  // Initialize editor content and set initial image URLs
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value;
      const images = editorRef.current.querySelectorAll("img.rte-image");
      const initialImageUrls = Array.from(images).map((img) => img.src);
      setCurrentImageUrls(initialImageUrls);
      setAllImageUrls((prev) => [...new Set([...prev, ...initialImageUrls])]);
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

  // Handle content changes and update currentImageUrls
  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
      // Update currentImageUrls based on images actually present in editor
      const images = editorRef.current.querySelectorAll("img.rte-image");
      const currentUrls = Array.from(images).map((img) => img.src);
      setCurrentImageUrls(currentUrls);
    }
  }, [onChange]);

  // Delete image function
  const deleteImage = useCallback(
    (imageElement) => {
      const imageContainer = imageElement.closest(".rte-image-container");
      if (imageContainer) {
        const imgSrc = imageElement.src;
        // Remove from currentImageUrls
        setCurrentImageUrls((prev) => prev.filter((url) => url !== imgSrc));

        // Remove the image container from DOM
        imageContainer.remove();

        // Update content
        handleContentChange();
        saveToHistory(editorRef.current.innerHTML);

        // Focus back to editor
        editorRef.current.focus();
      }
    },
    [handleContentChange, saveToHistory]
  );

  // Handle click on images to select them
  const handleImageClick = useCallback((e) => {
    if (e.target.classList.contains("rte-image")) {
      e.preventDefault();
      setSelectedElement(e.target);

      // Remove any existing selections
      const selection = window.getSelection();
      selection.removeAllRanges();

      // Add visual selection to the image container
      document.querySelectorAll(".rte-image-container").forEach((container) => {
        container.classList.remove("selected");
      });

      const container = e.target.closest(".rte-image-container");
      if (container) {
        container.classList.add("selected");
      }
    }
  }, []);

  // Get current block element for alignment
  const getCurrentBlockElement = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return null;

    let node = selection.getRangeAt(0).startContainer;

    // If it's a text node, get its parent
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    // Traverse up to find a block-level element or formatting element
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName?.toLowerCase();
        // Check for block elements or our custom formatting elements
        if (
          tagName === "div" ||
          tagName === "p" ||
          tagName === "h1" ||
          tagName === "h2" ||
          tagName === "h3" ||
          tagName === "h4" ||
          tagName === "h5" ||
          tagName === "h6" ||
          node.classList?.contains("rte-bullet-line") ||
          node.classList?.contains("rte-numbered-line") ||
          node.classList?.contains("rte-text")
        ) {
          return node;
        }
      }
      node = node.parentNode;
    }

    // If no suitable parent found, create a wrapper div for the selection
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const wrapper = document.createElement("div");
        wrapper.className = "rte-text";
        try {
          range.surroundContents(wrapper);
          return wrapper;
        } catch (e) {
          // If surroundContents fails, extract and wrap the content
          const contents = range.extractContents();
          wrapper.appendChild(contents);
          range.insertNode(wrapper);
          return wrapper;
        }
      }
    }

    return null;
  };

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
          node.classList?.contains("rte-bullet-line") ||
          node.classList?.contains("rte-numbered-line") ||
          node.classList?.contains("rte-text"))
      ) {
        return node;
      }
      node = node.parentNode;
    }
    return null;
  };

  // Create bullet line
  const createBulletLine = (text = "") => {
    const div = document.createElement("div");
    div.className = "rte-bullet-line";
    div.innerHTML = `
      <span class="rte-bullet-marker">•</span>
      <span class="rte-bullet-content" contenteditable="true">${text}</span>
    `;
    return div;
  };

  // Create numbered line
  const createNumberedLine = (number, text = "") => {
    const div = document.createElement("div");
    div.className = "rte-numbered-line";
    div.innerHTML = `
      <span class="rte-number-marker">${number}.</span>
      <span class="rte-bullet-content" contenteditable="true">${text}</span>
    `;
    return div;
  };

  // Create normal text element
  const createNormalTextElement = (text = "") => {
    const div = document.createElement("div");
    div.className = "rte-text";
    div.contentEditable = true;
    if (text) {
      div.textContent = text;
    } else {
      div.innerHTML = "<br>";
    }
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

      const firstContent = bulletContainer.querySelector(".rte-bullet-content");
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

      const content = bulletLine.querySelector(".rte-bullet-content");
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

      const firstContent = numberContainer.querySelector(".rte-bullet-content");
      if (firstContent) {
        const newRange = document.createRange();
        newRange.selectNodeContents(firstContent);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      const nextNumber =
        editorRef.current.querySelectorAll(".rte-numbered-line").length + 1;
      const numberedLine = createNumberedLine(nextNumber);
      range.insertNode(numberedLine);

      const content = numberedLine.querySelector(".rte-bullet-content");
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
    const numberedLines =
      editorRef.current.querySelectorAll(".rte-numbered-line");
    numberedLines.forEach((line, index) => {
      const marker = line.querySelector(".rte-number-marker");
      if (marker) {
        marker.textContent = `${index + 1}.`;
      }
    });
  };

  // Apply alignment to block element
  const applyAlignment = (element, alignment) => {
    if (!element) return;

    // Remove existing alignment classes
    element.classList.remove(
      "rte-align-left",
      "rte-align-center",
      "rte-align-right"
    );

    // Add new alignment class
    if (alignment !== "left") {
      // left is default, no class needed
      element.classList.add(`rte-align-${alignment}`);
    }
  };

  // Apply formatting to selected text with improved multi-element support
  const applyFormatting = (className, removeExisting = false) => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) return;

    // Check if we're dealing with multiple elements
    const commonAncestor = range.commonAncestorContainer;
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;

    // If selection spans multiple elements
    if (startContainer !== endContainer) {
      // Handle multi-element selection
      const walker = document.createTreeWalker(
        commonAncestor,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function (node) {
            const nodeRange = document.createRange();
            nodeRange.selectNodeContents(node);
            return range.intersectsNode(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_REJECT;
          },
        }
      );

      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        if (range.intersectsNode(node)) {
          textNodes.push(node);
        }
      }

      // Apply formatting to each text node
      textNodes.forEach((textNode) => {
        const parent = textNode.parentNode;
        if (parent && parent !== editorRef.current) {
          const span = document.createElement("span");
          span.className = className;
          span.textContent = textNode.textContent;
          parent.replaceChild(span, textNode);
        }
      });
    } else {
      // Single element selection
      const span = document.createElement("span");
      span.className = className;
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    }

    // Clear selection
    selection.removeAllRanges();

    // Position cursor after the formatted text
    const newRange = document.createRange();
    newRange.selectNodeContents(editorRef.current);
    newRange.collapse(false);
    selection.addRange(newRange);
  };

  // Italic custom function
  const executeItalic = () => {
    applyFormatting("rte-italic");
    const html = editorRef.current.innerHTML;
    onChange(html);
    saveToHistory(html);
  };

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
        const images = editorRef.current.querySelectorAll("img.rte-image");
        const currentUrls = Array.from(images).map((img) => img.src);
        setCurrentImageUrls(currentUrls);
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
        const images = editorRef.current.querySelectorAll("img.rte-image");
        const currentUrls = Array.from(images).map((img) => img.src);
        setCurrentImageUrls(currentUrls);
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.focus();
          }
        }, 0);
      }
    }
  }, [historyIndex, history, onChange]);

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
        const colorClass = getColorClass(value);
        applyFormatting(colorClass);
      } else if (command === "fontSize" && value) {
        const sizeClass = getFontSizeClass(value);
        applyFormatting(sizeClass);
      } else if (command === "bold") {
        applyFormatting("rte-bold");
      } else if (command === "underline") {
        applyFormatting("rte-underline");
      } else if (command === "justifyLeft") {
        const blockElement = getCurrentBlockElement();
        if (blockElement) {
          applyAlignment(blockElement, "left");
        }
      } else if (command === "justifyCenter") {
        const blockElement = getCurrentBlockElement();
        if (blockElement) {
          applyAlignment(blockElement, "center");
        }
      } else if (command === "justifyRight") {
        const blockElement = getCurrentBlockElement();
        if (blockElement) {
          applyAlignment(blockElement, "right");
        }
      }

      setTimeout(() => {
        if (editorRef.current) {
          const content = editorRef.current.innerHTML;
          onChange(content);
          saveToHistory(content);
        }
      }, 0);
    },
    [
      onChange,
      saveToHistory,
      handleBulletList,
      handleNumberedList,
      executeItalic,
    ]
  );

  // Handle key events for bullets and image deletion
  const handleKeyDown = useCallback(
    (e) => {
      // Handle image deletion with Delete or Backspace
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selectedElement &&
        selectedElement.classList.contains("rte-image")
      ) {
        e.preventDefault();
        deleteImage(selectedElement);
        setSelectedElement(null);
        return;
      }

      if (e.key === "Enter") {
        const currentLine = getCurrentLine();

        if (
          currentLine &&
          (currentLine.classList.contains("rte-bullet-line") ||
            currentLine.classList.contains("rte-numbered-line"))
        ) {
          e.preventDefault();

          const content = currentLine.querySelector(".rte-bullet-content");
          const isEmpty = !content || content.textContent.trim() === "";

          if (isEmpty) {
            // Exit bullet/numbered mode and create normal text element
            const normalDiv = createNormalTextElement();
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
            if (currentLine.classList.contains("rte-bullet-line")) {
              newLine = createBulletLine();
            } else {
              const nextNumber =
                editorRef.current.querySelectorAll(".rte-numbered-line")
                  .length + 1;
              newLine = createNumberedLine(nextNumber);
            }

            currentLine.parentNode.insertBefore(
              newLine,
              currentLine.nextSibling
            );

            const newContent = newLine.querySelector(".rte-bullet-content");
            if (newContent) {
              const range = document.createRange();
              const selection = window.getSelection();
              range.selectNodeContents(newContent);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }

            if (currentLine.classList.contains("rte-numbered-line")) {
              setTimeout(renumberLists, 0);
            }
          }

          handleContentChange();
          return;
        } else {
          // For normal text, ensure we create proper text elements
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const currentNode = range.startContainer;

            // Check if we're in the main editor without proper structure
            if (
              currentNode === editorRef.current ||
              (currentNode.nodeType === Node.TEXT_NODE &&
                currentNode.parentNode === editorRef.current)
            ) {
              e.preventDefault();

              const textElement = createNormalTextElement();
              range.insertNode(textElement);

              const newRange = document.createRange();
              newRange.selectNodeContents(textElement);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);

              handleContentChange();
              return;
            }
          }
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
    },
    [
      handleRedo,
      handleUndo,
      executeCommand,
      handleContentChange,
      selectedElement,
      deleteImage,
    ]
  );

  // Attach event listeners
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener("keydown", handleKeyDown);
      editor.addEventListener("click", handleImageClick);

      return () => {
        editor.removeEventListener("keydown", handleKeyDown);
        editor.removeEventListener("click", handleImageClick);
        clearTimeout(window.historyTimeout);
      };
    }
  }, [handleKeyDown, handleImageClick]);

  // Clear selection when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".rte-image-container")) {
        setSelectedElement(null);
        document
          .querySelectorAll(".rte-image-container.selected")
          .forEach((container) => {
            container.classList.remove("selected");
          });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Get color class for text
  const getColorClass = (color) => {
    const colorMap = {
      "#ffffff": "rte-color-white",
      "#22d3ee": "rte-color-cyan",
      "#3b82f6": "rte-color-blue",
      "#10b981": "rte-color-emerald",
      "#f97316": "rte-color-orange",
      "#ef4444": "rte-color-red",
      "#8b5cf6": "rte-color-violet",
      "#f59e0b": "rte-color-amber",
    };
    return colorMap[color] || "rte-color-default";
  };

  // Get font size class
  const getFontSizeClass = (size) => {
    const sizeMap = {
      1: "rte-size-xs",
      2: "rte-size-sm",
      3: "rte-size-base",
      4: "rte-size-lg",
      5: "rte-size-xl",
      6: "rte-size-2xl",
    };
    return sizeMap[size] || "rte-size-base";
  };

  // File upload function
  const uploadFile = async (file, type, uploadApiUrl) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    setIsUploading(true);
    setUploadType(type);
    setUploadProgress(0);

    let progressInterval;
    try {
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? prev : prev + 10));
      }, 200);

      const res = await fetch(uploadApiUrl, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed (${res.status}): ${text}`);
      }

      const json = await res.json();
      return json;
    } catch (err) {
      console.error("uploadFile error:", err);
      return { success: false, error: err.message };
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
    textDiv.className = "rte-text";
    textDiv.innerHTML = "<br>";
    textDiv.contentEditable = true;
    return textDiv;
  };

  // Handle image upload with improved cursor positioning
  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    const cursorPos = saveCursorPosition();

    const response = await uploadFile(
      file,
      "image",
      `${BACKEND_URL}/lesson/createImage`
    );
    if (!response?.success || !response?.imagePath) return;

    const normalizedPath = response.imagePath.replace(/\\/g, "/");
    const imagePath = `${BACKEND_URL_W}/${normalizedPath}`;

    setAllImageUrls((prev) => [...new Set([...prev, imagePath])]);
    setCurrentImageUrls((prev) => [...new Set([...prev, imagePath])]);

    const imageContainer = document.createElement("div");
    const safeSrc = encodeURI(imagePath);

    imageContainer.className = "rte-image-container";
    imageContainer.innerHTML = `
      <div class="rte-image-wrapper">
        <img
          src="${safeSrc}"
          alt="Uploaded image"
          class="rte-image"
        />
        <button class="rte-image-delete" onclick="event.stopPropagation();">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-2 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;

    // Add delete functionality to the button
    const deleteBtn = imageContainer.querySelector(".rte-image-delete");
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      deleteImage(imageContainer.querySelector(".rte-image"));
    });

    const textElement = createTextElement();

    if (cursorPos && editorRef.current.contains(cursorPos.startContainer)) {
      try {
        restoreCursorPosition(cursorPos);
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        range.insertNode(imageContainer);
        range.collapse(false);
        range.insertNode(textElement);

        // Position cursor at the start of the text element
        const textRange = document.createRange();
        textRange.selectNodeContents(textElement);
        textRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(textRange);
      } catch (e) {
        editorRef.current.appendChild(imageContainer);
        editorRef.current.appendChild(textElement);

        // Focus on the text element
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

      // Focus on the text element
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
    const response = await uploadFile(
      file,
      "video",
      `${BACKEND_URL}/lesson/createVideo`
    );
    if (!response?.success || !response?.imagePath) return;

    const normalizedPath = response.imagePath.replace(/\\/g, "/");
    const videoPath = `${BACKEND_URL_W}/${normalizedPath}`;
    const videoId = `video_${Date.now()}`;

    const videoContainer = document.createElement("div");
    videoContainer.className = "rte-video-container";
    videoContainer.setAttribute("data-video-id", videoId);

    videoContainer.innerHTML = `
      <div class="rte-video-wrapper">
        <video 
          controls 
          class="rte-video"
          preload="metadata"
        >
          <source src="${videoPath}" type="${file.type}">
          Your browser does not support the video tag.
        </video>
        <button class="rte-video-delete" onclick="event.stopPropagation();">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-2 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;

    // Add delete functionality to the button
    const deleteBtn = videoContainer.querySelector(".rte-video-delete");
    deleteBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      videoContainer.remove();
      handleContentChange();
      saveToHistory(editorRef.current.innerHTML);
      editorRef.current.focus();
    });

    const textElement = createTextElement();

    if (cursorPos && editorRef.current.contains(cursorPos.startContainer)) {
      try {
        restoreCursorPosition(cursorPos);
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        range.insertNode(videoContainer);
        range.collapse(false);
        range.insertNode(textElement);

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

  // Insert link
  const insertLink = () => {
    if (linkUrl && linkText) {
      executeCommand(
        "insertHTML",
        `<a href="${linkUrl}" class="rte-link" target="_blank">${linkText}</a>`
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
        className="rte-editor-container bg-gray-900/50 border border-cyan-500/30 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl"
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

        <div className="bg-gray-800/80 p-3 border-b border-cyan-500/20 flex flex-wrap gap-2 z-10 flex-shrink-0">
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
          className="rte-content-area"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-6 min-h-[60vh] max-h-[60vh] overflow-y-auto ">
            {" "}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleInput}
              className={`text-gray-300 leading-relaxed focus:outline-none relative min-h-full ${
                dragOver ? "rte-editor-drag-over" : ""
              }`}
              style={{
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
              data-placeholder={placeholder}
              suppressContentEditableWarning={true}
            />
          </div>
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
    </div>
  );
};

export default RichTextEditor;
