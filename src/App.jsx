import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { OPENINGS, POSITIONS } from './data/openings.js';
import { parseFEN } from './data/chess.js';
import { audio } from './audio/AudioManager.js';
import { fsrs } from './learning/fsrs.js';
import { progressDB } from './learning/db.js';
import {
  PaperTexture, ChessBoard, GameNav, StatsBar, PromptBar,
  HintBar, Feedback, Explanation, StartScreen, GameOverScreen,
  ProgressDashboard, PortraitWarning
} from './components/ui.jsx';

// Fisher-Yates shuffle — unbiased random permutation
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================================================
// MAIN APP
// ============================================================================
export default function App() {
  const [screen, setScreen] = useState('menu');
  const [isTimed, setIsTimed] = useState(false);
  const [isFSRS, setIsFSRS] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState('all');
  const [dbReady, setDbReady] = useState(false);
  const [dueCount, setDueCount] = useState(0);

  const [position, setPosition] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round, setRound] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const [feedback, setFeedback] = useState({ type: null, visible: false });
  const [explanation, setExplanation] = useState({ visible: false, text: '', name: '', san: '', moveNotation: '' });
  const [showMove, setShowMove] = useState(null);

  const [hintLevel, setHintLevel] = useState(0);
  const [hintPiece, setHintPiece] = useState(null);
  const [hintSquare, setHintSquare] = useState(null);

  const [timeLeft, setTimeLeft] = useState(25);
  const maxTime = 25;

  const timerRef = useRef(null);
  const hint1Ref = useRef(null);
  const hint2Ref = useRef(null);
  const queueRef = useRef([]);
  const sceneRef = useRef(null);
  const currentCardRef = useRef(null);
  const sessionRef = useRef({ correct: 0, wrong: 0 });
  const roundsToPlay = 10;

  const currentPositions = useMemo(() => {
    if (selectedOpening === 'all') return POSITIONS;
    return OPENINGS[selectedOpening]?.positions || POSITIONS;
  }, [selectedOpening]);

  // Initialize IndexedDB
  useEffect(() => {
    progressDB.init().then(async () => {
      setDbReady(true);
      const stats = await progressDB.getStats();
      setHighScore(stats.highScore || 0);
      const due = await progressDB.getDueCards();
      setDueCount(due.length);
    }).catch(e => {
      console.error('IndexedDB init failed:', e);
      try {
        const saved = localStorage.getItem('chess-trainer-high');
        if (saved) setHighScore(parseInt(saved) || 0);
      } catch (e) {}
    });
  }, []);

  const nextPosition = useCallback(() => {
    if (queueRef.current.length === 0) {
      queueRef.current = shuffle(currentPositions);
    }
    return queueRef.current.shift();
  }, [currentPositions]);

  const loadPosition = useCallback((pos) => {
    setPosition(pos);
    setPieces(parseFEN(pos.fen));
    setSelected(null);
    setValidMoves([]);
    setHintLevel(0);
    setHintPiece(null);
    setHintSquare(null);
    setShowMove(null);
    setTimeLeft(maxTime);
    sceneRef.current?.clearHints();
    sceneRef.current?.clearCorrectMove();
  }, []);

  const startGame = useCallback(async (timed, fsrsMode = false) => {
    await audio.init();
    audio.startMusic();
    setIsTimed(timed);
    setIsFSRS(fsrsMode);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setRound(0);
    sessionRef.current = { correct: 0, wrong: 0 };

    if (fsrsMode && dbReady) {
      const dueCards = await progressDB.getDueCards();
      if (dueCards.length === 0) {
        queueRef.current = shuffle(currentPositions);
      } else {
        const duePositions = dueCards
          .map(card => currentPositions.find(p => p.id === card.id))
          .filter(Boolean);
        queueRef.current = duePositions.length > 0
          ? shuffle(duePositions)
          : shuffle(currentPositions);
      }
    } else {
      queueRef.current = shuffle(currentPositions);
    }

    const firstPos = nextPosition();
    if (firstPos) {
      loadPosition(firstPos);
      if (fsrsMode && dbReady) {
        const card = await progressDB.getCard(firstPos.id);
        currentCardRef.current = card || { id: firstPos.id, state: 'new', stability: 0, difficulty: 0, reps: 0, opening: firstPos.opening };
      }
    }
    setScreen('playing');
  }, [nextPosition, loadPosition, currentPositions, dbReady]);

  const endGame = useCallback(async () => {
    audio.stopMusic();
    clearInterval(timerRef.current);
    clearTimeout(hint1Ref.current);
    clearTimeout(hint2Ref.current);

    if (isTimed && score > highScore) {
      setHighScore(score);
      if (dbReady) {
        const stats = await progressDB.getStats();
        await progressDB.saveStats({ ...stats, highScore: score });
      } else {
        try { localStorage.setItem('chess-trainer-high', String(score)); } catch (e) {}
      }
    }

    // Save session data
    if (dbReady) {
      const session = sessionRef.current;
      await progressDB.saveSession({
        mode: isFSRS ? 'fsrs' : isTimed ? 'timed' : 'learn',
        opening: selectedOpening,
        rounds: round,
        correct: session.correct,
        wrong: session.wrong,
        score: isTimed ? score : undefined,
        bestStreak: bestStreak
      });

      // Update global stats
      const stats = await progressDB.getStats();
      await progressDB.saveStats({
        ...stats,
        totalCorrect: (stats.totalCorrect || 0) + session.correct,
        totalWrong: (stats.totalWrong || 0) + session.wrong,
        totalSessions: (stats.totalSessions || 0) + 1,
        streakRecord: Math.max(stats.streakRecord || 0, bestStreak)
      });

      const due = await progressDB.getDueCards();
      setDueCount(due.length);
    }

    setScreen('gameover');
  }, [isTimed, isFSRS, score, highScore, dbReady, round, bestStreak, selectedOpening]);

  const handleGoHome = useCallback(() => {
    if (round > 0) {
      if (!window.confirm('Leave this session and return to the menu?')) return;
    }
    audio.stopMusic();
    clearInterval(timerRef.current);
    clearTimeout(hint1Ref.current);
    clearTimeout(hint2Ref.current);
    setScreen('menu');
  }, [round]);

  const advanceToNext = useCallback(async () => {
    setExplanation({ visible: false, text: '', name: '', san: '', moveNotation: '' });
    setShowMove(null);

    const nextRound = round + 1;
    setRound(nextRound);

    if (isTimed && nextRound >= roundsToPlay) {
      endGame();
      return;
    }

    const next = nextPosition();
    if (next) {
      loadPosition(next);
      if (isFSRS && dbReady) {
        const card = await progressDB.getCard(next.id);
        currentCardRef.current = card || { id: next.id, state: 'new', stability: 0, difficulty: 0, reps: 0, opening: next.opening };
      }
    } else {
      endGame();
    }
  }, [round, isTimed, isFSRS, nextPosition, loadPosition, endGame, dbReady]);

  const handleFSRSGrade = useCallback(async (grade) => {
    if (!dbReady || !currentCardRef.current) {
      advanceToNext();
      return;
    }

    const updatedCard = fsrs.review(currentCardRef.current, grade);
    updatedCard.opening = position?.opening;
    await progressDB.saveCard(updatedCard);
    advanceToNext();
  }, [dbReady, advanceToNext, position]);

  const recordReview = useCallback(async (correct) => {
    if (!dbReady || !position) return;
    try {
      await progressDB.saveReview({
        positionId: position.id,
        opening: position.opening,
        san: position.san,
        correct
      });
    } catch (e) {}
  }, [dbReady, position]);

  const handleCorrect = useCallback(() => {
    clearInterval(timerRef.current);
    clearTimeout(hint1Ref.current);
    clearTimeout(hint2Ref.current);
    audio.correct();
    audio.inkSplash();

    sessionRef.current.correct++;
    recordReview(true);

    // Trigger ink splash at the moved piece location
    if (position?.correct?.[0]) {
      const move = position.correct[0];
      sceneRef.current?.triggerInkSplash(move.to[0], move.to[1]);
    }

    if (isTimed) {
      const pts = 100 + Math.floor(timeLeft * 4) + streak * 12 - hintLevel * 25;
      setScore(s => s + Math.max(pts, 10));
    }

    setStreak(s => {
      const newStreak = s + 1;
      if (newStreak > bestStreak) setBestStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) audio.streak();
      return newStreak;
    });

    setHintPiece(null);
    setHintSquare(null);
    sceneRef.current?.clearHints();

    const correctMove = position.correct[0];
    setShowMove({ from: correctMove.from, to: correctMove.to });

    setFeedback({ type: 'correct', visible: true });

    setTimeout(() => {
      setFeedback({ type: null, visible: false });
      setExplanation({
        visible: true,
        text: position.explanation,
        name: position.opening,
        san: position.san,
        moveNotation: position.moveNotation
      });
    }, 450);
  }, [isTimed, timeLeft, streak, bestStreak, hintLevel, position, recordReview]);

  const handleWrong = useCallback(() => {
    clearInterval(timerRef.current);
    clearTimeout(hint1Ref.current);
    clearTimeout(hint2Ref.current);
    audio.wrong();
    setStreak(0);

    sessionRef.current.wrong++;
    recordReview(false);

    setHintPiece(null);
    setHintSquare(null);
    sceneRef.current?.clearHints();
    sceneRef.current?.triggerCameraShake();

    const correctMove = position.correct[0];
    setShowMove({ from: correctMove.from, to: correctMove.to });

    setFeedback({ type: 'wrong', visible: true });

    setTimeout(() => {
      setFeedback({ type: null, visible: false });
      setExplanation({
        visible: true,
        text: position.explanation,
        name: position.opening,
        san: position.san,
        moveNotation: position.moveNotation
      });
    }, 450);

    if (!isFSRS && position) queueRef.current.push(position);
  }, [position, isFSRS, recordReview]);

  const handleSquareClick = useCallback((file, rank, type) => {
    if (screen !== 'playing' || !position || explanation.visible) return;

    if (!selected) {
      const piece = pieces.find(p => p.file === file && p.rank === rank);
      if (piece && piece.color === 'black') {
        audio.pickup();
        const valid = position.correct.filter(m => m.from[0] === file && m.from[1] === rank).map(m => m.to);
        setSelected([file, rank]);
        setValidMoves(valid);
      }
      return;
    }

    if (selected[0] === file && selected[1] === rank) {
      audio.click();
      setSelected(null);
      setValidMoves([]);
      return;
    }

    const isValid = validMoves.some(m => m[0] === file && m[1] === rank);
    if (isValid) {
      audio.place();
      const isCorrect = position.correct.some(m =>
        m.from[0] === selected[0] && m.from[1] === selected[1] &&
        m.to[0] === file && m.to[1] === rank
      );
      sceneRef.current?.animateMove(selected[0], selected[1], file, rank, () => {
        if (isCorrect) handleCorrect();
        else handleWrong();
      });
    } else {
      handleWrong();
    }

    setSelected(null);
    setValidMoves([]);
  }, [screen, position, explanation.visible, pieces, selected, validMoves, handleCorrect, handleWrong]);

  // Timer and hints
  useEffect(() => {
    if (screen !== 'playing' || !position || explanation.visible) return;

    if (isTimed) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          const next = Math.max(t - 0.1, 0);
          if (next <= 0) {
            clearInterval(timerRef.current);
            handleWrong();
            return 0;
          }
          return next;
        });
      }, 100);
    }

    const hint1Delay = isTimed ? 8000 : 4000;
    const hint2Delay = isTimed ? 14000 : 8000;

    hint1Ref.current = setTimeout(() => {
      setHintLevel(1);
      setHintPiece(position.hintPiece);
      audio.hint();
    }, hint1Delay);

    hint2Ref.current = setTimeout(() => {
      setHintLevel(2);
      setHintSquare(position.hintSquare);
      audio.hint();
    }, hint2Delay);

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(hint1Ref.current);
      clearTimeout(hint2Ref.current);
    };
  }, [screen, position, explanation.visible, isTimed, handleWrong]);

  return (
    <div className="w-full h-screen bg-neutral-900 relative overflow-hidden">
      <PortraitWarning />
      <PaperTexture />

      <ChessBoard
        pieces={pieces}
        selected={selected}
        validMoves={validMoves}
        hintPiece={hintPiece}
        hintSquare={hintSquare}
        showMove={showMove}
        onSquareClick={handleSquareClick}
        sceneRef={sceneRef}
      />

      {screen === 'playing' && (
        <>
          <GameNav
            mode={isFSRS ? 'Review' : isTimed ? 'Challenge' : 'Learn'}
            openingName={position?.opening || (selectedOpening !== 'all' ? OPENINGS[selectedOpening]?.name : null)}
            onHome={handleGoHome}
          />
          <StatsBar score={score} streak={streak} round={round + 1} isTimed={isTimed} isFSRS={isFSRS} sceneRef={sceneRef} />
          {position && !explanation.visible && (
            <PromptBar
              prompt={position.prompt}
              shortTip={hintLevel === 0 ? position.shortTip : null}
              timeLeft={timeLeft}
              maxTime={maxTime}
              isTimed={isTimed}
              hintLevel={hintLevel}
              selected={selected}
              validMoves={validMoves}
            />
          )}
          <Feedback type={feedback.type} visible={feedback.visible} />
          <Explanation
            text={explanation.text}
            name={explanation.name}
            san={explanation.san}
            moveNotation={explanation.moveNotation}
            visible={explanation.visible}
            onClose={isFSRS ? null : advanceToNext}
            isFSRS={isFSRS}
            onFSRSGrade={handleFSRSGrade}
          />
        </>
      )}

      {screen === 'menu' && (
        <StartScreen
          onStartTimed={() => startGame(true)}
          onStartUntimed={() => startGame(false)}
          onStartFSRS={() => startGame(false, true)}
          onSelectOpening={setSelectedOpening}
          selectedOpening={selectedOpening}
          highScore={highScore}
          dueCount={dueCount}
          openingsData={OPENINGS}
          onShowProgress={() => setScreen('progress')}
        />
      )}

      {screen === 'progress' && (
        <ProgressDashboard
          onBack={() => setScreen('menu')}
          openingsData={OPENINGS}
          dbReady={dbReady}
          progressDB={progressDB}
        />
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          score={score}
          rounds={round}
          highScore={highScore}
          bestStreak={bestStreak}
          isNewHigh={score >= highScore && score > 0}
          isTimed={isTimed}
          isFSRS={isFSRS}
          opening={selectedOpening}
          onRestart={() => startGame(isTimed, isFSRS)}
          onMenu={() => setScreen('menu')}
        />
      )}
    </div>
  );
}
