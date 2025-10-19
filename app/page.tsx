"use client";

import Link from "next/link";
import { features } from "./editor/features";
import AOS from "aos";
import { useEffect } from "react";
import { FilePen } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

export default function EditorPage() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 1000,
    });
  }, []);

  return (
    <div className="w-full min-h-screen pb-7 bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-900 dark:to-gray-950">
      <div className="">
        {/* Home Section */}
        <header
          id="home-section"
          data-aos="fade-in"
          className="relative min-h-[92vh] md:min-h-[93vh] lg:min-h-[91vh] flex flex-col justify-center items-center mb-8 text-center scroll-mt-70 md:scroll-mt-20
            bg-[url('/placeholder-bg.jpg')] bg-cover bg-center bg-no-repeat"
        >
          {/* Overlay for background opacity */}
          <div className="absolute inset-0 bg-black/60 dark:bg-black/75 pointer-events-none" />

          {/* Content (make sure it's relative for z-index) */}
          <div className="relative z-10 w-full flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-bold">
              <TypeAnimation
                sequence={["DocuEdit Pro", 1000]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-purple-500"
              />
            </h1>

            <p className="text-lg text-gray-50 w-[85%] md:max-w-2xl mx-auto my-6">
              Create, edit, and format documents with professional-grade tools.
              Export to PDF and Word formats with ease.
            </p>

            {/* CTA Button */}
            <Link
              href="/editor"
              className="text-base md:text-lg inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-800 hover:to-indigo-800 hover:shadow-purple-400 hover:dark:shadow-purple-300 
                focus:from-blue-800 focus:to-indigo-800 focus:shadow-purple-400 focus:dark:shadow-purple-300 
                rounded-full hover:shadow-md focus:shadow-md transition-all duration-200 
                hover:scale-[1.03] focus:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 group"
            >
              <FilePen size={25} className="group-hover:animate-pulse group-focus:animate-pulse" />
              Start Writing
            </Link>
          </div>
        </header>

        {/* About Section */}
        <section id="about-section" data-aos="zoom-in" className="w-[90%] md:w-[85%] lg:w-[75%] mx-auto text-center my-30 scroll-mt-70 md:scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            About DocuEdit Pro
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            DocuEdit Pro is a next-generation document editor built for clarity, focus, and creativity.
            Developed using React, TypeScript, and TipTap, it empowers writers, developers, and teams
            to create visually engaging and precisely formatted documents with ease.
          </p>
        </section>

        {/* Key Features Section */}
        <section id="features-section" className="w-[90%] md:w-[85%] lg:w-[75%] mx-auto mb-10 md:mb-16 scroll-mt-70 md:scroll-mt-20">
          <h2 data-aos="fade-in" className="text-3xl md:text-4xl font-semibold text-center mb-8 text-gray-900 dark:text-gray-100">
            Key Features
          </h2>
          <div className="w-full md:w-[90%] md:mx-auto lg:w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                data-aos="fade-up"
              >
                <div
                  tabIndex={0}
                  className="p-6 bg-white dark:bg-slate-800 group rounded-xl shadow-md md:shadow-lg border border-gray-200 dark:border-gray-700 
                    hover:scale-105 focus:scale-105 hover:shadow-blue-500 focus:shadow-blue-500 
                    hover:dark:shadow-blue-500 focus:dark:shadow-blue-500 
                    transition duration-300"
                >
                  <div className="text-indigo-600 dark:text-indigo-400 flex justify-center group-hover:animate-bounce group-focus:animate-bounce">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold my-5 text-gray-900 dark:text-gray-100 text-center">
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