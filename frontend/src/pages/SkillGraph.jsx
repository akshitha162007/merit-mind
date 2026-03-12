export default function SkillGraph() {
  // dummy values for skill graph output
  const candidateId = "123e4567-e89b-12d3-a456-426614174000";
  const jobId = "987e6543-e21b-12d3-a456-426614174999";
  const skillScore = 78.5;
  const matchedSkills = ["Python", "SQL"];
  const skillDetails = [
    { skill: "Python", level: "Advanced" },
    { skill: "SQL", level: "Intermediate" }
  ];
  const matchedCount = matchedSkills.length;
  const totalRequired = 5;

  return (
    <div style={{ color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Skill Graph Evaluation</h2>

      <section className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3>Request Parameters</n        </h3>
        <p><strong>Candidate ID:</strong> {candidateId}</p>
        <p><strong>Job ID:</strong> {jobId}</p>
      </section>

      <section className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h3>Results</h3>
        <p><strong>Skill Score:</strong> {skillScore.toFixed(1)}</p>
        <p><strong>Matched ({matchedCount}/{totalRequired}):</strong></p>
        <ul>
          {matchedSkills.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p><strong>Details:</strong></p>
        <ul>
          {skillDetails.map((d) => (
            <li key={d.skill}>{d.skill} - {d.level}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
