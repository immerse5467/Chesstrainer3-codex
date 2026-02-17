// ============================================================================
// FSRS-5 SPACED REPETITION ALGORITHM
// Based on the latest Anki scheduler - Free Spaced Repetition Scheduler
// ============================================================================
const FSRS_DEFAULTS = {
  w: [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61],
  requestRetention: 0.9,
  maximumInterval: 36500,
  easyBonus: 1.3,
  hardInterval: 1.2
};

export class FSRS {
  constructor(params = FSRS_DEFAULTS) {
    this.w = params.w;
    this.requestRetention = params.requestRetention;
    this.maximumInterval = params.maximumInterval;
  }

  initStability(grade) {
    return Math.max(this.w[grade - 1], 0.1);
  }

  initDifficulty(grade) {
    return Math.min(Math.max(this.w[4] - (grade - 3) * this.w[5], 1), 10);
  }

  nextDifficulty(d, grade) {
    const newD = d - this.w[6] * (grade - 3);
    return Math.min(Math.max(this.meanReversion(this.w[4], newD), 1), 10);
  }

  meanReversion(init, current) {
    return this.w[7] * init + (1 - this.w[7]) * current;
  }

  nextStability(d, s, r, grade) {
    const hardPenalty = grade === 2 ? this.w[15] : 1;
    const easyBonus = grade === 4 ? this.w[16] : 1;
    return s * (1 + Math.exp(this.w[8]) *
           (11 - d) *
           Math.pow(s, -this.w[9]) *
           (Math.exp((1 - r) * this.w[10]) - 1) *
           hardPenalty * easyBonus);
  }

  nextForgetStability(d, s, r) {
    return this.w[11] *
           Math.pow(d, -this.w[12]) *
           (Math.pow(s + 1, this.w[13]) - 1) *
           Math.exp((1 - r) * this.w[14]);
  }

  retrievability(elapsedDays, stability) {
    return Math.pow(1 + elapsedDays / (9 * stability), -1);
  }

  nextInterval(stability) {
    const interval = 9 * stability * (1 / this.requestRetention - 1);
    return Math.min(Math.max(Math.round(interval), 1), this.maximumInterval);
  }

  review(card, grade, now = Date.now()) {
    const elapsedDays = card.lastReview ? (now - card.lastReview) / (1000 * 60 * 60 * 24) : 0;
    let newCard = { ...card };

    if (card.state === 'new') {
      newCard.stability = this.initStability(grade);
      newCard.difficulty = this.initDifficulty(grade);
      newCard.state = grade === 1 ? 'learning' : 'review';
    } else {
      const r = this.retrievability(elapsedDays, card.stability);
      if (grade === 1) {
        newCard.stability = this.nextForgetStability(card.difficulty, card.stability, r);
        newCard.difficulty = this.nextDifficulty(card.difficulty, grade);
        newCard.lapses = (card.lapses || 0) + 1;
        newCard.state = 'relearning';
      } else {
        newCard.stability = this.nextStability(card.difficulty, card.stability, r, grade);
        newCard.difficulty = this.nextDifficulty(card.difficulty, grade);
        newCard.state = 'review';
      }
    }

    newCard.interval = this.nextInterval(newCard.stability);
    newCard.due = now + newCard.interval * 24 * 60 * 60 * 1000;
    newCard.lastReview = now;
    newCard.reps = (card.reps || 0) + 1;
    return newCard;
  }
}

export const fsrs = new FSRS();
