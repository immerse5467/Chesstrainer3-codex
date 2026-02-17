// ============================================================================
// COMPREHENSIVE CHESS OPENING DATABASE
// 80 positions across 19 opening families. Player is always Black.
// Coordinate system: file 0-7 = a-h, rank 0-7 = 1st-8th rank
// ============================================================================

export const OPENINGS = {
  // ==========================================================================
  // 1. THE SICILIAN DEFENCE
  // ==========================================================================
  sicilian: {
    name: "The Sicilian Defence",
    description: "Black's most ambitious response to 1.e4 — fighting for the centre asymmetrically.",
    positions: [
      {
        id: 'sicilian-1',
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White has pushed their pawn to e4. How should Black respond?",
        correct: [{ from: [2, 6], to: [2, 4] }],
        san: "1...c5",
        moveNotation: "c7 \u2192 c5",
        hintPiece: [2, 6],
        hintSquare: [2, 4],
        shortTip: "Push your c-pawn two squares forward!",
        explanation: "This is the Sicilian Defence \u2014 the most popular and successful response to 1.e4 at every level of chess. Bobby Fischer called it 'Best by test.'\n\nInstead of mirroring White with 1...e5, you strike at the d4 square from the flank. This asymmetry creates imbalanced positions where both sides have winning chances.\n\nThe Sicilian typically leads to sharp, tactical battles. Black accepts a slightly slower development in exchange for the half-open c-file and counterplay against White's centre.",
        opening: "The Sicilian Defence"
      },
      {
        id: 'sicilian-2',
        fen: "rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        prompt: "White has developed their knight to f3. What's your plan?",
        correct: [{ from: [3, 6], to: [3, 5] }, { from: [1, 7], to: [2, 5] }, { from: [4, 6], to: [4, 5] }],
        san: "2...d6",
        moveNotation: "d7 \u2192 d6",
        hintPiece: [3, 6],
        hintSquare: [3, 5],
        shortTip: "Support your c5 pawn with d6!",
        explanation: "The move 2...d6 is the gateway to the Open Sicilian \u2014 the main battleground of chess theory for over a century.\n\nThis modest pawn move does crucial work:\n\u2022 Supports the c5 pawn, preparing to meet d4 with ...cxd4\n\u2022 Opens a diagonal for your dark-squared bishop\n\u2022 Prepares ...Nf6 to pressure White's e4 pawn\n\nGarry Kasparov made the Sicilian his primary weapon, using it to become World Champion.",
        opening: "The Sicilian Defence"
      },
      {
        id: 'sicilian-3',
        fen: "rnbqkbnr/pp2pppp/3p4/2p5/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        prompt: "White has pushed d4, attacking your c5 pawn. What now?",
        correct: [{ from: [2, 4], to: [3, 3] }],
        san: "3...cxd4",
        moveNotation: "c5 captures d4",
        hintPiece: [2, 4],
        hintSquare: [3, 3],
        shortTip: "Capture! Take the d4 pawn with your c-pawn.",
        explanation: "This capture is the defining moment of the Open Sicilian. You're trading a 'wing pawn' for a 'central pawn' \u2014 generally a favourable exchange.\n\nAfter White recaptures with the knight, you'll have:\n\u2022 An open c-file \u2014 a highway for your rook to attack White's queenside\n\u2022 A central pawn majority (d6 + e7 vs White's e4)\n\u2022 Chances to undermine White's centre with ...e5 or ...d5 later",
        opening: "The Open Sicilian"
      },
      {
        id: 'sicilian-4',
        fen: "rnbqkbnr/pp2pppp/3p4/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
        prompt: "White recaptured with their knight. Time to develop!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "4...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Bring out your knight to f6 \u2014 it attacks e4!",
        explanation: "Development with tempo! Your knight lands on its ideal square while immediately threatening White's e4 pawn.\n\nThis is a core principle: develop pieces to active squares while creating threats. White must now address the pressure on e4, typically with Nc3.\n\nFrom f6, your knight:\n\u2022 Attacks the centre\n\u2022 Prepares to castle kingside\n\u2022 Can later jump to d7-c5 or e4 (if allowed)",
        opening: "The Open Sicilian"
      },
      {
        id: 'sicilian-5',
        fen: "rnbqkb1r/pp2pppp/3p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 2 5",
        prompt: "White has developed their other knight. Your move!",
        correct: [{ from: [0, 6], to: [0, 5] }, { from: [1, 7], to: [2, 5] }, { from: [4, 6], to: [4, 5] }, { from: [6, 6], to: [6, 5] }],
        san: "5...a6",
        moveNotation: "a7 \u2192 a6",
        hintPiece: [0, 6],
        hintSquare: [0, 5],
        shortTip: "A small pawn move with a big idea: play a6!",
        explanation: "Welcome to the Najdorf Variation \u2014 the most deeply analysed opening in chess history, and the weapon of choice for Fischer, Kasparov, and countless other world champions.\n\nThis little pawn move is prophylaxis at its finest:\n\u2022 Prevents Bb5, which would pin your knight or trade for your bishop\n\u2022 Prepares ...b5, expanding on the queenside\n\u2022 Keeps all your options open \u2014 you can still play ...e5, ...e6, or ...g6",
        opening: "The Najdorf Variation"
      },
      {
        id: 'sicilian-6',
        fen: "rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N1B3/PPP2PPP/R2QKB1R b KQkq - 1 6",
        prompt: "White's bishop has come to e3. Counter in the centre!",
        correct: [{ from: [4, 6], to: [4, 4] }, { from: [4, 6], to: [4, 5] }],
        san: "6...e5",
        moveNotation: "e7 \u2192 e5",
        hintPiece: [4, 6],
        hintSquare: [4, 4],
        shortTip: "Strike with e5! Kick that knight away.",
        explanation: "The English Attack is one of White's most dangerous weapons against the Najdorf. By playing ...e5, you fight fire with fire!\n\nThis bold central thrust:\n\u2022 Forces White's knight to retreat from d4\n\u2022 Gains space in the centre\n\u2022 Opens the diagonal for your dark-squared bishop\n\nYes, it creates a 'hole' on d5, but your active pieces compensate. Kasparov played this line repeatedly.",
        opening: "The Najdorf: English Attack"
      },
      {
        id: 'sicilian-dragon',
        fen: "rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 0 5",
        prompt: "You've started the Dragon! Complete the fianchetto.",
        correct: [{ from: [5, 7], to: [6, 6] }],
        san: "5...Bg7",
        moveNotation: "Bishop f8 \u2192 g7",
        hintPiece: [5, 7],
        hintSquare: [6, 6],
        shortTip: "Fianchetto your bishop to g7!",
        explanation: "The Dragon Variation \u2014 named because the pawn structure resembles a dragon's silhouette \u2014 is one of the sharpest openings in chess.\n\nYour fianchettoed bishop on g7 becomes a monster:\n\u2022 It rakes the long diagonal from h8 to a1\n\u2022 After castling, it defends your king while attacking\n\u2022 In the Yugoslav Attack, this bishop often decides the game\n\nThe Dragon leads to opposite-side castling and mutual attacks.",
        opening: "The Dragon Variation"
      },
      {
        id: 'sicilian-sveshnikov',
        fen: "r1bqkb1r/pp1ppppp/2n2n2/2p5/4P3/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 4 4",
        prompt: "Both sides have developed knights. Strike in the centre!",
        correct: [{ from: [4, 6], to: [4, 4] }],
        san: "4...e5",
        moveNotation: "e7 \u2192 e5",
        hintPiece: [4, 6],
        hintSquare: [4, 4],
        shortTip: "Push e5 \u2014 the Sveshnikov move!",
        explanation: "The Sveshnikov (or Pelikan) Variation \u2014 a bold central strike that was once considered dubious but is now one of Black's most respected weapons.\n\nEvgeny Sveshnikov rehabilitated this line in the 1970s, proving that the apparent weakness on d5 is compensated by:\n\u2022 Active piece play\n\u2022 The strong e5 pawn cramping White\n\u2022 Long-term attacking chances on the kingside\n\nMagnus Carlsen has used the Sveshnikov throughout his career.",
        opening: "The Sveshnikov Variation"
      },
      {
        id: 'sicilian-scheveningen',
        fen: "rnbqkb1r/pp3ppp/3ppn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R b KQkq - 0 6",
        prompt: "You're in the Scheveningen setup. Develop your bishop!",
        correct: [{ from: [5, 7], to: [4, 6] }],
        san: "6...Be7",
        moveNotation: "Bishop f8 \u2192 e7",
        hintPiece: [5, 7],
        hintSquare: [4, 6],
        shortTip: "Develop your bishop to e7 \u2014 prepare to castle!",
        explanation: "The Scheveningen Variation \u2014 named after the Dutch town where it was first played successfully in 1923.\n\nThe ...e6 and ...d6 pawn structure is known as the 'small centre'. Your bishop on e7:\n\u2022 Prepares immediate kingside castling\n\u2022 Can later move to f6 for defensive duties or b4 for attacking\n\u2022 Keeps your position flexible\n\nKasparov considered the Scheveningen one of the richest Sicilian systems.",
        opening: "The Scheveningen Variation"
      }
    ]
  },

  // ==========================================================================
  // 2. THE ITALIAN GAME
  // ==========================================================================
  italian: {
    name: "The Italian Game",
    description: "One of the oldest openings \u2014 White aims for rapid development and attacks f7.",
    positions: [
      {
        id: 'italian-1',
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White opens with e4. Match them in the centre!",
        correct: [{ from: [4, 6], to: [4, 4] }],
        san: "1...e5",
        moveNotation: "e7 \u2192 e5",
        hintPiece: [4, 6],
        hintSquare: [4, 4],
        shortTip: "Mirror White's move with e5!",
        explanation: "The classical response \u2014 meeting White head-on in the centre. This is how chess was played for centuries before the Sicilian rose to prominence.\n\n1...e5 immediately:\n\u2022 Stakes an equal claim in the centre\n\u2022 Opens lines for your queen and bishop\n\u2022 Leads to principled, strategic battles\n\nThe resulting 'Open Games' (1.e4 e5) are excellent for learning chess fundamentals.",
        opening: "The Open Game"
      },
      {
        id: 'italian-2',
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        prompt: "White develops Nf3, attacking your e5 pawn. Defend!",
        correct: [{ from: [1, 7], to: [2, 5] }],
        san: "2...Nc6",
        moveNotation: "Knight b8 \u2192 c6",
        hintPiece: [1, 7],
        hintSquare: [2, 5],
        shortTip: "Defend e5 by developing your knight!",
        explanation: "The ideal response \u2014 defend while developing. This principle guides all good opening play.\n\n2...Nc6 is superior to other defences like 2...d6 (blocks your bishop) or 2...f6 (weakens your king) because:\n\u2022 Your knight reaches its best square\n\u2022 You maintain flexibility with your other pieces\n\u2022 You control the key d4 and e5 squares",
        opening: "The Open Game"
      },
      {
        id: 'italian-3',
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        prompt: "White's bishop eyes your f7 pawn. How do you develop?",
        correct: [{ from: [5, 7], to: [2, 4] }],
        san: "3...Bc5",
        moveNotation: "Bishop f8 \u2192 c5",
        hintPiece: [5, 7],
        hintSquare: [2, 4],
        shortTip: "Develop your bishop to c5 \u2014 mirror White!",
        explanation: "This symmetrical development leads to the Giuoco Piano ('quiet game' in Italian) \u2014 though the positions can become quite sharp!\n\nYour bishop on c5:\n\u2022 Targets White's weak f2 square (only defended by the king)\n\u2022 Controls the important d4 square\n\u2022 Develops rapidly toward castling\n\nMagnus Carlsen has used the Italian Game to win numerous games at the highest level.",
        opening: "The Giuoco Piano"
      },
      {
        id: 'italian-4',
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R b KQkq - 0 4",
        prompt: "White played d3, solidifying. Develop your knight!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "4...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Bring your knight to f6!",
        explanation: "The knight belongs on f6 in almost every Open Game position. It's the most natural and effective developing move.\n\nFrom f6, your knight:\n\u2022 Attacks e4, creating immediate pressure\n\u2022 Prepares to castle kingside\n\u2022 Can later manoeuvre to g4 (attacking f2) or d5",
        opening: "The Giuoco Piano"
      },
      {
        id: 'italian-5',
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 b kq - 2 5",
        prompt: "White has castled. Time to secure your king too!",
        correct: [{ from: [4, 7], to: [6, 7] }],
        san: "5...O-O",
        moveNotation: "Castle kingside",
        hintPiece: [4, 7],
        hintSquare: [6, 7],
        shortTip: "Castle! Get your king to safety.",
        explanation: "Castle early, castle safely. This fundamental principle has guided chess players for five centuries.\n\nCastling achieves three objectives simultaneously:\n\u2022 Removes your king from the exposed centre\n\u2022 Develops your rook toward the centre\n\u2022 Connects your rooks so they can work together\n\nWith both sides castled, the opening is complete and the middlegame begins.",
        opening: "The Giuoco Piano"
      },
      {
        id: 'italian-6',
        fen: "r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP1NPPP/R1BQ1RK1 b - - 4 6",
        prompt: "White has regrouped. Solidify your centre!",
        correct: [{ from: [3, 6], to: [3, 5] }],
        san: "6...d6",
        moveNotation: "d7 \u2192 d6",
        hintPiece: [3, 6],
        hintSquare: [3, 5],
        shortTip: "Play d6 to support your e5 pawn.",
        explanation: "A solid move that shores up your central structure. With ...d6:\n\u2022 Your e5 pawn gains additional support\n\u2022 Your dark-squared bishop on c5 remains active\n\u2022 You can develop your c8-bishop to e6 or g4\n\nThis position is the starting point for many rich middlegame plans in the Italian Game.",
        opening: "The Giuoco Piano"
      }
    ]
  },

  // ==========================================================================
  // 3. THE RUY LOPEZ
  // ==========================================================================
  ruylopez: {
    name: "The Ruy Lopez",
    description: "The 'Spanish Torture' \u2014 White's most classical weapon against 1...e5.",
    positions: [
      {
        id: 'ruylopez-1',
        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        prompt: "White has played Bb5 \u2014 the Ruy Lopez! Defend your knight.",
        correct: [{ from: [0, 6], to: [0, 5] }],
        san: "3...a6",
        moveNotation: "a7 \u2192 a6",
        hintPiece: [0, 6],
        hintSquare: [0, 5],
        shortTip: "Play a6 \u2014 the Morphy Defence!",
        explanation: "The Morphy Defence \u2014 named after the legendary Paul Morphy, the greatest player of the 19th century.\n\nThis move asks the bishop an important question: 'Where are you going?' White must decide:\n\u2022 Ba4 \u2014 maintain pressure but allow ...b5 later\n\u2022 Bxc6 \u2014 the Exchange Variation, doubling Black's pawns\n\nThe Morphy Defence has been Black's main choice for over 150 years and remains the foundation of classical chess.",
        opening: "Ruy Lopez: Morphy Defence"
      },
      {
        id: 'ruylopez-2',
        fen: "r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 4",
        prompt: "White retreated the bishop to a4. Develop your knight!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "4...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight to f6!",
        explanation: "Natural development with a threat \u2014 your knight immediately pressures the e4 pawn.\n\nWhite must now decide how to defend e4. The most common responses:\n\u2022 O-O (castling and relying on tactical tricks)\n\u2022 d3 (solid)\n\u2022 Nc3 (developing)\n\nThis position has been reached millions of times and remains the heart of chess opening theory.",
        opening: "Ruy Lopez: Morphy Defence"
      },
      {
        id: 'ruylopez-3',
        fen: "r1bqkbnr/1ppp1ppp/p1n5/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 2 4",
        prompt: "White has castled. Develop your bishop!",
        correct: [{ from: [5, 7], to: [4, 6] }],
        san: "4...Be7",
        moveNotation: "Bishop f8 \u2192 e7",
        hintPiece: [5, 7],
        hintSquare: [4, 6],
        shortTip: "Develop your bishop to e7!",
        explanation: "The Closed Ruy Lopez \u2014 one of the most important systems in all of chess. The bishop on e7:\n\u2022 Prepares immediate castling\n\u2022 Is modestly but solidly placed\n\u2022 Can later go to f6 for defence or relocate via d8\n\nKramnik, Anand, and Caruana have all built World Championship campaigns around the Closed Ruy Lopez.",
        opening: "Ruy Lopez: Closed"
      },
      {
        id: 'ruylopez-4',
        fen: "r1bqk2r/1pppbppp/p1n2n2/4p3/B3P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 4 5",
        prompt: "Time to expand on the queenside!",
        correct: [{ from: [1, 6], to: [1, 4] }],
        san: "5...b5",
        moveNotation: "b7 \u2192 b5",
        hintPiece: [1, 6],
        hintSquare: [1, 4],
        shortTip: "Push b5 \u2014 attack the bishop!",
        explanation: "The thematic queenside expansion! By pushing ...b5, you:\n\u2022 Drive the bishop back to b3\n\u2022 Gain space on the queenside\n\u2022 Prepare ...Na5 to trade off the Spanish bishop\n\u2022 Open the b-file for your rook later\n\nThis pawn advance is the cornerstone of Black's counterplay in the Closed Ruy Lopez.",
        opening: "Ruy Lopez: Closed"
      },
      {
        id: 'ruylopez-5',
        fen: "r1bqk2r/2ppbppp/p1n2n2/1p2p3/4P3/1B3N2/PPPP1PPP/RNBQ1RK1 b kq - 1 6",
        prompt: "The bishop has retreated to b3. Castle to safety!",
        correct: [{ from: [4, 7], to: [6, 7] }],
        san: "6...O-O",
        moveNotation: "Castle kingside",
        hintPiece: [4, 7],
        hintSquare: [6, 7],
        shortTip: "Castle kingside!",
        explanation: "With development nearly complete, it's time to castle. This is one of the most important tabiya (key positions) in chess.\n\nFrom here, Black has several strategic plans:\n\u2022 ...d6 followed by ...Na5 and ...c5\n\u2022 The Marshall Attack with ...d5 (a famous gambit)\n\u2022 The Breyer Variation with ...Nb8-d7\n\nThis position has been debated at the highest level for over a century.",
        opening: "Ruy Lopez: Closed"
      }
    ]
  },

  // ==========================================================================
  // 4. THE CARO-KANN DEFENCE
  // ==========================================================================
  carokann: {
    name: "The Caro-Kann Defence",
    description: "A solid, strategic response to 1.e4 \u2014 aiming for a safe position with counterplay.",
    positions: [
      {
        id: 'caro-1',
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays e4. What's a solid, strategic reply?",
        correct: [{ from: [2, 6], to: [2, 5] }],
        san: "1...c6",
        moveNotation: "c7 \u2192 c6",
        hintPiece: [2, 6],
        hintSquare: [2, 5],
        shortTip: "Play c6 \u2014 preparing d5!",
        explanation: "The Caro-Kann Defence \u2014 named after Horatio Caro and Marcus Kann, who analysed it in the 1880s.\n\nThis move prepares ...d5, challenging White's centre with full pawn support. Unlike the French Defence (1...e6), your light-squared bishop won't get trapped behind your pawns.\n\nThe Caro-Kann is favoured by players who prefer solid, strategic positions. Anatoly Karpov used it extensively, as does Fabiano Caruana.",
        opening: "The Caro-Kann Defence"
      },
      {
        id: 'caro-2',
        fen: "rnbqkbnr/pp1ppppp/2p5/8/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
        prompt: "White develops Nc3. Execute your plan!",
        correct: [{ from: [3, 6], to: [3, 4] }],
        san: "2...d5",
        moveNotation: "d7 \u2192 d5",
        hintPiece: [3, 6],
        hintSquare: [3, 4],
        shortTip: "Strike with d5 \u2014 challenge the centre!",
        explanation: "The whole point of 1...c6 \u2014 your d5 pawn is now rock-solid, supported by the c6 pawn.\n\nThis central challenge forces White to make a decision:\n\u2022 3.e5 leads to the Advance Variation\n\u2022 3.exd5 cxd5 leads to the Exchange Variation\n\u2022 3.Nc3 or 3.Nd2 maintains the tension\n\nIn all cases, Black achieves a solid position with clear plans.",
        opening: "The Caro-Kann Defence"
      },
      {
        id: 'caro-3',
        fen: "rnbqkbnr/pp2pppp/2p5/3pP3/8/2N5/PPPP1PPP/R1BQKBNR b KQkq - 0 3",
        prompt: "White pushed e5 (the Advance Variation). Counter!",
        correct: [{ from: [2, 7], to: [5, 4] }],
        san: "3...Bf5",
        moveNotation: "Bishop c8 \u2192 f5",
        hintPiece: [2, 7],
        hintSquare: [5, 4],
        shortTip: "Get your bishop out before playing e6!",
        explanation: "This is the Caro-Kann's great advantage over the French Defence \u2014 your light-squared bishop escapes before being locked in by ...e6.\n\nFrom f5, the bishop:\n\u2022 Eyes the b1-h7 diagonal\n\u2022 Remains safe from attack\n\u2022 Can retreat to g6 if challenged by h4-h5\n\nKarpov called the Caro-Kann 'a very healthy opening' precisely because of moves like this.",
        opening: "Caro-Kann: Advance Variation"
      },
      {
        id: 'caro-4',
        fen: "rnbqkbnr/pp2pppp/2p5/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White captured on d5. How do you recapture?",
        correct: [{ from: [2, 5], to: [3, 4] }],
        san: "2...cxd5",
        moveNotation: "c6 captures d5",
        hintPiece: [2, 5],
        hintSquare: [3, 4],
        shortTip: "Take with the c-pawn!",
        explanation: "The Exchange Variation \u2014 recapturing with the c-pawn maintains your central pawn on d5.\n\nThis gives you:\n\u2022 A solid central strongpoint\n\u2022 A clear development plan: Nf6, Bf5, e6, Be7, O-O\n\u2022 An open c-file for your rook later\n\nThe resulting positions are symmetric but not drawish. Both sides have real winning chances.",
        opening: "Caro-Kann: Exchange Variation"
      },
      {
        id: 'caro-classical',
        fen: "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        prompt: "White maintains the tension with Nc3. Keep pushing!",
        correct: [{ from: [3, 4], to: [4, 3] }],
        san: "3...dxe4",
        moveNotation: "d5 captures e4",
        hintPiece: [3, 4],
        hintSquare: [4, 3],
        shortTip: "Capture on e4!",
        explanation: "The Classical Caro-Kann \u2014 Black captures and prepares to develop the light-squared bishop actively.\n\nAfter 4.Nxe4, you'll play 4...Bf5 or 4...Nd7, both leading to rich middlegame positions:\n\u2022 4...Bf5 is the traditional main line (Classical)\n\u2022 4...Nd7 is the modern approach (Karpov Variation)\n\nBoth are fully sound and offer Black excellent chances.",
        opening: "Caro-Kann: Classical"
      }
    ]
  },

  // ==========================================================================
  // 5. THE FRENCH DEFENCE
  // ==========================================================================
  french: {
    name: "The French Defence",
    description: "A strategic opening that creates tension \u2014 Black accepts a cramped position for counterplay.",
    positions: [
      {
        id: 'french-1',
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays e4. How do you set up the French?",
        correct: [{ from: [4, 6], to: [4, 5] }],
        san: "1...e6",
        moveNotation: "e7 \u2192 e6",
        hintPiece: [4, 6],
        hintSquare: [4, 5],
        shortTip: "Play e6 \u2014 preparing d5 differently!",
        explanation: "The French Defence \u2014 a strategic favourite since the 19th century, when it gained fame after Paris beat London in a correspondence match.\n\nLike the Caro-Kann, you're preparing ...d5. But the French pawn chain (e6-d5) points toward the queenside, where you'll seek counterplay.\n\nThe trade-off: your light-squared bishop is initially blocked. French players have learned to use this 'bad bishop' creatively. Botvinnik, Petrosian, and Morozevich have all wielded the French to great effect.",
        opening: "The French Defence"
      },
      {
        id: 'french-2',
        fen: "rnbqkbnr/pppp1ppp/4p3/8/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2",
        prompt: "White plays Nc3. Time for your central strike!",
        correct: [{ from: [3, 6], to: [3, 4] }],
        san: "2...d5",
        moveNotation: "d7 \u2192 d5",
        hintPiece: [3, 6],
        hintSquare: [3, 4],
        shortTip: "Push d5 \u2014 attack the centre!",
        explanation: "The central confrontation begins! Your d5 pawn directly challenges White's e4.\n\nWhite must now choose:\n\u2022 3.exd5 exd5 \u2014 the Exchange Variation (quiet)\n\u2022 3.e5 \u2014 the Advance Variation (space battle)\n\u2022 3.Nc3 or 3.Nd2 \u2014 maintaining tension (sharp)\n\nEach variation has its own character, but Black's plan remains consistent: pressure d4, expand with ...c5.",
        opening: "The French Defence"
      },
      {
        id: 'french-3',
        fen: "rnbqkbnr/ppp2ppp/4p3/3pP3/3P4/8/PPP2PPP/RNBQKBNR b KQkq - 0 3",
        prompt: "White has advanced e5. Counterattack the base!",
        correct: [{ from: [2, 6], to: [2, 4] }],
        san: "3...c5",
        moveNotation: "c7 \u2192 c5",
        hintPiece: [2, 6],
        hintSquare: [2, 4],
        shortTip: "Strike at d4 with c5!",
        explanation: "A fundamental strategic principle: attack a pawn chain at its base, not its head.\n\nWhite's pawns form a chain: d4-e5. The base is d4. By attacking it with ...c5, you threaten to undermine the entire structure.\n\nThis move also:\n\u2022 Opens the c-file for your rook\n\u2022 Prepares ...Nc6 and ...Qb6, increasing pressure\n\u2022 Gives your dark-squared bishop potential via ...cxd4 and ...Bc5",
        opening: "French: Advance Variation"
      },
      {
        id: 'french-4',
        fen: "rnbqkb1r/ppp2ppp/4pn2/3pP3/3P4/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 4",
        prompt: "Your knight on f6 is attacked! Where should it go?",
        correct: [{ from: [5, 5], to: [3, 6] }],
        san: "4...Nfd7",
        moveNotation: "Knight f6 \u2192 d7",
        hintPiece: [5, 5],
        hintSquare: [3, 6],
        shortTip: "Retreat to d7 \u2014 support the c5 break!",
        explanation: "An unusual retreat, but entirely logical! The knight on d7 supports the key ...c5 break.\n\nFrom d7, the knight can:\n\u2022 Support ...c5 when it comes\n\u2022 Jump to b6 to pressure d5 or a4\n\u2022 Relocate to f8 and then g6 or e6\n\nThe French requires patient manoeuvring. Unlike the Sicilian's tactical firefights, French positions reward long-term planning.",
        opening: "French: Advance Variation"
      },
      {
        id: 'french-winawer',
        fen: "rnbqkbnr/pppp1ppp/4p3/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 1 3",
        prompt: "White plays Nc3. Pin it with your bishop!",
        correct: [{ from: [5, 7], to: [1, 3] }],
        san: "3...Bb4",
        moveNotation: "Bishop f8 \u2192 b4",
        hintPiece: [5, 7],
        hintSquare: [1, 3],
        shortTip: "Pin the knight with Bb4 \u2014 the Winawer!",
        explanation: "The Winawer Variation \u2014 the sharpest and most combative line in the French Defence.\n\nBy pinning the c3 knight, you put immediate pressure on e4. White often responds with e5, leading to incredibly complex positions.\n\nThe Winawer was a favourite of Mikhail Botvinnik (World Champion 1948-63). The positions require precise calculation from both sides \u2014 one mistake can be fatal.\n\nModern grandmasters like Nikita Vitiugov continue to prove the Winawer's reliability at the highest level.",
        opening: "French: Winawer Variation"
      }
    ]
  },

  // ==========================================================================
  // 6. QUEEN'S GAMBIT DECLINED
  // ==========================================================================
  queens_gambit: {
    name: "The Queen's Gambit Declined",
    description: "Black declines the gambit pawn, building a solid defensive structure.",
    positions: [
      {
        id: 'qgd-1',
        fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White opens with d4. What's the classical response?",
        correct: [{ from: [3, 6], to: [3, 4] }],
        san: "1...d5",
        moveNotation: "d7 \u2192 d5",
        hintPiece: [3, 6],
        hintSquare: [3, 4],
        shortTip: "Meet d4 with d5 \u2014 claim the centre!",
        explanation: "The classical response to 1.d4 \u2014 immediately contesting the centre. This has been Black's main reply for over a century.\n\nUnlike 1.e4 e5, the queen's-pawn openings tend to be more strategic and less tactical. Control of the d5 and e4 squares becomes paramount.\n\nThis move leads to the Queen's Gambit complex \u2014 one of the most important opening systems in chess.",
        opening: "Closed Game"
      },
      {
        id: 'qgd-2',
        fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White offers the Queen's Gambit with c4. Do you accept?",
        correct: [{ from: [4, 6], to: [4, 5] }],
        san: "2...e6",
        moveNotation: "e7 \u2192 e6",
        hintPiece: [4, 6],
        hintSquare: [4, 5],
        shortTip: "Decline with e6 \u2014 solidify d5!",
        explanation: "The Queen's Gambit Declined \u2014 Black's most solid response. You refuse to capture on c4, instead reinforcing your d5 pawn.\n\nWhy decline? The 'gambit' isn't a true sacrifice \u2014 if Black takes with 2...dxc4, White easily recovers the pawn. By playing 2...e6:\n\u2022 You maintain your central strongpoint\n\u2022 You prepare to develop your bishop\n\u2022 You create a solid, defensible position\n\nKarpov, Kramnik, and Caruana have all relied on the QGD at the highest levels.",
        opening: "Queen's Gambit Declined"
      },
      {
        id: 'qgd-3',
        fen: "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
        prompt: "White develops Nc3. Develop a piece!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "3...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight to f6!",
        explanation: "The natural developing move \u2014 your knight heads to its ideal square.\n\nFrom f6, the knight:\n\u2022 Defends d5, your key central pawn\n\u2022 Controls the e4 square, limiting White's expansion\n\u2022 Prepares for kingside castling\n\nThe QGD is a model of solid, principled play.",
        opening: "Queen's Gambit Declined"
      },
      {
        id: 'qgd-4',
        fen: "rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4",
        prompt: "White plays Nf3. How do you develop your bishop?",
        correct: [{ from: [5, 7], to: [4, 6] }],
        san: "4...Be7",
        moveNotation: "Bishop f8 \u2192 e7",
        hintPiece: [5, 7],
        hintSquare: [4, 6],
        shortTip: "Develop your bishop to e7!",
        explanation: "The Orthodox Defence \u2014 the most classical continuation of the QGD. Your bishop on e7 is modest but effective.\n\nWhy e7? Because:\n\u2022 It doesn't commit to any particular plan yet\n\u2022 It prepares to castle immediately\n\u2022 It avoids any potential Qa4+ tricks\n\nAfter castling, you'll look for counterplay with ...c5 or ...dxc4 followed by ...c5.",
        opening: "QGD: Orthodox Defence"
      },
      {
        id: 'qgd-5',
        fen: "rnbqk2r/ppp1bppp/4pn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 4 5",
        prompt: "Castle to safety!",
        correct: [{ from: [4, 7], to: [6, 7] }],
        san: "5...O-O",
        moveNotation: "Castle kingside",
        hintPiece: [4, 7],
        hintSquare: [6, 7],
        shortTip: "Castle kingside!",
        explanation: "With development progressing smoothly, castling is the priority. Your king finds a safe haven while your rook activates.\n\nThe QGD Orthodox is one of the most tested openings in chess history. From here:\n\u2022 ...h6 prevents Bg5 pins\n\u2022 ...b6 followed by ...Bb7 is the Tartakower Variation\n\u2022 ...Nbd7 keeps options flexible\n\nThis was the battleground for the legendary Kasparov-Karpov World Championship matches.",
        opening: "QGD: Orthodox Defence"
      }
    ]
  },

  // ==========================================================================
  // 7. THE SLAV DEFENCE
  // ==========================================================================
  slav: {
    name: "The Slav Defence",
    description: "A robust response to the Queen's Gambit \u2014 solid yet with active piece play.",
    positions: [
      {
        id: 'slav-1',
        fen: "rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White offers the Queen's Gambit. Defend with c6!",
        correct: [{ from: [2, 6], to: [2, 5] }],
        san: "2...c6",
        moveNotation: "c7 \u2192 c6",
        hintPiece: [2, 6],
        hintSquare: [2, 5],
        shortTip: "Play c6 \u2014 the Slav Defence!",
        explanation: "The Slav Defence \u2014 Black supports d5 with the c-pawn rather than ...e6, keeping the light-squared bishop free.\n\nThis is the key difference from the QGD: your bishop on c8 isn't locked in. It can develop to f5 or g4, creating active counterplay.\n\nThe Slav is considered one of Black's most reliable defences against 1.d4. It has been championed by Kramnik, Anand, and many other elite players.",
        opening: "The Slav Defence"
      },
      {
        id: 'slav-2',
        fen: "rnbqkbnr/pp2pppp/2p5/3p4/2PP4/5N2/PP2PPPP/RNBQKB1R b KQkq - 1 3",
        prompt: "White develops Nf3. Develop your knight!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "3...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight to f6!",
        explanation: "Solid development \u2014 your knight defends d5 and pressures e4.\n\nNow White faces a critical decision at move 4:\n\u2022 4.Nc3 enters the main lines\n\u2022 4.e3 is the Slow Slav\n\u2022 4.Qc2/4.Qb3 are sidelines\n\nThe Slav is one of the most theoretically dense openings \u2014 preparation can extend deep into the middlegame.",
        opening: "The Slav Defence"
      },
      {
        id: 'slav-3',
        fen: "rnbqkb1r/pp2pppp/2p2n2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4",
        prompt: "Both knights are developed. Get your bishop active!",
        correct: [{ from: [3, 4], to: [2, 3] }],
        san: "4...dxc4",
        moveNotation: "d5 captures c4",
        hintPiece: [3, 4],
        hintSquare: [2, 3],
        shortTip: "Capture on c4 \u2014 free your bishop!",
        explanation: "By capturing on c4, you open the diagonal for your light-squared bishop \u2014 the whole point of the Slav move order!\n\nAfter 4...dxc4, you'll follow up with:\n\u2022 ...Bf5 developing the bishop actively\n\u2022 ...e6 to solidify\n\u2022 The pawn on c4 is temporary \u2014 White will recover it, but you've achieved your strategic goal\n\nThis is the Semi-Slav/Slav main line, leading to incredibly sharp theory.",
        opening: "Slav: Main Line"
      },
      {
        id: 'slav-4',
        fen: "rnbqkb1r/pp2pppp/2p2n2/8/2pP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 0 5",
        prompt: "You've captured on c4. Now develop your bishop!",
        correct: [{ from: [2, 7], to: [5, 4] }],
        san: "5...Bf5",
        moveNotation: "Bishop c8 \u2192 f5",
        hintPiece: [2, 7],
        hintSquare: [5, 4],
        shortTip: "Bishop to f5 \u2014 the whole point!",
        explanation: "Mission accomplished! Your light-squared bishop is now on its ideal diagonal, free from the pawn chain.\n\nThis is the fundamental achievement of the Slav: active piece play without positional concessions. Compare this to the QGD where the bishop stays locked behind e6.\n\nFrom f5, the bishop:\n\u2022 Controls key light squares\n\u2022 Pressures the b1-h7 diagonal\n\u2022 Can retreat to g6 if needed",
        opening: "Slav: Main Line"
      }
    ]
  },

  // ==========================================================================
  // 8. KING'S INDIAN DEFENCE
  // ==========================================================================
  kings_indian: {
    name: "The King's Indian Defence",
    description: "A hypermodern system \u2014 let White build the centre, then blow it up!",
    positions: [
      {
        id: 'kid-1',
        fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays d4. Begin the King's Indian setup!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "1...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight to f6!",
        explanation: "The King's Indian Defence begins with knight development rather than an immediate pawn challenge. This is a hypermodern approach.\n\nThe idea: let White build an imposing pawn centre with d4, c4, and even e4. Then strike back with ...e5 or ...c5 when the time is right.\n\nThe King's Indian was Kasparov's and Bobby Fischer's favourite weapon against 1.d4. It leads to some of the most exciting positions in chess.",
        opening: "King's Indian Defence"
      },
      {
        id: 'kid-2',
        fen: "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White plays c4. Continue the fianchetto setup!",
        correct: [{ from: [6, 6], to: [6, 5] }],
        san: "2...g6",
        moveNotation: "g7 \u2192 g6",
        hintPiece: [6, 6],
        hintSquare: [6, 5],
        shortTip: "Play g6 \u2014 prepare the fianchetto!",
        explanation: "The hallmark of the King's Indian \u2014 the kingside fianchetto. You're preparing to place your bishop on g7, the most powerful diagonal.\n\nThe bishop on g7 will become a long-range sniper, controlling the a1-h8 diagonal. Combined with the ...e5 pawn break, it creates devastating attacking chances.\n\nThis setup requires patience and understanding of dynamic play.",
        opening: "King's Indian Defence"
      },
      {
        id: 'kid-3',
        fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
        prompt: "White develops Nc3. Complete your fianchetto!",
        correct: [{ from: [5, 7], to: [6, 6] }],
        san: "3...Bg7",
        moveNotation: "Bishop f8 \u2192 g7",
        hintPiece: [5, 7],
        hintSquare: [6, 6],
        shortTip: "Fianchetto your bishop to g7!",
        explanation: "The King's Indian bishop takes its throne! From g7, this bishop is tremendously powerful.\n\nIt controls:\n\u2022 The entire a1-h8 diagonal\n\u2022 Defensive duties around your king\n\u2022 Attacking potential against White's queenside\n\nIn many King's Indian games, this bishop becomes the decisive piece. After castling, you'll prepare the classic ...e5 central break.",
        opening: "King's Indian Defence"
      },
      {
        id: 'kid-4',
        fen: "rnbqk2r/ppppppbp/5np1/8/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 3 4",
        prompt: "White develops Nf3. Continue your setup!",
        correct: [{ from: [3, 6], to: [3, 5] }],
        san: "4...d6",
        moveNotation: "d7 \u2192 d6",
        hintPiece: [3, 6],
        hintSquare: [3, 5],
        shortTip: "Play d6 \u2014 prepare ...e5!",
        explanation: "A modest but essential move. The pawn on d6:\n\u2022 Controls e5, preparing the thematic central break\n\u2022 Doesn't block your g7 bishop\n\u2022 Supports a later ...e5 push\n\nThe King's Indian is a 'loaded spring' \u2014 you're coiling your pieces for a devastating central or kingside assault. The ...e5 break, when it comes, often unleashes tremendous energy.",
        opening: "King's Indian Defence"
      },
      {
        id: 'kid-5',
        fen: "rnbq1rk1/ppp1ppbp/3p1np1/8/2PPP3/2N2N2/PP3PPP/R1BQKB1R b - - 0 6",
        prompt: "White has built a big centre with e4. Strike back!",
        correct: [{ from: [4, 6], to: [4, 4] }],
        san: "6...e5",
        moveNotation: "e7 \u2192 e5",
        hintPiece: [4, 6],
        hintSquare: [4, 4],
        shortTip: "Push e5 \u2014 challenge the centre!",
        explanation: "The moment you've been waiting for! The classic King's Indian central break unleashes your position.\n\nAfter ...e5:\n\u2022 The d4 pawn is challenged\n\u2022 Your g7 bishop comes alive on the long diagonal\n\u2022 You gain kingside attacking chances after ...f5\n\nIf White plays d5 (closing the centre), a kingside attack with ...f5, ...f4, ...g5, ...Nf6-h5 becomes devastating. This is the 'Mar del Plata Attack' structure \u2014 some of the most thrilling chess you'll ever see.",
        opening: "King's Indian: Classical"
      }
    ]
  },

  // ==========================================================================
  // 9. NIMZO-INDIAN DEFENCE
  // ==========================================================================
  nimzo_indian: {
    name: "The Nimzo-Indian Defence",
    description: "A flexible system controlling e4 with pieces rather than pawns.",
    positions: [
      {
        id: 'nimzo-1',
        fen: "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White plays c4. Prepare for the Nimzo-Indian!",
        correct: [{ from: [4, 6], to: [4, 5] }],
        san: "2...e6",
        moveNotation: "e7 \u2192 e6",
        hintPiece: [4, 6],
        hintSquare: [4, 5],
        shortTip: "Play e6 \u2014 flexible and strong!",
        explanation: "This flexible move keeps your options open for either the Nimzo-Indian (if 3.Nc3, then ...Bb4) or the Queen's Indian (if 3.Nf3, then ...b6).\n\nAaron Nimzowitsch revolutionised chess with this approach \u2014 controlling the centre with pieces rather than pawns. His ideas were considered heretical in the 1920s but are now standard practice.",
        opening: "Nimzo-Indian Defence"
      },
      {
        id: 'nimzo-2',
        fen: "rnbqkb1r/pppp1ppp/4pn2/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 2 3",
        prompt: "White plays Nc3. Pin it with your bishop!",
        correct: [{ from: [5, 7], to: [1, 3] }],
        san: "3...Bb4",
        moveNotation: "Bishop f8 \u2192 b4",
        hintPiece: [5, 7],
        hintSquare: [1, 3],
        shortTip: "Pin the knight with Bb4!",
        explanation: "The defining move of the Nimzo-Indian! By pinning the c3 knight, you prevent White from easily playing e4.\n\nThis is Nimzowitsch's great insight: you don't need to place a pawn on e5 or d5 to control the centre. The Bb4 pin effectively controls e4 through piece pressure.\n\nThe Nimzo-Indian is considered one of the soundest openings in chess. Capablanca, Fischer, and Kramnik have all used it with great success.",
        opening: "Nimzo-Indian Defence"
      },
      {
        id: 'nimzo-3',
        fen: "rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PPQ1PPPP/R1B1KBNR b KQkq - 3 4",
        prompt: "White plays Qc2. Castle to safety!",
        correct: [{ from: [4, 7], to: [6, 7] }],
        san: "4...O-O",
        moveNotation: "Castle kingside",
        hintPiece: [4, 7],
        hintSquare: [6, 7],
        shortTip: "Castle kingside!",
        explanation: "Quick castling is essential in the Nimzo-Indian. The Classical Variation (4.Qc2) aims to recapture on c3 with the queen, avoiding doubled pawns.\n\nBy castling, you:\n\u2022 Secure your king\n\u2022 Connect your rooks\n\u2022 Prepare central action with ...d5 or ...c5\n\nThe resulting positions are rich in strategic nuance \u2014 a battleground for positional understanding.",
        opening: "Nimzo-Indian: Classical"
      },
      {
        id: 'nimzo-4',
        fen: "rnbq1rk1/pppp1ppp/4pn2/8/1bPP4/2N5/PPQ1PPPP/R1B1KBNR b - - 4 5",
        prompt: "Time for your central break!",
        correct: [{ from: [3, 6], to: [3, 4] }],
        san: "5...d5",
        moveNotation: "d7 \u2192 d5",
        hintPiece: [3, 6],
        hintSquare: [3, 4],
        shortTip: "Push d5 \u2014 challenge the centre!",
        explanation: "The classic central strike! With your king safely castled, you challenge White's pawn centre directly.\n\nThis creates tension in the centre that White must resolve. The position often leads to the type of strategic manoeuvring that Nimzowitsch championed \u2014 using pieces actively to control key squares.\n\nThe d5 break is the heart of Black's strategy in most Nimzo-Indian lines.",
        opening: "Nimzo-Indian: Classical"
      }
    ]
  },

  // ==========================================================================
  // 10. THE GR\u00dcNFELD DEFENCE
  // ==========================================================================
  grunfeld: {
    name: "The Gr\u00fcnfeld Defence",
    description: "Allow White a massive centre, then destroy it!",
    positions: [
      {
        id: 'grunfeld-1',
        fen: "rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White plays c4. Begin the Gr\u00fcnfeld setup!",
        correct: [{ from: [6, 6], to: [6, 5] }],
        san: "2...g6",
        moveNotation: "g7 \u2192 g6",
        hintPiece: [6, 6],
        hintSquare: [6, 5],
        shortTip: "Play g6 \u2014 fianchetto!",
        explanation: "The start of the Gr\u00fcnfeld setup. Like the King's Indian, you fianchetto your bishop \u2014 but the follow-up is very different.\n\nInstead of the slow ...d6 build-up, the Gr\u00fcnfeld will strike immediately with ...d5, sacrificing the centre to gain dynamic piece play.\n\nErnst Gr\u00fcnfeld introduced this defence in 1922, and it was instantly controversial. Today it's one of Black's most respected weapons.",
        opening: "Gr\u00fcnfeld Defence"
      },
      {
        id: 'grunfeld-2',
        fen: "rnbqkb1r/pppppp1p/5np1/8/2PP4/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 3",
        prompt: "White develops Nc3. Now strike in the centre!",
        correct: [{ from: [3, 6], to: [3, 4] }],
        san: "3...d5",
        moveNotation: "d7 \u2192 d5",
        hintPiece: [3, 6],
        hintSquare: [3, 4],
        shortTip: "Push d5 \u2014 the Gr\u00fcnfeld strike!",
        explanation: "The defining move! Unlike the King's Indian, the Gr\u00fcnfeld immediately challenges White's centre.\n\nAfter cxd5 Nxd5, White will typically play e4, building an enormous centre. But Black has a plan:\n\u2022 The g7 bishop will pressure d4 along the long diagonal\n\u2022 ...c5 will attack the d4 pawn\n\u2022 Piece activity will compensate for the apparent space deficit\n\nKasparov used the Gr\u00fcnfeld to win his 1987 World Championship match against Karpov.",
        opening: "Gr\u00fcnfeld Defence"
      },
      {
        id: 'grunfeld-3',
        fen: "rnbqkb1r/ppp1pp1p/5np1/3P4/2P5/2N5/PP2PPPP/R1BQKBNR b KQkq - 0 4",
        prompt: "White captured on d5. Recapture with your knight!",
        correct: [{ from: [5, 5], to: [3, 4] }],
        san: "4...Nxd5",
        moveNotation: "Knight f6 captures d5",
        hintPiece: [5, 5],
        hintSquare: [3, 4],
        shortTip: "Take back with your knight!",
        explanation: "Recapturing with the knight is key to the Gr\u00fcnfeld strategy. Your knight on d5 is centralised but will soon be kicked by e4.\n\nThe resulting exchange leads to White's 'big centre' with pawns on c4, d4, and e4. This looks imposing but provides targets for Black's counterplay.\n\nThe Gr\u00fcnfeld is proof that a large pawn centre can be a weakness as much as a strength.",
        opening: "Gr\u00fcnfeld Defence"
      },
      {
        id: 'grunfeld-4',
        fen: "rnbqkb1r/ppp1pp1p/6p1/8/2PPn3/2N5/PP3PPP/R1BQKBNR b KQkq - 0 5",
        prompt: "White pushed e4. Complete your fianchetto!",
        correct: [{ from: [5, 7], to: [6, 6] }],
        san: "5...Bg7",
        moveNotation: "Bishop f8 \u2192 g7",
        hintPiece: [5, 7],
        hintSquare: [6, 6],
        shortTip: "Fianchetto your bishop to g7!",
        explanation: "Your bishop takes its position on the long diagonal, staring directly at White's d4 pawn. This bishop is the cornerstone of the Gr\u00fcnfeld.\n\nWhite has an imposing centre, but your pieces are actively placed:\n\u2022 The Bg7 pressures d4\n\u2022 ...c5 will follow, attacking d4\n\u2022 ...Nc6 adds more pressure\n\nThe dynamic tension between White's space and Black's activity creates incredibly exciting chess.",
        opening: "Gr\u00fcnfeld Defence"
      }
    ]
  },

  // ==========================================================================
  // 11. THE SCOTCH GAME
  // ==========================================================================
  scotch: {
    name: "The Scotch Game",
    description: "An immediate central confrontation after 1.e4 e5.",
    positions: [
      {
        id: 'scotch-1',
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 0 3",
        prompt: "White pushes d4 early! Capture the pawn.",
        correct: [{ from: [4, 4], to: [3, 3] }],
        san: "3...exd4",
        moveNotation: "e5 captures d4",
        hintPiece: [4, 4],
        hintSquare: [3, 3],
        shortTip: "Capture on d4!",
        explanation: "The Scotch Game \u2014 an opening with a long history, revitalised by Garry Kasparov in the 1990s.\n\nBy capturing, you accept an open position where piece activity matters more than pawn structure.\n\nAfter 4.Nxd4, Black has several good responses:\n\u2022 4...Bc5 targeting the knight\n\u2022 4...Nf6 developing with tempo\n\u2022 4...Qh4 (the Steinitz Variation) \u2014 provocative but sound\n\nThe Scotch avoids the heavy theory of the Ruy Lopez and Italian Game.",
        opening: "The Scotch Game"
      },
      {
        id: 'scotch-2',
        fen: "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
        prompt: "White recaptured with the knight. Attack it!",
        correct: [{ from: [5, 7], to: [2, 4] }],
        san: "4...Bc5",
        moveNotation: "Bishop f8 \u2192 c5",
        hintPiece: [5, 7],
        hintSquare: [2, 4],
        shortTip: "Develop your bishop to c5!",
        explanation: "The Classical Scotch \u2014 your bishop immediately targets the d4 knight and the f2 square.\n\nThis creates immediate tactical pressure:\n\u2022 The knight on d4 is attacked by both bishop and knight\n\u2022 The f2 square (White's weakest point) is targeted\n\u2022 You develop with tempo, gaining time\n\nThe position is open and double-edged. Both sides must play accurately.",
        opening: "Scotch Game: Classical"
      },
      {
        id: 'scotch-3',
        fen: "r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R b KQkq - 0 4",
        prompt: "White recaptured on d4. Develop with tempo!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "4...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight, attacking e4!",
        explanation: "An alternative to 4...Bc5 \u2014 developing your knight while immediately pressuring the e4 pawn.\n\nAfter 4...Nf6, White usually plays 5.Nxc6 bxc6, opening lines for Black's pieces. The resulting positions favour active play:\n\u2022 Black gets the bishop pair\n\u2022 The half-open b-file provides pressure\n\u2022 Active piece play compensates for the doubled c-pawns",
        opening: "Scotch Game: Schmidt Variation"
      }
    ]
  },

  // ==========================================================================
  // 12. THE PETROFF DEFENCE
  // ==========================================================================
  petroff: {
    name: "The Petroff Defence",
    description: "A symmetrical, solid response to 1.e4 e5 2.Nf3 \u2014 the 'Russian Game'.",
    positions: [
      {
        id: 'petroff-1',
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2",
        prompt: "White plays Nf3. Counter-attack instead of defending!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "2...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Counter-attack with Nf6!",
        explanation: "The Petroff Defence (or Russian Game) \u2014 instead of defending the e5 pawn, you counter-attack White's e4!\n\nThis was invented by Alexander Petroff in the 19th century and has become a favourite at the highest levels. It offers:\n\u2022 Rock-solid equality\n\u2022 Clear drawing chances when needed\n\u2022 Surprising winning potential in the right hands\n\nKramnik and Caruana have used the Petroff extensively in World Championship matches.",
        opening: "The Petroff Defence"
      },
      {
        id: 'petroff-2',
        fen: "rnbqkb1r/pppp1ppp/5n2/4N3/4P3/8/PPPP1PPP/RNBQKB1R b KQkq - 0 3",
        prompt: "White captured on e5. How do you respond?",
        correct: [{ from: [3, 6], to: [3, 5] }],
        san: "3...d6",
        moveNotation: "d7 \u2192 d6",
        hintPiece: [3, 6],
        hintSquare: [3, 5],
        shortTip: "Play d6 \u2014 kick the knight!",
        explanation: "The Steinitz Variation \u2014 the most principled response. You attack the e5 knight, forcing it to retreat.\n\nImportantly, you should NOT play 3...Nxe4 first (a common beginner mistake), as White gets a dangerous attack.\n\nAfter 3...d6 4.Nf3 Nxe4, you've regained the pawn with equal chances. The Petroff is a model of how to achieve equality with Black through precise play.",
        opening: "Petroff: Steinitz Variation"
      },
      {
        id: 'petroff-3',
        fen: "rnbqkb1r/ppp2ppp/3p4/8/4n3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 4",
        prompt: "The knight has retreated. Recapture on e4!",
        correct: [{ from: [5, 5], to: [4, 3] }],
        san: "4...Nxe4",
        moveNotation: "Knight f6 captures e4",
        hintPiece: [5, 5],
        hintSquare: [4, 3],
        shortTip: "Take the e4 pawn!",
        explanation: "Now is the right time to take on e4! Material is equal and your knight is centralised.\n\nThe position is level, but there's plenty of play. White usually continues with d4, developing actively, while Black will consolidate with ...Be7, ...O-O, and ...Bf5 or ...Bg4.\n\nThe Petroff rewards precise, patient play \u2014 it's not flashy, but it's extremely reliable.",
        opening: "Petroff: Main Line"
      }
    ]
  },

  // ==========================================================================
  // 13. THE KING'S GAMBIT
  // ==========================================================================
  kings_gambit: {
    name: "The King's Gambit",
    description: "A romantic opening from the 19th century \u2014 White sacrifices a pawn for rapid attack.",
    positions: [
      {
        id: 'kg-1',
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR b KQkq - 0 2",
        prompt: "White plays f4 \u2014 the King's Gambit! Accept it!",
        correct: [{ from: [4, 4], to: [5, 3] }],
        san: "2...exf4",
        moveNotation: "e5 captures f4",
        hintPiece: [4, 4],
        hintSquare: [5, 3],
        shortTip: "Accept the gambit \u2014 take the pawn!",
        explanation: "The King's Gambit Accepted \u2014 one of the oldest and most romantic openings in chess!\n\nBy accepting the pawn, you get material and take away White's natural f-pawn shelter. The gambit was the weapon of choice for the great 19th-century attacking players like Anderssen and Morphy.\n\nModern theory shows the gambit is objectively sound for both sides \u2014 White gets open lines and attacking chances, Black gets an extra pawn and defensive resources.",
        opening: "King's Gambit Accepted"
      },
      {
        id: 'kg-2',
        fen: "rnbqkbnr/pppp1ppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1R b KQkq - 1 3",
        prompt: "White plays Nf3. Strike back in the centre!",
        correct: [{ from: [3, 6], to: [3, 4] }],
        san: "3...d5",
        moveNotation: "d7 \u2192 d5",
        hintPiece: [3, 6],
        hintSquare: [3, 4],
        shortTip: "Push d5 \u2014 counter-attack!",
        explanation: "The Modern Defence to the King's Gambit \u2014 rather than trying to hold the f4 pawn, you strike at White's centre.\n\nThis principled response:\n\u2022 Opens lines for your pieces\n\u2022 Challenges White's e4 pawn\n\u2022 Develops quickly (your bishop can come to d6 or c5)\n\nFischer recommended this move, saying it was the best practical response to the King's Gambit.",
        opening: "King's Gambit: Modern Defence"
      },
      {
        id: 'kg-3',
        fen: "rnbqkbnr/pppp1ppp/8/8/4Pp2/5N2/PPPP2PP/RNBQKB1R b KQkq - 1 3",
        prompt: "White plays Nf3. Develop your knight aggressively!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "3...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight, attacking e4!",
        explanation: "The Schallop Defence \u2014 developing a piece while attacking e4. Simple and effective.\n\nYour knight on f6 puts immediate pressure on the centre, and you can follow up with ...d5 on the next move. The f4 pawn is yours to keep for now.\n\nThis is a modern, practical approach to the King's Gambit \u2014 develop quickly and let White prove their compensation.",
        opening: "King's Gambit: Schallop Defence"
      }
    ]
  },

  // ==========================================================================
  // 14. THE PIRC DEFENCE
  // ==========================================================================
  pirc: {
    name: "The Pirc Defence",
    description: "A hypermodern approach \u2014 invite White to build a centre, then undermine it.",
    positions: [
      {
        id: 'pirc-1',
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays e4. Begin the Pirc setup!",
        correct: [{ from: [3, 6], to: [3, 5] }],
        san: "1...d6",
        moveNotation: "d7 \u2192 d6",
        hintPiece: [3, 6],
        hintSquare: [3, 5],
        shortTip: "Play d6 \u2014 the Pirc Defence!",
        explanation: "The Pirc Defence \u2014 named after Vasja Pirc, the Slovenian Grandmaster who popularised it in the 1940s.\n\nLike the King's Indian against d4, the Pirc allows White to build a broad pawn centre, then seeks to undermine it with piece pressure and well-timed pawn breaks.\n\n1...d6 prepares:\n\u2022 ...Nf6 attacking e4\n\u2022 ...g6 and ...Bg7 (the fianchetto)\n\u2022 Later ...e5 or ...c5 to challenge the centre",
        opening: "The Pirc Defence"
      },
      {
        id: 'pirc-2',
        fen: "rnbqkbnr/ppp1pppp/3p4/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White builds the centre with d4. Develop your knight!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "2...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight to f6!",
        explanation: "Attacking the e4 pawn immediately! White must decide how to defend it.\n\nThe most common responses are:\n\u2022 3.Nc3 \u2014 the main line\n\u2022 3.Nd2 \u2014 keeping options open\n\u2022 3.Bd3 \u2014 protecting and developing\n\nIn all cases, you'll continue with ...g6, ...Bg7, and look for the right moment to strike with ...e5 or ...c5.",
        opening: "The Pirc Defence"
      },
      {
        id: 'pirc-3',
        fen: "rnbqkb1r/ppp1pppp/3p1n2/8/3PP3/2N5/PPP2PPP/R1BQKBNR b KQkq - 2 3",
        prompt: "White plays Nc3. Continue the fianchetto!",
        correct: [{ from: [6, 6], to: [6, 5] }],
        san: "3...g6",
        moveNotation: "g7 \u2192 g6",
        hintPiece: [6, 6],
        hintSquare: [6, 5],
        shortTip: "Play g6 \u2014 prepare the fianchetto!",
        explanation: "The kingside fianchetto is the heart of the Pirc. Your bishop on g7 will be a powerful piece.\n\nThe Pirc is a flexible, resilient defence. White has space, but Black's pieces are well-coordinated and ready to spring into action. Many strong players use the Pirc as a surprise weapon.",
        opening: "The Pirc Defence"
      },
      {
        id: 'pirc-4',
        fen: "rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N2N2/PPP2PPP/R1BQKB1R b KQkq - 3 4",
        prompt: "White develops Nf3. Complete your fianchetto!",
        correct: [{ from: [5, 7], to: [6, 6] }],
        san: "4...Bg7",
        moveNotation: "Bishop f8 \u2192 g7",
        hintPiece: [5, 7],
        hintSquare: [6, 6],
        shortTip: "Fianchetto to g7!",
        explanation: "Your bishop takes its commanding post on g7. From here:\n\u2022 It controls the long diagonal\n\u2022 It supports a future ...e5 break\n\u2022 It defends your king after castling\n\nThe Pirc/Modern setup with ...d6, ...Nf6, ...g6, ...Bg7 is one of the most resilient defensive structures in chess. You'll castle next, then look for counterplay with ...e5 or ...c5.",
        opening: "The Pirc Defence"
      }
    ]
  },

  // ==========================================================================
  // 15. THE ENGLISH OPENING
  // ==========================================================================
  english: {
    name: "The English Opening",
    description: "Against 1.c4, a reversed Sicilian approach gives Black excellent chances.",
    positions: [
      {
        id: 'english-1',
        fen: "rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays c4 \u2014 the English Opening. Seize the centre!",
        correct: [{ from: [4, 6], to: [4, 4] }],
        san: "1...e5",
        moveNotation: "e7 \u2192 e5",
        hintPiece: [4, 6],
        hintSquare: [4, 4],
        shortTip: "Play e5 \u2014 take the centre!",
        explanation: "The Reversed Sicilian! By playing ...e5 against the English, you get a Sicilian-type position but with an extra tempo.\n\nThis is one of the most logical responses to 1.c4:\n\u2022 You occupy the centre immediately\n\u2022 You take space on the kingside\n\u2022 You'll develop naturally with ...Nf6, ...Nc6, ...Bc5 or ...Be7\n\nBotvinnik and Korchnoi were great practitioners of 1...e5 against the English.",
        opening: "English: Reversed Sicilian"
      },
      {
        id: 'english-2',
        fen: "rnbqkbnr/pppp1ppp/8/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq - 1 2",
        prompt: "White develops Nc3. Develop your knight!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "2...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight to f6!",
        explanation: "Natural development, controlling the centre. Your knight eyes d5 and can support ...d5 later.\n\nThe English Opening often transposes into other openings, which is part of its charm and complexity. Black's setup with ...e5 and ...Nf6 is flexible enough to handle any transposition.",
        opening: "English: Reversed Sicilian"
      },
      {
        id: 'english-3',
        fen: "rnbqkb1r/pppp1ppp/5n2/4p3/2P5/2N3P1/PP1PPP1P/R1BQKBNR b KQkq - 0 3",
        prompt: "White fianchettoes with g3. Develop your bishop!",
        correct: [{ from: [5, 7], to: [1, 3] }],
        san: "3...Bb4",
        moveNotation: "Bishop f8 \u2192 b4",
        hintPiece: [5, 7],
        hintSquare: [1, 3],
        shortTip: "Pin the knight with Bb4!",
        explanation: "An aggressive response! By pinning the c3 knight, you fight for control of the d5 square.\n\nThis is similar in spirit to the Nimzo-Indian \u2014 using piece pressure rather than pawns to influence the centre. Your bishop on b4:\n\u2022 Pins the knight, reducing White's control of d5\n\u2022 Can retreat to e7 or exchange on c3 depending on the position\n\u2022 Creates concrete threats early",
        opening: "English: Four Knights"
      }
    ]
  },

  // ==========================================================================
  // 16. THE DUTCH DEFENCE
  // ==========================================================================
  dutch: {
    name: "The Dutch Defence",
    description: "An aggressive response to 1.d4 \u2014 fighting for kingside control from move one.",
    positions: [
      {
        id: 'dutch-1',
        fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays d4. Time for something aggressive!",
        correct: [{ from: [5, 6], to: [5, 4] }],
        san: "1...f5",
        moveNotation: "f7 \u2192 f5",
        hintPiece: [5, 6],
        hintSquare: [5, 4],
        shortTip: "Play f5 \u2014 the Dutch Defence!",
        explanation: "The Dutch Defence \u2014 an ambitious, fighting response to 1.d4! By playing ...f5, you immediately fight for control of the e4 square.\n\nThe Dutch has been played by World Champions from Alekhine to Carlsen. It signals Black's intention to play for the win from the very first move.\n\nThe three main systems are:\n\u2022 The Leningrad (with ...g6 and ...Bg7)\n\u2022 The Stonewall (with ...d5, ...c6, ...e6)\n\u2022 The Classical (with ...e6 and ...Be7)",
        opening: "The Dutch Defence"
      },
      {
        id: 'dutch-2',
        fen: "rnbqkbnr/ppppp1pp/8/5p2/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White plays c4. Develop your knight!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "2...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight to f6!",
        explanation: "The knight controls e4 \u2014 the key square in the Dutch. Your knight on f6 prevents White from easily occupying e4 with a pawn.\n\nFrom here, you'll choose your Dutch system:\n\u2022 ...g6 leads to the Leningrad Dutch\n\u2022 ...e6 leads to the Classical or Stonewall\n\nBoth are rich, complex systems with plenty of winning chances for Black.",
        opening: "The Dutch Defence"
      },
      {
        id: 'dutch-3',
        fen: "rnbqkb1r/ppppp1pp/5n2/5p2/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq - 0 3",
        prompt: "White fianchettoes with g3. Begin the Leningrad setup!",
        correct: [{ from: [6, 6], to: [6, 5] }],
        san: "3...g6",
        moveNotation: "g7 \u2192 g6",
        hintPiece: [6, 6],
        hintSquare: [6, 5],
        shortTip: "Play g6 \u2014 the Leningrad Dutch!",
        explanation: "The Leningrad Dutch \u2014 named after the great Soviet chess school. This is the most dynamic version of the Dutch.\n\nYou'll fianchetto your bishop on g7, creating a powerful setup:\n\u2022 The bishop controls the long diagonal\n\u2022 Combined with ...f5, you have a natural kingside attack\n\u2022 The ...e5 break gives you central counterplay\n\nThe Leningrad was favoured by Mikhail Gurevich and has been played by Hikaru Nakamura at the top level.",
        opening: "The Leningrad Dutch"
      },
      {
        id: 'dutch-4',
        fen: "rnbqkb1r/ppppp2p/5np1/5p2/2PP4/6P1/PP2PPBP/RNBQK1NR b KQkq - 1 4",
        prompt: "White completed their fianchetto. Complete yours!",
        correct: [{ from: [5, 7], to: [6, 6] }],
        san: "4...Bg7",
        moveNotation: "Bishop f8 \u2192 g7",
        hintPiece: [5, 7],
        hintSquare: [6, 6],
        shortTip: "Fianchetto to g7!",
        explanation: "Both bishops are fianchettoed \u2014 a double-fianchetto battle! Your Bg7 is a powerful piece that:\n\u2022 Controls the long diagonal\n\u2022 Supports the ...e5 break\n\u2022 Provides excellent king coverage after castling\n\nThe Leningrad Dutch leads to rich, strategic battles where understanding matters more than memorisation. Castle next, then prepare ...d6 and ...e5.",
        opening: "The Leningrad Dutch"
      }
    ]
  },

  // ==========================================================================
  // 17. THE BENONI DEFENCE
  // ==========================================================================
  benoni: {
    name: "The Benoni Defence",
    description: "A sharp, dynamic response to 1.d4 where Black accepts structural weaknesses for active piece play and a kingside attack.",
    positions: [
      {
        id: 'benoni-1',
        fen: "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays 1.d4. Signal your intent to play the Benoni!",
        correct: [{ from: [6, 7], to: [5, 5] }, { from: [2, 6], to: [2, 4] }],
        san: "1...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight to f6 first!",
        explanation: "The Benoni starts with 1...Nf6, keeping your options flexible. After White plays 2.c4, you'll strike with 2...c5 to challenge the centre.\n\nThe Modern Benoni leads to unbalanced, tactical positions where Black aims for queenside counterplay with ...b5 and a kingside attack. Mikhail Tal was a famous practitioner of this dynamic defence.",
        opening: "The Benoni Defence"
      },
      {
        id: 'benoni-2',
        fen: "rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3",
        prompt: "White captured with d5. Push your e-pawn to challenge the centre!",
        correct: [{ from: [4, 6], to: [4, 5] }],
        san: "3...e6",
        moveNotation: "e7 \u2192 e6",
        hintPiece: [4, 6],
        hintSquare: [4, 5],
        shortTip: "Strike at the d5 pawn with e6!",
        explanation: "This is the Modern Benoni structure. By playing ...e6, you undermine White's d5 pawn and prepare to open the e-file after ...exd5.\n\nAfter the exchange on d5, Black gets:\n\u2022 A beautiful long diagonal for the Bg7 (after ...g6)\n\u2022 The semi-open e-file\n\u2022 A queenside pawn majority to advance with ...b5\n\nThis is one of the sharpest and most fun openings in chess!",
        opening: "The Benoni Defence"
      },
      {
        id: 'benoni-3',
        fen: "rnbqkb1r/pp1p1ppp/4pn2/2pP4/2P5/2N5/PP2PPPP/R1BQKBNR b KQkq - 1 4",
        prompt: "White developed their knight. Capture on d5!",
        correct: [{ from: [4, 5], to: [3, 4] }],
        san: "4...exd5",
        moveNotation: "e6 captures d5",
        hintPiece: [4, 5],
        hintSquare: [3, 4],
        shortTip: "Capture the d5 pawn!",
        explanation: "After ...exd5 cxd5, the Modern Benoni pawn structure emerges. Black has a queenside pawn majority (a7, b7, c5 vs White's a2, b2) and the half-open e-file.\n\nBlack's plan:\n\u2022 Fianchetto with ...g6 and ...Bg7\n\u2022 Castle and play ...d6\n\u2022 Advance ...b5 when ready\n\u2022 Use the knight on d7 to support ...b5 or reroute to c5",
        opening: "The Benoni Defence"
      }
    ]
  },

  // ==========================================================================
  // 18. THE SCANDINAVIAN DEFENCE
  // ==========================================================================
  scandinavian: {
    name: "The Scandinavian Defence",
    description: "An ancient defence where Black immediately challenges White's e4 pawn with 1...d5.",
    positions: [
      {
        id: 'scandi-1',
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays 1.e4. Immediately challenge the centre!",
        correct: [{ from: [3, 6], to: [3, 4] }],
        san: "1...d5",
        moveNotation: "d7 \u2192 d5",
        hintPiece: [3, 6],
        hintSquare: [3, 4],
        shortTip: "Strike directly at e4 with d5!",
        explanation: "The Scandinavian Defence (also called the Center Counter) is one of the oldest recorded openings, dating back to 1475!\n\nBy playing 1...d5, Black immediately challenges White's central pawn. After 2.exd5 Qxd5, the queen comes out early but is hard for White to gain tempo against.\n\nThe Scandinavian is practical and solid \u2014 Magnus Carlsen has used it in rapid games, and it avoids the vast theory of the Sicilian or French.",
        opening: "The Scandinavian Defence"
      },
      {
        id: 'scandi-2',
        fen: "rnbqkbnr/ppp1pppp/8/3P4/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White captured your pawn. Recapture with your queen!",
        correct: [{ from: [3, 7], to: [3, 4] }],
        san: "2...Qxd5",
        moveNotation: "Queen d8 \u2192 d5",
        hintPiece: [3, 7],
        hintSquare: [3, 4],
        shortTip: "Take back with the queen!",
        explanation: "Bringing the queen out early breaks a traditional principle, but here it works! Your queen on d5 is centralised and applies pressure.\n\nAfter White plays Nc3, you'll retreat to a5 (the Scandinavian Main Line) where the queen remains active and safe.\n\nThe advantage: you develop with purpose and avoid complex theory. Many club players struggle against the Scandinavian because the positions are unique.",
        opening: "The Scandinavian Defence"
      },
      {
        id: 'scandi-3',
        fen: "rnb1kbnr/ppp1pppp/8/q7/8/2N2N2/PPPP1PPP/R1BQKB1R b KQkq - 3 4",
        prompt: "You've retreated your queen to a5. Develop your knight!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "4...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Develop your knight toward the centre!",
        explanation: "Natural development! The knight on f6 does everything Black wants:\n\u2022 Controls d5 and e4 squares\n\u2022 Prepares kingside castling\n\u2022 Develops with a threat to White's e-pawn if White is careless\n\nBlack will continue with ...Bf5 or ...Bg4 (developing the bishop before closing the diagonal with ...e6), then ...e6, ...Bb4 or ...Be7, and castle. A solid, logical setup.",
        opening: "The Scandinavian Defence"
      }
    ]
  },

  // ==========================================================================
  // 19. THE ALEKHINE DEFENCE
  // ==========================================================================
  alekhine: {
    name: "The Alekhine Defence",
    description: "A provocative opening where Black invites White to advance pawns, then counterattacks the overextended centre.",
    positions: [
      {
        id: 'alekhine-1',
        fen: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
        prompt: "White plays 1.e4. Provoke their pawns forward!",
        correct: [{ from: [6, 7], to: [5, 5] }],
        san: "1...Nf6",
        moveNotation: "Knight g8 \u2192 f6",
        hintPiece: [6, 7],
        hintSquare: [5, 5],
        shortTip: "Attack the e4 pawn with Nf6!",
        explanation: "The Alekhine Defence \u2014 named after the fourth World Champion, Alexander Alekhine. This provocative move immediately attacks White's e4 pawn.\n\nThe idea is hypermodern: instead of occupying the centre with pawns, you invite White to advance (2.e5), then systematically undermine their overextended pawns.\n\nBobby Fischer called it 'unsound' but still lost to it! The Alekhine remains a respected weapon at all levels.",
        opening: "The Alekhine Defence"
      },
      {
        id: 'alekhine-2',
        fen: "rnbqkb1r/pppppppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2",
        prompt: "White pushed e5, attacking your knight. Where should it go?",
        correct: [{ from: [5, 5], to: [3, 4] }],
        san: "2...Nd5",
        moveNotation: "Knight f6 \u2192 d5",
        hintPiece: [5, 5],
        hintSquare: [3, 4],
        shortTip: "Centralise the knight on d5!",
        explanation: "Your knight retreats to the powerful d5 square \u2014 a perfect central outpost! White has gained space with e5, but this pawn can become a target.\n\nBlack's strategy:\n\u2022 Play ...d6 to challenge the e5 pawn\n\u2022 Develop pieces to attack the centre\n\u2022 White's advanced pawns can become weaknesses if overextended\n\nThe knight may move again after c4, but this dance is part of the opening's plan.",
        opening: "The Alekhine Defence"
      }
    ]
  }
};

// Flatten all positions into a single array
export const POSITIONS = Object.values(OPENINGS).flatMap(o => o.positions);
