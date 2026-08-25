import React from "react";

export const TrustSection: React.FC = () => {
  return (
    <section className="trust">
      <div className="wrap">
        <span className="section-label">Designed For Growth</span>
        <h2 className="section-title reveal">Built for real-world business operations.</h2>
        <p className="trust-quote reveal">
          VIFEMS is built to empower <span className="hl">growing businesses, institutions, and service providers</span> with reliable, centralized management every single day.
        </p>
        <div className="trust-tags reveal">
          <span className="trust-tag">Small Businesses</span>
          <span className="trust-tag">Service Providers</span>
          <span className="trust-tag">Educational Institutions</span>
          <span className="trust-tag">Retail & Agencies</span>
          <span className="trust-tag">Organizations</span>
        </div>
      </div>
    </section>
  );
};
