import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
  Award,
  BookOpen,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

const slideImages = [
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Cybersecurity concept
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Code/matrix
  "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Hacker in hoodie
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Network security
  "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80", // Team collaboration
];

const About = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const slideshowRef = useRef(null);

  // Minimum swipe distance (in pixels) to consider as a valid swipe
  const minSwipeDistance = 50;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slideImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    if (isRightSwipe) prevSlide();

    // Reset touch positions
    setTouchStartX(0);
    setTouchEndX(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="bg-gradient-to-br min-h-screen from-black via-gray-900 to-black">
      <div className="text-white">
        {/* Image Slideshow */}
        <div
          ref={slideshowRef}
          className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: "pan-y" }}
        >
          {slideImages.map((image, index) => (
            <div
              key={index}
              className="absolute inset-0 bg-gradient-to-b from-black/10 via-gray-900/20 to-black/30 transition-all duration-500 ease-in-out"
            >
              <div
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={image}
                  alt={`Cyberanzen Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.6)" }}
                />
              </div>
            </div>
          ))}

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-1 sm:p-2 rounded-full text-white z-20 hover:bg-black/70"
          >
            <ChevronLeft size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/50 p-1 sm:p-2 rounded-full text-white z-20 hover:bg-black/70"
          >
            <ChevronRight size={20} className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Slide indicators */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2 z-20">
            {slideImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  index === currentSlide ? "bg-[#01ffdb]" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Introduction & Vision */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Introduction & Vision
            </h2>
            <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-[#01ffdb] mx-auto mb-6 sm:mb-8"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start">
            <div className="space-y-4 sm:space-y-6 px-4">
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Cyberanzen is a student-run cybersecurity club comprising a
                community of passionate individuals dedicated to exploring the
                exciting world of cybersecurity. Our club fosters groups of
                like-minded individuals who want to learn and collaborate by
                providing them with a platform to explore, innovate, and
                contribute to a safer digital real.
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                At Cyberanzen, we enhance learning by conducting enriching
                workshops and exposing members to real-world cyberattacks and
                vulnerabilities through Capture The Flag (CTF) challenges and
                other competitions. However, our club isn't just about
                competitions, we actively encourage members to attend
                information security conferences, helping them stay updated with
                the latest trends and developments.
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Beyond events and challenges, Cyberanzen provides an environment
                for individuals with shared interests to connect, collaborate,
                and tackle real-world cybersecurity issues, shaping a secure
                digital future.
              </p>
            </div>

            <section className="flex flex-col space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-b from-black/10 via-gray-700/30 to-black/30 backdrop-blur-lg p-4 sm:p-6 rounded-lg border border-gray-700 shadow-xl">
                <div className="flex items-center mb-4 sm:mb-6">
                  <Shield className="text-[#01ffdb] mr-3 sm:mr-4 w-6 h-6 sm:w-9 sm:h-9" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  To create a community of cybersecurity enthusiasts who
                  collaborate, learn, and grow together while contributing to a
                  safer digital world through education, awareness, and
                  practical experience.
                </p>
              </div>

              <div className="bg-gradient-to-b from-black/10 via-gray-700/30 to-black/30 backdrop-blur-lg p-4 sm:p-6 rounded-lg border border-gray-700 shadow-xl">
                <div className="flex items-center mb-4 sm:mb-6">
                  <Shield className="text-[#01ffdb] mr-3 sm:mr-4 w-6 h-6 sm:w-9 sm:h-9" />
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  To create a community of cybersecurity enthusiasts who
                  collaborate, learn, and grow together while contributing to a
                  safer digital world through education, awareness, and
                  practical experience.
                </p>
              </div>
            </section>
          </div>
        </section>

        {/* Objectives */}
        <section className="min-w-[100vw] py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-gray-200/10 via-gray-700/30 to-black/30">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 sm:mb-12 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                Objectives
              </h2>
              <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-[#01ffdb] mx-auto mb-6 sm:mb-8"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gradient-to-b from-gray-900/80 via-gray-700/30 to-black/30 backdrop-blur-lg p-4 sm:p-6 rounded-lg border border-gray-700 flex items-start">
                <div className="bg-[#01ffdb]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <Users className="text-[#01ffdb] w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                    Creating Awareness
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Creating cybersecurity awareness among peers and the wider
                    community through educational initiatives and outreach
                    programs.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-b from-gray-900/80 via-gray-700/30 to-black/30 backdrop-blur-lg p-4 sm:p-6 rounded-lg border border-gray-700 flex items-start">
                <div className="bg-[#01ffdb]/10 p-2 sm:p-3 rounded-full mr-3 sm:mr-4">
                  <BookOpen className="text-[#01ffdb] w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                    Education
                  </h3>
                  <p className="text-gray-300 text-sm sm:text-base">
                    Educating members about emerging technologies, latest
                    threats, and best practices in cybersecurity through
                    workshops and hands-on training.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do & Why Join Us */}
        <section className="min-w-[100vw] py-12 sm:py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900  max-w-7xl mx-auto">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              What We Do & Why Join Us?
            </h2>
            <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-[#01ffdb] mx-auto mb-6 sm:mb-8"></div>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-b from-gray-900/80 via-gray-700/30 to-black/30 backdrop-blur-lg p-4 sm:p-6 rounded-lg border border-gray-700 hover:border-[#01ffdb] transition-colors group"
              >
                <div className="bg-[#01ffdb]/10 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-[#01ffdb]/20 transition-colors">
                  {i === 0 ? (
                    <Award className="text-[#01ffdb] w-6 h-6 sm:w-7 sm:h-7" />
                  ) : i === 1 ? (
                    <Shield className="text-[#01ffdb] w-6 h-6 sm:w-7 sm:h-7" />
                  ) : (
                    <Globe className="text-[#01ffdb] w-6 h-6 sm:w-7 sm:h-7" />
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                  {
                    ["Learning Resources", "Hands-on Experience", "Networking"][
                      i
                    ]
                  }
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  {
                    [
                      "Access diverse learning resources, workshops, webinars, and presentations on various cybersecurity topics.",
                      "Gain practical experience through Capture The Flag (CTF) challenges, real-world simulations, and collaborative projects.",
                      "Connect with fellow cybersecurity enthusiasts, share knowledge, and build a strong professional network.",
                    ][i]
                  }
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 bg-gradient-to-b from-gray-900/80 via-gray-700/30 to-black/30 backdrop-blur-lg p-6 sm:p-8 rounded-lg border border-gray-700 hover:border-[#01ffdb] transition-colors group">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
              Join Our Community
            </h3>
            <p className="text-gray-300 text-sm sm:text-base text-center mb-6 sm:mb-8">
              Whether you're just starting out or looking to refine your
              technical skills, Cyberanzen offers the resources, mentorship, and
              community to help you grow in the field of cybersecurity.
            </p>
            <div className="flex justify-center">
              <Link to="/signup">
                <button
                  className="cyber-button font-bold py-2 px-6 sm:py-3 sm:px-8 rounded-lg flex items-center gap-2 bg-[#01ffdb]/10 border border-[#01ffdb]/50 text-[#01ffdb] hover:bg-[#01ffdb]/20 text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Become a Member
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default About;
