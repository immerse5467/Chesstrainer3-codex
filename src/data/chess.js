// ============================================================================
// CHESS LOGIC
// ============================================================================
const PIECE_CHARS = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' };

export function parseFEN(fen) {
  const pieces = [];
  const rows = fen.split(' ')[0].split('/');
  for (let rank = 7; rank >= 0; rank--) {
    let file = 0;
    for (const c of rows[7 - rank]) {
      if (c >= '1' && c <= '8') {
        file += parseInt(c);
      } else {
        pieces.push({
          type: PIECE_CHARS[c.toUpperCase()],
          color: c === c.toUpperCase() ? 'white' : 'black',
          file,
          rank
        });
        file++;
      }
    }
  }
  return pieces;
}
