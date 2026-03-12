export const silenceRankDummyData = {
  jobDescriptions: [
    { id: 'jd-frontend', title: 'Frontend Developer - React' },
    { id: 'jd-data', title: 'Data Analyst - Python/SQL' }
  ],
  applications: [
    { id: 'app-101' },
    { id: 'app-102' },
    { id: 'app-103' }
  ],
  candidates: [
    { id: 'cand-1', name: 'Candidate 1' },
    { id: 'cand-2', name: 'Candidate 2' },
    { id: 'cand-3', name: 'Candidate 3' }
  ],
  resultsByJobDescription: {
    'jd-frontend': [
      {
        blind_id: 'MM-001',
        skill_similarity: 0.92,
        silence_rank: 1,
        language_rank: 2,
        lir_score: 0.03,
        silence_skills: ['React', 'TypeScript', 'REST APIs', 'Testing'],
        language_skills: ['React', 'TypeScript', 'REST APIs', 'Testing', 'Excellent communication'],
        shift_reason: 'Minor rank shift due to communication-heavy language in resume text.'
      },
      {
        blind_id: 'MM-002',
        skill_similarity: 0.86,
        silence_rank: 2,
        language_rank: 1,
        lir_score: 0.17,
        silence_skills: ['JavaScript', 'React', 'CSS', 'Unit Tests'],
        language_skills: ['JavaScript', 'React', 'CSS', 'Leadership', 'Team mentorship'],
        shift_reason: 'Promotion in language ranking linked to leadership and mentorship cues.'
      },
      {
        blind_id: 'MM-003',
        skill_similarity: 0.78,
        silence_rank: 3,
        language_rank: 3,
        lir_score: 0.01,
        silence_skills: ['HTML', 'CSS', 'React Hooks'],
        language_skills: ['HTML', 'CSS', 'React Hooks'],
        shift_reason: 'No meaningful shift between stripped and full-language evaluation.'
      }
    ],
    'jd-data': [
      {
        blind_id: 'MM-101',
        skill_similarity: 0.9,
        silence_rank: 1,
        language_rank: 1,
        lir_score: 0.02,
        silence_skills: ['Python', 'SQL', 'Tableau', 'A/B Testing'],
        language_skills: ['Python', 'SQL', 'Tableau', 'A/B Testing'],
        shift_reason: 'Stable ranking across both evaluation modes.'
      },
      {
        blind_id: 'MM-102',
        skill_similarity: 0.82,
        silence_rank: 2,
        language_rank: 3,
        lir_score: 0.14,
        silence_skills: ['Python', 'Power BI', 'Forecasting'],
        language_skills: ['Python', 'Power BI', 'Forecasting', 'Narrative storytelling'],
        shift_reason: 'Language-only strengths create moderate ranking movement.'
      },
      {
        blind_id: 'MM-103',
        skill_similarity: 0.75,
        silence_rank: 3,
        language_rank: 2,
        lir_score: 0.19,
        silence_skills: ['Excel', 'SQL', 'Dashboards'],
        language_skills: ['Excel', 'SQL', 'Dashboards', 'Executive communication'],
        shift_reason: 'Language rank uplift from executive-facing communication phrasing.'
      }
    ]
  }
};
