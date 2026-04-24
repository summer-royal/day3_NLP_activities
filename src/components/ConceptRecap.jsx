import { CONCEPTS } from "../conceptsData.js";

export default function ConceptRecap({ id }) {
  const concept = CONCEPTS.find((c) => c.id === id);
  if (!concept) return null;
  return (
    <div className="recap">
      <div className="recap__box recap__box--idea">
        <div className="recap__label">Our new idea</div>
        <div className="recap__body">{concept.newIdea}</div>
      </div>
      <div className="recap__box recap__box--problem">
        <div className="recap__label">Remaining problems</div>
        <div className="recap__body">{concept.remainingProblems}</div>
      </div>
    </div>
  );
}
