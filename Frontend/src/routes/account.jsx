import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  ChevronLast,
  AlignLeft,
  LayoutList,
} from "lucide-react";
import {
  Home,
  Settings,
  BookOpen,
  Trophy,
  UserCircle,
  History,
  Star,
  Layers,
  Puzzle,
} from "lucide-react";
import { Link, Outlet, NavLink } from "react-router-dom";

export default function Account() {
  const sidebarMenu = [
    {
      type: "profile",
      avatar: {
        name: "shadcn",
        email: "m@example.com",
        img: "https://i.pinimg.com/736x/af/70/bb/af70bb880077591b711b83ee7717c91b.jpg",
        link: "/profile/editprofile",
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
    <div>
      <div>
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer"
              className="btn drawer-button bg-gradient-to-br from-gray-90  via-65% via-black to-gray-900 ml-0 mt-15 transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-lg active:scale-95"
            >
              <AlignLeft h-6 w-8 mr-2 />
              More
            </label>
          </div>

          <div className="drawer-side mt-20">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>

            <ul className="menu bg-base-200 text-base-content min-h-full w-65 p-4 bg-gradient-to-br from-gray-90  via-60% via-black to-gray-900">
              {sidebarMenu.map((block, i) => {
                if (block.type === "profile") {
                  return (
                    <li key={i} className="">
                      <NavLink
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
                      </NavLink>
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
                          <Link
                            to={item.to}
                            className="flex items-center gap-2"
                          >
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
      <Outlet />
    </div>
  );
}
