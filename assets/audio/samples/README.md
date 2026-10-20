# Orchestra samples

Recordings of real instruments, from the **VSCO 2 Community Edition** orchestral
library by Versilian Studios (https://github.com/sgossner/VSCO-2-CE), released
under **CC0 1.0** (public domain). Free to use, change and ship; no credit is
required, but it's given here anyway.

Each folder is one instrument; each file is one note, named by its MIDI number
(60 is middle C). They've been trimmed (silence cut from the front, a fade at the
end), levelled within each instrument, and compressed to Ogg Vorbis.
`src/audio/sampleSets.js` lists what's here; songs use them with an instrument
like `{ sample: 'violins', volume: 0.5 }` (see `playSample` in src/audio/music.js).
