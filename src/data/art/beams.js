// The light-beam puzzles' props (Chapter 4, the Glimmering and on): sun-crystals
// that throw a beam, prisms that turn it, crystal eyes it wakes, and a tile of
// light to bridge a drop. Drawn like the props in props.js (rows of characters,
// standing on their tile's bottom edge, centred), in the Glimmering's teal and
// gold. The beam itself isn't a sprite: it's drawn live (src/overworld/beams.js).
//
// The extra colours use Greek letters because every plain character is taken
// in PROP_PALETTE and the other art files' extras. Spread BEAM_PALETTE_EXTRA
// into PROP_PALETTE and BEAM_PROP_SPRITES into PROP_SPRITES (props.js does).

export const BEAM_PALETTE_EXTRA = {
  'α': '#103f46', // deep teal, for shade
  'β': '#1f8f8c', // teal
  'γ': '#5fe0c8', // light teal
  'δ': '#d6fff2', // teal-white, the shine
  'ε': '#ffe9a0', // pale gold glow
  'ζ': '#9a7a2e', // dull gold
  'η': '#3a4a52', // a dull, unlit crystal's edge
  'θ': '#5a6e76', // a dull, unlit crystal
};

export const BEAM_PROP_SPRITES = {
  // A sun-crystal on its plinth: it holds a little of the Glimmering's light
  // and throws it out in a straight beam (its `beam` says which way).
  sun_crystal: [
    '.......kk.......',
    '......kεεk......',
    '.....kεaaεk.....',
    '....kεaaaAεk....',
    '...kεaaaAAAβk...',
    '...kaaaAAAAβk...',
    '...kaaAAAAAβk...',
    '...kaAAAAAAβk...',
    '...kAAAAAAAβk...',
    '...kAAAAAAββk...',
    '....kAAAAββk....',
    '....kAAAβββk....',
    '.....kAβββk.....',
    '..kkkkkkkkkkkk..',
    '..kMMMMMMMMMMk..',
    '..kMMββMMββMMk..',
    '..kOOOOOOOOOOk..',
    '....kkkkkkkk....',
  ],
  // A prism on a plinth, set '/' (a beam going right turns up). Z turns it.
  prism: [
    '........kβγδγβk.',
    '.......kβγδγβk..',
    '.......kβγδγβk..',
    '......kβγδγβk...',
    '......kβγδγβk...',
    '.....kβγδγβk....',
    '.....kβγδγβk....',
    '....kβγδγβk.....',
    '....kβγδγβk.....',
    '...kβγδγβk......',
    '..kβγδγβk.......',
    '..kβγδγβk.......',
    '.kβγδγβk........',
    '...kkkkkkkkkk...',
    '..kMMMMMMMMMMk..',
    '..kMMββMMββMMk..',
    '..kOOOOOOOOOOk..',
    '....kkkkkkkk....',
  ],
  // The same prism turned the other way, '\' (a beam going right turns down).
  prism_back: [
    '.kβγδγβk........',
    '..kβγδγβk.......',
    '..kβγδγβk.......',
    '...kβγδγβk......',
    '...kβγδγβk......',
    '....kβγδγβk.....',
    '....kβγδγβk.....',
    '.....kβγδγβk....',
    '.....kβγδγβk....',
    '......kβγδγβk...',
    '.......kβγδγβk..',
    '.......kβγδγβk..',
    '........kβγδγβk.',
    '...kkkkkkkkkk...',
    '..kMMMMMMMMMMk..',
    '..kMMββMMββMMk..',
    '..kOOOOOOOOOOk..',
    '....kkkkkkkk....',
  ],
  // A prism clamped in an iron band, set '/' and not for turning (fixed: true).
  prism_fixed: [
    '........kβγδγβk.',
    '.......kβγδγβk..',
    '.......kβγδγβk..',
    '......kβγδγβk...',
    '......kβγδγβk...',
    '.....kβγδγβk....',
    '.....kβγδγβk....',
    '....kβγδγβk.....',
    '....kβγδγβk.....',
    '...kβγδγβk......',
    '..kβγδγβk.......',
    '..kβγδγβk.......',
    '.kβγδγβk........',
    '...kkkkkkkkkk...',
    '..kSZSSSSSSZSk..',
    '..kMMMMMMMMMMk..',
    '..kOOOOOOOOOOk..',
    '....kkkkkkkk....',
  ],
  // A clamped prism set '\'.
  prism_fixed_back: [
    '.kβγδγβk........',
    '..kβγδγβk.......',
    '..kβγδγβk.......',
    '...kβγδγβk......',
    '...kβγδγβk......',
    '....kβγδγβk.....',
    '....kβγδγβk.....',
    '.....kβγδγβk....',
    '.....kβγδγβk....',
    '......kβγδγβk...',
    '.......kβγδγβk..',
    '.......kβγδγβk..',
    '........kβγδγβk.',
    '...kkkkkkkkkk...',
    '..kSZSSSSSSZSk..',
    '..kMMMMMMMMMMk..',
    '..kOOOOOOOOOOk..',
    '....kkkkkkkk....',
  ],
  // A crystal eye, shut and dull: waiting for light.
  crystal_eye: [
    '................',
    '................',
    '....θ...........',
    '...θ.kηηηηk.....',
    '...kηθθθθθθηk...',
    '...ηθθθθθθθθη...',
    '..ηηθθθθθθθθηη..',
    '..ηθηηηηηηηηθη..',
    '..ηθθkkkkkkθθη..',
    '..ηθθθθθθθθθθη..',
    '...ηθθθθθθθθη...',
    '...kηθθθθθθηk...',
    '.....kηηηηk.....',
    '...kkkkkkkkkk...',
    '..kMMMMMMMMMMk..',
    '..kMMββMMββMMk..',
    '..kOOOOOOOOOOk..',
    '....kkkkkkkk....',
  ],
  // A crystal eye, open and bright: a beam has found it.
  crystal_eye_lit: [
    '................',
    '................',
    '...δ............',
    '..δ..kββββk.....',
    '...kβγγγγγγβk...',
    '...βγγγδδγγγβ...',
    '..βγγεεAAεεγγβ..',
    '..βγδδδkkδδδγβ..',
    '..βγγεεAAεεγγβ..',
    '..βγγγδδδδγγγβ..',
    '...βγγγγγγγγβ...',
    '...kβγγγγγγβk...',
    '.....kββββk.....',
    '...kkkkkkkkkk...',
    '..kMMMMMMMMMMk..',
    '..kMMββMMββMMk..',
    '..kOOOOOOOOOOk..',
    '....kkkkkkkk....',
  ],
  // One tile of a light bridge (drawn over a drop or water while its switch is on).
  light_bridge: [
    '................',
    'α..α..α..α..α..α',
    'γβββββββγβββββββ',
    'γγγγγγγγγγγγγγγγ',
    'γγγγγγγγγγγγγγγγ',
    'εεεεεεεεεεεεεεεε',
    'δδδδδδδδδδδδδδδδ',
    'εδδδεδδδεδδδεδδδ',
    'δδδδδδδδδδδδδδδδ',
    'δδδδδδδδδδδδδδδδ',
    'εεεεεεεεεεεεεεεε',
    'γγγγγγγγγγγγγγγγ',
    'γγγγγγγγγγγγγγγγ',
    'βγβββββββγββββββ',
    '.α..α..α..α..α..',
    '................',
  ],
};
