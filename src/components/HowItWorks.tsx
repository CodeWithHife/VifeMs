import React from "react";

export const HowItWorks: React.FC = () => {
  return (
    <section className="hiw" id="how">
      <div className="wrap">
        <span className="section-label">How it works</span>
        <h2 className="section-title reveal">From setup to daily operations.</h2>
        <p className="section-body reveal">
          A straightforward organization can have a usable workspace in about 10 minutes.
        </p>
        <div className="stepper">
          <div className="step reveal">
            <div className="step-circle">01</div>
            <div className="step-title">Create your organization</div>
            <div className="step-desc">Set up your workspace and choose your organization type.</div>
          </div>
          <div className="step reveal">
            <div className="step-circle">02</div>
            <div className="step-title">Add your people</div>
            <div className="step-desc">Import students, members, clients or staff.</div>
          </div>
          <div className="step reveal">
            <div className="step-circle">03</div>
            <div className="step-title">Configure operations</div>
            <div className="step-desc">Set up fees, memberships, classes or services.</div>
          </div>
          <div className="step reveal">
            <div className="step-circle">04</div>
            <div className="step-title">Run everything</div>
            <div className="step-desc">Track attendance, payments and activity from one workspace.</div>
          </div>
        </div>
      </div>
    </section>
  );
};
