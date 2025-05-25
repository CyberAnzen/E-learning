import React, { useEffect } from "react";
import { User, Mail, Phone } from "lucide-react";

export default function Account() {
  useEffect(() => {
    // Scroll to top and disable scrolling (like in your LoginPage)
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Example data; replace with actual user info or fetch from an API
  const userData = {
    username: "john_doe",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 123 456 7890",
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-900 px-6 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Account Profile
          </h1>

          {/* Profile Picture Placeholder */}
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white/50" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">
                Username
              </label>
              <div className="flex items-center bg-white/5 border border-white/10 text-white rounded-lg p-2.5">
                <User className="h-5 w-5 text-white/40 mr-2" />
                <span>{userData.username}</span>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">
                Full Name
              </label>
              <div className="flex items-center bg-white/5 border border-white/10 text-white rounded-lg p-2.5">
                <User className="h-5 w-5 text-white/40 mr-2" />
                <span>{userData.fullName}</span>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">
                Email
              </label>
              <div className="flex items-center bg-white/5 border border-white/10 text-white rounded-lg p-2.5">
                <Mail className="h-5 w-5 text-white/40 mr-2" />
                <span>{userData.email}</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-white/70 block mb-1">
                Phone
              </label>
              <div className="flex items-center bg-white/5 border border-white/10 text-white rounded-lg p-2.5">
                <Phone className="h-5 w-5 text-white/40 mr-2" />
                <span>{userData.phone}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <button
              className="py-2.5 px-4 bg-gradient-to-r from-[#01ffdb] to-[#00c3ff]
                         text-[#0f172a] font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Edit Profile
            </button>
            <button
              className="py-2.5 px-4 bg-gray-700 text-white/70 font-medium rounded-lg 
                         hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
