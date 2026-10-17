// Weapons the hero can equip from the EQUIP menu (C in the overworld).
// Descriptions live in text/items/weapons.txt, one section per id.
//
// fightPower scales FIGHT damage. ability is the soul ability used with SHIFT
// while dodging (see src/battle/soulAbilities.js), or null for none. Stronger
// abilities come with weaker FIGHT damage.
export const WEAPONS = {
  worn_sword: { name: 'Worn Sword', fightPower: 1, ability: null },
  old_shield: { name: 'Old Shield', fightPower: 0.7, ability: 'block' },
  duelist_blade: { name: "Duelist's Blade", fightPower: 0.9, ability: 'parry' },
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
};
