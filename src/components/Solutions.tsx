'use client';

import React, { useState } from "react";

type TabKey = "small-businesses" | "schools" | "service-businesses" | "retail-businesses" | "agencies" | "organizations";

interface SolutionData {
  title: string;
  navItems: string[];
  description: string;
}

const solutionsData: Record<TabKey, SolutionData> = {
  "small-businesses": {
    title: "Small Businesses",
    navItems: ["Dashboard", "Customers", "Staff", "Tasks", "Finance", "Reports"],
    description: "Streamline day-to-day operations, track customer orders and staff task assignments, and monitor business cash flow in real-time.",
  },
  schools: {
    title: "Schools",
    navItems: ["Dashboard", "Students", "Attendance", "Fees", "Staff", "Results"],
    description: "Manage student enrolment, track daily attendance, automate tuition fee receipts, and keep parents updated effortlessly.",
  },
  "service-businesses": {
    title: "Service Businesses",
    navItems: ["Dashboard", "Clients", "Bookings", "Staff", "Invoices", "Tasks"],
    description: "Schedule client appointments, assign field or office staff, track project tasks, and send automated digital invoices.",
  },
  "retail-businesses": {
    title: "Retail Businesses",
    navItems: ["Dashboard", "Sales", "Inventory", "Customers", "Staff", "Finance"],
    description: "Track daily sales transactions, keep customer purchase histories connected, and streamline staff shifts and inventory reports.",
  },
  agencies: {
    title: "Agencies",
    navItems: ["Dashboard", "Clients", "Projects", "Tasks", "Billing", "Reports"],
    description: "Organize client retainers, assign team deliverables, track time and milestones, and generate clear performance reports.",
  },
  organizations: {
    title: "Organizations",
    navItems: ["Dashboard", "Members", "Attendance", "Dues", "Staff", "Reports"],
    description: "Centralize member registries, track event attendance, manage staff permissions, and process membership dues seamlessly.",
  },
};

export const Solutions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("small-businesses");

  const tabKeys: TabKey[] = [
    "small-businesses",
    "schools",
    "service-businesses",
    "retail-businesses",
    "agencies",
    "organizations",
  ];

  return (
    <section id="solutions">
      <div className="wrap">
        <span className="section-label">Built For</span>
        <h2 className="section-title reveal">One platform, tailored for your business.</h2>
        <p className="section-body reveal">
          VIFEMS is purpose-built to centralize your operations, team management, and finances — whatever industry you operate in.
        </p>

        <div className="tabs reveal" style={{ flexWrap: "wrap", gap: "8px" }}>
          {tabKeys.map((key) => (
            <button
              key={key}
              className={`tab-btn ${activeTab === key ? "active" : ""}`}
              onClick={() => setActiveTab(key)}
            >
              {solutionsData[key].title}
            </button>
          ))}
        </div>

        {tabKeys.map((tabKey) => {
          const data = solutionsData[tabKey];
          const isActive = activeTab === tabKey;
          return (
            <div
              key={tabKey}
              className={`tab-panel ${isActive ? "active" : ""}`}
              style={{ display: isActive ? "block" : "none" }}
            >
              <div className="tab-nav-mock">
                {data.navItems.map((item, i) => (
                  <span key={i} className="tab-nav-item">
                    {item}
                  </span>
                ))}
              </div>
              <p className="tab-desc">{data.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
