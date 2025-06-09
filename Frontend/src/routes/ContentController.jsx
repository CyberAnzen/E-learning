// File: src/components/ContentController.jsx

import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/sidebar/Sidebar";
import Content from "./content";
import { useParams, useNavigate } from "react-router-dom";
import { Shield, Terminal } from "lucide-react"; // Import whichever Lucide icons you want for each chapter
import "../content.css";

// ────────────────────────────────────────────────────────────────────────────
// 1) DUMMY “FULL” DATA, keyed by chapter ID. Each entry must include an
//    `icon` field (a Lucide React component) because Sidebar does <item.icon ...>.
// ────────────────────────────────────────────────────────────────────────────
const chapterDetailsById = {
  1: {
    id: 1,
    chapter: "Introduction to Cybersecurity",
    icon: Shield, // ← Lucide icon component
    completed: true,
    content: {
      title: "Introduction to Cybersecurity",
      author: "Dr. Sarah Chen",
      duration: "45 minutes",
      image:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
    },
    tasks: [
      {
        id: "task-1",
        title: "Understanding Cyber Threats",
        completed: false,
        content: {
          description: `Learn about the fundamental concepts of cybersecurity and common threats in today's digital landscape.`,
          objectives: [
            "Understand the basics of cybersecurity",
            "Identify common cyber threats",
            "Learn basic security terminology",
          ],
          mainContent: `Before teaching you the technical hands-on aspects of ethical hacking, you'll need to understand more about what a penetration tester's job responsibilities are and what processes are followed in performing pentests.

Cybersecurity is relevant to all people in the modern world, including:
- Strong password policies to protect emails
- Business protection of devices and data
- Personal information security
- Network security

According to Security Magazine, a cybersecurity industry magazine, there are over 2,200 cyber attacks every day - 1 attack every 39 seconds.`,
          questions: [
            {
              id: "q1",
              text: "What is the primary goal of a penetration test?",
              type: "text",
              hint: "Think about the ethical aspects and defensive nature of the activity",
            },
            {
              id: "q2",
              text: "How many cyber attacks occur daily according to Security Magazine?",
              type: "text",
              hint: "The number is mentioned in the content - over 2,200",
            },
          ],
        },
      },
      {
        id: "task-2",
        title: "Basic Security Tools",
        completed: false,
        content: {
          description:
            "Introduction to essential security tools and their usage.",
          objectives: [
            "Learn about common security tools",
            "Understand basic tool usage",
            "Practice with sample scenarios",
          ],
          mainContent: "Content for basic security tools...",
          questions: [
            {
              id: "q3",
              text: "Name three essential security tools mentioned in the lesson",
              type: "text",
              hint: "Look for tools mentioned in the scanning and monitoring sections",
            },
          ],
        },
      },
    ],
  },

  2: {
    id: 2,
    chapter: "Ethical Hacking Basics",
    icon: Terminal, // ← Lucide icon component
    completed: false,
    content: {
      title: "Getting Started with Penetration Testing",
      author: "Mark Rodriguez",
      duration: "60 minutes",
      image:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=2070",
    },
    tasks: [
      {
        id: "task-3",
        title: "Penetration Testing Basics",
        completed: false,
        content: {
          description:
            "Explore the fundamentals of ethical hacking and penetration testing.",
          objectives: ["Understand penetration testing basics"],
          mainContent: `Penetration testing (or pentesting) is the practice of testing a computer system, network, or web application to find vulnerabilities that an attacker could exploit.`,
          questions: [
            {
              id: "q4",
              text: "What is the difference between black hat and white hat hacking?",
              type: "text",
              hint: "One is malicious, one is ethical.",
            },
          ],
        },
      },
      {
        id: "task-4",
        title: "Reconnaissance Techniques",
        completed: true,
        content: {
          description:
            "Learn how to gather information about targets using passive and active reconnaissance.",
          objectives: [
            "Differentiate passive vs. active recon",
            "Use `whois`, `nslookup`, `nmap` basics",
          ],
          mainContent: `Reconnaissance is the first phase of a penetration test. In passive reconnaissance, you gather public data from websites, social media, DNS records, etc. In active reconnaissance, you interact with the target directly (e.g., sending pings, port scanning).`,
          questions: [
            {
              id: "q5",
              text: "Name one passive reconnaissance tool.",
              type: "text",
            },
            {
              id: "q6",
              text: "What `nmap` flag shows open TCP ports?",
              type: "text",
            },
          ],
        },
      },
    ],
  },

  3: {
    id: 3,
    chapter: "Network Defense Fundamentals",
    icon: Shield, // ← Lucide icon component
    completed: false,
    content: {
      title: "Firewall and IDS/IPS Overview",
      author: "Alex Kim",
      duration: "50 minutes",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2070",
    },
    tasks: [
      {
        id: "task-5",
        title: "Configuring a Basic Firewall",
        completed: false,
        content: {
          description:
            "Understand firewall rules and how to configure a basic iptables or UFW setup.",
          objectives: [
            "Interpret firewall rule syntax",
            "Set up a basic UFW policy",
          ],
          mainContent: `Firewalls filter network traffic based on predefined rules. In Linux, \`iptables\` or \`ufw\` are commonly used. UFW (Uncomplicated Firewall) is a simpler frontend for \`iptables\`.`,
          questions: [
            {
              id: "q7",
              text: "What command enables UFW and allows SSH (port 22)?",
              type: "text",
            },
          ],
        },
      },
      {
        id: "task-6",
        title: "Intro to IDS/IPS",
        completed: false,
        content: {
          description:
            "Learn what an Intrusion Detection System (IDS) and Intrusion Prevention System (IPS) do.",
          objectives: [
            "Define IDS vs. IPS",
            "Give an example of a popular IDS tool",
          ],
          mainContent: `IDS (Intrusion Detection System) passively monitors traffic and alerts on suspicious activity. IPS (Intrusion Prevention System) actively blocks or mitigates threats in real-time.`,
          questions: [
            {
              id: "q8",
              text: "Name one open-source IDS tool.",
              type: "text",
            },
          ],
        },
      },
    ],
  },
  // …you may add additional chapters keyed by ID here…
};

// ────────────────────────────────────────────────────────────────────────────
// ContentController component: only knows “summaries” (id, chapter, icon, completed).
// It renders Sidebar (passing courseData + currentChapter) and the Content pane.
// ────────────────────────────────────────────────────────────────────────────
const ContentController = () => {
  // Get the `id` from the URL and navigation function for updating the URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Convert `chapterDetailsById` object into an array for Sidebar
  // (Sidebar expects `courseData` to be an array of { id, chapter, icon, completed, ... })
  const courseData = Object.values(chapterDetailsById);

  // Use the `id` from the URL directly as the selected chapter ID
  // (`id` is a string, matching keys in `chapterDetailsById`)
  const selectedChapterId = id;

  // Derive the current chapter from the URL `id`
  const currentChapter = chapterDetailsById[selectedChapterId];

  // On mount or when `id` changes, redirect to the first chapter if `id` is missing or invalid
  useEffect(() => {
    if (courseData.length > 0 && (!id || !chapterDetailsById[id])) {
      navigate(`/chapter/${courseData[0].id}`);
    }
  }, [id, navigate, courseData]);

  // Handler: when the user clicks a chapter tile in Sidebar
  const handleChapterSelect = (chapterItem) => {
    // Navigate to the chapter's URL, updating the `id` in the URL to keep it in sync
    navigate(`/chapter/${chapterItem.id}`);
  };

  return (
    <div className="flex max-h-full overflow-hidden">
      {/* Sidebar: passes the full `courseData` array, the current chapter, and the selection callback */}
      <Sidebar
        isPreview={false}
        courseData={courseData}
        currentChapter={currentChapter || {}}
        onChapterSelect={handleChapterSelect}
        title="Course Contents"
      />
      {/* Main Content: renders the Content component if a valid chapter is selected */}
      <div className="flex-1 overflow-auto">
        {currentChapter ? (
          <Content selectedChapterId={selectedChapterId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No chapter selected or invalid chapter ID.
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentController;
