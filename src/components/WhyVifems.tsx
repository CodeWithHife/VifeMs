import React from "react";

export const WhyVifems: React.FC = () => {
  return (
    <section>
      <div className="wrap">
        <span className="section-label">Why VIFEMS</span>
        <h2 className="section-title reveal">Simple. Connected. Built to grow.</h2>
        <div className="why-rows">
          <div className="why-row reveal">
            <div className="why-tag">SIMPLE</div>
            <div>
              <div className="why-title">Designed for intuitive team workflows</div>
              <div className="why-desc">
                VIFEMS is crafted to be straightforward and effortless so anyone on your team can manage daily operations with ease.
              </div>
            </div>
          </div>
          <div className="why-row reveal">
            <div className="why-tag">CONNECTED</div>
            <div>
              <div className="why-title">One record, everywhere it's needed</div>
              <div className="why-desc">
                People, attendance, payments and reports work off the same data — so nothing gets recorded twice, or forgotten once.
              </div>
            </div>
          </div>
          <div className="why-row reveal">
            <div className="why-tag">MODULAR</div>
            <div>
              <div className="why-title">Start small, expand as you grow</div>
              <div className="why-desc">
                Start with what your business needs today. Add more features as your operations expand and scale.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
