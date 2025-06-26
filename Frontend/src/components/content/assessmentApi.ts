// Mock API functions for assessment validation
export interface ValidationResult {
  isCorrect: boolean;
  correctAnswer?: string | string[];
  explanation?: string;
  score?: number;
}

export interface AssessmentResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  results: Record<string, ValidationResult>;
  timeSpent: number;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock correct answers database
const mockAnswers: Record<string, any> = {
  'q1': 'Paris',
  'q2': 'Blue',
  'q3': ['HTML', 'CSS', 'JavaScript'],
  'q4': 'React is a JavaScript library',
  'cyber1': 'Port scanning',
  'cyber2': ['Firewall', 'Encryption', 'Authentication'],
  'cyber3': 'SQL injection is a code injection technique'
};

// Mock explanations database
const mockExplanations: Record<string, string> = {
  'q1': 'Paris is the capital and largest city of France.',
  'q2': 'The sky appears blue due to Rayleigh scattering of light.',
  'q3': 'HTML, CSS, and JavaScript are the fundamental technologies for web development.',
  'q4': 'React is a popular JavaScript library for building user interfaces.',
  'cyber1': 'Port scanning is a reconnaissance technique used to discover open ports.',
  'cyber2': 'Firewalls, encryption, and authentication are key cybersecurity measures.',
  'cyber3': 'SQL injection attacks exploit vulnerabilities in database queries.'
};

export const validateAnswer = async (
  questionId: string, 
  answer: string | string[]
): Promise<ValidationResult> => {
  // Simulate API call delay
  await delay(800 + Math.random() * 400);
  
  const correctAnswer = mockAnswers[questionId];
  const explanation = mockExplanations[questionId];
  
  let isCorrect = false;
  
  if (Array.isArray(correctAnswer) && Array.isArray(answer)) {
    // For multiple select questions
    isCorrect = correctAnswer.length === answer.length && 
                correctAnswer.every(item => answer.includes(item));
  } else {
    // For single answer questions
    isCorrect = correctAnswer === answer;
  }
  
  return {
    isCorrect,
    correctAnswer,
    explanation,
    score: isCorrect ? 1 : 0
  };
};

export const submitAssessment = async (
  answers: Record<string, string | string[]>,
  startTime: number
): Promise<AssessmentResult> => {
  // Simulate API call delay
  await delay(1000 + Math.random() * 500);
  
  const results: Record<string, ValidationResult> = {};
  let totalScore = 0;
  
  // Validate all answers
  for (const [questionId, answer] of Object.entries(answers)) {
    const validation = await validateAnswer(questionId, answer);
    results[questionId] = validation;
    totalScore += validation.score || 0;
  }
  
  const totalQuestions = Object.keys(answers).length;
  const percentage = Math.round((totalScore / totalQuestions) * 100);
  const timeSpent = Date.now() - startTime;
  
  return {
    score: totalScore,
    totalQuestions,
    percentage,
    results,
    timeSpent
  };
};

export const getLeaderboard = async (): Promise<any[]> => {
  await delay(600);
  
  return [
    { name: 'Alice Johnson', score: 95, time: '2:34' },
    { name: 'Bob Smith', score: 88, time: '3:12' },
    { name: 'Carol Davis', score: 92, time: '2:45' },
    { name: 'David Wilson', score: 85, time: '3:28' },
    { name: 'Eva Brown', score: 90, time: '2:58' }
  ];
};