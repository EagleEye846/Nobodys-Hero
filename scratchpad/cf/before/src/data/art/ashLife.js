// The Ash Road's small things (the life pass, 14 November 2026): what the people who
// lived here left behind, and the dead trees and stumps that stand round them. A scarecrow,
// a kettle on its stones, a child's shoe, a gate in a fence that has gone, a well and its
// bucket, a tree with a child's heights notched up it, a dinner bell, a pump, a chimney with no
// house, a snowman somebody built, the cairns Bramble takes the spare rags off. Drawn like
// ashProps.js, with its painter and its colours (same palette, so same characters); every id
// starts `al_`. Most of them are things to look at (Z); the flat bits and the low heaps
// have no body and you walk over them.

import { AR_PALETTE, Grid, roll, OUT, ASH, CHAR, STONE, RAG, WOOD, SAND, HOT } from './ashProps.js';

export const AL_PALETTE = AR_PALETTE;

const IRON = ['#1c1a1a', '#3a3636', '#5a5450', '#7a746c'];
const CLOTH = ['#2e2824', '#4a3e34', '#6a5a48', '#8a7a62'];
const BRICK = ['#2a1a16', '#4a2c24', '#6a3e30', '#8a5642'];
const SOOT = '#16110f';

// Ash drifted up to the foot of a thing, w wide, along the bottom of the grid.
function drift(g, x0, x1, y, rise = 3) {
  const mid = (x0 + x1) / 2;
  for (let x = x0; x <= x1; x++) {
    const d = Math.abs(x - mid) / ((x1 - x0) / 2 + 0.5);
    const top = y - Math.round(rise * (1 - d * d) + roll(x) * 0.6);
    g.rect(x, top, 1, y - top + 1, ASH[2]);
    g.set(x, top, ASH[3]);
  }
}

// --- A scarecrow burnt down to its post and arms, a few tatters, half a sack face. ---
function scarecrow() {
  const g = new Grid(22, 34);
  g.rect(10, 8, 3, 26, CHAR[1]);
  g.rect(11, 8, 1, 26, WOOD[1]);
  g.rect(9, 31, 5, 3, CHAR[1]);
  // The crossed arms, one drooping.
  g.line(2, 13, 20, 12, CHAR[1]);
  g.line(2, 14, 20, 13, WOOD[1]);
  g.line(2, 14, 1, 19, CHAR[1]);
  // Tatters of sleeve and shirt.
  g.poly([[4, 13], [9, 13], [8, 21], [5, 19]], CLOTH[1]);
  g.poly([[14, 13], [19, 13], [18, 18], [15, 20]], CLOTH[0]);
  g.rect(8, 15, 6, 8, CLOTH[1]);
  g.rect(9, 17, 3, 5, CLOTH[2]);
  g.rect(8, 22, 2, 2, CLOTH[0]);
  g.rect(12, 21, 2, 3, CLOTH[0]);
  // The head: a sack, scorched down one side, with a stitched mouth.
  g.oval(11, 6, 4, 4, CLOTH[3]);
  g.oval(13, 7, 2, 3, CHAR[2]);
  g.set(9, 5, OUT);
  g.set(12, 5, OUT);
  g.line(9, 8, 12, 8, OUT);
  g.set(9, 7, OUT);
  g.set(12, 7, OUT);
  // A bit of a hat.
  g.rect(7, 2, 8, 1, CHAR[1]);
  g.rect(9, 0, 4, 2, CHAR[1]);
  g.rect(8, 1, 1, 1, ASH[3]);
  drift(g, 4, 18, 33, 2);
  g.outline(OUT);
  return g.rows();
}

// --- A kettle on three stones. ---
function kettle() {
  const g = new Grid(14, 12);
  g.rect(1, 9, 4, 3, STONE[2]);
  g.rect(9, 9, 4, 3, STONE[2]);
  g.rect(5, 10, 4, 2, STONE[1]);
  g.rect(1, 9, 4, 1, STONE[3]);
  g.rect(9, 9, 4, 1, STONE[3]);
  g.oval(7, 6, 4, 3, IRON[1]);
  g.rect(3, 6, 9, 3, IRON[1]);
  g.rect(4, 4, 6, 1, IRON[2]);
  g.rect(6, 3, 2, 1, IRON[3]);
  g.line(3, 4, 11, 4, IRON[3]);
  // Spout and handle.
  g.line(11, 5, 13, 3, IRON[2]);
  g.set(13, 2, IRON[1]);
  g.line(3, 5, 1, 7, IRON[2]);
  g.rect(5, 6, 1, 2, IRON[3]);
  g.rect(6, 3, 3, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A child's shoe on its side. ---
function shoe() {
  const g = new Grid(11, 7);
  g.poly([[1, 5], [2, 2], [6, 2], [9, 4], [9, 6], [1, 6]], '#4a3a30');
  g.rect(1, 5, 9, 1, '#2a2018');
  g.rect(2, 2, 3, 1, '#6a5240');
  g.set(7, 3, '#6a5240');
  g.set(3, 3, ASH[3]);
  g.set(4, 3, ASH[3]);
  g.line(5, 3, 8, 5, '#8a7660');
  g.line(2, 2, 0, 3, '#8a7660');
  g.outline(OUT);
  return g.rows();
}

// --- A rag doll sitting against nothing, one arm up. ---
function doll() {
  const g = new Grid(10, 12);
  g.rect(3, 7, 4, 4, CLOTH[2]);
  g.rect(2, 10, 2, 2, CLOTH[1]);
  g.rect(6, 10, 2, 2, CLOTH[1]);
  g.oval(5, 4, 2, 2, '#b8a488');
  g.set(4, 4, SOOT);
  g.set(6, 4, SOOT);
  g.line(4, 6, 6, 6, '#6a3a30');
  g.line(2, 8, 1, 5, CLOTH[2]);
  g.line(7, 8, 9, 9, CLOTH[2]);
  g.rect(3, 1, 4, 1, CLOTH[0]);
  g.set(7, 2, CLOTH[0]);
  g.set(2, 2, CLOTH[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A gate shut between two posts, with no fence either side. Two tiles wide. ---
function gate() {
  const g = new Grid(32, 26);
  g.rect(2, 4, 3, 22, CHAR[1]);
  g.rect(3, 4, 1, 22, WOOD[1]);
  g.rect(27, 4, 3, 22, CHAR[1]);
  g.rect(28, 4, 1, 22, WOOD[1]);
  g.rect(1, 3, 5, 1, CHAR[2]);
  g.rect(26, 3, 5, 1, CHAR[2]);
  // The gate: top and bottom rails, a diagonal, upright slats, a latch.
  g.rect(5, 9, 22, 2, WOOD[2]);
  g.rect(5, 18, 22, 2, WOOD[2]);
  g.rect(5, 9, 22, 1, WOOD[3]);
  for (let x = 7; x < 26; x += 4) g.rect(x, 11, 1, 7, WOOD[1]);
  g.line(6, 19, 26, 10, WOOD[1]);
  g.line(6, 20, 26, 11, CHAR[2]);
  g.rect(24, 13, 3, 2, IRON[2]);
  g.set(24, 14, IRON[3]);
  // Charred along the edges, ash on the top.
  g.rect(8, 9, 4, 1, CHAR[1]);
  g.rect(16, 18, 5, 1, CHAR[1]);
  g.rect(6, 8, 8, 1, ASH[3]);
  g.rect(18, 8, 7, 1, ASH[3]);
  g.rect(1, 2, 5, 1, ASH[3]);
  drift(g, 0, 31, 25, 2);
  g.outline(OUT);
  return g.rows();
}

// --- A well: a ring of stone, a windlass on two posts, the bucket hanging. Two tiles wide. ---
function well() {
  const g = new Grid(32, 34);
  // The posts and the beam over the top.
  g.rect(6, 6, 3, 24, CHAR[1]);
  g.rect(7, 6, 1, 24, WOOD[1]);
  g.rect(23, 6, 3, 24, CHAR[1]);
  g.rect(24, 6, 1, 24, WOOD[1]);
  g.rect(5, 4, 22, 3, WOOD[2]);
  g.rect(5, 4, 22, 1, WOOD[3]);
  g.rect(6, 3, 8, 1, ASH[3]);
  // The roller, a crank, and the rope down to the bucket.
  g.rect(8, 8, 16, 3, CHAR[1]);
  g.rect(8, 8, 16, 1, WOOD[2]);
  g.line(24, 10, 29, 12, IRON[2]);
  g.rect(29, 12, 2, 4, WOOD[1]);
  g.line(15, 11, 15, 21, CLOTH[3]);
  g.rect(13, 21, 5, 4, WOOD[2]);
  g.rect(13, 21, 5, 1, IRON[2]);
  g.rect(13, 24, 5, 1, IRON[1]);
  // The stone ring.
  g.rect(4, 24, 24, 9, STONE[2]);
  g.rect(4, 24, 24, 2, STONE[3]);
  for (let y = 26; y < 33; y += 3) for (let x = 4 + (((y - 26) / 3) % 2) * 3; x < 28; x += 6) g.rect(x, y, 5, 2, roll(x + y) < 0.5 ? STONE[1] : STONE[2]);
  g.rect(4, 32, 24, 1, STONE[0]);
  // The dark of the mouth.
  g.rect(8, 24, 16, 2, SOOT);
  g.rect(9, 22, 4, 2, ASH[3]);
  drift(g, 0, 31, 33, 2);
  g.outline(OUT);
  return g.rows();
}

// --- A tree with a child's height notched up it, year on year, and a name. ---
function nameTree() {
  const g = new Grid(26, 44);
  // Trunk and roots, branches fingering up.
  g.rect(9, 12, 8, 30, CHAR[1]);
  g.rect(11, 12, 2, 30, CHAR[2]);
  g.poly([[7, 42], [9, 36], [17, 36], [19, 42]], CHAR[1]);
  g.thick(10, 14, 3, 2, 2, CHAR[1]);
  g.thick(16, 14, 23, 3, 2, CHAR[1]);
  g.line(12, 12, 12, 2, CHAR[1]);
  g.line(4, 8, 2, 4, CHAR[1]);
  g.line(22, 7, 24, 3, CHAR[1]);
  g.line(7, 6, 5, 2, CHAR[1]);
  g.line(19, 5, 20, 1, CHAR[1]);
  // The notches, closer to the ground the earlier (a name beside the last).
  const marks = [38, 34, 30, 26, 23];
  marks.forEach((y, i) => {
    g.rect(10, y, 4 + (i % 2), 1, WOOD[3]);
    g.set(10, y + 1, SOOT);
  });
  // Three small letters beside the highest notch.
  g.rect(15, 22, 1, 3, WOOD[3]);
  g.rect(17, 22, 1, 3, WOOD[3]);
  g.set(16, 22, WOOD[3]);
  g.rect(15, 27, 3, 1, WOOD[3]);
  g.rect(15, 28, 1, 2, WOOD[3]);
  g.rect(17, 28, 1, 2, WOOD[3]);
  g.rect(16, 29, 1, 1, WOOD[3]);
  // Ash on the forks.
  g.rect(8, 13, 3, 1, ASH[3]);
  g.rect(15, 14, 3, 1, ASH[3]);
  g.rect(11, 11, 2, 1, ASH[3]);
  drift(g, 5, 21, 43, 2);
  g.outline(OUT);
  return g.rows();
}

// --- A dead tree of the sort that stands back from the road. Two shapes. ---
function snagTree(variant) {
  const g = new Grid(24, 46);
  const lean = variant ? -1 : 1;
  g.rect(10, 20, 5, 25, CHAR[1]);
  g.rect(12, 20, 1, 25, CHAR[2]);
  g.poly([[8, 45], [10, 39], [15, 39], [17, 45]], CHAR[1]);
  // Branches, each forking.
  const branches = variant
    ? [[11, 24, 3, 14], [14, 22, 22, 12], [11, 18, 6, 5], [13, 14, 19, 4], [12, 10, 12, 1], [5, 13, 3, 9]]
    : [[11, 26, 2, 16], [14, 24, 21, 14], [12, 17, 7, 6], [13, 12, 18, 6], [12, 8, 11, 1], [18, 9, 22, 3]];
  for (const [x0, y0, x1, y1] of branches) {
    g.line(x0, y0, x1, y1, CHAR[1]);
    g.line(x1, y1, x1 + lean * 2, y1 - 2, CHAR[1]);
    g.line(x1, y1, x1 - lean * 2, y1 - 1, CHAR[1]);
  }
  g.rect(10, 19, 5, 2, CHAR[1]);
  g.rect(11, 39, 3, 1, ASH[3]);
  g.rect(9, 41, 2, 1, ASH[3]);
  // Ash lying along a bough or two.
  g.rect(14, 22, 3, 1, ASH[3]);
  g.rect(12, 17, 2, 1, ASH[3]);
  drift(g, 6, 18, 45, 2);
  g.outline(OUT);
  return g.rows();
}

// --- A tall stump, snapped, with a split top, and a seedling-sized burr on its side. ---
function snag() {
  const g = new Grid(16, 28);
  g.poly([[3, 27], [5, 12], [7, 6], [8, 12], [10, 4], [12, 12], [13, 27]], CHAR[1]);
  g.rect(7, 10, 2, 17, CHAR[2]);
  g.line(7, 6, 6, 3, CHAR[1]);
  g.line(10, 4, 11, 1, CHAR[1]);
  g.rect(8, 4, 2, 1, ASH[3]);
  g.rect(4, 14, 1, 8, ROUGH());
  g.rect(11, 12, 1, 9, ROUGH());
  drift(g, 1, 15, 27, 2);
  g.outline(OUT);
  return g.rows();
}
function ROUGH() {
  return '#3a2e26';
}

// --- A bucket on its side, rolled a little way. ---
function bucket() {
  const g = new Grid(12, 9);
  g.poly([[2, 2], [8, 1], [9, 7], [2, 8]], WOOD[2]);
  g.line(3, 2, 3, 7, WOOD[1]);
  g.line(6, 1, 7, 7, WOOD[1]);
  g.rect(8, 1, 2, 7, IRON[1]);
  g.oval(2, 5, 1, 3, SOOT);
  g.line(2, 1, 6, 0, IRON[2]);
  g.rect(0, 8, 8, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A barrel with burst staves. ---
function barrel() {
  const g = new Grid(16, 18);
  g.oval(8, 9, 6, 7, WOOD[2]);
  g.rect(2, 4, 12, 11, WOOD[2]);
  g.oval(8, 4, 5, 2, WOOD[3]);
  g.oval(8, 4, 3, 1, SOOT);
  for (const x of [4, 7, 10, 13]) g.line(x, 5, x, 14, WOOD[1]);
  g.rect(2, 6, 12, 1, IRON[2]);
  g.rect(2, 13, 12, 1, IRON[2]);
  g.rect(3, 15, 10, 1, WOOD[1]);
  g.rect(10, 3, 3, 12, CHAR[2]);
  g.rect(5, 2, 4, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A single chair, facing the view. ---
function chair() {
  const g = new Grid(14, 20);
  g.rect(3, 2, 8, 2, CHAR[1]);
  g.rect(3, 2, 8, 1, WOOD[2]);
  g.rect(3, 4, 1, 7, CHAR[1]);
  g.rect(10, 4, 1, 7, CHAR[1]);
  g.rect(5, 4, 1, 6, WOOD[1]);
  g.rect(8, 4, 1, 6, WOOD[1]);
  g.rect(2, 11, 10, 2, WOOD[2]);
  g.rect(2, 11, 10, 1, WOOD[3]);
  g.rect(2, 13, 2, 6, CHAR[1]);
  g.rect(10, 13, 2, 6, CHAR[1]);
  g.rect(2, 17, 10, 1, WOOD[1]);
  g.rect(4, 10, 3, 1, ASH[3]);
  g.rect(4, 1, 3, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A birdhouse on a post. ---
function birdhouse() {
  const g = new Grid(14, 30);
  g.rect(6, 12, 3, 18, CHAR[1]);
  g.rect(7, 12, 1, 18, WOOD[1]);
  g.rect(4, 28, 7, 2, CHAR[1]);
  g.rect(2, 4, 11, 9, WOOD[2]);
  g.rect(2, 4, 11, 1, WOOD[3]);
  g.poly([[0, 5], [7, 0], [14, 5]], CHAR[2]);
  g.line(1, 5, 7, 1, WOOD[1]);
  g.oval(7, 8, 2, 2, SOOT);
  g.rect(6, 12, 3, 1, WOOD[3]);
  g.rect(5, 11, 5, 1, WOOD[1]);
  g.rect(4, 3, 5, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A straw bee skep, burnt through. ---
function skep() {
  const g = new Grid(16, 14);
  g.oval(8, 8, 6, 5, '#7a6234');
  g.rect(2, 8, 12, 5, '#7a6234');
  for (const y of [5, 8, 11]) g.line(3, y, 13, y, '#4a3a1e');
  g.oval(8, 11, 2, 2, SOOT);
  g.oval(11, 6, 2, 2, CHAR[1]);
  g.rect(2, 12, 12, 1, '#4a3a1e');
  g.rect(5, 3, 4, 1, ASH[3]);
  g.rect(1, 13, 14, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A long stone trough with a skin of ash. Two tiles wide. ---
function trough() {
  const g = new Grid(32, 14);
  g.rect(1, 4, 30, 10, STONE[2]);
  g.rect(1, 4, 30, 2, STONE[3]);
  g.rect(3, 6, 26, 4, STONE[0]);
  g.rect(4, 7, 24, 2, ASH[2]);
  g.rect(8, 6, 10, 1, ASH[3]);
  for (const x of [1, 29]) g.rect(x, 4, 2, 10, STONE[1]);
  g.rect(1, 13, 30, 1, STONE[0]);
  g.outline(OUT);
  return g.rows();
}

// --- A village pump: iron body, a long handle, a spout, a stone step. ---
function pump() {
  const g = new Grid(18, 28);
  g.rect(5, 26, 8, 2, STONE[2]);
  g.rect(5, 26, 8, 1, STONE[3]);
  g.rect(7, 8, 4, 18, IRON[1]);
  g.rect(8, 8, 1, 18, IRON[3]);
  g.rect(6, 5, 6, 4, IRON[2]);
  g.rect(6, 5, 6, 1, IRON[3]);
  g.rect(8, 3, 2, 3, IRON[1]);
  // The handle, up and back.
  g.line(10, 6, 17, 3, IRON[2]);
  g.line(10, 7, 17, 4, IRON[1]);
  g.rect(16, 2, 2, 3, WOOD[1]);
  // The spout.
  g.rect(2, 15, 6, 2, IRON[2]);
  g.rect(1, 16, 2, 3, IRON[1]);
  g.set(9, 4, ASH[3]);
  g.rect(7, 4, 3, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A letter box on a post, its flag still up. ---
function mailbox() {
  const g = new Grid(14, 28);
  g.rect(6, 10, 3, 18, CHAR[1]);
  g.rect(7, 10, 1, 18, WOOD[1]);
  g.rect(4, 26, 7, 2, CHAR[1]);
  g.rect(2, 3, 11, 8, IRON[1]);
  g.rect(2, 3, 11, 2, IRON[2]);
  g.rect(3, 6, 2, 3, SOOT);
  g.rect(3, 2, 8, 1, ASH[3]);
  // The little flag, up.
  g.rect(12, 0, 1, 7, IRON[1]);
  g.rect(9, 0, 3, 2, RAG[1]);
  g.rect(9, 0, 3, 1, RAG[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A signboard half sunk in the ash: "FRESH APPLES", most of it gone. ---
function signboard() {
  const g = new Grid(28, 28);
  g.rect(4, 12, 3, 16, CHAR[1]);
  g.rect(21, 12, 3, 16, CHAR[1]);
  g.rect(2, 3, 24, 11, WOOD[2]);
  g.rect(2, 3, 24, 1, WOOD[3]);
  g.rect(2, 13, 24, 1, CHAR[1]);
  // The letters, painted, and then fire: some left, some gone, one apple.
  for (const [x, w] of [[4, 2], [7, 1], [9, 2], [12, 3], [18, 2], [21, 2]]) g.rect(x, 5, w, 4, RAG[1]);
  g.rect(8, 10, 5, 1, RAG[1]);
  g.rect(17, 7, 7, 6, CHAR[2]);
  g.oval(15, 11, 1, 1, RAG[2]);
  g.set(15, 9, '#4f8a4a');
  g.rect(3, 2, 10, 1, ASH[3]);
  drift(g, 0, 27, 27, 3);
  g.outline(OUT);
  return g.rows();
}

// --- An axe left standing in a stump, its handle burnt short. ---
function stumpAxe() {
  const g = new Grid(18, 22);
  g.rect(3, 12, 11, 9, CHAR[1]);
  g.oval(8, 12, 5, 2, WOOD[2]);
  g.oval(8, 12, 3, 1, WOOD[3]);
  g.rect(2, 20, 13, 1, CHAR[0]);
  g.rect(8, 3, 2, 10, WOOD[1]);
  g.rect(8, 3, 1, 10, WOOD[2]);
  // The head, bitten into the wood.
  g.rect(5, 3, 4, 5, IRON[2]);
  g.rect(5, 3, 1, 5, IRON[3]);
  g.rect(4, 4, 1, 3, IRON[3]);
  g.set(9, 4, IRON[1]);
  g.rect(6, 2, 3, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A dinner bell on a post, its rope burnt to a knot. ---
function dinnerBell() {
  const g = new Grid(18, 32);
  g.rect(8, 8, 3, 24, CHAR[1]);
  g.rect(9, 8, 1, 24, WOOD[1]);
  g.rect(7, 29, 5, 3, CHAR[1]);
  g.rect(4, 7, 11, 2, WOOD[2]);
  g.rect(5, 6, 4, 1, ASH[3]);
  // The bell and the clapper.
  g.poly([[6, 9], [13, 9], [14, 17], [5, 17]], '#8a6a2a');
  g.rect(6, 9, 1, 8, '#b89240');
  g.rect(12, 10, 2, 7, '#5a4018');
  g.rect(5, 17, 10, 1, '#5a4018');
  g.rect(9, 17, 2, 2, IRON[2]);
  // The rope.
  g.line(9, 18, 9, 22, CLOTH[3]);
  g.rect(8, 23, 3, 2, CLOTH[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A lone chimney stack with no house. ---
function chimney() {
  const g = new Grid(22, 44);
  g.rect(5, 6, 12, 38, BRICK[1]);
  for (let y = 7; y < 43; y += 3) for (let x = 5 + (((y - 7) / 3) % 2) * 3; x < 17; x += 6) g.rect(x, y, 5, 2, roll(x * 5 + y) < 0.5 ? BRICK[2] : BRICK[1]);
  g.rect(5, 6, 2, 38, BRICK[3]);
  g.rect(15, 6, 2, 38, BRICK[0]);
  // The cap, a ragged lip, a black throat.
  g.rect(4, 4, 14, 3, STONE[2]);
  g.rect(4, 4, 14, 1, STONE[3]);
  g.rect(7, 4, 8, 1, SOOT);
  g.rect(3, 2, 3, 2, null);
  // A fireplace mouth low down, bricked halfway in ash, soot over it.
  g.rect(7, 32, 8, 10, SOOT);
  g.oval(11, 32, 4, 2, SOOT);
  g.rect(6, 30, 10, 1, STONE[1]);
  g.poly([[5, 44], [17, 44], [14, 39], [8, 39]], ASH[2]);
  g.rect(9, 39, 4, 1, ASH[3]);
  g.rect(5, 5, 4, 1, ASH[3]);
  drift(g, 0, 21, 43, 3);
  g.outline(OUT);
  return g.rows();
}

// --- A snowman somebody built of ash: sticks for arms, coal buttons, a carrot gone brown. ---
function ashman() {
  const g = new Grid(18, 26);
  g.oval(9, 20, 7, 5, ASH[3]);
  g.oval(9, 20, 7, 5, ASH[3]);
  g.oval(9, 12, 5, 4, ASH[3]);
  g.oval(9, 6, 4, 4, ASH[4]);
  g.oval(7, 19, 3, 3, ASH[4]);
  g.rect(3, 22, 12, 2, ASH[2]);
  g.rect(11, 15, 3, 3, ASH[2]);
  // Coal eyes and buttons, a carrot, twig arms.
  g.set(7, 5, SOOT);
  g.set(11, 5, SOOT);
  g.rect(9, 7, 3, 1, '#7a4a1a');
  g.set(12, 7, '#a0601e');
  g.line(7, 8, 8, 9, SOOT);
  g.line(11, 8, 10, 9, SOOT);
  g.set(9, 11, SOOT);
  g.set(9, 13, SOOT);
  g.set(9, 16, SOOT);
  g.line(5, 12, 0, 8, WOOD[1]);
  g.line(0, 8, 0, 6, WOOD[1]);
  g.line(13, 12, 17, 9, WOOD[1]);
  g.line(17, 9, 17, 7, WOOD[1]);
  // A hat of nothing much: a tin pot.
  g.rect(6, 1, 6, 1, IRON[2]);
  g.rect(7, 0, 4, 1, IRON[1]);
  g.rect(8, 2, 2, 1, ASH[3]);
  g.outline('#5a5650');
  return g.rows();
}

// --- A cairn somebody built off the road, a rag on a stick, tied different: the spare. ---
function spareCairn(rag) {
  const g = new Grid(14, 22);
  g.oval(7, 18, 5, 3, STONE[1]);
  g.oval(7, 14, 4, 3, STONE[2]);
  g.oval(7, 10, 3, 2, STONE[1]);
  g.oval(8, 8, 2, 2, STONE[2]);
  for (const [x, y] of [[5, 17], [8, 13], [6, 9]]) g.rect(x, y, 3, 1, STONE[3]);
  g.rect(3, 20, 8, 1, STONE[0]);
  g.rect(5, 15, 3, 1, ASH[3]);
  g.rect(6, 11, 2, 1, ASH[3]);
  // The stick, leaning, and (if it has one) its rag.
  g.line(9, 8, 11, 1, WOOD[1]);
  if (rag) {
    g.rect(11, 1, 3, 2, RAG[2]);
    g.rect(12, 3, 2, 2, RAG[1]);
    g.set(13, 5, RAG[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// --- Things half sunk in the ash: no bodies, just depth. ---
function lowDune(w, seed) {
  const g = new Grid(w, 6);
  const mid = w / 2;
  for (let x = 0; x < w; x++) {
    const d = Math.abs(x - mid) / mid;
    const top = Math.round(5 - 3.2 * Math.pow(Math.max(0, 1 - d * d), 0.8) - roll(seed + x) * 0.5);
    for (let y = top; y < 6; y++) g.set(x, y, y === top ? '#9a968f' : '#85817c');
    if (x > mid) g.set(x, Math.min(5, top + 1), '#7c7873');
  }
  for (let i = 0; i < w / 7; i++) g.set(2 + Math.floor(roll(seed + 40 + i) * (w - 4)), 4, '#a6a29b');
  return g.rows();
}

// --- A cart wheel up to its hub in ash. ---
function wheelSunk() {
  const g = new Grid(22, 20);
  g.oval(11, 11, 9, 9, CHAR[1]);
  g.oval(11, 11, 7, 7, null);
  for (let a = 0; a < 8; a++) g.line(11, 11, 11 + Math.round(Math.cos(a * 0.785) * 7), 11 + Math.round(Math.sin(a * 0.785) * 7), WOOD[1]);
  g.oval(11, 11, 1, 1, IRON[2]);
  g.poly([[0, 20], [22, 20], [19, 12], [3, 12]], ASH[2]);
  g.rect(4, 12, 12, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A stretch of fence, the top of it showing above the ash, going nowhere. ---
function fenceBit() {
  const g = new Grid(30, 14);
  for (const x of [2, 12, 22]) {
    g.rect(x, 3, 3, 11, CHAR[1]);
    g.set(x + 1, 2, CHAR[1]);
  }
  g.rect(0, 5, 30, 2, WOOD[1]);
  g.rect(0, 5, 30, 1, WOOD[2]);
  g.rect(6, 8, 14, 2, CHAR[2]);
  g.rect(2, 4, 8, 1, ASH[3]);
  g.rect(14, 4, 6, 1, ASH[3]);
  g.poly([[0, 14], [30, 14], [27, 10], [3, 10]], ASH[2]);
  g.rect(5, 10, 18, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A burnt log lying along the ground, half under. ---
function log() {
  const g = new Grid(30, 10);
  g.rect(1, 3, 28, 5, CHAR[1]);
  g.oval(2, 5, 2, 3, WOOD[2]);
  g.rect(3, 3, 26, 1, CHAR[2]);
  g.rect(6, 5, 12, 1, CHAR[0]);
  g.rect(20, 4, 6, 1, CHAR[0]);
  g.poly([[0, 10], [30, 10], [27, 7], [3, 7]], ASH[2]);
  g.rect(8, 7, 10, 1, ASH[3]);
  g.rect(5, 2, 8, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A clump of burnt stalks. ---
function stalks() {
  const g = new Grid(14, 12);
  for (let i = 0; i < 8; i++) {
    const x = 1 + Math.floor(roll(i + 5) * 12);
    const h = 4 + Math.floor(roll(i + 12) * 7);
    g.line(x, 11, x + Math.round(roll(i + 20) * 3 - 1.5), 11 - h, i % 3 ? CHAR[2] : '#4a3a2c');
  }
  g.rect(0, 11, 14, 1, ASH[2]);
  g.rect(2, 10, 3, 1, ASH[3]);
  return g.rows();
}

// --- A low wall's end, a few courses of stone, a gap where a door was. Walk over: it is knee high. ---
function wallEnd() {
  const g = new Grid(30, 18);
  g.rect(0, 5, 11, 12, STONE[1]);
  g.rect(19, 9, 11, 8, STONE[1]);
  for (let y = 7; y < 17; y += 3) for (let x = 0 + ((y / 3) % 2) * 3; x < 11; x += 6) g.rect(x, y, 5, 2, roll(x + y) < 0.5 ? STONE[2] : STONE[1]);
  for (let y = 11; y < 17; y += 3) for (let x = 19 + ((y / 3) % 2) * 3; x < 30; x += 6) g.rect(x, y, 5, 2, roll(x + y) < 0.5 ? STONE[2] : STONE[1]);
  g.rect(0, 5, 11, 1, STONE[3]);
  g.rect(19, 9, 11, 1, STONE[3]);
  g.rect(0, 5, 3, 12, SOOT);
  g.rect(1, 4, 5, 1, ASH[3]);
  g.rect(21, 8, 6, 1, ASH[3]);
  g.poly([[11, 17], [19, 17], [17, 14], [13, 14]], ASH[2]);
  g.outline(OUT);
  return g.rows();
}


// --- A flat stone leaning in a corner, with writing scratched on it by a nail. ---
function scratchStone() {
  const g = new Grid(16, 22);
  g.poly([[2, 21], [3, 5], [6, 1], [12, 2], [14, 7], [14, 21]], STONE[2]);
  g.rect(3, 5, 2, 16, STONE[3]);
  g.rect(12, 6, 2, 15, STONE[1]);
  // The scratches: short lines of writing, then a little house with smoke.
  for (const [x, y, w] of [[5, 6, 6], [5, 8, 5], [5, 10, 7], [5, 12, 4]]) {
    for (let i = 0; i < w; i += 2) g.rect(x + i, y, 1, 1, STONE[0]);
    g.rect(x, y + 1, w, 1, STONE[1]);
  }
  g.rect(6, 17, 5, 3, STONE[0]);
  g.poly([[5, 17], [8, 14], [11, 17]], STONE[0]);
  g.set(10, 13, ASH[3]);
  g.set(11, 12, ASH[3]);
  g.rect(5, 3, 5, 1, ASH[3]);
  drift(g, 0, 15, 21, 2);
  g.outline(OUT);
  return g.rows();
}

// --- A scavenger's pile: pans, hinges, a coil of wire, a kettle lid. ---
function salvage() {
  const g = new Grid(20, 14);
  g.oval(6, 9, 4, 2, IRON[1]);
  g.oval(6, 8, 4, 2, IRON[2]);
  g.oval(6, 7, 2, 1, IRON[3]);
  g.rect(9, 7, 7, 1, IRON[1]);
  g.line(10, 6, 18, 2, WOOD[1]);
  g.rect(12, 9, 5, 4, STONE[1]);
  g.rect(12, 9, 5, 1, STONE[3]);
  g.oval(15, 5, 3, 3, IRON[2]);
  g.oval(15, 5, 2, 2, null);
  g.rect(2, 11, 6, 2, IRON[2]);
  g.rect(3, 10, 2, 1, IRON[3]);
  g.rect(13, 12, 5, 1, SOOT);
  g.rect(4, 6, 3, 1, ASH[3]);
  drift(g, 0, 19, 13, 1);
  g.outline(OUT);
  return g.rows();
}

// --- The hedgehog of Hearth: a scavenger with a sack, standing by. 16 wide, 22 tall. ---
const HEDGE = ['#3a2e28', '#5a4a3c', '#7a6652', '#9a8468'];
const SKIN = ['#c8a888', '#e0c4a4'];
const SCARF = ['#7a2418', '#a8402c'];
function hedgehog(frame) {
  const g = new Grid(20, 24);
  // Spines: a spiky dome over the back and round the head, each spine a pale tip on a dark root.
  g.oval(10, 14, 7, 8, HEDGE[1]);
  for (let i = 0; i < 30; i++) {
    const a = Math.PI * (0.95 + (i / 29) * 1.1);
    const r = 8 + (i % 2) * 2.2;
    const x = 10 + Math.cos(a) * r;
    const y = 12 + Math.sin(a) * r * 1.05;
    g.set(x, y, i % 3 ? HEDGE[3] : HEDGE[2]);
    g.set(10 + Math.cos(a) * (r - 1.4), 12 + Math.sin(a) * (r - 1.4) * 1.05, HEDGE[0]);
  }
  for (let i = 0; i < 16; i++) g.set(3 + Math.floor(roll(i + 3) * 14), 6 + Math.floor(roll(i + 9) * 9), i % 2 ? HEDGE[2] : HEDGE[0]);
  g.line(2, 17, 1, 21, HEDGE[2]);
  g.line(18, 17, 19, 21, HEDGE[2]);
  // Face: a pale oval with a pointed snout and a dark nose, two small eyes, a smudge of soot on the brow.
  g.oval(10, 13, 4, 4, SKIN[0]);
  g.poly([[7, 14], [13, 14], [11, 19], [9, 19]], SKIN[1]);
  g.rect(9, 18, 3, 2, SOOT);
  g.set(9, 18, '#6a5a50');
  g.set(8, 12, frame ? SKIN[0] : SOOT);
  g.set(12, 12, frame ? SKIN[0] : SOOT);
  g.rect(6, 10, 4, 1, '#2a2018');
  g.rect(11, 10, 4, 1, '#2a2018');
  g.rect(8, 9, 5, 1, SOOT);
  // A scarf and a patched coat, a sack over one shoulder, a poker in the other hand.
  g.rect(6, 19, 9, 2, SCARF[0]);
  g.rect(6, 19, 9, 1, SCARF[1]);
  g.rect(13, 20, 2, 3, SCARF[0]);
  g.rect(6, 21, 9, 2, CLOTH[1]);
  g.rect(9, 22, 3, 1, CLOTH[2]);
  g.poly([[14, 16], [19, 15], [19, 23], [14, 22]], CLOTH[2]);
  g.rect(15, 17, 2, 1, CLOTH[3]);
  g.line(1, 24, 2, 11, IRON[2]);
  g.set(2, 10, IRON[3]);
  g.set(1, 10, IRON[3]);
  g.rect(6, 23, 3, 1, SOOT);
  g.rect(11, 23, 3, 1, SOOT);
  g.outline(OUT);
  return g.rows();
}

export const AL_PROP_SPRITES = {
  al_scarecrow: scarecrow(),
  al_kettle: kettle(),
  al_shoe: shoe(),
  al_doll: doll(),
  al_gate: gate(),
  al_well: well(),
  al_name_tree: nameTree(),
  al_snag_tree: snagTree(0),
  al_snag_tree_b: snagTree(1),
  al_snag: snag(),
  al_bucket: bucket(),
  al_barrel: barrel(),
  al_chair: chair(),
  al_birdhouse: birdhouse(),
  al_skep: skep(),
  al_trough: trough(),
  al_pump: pump(),
  al_mailbox: mailbox(),
  al_signboard: signboard(),
  al_stump_axe: stumpAxe(),
  al_dinner_bell: dinnerBell(),
  al_chimney: chimney(),
  al_ashman: ashman(),
  al_cairn_rag: spareCairn(true),
  al_cairn_bare: spareCairn(false),
  al_dune_a: lowDune(26, 3),
  al_dune_b: lowDune(18, 11),
  al_dune_c: lowDune(34, 21),
  al_wheel_sunk: wheelSunk(),
  al_fence_bit: fenceBit(),
  al_log: log(),
  al_stalks: stalks(),
  al_wall_end: wallEnd(),
  al_hedgehog: hedgehog(0),
  al_scratch_stone: scratchStone(),
  al_salvage: salvage(),
};

// The hedgehog blinks.
export const AL_HEDGEHOG_SPRITES = { a: hedgehog(0), b: hedgehog(0), c: hedgehog(0), d: hedgehog(1) };

// How many tiles wide the big ones stand (the body is that wide, if they have one).
export const AL_FOOTPRINTS = { al_gate: 2, al_well: 2, al_trough: 2, al_wall_end: 2, al_fence_bit: 2, al_log: 2, al_dune_a: 2, al_dune_c: 2, al_wheel_sunk: 1 };

// =====================================================================
// GORSE, close up, for the dialogue box (same format as portraits.js: 32x32, an idle face, a
// blink, and expressions as patches [row, column, pixels]).
// =====================================================================
const GORSE_PALETTE = {
  k: '#1a1020', d: '#3a2e28', D: '#5a4a3c', l: '#9a8468', L: '#b8a27e',
  s: '#c8a888', S: '#e0c4a4', n: '#241a1e', w: '#ffffff', r: '#7a2418', R: '#a8402c', b: '#2a2018', t: '#d8a898',
};
function gorseFace(f) {
  const g = Array.from({ length: 32 }, () => Array(32).fill('.'));
  const px = (x, y, c) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < 32 && y < 32) g[y][x] = c; };
  const ell = (cx, cy, rx, ry, c, hi, lo) => {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const n = (x - cx) / rx;
      const m = (y - cy) / ry;
      if (n * n + m * m > 1) continue;
      const v = -0.6 * n - 0.8 * m;
      px(x, y, hi && v > 0.55 ? hi : lo && v < -0.5 ? lo : c);
    }
  };
  const rect = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) px(x + i, y + j, c); };
  // The scarf, and the shoulders.
  rect(3, 28, 26, 4, 'r');
  rect(3, 28, 26, 1, 'R');
  rect(21, 26, 7, 6, 'r');
  // The spines: a dome with a ragged edge, down both sides of the face.
  ell(16, 14, 14, 11.5, 'D', 'l', 'd');
  for (let i = 0; i < 40; i++) {
    const a = Math.PI * (1.02 + (i / 39) * 0.98);
    const r = 13.5 + (i % 2) * 2.4;
    px(16 + Math.cos(a) * r, 14 + Math.sin(a) * (r * 0.84), i % 3 ? 'd' : 'l');
  }
  rect(1, 14, 3, 11, 'D');
  rect(28, 14, 3, 11, 'D');
  for (let y = 15; y < 25; y += 2) { px(0, y, 'd'); px(31, y, 'd'); }
  // The face: pale, with a long soft snout and a dark nose.
  ell(16, 20, 9.4, 9, 's', 'S', null);
  ell(16, 24.5, 5.5, 4, 'S', 'S', 's');
  rect(14, 27, 5, 3, 'n');
  px(14, 27, 'w');
  rect(13, 21, 6, 1, 's');
  // A smudge of soot across the brow, and a nick on one ear.
  rect(9, 13, 8, 1, 'b');
  rect(18, 13, 5, 1, 'b');
  px(7, 18, 'b');
  // Eyes: small, dark, a bit tired.
  const y = 17;
  for (const x of [9, 20]) {
    const e = f.eyes ?? 'open';
    if (f.blink || e === 'blink') rect(x, y + 2, 4, 1, 'n');
    else if (e === 'arc') { px(x, y + 2, 'n'); px(x + 1, y + 1, 'n'); px(x + 2, y + 1, 'n'); px(x + 3, y + 2, 'n'); }
    else if (e === 'wide') { rect(x, y, 4, 4, 'n'); px(x, y, 'w'); }
    else { rect(x, y + 1, 4, 3, 'n'); px(x, y + 1, 'w'); }
  }
  // Brows.
  if (f.brow === 'stern') { rect(8, y - 2, 6, 1, 'd'); rect(18, y - 2, 6, 1, 'd'); px(13, y - 1, 'd'); px(18, y - 1, 'd'); }
  else if (f.brow === 'soft') { rect(8, y - 2, 5, 1, 'd'); rect(19, y - 2, 5, 1, 'd'); px(7, y - 1, 'd'); px(24, y - 1, 'd'); }
  else { rect(8, y - 3, 5, 1, 'd'); rect(19, y - 3, 5, 1, 'd'); }
  // The mouth.
  if (f.mouth === 'smile') { px(12, 25, 'n'); px(13, 26, 'n'); px(19, 26, 'n'); px(20, 25, 'n'); rect(14, 26, 5, 1, 'n'); }
  if (f.mouth === 'grin') { rect(12, 25, 9, 1, 'n'); rect(13, 26, 7, 1, 'n'); rect(14, 26, 5, 1, 'w'); }
  if (f.cheek) { rect(6, 21, 3, 1, 't'); rect(23, 21, 3, 1, 't'); }
  // The outline.
  const out = g.map((row) => row.slice());
  for (let yy = 0; yy < 32; yy++) for (let xx = 0; xx < 32; xx++) {
    if (g[yy][xx] !== '.') continue;
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g[yy + dy]?.[xx + dx] && g[yy + dy][xx + dx] !== '.')) out[yy][xx] = 'k';
  }
  return out.map((row) => row.join(''));
}
function gorsePatches(base, rows) {
  const out = [];
  rows.forEach((row, yy) => {
    if (row === base[yy]) return;
    let x0 = 0;
    while (row[x0] === base[yy][x0]) x0++;
    let x1 = row.length - 1;
    while (row[x1] === base[yy][x1]) x1--;
    out.push([yy, x0, row.slice(x0, x1 + 1)]);
  });
  return out;
}
function gorsePortrait() {
  const base = { eyes: 'open', brow: 'plain', mouth: 'none' };
  const idle = gorseFace(base);
  const blink = gorseFace({ ...base, blink: true });
  const sets = {
    stern: { brow: 'stern' },
    smile: { eyes: 'arc', mouth: 'smile', brow: 'soft', closed: true },
    grin: { mouth: 'grin', cheek: true, brow: 'soft' },
    surprised: { eyes: 'wide', brow: 'plain' },
    thinking: { brow: 'soft', mouth: 'none' },
  };
  const expressions = {};
  for (const [name, settings] of Object.entries(sets)) {
    expressions[name] = { patches: gorsePatches(idle, gorseFace({ ...base, ...settings })), ...(settings.closed ? { closed: true } : {}) };
  }
  const eyes = idle.map((row, i) => (row === blink[i] ? -1 : i)).filter((i) => i >= 0);
  return { palette: GORSE_PALETTE, eyes, expressions, idle, blink };
}
export const GORSE_PORTRAIT = gorsePortrait();
