export const emotionBlindDummyData = {
  jobDescriptions: [
    { id: 'eb-jd-frontend', title: 'Frontend Engineer', company: 'Merit Mind Labs' },
    { id: 'eb-jd-backend', title: 'Backend Engineer', company: 'Merit Mind Labs' }
  ],
  candidates: [
    { id: 'eb-c1', blind_id: 'EB-001' },
    { id: 'eb-c2', blind_id: 'EB-002' },
    { id: 'eb-c3', blind_id: 'EB-003' }
  ],
  transcripts: {
    'eb-c1': 'I built React dashboards, improved Lighthouse score by 28 percent, and collaborated across design and product teams.',
    'eb-c2': 'I am very excited and super passionate. I can definitely do this and I really hope to join your amazing company.',
    'eb-c3': 'I designed API caching and query optimization, reducing response times from 420ms to 140ms under production load.'
  },
  analysisResultsByJD: {
    'eb-jd-frontend': [
      {
        blind_id: 'EB-001',
        emotional_score: 0.58,
        semantic_score: 0.83,
        gap_score: 0.25,
        bias_flagged: true,
        transcript: 'I built React dashboards, improved Lighthouse score by 28 percent, and collaborated across design and product teams.'
      },
      {
        blind_id: 'EB-002',
        emotional_score: 0.87,
        semantic_score: 0.62,
        gap_score: 0.25,
        bias_flagged: true,
        transcript: 'I am very excited and super passionate. I can definitely do this and I really hope to join your amazing company.'
      },
      {
        blind_id: 'EB-003',
        emotional_score: 0.41,
        semantic_score: 0.78,
        gap_score: 0.37,
        bias_flagged: true,
        transcript: 'I designed API caching and query optimization, reducing response times from 420ms to 140ms under production load.'
      }
    ],
    'eb-jd-backend': [
      {
        blind_id: 'EB-001',
        emotional_score: 0.49,
        semantic_score: 0.8,
        gap_score: 0.31,
        bias_flagged: true,
        transcript: 'I built React dashboards, improved Lighthouse score by 28 percent, and collaborated across design and product teams.'
      },
      {
        blind_id: 'EB-002',
        emotional_score: 0.79,
        semantic_score: 0.55,
        gap_score: 0.24,
        bias_flagged: true,
        transcript: 'I am very excited and super passionate. I can definitely do this and I really hope to join your amazing company.'
      },
      {
        blind_id: 'EB-003',
        emotional_score: 0.44,
        semantic_score: 0.88,
        gap_score: 0.44,
        bias_flagged: true,
        transcript: 'I designed API caching and query optimization, reducing response times from 420ms to 140ms under production load.'
      }
    ]
  }
};
