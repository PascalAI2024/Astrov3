export interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'solar-system' | 'stars' | 'galaxies' | 'space-exploration' | 'quantum';
  points: number;
}

export const quizLevels = {
  beginner: {
    name: "Space Cadet",
    icon: "🚀",
    requiredScore: 0,
    description: "Start your cosmic journey here",
    questionCount: 5,
    timeLimit: 30,
    pointMultiplier: 1
  },
  intermediate: {
    name: "Star Navigator",
    icon: "⭐",
    requiredScore: 1000,
    description: "For those who know their way around the cosmos",
    questionCount: 7,
    timeLimit: 25,
    pointMultiplier: 1.5
  },
  advanced: {
    name: "Nebula Master",
    icon: "🌌",
    requiredScore: 5000,
    description: "Deep space knowledge required",
    questionCount: 10,
    timeLimit: 20,
    pointMultiplier: 2
  },
  expert: {
    name: "Cosmic Sage",
    icon: "🔮",
    requiredScore: 10000,
    description: "Only for true astronomy experts",
    questionCount: 12,
    timeLimit: 15,
    pointMultiplier: 3
  }
};

export const questions: QuizQuestion[] = [
  {
    id: 'b1',
    question: "What is the closest star to Earth?",
    answers: ["Proxima Centauri", "Alpha Centauri", "The Sun", "Sirius"],
    correctAnswer: 2,
    explanation: "The Sun is our closest star, at about 93 million miles away!",
    difficulty: 'beginner',
    category: 'solar-system',
    points: 100
  },
  {
    id: 'b2',
    question: "How many planets are in our solar system?",
    answers: ["7", "8", "9", "10"],
    correctAnswer: 1,
    explanation: "Since 2006, we officially have 8 planets (Pluto was reclassified as a dwarf planet).",
    difficulty: 'beginner',
    category: 'solar-system',
    points: 100
  },
  // Add more questions for each difficulty level...
];

export function getQuestionsByLevel(level: keyof typeof quizLevels): QuizQuestion[] {
  return questions.filter(q => q.difficulty === level)
    .sort(() => Math.random() - 0.5)
    .slice(0, quizLevels[level].questionCount);
}

export function calculateScore(question: QuizQuestion, timeRemaining: number, streak: number): number {
  const level = quizLevels[question.difficulty];
  const basePoints = question.points;
  const timeBonus = Math.floor((timeRemaining / level.timeLimit) * 50);
  const streakBonus = Math.floor(streak * 10);
  
  return Math.floor((basePoints + timeBonus + streakBonus) * level.pointMultiplier);
}

export function getNextLevel(currentScore: number): keyof typeof quizLevels | null {
  const levels = Object.entries(quizLevels);
  for (let i = levels.length - 1; i >= 0; i--) {
    if (currentScore >= levels[i][1].requiredScore) {
      return i < levels.length - 1 ? levels[i + 1][0] as keyof typeof quizLevels : null;
    }
  }
  return 'beginner';
}