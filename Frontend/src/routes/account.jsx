import React, { useEffect, useState } from "react";
import { User, Mail, Phone } from "lucide-react";
import { Home, Settings, BookOpen, Trophy, UserCircle, History, Star, Layers,Puzzle } from "lucide-react";




export default function Account() {

  // Example data; replace with actual user info or fetch from an API
  const userData = {
    username: "john_doe",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 123 456 7890",
  };

  return (
    <div >
      <div className="drawer " >
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer"
            className="btn  drawer-button ml-1 mt-15"
          >
            profile
          </label>
        </div>
        <div className="drawer-side mt-20">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <li>
              {/* Bottom Section */}
              <div className="flex items-center space-x-2">
                <img
                  src="https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg"
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">shadcn</p>
                  <p className="text-xs text-gray-400">m@example.com</p>
                </div>
              </div>
            </li>
            <p className="text-xs uppercase text-gray-500 mb-2 m-5">Platform</p>
            <li>
              <details>
                <summary><Trophy h-4 w-3 /> Playground</summary>
                <ul className="pl-4">
                  <li>
                    <a> <History h-4 w-3/> Histor </a>
                  </li>
                  <li>
                    <a> Sarred </a>
                  </li>
                    <li>
                    <a> settings </a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary> <Puzzle h-4 w-3/>Models</summary>
                <ul className=" rounded-t-none p-2">
                  <li>
                    <a>Genesis</a>
                  </li>
                  <li>
                    <a>Explorer</a>
                  </li>
                  <li>
                    <a>Quantum</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary> <BookOpen h-4 w-3/>Documentation</summary>
                <ul className=" rounded-t-none p-2">
                  <li>
                    <a>Intoduction</a>
                  </li>
                  <li>
                    <a>Get Start</a>
                  </li>
                  <li>
                    <a>Tutorials</a>
                  </li>
                   <li>
                    <a>Changelog</a>
                  </li>
                </ul>
              </details>
            </li>
            <p className="text-xs uppercase text-gray-500 mb-2 m-5">project</p>
            <li>
              <a><Settings h-4 w-3/>Settings</a>
            </li>
            <li>
              <a>Sidebar Item 5</a>
            </li>
            <li>
              <a><Layers h-4 w-3/>Get<div className="bg-blue-800 w-20 text-center rounded-md mr-30">Premium</div></a>
            </li>
          </ul>
        </div>
      </div>


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
    </div>
  );
}
