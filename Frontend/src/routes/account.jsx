import React, { useEffect, useState } from "react";
import { User, Mail, Phone } from "lucide-react";
import { Home, Settings, BookOpen, Trophy, UserCircle, History, Star, Layers,Puzzle } from "lucide-react";
import { Link } from "react-router-dom";




export default function Account() {

   const sidebarMenu = [
    {
      type: "profile",
      avatar: {
        name: "shadcn",
        email: "m@example.com",
        img: "https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg",
        link: "/editprofile",
      },
    },
    {
      section: "Platform",
      items: [
        {
          title: "Playground",
          icon: Trophy,
          children: [
            { label: "Histor", icon: History, to: "/" },
            { label: "Sarred", to: "/" },
            { label: "Settings", to: "/" },
          ],
        },
        {
          title: "Models",
          icon: Puzzle,
          children: [
            { label: "Genesis", to: "/" },
            { label: "Explorer", to: "/" },
            { label: "Quantum", to: "/" },
          ],
        },
        {
          title: "Documentation",
          icon: BookOpen,
          children: [
            { label: "Introduction", to: "/" },
            { label: "Get Start", to: "/" },
            { label: "Tutorials", to: "/" },
            { label: "Changelog", to: "/" },
          ],
        },
      ],
    },
    {
      section: "Project",
      items: [
        { label: "Settings", icon: Settings, to: "/" },
        { label: "Sidebar Item 5", to: "/" },
        {
          label: "Get",
          icon: Layers,
          to: "/",
          badge: "Premium",
        },
      ],
    },
  ];

  // Example data; replace with actual user info or fetch from an API
  const userData = {
    username: "john_doe",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+1 123 456 7890",
  };

  return (
    <div >
      <div>
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="btn drawer-button ml-1 mt-15">
            profile
          </label>
        </div>

        <div className="drawer-side mt-20">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu bg-base-200 text-base-content min-h-full w-65 p-4">
            {sidebarMenu.map((block, i) => {
              if (block.type === "profile") {
                return (
                  <li key={i}>
                    <Link
                      to={block.avatar.link}
                      className="flex items-center space-x-2"
                    >
                      <img
                        src={block.avatar.img}
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {block.avatar.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {block.avatar.email}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              }

              return (
                <React.Fragment key={i}>
                  <p className="text-xs uppercase text-gray-500 mb-2 m-5">
                    {block.section}
                  </p>
                  {block.items.map((item, idx) =>
                    item.children ? (
                      <li key={idx}>
                        <details>
                          <summary className="flex items-center gap-2">
                            {item.icon && <item.icon size={20} />}
                            {item.title}
                          </summary>
                          <ul className="pl-4">
                            {item.children.map((child, cIdx) => (
                              <li key={cIdx}>
                                <Link
                                  to={child.to}
                                  className="flex items-center gap-2"
                                >
                                  {child.icon && <child.icon size={18} />}
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    ) : (
                      <li key={idx}>
                        <Link to={item.to} className="flex items-center gap-2">
                          {item.icon && <item.icon size={20} />}
                          {item.label}
                          {item.badge && (
                            <div className="bg-blue-800 w-20 text-center text-white text-xs rounded-md ml-auto">
                              {item.badge}
                            </div>
                          )}
                        </Link>
                      </li>
                    )
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>
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
