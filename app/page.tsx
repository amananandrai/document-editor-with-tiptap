"use client";

import Link from "next/link";
import { features } from "./editor/features";
import AOS from "aos";
import { useEffect } from "react";
import { FilePen, Zap, FileText, Share2 } from "lucide-react";
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
      <div>
        {/* =================== HERO SECTION =================== */}
        <header
          id="home-section"
          data-aos="fade-in"
          className="relative min-h-[92vh] flex flex-col justify-center items-center mb-8 text-center
            bg-[url('/placeholder-bg.jpg')] bg-cover bg-center bg-no-repeat"
        >
          <div className="absolute inset-0 bg-black/60 dark:bg-black/75 pointer-events-none" />
          <div className="relative z-10 w-full flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-extrabold">
              <TypeAnimation
                sequence={["DocuEdit Pro", 1000]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
              />
            </h1>

            <p className="text-lg text-gray-50 w-[85%] md:max-w-2xl mx-auto my-6">
              Create, edit, and format documents with professional-grade tools.
              Export to PDF and Word formats with ease.
            </p>

            <Link
              href="/editor"
              className="text-base md:text-lg inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-indigo-600 
                hover:from-blue-800 hover:to-indigo-800 hover:shadow-purple-400 
                rounded-full hover:shadow-md transition-all duration-200 
                hover:scale-[1.05] focus:scale-[1.05] focus:ring-2 focus:ring-indigo-500 group"
            >
              <FilePen size={25} className="group-hover:animate-pulse" />
              Start Writing
            </Link>
          </div>
        </header>

        {/* =================== ABOUT SECTION =================== */}
     {/* =================== ABOUT SECTION =================== */}
<section
  id="about-section"
  data-aos="zoom-in"
  className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto text-center my-24"
>
  <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
    About DocuEdit Pro
  </h2>

  {/* Glassy Gradient Paragraph Box */}
  <div className="relative mx-auto max-w-5xl rounded-2xl p-[2px] bg-gradient-to-r from-indigo-600 via-purple-400 to-pink-400 mb-12">
    <div className="rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-6 md:p-8 shadow-lg transition-all duration-300 hover:shadow-purple-400/30">
      <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
          DocuEdit Pro
        </span>{" "}
        is a next-generation document editor designed for clarity, focus, and
        creativity. Built with React, TypeScript, and TipTap — it gives writers,
        developers, and teams a smooth, elegant space to create professional
        documents effortlessly.
      </p>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
    {[
      {
        title: "Lightning Fast",
        desc: "Lightning-fast, keyboard-smart, and smoothly animated.",
      },
      {
        title: "Collaborative Power",
        desc: "Edit and share documents in real-time with your teammates.",
      },
      {
        title: "Beautiful Export",
        desc: "Generate perfectly formatted PDFs and Word files with a single click.",
      },
    ].map((card, i) => (
      <div
        key={i}
        className="p-6 rounded-2xl bg-gradient-to-br from-white/80 to-gray-100 dark:from-slate-800 dark:to-slate-900 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-purple-400/30 transform hover:-translate-y-2 transition-all duration-300"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {card.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
          {card.desc}
        </p>
      </div>
    ))}
  </div>
</section>

        <section
          id="workflow-section"
          data-aos="fade-up"
          className="relative mb-10 bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950 py-30"
        >
          <div className="absolute inset-0 bg-[url('/pattern-bg.svg')] opacity-10 dark:opacity-5" />
          <div className="relative z-10 w-[90%] md:w-[80%] lg:w-[70%] mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-10 bg-white bg-clip-text text-transparent">
              How It Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                {
                  icon: <Zap size={50} />,
                  step: "1. Start Instantly",
                  desc: "Jump right in with our modern editor — no setup, no friction.",
                },
                {
                  icon: <FileText size={50} />,
                  step: "2. Edit Effortlessly",
                  desc: "Format text, add media, and structure your ideas beautifully.",
                },
                {
                  icon: <Share2 size={50} />,
                  step: "3. Export & Share",
                  desc: "Export in one click and share your documents professionally.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center bg-white/90 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-purple-400/40 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {item.step}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-base">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =================== FEATURES SECTION =================== */}
        <section
          id="features-section"
          className="w-[90%] md:w-[85%] lg:w-[75%] mx-auto mb-24"
        >
          <h2
            data-aos="fade-in"
            className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
          >
            Key Features
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} data-aos="fade-up">
                <div
                  tabIndex={0}
                  className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
                    hover:-translate-y-2 hover:shadow-indigo-500/40 transition-all duration-300"
                >
                  <div className="text-indigo-500 dark:text-indigo-400 flex justify-center mb-4 text-4xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center text-base">
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
