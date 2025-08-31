import React, { useEffect } from "react";
import {
  Shield,
  FileText,
  AlertTriangle,
  Lock,
  Eye,
  Gavel,
  Mail,
} from "lucide-react";
import ParticleBackground from "../components/ParticleBackground";

export default function Terms() {
  useEffect(() => {
    // Smooth scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    // Prevent scrolling on body but allow it on the terms container
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";

    // Optional: Prevent touchmove to block scrolling more robustly
    const preventTouchMove = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.documentElement.style.overflow = "";
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, []);

  const sections = [
    {
      id: "introduction",
      title: "SYSTEM INTRODUCTION",
      icon: <FileText className="h-5 w-5" />,
      content:
        "These Terms and Conditions govern your access to our secure digital platform. By initiating a connection to our systems, you agree to comply with all security protocols and operational guidelines outlined herein. Unauthorized access attempts will be logged and may result in immediate termination of service privileges.",
    },
    {
      id: "usage",
      title: "SERVICE USAGE PROTOCOLS",
      icon: <Shield className="h-5 w-5" />,
      content:
        "You agree to utilize our services in accordance with all applicable cybersecurity laws and regulations. Any attempt to breach, compromise, or exploit system vulnerabilities is strictly prohibited. All user activities are monitored and logged for security analysis.",
    },
    {
      id: "privacy",
      title: "DATA PRIVACY & ENCRYPTION",
      icon: <Eye className="h-5 w-5" />,
      content:
        "Your digital footprint is protected using military-grade AES-256 encryption. Our Privacy Policy details how biometric data, authentication tokens, and user credentials are processed through our secure neural networks. All data transmissions are encrypted end-to-end.",
    },
    {
      id: "intellectual",
      title: "INTELLECTUAL PROPERTY RIGHTS",
      icon: <Lock className="h-5 w-5" />,
      content:
        "All digital assets, including source code, algorithms, neural network architectures, and cybersecurity protocols, remain the exclusive property of our organization. Reverse engineering, decompilation, or unauthorized replication is strictly forbidden.",
    },
    {
      id: "liability",
      title: "LIABILITY LIMITATIONS",
      icon: <AlertTriangle className="h-5 w-5" />,
      content:
        "To the maximum extent permitted by digital law, we shall not be liable for any system failures, data breaches, or security incidents beyond our control. Our liability is limited to the restoration of service functionality and basic data recovery procedures.",
    },
    {
      id: "modifications",
      title: "PROTOCOL MODIFICATIONS",
      icon: <Gavel className="h-5 w-5" />,
      content:
        "We reserve the right to update these Terms and security protocols at any time to address emerging cyber threats. System notifications will be transmitted to all active users. Continued access implies acceptance of updated terms.",
    },
    {
      id: "contact",
      title: "SECURE COMMUNICATIONS",
      icon: <Mail className="h-5 w-5" />,
      content:
        "For secure inquiries regarding these Terms, initiate encrypted communication through our official channels: security@cyberplatform.net. All communications are subject to security screening and may be logged for audit purposes.",
    },
  ];

  return (
    <div className="flex items-center justify-center px-4 sm:px-6 relative overflow-hidden  h-[90vh] pt-10 pb-0 lg:pb-0">
      <ParticleBackground />

      {/* Cyberpunk grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(1, 255, 219, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(1, 255, 219, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 w-full mb-15 max-w-7xl">
        {/* Main Container */}
        <div className="relative">
          {/* Angled border container */}
          <div
            className="relative  bg-teal-700/20 opacity-85 backdrop-blur-xl border-2 border-[#01ffdb]/50 p-1"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))",
            }}
          >
            {/* Inner content area */}
            <div
              className="bg-gray-900/50 max-h-[75vh] overflow-y-auto"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 28px 100%, 0 calc(100% - 28px))",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(1, 255, 219, 0.3) transparent",
              }}
            >
              {/* TERMS Header */}
              <div className="sticky ml-3 top-4 left-4 z-10">
                <div
                  className="bg-[#01ffdb] max-w-3xs text-black px-4 py-1 font-mono font-bold text-lg tracking-wider"
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 10px) 0, 100% 100%, 0 100%)",
                  }}
                >
                  TERMS & CONDITIONS
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 mt-12 p-8 md:p-12">
                {/* Right side - Terms Content */}
                <div className="flex-1 w-full space-y-6">
                  {/* Introduction */}
                  <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#01ffdb] font-mono mb-4 tracking-wider">
                      DIGITAL SECURITY AGREEMENT
                    </h1>
                    <div
                      className="bg-[#01ffdb]/10 border border-[#01ffdb]/30 p-4"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                      }}
                    >
                      <p className="text-[#01ffdb]/80 font-mono text-sm leading-relaxed">
                        Welcome to our secure digital platform. By accessing our
                        cybersecurity systems, you acknowledge and agree to be
                        bound by these Terms and Conditions. All interactions
                        are monitored and logged for security purposes.
                      </p>
                    </div>
                  </div>

                  {/* Terms Sections */}
                  <div className="space-y-6">
                    {sections.map((section, index) => (
                      <div key={section.id} className="relative">
                        <div
                          className="bg-black/40 border border-[#01ffdb]/30 backdrop-blur-sm p-6 hover:border-[#01ffdb]/50 transition-all duration-300"
                          style={{
                            clipPath:
                              "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
                          }}
                        >
                          {/* Section Header */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="text-[#01ffdb] p-2 bg-[#01ffdb]/10 border border-[#01ffdb]/30">
                              {section.icon}
                            </div>
                            <h2 className="text-lg font-bold text-[#01ffdb] font-mono tracking-wide">
                              {String(index + 1).padStart(2, "0")}.{" "}
                              {section.title}
                            </h2>
                          </div>

                          {/* Section Content */}
                          <p className="text-[#01ffdb]/70 font-mono text-sm leading-relaxed">
                            {section.content}
                          </p>

                          {/* Scanning line effect */}
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <div
                              className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#01ffdb]/30 to-transparent opacity-50"
                              style={{
                                animation: `scan 4s ease-in-out infinite ${
                                  index * 0.5
                                }s`,
                                top: "20%",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Agreement Footer */}
                  <div className="mt-8">
                    <div
                      className="bg-[#01ffdb]/5 border-2 border-[#01ffdb]/50 p-6"
                      style={{
                        clipPath:
                          "polygon(0 0, calc(100% - 15px) 0, 100% 15px, 100% 100%, 15px 100%, 0 calc(100% - 15px))",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="h-6 w-6 text-[#01ffdb]" />
                        <h3 className="text-[#01ffdb] font-mono font-bold text-lg">
                          DIGITAL ACKNOWLEDGMENT
                        </h3>
                      </div>
                      <p className="text-[#01ffdb]/80 font-mono text-sm leading-relaxed">
                        By utilizing our services, you digitally acknowledge
                        that you have read, understood, and agree to be bound by
                        these Terms and Conditions. Your biometric signature and
                        access patterns serve as legal consent.
                      </p>
                      <div className="mt-4 text-[#01ffdb]/60 font-mono text-xs">
                        LAST UPDATED: {new Date().toLocaleDateString()} |
                        VERSION: 2.1.0 | STATUS: ACTIVE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glowing effect around the container */}
          <div className="absolute inset-0 bg-[#01ffdb]/5 blur-xl -z-10" />
        </div>
      </div>

      {/* Additional cyberpunk elements */}
      {/* <div className="absolute top-10 right-10 text-[#01ffdb]/30 font-mono text-xs">
        <div>SYS_STATUS: ONLINE</div>
        <div>LEGAL_MODE: ACTIVE</div>
        <div>CONN_STATE: SECURE</div>
      </div>

      <div className="absolute bottom-10 left-10 text-[#01ffdb]/30 font-mono text-xs">
        <div>PROTOCOL: HTTPS/2.0</div>
        <div>ENCRYPTION: AES-256</div>
        <div>NODE: LEGAL</div>
      </div> */}
    </div>
  );
}
