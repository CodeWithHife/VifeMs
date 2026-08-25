'use client';

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const testimonialsRow1 = [
  { quote: '"Attendance used to live in a notebook. Now it\'s one tap."', attr: "Admin, Bright Future Academy" },
  { quote: '"We stopped chasing payment screenshots on WhatsApp."', attr: "Manager, Elite Fitness Center" },
  { quote: '"Setup took less time than our old spreadsheet import."', attr: "Coordinator, Crestview Training Center" },
  { quote: '"Every fee balance in one place, finally."', attr: "Bursar, St. Augustine's School" },
];

const testimonialsRow2 = [
  { quote: '"Our staff actually opened it on day one."', attr: "Owner, Peak Performance Gym" },
  { quote: '"No more end-of-month reporting scramble."', attr: "Director, Horizon Learning Institute" },
  { quote: '"Parents get updates without a group chat."', attr: "Admin, Bright Future Academy" },
  { quote: '"It replaced four different tools for us."', attr: "Manager, FitCore Studio" },
];

export const Testimonials: React.FC = () => {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (row1Ref.current) {
      gsap.to(row1Ref.current, { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
    }
    if (row2Ref.current) {
      gsap.fromTo(row2Ref.current, { xPercent: -50 }, { xPercent: 0, duration: 36, ease: "none", repeat: -1 });
    }
  }, []);

  return (
    <section className="testimonials">
      <div className="wrap">
        <span className="section-label">Customer Feedback</span>
        <h2 className="section-title">Trusted by modern businesses and teams.</h2>
        <p className="section-body">
          VIFEMS is built directly alongside active business owners, admins, and managers who rely on us for their daily operations.
        </p>

        <div className="marquee-viewport">
          <div className="marquee-row" ref={row1Ref}>
            {[...testimonialsRow1, ...testimonialsRow1].map((t, idx) => (
              <div key={idx} className="t-card">
                <div className="t-quote">{t.quote}</div>
                <div className="t-attr">{t.attr}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="marquee-viewport">
          <div className="marquee-row" ref={row2Ref}>
            {[...testimonialsRow2, ...testimonialsRow2].map((t, idx) => (
              <div key={idx} className="t-card">
                <div className="t-quote">{t.quote}</div>
                <div className="t-attr">{t.attr}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
