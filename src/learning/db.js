// ============================================================================
// INDEXEDDB PERSISTENCE — with session tracking, export/import, analytics
// ============================================================================
class ProgressDB {
  constructor() {
    this.dbName = 'ChessTrainerDB';
    this.dbVersion = 2;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('cards')) {
          const cardStore = db.createObjectStore('cards', { keyPath: 'id' });
          cardStore.createIndex('due', 'due', { unique: false });
          cardStore.createIndex('state', 'state', { unique: false });
          cardStore.createIndex('opening', 'opening', { unique: false });
        }
        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true });
          sessionStore.createIndex('date', 'date', { unique: false });
          sessionStore.createIndex('opening', 'opening', { unique: false });
        }
        // v2: add reviews store for per-position tracking
        if (!db.objectStoreNames.contains('reviews')) {
          const reviewStore = db.createObjectStore('reviews', { keyPath: 'id', autoIncrement: true });
          reviewStore.createIndex('positionId', 'positionId', { unique: false });
          reviewStore.createIndex('date', 'date', { unique: false });
          reviewStore.createIndex('opening', 'opening', { unique: false });
        }
      };
    });
  }

  // ---- CARDS ----
  async getCard(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readonly');
      const store = transaction.objectStore('cards');
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveCard(card) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readwrite');
      const store = transaction.objectStore('cards');
      const request = store.put(card);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCards() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['cards'], 'readonly');
      const store = transaction.objectStore('cards');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getDueCards(now = Date.now()) {
    const allCards = await this.getAllCards();
    return allCards.filter(card => !card.due || card.due <= now);
  }

  // ---- STATS ----
  async getStats() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['stats'], 'readonly');
      const store = transaction.objectStore('stats');
      const request = store.get('main');
      request.onsuccess = () => resolve(request.result || {
        id: 'main', highScore: 0, totalReviews: 0, streakRecord: 0,
        totalCorrect: 0, totalWrong: 0, totalSessions: 0
      });
      request.onerror = () => reject(request.error);
    });
  }

  async saveStats(stats) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['stats'], 'readwrite');
      const store = transaction.objectStore('stats');
      const request = store.put({ ...stats, id: 'main' });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ---- SESSIONS ----
  async saveSession(session) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readwrite');
      const store = transaction.objectStore('sessions');
      const request = store.add({ ...session, date: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllSessions() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // ---- REVIEWS (per-position tracking) ----
  async saveReview(review) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['reviews'], 'readwrite');
      const store = transaction.objectStore('reviews');
      const request = store.add({ ...review, date: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAllReviews() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['reviews'], 'readonly');
      const store = transaction.objectStore('reviews');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // ---- ANALYTICS ----
  async getOpeningStats() {
    const reviews = await this.getAllReviews();
    const cards = await this.getAllCards();
    const stats = {};

    reviews.forEach(r => {
      const key = r.opening || 'unknown';
      if (!stats[key]) stats[key] = { correct: 0, wrong: 0, total: 0, positions: new Set() };
      stats[key].total++;
      if (r.correct) stats[key].correct++;
      else stats[key].wrong++;
      stats[key].positions.add(r.positionId);
    });

    // Convert sets to counts
    Object.keys(stats).forEach(k => {
      stats[k].positionCount = stats[k].positions.size;
      delete stats[k].positions;
      stats[k].accuracy = stats[k].total > 0 ? Math.round((stats[k].correct / stats[k].total) * 100) : 0;
    });

    // Add FSRS mastery info from cards
    const cardsByOpening = {};
    cards.forEach(c => {
      const key = c.opening || 'unknown';
      if (!cardsByOpening[key]) cardsByOpening[key] = [];
      cardsByOpening[key].push(c);
    });

    Object.keys(cardsByOpening).forEach(k => {
      if (!stats[k]) stats[k] = { correct: 0, wrong: 0, total: 0, positionCount: 0, accuracy: 0 };
      const openingCards = cardsByOpening[k];
      const masteredCount = openingCards.filter(c => c.stability > 5 && c.state === 'review').length;
      stats[k].totalCards = openingCards.length;
      stats[k].masteredCards = masteredCount;
      stats[k].avgStability = openingCards.reduce((sum, c) => sum + (c.stability || 0), 0) / openingCards.length;
    });

    return stats;
  }

  async getWeakSpots(limit = 8) {
    const reviews = await this.getAllReviews();
    const posStats = {};

    reviews.forEach(r => {
      if (!posStats[r.positionId]) posStats[r.positionId] = { correct: 0, wrong: 0, total: 0, opening: r.opening, san: r.san };
      posStats[r.positionId].total++;
      if (r.correct) posStats[r.positionId].correct++;
      else posStats[r.positionId].wrong++;
    });

    return Object.entries(posStats)
      .filter(([_, s]) => s.total >= 2)
      .map(([id, s]) => ({ id, ...s, accuracy: Math.round((s.correct / s.total) * 100) }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, limit);
  }

  async getSessionHistory(limit = 30) {
    const sessions = await this.getAllSessions();
    return sessions
      .sort((a, b) => (b.date || 0) - (a.date || 0))
      .slice(0, limit);
  }

  // ---- DATA EXPORT / IMPORT ----
  async exportData() {
    const [cards, stats, sessions, reviews] = await Promise.all([
      this.getAllCards(),
      this.getStats(),
      this.getAllSessions(),
      this.getAllReviews()
    ]);
    return JSON.stringify({ version: 2, exportDate: new Date().toISOString(), cards, stats, sessions, reviews }, null, 2);
  }

  async importData(jsonString) {
    const data = JSON.parse(jsonString);
    if (!data.cards) throw new Error('Invalid backup file: no cards data found');

    // Import cards
    if (data.cards?.length) {
      const tx = this.db.transaction(['cards'], 'readwrite');
      const store = tx.objectStore('cards');
      for (const card of data.cards) await new Promise((res, rej) => {
        const r = store.put(card); r.onsuccess = res; r.onerror = rej;
      });
    }

    // Import stats
    if (data.stats) {
      const tx = this.db.transaction(['stats'], 'readwrite');
      const store = tx.objectStore('stats');
      await new Promise((res, rej) => {
        const r = store.put({ ...data.stats, id: 'main' }); r.onsuccess = res; r.onerror = rej;
      });
    }

    // Import sessions
    if (data.sessions?.length) {
      const tx = this.db.transaction(['sessions'], 'readwrite');
      const store = tx.objectStore('sessions');
      for (const session of data.sessions) {
        const clean = { ...session };
        delete clean.id; // let autoIncrement assign new IDs
        await new Promise((res, rej) => {
          const r = store.add(clean); r.onsuccess = res; r.onerror = rej;
        });
      }
    }

    // Import reviews
    if (data.reviews?.length) {
      const tx = this.db.transaction(['reviews'], 'readwrite');
      const store = tx.objectStore('reviews');
      for (const review of data.reviews) {
        const clean = { ...review };
        delete clean.id;
        await new Promise((res, rej) => {
          const r = store.add(clean); r.onsuccess = res; r.onerror = rej;
        });
      }
    }
  }

  async clearAllData() {
    const stores = ['cards', 'stats', 'sessions', 'reviews'];
    for (const storeName of stores) {
      if (this.db.objectStoreNames.contains(storeName)) {
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction([storeName], 'readwrite');
          const store = tx.objectStore(storeName);
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      }
    }
  }
}

export const progressDB = new ProgressDB();
