// THE STORM REACH BY BOAT: every ride in the Bother between the Reach's five stops.
//
// How the Reach works: Haddock puts the three ashore on the near (west) landing of each rock,
// reef or wreck and rows round the back to the far side, where he waits off a little jetty.
// Cross the stop on foot, walk out along the jetty and press Z on the boat (or on Haddock): he
// asks "Where to?" in a CHOICE box (src/ui/choiceBox.js) and you pick "Row on to ...", "Row
// back to ..." or "Not yet". Nothing on the jetty moves you by itself: there are no step
// triggers out there. The boat lies along the jetty's east side, with a "!" over it.
//
//   to_the_reach         the ride out of Haddock's Light -> reach_first_rock
//   reach_boat_*         the "Where to?" choice at each jetty (a prop's `playScene`), one per stop
//                        (reach_boat_home at Haddock's Light's jetty); an option plays the ride
//   reach_crossing_*     once, on each stop's landing: the ride itself, on board, each rougher
//                        than the last (more rain, more lightning, a bigger swell)
//   reach_to_*           repeatable ride on to the next landing (played by the choice's option)
//   reach_back_to_*      repeatable ride back to the last stop's jetty (by the boat)
//
// The rides happen on the water west of each landing (x 1 to 8, the landing's row) and on the
// landing itself (x 9 and 10), which nothing else in those rooms stands on, and no monster's
// range comes near. In the boat (`cf_haddock_row`, 4 tiles, placed by its centre): Ves sits in
// the stern, Bramble amidships, the hero stands in the bow (offsets as in wreck_crossing).
// The hero never speaks. Haddock is a bit deaf. After haddock_gone Ves rows and asks.
//
// `reach_back_to_haddock` (the first rock's option) goes home to the Bother's jetty in
// haddock_light_door.

// Everyone into the boat in the dark, on the row `y`, the boat out at x 2.
function aboard() {
  return [
    { do: 'stage', dim: 1 },
    { do: 'hold', who: 'boat', what: 'player', offset: { x: 25, y: -7 } },
    { do: 'hold', who: 'boat', what: 'ves', offset: { x: -26, y: -7 }, also: true },
    { do: 'animate', who: 'ves', animation: 'ves_sit', speed: 1.2 },
    { do: 'hold', who: 'boat', what: 'bramble', offset: { x: 9, y: -7 }, also: true },
    { do: 'animate', who: 'bramble', animation: 'bramble_sit', speed: 1.4 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.4 },
  ];
}

// Into the landing at row `y` and out onto it: the hero (9,y), Ves (10,y-1), Bramble (10,y+1).
function ashore(y) {
  return [
    { do: 'walk', who: 'boat', to: { x: 6, y }, keep: true },
    { do: 'sound', name: 'thud' },
    { do: 'quake', amount: 1, seconds: 0.25 },
    { do: 'hold', who: 'boat' },
    { do: 'sound', name: 'whoosh' },
    { do: 'toss', who: 'player', to: { x: 9, y }, height: 12, bounces: 0 },
    { do: 'animate', who: 'ves' },
    { do: 'toss', who: 'ves', to: { x: 10, y: y - 1 }, height: 12, bounces: 0 },
    { do: 'animate', who: 'bramble' },
    { do: 'toss', who: 'bramble', to: { x: 10, y: y + 1 }, height: 12, bounces: 0 },
  ];
}

// The boat and the two friends, for a ride onto a landing at row `y`.
function crew(y) {
  return [
    { id: 'boat', look: 'prop:cf_haddock_row', x: 2, y, portrait: 'haddock', centered: true, animation: 'cf_haddock_row', speed: 0.35 },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: y - 1, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 10, y: y + 1, portrait: 'bramble', plays: 'bramble' },
  ];
}

// Off round the back of the stop, to wait at the far jetty.
const ROWS_OFF = [
  { do: 'walk', who: 'boat', to: { x: 2, y: 10 }, keep: true },
  { do: 'leave', who: 'boat' },
  { do: 'wait', seconds: 0.6 },
  { do: 'face', who: 'player', dir: 'right' },
];

// A short ride: Haddock's line from out of sight, the fade, the goto. After the chapter
// (haddock_gone) Ves rows instead, and says so (steps with `until` / `after`).
// (draft) (Ves's line).
const VES_ROWS = "{proud}In. Sit still. I'm rowing, and I don't take requests.";
function ride(id, room, line, to, spawn) {
  return {
    id,
    room,
    once: false,
    actors: [
      { id: 'haddock', look: 'prop:cf_haddock', x: 1, y: 1, portrait: 'haddock', hidden: true },
      { id: 'ves_voice', look: 'prop:vesper_stand', x: 1, y: 1, portrait: 'vesper', hidden: true },
    ],
    steps: [
      { do: 'say', who: 'haddock', text: line, until: 'haddock_gone' },
      { do: 'say', who: 'ves_voice', text: VES_ROWS, after: 'haddock_gone' },
      { do: 'stage', dim: 1, seconds: 1.4 },
      { do: 'sound', name: 'splash' },
      { do: 'wait', seconds: 1.6 },
      { do: 'goto', room: to, spawn },
    ],
  };
}

// --- Off into the Reach (Haddock's Light's boat names this one) --------------------------

export const TO_THE_REACH = ride('to_the_reach', 'reach_first_rock',
  '{determined}Right. In you get. Sit low, hold the sides, and don\'t touch the oars.',
  'reach_first_rock', { x: 9, y: 10 });

// --- The first crossing: out past Haddock's Light ----------------------------------------

export const REACH_CROSSING_ROCK = {
  id: 'reach_crossing_rock',
  room: 'reach_first_rock',
  once: true,
  actors: crew(10),
  steps: [
    ...aboard(),
    { do: 'stage', dim: 0, rain: 0.4, seconds: 2.5 },
    { do: 'wait', seconds: 1.2 },
    // (draft) The last lit window drops out of sight; only the swell, and the black tower a little bigger each wave.
    { do: 'sound', name: 'whoosh' },
    { do: 'quake', amount: 0.6, seconds: 1.6 },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}Is it supposed to go UP like that?' },
    { do: 'say', who: 'boat', text: '{proud}That\'s only the swell, lad. She\'s breathing.' },
    { do: 'say', who: 'bramble', text: '{angry}I don\'t want it to breathe. I want it to lie still and be a floor.' },
    { do: 'walk', who: 'boat', to: { x: 4, y: 10 }, keep: true },
    { do: 'say', who: 'boat', text: '{determined}First rock. I\'ll put you on the near side and row round the back. Too much sea on the point. Walk over and I\'ll meet you.' },
    { do: 'say', who: 'ves', text: '{smile}And you\'ll hear us shout, will you?' },
    { do: 'emote', who: 'boat', emote: '?' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'boat', text: '{smile}Aye, miss, it is a stout rock. Mind the barnacles.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{determined}...We\'ll just walk over, then.' },
    ...ashore(10),
    { do: 'act', who: 'bramble', act: 'shiver' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'bramble', text: '{surprised}It\'s still moving. The ground. It\'s moving.' },
    { do: 'say', who: 'ves', text: '{laughing}That\'s your knees.' },
    ...ROWS_OFF,
  ],
};

export const REACH_TO_REEF = ride('reach_to_reef', 'reach_first_rock',
  '{smile}On to the reef, is it? In you get.', 'reach_reef', { x: 9, y: 10 });

// --- The second crossing: the reef, rain sideways, the first bolt -----------------------

export const REACH_CROSSING_REEF = {
  id: 'reach_crossing_reef',
  room: 'reach_reef',
  once: true,
  actors: crew(10),
  steps: [
    ...aboard(),
    { do: 'stage', dim: 0, rain: 0.8, seconds: 2.5 },
    { do: 'wait', seconds: 1 },
    // (draft) The rain sideways, every wave taller than the boat.
    { do: 'quake', amount: 1.2, seconds: 2.2 },
    { do: 'emote', who: 'bramble', emote: 'sweat', wait: false },
    { do: 'say', who: 'bramble', text: '{scared}I\'m not looking. Tell me when it\'s over.' },
    { do: 'say', who: 'ves', text: '{smile}I\'ll tell you. ...Not yet. ...Not yet.' },
    { do: 'wait', seconds: 0.6 },
    { do: 'stage', bolt: true },
    // (draft) In the flash, little shapes in the cloud, wheeling like gulls: not gulls.
    { do: 'emote', who: 'player', emote: '!', wait: false },
    { do: 'wait', seconds: 0.9 },
    { do: 'say', who: 'boat', text: '{determined}Storm imps. They come off the weather. Keep your heads down on the reef.' },
    { do: 'walk', who: 'boat', to: { x: 4, y: 10 }, keep: true },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{worried}Your boat\'s leaking.' },
    { do: 'emote', who: 'boat', emote: '?' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'boat', text: '{proud}Sleek? She is, miss. Sleek as a seal. Same as before: over the reef, and I\'ll be off the far side.' },
    ...ashore(10),
    { do: 'act', who: 'bramble', act: 'shiver' },
    ...ROWS_OFF,
  ],
};

export const REACH_BACK_TO_ROCK = ride('reach_back_to_rock', 'reach_reef',
  '{eh}Back to the first rock? Right you are. In you get.', 'reach_first_rock', { x: 31, y: 5 });

export const REACH_TO_WRECK = ride('reach_to_wreck', 'reach_reef',
  '{determined}Next is a wreck. In you get, and hold on properly this time.', 'reach_wreck', { x: 9, y: 10 });

// --- The third crossing: the wreck, sea in the boat, two bolts --------------------------

export const REACH_CROSSING_WRECK = {
  id: 'reach_crossing_wreck',
  room: 'reach_wreck',
  once: true,
  actors: crew(10),
  steps: [
    ...aboard(),
    { do: 'stage', dim: 0, rain: 1.2, seconds: 2 },
    { do: 'wait', seconds: 0.8 },
    { do: 'quake', amount: 2, seconds: 1.2 },
    { do: 'sound', name: 'splash' },
    // (draft) A wave breaks over the bow and fills the boat to Bramble's knees; Haddock rows straight on.
    { do: 'stage', flood: 0.14, seconds: 0.6 },
    { do: 'stage', flood: 0, seconds: 5 },
    { do: 'act', who: 'bramble', act: 'startle', wait: false },
    { do: 'say', who: 'bramble', text: '{shout}There\'s SEA in the BOAT.' },
    { do: 'say', who: 'boat', text: '{smile}Always a bit of sea in a boat, lad. That\'s how you know she\'s working.' },
    { do: 'say', who: 'bramble', text: '{angry}That is NOT how you know.' },
    { do: 'stage', bolt: true },
    // (draft) In the flash: a big ship on her side on a rock ahead, masts snapped, white water over her.
    { do: 'camera', to: { x: 14, y: 8 } },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera' },
    { do: 'say', who: 'ves', text: '{thoughtful}Somebody else tried this, then.' },
    { do: 'quake', amount: 1.6, seconds: 1 },
    { do: 'walk', who: 'boat', to: { x: 4, y: 10 }, keep: true },
    { do: 'stage', bolt: true },
    { do: 'say', who: 'boat', text: '{tired}Plenty have. I\'ll put you in on her lee. Over her deck and down the far side, and I\'ll be there.' },
    ...ashore(10),
    { do: 'face', who: 'bramble', at: 'ves' },
    { do: 'face', who: 'player', at: 'bramble' },
    { do: 'say', who: 'bramble', text: '{sheepish}Can we live here now? On the land bit?' },
    { do: 'face', who: 'ves', at: 'bramble' },
    { do: 'say', who: 'ves', text: '{laughing}It\'s a shipwreck, Bramble.' },
    { do: 'act', who: 'bramble', act: 'bounce', wait: false },
    { do: 'say', who: 'bramble', text: '{proud}It\'s a DRY shipwreck.' },
    ...ROWS_OFF,
  ],
};

export const REACH_BACK_TO_REEF = ride('reach_back_to_reef', 'reach_wreck',
  '{eh}Back to the reef? Right you are. In you get.', 'reach_reef', { x: 35, y: 8 });

export const REACH_TO_EYE = ride('reach_to_eye', 'reach_wreck',
  '{determined}This next bit\'s the worst before it\'s the best. In you get.', 'reach_eye', { x: 9, y: 10 });

// --- The fourth crossing: the worst yet, then the storm opens ----------------------------

export const REACH_CROSSING_EYE = {
  id: 'reach_crossing_eye',
  room: 'reach_eye',
  once: true,
  actors: crew(10),
  steps: [
    ...aboard(),
    { do: 'stage', dim: 0, rain: 1.5, sky: 0.5, seconds: 1.5 },
    { do: 'quake', amount: 2.4, seconds: 1.4 },
    { do: 'stage', bolt: true },
    { do: 'sound', name: 'whoosh' },
    { do: 'say', who: 'bramble', text: '{scared}I\'m holding it TOGETHER, I\'m holding it TOGETHER...' },
    { do: 'quake', amount: 2, seconds: 1 },
    // Then it stops.
    { do: 'stage', rain: 0, sky: 0, seconds: 4 },
    // (draft) All at once it stops: the wind drops, the rain thins to nothing, the sea lies flat as a plate.
    { do: 'wait', seconds: 4.5 },
    { do: 'emote', who: 'bramble', emote: '?', wait: false },
    { do: 'say', who: 'bramble', text: '{worried}...Why\'s it stopped? Is it a trick?' },
    { do: 'say', who: 'boat', text: '{smile}The eye, lad. The middle of it. Quiet as a church for a bit. Get out and stretch your legs.' },
    { do: 'walk', who: 'boat', to: { x: 4, y: 10 }, keep: true },
    { do: 'say', who: 'ves', text: '{surprised}It\'s so quiet I can hear my ears.' },
    ...ashore(10),
    ...ROWS_OFF,
  ],
};

export const REACH_BACK_TO_WRECK = ride('reach_back_to_wreck', 'reach_eye',
  '{eh}Back to the wreck? Into all that? Right you are. In you get.', 'reach_wreck', { x: 42, y: 10 });

export const REACH_TO_FOOT = ride('reach_to_foot', 'reach_eye',
  '{determined}Last stretch. Sit low, hold tight, and don\'t let go of the lad.', 'reach_foot', { x: 9, y: 23 });

// --- The last crossing: the worst sea, and the tower right over you ----------------------
// The boat here plays Haddock's prop at the landing (5,23), so it stays tied up where the
// ride leaves it (x 5-8): he stays with the boat.

export const REACH_CROSSING_FOOT = {
  id: 'reach_crossing_foot',
  room: 'reach_foot',
  once: true,
  actors: [
    { id: 'boat', look: 'prop:cf_haddock_row', x: 2, y: 23, portrait: 'haddock', plays: 'haddock_reach_foot', centered: true, animation: 'cf_haddock_row', speed: 0.35 },
    { id: 'ves', look: 'prop:vesper_stand', x: 10, y: 22, portrait: 'vesper', plays: 'vesper' },
    { id: 'bramble', look: 'prop:bramble_stand', x: 10, y: 24, portrait: 'bramble', plays: 'bramble' },
  ],
  steps: [
    { do: 'stage', dim: 1 },
    { do: 'appear', who: 'boat', at: { x: 1, y: 23 }, instant: true },
    { do: 'hold', who: 'boat', what: 'player', offset: { x: 25, y: -7 } },
    { do: 'hold', who: 'boat', what: 'ves', offset: { x: -26, y: -7 }, also: true },
    { do: 'animate', who: 'ves', animation: 'ves_sit', speed: 1.2 },
    { do: 'hold', who: 'boat', what: 'bramble', offset: { x: 9, y: -7 }, also: true },
    { do: 'animate', who: 'bramble', animation: 'bramble_sit', speed: 1.4 },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'stage', dim: 0, rain: 1.6, sky: 0.6, seconds: 1.5 },
    { do: 'quake', amount: 3, seconds: 1.6 },
    { do: 'stage', bolt: true },
    { do: 'say', who: 'bramble', text: '{scared}I don\'t like it I don\'t like it I don\'t LIKE it.' },
    { do: 'say', who: 'boat', text: '{determined}Nearly there. Hold on to her.' },
    { do: 'quake', amount: 2.6, seconds: 1.2 },
    { do: 'stage', bolt: true },
    { do: 'wait', seconds: 0.3 },
    // (draft) Up the tower and back down: black brick ribbed with iron, broken spars round its crown.
    { do: 'camera', to: { x: 20, y: 6 } },
    { do: 'wait', seconds: 1.2 },
    { do: 'stage', bolt: true },
    { do: 'wait', seconds: 1.4 },
    { do: 'camera' },
    { do: 'say', who: 'bramble', text: '{awed}...That\'s not a lighthouse. That\'s a lighthouse that\'s cross with us.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{surprised}...Big, isn\'t it.' },
    { do: 'walk', who: 'boat', to: { x: 4, y: 23 }, keep: true },
    { do: 'quake', amount: 1.6, seconds: 0.8 },
    ...ashore(23),
    { do: 'face', who: 'player', dir: 'left' },
    { do: 'face', who: 'ves', dir: 'left' },
    { do: 'face', who: 'bramble', dir: 'left' },
    { do: 'say', who: 'boat', text: '{tired}There\'s your door. I\'ll tie her up here and mind the boat.' },
    { do: 'say', who: 'ves', text: '{smile}You\'re mad, you know.' },
    { do: 'say', who: 'boat', text: '{eh}Eh?' },
    { do: 'wait', seconds: 0.5 },
    { do: 'say', who: 'boat', text: '{smile}Glad? I am, miss. Glad to be of use.' },
    { do: 'wait', seconds: 0.3 },
    { do: 'say', who: 'ves', text: '{bored}...That isn\'t what I said.' },
    // Up at the tower, all three.
    { do: 'face', who: 'ves', dir: 'right' },
    { do: 'face', who: 'player', dir: 'right' },
    { do: 'wait', seconds: 0.3 },
    { do: 'face', who: 'bramble', dir: 'right' },
  ],
};

export const REACH_BACK_TO_EYE = ride('reach_back_to_eye', 'reach_foot',
  '{eh}Back to the quiet bit? Right you are. In you get.', 'reach_eye', { x: 27, y: 10 });

// The first rock's stern step goes home: the Bother's jetty at Haddock's Light.
export const REACH_BACK_TO_HADDOCK = ride('reach_back_to_haddock', 'reach_first_rock',
  '{eh}Back, is it? Right you are. In you get.', 'haddock_light_door', { x: 25, y: 9 });
// (draft) 2026-11-14: Ves's and Bramble's lines and moods rewritten (they guess, they don't explain).
// (draft) 2026-11-15: staged to show it (camera, stage effects, acts) and the narration cut.

// --- "Where to?": the choice at each jetty (a prop's `playScene` opens it) ---------------------
// Press Z on the Bother (or Haddock in her): the CHOICE box, and whatever you pick plays that ride.
// After haddock_gone it is Ves at the oars who asks. `next` / `back` are [label, ride scene].
function boatChoice(id, room, next, back) {
  const options = [
    ...(next ? [{ text: next[0], then: next[1].steps }] : []),
    ...(back ? [{ text: back[0], then: back[1].steps }] : []),
    { text: 'Not yet', cancel: true, then: [] },
  ];
  return {
    id,
    room,
    once: false,
    actors: [
      { id: 'haddock', look: 'prop:cf_haddock', x: 1, y: 1, portrait: 'haddock', hidden: true },
      { id: 'ves_voice', look: 'prop:vesper_stand', x: 1, y: 1, portrait: 'vesper', hidden: true },
    ],
    steps: [
      { do: 'choose', who: 'haddock', question: '{smile}Where to?', options, until: 'haddock_gone' },
      { do: 'choose', who: 'ves_voice', question: '{bored}Where to?', options, after: 'haddock_gone' },
    ],
  };
}

export const REACH_BOAT_HOME = boatChoice('reach_boat_home', 'haddock_light_door',
  ['Row out to the first rock', TO_THE_REACH], null);
export const REACH_BOAT_ROCK = boatChoice('reach_boat_rock', 'reach_first_rock',
  ['Row on to the reef', REACH_TO_REEF], ["Row back to Haddock's Light", REACH_BACK_TO_HADDOCK]);
export const REACH_BOAT_REEF = boatChoice('reach_boat_reef', 'reach_reef',
  ['Row on to the wreck', REACH_TO_WRECK], ['Row back to the first rock', REACH_BACK_TO_ROCK]);
export const REACH_BOAT_WRECK = boatChoice('reach_boat_wreck', 'reach_wreck',
  ['Row on to the eye', REACH_TO_EYE], ['Row back to the reef', REACH_BACK_TO_REEF]);
export const REACH_BOAT_EYE = boatChoice('reach_boat_eye', 'reach_eye',
  ['Row on to the Last Light', REACH_TO_FOOT], ['Row back to the wreck', REACH_BACK_TO_WRECK]);
export const REACH_BOAT_FOOT = boatChoice('reach_boat_foot', 'reach_foot',
  null, ['Row back to the eye', REACH_BACK_TO_EYE]);
// (draft) 2026-11-15: the jetty-end and side-step triggers are gone; every ride is picked from "Where to?".
