import type { QuizQuestion } from '../data/quiz-questions';
import { getRandomQuestions, calculatePoints } from '../data/quiz-questions';

export class QuizService {
  private questions: QuizQuestion[] = [];
  private currentQuestionIndex: number = 0;
  private score: number = 0;
  private streak: number = 0;
  private difficulty: QuizQuestion['difficulty'];

  constructor(difficulty: QuizQuestion['difficulty']) {
    this.difficulty = difficulty;
    this.questions = getRandomQuestions(difficulty);
  }

  getCurrentQuestion(): QuizQuestion | null {
    if (this.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.currentQuestionIndex];
  }

  submitAnswer(answerIndex: number, timeRemaining: number): {
    correct: boolean;
    points: number;
    explanation: string;
  } {
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) {
      throw new Error('No current question');
    }

    const correct = answerIndex === currentQuestion.correctAnswer;
    let points = 0;

    if (correct) {
      points = calculatePoints(this.difficulty, timeRemaining);
      this.score += points;
      this.streak++;
    } else {
      this.streak = 0;
    }

    return {
      correct,
      points,
      explanation: currentQuestion.explanation
    };
  }

  nextQuestion(): boolean {
    this.currentQuestionIndex++;
    return this.currentQuestionIndex < this.questions.length;
  }

  getProgress(): {
    current: number;
    total: number;
    score: number;
    streak: number;
  } {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questions.length,
      score: this.score,
      streak: this.streak
    };
  }
}