'use client';

import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { DashboardMock } from "@/components/DashboardMock";
import { ProblemSection } from "@/components/ProblemSection";
import { ProductShowcase } from "@/components/ProductShowcase";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Solutions } from "@/components/Solutions";
import { WhyVifems } from "@/components/WhyVifems";
import { TrustSection } from "@/components/TrustSection";
import { CtaSection } from "@/components/CtaSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    function animateCount(el: HTMLElement) {
      const countVal = el.dataset.count;
      if (!countVal) return;
      const final = parseFloat(countVal);
      const suffix = el.dataset.suffix || "";
      const prefix = el.dataset.prefix || "";
      const decimals = countVal.includes(".") ? 1 : 0;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: final,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          const v = decimals ? obj.val.toFixed(1) : Math.round(obj.val).toLocaleString();
          el.textContent = prefix + v + suffix;
        },
      });
    }

    // --- 1. HERO ANIMATIONS (Clean & 100% Opaque) ---
    gsap.fromTo(
      ".hero-title",
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      ".hero-sub",
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power3.out" }
    );

    // --- 2. DASHBOARD MOCK ENTRANCE ---
    gsap.fromTo(
      "#dashMock",
      { y: 40, opacity: 0.2 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".dash-wrap",
          start: "top 90%",
          once: true,
          onEnter: () => {
            document.querySelectorAll<HTMLElement>("#dashMock [data-count]").forEach(animateCount);
          },
        },
      }
    );

    // Chart bars animate height smoothly
    gsap.fromTo(
      ".dash-bar",
      { scaleY: 0, transformOrigin: "bottom" },
      {
        scaleY: 1,
        duration: 0.8,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#dashChart",
          start: "top 90%",
          once: true,
        },
      }
    );

    // --- 3. STATS STRIP ---
    document.querySelectorAll<HTMLElement>(".stats-strip [data-count]").forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          animateCount(el);
        },
      });
    });

    // --- 4. REVEAL ANIMATIONS (Always ending in opacity: 1) ---
    document.querySelectorAll<HTMLElement>(".reveal, .reveal-l, .reveal-r").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 24, opacity: 0.3 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        }
      );
    });

    // --- 5. STEPPER ANIMATION ---
    document.querySelectorAll<HTMLElement>(".step-circle").forEach((c, i) => {
      gsap.fromTo(
        c,
        { scale: 0.7, opacity: 0.4 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.45,
          ease: "back.out(2)",
          scrollTrigger: { trigger: c, start: "top 92%", once: true },
          delay: i * 0.06,
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <Hero />
      <DashboardMock />
      <ProblemSection />
      <ProductShowcase />
      <HowItWorks />
      <Testimonials />
      <Solutions />
      <WhyVifems />
      <TrustSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
