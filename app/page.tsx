"use client";

import Link from "next/link";
import { features } from "./editor/features";
import AOS from "aos";
import { useEffect } from "react";
import { FilePen } from "lucide-react";

export default function EditorPage() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 1000,
    });
  }, []);

  return (
    <div className="w-full pt-12 pb-5 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4">

        {/* Hero Section */}
        <header data-aos="zoom-out" className="mb-8 text-center">
          <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            DocuEdit Pro
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto my-6">
            Create, edit, and format documents with professional-grade tools.
            Export to PDF and Word formats with ease.
          </p>

          {/* CTA Button */}
          <Link
            href="/editor"
            className="text-base md:text-lg inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-800 hover:to-indigo-800 hover:shadow-purple-400 hover:dark:shadow-purple-300 rounded-full hover:shadow-md transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 group"
          >
            <FilePen size={25} className="group-hover:animate-pulse" />
            Start Writing
          </Link>
        </header>

        {/* About Section */}
        <section data-aos="zoom-in" className="text-center mt-20 mb-16">
          <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            About DocuEdit Pro
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            DocuEdit Pro is a next-generation document editor built for clarity, focus, and creativity.
            Developed using React, TypeScript, and TipTap, it empowers writers, developers, and teams
            to create visually engaging and precisely formatted documents with ease.
          </p>
        </section>

        {/* Key Features Section */}
        <section className="mb-20">
          <h2 data-aos="fade-in" className="text-3xl font-semibold text-center mb-8 text-gray-900 dark:text-gray-100">
            Key Features
          </h2>
          <div className="w-full md:w-[90%] md:mx-auto lg:w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                data-aos="fade-up"
              >
                <div className="p-6 bg-white dark:bg-slate-800 group rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 hover:shadow-blue-500 hover:dark:shadow-blue-500 transition duration-300">
                  <div className="text-indigo-600 dark:text-indigo-400 flex justify-center group-hover:animate-bounce">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold my-5 text-gray-900 dark:text-gray-100 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}