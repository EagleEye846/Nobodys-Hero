import { starForging } from './fallenStar.js';

// Weapons the hero can equip from the EQUIP menu (C in the overworld).
// Descriptions live in text/items/weapons.txt, one section per id.
//
// fightPower scales FIGHT damage. ability is the soul ability used with SHIFT
// while dodging (see src/battle/soulAbilities.js), or null for none. Stronger
// abilities come with weaker FIGHT damage.
//
// A weapon with a `wielder` (a party member id, src/characters/party.js) is
// theirs alone, and has their stats instead (see MEMBER_GEAR_STATS in
// src/characters/equipment.js). The rest are the hero's.
export const WEAPONS = {
  worn_sword: { name: 'Worn Sword', fightPower: 1, ability: null },
  old_shield: { name: 'Old Shield', fightPower: 0.7, ability: 'block' },
  duelist_blade: { name: "Duellist's Blade", fightPower: 0.9, ability: 'parry' },
  ash_spear: { name: 'Ash Spear', fightPower: 0.85, ability: 'lunge' },
  hunting_bow: { name: 'Hunting Bow', fightPower: 0.6, ability: 'shoot' },
  oak_staff: { name: 'Oak Staff', fightPower: 0.5, ability: 'channel' },
  stone_hammer: { name: 'Stone Hammer', fightPower: 1, ability: 'quake' },
  spare_lantern: { name: 'Spare Lantern', fightPower: 0.5, ability: 'light' },
  glass_dagger: { name: 'Glass Dagger', fightPower: 0.8, ability: 'phase' },
  iron_gauntlets: { name: 'Iron Gauntlets', fightPower: 0.8, ability: 'reflect' },
  chapel_bell: { name: 'Chapel Bell', fightPower: 0.4, ability: 'toll' },
  old_tome: { name: 'Old Tome', fightPower: 0.5, ability: 'recall' },
  // Mount Vigil and Heralds' Rest.
  ice_pick: { name: 'Ice Pick', fightPower: 1.05, ability: 'lunge' },
  herald_trumpet: { name: "Herald's Trumpet", fightPower: 0.55, ability: 'toll' },
  // Sold by Rimble, the goblin in the ice caves.
  glintstone_sling: { name: 'Glintstone Sling', fightPower: 0.75, ability: 'shoot' },
  // Hidden behind a false wall in the Glittering Throat.
  coldlight_lantern: { name: 'Cold-Light Lantern', fightPower: 0.7, ability: 'light' },
  golem_knuckle: { name: 'Golem Knuckle', fightPower: 1.15, ability: 'quake' },
  // Ves's umbrella parts: handles, ribs and canopies, fitted to her mother's
  // umbrella. fightPower scales her FIGHT; the rest strengthen her spells.
  lamplighters_handle: { name: "Lamplighter's Hook", wielder: 'vesper', fightPower: 0.7, allyStrike: 2, allyHeal: 2 },
  bellwire_ribs: { name: 'Bell-Wire Ribs', wielder: 'vesper', fightPower: 0.85, allyStrike: 6, allyCalm: -3 },
  hearthwood_crook: { name: 'Hearthwood Crook', wielder: 'vesper', fightPower: 0.6, allyHeal: 5, allySp: 5 },
  weathervane_hilt: { name: 'Weathervane Hilt', wielder: 'vesper', fightPower: 0.65, allyCalm: 4, gust: 2 },
  // Forged at Tilda's: the hardest-hitting umbrella on the mountain.
  tempered_ferrule: { name: 'Tempered Ferrule', wielder: 'vesper', fightPower: 1, allyStrike: 3 },
  // Traded from Rimble in the ice caves.
  frostglass_canopy: { name: 'Frost-Glass Canopy', wielder: 'vesper', fightPower: 0.8, allyCalm: 5, allyHeal: 3 },
  // Hollis's, on the Last Shelf below the summit: the best on the mountain.
  skyiron_blade: { name: 'Skyiron Blade', fightPower: 1.2, ability: 'parry' },
  owlfeather_canopy: { name: 'Owl-Feather Canopy', wielder: 'vesper', fightPower: 0.95, allyStrike: 5, allyCalm: 4, allyHeal: 4 },
  // Chapter 3, below the clouds: each beats the best of Mount Vigil in its
  // role, and they climb region by region.
  // The Pinefall: the woodcutters' tools, and what the forest gives.
  woodcutters_hatchet: { name: "Woodcutter's Hatchet", fightPower: 1.45, ability: null },
  pinewood_bow: { name: 'Pinewood Bow', fightPower: 1, ability: 'shoot' },
  // The Lantern Marsh.
  punt_pole: { name: 'Punt Pole', fightPower: 1.35, ability: 'lunge' },
  reed_knife: { name: 'Reed Knife', fightPower: 1.15, ability: 'phase' },
  // The Hollow Valley: out of the ruined city.
  cistern_maul: { name: 'Cistern Maul', fightPower: 1.6, ability: 'quake' },
  statue_buckler: { name: "Statue's Buckler", fightPower: 1.2, ability: 'block' },
  hollow_blade: { name: 'Hollow Blade', fightPower: 1.65, ability: 'parry' },
  // Teasel's forge in Lasthome: the old city's iron and the bell's last
  // bronze, made into weapons for the first time in anyone's memory. Each
  // beats the mountain's best in its role.
  hinge_cleaver: { name: 'Hinge Cleaver', fightPower: 1.7, ability: null },
  bell_bronze_gauntlets: { name: 'Bell-Bronze Gauntlets', fightPower: 1.2, ability: 'reflect' },
  forge_lantern: { name: 'Forge Lantern', fightPower: 1, ability: 'light' },
  stokers_staff: { name: "Stoker's Staff", fightPower: 0.9, ability: 'channel' },
  bell_shard: { name: 'Bell Shard', fightPower: 0.9, ability: 'toll' },
  // Ves's, for when her umbrella's back in her hands: kept for chapter 4.
  scarlet_silk_canopy: { name: 'Scarlet-Silk Canopy', wielder: 'vesper', fightPower: 1.2, allyStrike: 8, allyCalm: 6, allyHeal: 5 },
  bog_oak_handle: { name: 'Bog-Oak Handle', wielder: 'vesper', fightPower: 1.05, allyStrike: 3, allyHeal: 9, allySp: 7 },
  // Ves's, in the Dead City's chests (for when she has her umbrella back):
  // the hardest hitter, the calmest, and the kindest she's had.
  forum_bronze_ferrule: { name: 'Forum-Bronze Ferrule', wielder: 'vesper', fightPower: 1.45, allyStrike: 5 },
  vellum_canopy: { name: 'Vellum Canopy', wielder: 'vesper', fightPower: 1.1, allyCalm: 9, allyHeal: 7 },
  fountain_brass_handle: { name: 'Fountain-Brass Handle', wielder: 'vesper', fightPower: 1.15, allyStrike: 4, allyHeal: 12, allySp: 9 },
  // From Teasel's forge in Lasthome, made without ever seeing the umbrella.
  iron_shod_ferrule: { name: 'Iron-Shod Ferrule', wielder: 'vesper', fightPower: 1.3, allyStrike: 6 },
  // The Hushwood. The hero's: secrets, and Rummage's junk shop.
  // The Fallen Star grows: each chapter's smith can reforge it (see
  // src/data/fallenStar.js), so its name and FIGHT come from how far it's got.
  fallen_star: {
    get name() { return starForging().name; },
    get fightPower() { return starForging().fightPower; },
    ability: 'starfall',
  },
  sled_runner_sabre: { name: 'Sled-Runner Sabre', fightPower: 1.5, ability: 'lunge' },
  clock_hand_pike: { name: 'Clock-Hand Pike', fightPower: 1.35, ability: 'phase' },
  kettle_shield: { name: 'Kettle Shield', fightPower: 1.25, ability: 'block' },
  // The Old Drains: the secret in the old city's drowned vault.
  tidemark: { name: 'Tidemark', fightPower: 1.55, ability: 'parry' },
  // The Lantern Marsh: the secret in the old city's tollhouse, off the dark spur.
  reedcutter: { name: 'Reedcutter', fightPower: 1.6, ability: 'lunge' },
  // The Dead City's two secrets: the Reading Room, and the Sculptor's Yard.
  bookmark: { name: 'Bookmark', fightPower: 1.7, ability: 'phase' },
  sculptors_mallet: { name: "Sculptor's Mallet", fightPower: 1.75, ability: 'quake' },
  // Bramble's hatchets (fightPower scales his FIGHT; the rest his spells).
  grandads_hatchet: { name: "Grandad's Hatchet", wielder: 'bramble', fightPower: 1, allyStrike: 3 },
  mas_felling_axe: { name: "Ma's Felling Axe", wielder: 'bramble', fightPower: 1.25, allyStrike: 6, sneak: 0.25 },
  twin_hatchets: { name: 'Twin Hatchets', wielder: 'bramble', fightPower: 1.15, allyStrike: 8, sneak: 0.5 },
  splitting_maul: { name: 'Splitting Maul', wielder: 'bramble', fightPower: 1.35, allyStrike: 4, shorten: 0.1, allyCalm: -2 },
  heartwood_axe: { name: 'Heartwood Axe', wielder: 'bramble', fightPower: 1.4, allyStrike: 7, allyCalm: 3 },
};
