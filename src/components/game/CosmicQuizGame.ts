// Game logic implementation
interface GameConfig {
  ranks: Array<{
    name: string;
    minScore: number;
    icon: string;
  }>;
  powerups: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    cost: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

interface GameState {
  currentQuestion: number;
  score: number;
  streak: number;
  bestStreak: number;
  powerups: { [key: string]: number };
  achievements: string[];
  gameMode: string | null;
  timer: number | null;
}

export class CosmicQuizGame {
  private config: GameConfig;
  private state: GameState;
  private welcomeScreen: HTMLElement | null;
  private gameScreen: HTMLElement | null;
  private resultsScreen: HTMLElement | null;

  constructor(config: GameConfig) {
    this.config = config;
    this.state = {
      currentQuestion: 0,
      score: 0,
      streak: 0,
      bestStreak: 0,
      powerups: {},
      achievements: [],
      gameMode: null,
      timer: null
    };

    this.welcomeScreen = document.getElementById('welcome');
    this.gameScreen = document.getElementById('game');
    this.resultsScreen = document.getElementById('results');

    this.initialize();
  }

  private initialize(): void {
    this.loadPlayerData();
    this.setupEventListeners();
    this.showWelcomeScreen();
  }

  private loadPlayerData(): void {
    const savedData = localStorage.getItem('cosmicQuizData');
    if (savedData) {
      const data = JSON.parse(savedData);
      const playerStats = document.getElementById('player-stats');
      if (playerStats) {
        playerStats.classList.remove('hidden');
      }
      this.updatePlayerStats(data);
    }
  }

  private updatePlayerStats(data: any): void {
    const totalScore = document.getElementById('total-score');
    const bestStreak = document.getElementById('best-streak');
    const rankBadge = document.getElementById('player-rank');

    if (totalScore) totalScore.textContent = data.totalScore.toLocaleString();
    if (bestStreak) bestStreak.textContent = data.bestStreak.toString();
    if (rankBadge) {
      const rank = this.getRankForScore(data.totalScore);
      rankBadge.innerHTML = `
        <div class="flex items-center gap-2 px-4 py-2 bg-cosmic-900/50 rounded-full">
          <span class="text-2xl">${rank.icon}</span>
          <span class="text-white font-medium">${rank.name}</span>
        </div>
      `;
    }
  }

  private getRankForScore(score: number) {
    return this.config.ranks
      .slice()
      .reverse()
      .find(rank => score >= rank.minScore) || this.config.ranks[0];
  }

  private setupEventListeners(): void {
    document.querySelectorAll('.difficulty-select').forEach(button => {
      button.addEventListener('click', (e) => {
        const difficulty = (e.currentTarget as HTMLElement).dataset.difficulty;
        if (difficulty) {
          this.startGame(difficulty);
        }
      });
    });

    // Powerup event listeners
    document.addEventListener('powerup-used', (e: CustomEvent) => {
      this.handlePowerup(e.detail.powerupId);
    });
  }

  private showWelcomeScreen(): void {
    if (this.welcomeScreen && this.gameScreen && this.resultsScreen) {
      this.welcomeScreen.classList.remove('hidden');
      this.gameScreen.classList.add('hidden');
      this.resultsScreen.classList.add('hidden');
    }
  }

  private startGame(difficulty: string): void {
    this.state.gameMode = difficulty;
    if (this.welcomeScreen && this.gameScreen) {
      this.welcomeScreen.classList.add('hidden');
      this.gameScreen.classList.remove('hidden');
    }
    this.loadQuestion();
    this.startTimer();
  }

  private loadQuestion(): void {
    // Implementation for loading questions based on difficulty
    const questionElement = document.getElementById('question');
    const answersElement = document.getElementById('answers');
    
    if (questionElement && answersElement) {
      // Sample question for demonstration
      questionElement.textContent = "What is the closest star to Earth?";
      answersElement.innerHTML = `
        <button class="answer-button p-4 bg-gray-800 rounded-lg hover:bg-cosmic-600 transition-colors">
          Proxima Centauri
        </button>
        <button class="answer-button p-4 bg-gray-800 rounded-lg hover:bg-cosmic-600 transition-colors">
          Alpha Centauri
        </button>
        <button class="answer-button p-4 bg-gray-800 rounded-lg hover:bg-cosmic-600 transition-colors">
          The Sun
        </button>
        <button class="answer-button p-4 bg-gray-800 rounded-lg hover:bg-cosmic-600 transition-colors">
          Sirius
        </button>
      `;

      // Add click handlers to answers
      answersElement.querySelectorAll('.answer-button').forEach((button, index) => {
        button.addEventListener('click', () => this.handleAnswer(index));
      });
    }
  }

  private handleAnswer(answerIndex: number): void {
    // Implementation for handling answer selection
    const isCorrect = answerIndex === 2; // The Sun is correct
    this.updateScore(isCorrect ? 100 : 0);
    this.updateStreak(isCorrect);
    this.checkAchievements();
    
    if (this.state.currentQuestion < 10) {
      this.state.currentQuestion++;
      this.loadQuestion();
    } else {
      this.endGame();
    }
  }

  private updateScore(points: number): void {
    this.state.score += points;
    const scoreElement = document.getElementById('current-score');
    if (scoreElement) {
      scoreElement.textContent = this.state.score.toString();
    }
  }

  private updateStreak(isCorrect: boolean): void {
    if (isCorrect) {
      this.state.streak++;
      this.state.bestStreak = Math.max(this.state.bestStreak, this.state.streak);
    } else {
      this.state.streak = 0;
    }
    
    const streakElement = document.getElementById('current-streak');
    if (streakElement) {
      streakElement.textContent = this.state.streak.toString();
    }
  }

  private handlePowerup(powerupId: string): void {
    switch (powerupId) {
      case 'time-dilation':
        this.addTime(15);
        break;
      case 'quantum-hint':
        this.eliminateWrongAnswers();
        break;
      case 'cosmic-shield':
        this.activateShield();
        break;
    }
  }

  private addTime(seconds: number): void {
    // Implementation for adding time
  }

  private eliminateWrongAnswers(): void {
    // Implementation for eliminating wrong answers
  }

  private activateShield(): void {
    // Implementation for activating shield
  }

  private startTimer(): void {
    // Implementation for starting timer
  }

  private checkAchievements(): void {
    // Implementation for checking and awarding achievements
  }

  private endGame(): void {
    this.savePlayerData();
    this.showResults();
  }

  private savePlayerData(): void {
    const data = {
      totalScore: this.state.score,
      bestStreak: this.state.bestStreak,
      achievements: this.state.achievements,
      powerups: this.state.powerups
    };
    localStorage.setItem('cosmicQuizData', JSON.stringify(data));
  }

  private showResults(): void {
    if (this.gameScreen && this.resultsScreen) {
      this.gameScreen.classList.add('hidden');
      this.resultsScreen.classList.remove('hidden');
      
      const finalScore = document.getElementById('final-score');
      const finalStreak = document.getElementById('final-streak');
      
      if (finalScore) finalScore.textContent = this.state.score.toString();
      if (finalStreak) finalStreak.textContent = this.state.bestStreak.toString();
    }
  }
}