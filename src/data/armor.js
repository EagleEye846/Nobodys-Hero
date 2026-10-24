// Armor the hero can wear, chosen in the EQUIP menu (C in the overworld) next
// to the weapon. Descriptions live in text/items/armor.txt, one section per id.
//
// Every stat is optional (0 if left out):
//   defense  taken off every hit you take (a hit always does at least 1)
//   magic    how much stronger your spells are (0.25 = +25%): Heal Pulse heals
//            more, Lull calms more, and Rend and Starfall hit harder (by half
//            as much: 0.25 makes them +12.5%)
//   spGain   extra SP from grazing (0.2 = +20%)
// A stat can be negative: heavy armor can weigh on your magic. Armor never
// adds max HP; that only comes from levelling up.
//
// Armor with a `wielder` (a party member id, src/characters/party.js) is
// theirs alone, and has their stats instead (see MEMBER_GEAR_STATS in
// src/characters/equipment.js): since enemies only aim at you, a friend's
// coat looks after you.
export const ARMOR = {
  travel_clothes: { name: 'Travel Clothes' },
  padded_vest: { name: 'Padded Vest', defense: 1 },
  moth_silk_shawl: { name: 'Moth-Silk Shawl', magic: 0.25, spGain: 0.1 },
  waxed_coat: { name: 'Waxed Coat', defense: 2 },
  candlewick_robe: { name: 'Candlewick Robe', magic: 0.4, defense: -1 },
  chain_shirt: { name: 'Chain Shirt', defense: 3, magic: -0.2 },
  // Chapter 2: found on the Long Stair.
  climbers_jacket: { name: "Climber's Jacket", defense: 2, spGain: 0.15 },
  // Mount Vigil and Heralds' Rest.
  herald_cloak: { name: "Herald's Cloak", defense: 2, magic: 0.15 },
  fur_lined_hood: { name: 'Fur-Lined Hood', defense: 1, spGain: 0.25 },
  ringers_mittens: { name: "Ringer's Mittens", defense: 1, magic: 0.3 },
  // The Hero's own armour, carried up the mountain and left in the caves.
  vigil_mail: { name: 'Vigil Mail', defense: 4, magic: -0.3, spGain: -0.1 },
  snow_mantle: { name: 'Snow Mantle', defense: 3, magic: 0.1 },
  // Sold at Tilda's forge.
  smiths_apron: { name: "Smith's Apron", defense: 2, spGain: 0.1 },
  riveted_gambeson: { name: 'Riveted Gambeson', defense: 3, spGain: 0.1, magic: -0.1 },
  // Sold by Rimble, the goblin in the ice caves.
  rimemoth_shawl: { name: 'Rimemoth Shawl', defense: 1, magic: 0.35, spGain: 0.15 },
  // Hidden behind a false wall in the Hall of Glass.
  crystal_cuirass: { name: 'Crystal Cuirass', defense: 4, magic: 0.15 },
  patchwork_parka: { name: 'Patchwork Parka', defense: 3, spGain: 0.2 },
  // Ves's coats, scarves and mittens.
  evening_coat: { name: 'Evening Coat', wielder: 'vesper', shelterDef: 1 },
  ember_knit_scarf: { name: 'Ember-Knit Scarf', wielder: 'vesper', regen: 2 },
  // In the darkest corner of the Goblin's Grotto.
  aurora_scarf: { name: 'Aurora Scarf', wielder: 'vesper', regen: 2, shelterDef: 1 },
  goosedown_mittens: { name: 'Goose-Down Mittens', wielder: 'vesper', grazeSp: 0.15 },
  oilskin_greatcoat: { name: 'Oilskin Greatcoat', wielder: 'vesper', shelterDef: 2, regen: 1 },
  spark_proof_cape: { name: 'Spark-Proof Cape', wielder: 'vesper', shelterDef: 1, grazeSp: 0.1 },
  // Up the mountain, in chests: on the Weathervane Shelf, at the top of the
  // Gale Face, and up in the Hall of Glass.
  gale_ribbon_scarf: { name: 'Gale-Ribbon Scarf', wielder: 'vesper', grazeSp: 0.2, regen: 1 },
  cragwool_poncho: { name: 'Cragwool Poncho', wielder: 'vesper', shelterDef: 2, grazeSp: 0.1 },
  icefox_muff: { name: 'Ice-Fox Muff', wielder: 'vesper', regen: 3 },
  // Sold by Rimble, the goblin in the ice caves.
  cavers_hood: { name: "Caver's Hood", wielder: 'vesper', shelterDef: 1, grazeSp: 0.2, regen: 1 },
  rimeweave_cloak: { name: 'Rimeweave Cloak', wielder: 'vesper', shelterDef: 2, regen: 2 },
  // Hollis's, on the Last Shelf below the summit.
  owl_down_coat: { name: 'Owl-Down Coat', defense: 4, magic: 0.2 },
  snowfeather_shawl: { name: 'Snowfeather Shawl', wielder: 'vesper', shelterDef: 2, regen: 2, grazeSp: 0.15 },
  // Chapter 3, below the clouds: each beats the best of Mount Vigil in its
  // role, and they climb region by region.
  // The Pinefall.
  woodcutters_flannel: { name: "Woodcutter's Flannel", defense: 5, spGain: 0.3 },
  fallen_leaf_cloak: { name: 'Fallen-Leaf Cloak', defense: 4, magic: 0.5, spGain: 0.2 },
  barkplate: { name: 'Barkplate', defense: 6, magic: -0.1 },
  // The Lantern Marsh.
  reedwoven_coat: { name: 'Reedwoven Coat', defense: 5, magic: 0.55 },
  eelskin_waders: { name: 'Eelskin Waders', defense: 5, spGain: 0.4, magic: 0.15 },
  // The Hollow Valley.
  mosaic_mail: { name: 'Mosaic Mail', defense: 6, magic: 0.35, spGain: 0.15 },
  // Teasel's forge in Lasthome: the heaviest thing in the game so far, and
  // her own spare leathers.
  bell_bronze_breastplate: { name: 'Bell-Bronze Breastplate', defense: 7, magic: -0.15 },
  smiths_leathers: { name: "Smith's Leathers", defense: 6, spGain: 0.3 },
  // Ves's.
  tin_lined_cape: { name: 'Tin-Lined Cape', wielder: 'vesper', shelterDef: 3, grazeSp: 0.3, regen: 1 },
  woodsmoke_shawl: { name: 'Woodsmoke Shawl', wielder: 'vesper', regen: 4, shelterDef: 2 },
  heron_down_coat: { name: 'Heron-Down Coat', wielder: 'vesper', shelterDef: 3, regen: 3, grazeSp: 0.15 },
  mended_coat: { name: 'Mended Evening Coat', wielder: 'vesper', shelterDef: 3, regen: 3, grazeSp: 0.25 },
  // In the Dead City's chests: the Old Street, the Colonnade, the Crier's Square.
  lamp_soot_shawl: { name: 'Lamp-Soot Shawl', wielder: 'vesper', regen: 5, shelterDef: 2 },
  herald_banner_cloak: { name: "Herald's Banner Cloak", wielder: 'vesper', shelterDef: 4, regen: 3, grazeSp: 0.2 },
  criers_mittens: { name: "Crier's Mittens", wielder: 'vesper', grazeSp: 0.35, regen: 2 },
  // The Hushwood. The hero's: up the old lookout tree, and from Rummage.
  lookouts_oilskin: { name: "Lookout's Oilskin", defense: 6, spGain: 0.25, magic: 0.1 },
  herald_greatcoat: { name: 'Fallen Herald Coat', defense: 5, magic: 0.4, spGain: 0.2 },
  // Bramble's.
  hand_me_down_flannel: { name: 'Hand-Me-Down Flannel', wielder: 'bramble', regen: 1 },
  kiln_jerkin: { name: 'Kiln-Leather Jerkin', wielder: 'bramble', regen: 2, grazeSp: 0.1 },
  acorn_cap: { name: 'Acorn Cap', wielder: 'bramble', grazeSp: 0.2, sneak: 0.25 },
  mas_scarf: { name: "Ma's Scarf", wielder: 'bramble', regen: 2, allyCalm: 3 },
  oilcloth_poncho: { name: 'Oilcloth Poncho', wielder: 'bramble', regen: 3, shorten: 0.1 },
};

// One stat of a piece of armor, 0 if it hasn't got it.
export function armorStat(id, stat) {
  return ARMOR[id]?.[stat] ?? 0;
}

// Short labels for the menus: "DEF +2", "MAG +25%", "SP +10%". Stats it
// hasn't got are left out.
export function armorLabels(id) {
  const percent = (value) => `${value > 0 ? '+' : ''}${Math.round(value * 100)}%`;
  const labels = [];
  const defense = armorStat(id, 'defense');
  const magic = armorStat(id, 'magic');
  const spGain = armorStat(id, 'spGain');
  if (defense) labels.push({ stat: 'defense', text: `DEF ${defense > 0 ? '+' : ''}${defense}`, bad: defense < 0 });
  if (magic) labels.push({ stat: 'magic', text: `MAG ${percent(magic)}`, bad: magic < 0 });
  if (spGain) labels.push({ stat: 'spGain', text: `SP ${percent(spGain)}`, bad: spGain < 0 });
  return labels;
}
