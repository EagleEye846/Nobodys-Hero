// A version of a song played by real instruments (recordings, see
// sampleSets.js): the same notes and sections, with some of its instruments
// swapped for recorded ones. The original song stays as it was.
//
//   export const MY_ORCHESTRA_THEME = orchestrate(MY_THEME, {
//     title: 'My Song (Orchestra)',
//     swap: { lead: { sample: 'trumpet', volume: 0.45 }, snare: { sample: 'snare', drum: 'sample', volume: 0.4 } },
//   });
//
// `swap` is by track name; anything not named keeps its synth (music boxes,
// bells, organs, choirs: things the recordings don't have). `layer` keeps the
// synth AND adds a recording playing the same notes on top (as a new track,
// `<name>Real`): the original's sound, with an orchestra's weight under it.
// `volume` turns the whole song up or down, to sit level with the original.
export function orchestrate(song, { title, swap = {}, layer = {}, volume = song.volume ?? 1 }) {
  for (const [track, instrument] of [...Object.entries(swap), ...Object.entries(layer)]) {
    if (!song.instruments[track]) throw new Error(`${song.title}: no track called '${track}' to swap or layer`);
    // A drum track holds hits ('x'), so it needs a drum; a tune needs a tune.
    if (Boolean(song.instruments[track].drum) !== Boolean(instrument.drum)) {
      throw new Error(`${song.title}: '${track}' is a ${song.instruments[track].drum ? 'drum' : 'tune'} track, so its recording must be one too`);
    }
  }
  const real = (track) => `${track}Real`;
  const sections = Object.fromEntries(Object.entries(song.sections).map(([name, section]) => [name, {
    ...section,
    ...Object.fromEntries(Object.keys(layer).filter((track) => section[track]).map((track) => [real(track), section[track]])),
  }]));
  const layered = Object.fromEntries(Object.entries(layer).map(([track, instrument]) => [real(track), instrument]));
  return { ...song, title, volume, sections, instruments: { ...song.instruments, ...swap, ...layered } };
}

// The recorded drums, for swapping into a song's kit.
export const SAMPLE_DRUMS = {
  snare: (volume) => ({ sample: 'snare', drum: 'sample', volume, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.2 } }),
  crash: (volume) => ({ sample: 'crash', drum: 'sample', volume, ring: true, reverb: 0.3 }),
  boom: (volume) => ({ sample: 'bassDrumDeep', drum: 'sample', volume, ring: true, reverb: 0.35 }),
};
