"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";

// Custom SVG Icons
const FileTextIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "h-4 w-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const BarChart3Icon = ({ className }: { className?: string }) => (
  <svg
    className={className || "h-4 w-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3v18h18M9 9v9m4-9v9m4-9v9"
    />
  </svg>
);

const HomeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "h-4 w-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const WifiIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "h-4 w-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    />
  </svg>
);

const WifiOffIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "h-4 w-4"}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 00-9.75 9.75"
    />
  </svg>
);

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { isOnline } = useOnlineStatus();

  const navItems = [
    { href: "/", label: "Home", icon: HomeIcon },
    { href: "/survey", label: "Survey", icon: FileTextIcon },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3Icon },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YFS</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Youth Farming Survey
              </span>
            </Link>

            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                isOnline
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {isOnline ? <WifiIcon /> : <WifiOffIcon />}
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
