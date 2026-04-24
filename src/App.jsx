import { useState } from "react";
import { CONCEPTS } from "./conceptsData.js";
import Pixels from "./concepts/Pixels.jsx";
import Neuron from "./concepts/Neuron.jsx";
import Network from "./concepts/Network.jsx";
import Convolutions from "./concepts/Convolutions.jsx";
import Training from "./concepts/Training.jsx";
import Digits from "./concepts/Digits.jsx";
import About from "./concepts/About.jsx";

function ConceptTab({ concept, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`era-tab ${active ? "era-tab--active" : ""}`}
    >
      <span className="era-tab__label">{concept.label}</span>
    </button>
  );
}

function ConceptIntro({ concept }) {
  return (
    <div className="sidebar__intro">
      <div className="sidebar__intro-bigidea">{concept.bigIdea}</div>
      <div className="sidebar__intro-text">{concept.motivation}</div>
      <div className="sidebar__intro-activity">
        <span className="sidebar__intro-tag">In this concept</span>
        {concept.activity}
      </div>
    </div>
  );
}

function ConceptPanel({ concept }) {
  if (concept.id === "pixels") return <Pixels />;
  if (concept.id === "neuron") return <Neuron />;
  if (concept.id === "network") return <Network />;
  if (concept.id === "convolutions") return <Convolutions />;
  if (concept.id === "digits") return <Digits />;
  if (concept.id === "training") return <Training />;
  return (
    <div className="era-panel-placeholder">
      <div className="era-panel-placeholder__icon">🚧</div>
      <div>"{concept.label}" coming soon</div>
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState(CONCEPTS[0].id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isAbout = activeId === "about";
  const activeConcept = CONCEPTS.find((c) => c.id === activeId);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarCollapsed ? "sidebar--collapsed" : ""}`}>
        <button
          className="sidebar__collapse"
          onClick={() => setSidebarCollapsed((c) => !c)}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? "›" : "‹"}
        </button>
        <div className="sidebar__header">
          <h1 className="sidebar__title">CV Tour</h1>
          <p className="sidebar__subtitle">interactive lesson</p>
        </div>
        <nav className="sidebar__nav">
          {CONCEPTS.map((c) => (
            <ConceptTab
              key={c.id}
              concept={c}
              active={c.id === activeId}
              onClick={() => setActiveId(c.id)}
            />
          ))}
          <button
            className={`era-tab era-tab--about ${isAbout ? "era-tab--active" : ""}`}
            onClick={() => setActiveId("about")}
          >
            <span className="era-tab__label">About</span>
          </button>
        </nav>
        {!isAbout && activeConcept && <ConceptIntro concept={activeConcept} />}
      </aside>

      <main className="main-content">
        <header className="main-header">
          {isAbout ? (
            <h2 className="main-header__title">About</h2>
          ) : (
            <h2 className="main-header__title">{activeConcept.label}</h2>
          )}
        </header>
        <div className="main-panel">
          {isAbout ? <About /> : <ConceptPanel concept={activeConcept} />}
        </div>
      </main>
    </div>
  );
}
