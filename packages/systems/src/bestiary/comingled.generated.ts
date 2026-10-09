// AUTO-GENERATED — do not edit by hand.
// Produced by scripts/genComingledBestiary.mjs from data/solryn-bestiary/volume-*.json
// (plain-JSON exports of the Solryn Bestiary PDF/text volumes — each creature's stat
// card carries both its 5e and Solryn stat rows). These entries are tagged
// systems: ['dnd5e', 'solryn'] and are usable from either game — see bestiary/comingled.ts.
// Regenerate after adding a new volume file: node packages/systems/scripts/genComingledBestiary.mjs
import type { BestiaryEntry } from '@epoch/shared-types';

export const comingledBestiary: BestiaryEntry[] = [
  {
    "id": "abyssal-broodling",
    "name": "Abyssal Broodling",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 66,
      "dr": 3,
      "speed": "Swim 40 / climb 30",
      "type": "Aberration (Deep-Sea Horror)",
      "environment": "Hadal trenches, seafloor vents, cursed wrecks",
      "tr": 4,
      "tier": "Tough",
      "xp": 160,
      "soulCore": "Void (Abyss-Spore)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 16,
      "dex": 20,
      "con": 16,
      "wis": 14,
      "int": 12,
      "cha": 14
    },
    "armorClass5e": 18,
    "abilityScoresSolryn": {
      "str": 13,
      "nim": 15,
      "end": 12,
      "wis": 10,
      "int": 9,
      "arc": 11,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Rending Maw",
        "diceExpr": "2d6",
        "damageType": "Piercing + Necrotic",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 1d4 Piercing + Necrotic) If the target is bleeding, the Broodling regains 1d4 HP. Melee 5 ft."
      },
      {
        "name": "Skitterstrike (Dash + Attack)",
        "diceExpr": "2d6",
        "damageType": "Piercing",
        "note": "Moves up to 30 ft and attacks. If it started from hiding, target is Stunned for 1 round on failed Endurance save (DC 14)."
      },
      {
        "name": "Hollow Wail (Rech 5-6)",
        "diceExpr": "2d4",
        "damageType": "Psychic (15 ft radius)",
        "note": "All enemies must succeed Wisdom save (DC 15) or gain Disadvantage on next attack due to disorientation."
      }
    ],
    "abilities": [
      "Dark Pressure Adaptation (Passive): Immune to pressure, blindness, and disorientation. In dim light or darkness, gains +1 DR and becomes undetectable to passive Perception below DC 18.",
      "Aberrant Spawn Pulse (1/combat): Upon dropping to half HP, spawns a Broodspawn (Easy) that acts immediately. Broodspawn: 12 HP, 1d6 Piercing attack."
    ],
    "lore": "Broodlings were once thought to be larval forms of something worse. Cults to the Deep Eye claim each one sees what its master sees. An angular, crab-like creature with pale, rubbery skin stretched over bone-like plates. Its glowing maw opens vertically and pulses with dim purple light. Dozens of tiny limbs unfold from slits along its body, twitching erratically."
  },
  {
    "id": "abyssal-maw",
    "name": "Abyssal Maw",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 200,
      "dr": 8,
      "speed": "40 ft / swim 50",
      "type": "Aberration (Legendary, Gargantuan)",
      "environment": "Abyssal depths, sunken ruins, deep sea trenches",
      "tr": 10,
      "tier": "Deadly",
      "xp": 1200
    },
    "abilityScores5e": {
      "str": 26,
      "dex": 10,
      "con": 28,
      "wis": 14,
      "int": 5,
      "cha": 12
    },
    "armorClass5e": 18,
    "abilityScoresSolryn": {
      "str": 22,
      "nim": 6,
      "end": 24,
      "wis": 10,
      "int": 3,
      "arc": 8,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Bite (Multiattack, 10 ft)",
        "diceExpr": "6d12+8",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: 1 Bite + 2 Tentacle Slams. Large or smaller targets are Grappled (DC 18) and Restrained."
      },
      {
        "name": "Tentacle Slam (x2, 20 ft)",
        "diceExpr": "4d10+8",
        "damageType": "Bludgeoning",
        "note": "Strength save (DC 18) or be knocked Prone. Reach 20 ft."
      },
      {
        "name": "Devour (Rech 5-6)",
        "diceExpr": "12d6",
        "damageType": "/round Acid (Swallow)",
        "note": "Grappled target makes Nimbleness save (DC 18) or is swallowed: Blinded, Restrained, 12d6 Acid per turn. Freed if Maw takes 50+ damage in one turn from inside."
      }
    ],
    "abilities": [
      "Legendary Actions (3/round): Tail Swipe (5d10+8 Bludg., 15 ft), Lurking Horror (costs 2 — move + Hide in dim light), or Dreadful Roar (Rech 6 — 60 ft, DC 18 CON or Stunned).",
      "Abyssal Regeneration (Passive): Regains 20 HP at start of turn unless it takes Radiant or Force damage. Legendary Hunger: regains HP equal to half a devoured creature's max HP.",
      "Terrifying Presence (30 ft): Creatures starting their turn within 30 ft must make Wisdom save (DC 18) or be Frightened for 1 minute (save ends each turn)."
    ],
    "lore": "The Abyssal Maw is a gargantuan horror from the deepest trenches of the world's oceans. Its multiple sensory stalks make it nearly impossible to surprise, and its regenerative body heals relentlessly unless scorched by radiant light. Those swallowed dissolve in acid while the beast fights on. It understands Abyssal but cannot speak — only roar."
  },
  {
    "id": "acid-fly",
    "name": "Acid Fly",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 7,
      "dr": 1,
      "speed": "10 ft / fly 40",
      "type": "Monstrosity (Tiny Swarm Insect)",
      "environment": "Swamps, battlefields, rotting dungeons",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 3,
      "dex": 16,
      "con": 12,
      "wis": 10,
      "int": 1,
      "cha": 3
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 2,
      "nim": 13,
      "end": 6,
      "wis": 6,
      "int": 1,
      "arc": 1,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Acid Bite",
        "diceExpr": "1d4+1",
        "damageType": "Piercing + Acid",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 1d8 Piercing + Acid) On hit, target must succeed Nimbleness save (DC 12) or take 2d6 acid at start of next turn. Can use action to wipe off the acid. Melee 5 ft."
      },
      {
        "name": "Explosive Demise (On Death)",
        "diceExpr": "2d6",
        "damageType": "Acid (5 ft radius)",
        "note": "When it dies, explodes in acid spray. Nimbleness save (DC 12) or take full damage. Acid remains on a fail: 1d6 ongoing acid per turn until washed or scraped off."
      }
    ],
    "abilities": [
      "Acidic Glow (Passive): Emits faint bioluminescent green glow, dimly illuminating 5 ft. Glow intensifies when agitated or ready to explode.",
      "Swarm Instinct (Passive): If 3+ Acid Flies are within 5 ft of each other, all gain advantage on attack rolls against the same target. Deaths can cause chain-reaction explosions.",
      "Rotting Attraction (Passive): Drawn to rotting meat or fresh blood within 60 ft. Prioritizes flying toward it unless directly threatened."
    ],
    "lore": "Individually weak, but in swarms they overwhelm adventurers. Found near corpses, battlefields, or abandoned dungeons where flesh has decayed. Can be used as natural defense by necromancers, or harvested for acid bombs. If a few explode, they cause chain reactions that spread acid everywhere."
  },
  {
    "id": "aether-wraith",
    "name": "Aether Wraith",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 90,
      "dr": 3,
      "speed": "0 ft / fly 40 (hover)",
      "type": "Undead (Anti-Magic Spirit)",
      "environment": "Collapsed wizard towers, arcane dead zones, cursed libraries",
      "tr": 6,
      "tier": "Deadly",
      "xp": 400
    },
    "abilityScores5e": {
      "str": 8,
      "dex": 14,
      "con": 18,
      "wis": 12,
      "int": 10,
      "cha": 14
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 5,
      "nim": 10,
      "end": 15,
      "wis": 8,
      "int": 7,
      "arc": 10,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Spectral Claw",
        "diceExpr": "6d6",
        "damageType": "Necrotic",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "If target is a spellcaster, they lose one spell slot of their highest available level. Melee 5 ft."
      }
    ],
    "abilities": [
      "Envelop (Rech 5-6, 30 ft) (Special): Endurance save (DC 18) or target is Incapacitated 1 min with all spell slots and prepared spells suppressed (save ends each turn).",
      "Mana Nullification Aura (30 ft): Creatures within 30 ft make Wisdom save (DC 18) at start of turn or cannot cast spells and ongoing spell effects are suppressed for that turn. Success = immune for 24 hours.",
      "Legendary Actions (2/round): Drain Mana (target spellcaster within 30 ft makes INT save DC 18 or lose highest available spell slot) or Phantom Shift (move full fly speed, no opportunity attacks)."
    ],
    "lore": "The Aether Wraith is the bane of spellcasters — it doesn't just damage, it dismantles. Its aura suppresses magic every single turn, Spectral Claw strips spell slots on a hit, and Envelop can shut down a caster entirely. Even legendary actions drain slots. A party relying on magic will find themselves mundane in moments."
  },
  {
    "id": "arachnid-horror",
    "name": "Arachnid Horror",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 50,
      "dr": 2,
      "speed": "30 ft / climb 30",
      "type": "Beast (Monstrous Arachnid)",
      "environment": "Caves, forests, ruins, web-choked tunnels",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 16,
      "dex": 18,
      "con": 14,
      "wis": 12,
      "int": 3,
      "cha": 6
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 13,
      "nim": 14,
      "end": 10,
      "wis": 8,
      "int": 2,
      "arc": 3,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Bite (Multiattack)",
        "diceExpr": "2d8+5",
        "damageType": "Piercing + Poison",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 3d6 Piercing + Poison) Multiattack: one Bite + one Web. Venomous: Endurance save (DC 15) or Poisoned AND Paralyzed for 1 minute (save ends each turn). Melee 5 ft."
      }
    ],
    "abilities": [
      "Web (Rech 5-6, 30/60 ft) (Special (Ranged)): Target is Restrained. DC 15 Strength to escape. Web: AC 10, 10 HP, vulnerable to fire.",
      "Web Trap (Action): Creates a 10 ft cube of webbing. Area becomes difficult terrain. Creatures entering or starting a turn in it must make Nimbleness save (DC 15) or be Restrained. Web: AC 10, 20 HP, vulnerable to fire.",
      "Wall Climb (Passive): Can climb any surface including ceilings without ability checks. Tremorsense 30 ft."
    ],
    "lore": "A monstrous spider-like creature with multiple eyes and venomous fangs. The Arachnid Horror uses its web to trap unsuspecting prey and its venomous bite to incapacitate them. Its ability to create web traps covering entire areas makes it a dangerous controller that turns the battlefield itself into a weapon."
  },
  {
    "id": "barnacled-colossus",
    "name": "Barnacled Colossus",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 80,
      "dr": 6,
      "speed": "25 ft",
      "type": "Construct (Sea-Wrought Golem)",
      "environment": "Submerged ruins, tidal shelves, forbidden coastal shrines",
      "tr": 5,
      "tier": "Deadly",
      "xp": 250,
      "soulCore": "Earthen (Deepbind)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 6,
      "con": 20,
      "wis": 8,
      "int": 4,
      "cha": 6
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 6,
      "end": 16,
      "wis": 7,
      "int": 5,
      "arc": 4,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Wreck Slam",
        "diceExpr": "3d6+5",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Target must succeed Endurance save (DC 15) or be knocked prone and take 1d4 additional damage from splintered wood. Melee 10 ft."
      },
      {
        "name": "Anchor Toss (Recharge 4-6)",
        "diceExpr": "2d10+5",
        "damageType": "Bludg. (30 ft, 10 ft AoE)",
        "note": "Creatures in radius must make Nimbleness save (DC 15) or be pushed 10 ft and staggered (lose next reaction)."
      }
    ],
    "abilities": [
      "Crushing Wake (Passive): Movement through any terrain leaves it difficult (rough ground, unstable stone, flooded zones). Applies even in buildings or ships.",
      "Bellow of the Deep (1/rest): Emits a vibrating roar from its hollow chest. All creatures within 20 ft must succeed Wisdom save (DC 16) or become Frightened for 1 round."
    ],
    "lore": "Legends speak of constructs built by sea priests to guard forbidden relics. Others claim the ocean itself raises these creatures to reclaim what was stolen from its depths. Towering at nearly 15 feet, its frame is built of shattered masts and driftwood lashed with seaweed. Iron anchors drag behind like tails, and broken figureheads leer from its chest."
  },
  {
    "id": "barnacled-wailer",
    "name": "Barnacled Wailer",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 64,
      "dr": 3,
      "speed": "30 ft / swim 20",
      "type": "Undead (Cursed Drowned)",
      "environment": "Shipwreck zones, drowned villages, cursed coastal ruins",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 10,
      "con": 18,
      "wis": 14,
      "int": 4,
      "cha": 8
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 8,
      "end": 15,
      "wis": 11,
      "int": 4,
      "arc": 6,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Drowned Grasp",
        "diceExpr": "2d6",
        "damageType": "Bludg. + Necrotic",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 1d4 Bludg. + Necrotic) On hit, target must succeed Strength save (DC 14) or be Restrained as seaweed lashes from the Wailer's arms. Melee 5 ft."
      },
      {
        "name": "Echoing Scream (Rech 5-6)",
        "diceExpr": "2d4",
        "damageType": "Psychic (20 ft radius)",
        "note": "All creatures must make Wisdom save (DC 15) or be Stunned for 1 round from the scream's mental trauma."
      },
      {
        "name": "Saltwater Surge (1/rest)",
        "diceExpr": "1d6",
        "damageType": "Bludg. (Melee AoE)",
        "note": "Pushes all nearby creatures 10 ft away in a surge of bile and brine."
      }
    ],
    "abilities": [
      "Memory of the Deep (On Death): At 0 HP, lets out a final scream. DC 14 Wisdom save or all creatures in 30 ft take 1d6 Psychic damage and become Frightened for 1 round.",
      "Wail-Touched Waters (Environmental): If it remains in one location 24+ hours, surrounding waters become haunted — reeling in other undead within a 1-mile radius over time."
    ],
    "lore": "Barnacled Wailers are drowned spirits whose rage and sorrow echo through their corpses. Some are mothers who drowned holding children. Others are mutineers left to the sea. All remember pain. A desiccated humanoid covered in coral-encrusted barnacles, its jaw unhinged into a permanent scream. Water constantly leaks from its body."
  },
  {
    "id": "bloated-zombie",
    "name": "Bloated Zombie",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 22,
      "dr": 1,
      "speed": "20 ft",
      "type": "Undead (Plague Carrier)",
      "environment": "Graveyards, crypts, plague towns, necromancer lairs",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 6,
      "con": 16,
      "wis": 6,
      "int": 3,
      "cha": 5
    },
    "armorClass5e": 9,
    "abilityScoresSolryn": {
      "str": 11,
      "nim": 4,
      "end": 13,
      "wis": 4,
      "int": 2,
      "arc": 3,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "1d8+3",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Melee 5 ft."
      },
      {
        "name": "Death Burst (On Death)",
        "diceExpr": "4d6",
        "damageType": "Necrotic (10 ft radius)",
        "note": "When reduced to 0 HP, explodes in necrotic gas. Endurance save (DC 13) or take full damage and be Poisoned for 1 minute (save ends each turn). Half damage on success."
      }
    ],
    "abilities": [
      "Undead Fortitude (Passive): When damage would reduce it to 0 HP, makes Endurance save (DC 5 + damage taken). On success, drops to 1 HP instead. Fails automatically against Radiant damage or critical hits."
    ],
    "lore": "Slow and reeking, the Bloated Zombie lumbers forward with grim persistence. Its decayed form resists mundane blows, and killing it may be the worst mistake — the necrotic gas it releases on death can poison an entire party clustered together."
  },
  {
    "id": "bogroot-shambler",
    "name": "Bogroot Shambler",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 75,
      "dr": 4,
      "speed": "20 ft (Swampwalk)",
      "type": "Plant (Swamp Golem)",
      "environment": "Swamps, marshes, rotting wetlands",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 20,
      "dex": 4,
      "con": 22,
      "wis": 8,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 11,
    "abilityScoresSolryn": {
      "str": 16,
      "nim": 4,
      "end": 18,
      "wis": 6,
      "int": 2,
      "arc": 1,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Root Slam",
        "diceExpr": "2d10",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "On hit, target is Grappled (DC 13 Strength to escape). Melee 10 ft."
      }
    ],
    "abilities": [
      "Entangling Vines (1/rest) (Special (10 ft radius)): All creatures within 10 ft must make Nimbleness save (DC 14) or become Restrained for 2 rounds.",
      "Mire Camouflage (Passive): When motionless in swamp terrain, indistinguishable from natural vegetation. DC 16 Insight check to notice.",
      "Rotting Aura (5 ft): At the start of each of its turns, all non-plant creatures within 5 ft must make Endurance save (DC 12) or take 1d6 Poison damage from fungal spores.",
      "Regenerative Bark (Passive): Recovers 5 HP per round while standing in muddy or wet terrain."
    ],
    "lore": "A massive, shambling creature made of knotted roots, sodden bark, and decaying vegetation. Its hulking form is constantly dripping with algae and muck. Glowing fungal growths pulse faintly within its body, hinting at a rudimentary intelligence. It lumbers silently through the mire, violently defending its chosen domain from intruders."
  },
  {
    "id": "bogrot-toad",
    "name": "Bogrot Toad",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 68,
      "dr": 3,
      "speed": "20 ft / swim 30",
      "type": "Beast (Swamp Amphibian)",
      "environment": "Marshes, sinkholes, sunken ruins, slime pools",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 8,
      "con": 20,
      "wis": 10,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 12,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 7,
      "end": 16,
      "wis": 8,
      "int": 3,
      "arc": 2,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Tongue Lash (10 ft reach)",
        "diceExpr": "2d6",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Target must succeed Endurance save (DC 15) or be Pulled adjacent and Poisoned (disadvantage on physical actions for 1 round)."
      },
      {
        "name": "Mucus Spray (Rech 5-6)",
        "diceExpr": "1d6",
        "damageType": "Acid (15 ft cone)",
        "note": "All creatures must make Nimbleness save (DC 14) or be Blinded for 1 round."
      },
      {
        "name": "Croak Burst (AoE)",
        "diceExpr": "2d4",
        "damageType": "Thunder (10 ft radius)",
        "note": "All within range must make Wisdom save (DC 13) or be Deafened for 1 round."
      }
    ],
    "abilities": [
      "Toxic Hide (Passive): Creatures who strike the toad in melee with natural or unarmed attacks take 1 Poison damage per hit.",
      "Stench of Decay (Aura, 5 ft): Creatures starting their turn within 5 ft must succeed Wisdom save (DC 12) or suffer disadvantage on concentration checks and social rolls for 1 minute."
    ],
    "lore": "Bogrot Toads are viewed by many swampfolk as bad omens — especially if they take residence near a homestead. Their mucus has curative applications when alchemically diluted, despite its danger. A massive toad with warty, slimy skin stained green and brown. Its bulbous throat pouch pulses when it breathes, and mucus constantly oozes from open pores."
  },
  {
    "id": "bramble-boar",
    "name": "Bramble Boar",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 28,
      "dr": 2,
      "speed": "30 ft",
      "type": "Beast (Aggressive Herbivore)",
      "environment": "Highland thickets, bramble patches, overgrown ruins",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 10,
      "con": 18,
      "wis": 8,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 12,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 8,
      "end": 14,
      "wis": 6,
      "int": 2,
      "arc": 1,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Tusk Gore",
        "diceExpr": "1d6+4",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "If the boar moved 20 ft or more this turn, deal +1d4 damage and force a Strength save (DC 12) or knock the target Prone. Melee 5 ft."
      },
      {
        "name": "Thornshake (1/rest)",
        "diceExpr": "1d4",
        "damageType": "Piercing (AoE)",
        "note": "Violently shakes, flinging sharp thorns in all directions. All creatures within 10 ft must make a Nimbleness save (DC 13) or take 1d4 Piercing damage and suffer -1 to Nimbleness checks for 1 round."
      }
    ],
    "abilities": [
      "Brushbreaker: Ignores movement penalties from dense terrain (brambles, undergrowth, thick snow).",
      "Pain-Fueled Rage: When reduced to half HP or less, gains +1 damage and advantage on checks to resist being grappled or restrained."
    ],
    "lore": "The Bramble Boar is a dreaded presence among highland foragers. Even seasoned hunters avoid areas where thorn trails are fresh. Local tales say some are cursed by druids to protect overgrown groves. Others believe they were twisted by eating tainted herbs. Its mottled hide is matted with thorns, burrs, and tangled vines, and its jagged tusks are often bloodstained from prior fights."
  },
  {
    "id": "brontosaurus",
    "name": "Brontosaurus",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 80,
      "dr": 4,
      "speed": "30 ft",
      "type": "Beast (Colossal Herbivore)",
      "environment": "Prehistoric valleys, overgrown ruins, druidic preserves",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 21,
      "dex": 9,
      "con": 20,
      "wis": 10,
      "int": 2,
      "cha": 7
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 6,
      "end": 17,
      "wis": 7,
      "int": 1,
      "arc": 2,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Stomp (Multiattack, 20 ft)",
        "diceExpr": "4d8+5",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: one Stomp + one Tail. Trampling Charge: if moved 20+ ft toward target, Strength save (DC 16) or knocked Prone. Bonus Stomp vs prone target. Reach 20 ft."
      },
      {
        "name": "Tail (Multiattack, 20 ft)",
        "diceExpr": "3d8+5",
        "damageType": "Bludgeoning",
        "note": "Reach 20 ft."
      }
    ],
    "abilities": [
      "Trampling Charge (Passive): If it moves 20+ ft straight toward a target and hits with Stomp, target makes Strength save (DC 16) or is knocked Prone. Can make a bonus Stomp attack against a prone target."
    ],
    "lore": "An enormous, long-necked herbivore that becomes catastrophically dangerous when startled or defending its herd. 20 ft reach on both attacks means it threatens a massive area, and a Trampling Charge followed by a bonus Stomp on the prone target can deal over 60 bludgeoning damage in a single turn."
  },
  {
    "id": "burrow-chuff",
    "name": "Burrow Chuff",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 14,
      "dr": 1,
      "speed": "20 ft / burrow 25",
      "type": "Beast (Rodent, Digger)",
      "environment": "Hillsides, root thickets, abandoned homesteads",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 10,
      "dex": 14,
      "con": 16,
      "wis": 12,
      "int": 4,
      "cha": 5
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 8,
      "nim": 10,
      "end": 12,
      "wis": 8,
      "int": 4,
      "arc": 2,
      "lck": 6
    },
    "abilities": [
      "None (Non-Aggressive): The Burrow Chuff does not attack. It bluffs with noise, then flees into tunnels. Will only defend if young are directly threatened.",
      "Warning Chuff (Reaction): When startled, emits a sudden air-burst. Creatures within 5 ft must make a Wisdom save (DC 11) or become Distracted (-1 to their next Perception or attack roll).",
      "Tunnel Collapse (1/day, Underground): May collapse a tunnel behind it when escaping. Creatures pursuing must make a Nimbleness save (DC 12) or be Pinned under rubble for 1 round (or until freed).",
      "Soil Sense (Passive): Detects unstable ground and vibrations from creatures within 30 ft underground. Cannot be surprised in burrows or tunnels."
    ],
    "lore": "Miners and tunnelers used to keep Burrow Chuffs in cages — when the chuff sounded off, cave-ins or quakes often followed. Their tunnels often lead to freshwater pockets or unmined stone. A thick-bodied rodent about the size of a small badger, with bristle-backed fur in earthen tones and large reinforced foreclaws built for digging."
  },
  {
    "id": "burrowing-beetle",
    "name": "Burrowing Beetle",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 45,
      "dr": 4,
      "speed": "30 ft / burrow 20",
      "type": "Beast (Tiny Armored Insect)",
      "environment": "Underground tunnels, earthen dungeons, forest floors",
      "tr": 2,
      "tier": "Easy",
      "xp": 40
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 10,
      "con": 16,
      "wis": 10,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 7,
      "end": 13,
      "wis": 7,
      "int": 1,
      "arc": 2,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Mandibles (Multiattack)",
        "diceExpr": "2d10+4",
        "damageType": "(+) Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also (+2d6) Piercing) Multiattack: one Mandibles + one Acidic Spit. +2d6 if target wears no armor. Bonus action: burrow into unarmored flesh — target Grappled (DC 14), takes 3d6 Piercing per turn until escaped. Melee 5 ft."
      },
      {
        "name": "Acidic Spit (30 ft)",
        "diceExpr": "3d8",
        "damageType": "Acid",
        "note": "Endurance save (DC 14) or take 2d6 additional Acid at start of next turn."
      }
    ],
    "abilities": [
      "Burrower (Passive): Can burrow through earth and unworked stone at 20 ft. Tremorsense 60 ft, Blindsight 30 ft. Thick exoskeleton provides high natural armor."
    ],
    "lore": "Deceptively tiny, the Burrowing Beetle is far more dangerous than it looks — its mandibles bore through unarmored flesh with terrifying efficiency, and its Acid Spit punishes ranged attackers. Its Burrow Into Flesh ability creates a sustained grapple dealing 3d6 piercing every turn. A swarm of these Tiny beetles is a nightmare encounter."
  },
  {
    "id": "clay-golem",
    "name": "Clay Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 90,
      "dr": 5,
      "speed": "20 ft",
      "type": "Construct (Unstable Guardian)",
      "environment": "Temples, alchemical workshops, cursed altars",
      "tr": 5,
      "tier": "Deadly",
      "xp": 250
    },
    "abilityScores5e": {
      "str": 20,
      "dex": 9,
      "con": 18,
      "wis": 8,
      "int": 3,
      "cha": 1
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 17,
      "nim": 5,
      "end": 15,
      "wis": 5,
      "int": 2,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "2d10+5",
        "damageType": "Bludgeoning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam attacks. Magical. Melee 5 ft."
      }
    ],
    "abilities": [
      "Haste (Rech 5-6) (Self-Buff): Until end of next turn: +2 AC, advantage on Nimbleness saves, and can use Slam as a bonus action.",
      "Berserk (Triggered): When it starts its turn at 60 HP or fewer, roll 1d6. On a 6, it goes berserk — attacks nearest creature or object. Remains berserk until destroyed or fully healed.",
      "Immutable Form & Magic Resistance: Immune to form-altering effects. Advantage on saves vs spells. Immune to nonmagical weapons, acid, poison, and psychic damage."
    ],
    "lore": "Less impervious than the Iron or Stone Golem but more terrifying in practice — the Berserk trait means a damaged Clay Golem may turn on its own master, attacking friend and foe alike. Haste adds a bonus Slam and +2 AC in critical moments, making it most dangerous when it should be weakest."
  },
  {
    "id": "coralheart-sentinel",
    "name": "Coralheart Sentinel",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 76,
      "dr": 6,
      "speed": "20 ft / swim 20",
      "type": "Elemental Construct (Reef Guardian)",
      "environment": "Sacred reefs, sunken temples, forgotten tidal groves",
      "tr": 4,
      "tier": "Tough",
      "xp": 160,
      "soulCore": "Earthen (Reefbound)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 4,
      "con": 22,
      "wis": 14,
      "int": 4,
      "cha": 10
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 4,
      "end": 17,
      "wis": 10,
      "int": 6,
      "arc": 9,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Coral Slam",
        "diceExpr": "2d8+5",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Target must succeed Endurance save (DC 15) or be Slowed (-10 ft movement) as coral shards dig into limbs. Melee 10 ft."
      },
      {
        "name": "Fracture Wave (Rech 5-6)",
        "diceExpr": "2d6",
        "damageType": "Piercing + Force (15 ft cone)",
        "note": "(also 1d4 Piercing + Force (15 ft cone)) Ground in the cone becomes difficult terrain for 1 minute."
      },
      {
        "name": "Sentinel's Grasp (1/rest)",
        "diceExpr": "2d6+5",
        "damageType": "Crushing",
        "note": "Grapples target with coral growths. While grappled, target has -2 DR from ongoing magical corrosion."
      }
    ],
    "abilities": [
      "Rooted in the Reef (Passive): In coral terrain or seawater, regenerates 3 HP per turn and becomes immovable (advantage on all checks to resist forced movement).",
      "Bound to Sacred Site: Cannot leave a 120 ft radius from its guardian site unless magically freed. If destroyed more than once in a lunar cycle, the reef it guards begins to die."
    ],
    "lore": "Coralheart Sentinels were once created by sea druids to defend underwater temples. Their magic is intertwined with the health of the reef — when they fall, so do the waters around them. A golem-like being formed from bleached coral, fossilized bone, driftwood, and shells. Its chest glows with embedded pearls and a coral heart pulsing with magic."
  },
  {
    "id": "crag-hound",
    "name": "Crag Hound",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 24,
      "dr": 2,
      "speed": "35 ft",
      "type": "Magical Beast (Omen Hound, Shadowbound)",
      "environment": "Mountain passes, cliff trails, old battlefields",
      "tr": 1,
      "tier": "Easy",
      "xp": 10,
      "soulCore": "Shadow",
      "coreRarity": "Common"
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 14,
      "con": 13,
      "wis": 12,
      "int": 6,
      "cha": 8
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 12,
      "nim": 10,
      "end": 10,
      "wis": 8,
      "int": 6,
      "arc": 6,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Shadow Fang",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Target must succeed a Luck save (DC 12) or suffer Creeping Fear (-1 to Wisdom-based checks for 1 minute). Melee 5 ft."
      }
    ],
    "abilities": [
      "Howl of Warning (1/rest) (Special): Emits a long, mournful howl. All enemies within 30 ft must make a Wisdom save (DC 12) or become Rattled (-1 to their next action or attack roll).",
      "Mountain Ghost: Leaves no tracks and cannot be detected by scent. Gains advantage on stealth checks in rocky, dark, or foggy terrain.",
      "Death-Stalker: If any creature within 30 ft drops to 0 HP, the Crag Hound gains +1 DR and +1 damage until that creature stabilizes or dies.",
      "Shadowmeld (Recharge 5-6): Vanishes into one shadow and reappears in another within 20 ft. Does not provoke reactions during this movement."
    ],
    "lore": "In Solryn's mountains, to hear a Crag Hound's howl is to walk the line between fate and misfortune. These spectral beasts are not killers by nature — but watchers, stalkers, guardians of old paths. Some villagers leave offerings near cliff trails to keep them at bay. Others say they guide the worthy home... and the unworthy to their end."
  },
  {
    "id": "crystal-golem",
    "name": "Crystal Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 130,
      "dr": 6,
      "speed": "30 ft",
      "type": "Construct (Prismatic Guardian)",
      "environment": "Arcane vaults, crystal caves, planar observatories",
      "tr": 8,
      "tier": "Deadly",
      "xp": 800
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 12,
      "con": 22,
      "wis": 11,
      "int": 4,
      "cha": 1
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 8,
      "end": 18,
      "wis": 7,
      "int": 2,
      "arc": 5,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "3d10+6",
        "damageType": "Bludg. + Psychic (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 2d6 Bludg. + Psychic (Magical)) Multiattack: two Slam attacks. Melee 5 ft."
      },
      {
        "name": "Prismatic Burst (Rech 5-6)",
        "diceExpr": "8d8",
        "damageType": "Radiant (20 ft radius)",
        "note": "Nimbleness save (DC 18) or take full damage and be Blinded until end of next turn. Half damage on success."
      }
    ],
    "abilities": [
      "Reflective Body (Passive): When hit by a ranged spell attack targeting only the golem, roll 1d6. On 4+, the spell is reflected back at the caster. Shares this mechanic with the Glass Golem but applies to all ranged spell attacks, not just those requiring attack rolls.",
      "Thunder Vulnerability & Psychic Resistance: Vulnerable to Thunder — same as Glass Golem. Unusually resists Psychic damage. AC 18 — highest in the golem family alongside the Iron Golem. Immune to nonmagical weapons and poison."
    ],
    "lore": "The pinnacle of crystalline golem-craft. Its Prismatic Burst blinds on a failed save while dealing radiant damage, its Slams add psychic damage, and its Reflective Body turns ranged spells against casters. AC 18 with CON 22 and Magic Resistance makes it one of the most durable creatures in the bestiary. Thunder is the one reliable counter."
  },
  {
    "id": "crysthorn-serpent",
    "name": "Crysthorn Serpent",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 36,
      "dr": 3,
      "speed": "30 ft / burrow 20",
      "type": "Magical Beast (Ley-bound Wyrm)",
      "environment": "Deep caverns, leyline rifts, buried altars",
      "tr": 2,
      "tier": "Easy",
      "xp": 40,
      "soulCore": "Gravitic",
      "coreRarity": "Uncommon"
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 14,
      "con": 20,
      "wis": 16,
      "int": 10,
      "cha": 18
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 10,
      "end": 16,
      "wis": 12,
      "int": 8,
      "arc": 14,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Horn Lash",
        "diceExpr": "2d6+4",
        "damageType": "Bludg. + Arcane",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 1d4 Bludg. + Arcane) On a roll of 4 on the Arcane die, the target is overwhelmed by leyline feedback and loses its next Reaction. Melee 5 ft."
      },
      {
        "name": "Pulse Discharge (1/rest)",
        "diceExpr": "2d4",
        "damageType": "Arcane (10 ft AoE)",
        "note": "All creatures in 10 ft radius take 2d4 Arcane damage. Creatures with magical items must make an Arcana save (DC 14) or have one item temporarily disrupted for 1 round."
      }
    ],
    "abilities": [
      "Ley-Tuned Hide (Passive): Gains +1 DR while within 50 ft of a leyline or in high-magic areas.",
      "Burrow Sense (Passive): Detects magical movement or spellcasting underground within 100 ft. Cannot be surprised in caverns.",
      "Glowing Bait (Optional): When stationary, the crystal horn glows subtly. Creatures within 30 ft must pass an Insight or Arcana check (DC 13) or become curious, moving closer on their next turn unless restrained or warned."
    ],
    "lore": "Many believe Crysthorn Serpents are relics of a time when the leylines were open and raw. Some say their horns point toward the closest hidden arcane source. A few desperate mages have sought to capture them alive — none have succeeded. A massive, limbless serpent plated in shimmering violet-blue scales, its crystal horn pulses with leyline energy and its body hums like a tuning fork."
  },
  {
    "id": "drakein-fire-priest",
    "name": "Drakein Fire Priest",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 50,
      "dr": 2,
      "speed": "30 ft",
      "type": "Humanoid (Draconic Cultist)",
      "environment": "Flame temples, volcanic shrines, Drakein war camps",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 12,
      "con": 16,
      "wis": 18,
      "int": 12,
      "cha": 14
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 9,
      "end": 13,
      "wis": 14,
      "int": 8,
      "arc": 10,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Drakeflame Staff (x2)",
        "diceExpr": "2d6+5",
        "damageType": "Bludg. + Fire",
        "ability5e": "wis",
        "abilitySolryn": "wis",
        "note": "(also 1d10 Bludg. + Fire) Multiattack: two staff attacks or cast a spell. Melee 5 ft."
      },
      {
        "name": "Fireball (1/rest)",
        "diceExpr": "8d6",
        "damageType": "Fire (20 ft sphere, 150 ft)",
        "note": "Nimbleness save (DC 15) or take full damage, half on success."
      },
      {
        "name": "Flame Strike (1/rest)",
        "diceExpr": "4d6",
        "damageType": "Fire + Radiant (10 ft cyl)",
        "note": "(also 4d6 Fire + Radiant (10 ft cyl)) Nimbleness save (DC 15) or take full damage, half on success. Also has: Burning Hands, Scorching Ray, Wall of Fire."
      }
    ],
    "abilities": [
      "Blessing of the Flame (Aura, 30 ft): All allied Drakein within 30 ft deal +1d8 Fire damage with melee attacks.",
      "Fiery Devotion (Passive): Whenever it casts a fire damage spell, one ally within 30 ft gains 10 temporary HP. Also has: Shield of Faith, Dispel Magic, Mass Cure Wounds."
    ],
    "lore": "The Drakein Fire Priest is a draconic cultist devoted to the flame, wielding divine fire magic to bolster allies and incinerate enemies. Its Blessing of the Flame turns every nearby Drakein warrior into a fire-wreathed threat, while its own spellcasting ranges from healing to devastating fireballs."
  },
  {
    "id": "drakein-warlord",
    "name": "Drakein Warlord",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 90,
      "dr": 6,
      "speed": "30 ft",
      "type": "Humanoid (Draconic Elite)",
      "environment": "Highland strongholds, volcanic throne rooms, war camps",
      "tr": 6,
      "tier": "Deadly",
      "xp": 400
    },
    "abilityScores5e": {
      "str": 20,
      "dex": 14,
      "con": 18,
      "wis": 14,
      "int": 12,
      "cha": 16
    },
    "armorClass5e": 18,
    "abilityScoresSolryn": {
      "str": 17,
      "nim": 10,
      "end": 15,
      "wis": 10,
      "int": 8,
      "arc": 12,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Drakefang Greatsword (x3)",
        "diceExpr": "2d10+5",
        "damageType": "Slashing + Fire",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 2d6 Slashing + Fire) Multiattack: three attacks per turn. Melee 5 ft."
      },
      {
        "name": "Smoldering Breath (Rech 5-6)",
        "diceExpr": "9d6",
        "damageType": "Fire (30 ft cone)",
        "note": "All creatures must make Nimbleness save (DC 16) or take full damage, half on success."
      }
    ],
    "abilities": [
      "Commanding Roar (Rech 5-6) (Special (30 ft radius)): Each enemy must make Wisdom save (DC 14) or become Frightened for 1 minute (save ends each turn).",
      "Draconic Commander (Aura, 30 ft): All allied Drakein within 30 ft gain advantage on melee attack rolls and saves against being Frightened.",
      "Pack Tactics (Passive): Gains advantage on attack rolls if an ally is within 5 ft of the target and not incapacitated."
    ],
    "lore": "The Drakein Warlord is a towering commander of draconic warriors, clad in half-plate forged from dragon-scale. Its presence on the battlefield rallies its soldiers and terrifies its enemies. Three strikes of its fire-wreathed greatsword can cleave through armor, and its breath weapon scorches a 30-foot cone of devastation."
  },
  {
    "id": "drakein-warrior",
    "name": "Drakein Warrior",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 35,
      "dr": 3,
      "speed": "30 ft",
      "type": "Humanoid (Draconic)",
      "environment": "Highland strongholds, volcanic foothills, cave lairs",
      "tr": 2,
      "tier": "Easy",
      "xp": 40
    },
    "abilityScores5e": {
      "str": 16,
      "dex": 12,
      "con": 16,
      "wis": 11,
      "int": 10,
      "cha": 10
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 13,
      "nim": 9,
      "end": 13,
      "wis": 7,
      "int": 7,
      "arc": 6,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Drakeblade (Multiattack)",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two melee attacks per turn (Drakeblade + Claw or two Drakeblades). Melee 5 ft."
      },
      {
        "name": "Claw (Multiattack)",
        "diceExpr": "1d8+3",
        "damageType": "Slashing",
        "note": "Melee 5 ft."
      },
      {
        "name": "Smoldering Breath (Rech 5-6)",
        "diceExpr": "4d6",
        "damageType": "Fire (15 ft cone)",
        "note": "All creatures must make Nimbleness save (DC 13) or take full damage, half on success."
      }
    ],
    "abilities": [
      "Pack Tactics (Passive): Gains advantage on attack rolls if an ally is within 5 ft of the target and not incapacitated.",
      "Draconic Resilience (Passive): Thick, scaled hide grants natural armor. Resistant to Fire damage."
    ],
    "lore": "Drakein Warriors are humanoid drakes — scaled, powerful, and disciplined. They fight in coordinated packs using blade and claw, with the ability to unleash smoldering breath when pressed. Their thick draconic hide makes them resilient fighters, and their pack tactics make them dangerous in numbers."
  },
  {
    "id": "duskwatcher-owlcat",
    "name": "Duskwatcher Owlcat",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 22,
      "dr": 1,
      "speed": "30 ft / glide 40",
      "type": "Beast (Stealth Predator)",
      "environment": "Highland woods, canopy trails, twilight groves",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 18,
      "con": 14,
      "wis": 16,
      "int": 6,
      "cha": 5
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 14,
      "end": 10,
      "wis": 12,
      "int": 6,
      "arc": 2,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Pounce Claw",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "If attacking from above or while hidden, deal +1d4 extra damage and target must succeed a Nimbleness save (DC 12) or be Knocked Prone. Melee 5 ft."
      }
    ],
    "abilities": [
      "Hiss-Screech (1/rest) (Special): Emits a sudden, piercing shriek. All enemies within 15 ft must make a Wisdom save (DC 12) or suffer -1 to their next roll due to disorientation.",
      "Silent Descent: Makes no sound when gliding or pouncing. Gains +2 to Stealth in dim light or when airborne.",
      "Twilight Tracker: Gains advantage on Perception checks during dusk and night. Can track wounded creatures by scent up to 200 ft away.",
      "Treebound Hunter: In wooded terrain, can move through trees without provoking reactions, as long as branches are connected or within jumping range."
    ],
    "lore": "Highlanders leave shiny trinkets or bones at the edge of tree lines to avoid Duskwatcher nests. Owlcats are drawn to magic-carrying prey but will attack nearly anything smaller than themselves. Their feathers are said to silence footsteps, and their eyes are sold as charms to see in the dark. A feline predator with an owl-like head, wide reflective eyes, and silent-wing membranes that let it glide from tree to tree without a sound."
  },
  {
    "id": "earth-golem",
    "name": "Earth Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 140,
      "dr": 6,
      "speed": "30 ft / burrow 20",
      "type": "Construct (Seismic Guardian)",
      "environment": "Mountain fortresses, underground vaults, earthen temples",
      "tr": 8,
      "tier": "Deadly",
      "xp": 800
    },
    "abilityScores5e": {
      "str": 24,
      "dex": 9,
      "con": 20,
      "wis": 10,
      "int": 6,
      "cha": 5
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 20,
      "nim": 5,
      "end": 17,
      "wis": 7,
      "int": 4,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "3d10+7",
        "damageType": "Bludgeoning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam attacks. Melee 5 ft."
      },
      {
        "name": "Rock Throw (30/60 ft)",
        "diceExpr": "4d10+7",
        "damageType": "Bludgeoning (Ranged)",
        "note": "Ranged attack — unique in the golem family. +12 to hit. Average 29 damage per throw."
      },
      {
        "name": "Earthquake Stomp (Rech 5-6)",
        "diceExpr": "10d6",
        "damageType": "Bludg. (20 ft radius)",
        "note": "Nimbleness save (DC 18) or take full damage and be knocked Prone. Structures and nonmagical objects take double damage."
      }
    ],
    "abilities": [
      "Earth Glide (Passive): Can move through nonmagical, unworked earth and stone without disturbing the material. Tremorsense 60 ft.",
      "Seismic Shockwave (Action): Creates tremors in 10 ft radius for 1 minute. Creatures entering or starting turn in area make Strength save (DC 18) or be Restrained. Action to attempt escape."
    ],
    "lore": "The Earth Golem is the only golem with a ranged attack — Rock Throw at +12 to hit for 4d10+7 means it can threaten from 60 ft. Earth Glide lets it phase through solid rock walls, Earthquake Stomp collapses structures and knocks everyone prone, and Seismic Shockwave creates a sustained restrain zone. STR 24 makes it the strongest pure-strength golem."
  },
  {
    "id": "fen-siren",
    "name": "Fen Siren",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 36,
      "dr": 2,
      "speed": "30 ft / swim 40",
      "type": "Aberration (Swamp Predator)",
      "environment": "Deep bogs, sunken ruins, fog-choked marshes",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 9,
      "con": 7,
      "wis": 12,
      "int": 8,
      "cha": 12
    },
    "armorClass5e": 11,
    "abilityScoresSolryn": {
      "str": 4,
      "nim": 7,
      "end": 5,
      "wis": 9,
      "int": 6,
      "arc": 8,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Drowning Grasp",
        "diceExpr": "1d8",
        "damageType": "Slashing",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "Target must succeed Endurance save (DC 13) or begin drowning (can't speak or cast verbal spells for 1 round; if underwater, begins suffocating). Melee 5 ft."
      }
    ],
    "abilities": [
      "Song of the Mire (1/rest) (Special (60 ft radius)): Creatures who can hear must make Wisdom save (DC 15) or walk toward her for 2 rounds, ignoring danger and difficult terrain.",
      "Gleaming Eyes (2/day) (Special (30 ft, Bonus)): One creature must make Arcana save (DC 14) or be Confused for 1 round.",
      "Swamp Veil (Passive): While submerged, nearly invisible. DC 16 Insight check to notice her before she acts.",
      "Venomous Kisses: A grappled or charmed target kissed by the Fen Siren suffers 1d6 Poison damage per round."
    ],
    "lore": "The Fen Siren is a twisted mockery of beauty, with sallow skin, webbed limbs, and hair like floating kelp. Her voice drips with enchantment, luring wanderers into the mire where she feeds. Her eyes gleam with malevolent cunning, and her mouth, when opened fully, reveals rows of needle-like teeth. Often found near partially submerged ruins or drowned villages."
  },
  {
    "id": "fenstalker-wyrm",
    "name": "Fenstalker Wyrm",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 74,
      "dr": 4,
      "speed": "Swim 40 / burrow 20",
      "type": "Beast (Swamp Serpent)",
      "environment": "Deep bogs, marsh trenches, misted sinkholes",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 20,
      "dex": 16,
      "con": 18,
      "wis": 14,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 16,
      "nim": 12,
      "end": 14,
      "wis": 10,
      "int": 2,
      "arc": 1,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Ambush Strike",
        "diceExpr": "2d8+5",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "If attacking from Stealth or partial cover, target is Restrained until end of next round. Endurance save (DC 14) to escape early. Melee 10 ft."
      },
      {
        "name": "Suffocating Coil (Grapple)",
        "diceExpr": "2d6",
        "damageType": "Bludgeoning",
        "note": "Grappled target begins suffocating if submerged in water or mud."
      }
    ],
    "abilities": [
      "Bog Drag (1/rest) (Special (Movement)): Pulls a restrained target 30 ft through mud or shallow water. Target must make Strength save (DC 15) or become Prone and Blinded by muck.",
      "Mire Camouflage (Passive): While submerged in swamp water or mud, gains advantage on Stealth and cannot be detected by non-magical scent or tremorsense.",
      "Stillwater Ambush (Passive): When motionless for 1 full turn, may launch a Surprise Attack with +2 to damage and auto-crit on unaware targets."
    ],
    "lore": "Believed to be a distant cousin of sea serpents, adapted to inland bogs over centuries. Some druidic cults revere them as wardens of the deep fen. A long, eel-like serpent with moss-covered scales and ridged bone crests down its spine. Its mouth opens sideways, revealing rows of curved, retractable teeth."
  },
  {
    "id": "fire-ant-colossus",
    "name": "Fire Ant Colossus",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 100,
      "dr": 6,
      "speed": "40 ft / climb 20",
      "type": "Beast (Huge Insectoid Titan)",
      "environment": "Volcanic plains, fire ant colonies, scorched ruins",
      "tr": 6,
      "tier": "Deadly",
      "xp": 400
    },
    "abilityScores5e": {
      "str": 24,
      "dex": 12,
      "con": 18,
      "wis": 12,
      "int": 5,
      "cha": 8
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 20,
      "nim": 8,
      "end": 15,
      "wis": 8,
      "int": 3,
      "arc": 6,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Mandible Crush (10 ft)",
        "diceExpr": "4d10+7",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Medium or smaller targets are Grappled (DC 18) and Restrained — can't use Mandible Crush on another target while grappling. Reach 10 ft."
      },
      {
        "name": "Fire Breath (Rech 5-6)",
        "diceExpr": "10d6",
        "damageType": "Fire (30 ft cone)",
        "note": "Nimbleness save (DC 18) or take full damage, half on success."
      }
    ],
    "abilities": [
      "Summon Swarm (Rech 5-6) (Special): Summons a fire ant swarm within 30 ft that acts as an ally, obeys commands, acts on own initiative. Remains until destroyed or dismissed as bonus action.",
      "Fire Aura (10 ft, Passive): At start of each turn, all creatures within 10 ft take 3d6 Fire damage. Flammable objects ignite. Melee attackers within 10 ft also take 3d6 Fire damage on hit."
    ],
    "lore": "A titan among insects — a Huge fire ant with a burning exoskeleton that scorches anything nearby and commands swarms of smaller ants to overwhelm its foes. The Fire Aura punishes melee attackers while the Fire Breath clears out clusters. Its grapple on a restrained target, held inside the 10 ft aura, deals 3d6 fire every turn automatically while the Mandibles continue crushing."
  },
  {
    "id": "fire-golem",
    "name": "Fire Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 120,
      "dr": 5,
      "speed": "30 ft",
      "type": "Construct (Blazing Guardian)",
      "environment": "Volcanic forges, fire temples, magma-lit vaults",
      "tr": 7,
      "tier": "Deadly",
      "xp": 600
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 12,
      "con": 21,
      "wis": 11,
      "int": 5,
      "cha": 5
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 8,
      "end": 17,
      "wis": 7,
      "int": 3,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "3d8+6",
        "damageType": "Bludg. + Fire (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 2d6 Bludg. + Fire (Magical)) Multiattack: two Slam attacks. Melee 5 ft."
      },
      {
        "name": "Flame Burst (Rech 5-6)",
        "diceExpr": "10d8",
        "damageType": "Fire (15 ft radius)",
        "note": "Nimbleness save (DC 17) or take full damage, half on success. Flammable objects in the area ignite."
      }
    ],
    "abilities": [
      "Heated Body (Passive): Creatures that touch it or hit it with melee within 5 ft take 3d6 Fire damage.",
      "Cold Vulnerability & Magic Resistance: Vulnerable to Cold — the mirror weakness to the Ice Golem's fire vulnerability. Immune to fire, nonmagical weapons, poison, and psychic. Magic Resistance on spell saves."
    ],
    "lore": "A golem of living flame and slag-iron, the Fire Golem punishes melee attackers with 3d6 fire damage just for touching it. Its Heated Body and fire-damage Slams make it uniquely dangerous in close quarters, while Flame Burst can ignite the entire environment. Cold magic is the one reliable counter."
  },
  {
    "id": "firebog-wisp",
    "name": "Firebog Wisp",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 18,
      "dr": 2,
      "speed": "Fly 40 ft (hover)",
      "type": "Spirit (Elemental Undead)",
      "environment": "Cold marshes, dead rivers, frost-slick swamps",
      "tr": 1,
      "tier": "Easy (Tough as Swarm)",
      "xp": 10,
      "soulCore": "Glacial (Frostlight)",
      "coreRarity": "Common"
    },
    "abilityScores5e": {
      "str": 1,
      "dex": 22,
      "con": 6,
      "wis": 18,
      "int": 12,
      "cha": 16
    },
    "armorClass5e": 18,
    "abilityScoresSolryn": {
      "str": 1,
      "nim": 17,
      "end": 5,
      "wis": 14,
      "int": 9,
      "arc": 12,
      "lck": 11
    },
    "attacks": [
      {
        "name": "Chilling Touch",
        "diceExpr": "1d6",
        "damageType": "Cold",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "Target must succeed Endurance save (DC 13) or be Slowed for 1 round due to numbed limbs. Melee 5 ft."
      },
      {
        "name": "Frost Pulse (Swarm, Rech 5-6)",
        "diceExpr": "2d4",
        "damageType": "Cold (AoE)",
        "note": "Creatures must succeed Endurance save (DC 15) or begin freezing (lose 5 ft movement and 1d4 cold per turn). Swarm: HP 40, can extinguish mundane light within 10 ft."
      }
    ],
    "abilities": [
      "Lureflare (1/rest) (Special (15 ft cone)): All creatures must succeed Wisdom save (DC 14) or be drawn 10 ft closer and gain Disadvantage on Perception for 1 turn.",
      "Dim Heat (Passive, 10 ft): Generates misleading warmth in a 10 ft radius, giving a false sense of safety. Creatures within have disadvantage on Insight checks unless the Wisp attacks.",
      "Corpse Lure (Environmental): Often found above corpses or submerged graves. Investigating the body without care may trigger the Wisp's wrath."
    ],
    "lore": "Said to form from the dying breaths of those who froze to death alone. Their warmth is not theirs — it's stolen from the living. Children in swamp villages are told to never follow 'stars that sing.' A floating, gently flickering orb of pale orange and blue light with faint wisps of mist trailing behind like wings."
  },
  {
    "id": "flesh-golem",
    "name": "Flesh Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 65,
      "dr": 3,
      "speed": "30 ft",
      "type": "Construct (Stitched Revenant)",
      "environment": "Necromancer labs, grave-robbed crypts, forbidden workshops",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 19,
      "dex": 9,
      "con": 18,
      "wis": 10,
      "int": 6,
      "cha": 5
    },
    "armorClass5e": 12,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 5,
      "end": 15,
      "wis": 7,
      "int": 4,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam attacks. Magical. Melee 5 ft."
      }
    ],
    "abilities": [
      "Lightning Absorption (Passive): If it takes lightning damage, it regains HP equal to the damage dealt instead of taking damage.",
      "Berserk & Aversion to Fire: At 40 HP or fewer, roll 1d6 each turn — on a 6, goes berserk (attacks nearest creature/object). Fire damage gives it disadvantage on attacks and checks until end of next turn. Immutable Form and Magic Resistance as other golems."
    ],
    "lore": "Stitched together from stolen corpses and reanimated by dark lightning rites, the Flesh Golem is the most unpredictable of golems. Lightning heals it instead of harming it — the classic spell-counter becomes a tactical blunder. Fire makes it clumsy and erratic, and at low HP it may turn on its own master."
  },
  {
    "id": "frost-binder",
    "name": "Frost-Binder",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 34,
      "dr": 2,
      "speed": "30 ft / glide 20",
      "type": "Spirit (Winter Shade)",
      "environment": "Highlands during snowfall, icebound ruins, frozen paths",
      "tr": 2,
      "tier": "Easy",
      "xp": 40,
      "soulCore": "Glacial (Wintercore)",
      "coreRarity": "Uncommon"
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 14,
      "con": 18,
      "wis": 20,
      "int": 16,
      "cha": 19
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 6,
      "nim": 10,
      "end": 14,
      "wis": 16,
      "int": 12,
      "arc": 15,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Icy Grasp",
        "diceExpr": "1d8",
        "damageType": "Cold + Arcane",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "(also 1d4 Cold + Arcane) On a roll of 4 on the Arcane die, the target is Slowed for 1 round (-10 ft movement). Melee 5 ft."
      }
    ],
    "abilities": [
      "Snowblind Mirage (1/rest) (Special (Illusion)): A 15 ft area becomes covered in illusory warmth, light, or family — until touched. Any creature that enters must succeed a Wisdom save (DC 15) or become Charmed for 1 round and walk into the snowfield, losing their action.",
      "Frost Warden (Aura, 10 ft): All terrain within the aura counts as difficult unless the creature is immune to cold.",
      "Illusory Lure (Passive): In snowy areas, can manifest distant lights, voices, or silhouettes. Insight DC 14 reveals them as magical illusions. Used to lead travelers astray or isolate party members.",
      "Frozen Breath (1/rest): A breath of freezing wind in a 10 ft cone: 2d4 Cold damage. Creatures who fail an Endurance save (DC 13) are Chilled (-1 DR for 1 round)."
    ],
    "lore": "In old Solryn tales, it is said that the Frost-Binder comes not just to kill, but to be remembered. It traps souls in frozen dreamlands, locking them in illusions of what they lost. In particularly cruel cases, it waits until survivors find safety — only to freeze their hearts with guilt for leaving the others behind. A shrouded figure in snow-pale robes, its face hidden in frost — the closer one draws, the more it resembles someone the viewer once loved."
  },
  {
    "id": "frostbite-mantis",
    "name": "Frostbite Mantis",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 65,
      "dr": 3,
      "speed": "40 ft / climb 30",
      "type": "Beast (Cold-Adapted Ambush Predator)",
      "environment": "Arctic tundra, frozen forests, icy ruins, glacial caves",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 16,
      "con": 18,
      "wis": 12,
      "int": 3,
      "cha": 6
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 12,
      "end": 15,
      "wis": 8,
      "int": 1,
      "arc": 5,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Claws (Multiattack)",
        "diceExpr": "2d8+5",
        "damageType": "Slashing + Cold",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 3d6 Slashing + Cold) Multiattack: one Claws + one Bite. Frostbite: Endurance save (DC 15) or take 4d6 Cold and speed -10 ft until end of next turn. Melee 5 ft."
      },
      {
        "name": "Bite (Multiattack)",
        "diceExpr": "2d10+5",
        "damageType": "Piercing + Cold",
        "note": "(also 2d6 Piercing + Cold) Melee 5 ft."
      }
    ],
    "abilities": [
      "Icy Aura (10 ft, Passive): At start of each of its turns, all creatures within 10 ft take 1d10 Cold damage. Nonmagical liquids in the area freeze.",
      "Camouflage (Passive): Advantage on Stealth in snowy or icy terrain. When motionless, indistinguishable from surroundings. Resistant to Cold damage."
    ],
    "lore": "A cold-adapted mantis predator with claws that freeze flesh and an aura that ices the ground around it. The Icy Aura damages and freezes water every turn — puddles, potions, and rivers become obstacles. Combined with Frostbite slowing movement, the party will find themselves frozen in place while it tears them apart."
  },
  {
    "id": "gasher-toad",
    "name": "Gasher Toad",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 28,
      "dr": 1,
      "speed": "30 ft / swim 20",
      "type": "Beast (Mutated Amphibian)",
      "environment": "Swamps, mud flats, sinkholes",
      "tr": 2,
      "tier": "Easy",
      "xp": 40
    },
    "abilityScores5e": {
      "str": 8,
      "dex": 10,
      "con": 9,
      "wis": 6,
      "int": 1,
      "cha": 3
    },
    "armorClass5e": 11,
    "abilityScoresSolryn": {
      "str": 6,
      "nim": 8,
      "end": 7,
      "wis": 4,
      "int": 1,
      "arc": 0,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Tongue Lash (10 ft)",
        "diceExpr": "2d6",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Target must make Strength save (DC 13) or be pulled adjacent. Ranged melee 10 ft."
      },
      {
        "name": "Toad Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing + Acid",
        "note": "(also 1d4 Piercing + Acid) Melee 5 ft."
      },
      {
        "name": "Explosive Rupture (1/rest)",
        "diceExpr": "3d6",
        "damageType": "Acid (10 ft radius)",
        "note": "All creatures must make Endurance save (DC 14) or take full damage and become Sickened (disadvantage on physical rolls) for 1 round."
      }
    ],
    "abilities": [
      "Toxic Slime (Passive): Melee attackers who hit with unarmed or natural attacks take 1d4 Acid damage.",
      "Springburst (Bonus Action): Can leap up to 10 ft in any direction. If landing adjacent to a target, gains advantage on next melee attack that turn."
    ],
    "lore": "Grotesquely swollen and covered in bulbous sores, the Gasher Toad is a vile predator that uses sudden bursts of speed and explosive secretions to catch prey off-guard. Its mottled, wart-covered skin glistens with toxic slime, and its tongue can lash out with shocking range. When threatened, its back sacs rupture violently, spewing corrosive mist that burns flesh and poisons lungs."
  },
  {
    "id": "ghost",
    "name": "Ghost",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 45,
      "dr": 2,
      "speed": "0 ft / fly 40 (hover)",
      "type": "Undead (Restless Spirit)",
      "environment": "Haunted homes, graveyards, ruins with unfinished business",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 7,
      "dex": 13,
      "con": 10,
      "wis": 12,
      "int": 10,
      "cha": 17
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 4,
      "nim": 8,
      "end": 7,
      "wis": 8,
      "int": 7,
      "arc": 12,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Withering Touch (Multiattack)",
        "diceExpr": "4d6+3",
        "damageType": "Necrotic",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "Multiattack with Horrifying Visage. Melee 5 ft."
      }
    ],
    "abilities": [
      "Horrifying Visage (Multiattack) (Special (60 ft)): Non-undead creatures in 60 ft must make Wisdom save (DC 13) or be Frightened 1 min. Disadvantage on repeats if ghost in line of sight. Success = immune for 24 hours.",
      "Possession (Rech 6) (Special (5 ft)): Humanoid within 5 ft makes Charisma save (DC 13) or be possessed: ghost controls body, target aware but incapacitated. Ends at 0 HP, bonus action, or when turned.",
      "Mournful Task (Narrative): 50% chance on encounter the ghost is non-hostile, offering players a task tied to its unfinished business. Completion lays it to rest. Refusal or failure makes it hostile — all party rolls at Disadvantage until the task is resolved.",
      "Etherealness (Action): Can shift to the Ethereal Plane as an action. While there, invisible and cannot be attacked or affect the Material Plane."
    ],
    "lore": "Not all ghosts seek to harm — some seek resolution. The Mournful Task mechanic gives players a choice: help the ghost finish its business and lay it to rest, or fight a haunting that imposes Disadvantage on all rolls until resolved. Possession with the target remaining aware is one of the most unsettling abilities in the bestiary."
  },
  {
    "id": "giant-praying-mantis",
    "name": "Giant Praying Mantis",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 40,
      "dr": 2,
      "speed": "30 ft / climb 20",
      "type": "Beast (Ambush Predator)",
      "environment": "Jungles, dense forests, overgrown ruins",
      "tr": 2,
      "tier": "Easy",
      "xp": 40
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 16,
      "con": 15,
      "wis": 12,
      "int": 2,
      "cha": 6
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 12,
      "end": 10,
      "wis": 8,
      "int": 1,
      "arc": 2,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Scythe (x2, 10 ft)",
        "diceExpr": "2d8+4",
        "damageType": "(+) Slashing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also (+2d6) Slashing) Multiattack: two Scythe attacks. Medium or smaller targets are Grappled and Restrained (escape DC 15) — can't use Scythe on another target while grappling. Sneak Attack: +2d6 when it has advantage. Reach 10 ft."
      },
      {
        "name": "Mandibles",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "note": "Melee 5 ft."
      }
    ],
    "abilities": [
      "Ambusher & Camouflage: Advantage on attacks against surprised creatures. When motionless, indistinguishable from surrounding vegetation — advantage on Stealth. Keen Senses: advantage on Perception checks relying on sight."
    ],
    "lore": "A massive predatory insect with scythe-like forelimbs that can reach 10 ft and Restrain Medium or smaller prey on a hit. Its natural camouflage makes it nearly invisible in vegetation, and the Ambusher trait with Sneak Attack means a surprised target can eat 2d8+4+2d6 slashing before they even act — potentially over 20 damage on the first strike."
  },
  {
    "id": "giant-rock-crab",
    "name": "Giant Rock Crab",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 50,
      "dr": 4,
      "speed": "20 ft / climb 10",
      "type": "Beast (Coastal Crustacean)",
      "environment": "Rocky coastlines, sea caves, tidal ruins",
      "tr": 2,
      "tier": "Easy",
      "xp": 40
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 12,
      "con": 17,
      "wis": 10,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 8,
      "end": 12,
      "wis": 7,
      "int": 1,
      "arc": 1,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Claw (x2)",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Two claws, each can grapple one Large or smaller target (escape DC 14). Sneak Attack: +3d6 when it has advantage. Melee 5 ft."
      }
    ],
    "abilities": [
      "Perfect Camouflage (Passive): When motionless, indistinguishable from a boulder. Advantage on Stealth in rocky terrain. DC 17 Perception to detect — hardest of the three crabs.",
      "Boulder Form (Action): AC increases to 20 — highest in the crab family. Cannot move or act. Exit as bonus action. Amphibious."
    ],
    "lore": "The apex of the rock crab family — Large enough to grapple anything Medium or smaller in each claw simultaneously, DC 17 to even detect, and AC 20 in Boulder Form (matching the Iron Golem). A single Giant Rock Crab ambushing from among smaller crabs can grapple two party members at once while its Sneak Attack triggers from their advantage."
  },
  {
    "id": "glass-golem",
    "name": "Glass Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 75,
      "dr": 3,
      "speed": "30 ft",
      "type": "Construct (Crystalline Guardian)",
      "environment": "Alchemical towers, arcane observatories, crystal caves",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 14,
      "con": 16,
      "wis": 10,
      "int": 4,
      "cha": 1
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 10,
      "end": 13,
      "wis": 7,
      "int": 2,
      "arc": 4,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "2d10+4",
        "damageType": "Bludgeoning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam attacks. Melee 5 ft."
      },
      {
        "name": "Glass Shard Explosion (Rech 5-6)",
        "diceExpr": "8d6",
        "damageType": "Slashing (15 ft radius)",
        "note": "Nimbleness save (DC 14) or take full damage, half on success. Area becomes difficult terrain until end of golem's next turn."
      }
    ],
    "abilities": [
      "Reflective Surface (Passive): When targeted by a spell requiring a ranged attack roll, roll 1d6. On 4+, the spell is reflected back at the caster as if it originated from the golem.",
      "Thunder Vulnerability & Magic Resistance: Vulnerable to Thunder damage — the one reliable counter. Magic Resistance gives advantage on spell saves regardless. Immune to nonmagical weapons, poison, and psychic."
    ],
    "lore": "A shimmering construct of enchanted glass that turns a caster's own spells against them. The Reflective Surface trait makes ranged spell attacks a gamble — a 67% chance to redirect the spell back at the caster. The Glass Shard Explosion covers the battlefield in difficult terrain while dealing massive slashing damage. Thunder is its only clean weakness."
  },
  {
    "id": "glimmerfin",
    "name": "Glimmerfin",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 7,
      "dr": 1,
      "speed": "Swim 40 ft",
      "type": "Magical Beast (Illusory Fauna)",
      "environment": "Coastal shallows, reef pools, enchanted tidewaters",
      "tr": 1,
      "tier": "Easy (Tough as Swarm)",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 2,
      "dex": 17,
      "con": 6,
      "wis": 14,
      "int": 8,
      "cha": 12
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 2,
      "nim": 13,
      "end": 4,
      "wis": 10,
      "int": 6,
      "arc": 8,
      "lck": 11
    },
    "abilities": [
      "Shimmer Pulse (1/rest) (Special (10 ft aura)): All creatures in range make Wisdom save (DC 13) or be Dazzled (disadvantage on attacks) until end of next turn. Swarm (3+): DC 15, failed save = Stunned for 1 round.",
      "Lure Flash (Reaction) (Special (Redirect)): When targeted within 10 ft, flash of color forces attacker to make Arcana or Insight save (DC 12) or redirect attack at another target within range.",
      "Light-Bound Instincts (Passive): If exposed to magical light (Light spell, glowing weapon), Glimmerfins become docile for 1 minute. Can be scooped up with a DC 10 Survival check.",
      "Swarm Synergy (4+ fish): When 4+ Glimmerfins are in range of each other, Shimmer Pulse effects stack and may inflict Charmed for 1 minute on a failed DC 15 save. Swarm: HP 18, DR 2."
    ],
    "lore": "Some say Glimmerfins are reincarnated spirits of sailors who died happy at sea. Others believe they form wherever illusions and reality blur — guardians of something hidden. A small, vibrantly colored fish with translucent fins and a lantern-like organ along its sides. Its scales shimmer with shifting hues like oil on water, and at night its glow pulses in rhythmic flashes — sometimes forming recognizable patterns or symbols."
  },
  {
    "id": "graveblossom",
    "name": "Graveblossom",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 60,
      "dr": 4,
      "speed": "Stationary",
      "type": "Carnivorous Plant (Magical Flora)",
      "environment": "Grave mounds, sunken crypts, abandoned shrines in marsh",
      "tr": 4,
      "tier": "Tough",
      "xp": 160,
      "soulCore": "Blighted (Petalheart)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 3,
      "con": 18,
      "wis": 14,
      "int": 2,
      "cha": 10
    },
    "armorClass5e": 10,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 3,
      "end": 15,
      "wis": 11,
      "int": 2,
      "arc": 8,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Thorn Lash (15 ft reach)",
        "diceExpr": "2d6",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Target must succeed Endurance save (DC 14) or begin Bleeding (1d4 damage per round for 2 rounds)."
      },
      {
        "name": "Petal Embrace (Grapple)",
        "diceExpr": "1d6",
        "damageType": "/round Necrotic",
        "note": "If target is prone or incapacitated, vines pull them inside the blossom. They suffocate and take 1d6 Necrotic per round. DC 15 Strength to escape."
      }
    ],
    "abilities": [
      "Soporific Scent (Rech 5-6) (Special (20 ft radius)): All creatures must succeed Wisdom save (DC 15) or become Drowsy (disadvantage on saves, movement halved for 1 minute or until hit).",
      "Funeral Bloom (Passive): If a creature dies within 30 ft, the Graveblossom regains 2d6 HP and all of its abilities refresh immediately.",
      "Still as Stone (Passive): Until it attacks or moves, indistinguishable from mundane vegetation. DC 17 Nature or Insight to detect."
    ],
    "lore": "Graveblossoms were once cultivated by druids to mark the fallen. Over centuries, left untended, they began to hunger. Now, they seek to preserve death's silence by enforcing it. A large, deep crimson flower growing from dense moss-covered roots. Its petals shimmer with iridescent dew, and faint harmonic humming emanates from within."
  },
  {
    "id": "heartstealer-shade",
    "name": "Heartstealer Shade",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 30,
      "dr": 2,
      "speed": "30 ft / hover 20",
      "type": "Spirit (Deathbound Wraith)",
      "environment": "Highland graveyards, battlefield remnants, cursed ruins",
      "tr": 2,
      "tier": "Easy",
      "xp": 40,
      "soulCore": "Shadow",
      "coreRarity": "Uncommon"
    },
    "abilityScores5e": {
      "str": 5,
      "dex": 18,
      "con": 13,
      "wis": 18,
      "int": 14,
      "cha": 16
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 5,
      "nim": 14,
      "end": 10,
      "wis": 13,
      "int": 10,
      "arc": 12,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Shadow Claw",
        "diceExpr": "2d4",
        "damageType": "Necrotic + Arcane",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 1d4 Necrotic + Arcane) If target is below half HP, gain 1 temporary HP. If target is unconscious or dying, restore 2d4 HP instead. Melee 5 ft."
      }
    ],
    "abilities": [
      "Heart Echo (1/rest) (Special (Lethal)): Target: one dying or unconscious creature within 30 ft. Steals final heartbeat. If the creature fails a Wisdom save (DC 14) and has failed at least 1 death save, it dies instantly. Shade gains +5 temp HP and advantage on all actions for 1 round.",
      "Selective Hunger (Passive): Only attacks injured, unconscious, or dying targets unless directly threatened. Flees from uninjured groups unless cornered.",
      "Grave Silence (Passive): Cannot be detected by sound-based abilities. Makes no noise when moving or attacking. Immune to effects triggered by sound.",
      "Slip Through Shadow (2/rest): May vanish into dim light or shadow and reappear within 30 ft as a bonus action. Can pass through narrow gaps during this movement."
    ],
    "lore": "Some believe these creatures are echoes of those who feared death so deeply they clawed their way back from the beyond. Others claim they were once healers who failed to save their kin and now feed on death to feel in control. Their signature echo — a faint heartbeat — warns the perceptive, but never early enough. A skeletal figure wrapped in torn shadows, its face a shifting mask of sorrow, hunger, and silence."
  },
  {
    "id": "hollow-man",
    "name": "Hollow Man",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 22,
      "dr": 2,
      "speed": "25 ft",
      "type": "Construct (Forest-Cursed Effigy)",
      "environment": "Deep woods, abandoned farmland, blighted groves",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 13,
      "dex": 9,
      "con": 16,
      "wis": 9,
      "int": 5,
      "cha": 7
    },
    "armorClass5e": 11,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 6,
      "end": 12,
      "wis": 6,
      "int": 4,
      "arc": 5,
      "lck": 3
    },
    "attacks": [
      {
        "name": "Rake of Thorns",
        "diceExpr": "1d6+1",
        "damageType": "Slashing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Target must make a Strength save (DC 11) or be Restrained by entangling thorns until they succeed a check on their turn (DC 12, Strength or Nimbleness). Melee 5 ft."
      }
    ],
    "abilities": [
      "Silent Lurch (1/rest) (Special): Sinks into the earth and re-emerges behind a visible enemy within 15 ft (natural terrain only). Target must make a Wisdom save (DC 12) or be Startled (-1 to next roll). If Rake of Thorns is used immediately after, it deals +1d4 Slashing damage.",
      "Effigy Stillness: When motionless in natural terrain, the Hollow Man is indistinguishable from a tree or scarecrow. Requires a Wisdom (Perception) check DC 13 to detect.",
      "Curse-Twined Frame: Immune to mind-affecting effects (Charmed, Frightened, Sleep). Non-magical fire causes normal damage and does not bypass DR.",
      "Splinterburst (On Death): When destroyed, bursts into bark and thorns. All creatures within 5 ft must make an Endurance save (DC 12) or take 1d4 Piercing damage and begin Bleeding (lose 1 HP per round until healed or bandaged)."
    ],
    "lore": "Crafted from wood, vine, and bone, Hollow Men are forest guardians born from misused druidic rites or lingering curses. Locals tell of scarecrows that change position overnight and paths where trees seem to watch. These creatures have no will of their own — but something speaks through them."
  },
  {
    "id": "hollowkin",
    "name": "Hollowkin",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 28,
      "dr": 2,
      "speed": "30 ft / hover 20",
      "type": "Spirit (Mistbound Fey)",
      "environment": "Highland ridges, broken standing stones, misty ruins",
      "tr": 2,
      "tier": "Easy",
      "xp": 40,
      "soulCore": "Ethereal",
      "coreRarity": "Uncommon"
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 18,
      "con": 13,
      "wis": 18,
      "int": 16,
      "cha": 20
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 6,
      "nim": 14,
      "end": 10,
      "wis": 14,
      "int": 12,
      "arc": 16,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Miststrike",
        "diceExpr": "1d8",
        "damageType": "Psychic + Arcane",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "(also 1d4 Psychic + Arcane) Melee or ranged. If target has harmed a Hollowkin or desecrated a sacred site, they take +1d4 additional damage."
      }
    ],
    "abilities": [
      "Mirror Echo (1/rest) (Special (Psychic)): Target makes a Wisdom save (DC 14). On failure, they see a loved one accusing them of wrongdoing. Target is Shaken until end of next turn (-1 to all rolls, cannot willingly move closer to the Hollowkin).",
      "Misty Veil (Passive): Always counts as lightly obscured unless in direct sunlight. Gains +2 to Stealth in mist, rain, or fog.",
      "Fade Step (2/rest): Instantly teleports up to 30 ft to an unoccupied space it can see, leaving a swirl of mist behind.",
      "Test of the Soul (Narrative): If encountered outside combat, may present a test of wisdom, patience, or intent. Passing the test may grant a boon, guidance, or ancient knowledge."
    ],
    "lore": "Local myths call them 'the Watchers on the Ridge.' Some believe they are the remnants of a vanished people, bound to mist and memory. Children who answer a whisper in the fog sometimes return changed — or not at all. Hollowkin rarely kill, but they often test the soul. Vaguely humanoid figures formed of drifting mist, their bodies flicker with glints of ancient patterns, as though embroidered with starlight."
  },
  {
    "id": "hyena-gnoll-shaman",
    "name": "Hyena Gnoll Shaman",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 32,
      "dr": 2,
      "speed": "30 ft",
      "type": "Humanoid (Gnoll Caster)",
      "environment": "War camps, ritual circles, badland shrines",
      "tr": 2,
      "tier": "Easy",
      "xp": 40
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 12,
      "con": 14,
      "wis": 16,
      "int": 10,
      "cha": 10
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 9,
      "end": 10,
      "wis": 12,
      "int": 7,
      "arc": 6,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Quarterstaff (Multiattack)",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning",
        "ability5e": "wis",
        "abilitySolryn": "wis",
        "note": "Multiattack: one Quarterstaff + one Bite, or cast a spell. Melee 5 ft."
      },
      {
        "name": "Produce Flame (At-Will)",
        "diceExpr": "1d8",
        "damageType": "Fire (30 ft)",
        "note": "Ranged spell attack. Also has: Thorn Whip (melee, pull target 10 ft), Healing Word (bonus action heal)."
      }
    ],
    "abilities": [
      "Entangle (1/rest) (Spell (20 ft square)): Creatures must make Nimbleness save (DC 13) or be Restrained. Also has: Faerie Fire, Hold Person.",
      "Spirit Guardian (1/rest): Summons a spectral hyena spirit for 1 minute. Acts on the shaman's initiative with standard hyena stats. Disappears at 0 HP or if shaman is incapacitated.",
      "Pack Tactics (Passive): Gains advantage on attack rolls if an ally is within 5 ft of the target and not incapacitated."
    ],
    "lore": "The Gnoll Shaman channels primal druidic magic through savage rituals, entangling enemies in roots and thorns while summoning spectral hyena spirits to fight alongside the pack. It heals the wounded and holds enemies in place for the warriors to finish off."
  },
  {
    "id": "hyena-gnoll",
    "name": "Hyena Gnoll",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 40,
      "dr": 3,
      "speed": "30 ft",
      "type": "Humanoid (Gnoll)",
      "environment": "Savannas, badlands, raided settlements, war camps",
      "tr": 2,
      "tier": "Easy",
      "xp": 40
    },
    "abilityScores5e": {
      "str": 16,
      "dex": 14,
      "con": 14,
      "wis": 11,
      "int": 8,
      "cha": 9
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 13,
      "nim": 10,
      "end": 10,
      "wis": 7,
      "int": 5,
      "arc": 5,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Bite (Multiattack)",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: one Bite + one Spear per turn. Melee 5 ft."
      },
      {
        "name": "Spear (Multiattack)",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "note": "Melee 5 ft or ranged 20/60 ft."
      }
    ],
    "abilities": [
      "Abilities",
      "Pack Tactics (Passive): Gains advantage on attack rolls if an ally is within 5 ft of the target and not incapacitated.",
      "Rampage (Passive): When it reduces a creature to 0 HP with a melee attack, can move up to half its speed and make a bonus Bite attack.",
      "Hyena Companion (Optional): Often accompanied by a trained hyena that acts independently but follows commands. Uses standard hyena statistics."
    ],
    "lore": "Hyena Gnolls are savage, pack-hunting humanoids driven by bloodlust and hunger. They fight with fang and spear, surging forward in coordinated packs alongside their hyena companions. When one enemy falls, the Rampage begins — and the gnolls don't stop until everything is dead."
  },
  {
    "id": "hyena-gnoll-warlord",
    "name": "Hyena Gnoll Warlord",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 60,
      "dr": 4,
      "speed": "30 ft",
      "type": "Humanoid (Gnoll Barbarian)",
      "environment": "War camps, raided settlements, badland strongholds",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 14,
      "con": 18,
      "wis": 12,
      "int": 10,
      "cha": 10
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 10,
      "end": 15,
      "wis": 8,
      "int": 7,
      "arc": 6,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Greataxe (x2)",
        "diceExpr": "1d12+6",
        "damageType": "Slashing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Greataxe attacks. Includes +2 rage bonus. Melee 5 ft."
      }
    ],
    "abilities": [
      "War Cry (Rech 5-6) (Special (30 ft radius)): All gnoll allies within 30 ft gain advantage on attacks until end of next turn. Non-gnolls must make Wisdom save (DC 14) or be Frightened until end of next turn.",
      "Rage (1/rest): As a bonus action, enters rage for 1 minute. Gains advantage on Strength checks and saves, +2 to melee damage (included in Greataxe damage).",
      "Reckless Attack (Passive): At start of turn, can make all melee attacks with advantage — but attack rolls against it also have advantage until start of its next turn.",
      "Pack Tactics (Passive): Gains advantage on attack rolls if an ally is within 5 ft of the target and not incapacitated."
    ],
    "lore": "The Warlord leads through sheer brutality and bloodlust. Its rage fuels devastating greataxe strikes, and its War Cry rallies every gnoll within earshot while terrifying everyone else. Reckless Attack makes it a glass cannon — it hits harder but opens itself to counterattack."
  },
  {
    "id": "ice-golem",
    "name": "Ice Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 110,
      "dr": 5,
      "speed": "30 ft",
      "type": "Construct (Frozen Guardian)",
      "environment": "Arctic ruins, frost-sealed vaults, glacial caverns",
      "tr": 6,
      "tier": "Deadly",
      "xp": 400
    },
    "abilityScores5e": {
      "str": 20,
      "dex": 9,
      "con": 20,
      "wis": 10,
      "int": 3,
      "cha": 1
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 17,
      "nim": 5,
      "end": 17,
      "wis": 7,
      "int": 2,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "3d8+5",
        "damageType": "Bludg. + Cold (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 2d6 Bludg. + Cold (Magical)) Multiattack: two Slam attacks. Melee 5 ft."
      },
      {
        "name": "Frost Breath (Rech 5-6)",
        "diceExpr": "10d8",
        "damageType": "Cold (15 ft cone)",
        "note": "Endurance save (DC 18) or take full damage, half on success."
      }
    ],
    "abilities": [
      "Abilities",
      "Freezing Aura (10 ft): Creatures starting their turn within 10 ft take 2d6 Cold damage automatically.",
      "Fire Vulnerability & Magic Resistance: Vulnerable to Fire. Immune to Cold, nonmagical weapons, poison, and psychic. Magic Resistance gives advantage on spell saves."
    ],
    "lore": "A towering construct of enchanted ice that radiates killing cold. The Freezing Aura ticks 2d6 cold damage every round to anyone within 10 ft, making melee combat progressively more punishing. Its Frost Breath at 10d8 mirrors the Iron Golem's Poison Breath, and its Slams add cold damage on every hit. Fire is the one clear counter."
  },
  {
    "id": "iron-golem",
    "name": "Iron Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 140,
      "dr": 8,
      "speed": "30 ft",
      "type": "Construct (Arcane Guardian)",
      "environment": "Wizard towers, fortified vaults, ancient war foundries",
      "tr": 8,
      "tier": "Deadly",
      "xp": 800
    },
    "abilityScores5e": {
      "str": 24,
      "dex": 9,
      "con": 20,
      "wis": 11,
      "int": 3,
      "cha": 1
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 21,
      "nim": 5,
      "end": 17,
      "wis": 7,
      "int": 2,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "3d8+7",
        "damageType": "Bludgeoning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam attacks. Attacks count as magical. Melee 5 ft."
      },
      {
        "name": "Poison Breath (Rech 6)",
        "diceExpr": "10d8",
        "damageType": "Poison (15 ft cone)",
        "note": "Endurance save (DC 19) or take full damage, half on success. Targets immune to poison take no damage."
      }
    ],
    "abilities": [
      "Immutable Form & Magic Resistance: Immune to any effect that would alter its form. Advantage on saves against spells. AC 20 — highest natural armor in the bestiary. Immune to nonmagical weapons AND fire, poison, psychic damage."
    ],
    "lore": "The Iron Golem is the pinnacle of golem-craft — impervious to fire, poison, psychic attacks, and all nonmagical weapons, while resisting spells through Magic Resistance. AC 20 is the highest in the bestiary. Its Poison Breath at 10d8 can wipe an unprepared party in one use. Only force damage, radiant, or magical cold have any real purchase against it."
  },
  {
    "id": "kelp-widow",
    "name": "Kelp Widow",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 42,
      "dr": 2,
      "speed": "30 ft / swim 30",
      "type": "Fey-Spirit (Illusionist Lure)",
      "environment": "Rocky coastal inlets, fog-heavy beaches, sea caves",
      "tr": 3,
      "tier": "Tough",
      "xp": 90,
      "soulCore": "Corrosive (Tidewrought)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 14,
      "con": 11,
      "wis": 18,
      "int": 16,
      "cha": 18
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 6,
      "nim": 10,
      "end": 9,
      "wis": 13,
      "int": 12,
      "arc": 14,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Drowning Grasp",
        "diceExpr": "2d6",
        "damageType": "Bludgeoning",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "Target must make Endurance save (DC 14) or begin choking for 1 round, losing verbal actions and suffering -2 to all checks. Melee 5 ft."
      }
    ],
    "abilities": [
      "Tide Veil (1/rest) (Illusion (30 ft radius)): Mist and shifting shapes fill the area. Creatures must make Wisdom save (DC 15) or become Charmed for 1 round, following the Kelp Widow up to 15 ft. If already Charmed, they become Stunned instead.",
      "Drown the Lonely (Passive): Can sense creatures who are alone (no allies within 20 ft). Against these targets, Tide Veil DC increases by +2 and she gains advantage on Insight checks.",
      "Lure of the Fog (Recharge 4-6): Can cast a minor illusion (visual or auditory) up to 60 ft away to bait enemies out of position or into dangerous terrain."
    ],
    "lore": "Sailors say she was once a sea goddess's handmaiden, cursed for stealing the lives of mortals. Her presence is marked by tidepools filled with hair-like seaweed and smooth, unbroken stones — grave markers of her victims. A humanoid shape draped in kelp and veiled in wet sea-grass, she appears beautiful and tragic from afar — up close, her eyes are abyssal and bottomless, mouth full of brine and teeth."
  },
  {
    "id": "knockerkin",
    "name": "Knockerkin",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 18,
      "dr": 1,
      "speed": "25 ft (climb 20)",
      "type": "Fey (Subterranean Trickster)",
      "environment": "Abandoned mines, collapsed tunnels, cave networks",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 18,
      "con": 9,
      "wis": 12,
      "int": 14,
      "cha": 10
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 6,
      "nim": 14,
      "end": 6,
      "wis": 8,
      "int": 10,
      "arc": 8,
      "lck": 12
    },
    "attacks": [
      {
        "name": "Pick Jab",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "If the target wears metal armor, they must succeed a Strength save (DC 11) or suffer -1 to DR next round (the blow disorients or dents their defenses). Melee 5 ft."
      }
    ],
    "abilities": [
      "Echo Slam (1/rest) (Special): Smashes a rock or pipe, releasing a shockwave. All creatures in a 10 ft radius must make a Nimbleness save (DC 12) or be Knocked Down and deafened until the end of their next turn.",
      "Tunnel Slinker: Can move through tight spaces as small as 6 inches wide. Gains +2 to Stealth checks underground.",
      "False Echo: Can mimic sounds and voices perfectly. Once per encounter, can force a creature to make an Insight save (DC 12) or follow a false voice into danger (pit, ambush, trap).",
      "Greed Sense: Detects coins, gems, and valuable metals within 30 ft. Often refuses to negotiate until bribes are offered."
    ],
    "lore": "Called 'boogers' by surface folk and 'knockers' by miners, these creatures are blamed for collapsed tunnels and stolen tools — but also credited with warning of danger by knocking on stone. Truth is, the Knockerkin are ancient fey who once watched over deep places before mortals mined them hollow. They still want payment for passage... or revenge."
  },
  {
    "id": "lantern-elk",
    "name": "Lantern Elk",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 26,
      "dr": 1,
      "speed": "40 ft",
      "type": "Beast (Mystical Herbivore)",
      "environment": "Foggy meadows, forest clearings, leyline crossings",
      "tr": 0,
      "tier": "Non-Combat",
      "xp": 0
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 16,
      "con": 14,
      "wis": 16,
      "int": 6,
      "cha": 10
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 12,
      "end": 10,
      "wis": 12,
      "int": 6,
      "arc": 6,
      "lck": 14
    },
    "abilities": [
      "None (Non-Combatant): The Lantern Elk will not fight unless cornered; even then, it only pushes or runs. Serene and observant — wary but not fearful.",
      "Bioluminescent Antlers (Passive): Sheds soft light in a 20 ft radius. The glow changes hue based on ambient arcane energy or nearby magical sources, alerting perceptive creatures to unstable magic fields or lingering enchantments.",
      "Ley Sense (Passive): Drawn to arcane hot spots or leyline convergences. If tracked, it may lead a group to old ruins, unmarked altars, or forgotten spell-sites.",
      "Graceful Retreat (Reaction): When targeted by a hostile action, may move up to 20 ft away and impose disadvantage on attacks made against it that round due to its ethereal grace and flickering silhouette."
    ],
    "lore": "Many clans believe the Lantern Elk is a gift of the gods or a remnant of the old world's purity. It is said to appear before significant magical events, or to guide those who are 'in tune' with fate. Its antlers are illegal to sell in many Solryn regions without ritual approval. A sleek, tall elk with silver-gray fur and long, arching antlers — glowing filaments trail between them, producing soft light in shades of gold, green, or violet depending on the season."
  },
  {
    "id": "lantern-wraith",
    "name": "Lantern Wraith",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 18,
      "dr": 1,
      "speed": "20 ft (float)",
      "type": "Arcane Phenomenon (Spirit, Incorporeal)",
      "environment": "Misty forests, old roads, mountain hollows",
      "tr": 1,
      "tier": "Easy",
      "xp": 10,
      "soulCore": "Ethereal",
      "coreRarity": "Common"
    },
    "abilityScores5e": {
      "str": 4,
      "dex": 16,
      "con": 9,
      "wis": 13,
      "int": 10,
      "cha": 18
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 2,
      "nim": 12,
      "end": 6,
      "wis": 10,
      "int": 8,
      "arc": 14,
      "lck": 12
    },
    "attacks": [
      {
        "name": "Flickering Burn",
        "diceExpr": "1d6",
        "damageType": "Arcane",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "Ghostly flame lashes outward from the Wraith's glow. Target must succeed on an Endurance save (DC 11) or become Disoriented (-1 to all rolls for 1 round). Range 20 ft."
      }
    ],
    "abilities": [
      "Lurelight Pulse (1/rest) (Special): Emits a burst of ghostly light in a 15 ft radius. Creatures must succeed on a Wisdom save (DC 12) or become Lured (must use movement to approach the Wraith on their next turn).",
      "Misty Allure: Emits dim, eerie light in a 10 ft radius. Creatures beginning their turn in the light must make an Intelligence save (DC 10) or suffer -1 to their next roll due to magical interference.",
      "Ethereal Drift: Can pass through solid objects and non-magical barriers. Immune to terrain penalties and physical restraints.",
      "Soulflare (On Death): Upon death, the Wraith explodes in arcane energy. All creatures within 10 ft must make a Luck save (DC 11) or take 1d4 Arcane damage."
    ],
    "lore": "Born of forgotten deaths and lingering spells, Lantern Wraiths haunt misty trails, glowing with misplaced purpose. Their allure is accidental — but deadly. A flickering ball of pale green and cold blue light, it drifts through the mist like a dying flame inside an old lantern. No solid body is visible, but shadows warp and twist as it passes. Occasionally, a faint outline of a human face flickers within the glow — mouth agape, eyes wide with eternal confusion."
  },
  {
    "id": "lightning-golem",
    "name": "Lightning Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 115,
      "dr": 5,
      "speed": "30 ft",
      "type": "Construct (Storm Guardian)",
      "environment": "Arcane storm towers, lightning-scarred ruins, sky fortresses",
      "tr": 7,
      "tier": "Deadly",
      "xp": 600
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 12,
      "con": 20,
      "wis": 11,
      "int": 4,
      "cha": 1
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 8,
      "end": 17,
      "wis": 7,
      "int": 2,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "3d8+6",
        "damageType": "Bludg. + Lightning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 2d6 Bludg. + Lightning (Magical)) Multiattack: two Slam attacks. Melee 5 ft."
      },
      {
        "name": "Lightning Burst (Rech 5-6)",
        "diceExpr": "10d8",
        "damageType": "Lightning (20 ft radius)",
        "note": "Nimbleness save (DC 17) or take full damage, half on success. Larger AoE than Fire/Ice Burst (20 ft vs 15 ft)."
      }
    ],
    "abilities": [
      "Charged Body (Passive): Creatures that touch it or hit it with melee within 5 ft take 3d6 Lightning damage.",
      "Cold Vulnerability & Magic Resistance: Vulnerable to Cold. Immune to lightning, nonmagical weapons, poison, and psychic. Magic Resistance on spell saves. Note: Cold kills both Ice and Lightning golems — but Fire heals the Flesh Golem."
    ],
    "lore": "A crackling mass of animated metal and trapped storm energy. Its Charged Body punishes melee just like the Fire Golem's Heated Body, but its Lightning Burst has a larger 20 ft radius than Fire or Ice. Like the Flesh Golem, Cold is its weakness — a shared vulnerability that rewards parties who identify elemental patterns."
  },
  {
    "id": "magical-ooze",
    "name": "Magical Ooze",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 50,
      "dr": 2,
      "speed": "10 ft",
      "type": "Ooze (Arcane Slime)",
      "environment": "Dungeons, flooded cellars, arcane labs, cave pools",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 6,
      "con": 18,
      "wis": 6,
      "int": 1,
      "cha": 1
    },
    "armorClass5e": 10,
    "abilityScoresSolryn": {
      "str": 11,
      "nim": 4,
      "end": 15,
      "wis": 4,
      "int": 1,
      "arc": 5,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Pseudopod (10 ft reach)",
        "diceExpr": "2d8+4",
        "damageType": "Acid",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Melee 10 ft."
      },
      {
        "name": "Death Burst (On Death)",
        "diceExpr": "4d8",
        "damageType": "Acid (10 ft radius)",
        "note": "On reaching 0 HP, releases acid wave (Nimbleness save DC 15, half on success) AND splits into two full-HP oozes. Each clone persists 3 more rounds, can split again."
      }
    ],
    "abilities": [
      "Split (Passive): When reduced to 0 HP, splits into two identical oozes each with full HP. Each clone can split again under the same conditions.",
      "Acid Wave (Legendary, 1/round): Releases acid burst in 15 ft radius. Nimbleness save (DC 15) or take 2d8 acid damage, half on success. Amorphous: can move through spaces as narrow as 1 inch."
    ],
    "lore": "The Magical Ooze turns every attempt to destroy it into a new threat. Kill it and it splits into two fresh oozes while spraying acid across the battlefield. Kill those and they split again. Players must either find a way to destroy all fragments simultaneously or be overwhelmed by exponentially multiplying acid pools."
  },
  {
    "id": "magma-mantis",
    "name": "Magma Mantis",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 68,
      "dr": 3,
      "speed": "40 ft / climb 30",
      "type": "Elemental Beast (Volcanic Predator)",
      "environment": "Volcanic regions, lava fields, fire temples, magma caves",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 16,
      "con": 20,
      "wis": 12,
      "int": 4,
      "cha": 6
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 12,
      "end": 16,
      "wis": 8,
      "int": 2,
      "arc": 6,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Claws (x2, Multiattack)",
        "diceExpr": "2d8+5",
        "damageType": "Slashing + Fire",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 3d6 Slashing + Fire) Multiattack: two Claws + one Bite. Flammable objects hit by claws ignite. Melee 5 ft."
      },
      {
        "name": "Bite (Multiattack)",
        "diceExpr": "2d10+5",
        "damageType": "Piercing + Fire",
        "note": "(also 2d6 Piercing + Fire) Melee 5 ft."
      }
    ],
    "abilities": [
      "Abilities",
      "Lava Blood (Passive): When it takes melee damage, the attacker must make Nimbleness save (DC 15) or take 4d6 Fire damage from splashing lava-like blood.",
      "Heat Immunity & Tremorsense: Immune to fire damage. Resistant to fire. Tremorsense 30 ft. Ignites flammable objects hit by its claws."
    ],
    "lore": "A mantis adapted to volcanic regions, with lava-like blood that burns anyone who strikes it in melee. Three attacks per turn — two fire-damage Claws and a fire-damage Bite — while Lava Blood punishes physical attackers with 4d6 fire on a failed save. The direct opposite of the Frostbite Mantis: get close and burn."
  },
  {
    "id": "mireling",
    "name": "Mireling",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 24,
      "dr": 1,
      "speed": "30 ft / swim 20",
      "type": "Aberration (Swamp Trickster)",
      "environment": "Swamps, boggy forests, sunken glades",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 17,
      "con": 8,
      "wis": 14,
      "int": 10,
      "cha": 14
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 4,
      "nim": 13,
      "end": 7,
      "wis": 10,
      "int": 8,
      "arc": 11,
      "lck": 12
    },
    "attacks": [
      {
        "name": "Bogdart Spit (Ranged, 15 ft)",
        "diceExpr": "1d4",
        "damageType": "Acid",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "On hit, target must succeed Nimbleness save (DC 12) or be Slowed (half movement) for 1 round."
      },
      {
        "name": "Mireblade",
        "diceExpr": "1d6",
        "damageType": "Piercing",
        "note": "Deals +1 damage to targets who are prone or restrained. Melee 5 ft."
      }
    ],
    "abilities": [
      "Mimicry (Passive): Can perfectly mimic voices it's heard. Gains advantage on Deception to impersonate familiar sounds, especially cries for help.",
      "Lurelight (Action, 1/hour): Creates a glowing illusion of light or sound in a 30 ft radius. Creatures that fail Wisdom save (DC 13) follow it for 1 round unless threatened.",
      "Bogsense (Passive): Cannot be surprised in swampy terrain. Gains +2 to Stealth and Survival in swamps."
    ],
    "lore": "Mirelings are solitary by nature, but sometimes serve stronger swamp entities. Some believe they were once fae, twisted by the mire's hunger. A gaunt, amphibious humanoid with long limbs, bulging eyes, and oily gray-green skin. Its voice sounds uncannily human, and its neck pouch vibrates when it mimics, glowing faintly with internal bioluminescence."
  },
  {
    "id": "moonlight-medusa",
    "name": "Moonlight Medusa",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 72,
      "dr": 3,
      "speed": "Swim 60 / climb 20",
      "type": "Magical Beast (Bioluminescent Serpent)",
      "environment": "Moonlit coves, crystal sea grottos, deep reefs",
      "tr": 5,
      "tier": "Deadly",
      "xp": 250,
      "soulCore": "Celestial (Starflesh)",
      "coreRarity": "Very Rare"
    },
    "abilityScores5e": {
      "str": 16,
      "dex": 20,
      "con": 17,
      "wis": 20,
      "int": 14,
      "cha": 22
    },
    "armorClass5e": 18,
    "abilityScoresSolryn": {
      "str": 12,
      "nim": 16,
      "end": 13,
      "wis": 15,
      "int": 10,
      "arc": 17,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Lunar Fangs",
        "diceExpr": "2d6",
        "damageType": "Piercing + Radiant",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 1d6 Piercing + Radiant) If target is under a light-based effect or glowing, deal +1d6 additional damage. Melee 10 ft."
      },
      {
        "name": "Twilight Coil (Grapple)",
        "diceExpr": "2d4",
        "damageType": "Bludgeoning",
        "note": "Grapples creature and reduces their DR by -2 while held in shimmering scales."
      }
    ],
    "abilities": [
      "Bioluminescent Pulse (Rech 5-6) (Gaze (30 ft cone)): Wisdom save (DC 16) or Petrified (Stunned) for 1 round. Fail by 5+: Partially Petrified (cannot move, take double damage from magical attacks for 1 minute or until shaken).",
      "Moonlit Veil (Passive): In natural moonlight or magical glow, gains +2 DR and advantage on Arcana-based effects and saves.",
      "Warding Gaze (Passive): Immune to gaze-based magic or illusions. Reflects one failed illusion per combat back at the caster (DC 14 to resist)."
    ],
    "lore": "It is said sailors who see her are cursed with dreams of drowning in moonlight. A few claim that if you survive her gaze, you see your true self reflected. A sleek sea serpent with scale patterns like starlight against velvet, fronds of light-emitting tendrils surround her head, pulsing with bioluminescent rhythm. Her eyes shine like twin moons."
  },
  {
    "id": "mossback-hare",
    "name": "Mossback Hare",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 8,
      "dr": 0,
      "speed": "35 ft",
      "type": "Beast (Herbivore)",
      "environment": "Highland meadows, shaded forest edges",
      "tr": 0,
      "tier": "Non-Combat",
      "xp": 0
    },
    "abilityScores5e": {
      "str": 3,
      "dex": 18,
      "con": 9,
      "wis": 14,
      "int": 2,
      "cha": 5
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 2,
      "nim": 14,
      "end": 6,
      "wis": 10,
      "int": 2,
      "arc": 1,
      "lck": 12
    },
    "abilities": [
      "None (Non-Combatant): The Mossback Hare does not attack. It flees danger, hides in burrows, and may feign death if cornered. Can Dash as a reaction if not restrained.",
      "Burrow Dodge (Reaction): If threatened, the Mossback Hare may Dash up to 20 ft and enter light brush or shallow burrows. If it ends its turn in concealment, it gains +2 to Stealth checks until the start of its next turn.",
      "Lichen Blend (Passive): While motionless in mossy or forested terrain, creatures must make a Perception check (DC 13) to notice it."
    ],
    "lore": "Mossback Hares are considered gentle spirits of the land. Healers seek them out to harvest the lichen on their backs — believed to absorb fever. Folktales say seeing one during travel means the road ahead will be safe. A large rabbit with green-tinted fur, speckled like lichen, tufts of moss grow naturally along its spine. Its long ears blend with foliage, and it moves with careful, quiet hops when not startled."
  },
  {
    "id": "murkfiend-lamprey",
    "name": "Murkfiend Lamprey",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 18,
      "dr": 1,
      "speed": "5 ft / swim 20",
      "type": "Aberration (Parasitic Predator)",
      "environment": "Murky rivers, swamp pools, sunken caverns",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 4,
      "dex": 12,
      "con": 8,
      "wis": 10,
      "int": 2,
      "cha": 2
    },
    "armorClass5e": 12,
    "abilityScoresSolryn": {
      "str": 3,
      "nim": 9,
      "end": 6,
      "wis": 7,
      "int": 2,
      "arc": 0,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Tooth Ring Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing + Poison",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 1d4 Piercing + Poison) Target must make Endurance save (DC 12) or become Slowed for 1 round. Melee 5 ft."
      },
      {
        "name": "Latch On (Bonus Action)",
        "diceExpr": "1d4",
        "damageType": "/round Piercing (Attach)",
        "note": "After a successful bite, attaches to target. Deals 1d4 damage at start of target's turns. If attached 3+ rounds, causes Internal Bleeding (1d6 bleed/round until healed)."
      }
    ],
    "abilities": [
      "Swarm Tactics (Passive): Gains advantage on attack rolls if an ally is also latched to the same target.",
      "Evasive Flicker (Reaction): When targeted by a melee attack, may move 5 ft without provoking opportunity attacks.",
      "Darkwater Sense (Passive): Detects vibrations and movement within water up to 60 ft, even in magical darkness."
    ],
    "lore": "A serpentine, leech-like predator with slimy dark-green flesh and a mouth ringed with needle-like teeth. It burrows into hosts to feed from within, releasing a numbing toxin that paralyzes prey. They often swarm in flooded crypts or abandoned wells, waiting in the muck for movement."
  },
  {
    "id": "needlefin-barrager",
    "name": "Needlefin Barrager",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 38,
      "dr": 3,
      "speed": "Swim 60 ft",
      "type": "Swarm Predator (Aquatic Beast)",
      "environment": "Coastal reefs, shallow open waters, salt estuaries",
      "tr": 3,
      "tier": "Tough (Swarm)",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 18,
      "con": 14,
      "wis": 8,
      "int": 1,
      "cha": 3
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 4,
      "nim": 14,
      "end": 10,
      "wis": 6,
      "int": 1,
      "arc": 1,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Spine Barrage (Swarm AoE)",
        "diceExpr": "3d4",
        "damageType": "Piercing (10 ft radius)",
        "note": "Each creature in the area must make Endurance save (DC 14) or begin Bleeding (1d4 per turn for 2 turns)."
      },
      {
        "name": "Coordinated Strike (Swarm)",
        "diceExpr": "2d6",
        "damageType": "Piercing",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "Auto-crits if target is already bleeding or submerged."
      }
    ],
    "abilities": [
      "Blood Frenzy (Passive): If any creature within 20 ft is bleeding, the swarm gains +1 DR and advantage on damage dice.",
      "Churn & Blur (Swarm Passive): The swarm moves as one entity. Creatures targeting it roll at disadvantage unless using AoE attacks or spells. Solo: HP 9, DR 1, Flash Scatter (disengage without provoking reactions)."
    ],
    "lore": "Known to follow ships and large sea creatures. Fishermen drop chum into the water before swimming — either to draw them off or to finish them quickly. Sleek silver-blue fish roughly the length of a human forearm, covered in thin glimmering scales with long dorsal and lateral spines that stiffen when attacking. Swarms move with eerie synchronicity, like blades in a whirlpool."
  },
  {
    "id": "phase-spider",
    "name": "Phase Spider",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 42,
      "dr": 2,
      "speed": "40 ft / climb 40",
      "type": "Monstrosity (Phase-Shifting Arachnid)",
      "environment": "Ethereal border zones, ancient ruins, arcane caves",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 16,
      "con": 16,
      "wis": 12,
      "int": 6,
      "cha": 6
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 12,
      "end": 13,
      "wis": 8,
      "int": 4,
      "arc": 3,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Lightning Bite (Multiattack)",
        "diceExpr": "2d10+5",
        "damageType": "Lightning",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "Multiattack: one Bite + one Web. Melee 5 ft."
      }
    ],
    "abilities": [
      "Web (Rech 5-6, 30/60 ft) (Special (Ranged)): Target is Restrained. DC 14 Strength to escape. Web: AC 10, 5 HP, vulnerable to fire.",
      "Abilities",
      "Always Elusive (Passive): All attacks against the Phase Spider are made at disadvantage.",
      "Phase Step (At-Will, Bonus Action): Magically teleports up to 10 ft to an unoccupied space it can see. Can be used every turn. Understands Common and Elvish but cannot speak."
    ],
    "lore": "The Phase Spider flickers between the material and ethereal planes, making it nearly impossible to hit. Its bite crackles with lightning instead of venom, and it teleports freely around the battlefield. A shimmer in the air and a flash of fangs — then it's gone again."
  },
  {
    "id": "prismatic-hydra",
    "name": "Prismatic Hydra",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 150,
      "dr": 7,
      "speed": "40 ft / swim 30",
      "type": "Monstrosity (Legendary Multi-Elemental)",
      "environment": "Elemental convergences, ancient ruins, dragon lairs",
      "tr": 9,
      "tier": "Deadly",
      "xp": 800
    },
    "abilityScores5e": {
      "str": 24,
      "dex": 14,
      "con": 22,
      "wis": 12,
      "int": 6,
      "cha": 10
    },
    "armorClass5e": 19,
    "abilityScoresSolryn": {
      "str": 20,
      "nim": 10,
      "end": 19,
      "wis": 8,
      "int": 4,
      "arc": 6,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Bite (x5 heads, 10 ft)",
        "diceExpr": "2d10+7",
        "damageType": "Piercing + Elemental",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 2d6 Piercing + Elemental) Multiattack: one bite per head. Each head deals its elemental type (Fire/Lightning/Poison/Cold/Acid). Reach 10 ft."
      },
      {
        "name": "Elemental Barrage (Rech 5-6)",
        "diceExpr": "4d10",
        "damageType": "per head Multi-Element (15 ft cones)",
        "note": "Each head emits a 15 ft cone of its element. Nimbleness save (DC 16) or take full damage per cone, half on success. Legendary Action."
      }
    ],
    "abilities": [
      "Multiple Heads (5): Starts with 5 heads: Red (Fire/vuln Cold), Blue (Lightning/vuln Psychic), Green (Poison/vuln Radiant), White (Cold/vuln Fire), Black (Acid/vuln Thunder). 25+ damage from one source severs a head.",
      "Regenerative Monstrosity: Regains 20 HP per turn if it has at least one head. Regrows one severed head per turn unless severed by the head's weakness damage type.",
      "Legendary Actions (3/turn): Lash Out (1 bite attack), Elemental Barrage (if charged), or Regrow (costs 2 — regenerate one severed head unless destroyed by weakness)."
    ],
    "lore": "A gargantuan monstrosity with five heads, each attuned to a different element. Its prismatic scales shimmer with elemental energy, and its regenerative body makes it nearly impossible to kill without exploiting each head's specific weakness. Understands Draconic but cannot speak — only roars in five-part elemental harmony."
  },
  {
    "id": "pteranodon",
    "name": "Pteranodon",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 26,
      "dr": 1,
      "speed": "10 ft / fly 60",
      "type": "Beast (Prehistoric Flyer)",
      "environment": "Prehistoric valleys, coastal cliffs, druidic preserves",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 12,
      "dex": 15,
      "con": 12,
      "wis": 9,
      "int": 2,
      "cha": 5
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 8,
      "nim": 10,
      "end": 8,
      "wis": 6,
      "int": 1,
      "arc": 2,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Beak (Multiattack)",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "Multiattack: one Beak + one Talons. Melee 5 ft."
      },
      {
        "name": "Talons (Multiattack)",
        "diceExpr": "1d8+2",
        "damageType": "Slashing",
        "note": "Melee 5 ft."
      }
    ],
    "abilities": [
      "Abilities",
      "Keen Sight (Passive): Advantage on Perception checks that rely on sight. Fly 60 ft makes it difficult to engage in melee — ranged attacks or spells required to bring it down."
    ],
    "lore": "A large prehistoric flying reptile with a crested head and wingspan that blocks out the sun. Swoops to attack then climbs back out of reach. Its 60 ft fly speed makes it nearly impossible to pin down without ranged capability, and a flock of 4-6 Pteranodons attacking from above creates chaos."
  },
  {
    "id": "queen-acid-fly",
    "name": "Queen Acid Fly",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 120,
      "dr": 6,
      "speed": "30 ft / fly 50",
      "type": "Monstrosity (Hive Queen)",
      "environment": "Deep swamps, infested ruins, acid-scarred caverns",
      "tr": 7,
      "tier": "Deadly",
      "xp": 600
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 14,
      "con": 20,
      "wis": 12,
      "int": 5,
      "cha": 10
    },
    "armorClass5e": 18,
    "abilityScoresSolryn": {
      "str": 16,
      "nim": 10,
      "end": 18,
      "wis": 8,
      "int": 3,
      "arc": 6,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Ravenous Bite",
        "diceExpr": "3d8+4",
        "damageType": "Piercing + Acid",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 4d6 Piercing + Acid) Multiattack: can combine with Acid Spit. Melee 5 ft."
      },
      {
        "name": "Acid Spit (30 ft)",
        "diceExpr": "6d6",
        "damageType": "Acid",
        "note": "Target must make Nimbleness save (DC 16) or be covered in burning acid: 3d6 acid per turn until action used to remove."
      },
      {
        "name": "Egg Implantation (Rech 5-6)",
        "diceExpr": "6d8",
        "damageType": "Acid (Internal)",
        "note": "Helpless or restrained target within 5 ft. Endurance save (DC 16) or eggs hatch in 1 minute, releasing 2d4 Acid Flies from within the host."
      }
    ],
    "abilities": [
      "Hive Mother (Passive): At start of turn, 1d6 Acid Flies emerge from her abdomen. Can control up to 10 swarms. Swarm Command: up to 3 swarms within 30 ft can immediately attack or move.",
      "Acid Blood (Passive): When struck by melee, attacker must make Nimbleness save (DC 16) or take 4d6 Acid damage from corrosive splash.",
      "Corrosive Aura (10 ft): Non-magical metal or organic objects within 10 ft dissolve, taking 2d6 Acid damage per round."
    ],
    "lore": "A pulsating, grotesque horror — the Queen Acid Fly births swarms of her acidic brood, dissolving flesh and bone in an endless hunger. She spawns endless waves of Acid Flies, softening enemies while she lurks at the center of a corrosive battlefield. Adventurers who slay her may end an infestation, but not without cost — her death throes release a final burst of acid."
  },
  {
    "id": "reefmaw-leviathan",
    "name": "Reefmaw Leviathan",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 95,
      "dr": 5,
      "speed": "Swim 50 ft",
      "type": "Aquatic Beast (Apex Predator)",
      "environment": "Coral trenches, sunken cliffs, sea caves",
      "tr": 6,
      "tier": "Deadly",
      "xp": 400
    },
    "abilityScores5e": {
      "str": 24,
      "dex": 14,
      "con": 20,
      "wis": 10,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 19,
      "nim": 10,
      "end": 16,
      "wis": 9,
      "int": 2,
      "arc": 1,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Sudden Lunge (Surprise)",
        "diceExpr": "3d8+6",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "If attacking from hiding, target is Grappled (DC 16 to escape) and immediately pulled 10 ft underwater. Melee 10 ft."
      },
      {
        "name": "Thrash & Spiral (AoE)",
        "diceExpr": "2d6+6",
        "damageType": "Bludg. (10 ft radius)",
        "note": "All creatures in range must make Nimbleness save (DC 15) or be Disoriented (disadvantage on next turn)."
      }
    ],
    "abilities": [
      "Camouflaged in Coral (Passive): While motionless, indistinguishable from coral terrain. Perception check (DC 17) to detect it while submerged.",
      "Deep Drag (1/rest): Upon a successful grapple, swims 50 ft straight down with its target. Target takes 2d6 Pressure Damage per round and begins suffocating unless freed."
    ],
    "lore": "Sailors hang nets of bells over the sides of their ships to detect sudden water shifts. Reefmaws leave no remains — only a few air bubbles and broken coral where they struck. A massive, eel-like beast covered in layered reef plates and symbiotic growths, its mouth splits vertically to reveal jagged rows of translucent teeth. Bioluminescent orbs dangle from kelp tendrils on its back, luring curious swimmers near."
  },
  {
    "id": "ridgejay",
    "name": "Ridgejay",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 6,
      "dr": 0,
      "speed": "10 ft / 40 ft fly",
      "type": "Beast (Bird, Sentinel)",
      "environment": "Highland ridges, pine forests, rocky outcrops",
      "tr": 0,
      "tier": "Non-Combat",
      "xp": 0
    },
    "abilityScores5e": {
      "str": 3,
      "dex": 20,
      "con": 7,
      "wis": 14,
      "int": 8,
      "cha": 6
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 2,
      "nim": 16,
      "end": 4,
      "wis": 10,
      "int": 6,
      "arc": 1,
      "lck": 10
    },
    "abilities": [
      "None (Non-Combatant): The Ridgejay does not attack. It avoids danger, warns nearby creatures, and perches high to scout. Flees when approached but may follow travelers from tree to tree.",
      "Mimic Call (At-Will): Can perfectly imitate up to three distinct sounds it has heard (predator calls, human whistles, tool clinks). Insight DC 13 to recognize the sound is fake.",
      "Warning Cry (Passive): If the Ridgejay notices a predator or approaching creature, it emits a distinctive three-tone cry. All nearby allies or travelers gain advantage on Perception checks to detect the threat that round.",
      "Flash Flight (Reaction): When startled, may immediately fly 30 ft in any direction, leaving behind a distracting shimmer. Creatures making opportunity attacks against it roll with disadvantage."
    ],
    "lore": "The Ridgejay is considered both a scout and a trickster. Highlanders believe its calls can guide the lost — or mislead the greedy. If one circles a camp, it is said to mean either shelter is near or something watches from the dark. A sleek blue-and-silver bird with a feathered crest that flares when agitated, its tail feathers shimmer faintly under sunlight."
  },
  {
    "id": "rock-crab",
    "name": "Rock Crab",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 32,
      "dr": 3,
      "speed": "20 ft / climb 10",
      "type": "Beast (Coastal Crustacean)",
      "environment": "Rocky coastlines, sea caves, tidal pools, ruins",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 12,
      "con": 15,
      "wis": 10,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 8,
      "end": 10,
      "wis": 7,
      "int": 1,
      "arc": 1,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Claw (x2)",
        "diceExpr": "1d8+2",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Two claws, each can grapple one Medium or smaller target (escape DC 12). Sneak Attack: +2d6 damage when it has advantage. Melee 5 ft."
      }
    ],
    "abilities": [
      "Perfect Camouflage (Passive): When motionless, indistinguishable from a boulder. Advantage on Stealth in rocky terrain. DC 15 Perception to detect (harder than the Small Rock Crab's DC 13).",
      "Boulder Form (Action): Retracts into shell — AC increases to 18, cannot move or act. Can exit as bonus action. Amphibious: breathes air and water."
    ],
    "lore": "The larger version of the Small Rock Crab — harder to detect (DC 15), bigger grapple (Medium targets), double the Sneak Attack damage (2d6), and a tougher Boulder Form (AC 18). A shore littered with Rock Crabs and Small Rock Crabs creates a multi-wave encounter where the 'safe' boulders turn out to be the bigger threat."
  },
  {
    "id": "salt-withered",
    "name": "Salt-Withered",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 34,
      "dr": 3,
      "speed": "25 ft / swim 30",
      "type": "Undead (Mariner Revenant)",
      "environment": "Coastal ruins, shipwrecks, drowned fishing villages",
      "tr": 2,
      "tier": "Easy",
      "xp": 40,
      "soulCore": "Corrosive (Saltbound)",
      "coreRarity": "Uncommon"
    },
    "abilityScores5e": {
      "str": 16,
      "dex": 10,
      "con": 18,
      "wis": 8,
      "int": 4,
      "cha": 8
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 13,
      "nim": 8,
      "end": 14,
      "wis": 7,
      "int": 5,
      "arc": 6,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Salt-Rusted Blade",
        "diceExpr": "2d4+4",
        "damageType": "Slashing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "On hit, target must succeed Endurance save (DC 13) or contract Saltlock: -1 to all physical skill checks, cannot Dash. Stacks. Cure: Medicine DC 14 + 10 min treatment."
      },
      {
        "name": "Guttered Wail (1/rest)",
        "diceExpr": "2d4",
        "damageType": "Thunder (15 ft cone)",
        "note": "Targets must make a Wisdom save (DC 14) or become Deafened for 1 round."
      }
    ],
    "abilities": [
      "Salted Memory (Passive): When killed, mutters a cryptic fragment of its death — granting a clue or curse at the GM's discretion.",
      "Brine Aura (5 ft): Melee attackers must succeed a DC 12 Endurance check or have their weapon begin to rust, suffering -1 damage until repaired."
    ],
    "lore": "The Salt-Withered are born from sailors who died betrayed or unshriven at sea. Coastal communities leave iron nails and bread along shorelines to ward off their return. A gaunt figure draped in rotting naval garb, hair strung with seaweed and shells, skin cracked like dry coral. Salt encrusts its joints, and barnacles form armor along its arms and spine."
  },
  {
    "id": "sand-golem",
    "name": "Sand Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 125,
      "dr": 4,
      "speed": "30 ft / burrow 20",
      "type": "Construct (Desert Guardian)",
      "environment": "Desert ruins, buried temples, arid vaults",
      "tr": 7,
      "tier": "Deadly",
      "xp": 600
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 14,
      "con": 18,
      "wis": 10,
      "int": 6,
      "cha": 5
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 10,
      "end": 15,
      "wis": 7,
      "int": 4,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "3d8+6",
        "damageType": "Bludgeoning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam attacks. Melee 5 ft."
      },
      {
        "name": "Sandstorm Blast (Rech 5-6)",
        "diceExpr": "10d10",
        "damageType": "Bludg. (30 ft cone)",
        "note": "Nimbleness save (DC 18) or take full damage, half on success. Area = difficult terrain until end of golem's next turn. Largest damage roll in the golem family."
      }
    ],
    "abilities": [
      "Burial Surge (Action) (Special (10 ft radius, 10 ft range)): Area becomes quicksand. Strength save (DC 18) or Restrained as they sink. Action to attempt another Strength check to escape. Lasts until start of golem's next turn.",
      "Flowing Form (Passive): Can move through spaces as narrow as 1 inch. Can disperse into a sand cloud, gaining resistance to all damage except Force, Psychic, and Radiant until start of next turn.",
      "Sand Cloak (Passive): While burrowed in sand or loose earth, can Hide as a bonus action. Tremorsense 60 ft — detects all movement on the ground even when buried."
    ],
    "lore": "The Sand Golem strikes from below — burrowing under the battlefield while Tremorsense tracks every footstep, then erupting with a Sandstorm Blast (the highest single damage roll of any golem at 10d10) or Burial Surge to sink the party in quicksand. Flowing Form makes it nearly impossible to pin in place."
  },
  {
    "id": "sea-bright-wyrmling",
    "name": "Sea-Bright Wyrmling",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 30,
      "dr": 2,
      "speed": "35 ft / swim 40",
      "type": "Dragonkin (Elemental Beast)",
      "environment": "Coastal cliffs, tide caves, storm-wracked beaches",
      "tr": 2,
      "tier": "Easy",
      "xp": 40,
      "soulCore": "Storm (Stormspark)",
      "coreRarity": "Uncommon"
    },
    "abilityScores5e": {
      "str": 12,
      "dex": 18,
      "con": 14,
      "wis": 12,
      "int": 8,
      "cha": 14
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 9,
      "nim": 14,
      "end": 10,
      "wis": 8,
      "int": 7,
      "arc": 11,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Crackling Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing + Lightning",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 1d4 Piercing + Lightning) Target must succeed Endurance save (DC 13) or be shocked, losing 5 ft of movement next turn. Melee 5 ft."
      },
      {
        "name": "Flash Arc (1/rest)",
        "diceExpr": "2d4",
        "damageType": "Lightning (20 ft line)",
        "note": "All targets must make a Nimbleness save (DC 14) or be Stunned for 1 round."
      }
    ],
    "abilities": [
      "Glimmerhide (Passive): Attacks made in dim light or darkness are at Disadvantage unless the attacker succeeds Perception (DC 13) due to scale glare.",
      "Stormbound Leap (Recharge 4-6): May leap up to 20 ft and immediately make a Crackling Bite attack at no movement cost."
    ],
    "lore": "Believed to be born when lightning strikes tidepools during storms. Fisherfolk consider them omens — blessing or curse depending on whether they're seen at sea or on land. Sleek and serpent-like, with glistening scales that pulse between seafoam blue and stormsilver. A dorsal fin runs from crown to tail, glowing faintly in darkness. When agitated, sparks dance across its limbs and mouth."
  },
  {
    "id": "sea-glass-harvester",
    "name": "Sea-Glass Harvester",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 44,
      "dr": 2,
      "speed": "30 ft",
      "type": "Aberrant Collector (Mystic Undead)",
      "environment": "Ship graveyards, tide-swept ruins, sunken harbors",
      "tr": 3,
      "tier": "Tough",
      "xp": 90,
      "soulCore": "Ethereal (Shardbinder)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 10,
      "con": 13,
      "wis": 20,
      "int": 18,
      "cha": 18
    },
    "armorClass5e": 12,
    "abilityScoresSolryn": {
      "str": 6,
      "nim": 8,
      "end": 11,
      "wis": 15,
      "int": 13,
      "arc": 14,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Glassbone Lash",
        "diceExpr": "2d4",
        "damageType": "Piercing + Necrotic",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "(also 1d4 Piercing + Necrotic) On hit, target must succeed Endurance save (DC 14) or suffer -1 DR for 1 minute (shards cling and vibrate painfully). Melee 5 ft."
      },
      {
        "name": "Shardstorm (Recharge 5-6)",
        "diceExpr": "3d4",
        "damageType": "Slashing (15 ft cone)",
        "note": "Targets must succeed Nimbleness save (DC 15) or become Bleeding (1d4 damage at start of each turn for 2 rounds)."
      }
    ],
    "abilities": [
      "Whispers of the Deep (Passive, 10 ft): Enemies within 10 ft hear faint voices from the jars. Must make Wisdom save (DC 13) or suffer Disadvantage on their next attack or spell.",
      "Memory Jar (1/rest): Target must make Luck save (DC 14) or lose access to one known skill or spell for 1 round — it is 'stolen' and whispered into one of the Harvester's jars."
    ],
    "lore": "Some believe it was once a mortal who lost their crew to a sea curse. Others say it forms where too many souls lie unburied. It cannot cross running water, but it can follow voices through dreams. A robed, stooped figure with limbs too long and a face of smooth glass. Sea-glass shards flicker like stars across its garments, and jars full of bones and trinkets clink with every step."
  },
  {
    "id": "shadow-golem",
    "name": "Shadow Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 110,
      "dr": 5,
      "speed": "30 ft",
      "type": "Construct (Shadow Guardian)",
      "environment": "Dark vaults, shadowfell-touched ruins, necromancer lairs",
      "tr": 7,
      "tier": "Deadly",
      "xp": 600
    },
    "abilityScores5e": {
      "str": 20,
      "dex": 14,
      "con": 18,
      "wis": 10,
      "int": 6,
      "cha": 5
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 16,
      "nim": 10,
      "end": 15,
      "wis": 7,
      "int": 4,
      "arc": 5,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Shadowy Grasp (x2)",
        "diceExpr": "2d8+5",
        "damageType": "Necrotic",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam or Shadowy Grasp attacks. Grasp: target's speed -10 ft until start of golem's next turn; golem gains temp HP = half necrotic dealt. Melee 5 ft."
      },
      {
        "name": "Shadow Breath (Rech 5-6)",
        "diceExpr": "10d8",
        "damageType": "Necrotic (30 ft cone)",
        "note": "Endurance save (DC 17) or take full damage and be Blinded until end of next turn. Half on success. Largest cone in the golem family (30 ft)."
      }
    ],
    "abilities": [
      "Shadow Stealth & Gloom Veil: In dim light or darkness: can Hide as bonus action, and ranged attacks against it have disadvantage. Life Drain: regains temp HP = half necrotic dealt.",
      "Phantom Step (Rech 5-6, Reaction): When it takes damage, can teleport up to 30 ft to an unoccupied space in dim light or darkness. No opportunity attacks. Only effective in darkness — bright light shuts down most of its kit."
    ],
    "lore": "Unlike any other golem, the Shadow Golem rewards the darkness. It hides, heals from necrotic damage, evades ranged attacks, and teleports when struck — but only in dim light or darkness. A Light spell or Daylight neutralizes most of its advantages, making light sources tactically critical in this fight."
  },
  {
    "id": "shadow-specter",
    "name": "Shadow Specter",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 45,
      "dr": 3,
      "speed": "0 ft / fly 40 (hover)",
      "type": "Undead (Incorporeal Spirit)",
      "environment": "Dark dungeons, shadow-cursed ruins, moonless nights",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 1,
      "dex": 16,
      "con": 11,
      "wis": 12,
      "int": 10,
      "cha": 14
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 1,
      "nim": 12,
      "end": 7,
      "wis": 8,
      "int": 7,
      "arc": 10,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Life Drain",
        "diceExpr": "4d6+4",
        "damageType": "Necrotic",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "Endurance save (DC 13) or HP maximum reduced by damage taken until long rest. Dies if max HP reaches 0. Melee 5 ft."
      },
      {
        "name": "Shadow Bolt (60 ft)",
        "diceExpr": "3d6+4",
        "damageType": "Necrotic",
        "note": "Ranged spell attack."
      }
    ],
    "abilities": [
      "Possess Shadow (Action): Targets one creature within 30 ft. Charisma save (DC 15) or possessed for 1 hour: 2d6 Necrotic per turn. Ends with Remove Curse, Greater Restoration, or bright light exposure.",
      "Shadowy Form & Legendary: Advantage on Stealth and invisible to darkvision in dim light/darkness. Weakness: bright light deals 3d6 radiant per turn. Legendary (1/round): Shadow Step (30 ft, dim light only) or Life Drain (costs 2)."
    ],
    "lore": "The Shadow Specter haunts the spaces between light and dark, possessing its prey's own shadow to feed on their soul. The HP maximum reduction from Life Drain is potentially lethal over time — a party that doesn't rest will find their members dropping dead even without taking further damage."
  },
  {
    "id": "shield-spider",
    "name": "Shield Spider",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 50,
      "dr": 2,
      "speed": "30 ft / climb 30",
      "type": "Monstrosity (Armored Arachnid)",
      "environment": "Caves, underground nests, ruins, mine shafts",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 18,
      "con": 14,
      "wis": 12,
      "int": 6,
      "cha": 6
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 14,
      "end": 10,
      "wis": 8,
      "int": 4,
      "arc": 3,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Bite (Multiattack)",
        "diceExpr": "2d6+4",
        "damageType": "Piercing + Poison",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 2d6 Piercing + Poison) Multiattack: one Bite + one Web. Melee 5 ft."
      }
    ],
    "abilities": [
      "Web (Rech 5-6, 30/60 ft) (Special (Ranged)): Target is Restrained by webbing. DC 14 Strength check to escape. Web: AC 10, 10 HP, vulnerable to fire.",
      "Underground Ambusher (Passive): Has advantage on attack rolls against creatures that have not yet acted in combat when ambushing from its nest.",
      "Stealthy Retreat (Legendary, 1/round): At end of another creature's turn, moves up to its speed without provoking opportunity attacks and can attempt to Hide (Stealth +10). Spider Climb: can climb any surface including ceilings."
    ],
    "lore": "Protected by a boney carapace that deflects blows, the Shield Spider ambushes from underground nests and retreats into shadow after striking. Its hit-and-run tactics and legendary stealth make it a persistent threat that's hard to pin down — it strikes, webs its prey, then vanishes into the dark to strike again."
  },
  {
    "id": "skull-spider",
    "name": "Skull Spider",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 60,
      "dr": 3,
      "speed": "30 ft / climb 30",
      "type": "Undead (Necrotic Arachnid)",
      "environment": "Crypts, necromancer lairs, cursed ruins, bone pits",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 16,
      "dex": 14,
      "con": 14,
      "wis": 12,
      "int": 8,
      "cha": 10
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 13,
      "nim": 10,
      "end": 10,
      "wis": 8,
      "int": 5,
      "arc": 6,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Bite (Multiattack)",
        "diceExpr": "2d8+5",
        "damageType": "Piercing + Necrotic",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 2d8 Piercing + Necrotic) Multiattack: one Bite + one Web. Melee 5 ft."
      }
    ],
    "abilities": [
      "Web (Rech 5-6, 30/60 ft) (Special (Ranged)): Target is Restrained. DC 15 Strength to escape. Web: AC 10, 10 HP, vulnerable to fire.",
      "Abilities",
      "Deathly Stealth (Passive): Advantage on Stealth checks in dark or dim light. Undead Nature: does not require air, food, drink, or sleep. Spider Climb: can climb any surface including ceilings.",
      "Shadow Step (Legendary, 1/round): At end of another creature's turn, magically teleports up to 30 ft to an unoccupied space in dim light or darkness."
    ],
    "lore": "An undead arachnid with a skull-like carapace, the Skull Spider haunts crypts and bone pits. It needs no sustenance — only prey. Its necrotic bite drains life force, and its ability to Shadow Step through darkness makes it a relentless pursuer that appears and vanishes like a nightmare."
  },
  {
    "id": "skyrend-maw",
    "name": "Skyrend Maw",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 32,
      "dr": 2,
      "speed": "40 ft / fly 60",
      "type": "Spirit (Aerial Horror)",
      "environment": "Clifftops, battlefield sites, cursed skies",
      "tr": 2,
      "tier": "Easy",
      "xp": 40,
      "soulCore": "Echo (Screamcore)",
      "coreRarity": "Uncommon"
    },
    "abilityScores5e": {
      "str": 10,
      "dex": 20,
      "con": 13,
      "wis": 16,
      "int": 12,
      "cha": 18
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 8,
      "nim": 16,
      "end": 10,
      "wis": 12,
      "int": 9,
      "arc": 14,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Rending Bite",
        "diceExpr": "1d10",
        "damageType": "Piercing + Arcane",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also 1d4 Piercing + Arcane) If the target has taken damage this round, add +1d4 Psychic as it feeds on fear. Melee 5 ft."
      },
      {
        "name": "Shattering Howl (1/rest)",
        "diceExpr": "2d4",
        "damageType": "Thunder (15 ft cone)",
        "note": "All creatures in cone take 2d4 Thunder damage. Failed Endurance save (DC 14) = Deafened for 1 round. Unsecured items are scattered; fires, torches, and magic lights flicker or extinguish."
      }
    ],
    "abilities": [
      "Blood-Seeker Instinct (Passive): Immediately knows the direction of any creature currently below half HP within 60 ft.",
      "Hover of Dread (Aura, 10 ft): While flying, all creatures within 10 ft suffer -1 to attack damage rolls unless they succeed on an Insight check (DC 13) each round.",
      "Evasive Flutter (Reaction, 2/enc): When hit by a melee attack, may move 10 ft without provoking a reaction."
    ],
    "lore": "The Skyrend Maw is said to be the soul of a slain oathbreaker or murderer whose final rage echoed into the storm. In some traditions, its approach is a divine warning to end conflict — or be consumed by it. Children raised near clifftop settlements are warned: 'Don't scream at the wind, or it'll scream back.' A grotesque, severed head the size of a wolf, trailing smoky tendrils, its mouth stretches unnaturally wide and a faint storm swirls in its wake."
  },
  {
    "id": "sloughclot",
    "name": "Sloughclot",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 88,
      "dr": 5,
      "speed": "20 ft / climb 10",
      "type": "Ooze (Corpse-Amalgamate)",
      "environment": "Marsh pits, sunken graveyards, drowned battlefields",
      "tr": 5,
      "tier": "Deadly",
      "xp": 250
    },
    "abilityScores5e": {
      "str": 20,
      "dex": 4,
      "con": 22,
      "wis": 14,
      "int": 6,
      "cha": 10
    },
    "armorClass5e": 12,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 4,
      "end": 17,
      "wis": 10,
      "int": 6,
      "arc": 8,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Digesting Slam",
        "diceExpr": "2d8",
        "damageType": "Bludg. + Acid",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 1d6 Bludg. + Acid) Target must succeed Endurance save (DC 15) or begin Melting (1d4 acid damage per round for 2 rounds). Melee 5 ft."
      },
      {
        "name": "Pseudopod Lurch (10 ft)",
        "diceExpr": "1d10",
        "damageType": "Piercing",
        "note": "Target must succeed Nimbleness save (DC 14) or be Pulled prone into an adjacent square."
      }
    ],
    "abilities": [
      "Corpse Echo (Rech 5-6) (Special (20 ft radius)): Mimics a dead loved one's voice. Creatures must make Wisdom save (DC 15) or be Charmed for 1 round. Fail by 5+: Paralyzed instead.",
      "Corpse Memory (Passive): Carries memories of its victims. Once per combat, gains advantage on any check against a creature it has already damaged this combat.",
      "Rot Pulse (At Half HP): Emits a wave of necrotic bile. All creatures within 10 ft take 1d6 Necrotic damage and must succeed Wisdom save (DC 14) or gain the Sickened condition."
    ],
    "lore": "Swampkeepers claim every Sloughclot is made from thirty or more corpses. Some say they can remember every death they've consumed — and they scream them in the dark. A dripping mass of dark red sludge and putrid yellow bile, filled with fragments of faces and skulls that briefly surface before being digested again."
  },
  {
    "id": "small-rock-crab",
    "name": "Small Rock Crab",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 18,
      "dr": 2,
      "speed": "20 ft / climb 10",
      "type": "Beast (Coastal Crustacean)",
      "environment": "Rocky coastlines, sea caves, tidal pools, ruins",
      "tr": 0,
      "tier": "Non-Combat",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 10,
      "dex": 12,
      "con": 13,
      "wis": 10,
      "int": 2,
      "cha": 4
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 7,
      "nim": 8,
      "end": 8,
      "wis": 7,
      "int": 1,
      "arc": 1,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Claw (x2)",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "Two claws, each can grapple one Small or smaller target (escape DC 10). Sneak Attack: +1d6 damage when it has advantage. Melee 5 ft."
      }
    ],
    "abilities": [
      "Perfect Camouflage (Passive): When motionless, indistinguishable from a boulder. Advantage on Stealth in rocky terrain. DC 13 Perception to detect.",
      "Boulder Form (Action): Retracts into shell — AC increases to 16, cannot move or act. Can exit as bonus action. Amphibious: breathes air and water."
    ],
    "lore": "A small crustacean with a mottled shell that blends seamlessly into rocky terrain. Its eyes sit on stalks, watching from cover while it waits for unsuspecting prey. The Boulder Form ability makes it nearly impervious when defensive — but it can't act while tucked in. A surprising low-level ambush encounter when a whole tide pool of 'boulders' suddenly awakens."
  },
  {
    "id": "soul-bound-lich",
    "name": "Soul-Bound Lich",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 100,
      "dr": 6,
      "speed": "30 ft",
      "type": "Undead (Legendary Lich)",
      "environment": "Hidden towers, cursed villages, planar nexus points",
      "tr": 8,
      "tier": "Deadly",
      "xp": 800
    },
    "abilityScores5e": {
      "str": 11,
      "dex": 16,
      "con": 16,
      "wis": 14,
      "int": 20,
      "cha": 18
    },
    "armorClass5e": 19,
    "abilityScoresSolryn": {
      "str": 7,
      "nim": 12,
      "end": 13,
      "wis": 11,
      "int": 17,
      "arc": 16,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Paralyzing Touch",
        "diceExpr": "3d6",
        "damageType": "Cold",
        "ability5e": "int",
        "abilitySolryn": "arc",
        "note": "Endurance save (DC 18) or Paralyzed for 1 minute (save ends each turn). Melee 5 ft."
      },
      {
        "name": "Soul Drain (Legendary, 2 actions)",
        "diceExpr": "8d8",
        "damageType": "Necrotic (30 ft)",
        "note": "Endurance save (DC 18) or take full damage; lich regains HP equal to damage dealt. Half on success, no HP regain."
      }
    ],
    "abilities": [
      "Power Word Kill (1/rest) (Instant Special (60 ft)): Kills one creature with 100 HP or fewer — no save. Also has: Disintegrate, Finger of Death, Circle of Death, Dominate Person, Cloudkill. Spell save DC 18.",
      "Legendary Actions (3/round): Cantrip (1), Frightening Gaze (1 — DC 18 WIS or Frightened), Disrupt Life (2 — 20 ft, 6d6 necrotic), Soul Drain (2), Soul Binding (3 — bind soul of creature at 0 HP, preventing resurrection until lich is destroyed).",
      "Rejuvenation & Soul Bound: Regains all HP in 1d10 days unless Remove Curse/Greater Restoration/Wish is cast on remains. Soul Bound: can bind soul to a child's body — child makes DC 18 Endurance save or is possessed by the lich."
    ],
    "lore": "The Soul-Bound Lich disguises itself as a kind elder traveler, slipping into villages to bind its soul to an innocent child — a horrifying escape plan that makes destroying it a moral nightmare. Soul Binding can prevent resurrection of fallen party members until the lich is permanently destroyed. Power Word Kill with no save makes every encounter potentially lethal."
  },
  {
    "id": "spectral-knight",
    "name": "Spectral Knight",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 72,
      "dr": 4,
      "speed": "30 ft (incorporeal)",
      "type": "Undead (Ethereal Warrior)",
      "environment": "Haunted keeps, cursed battlefields, ancient crypts",
      "tr": 5,
      "tier": "Tough",
      "xp": 250
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 14,
      "con": 16,
      "wis": 14,
      "int": 10,
      "cha": 16
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 10,
      "end": 13,
      "wis": 10,
      "int": 7,
      "arc": 12,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Ethereal Sword (x2)",
        "diceExpr": "2d8+5",
        "damageType": "Force + Necrotic",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 2d8 Force + Necrotic) Multiattack: two strikes. Melee 5 ft."
      }
    ],
    "abilities": [
      "Haunting Presence (Rech 5-6) (Special (30 ft radius)): Wisdom save (DC 15) or be Frightened for 1 minute (save ends each turn).",
      "Abilities",
      "Incorporeal Movement (Passive): Can move through creatures and objects as difficult terrain. Takes 1d10 force damage if it ends its turn inside an object.",
      "Legendary Actions (1/round): Spectral Step (teleport 30 ft to a visible unoccupied space) or Necrotic Slash (one Ethereal Sword attack)."
    ],
    "lore": "A fallen warrior bound to undeath by oath and sorrow, the Spectral Knight phases through walls and allies alike, striking with a blade of pure force. Its Haunting Presence scatters armies, and its legendary Spectral Step lets it appear anywhere on the battlefield to finish the weakened."
  },
  {
    "id": "spectral-sorcerer",
    "name": "Spectral Sorcerer",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 65,
      "dr": 3,
      "speed": "30 ft / fly 40 (hover)",
      "type": "Undead (Ethereal Caster)",
      "environment": "Haunted towers, cursed libraries, ancient battlefields",
      "tr": 5,
      "tier": "Deadly",
      "xp": 250
    },
    "abilityScores5e": {
      "str": 10,
      "dex": 16,
      "con": 16,
      "wis": 12,
      "int": 14,
      "cha": 18
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 7,
      "nim": 12,
      "end": 13,
      "wis": 8,
      "int": 10,
      "arc": 15,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Spectral Touch (x2)",
        "diceExpr": "3d6+4",
        "damageType": "Necrotic",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "Multiattack: two Spectral Touch attacks. Melee 5 ft."
      },
      {
        "name": "Necrotic Bolt (60 ft)",
        "diceExpr": "4d6+4",
        "damageType": "Necrotic",
        "note": "Ranged spell attack."
      },
      {
        "name": "Circle of Death (1/rest)",
        "diceExpr": "8d6",
        "damageType": "Necrotic (60 ft sphere)",
        "note": "Endurance save (DC 16) or take full damage, half on success. Also has: Dominate Person, Phantasmal Killer, Fear, Cloudkill, Greater Invisibility."
      }
    ],
    "abilities": [
      "Incorporeal Movement (Passive): Moves through creatures and objects as difficult terrain. Takes 1d10 force damage if it ends its turn inside an object.",
      "Legendary Actions (1/round): Ethereal Step (teleport 30 ft to a visible unoccupied space) or Casting Spell (costs 2 — cast one prepared spell). Spell save DC 16. Also has: Magic Missile, Mirror Image, Counterspell, Misty Step."
    ],
    "lore": "A master of arcane magic bound to undeath, the Spectral Sorcerer hovers above the battlefield, raining necrotic destruction while phasing through walls and counterspelling the party's magic. Circle of Death can wipe an entire room, and Dominate Person turns a party member against their allies."
  },
  {
    "id": "stone-golem",
    "name": "Stone Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 110,
      "dr": 6,
      "speed": "30 ft",
      "type": "Construct (Arcane Guardian)",
      "environment": "Wizard towers, ancient temples, sealed vaults",
      "tr": 6,
      "tier": "Deadly",
      "xp": 400
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 9,
      "con": 20,
      "wis": 11,
      "int": 3,
      "cha": 1
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 19,
      "nim": 5,
      "end": 17,
      "wis": 7,
      "int": 2,
      "arc": 4,
      "lck": 4
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "3d8+6",
        "damageType": "Bludgeoning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam attacks. Attacks count as magical. Melee 5 ft."
      }
    ],
    "abilities": [
      "Slow (Rech 5-6, 10 ft) (Special): Targets within 10 ft make Wisdom save (DC 17) or be Slowed for 1 min: no reactions, half speed, one attack or action per turn (not both). Save ends each turn.",
      "Immutable Form (Passive): Immune to any spell or effect that would alter its form. Magic Resistance: advantage on saves against spells and magical effects."
    ],
    "lore": "A massive animated statue of dense stone, built to guard and obey. It cannot be charmed, frightened, petrified, or altered by magic, and its Slow ability can cripple an entire party's action economy in one move. Immune to nonmagical weapons — only magical attacks or spells (which it resists) can harm it."
  },
  {
    "id": "storm-cried-child",
    "name": "Storm-Cried Child",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 38,
      "dr": 1,
      "speed": "0 ft / fly 40 (hover)",
      "type": "Undead Spirit (Banshee-type)",
      "environment": "Shipwreck coasts, abandoned lighthouses, drowned villages",
      "tr": 3,
      "tier": "Tough",
      "xp": 90,
      "soulCore": "Echo (Weeping Echo)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 3,
      "dex": 12,
      "con": 10,
      "wis": 18,
      "int": 14,
      "cha": 16
    },
    "armorClass5e": 12,
    "abilityScoresSolryn": {
      "str": 3,
      "nim": 9,
      "end": 8,
      "wis": 14,
      "int": 10,
      "arc": 12,
      "lck": 11
    },
    "attacks": [
      {
        "name": "Wail of the Lost (1/rest)",
        "diceExpr": "2d6",
        "damageType": "Psychic (30 ft radius)",
        "note": "All creatures must make Wisdom save (DC 15) or be Stunned for 1 round and take double damage."
      },
      {
        "name": "Cold Touch",
        "diceExpr": "1d6",
        "damageType": "Cold",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "Target's DR is reduced by 1 until end of its next turn (minimum 0). Melee 5 ft."
      }
    ],
    "abilities": [
      "Haunting Presence (Passive, 10 ft): Creatures that begin their turn within 10 ft must succeed a Luck save (DC 13) or suffer disadvantage on all attack rolls that turn due to overwhelming sorrow.",
      "Cry for Recognition (Recharge 4-6): Targets within 60 ft hear their own name whispered on the wind. Must succeed Insight save (DC 14) or move 10 ft toward the Storm-Cried Child uncontrollably."
    ],
    "lore": "Said to be souls of children lost at sea whose names were never spoken in prayer. Only by speaking their name at a shrine or bell can they be released. The spectral figure of a young child, hair matted with saltwater, face blurred and translucent. Pale-blue light leaks from its eyes and mouth during its mournful cry."
  },
  {
    "id": "thornback-leechwolf",
    "name": "Thornback Leechwolf",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 62,
      "dr": 2,
      "speed": "40 ft",
      "type": "Aberrant Beast (Swamp Predator)",
      "environment": "Wetland dens, willow groves, parasite-ridden bog tunnels",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 17,
      "con": 16,
      "wis": 12,
      "int": 4,
      "cha": 5
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 13,
      "end": 12,
      "wis": 9,
      "int": 4,
      "arc": 2,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Spine Pounce (Leap 20 ft)",
        "diceExpr": "2d6",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Target must make Endurance save (DC 14) or be Numbed (disadvantage on physical actions for 1 round). Melee 5 ft."
      },
      {
        "name": "Drainbite",
        "diceExpr": "1d8",
        "damageType": "Piercing + Necrotic",
        "note": "(also 1d4 Piercing + Necrotic) Target loses 1 DR for 1 round as blood flow weakens (minimum 0)."
      },
      {
        "name": "Barbed Shake (1/rest)",
        "diceExpr": "1d4",
        "damageType": "Piercing (5 ft AoE)",
        "note": "All creatures within 5 ft must succeed Nimbleness save (DC 13) or be Slowed for 1 round."
      }
    ],
    "abilities": [
      "Pack Instincts (Passive): If within 10 ft of another Leechwolf, gains +1 DR and advantage on attack rolls.",
      "Silent Skulk (Passive): Gains +2 Stealth in swamp terrain. Cannot be detected by sound while moving unless within 5 ft.",
      "Bloodtrail Focus (Triggered): If a creature is bleeding, can track it unerringly for 1 hour, even across rivers or cliffs."
    ],
    "lore": "Believed to be the spawn of corrupted wolves that fed too long on carrion. When one bayed at the moon, it was answered by silence — and transformation. A wolf-sized creature with a slick, segmented body covered in ridged black fur and backward-facing thorns. Its face splits into four leech-like flaps, revealing a barbed tongue."
  },
  {
    "id": "thorned-spider",
    "name": "Thorned Spider",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 55,
      "dr": 3,
      "speed": "30 ft / climb 40",
      "type": "Beast (Arachnid Predator)",
      "environment": "Forests, caves, ruins, web-choked ravines",
      "tr": 3,
      "tier": "Tough",
      "xp": 90
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 16,
      "con": 17,
      "wis": 12,
      "int": 2,
      "cha": 6
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 12,
      "end": 14,
      "wis": 8,
      "int": 1,
      "arc": 3,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Bite (Multiattack)",
        "diceExpr": "2d8+5",
        "damageType": "Piercing + Poison",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "(also 3d6 Piercing + Poison) Multiattack: one Bite + one Web. Target must make Endurance save (DC 15) or be Poisoned for 1 minute (save ends each turn). Melee 5 ft."
      }
    ],
    "abilities": [
      "Web (Rech 5-6, 30/60 ft) (Special (Ranged)): Target is Restrained by webbing. DC 15 Strength check to escape. Web: AC 10, 10 HP, vulnerable to fire, immune to bludgeoning/poison/psychic.",
      "Thorned Body (Passive): Creatures that touch the spider or hit it with a melee attack within 5 ft take 1d10 Piercing damage.",
      "Web Walker (Passive): Moves across its own webs and other webs without being hindered by difficult terrain. Tremorsense 30 ft."
    ],
    "lore": "A large spider covered in sharp thorns, capable of delivering venomous bites and ensnaring prey with its webs. The thorned spider uses its thorny body as both defense and weapon, making it dangerous in close combat. Its ability to move effortlessly through webs allows it to ambush and trap unsuspecting creatures."
  },
  {
    "id": "tidewrought-serpent",
    "name": "Tidewrought Serpent",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 88,
      "dr": 4,
      "speed": "Swim 40 ft (High)",
      "type": "Elemental Beast (Tidebound Serpent)",
      "environment": "Coastal cliffs, tidal caves, open sea during storm surge",
      "tr": 5,
      "tier": "Tough / Deadly",
      "xp": 250,
      "soulCore": "Storm (Tidepulse)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 14,
      "con": 18,
      "wis": 16,
      "int": 6,
      "cha": 10
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 17,
      "nim": 10,
      "end": 15,
      "wis": 12,
      "int": 6,
      "arc": 8,
      "lck": 11
    },
    "attacks": [
      {
        "name": "Tidal Coil (High Tide)",
        "diceExpr": "3d6",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Grapples a Large or smaller target and crushes at the start of each of its turns (2d6 automatic). Melee 10 ft."
      },
      {
        "name": "Snapping Surge (Any Form)",
        "diceExpr": "2d6",
        "damageType": "Piercing",
        "note": "Target must make Endurance save (DC 14) or be pushed 10 ft and knocked prone."
      },
      {
        "name": "Salt Pulse (Low Tide, Rech 5-6)",
        "diceExpr": "2d4",
        "damageType": "Acid + Thunder (20 ft cone)",
        "note": "(also 1d4 Acid + Thunder (20 ft cone)) Creatures in area take -1 DR for 1 turn from burning saline spray."
      }
    ],
    "abilities": [
      "Flow-Bound Form (Passive): Shifts between Low Tide (Medium, HP 42, DR 2, Swim 50 ft) and High Tide (Huge, HP 88, DR 4, Swim 40 ft) every 2d4 rounds. Lunar or magical interference may lock the form.",
      "Tidecall Instinct (High Tide): If injured, can retreat into deep water and recover 2d6 HP if submerged for 1 full round without taking damage."
    ],
    "lore": "Local legends treat the Tidewrought as a guardian of sacred tide pools. Some coastal cults leave offerings to keep it docile during full moons. A serpentine sea creature with skin like rolling waves — iridescent blues and stormy grays ripple along its body. Coral-like ridges grow from its spine, and bioluminescent gills flare when agitated."
  },
  {
    "id": "t-rellin-commoner",
    "name": "T'rellin Commoner",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 10,
      "dr": 1,
      "speed": "30 ft (climb 30)",
      "type": "Humanoid (Insectoid)",
      "environment": "Giant oak canopy settlements",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 13,
      "dex": 16,
      "con": 11,
      "wis": 14,
      "int": 10,
      "cha": 8
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 10,
      "nim": 12,
      "end": 9,
      "wis": 10,
      "int": 8,
      "arc": 6,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Chitin Blade",
        "diceExpr": "1d4+3",
        "damageType": "Slashing",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "If two T'rellin commoners attack the same target in a round, the second gains +1 damage. Melee 5 ft."
      }
    ],
    "abilities": [
      "Canopy Dweller: Climb speed equal to walking speed. Can glide short distances using thin limb membranes. Nearly silent through trees.",
      "Communal Defense: Flees and alerts others if attacked. Only defends when cornered. Trained to prioritize colony survival over individual combat."
    ],
    "lore": "Commoners of the T'rellin tend the fungus gardens and keep the canopy paths clear. Their deep respect for nature and the Veil Above guides their quiet lives. They see outsiders as dangerous but fascinating. Slender, angular insectoids with pale green or bark-brown chitin, triangular heads, and compound eyes that shimmer faintly."
  },
  {
    "id": "t-rellin-priest-mother",
    "name": "T'rellin Priest-Mother",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 36,
      "dr": 2,
      "speed": "25 ft (climb 25)",
      "type": "Humanoid (Insectoid Matron)",
      "environment": "Crown-vault temples in ancient oaks",
      "tr": 2,
      "tier": "Easy",
      "xp": 40,
      "soulCore": "Ethereal (Mindcore)",
      "coreRarity": "Uncommon"
    },
    "abilityScores5e": {
      "str": 12,
      "dex": 14,
      "con": 18,
      "wis": 20,
      "int": 18,
      "cha": 20
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 11,
      "nim": 10,
      "end": 14,
      "wis": 15,
      "int": 14,
      "arc": 16,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Royal Antennae Pulse",
        "diceExpr": "1d6",
        "damageType": "Arcane (30 ft)",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "The next attack against the target ignores DR. Ranged 30 ft."
      },
      {
        "name": "Crushing Roots (1/rest)",
        "diceExpr": "2d4",
        "damageType": "Bludg. (15 ft cone)",
        "note": "Roots erupt dealing 2d4 Bludgeoning. Endurance save (DC 14) halves damage."
      }
    ],
    "abilities": [
      "Psychic Web (1/rest) (Spell (20 ft radius)): Creatures must make Intelligence save (DC 15) or become disoriented (-1 to all checks for 1 round).",
      "Spirit Call (1/rest): Summons a spectral insect guardian for 2 rounds. It makes 1d6 Arcane attacks that ignore DR.",
      "Illusory Heat (1/rest): Creates comforting light and warmth in a 10 ft radius. Creatures must make Wisdom save (DC 14) or be Charmed for 1 round.",
      "Hive Resonance: Cannot be deceived through normal means — uses communal memory to detect falsehoods. Every action is deliberate; even silence is a form of pressure."
    ],
    "lore": "The Priest-Mother is both monarch and spiritual guide. She knows every name within her colony and every dream her people whisper. Her power is subtle and layered, hidden behind ceremony and insect song. In battle, her words alone can fracture weaker minds. Larger and more ornate than other T'rellin, she wears bands of bark-gold and hanging mosses, her frilled antennae rising like a crown and chitin etched with glyphs that glow under moonlight."
  },
  {
    "id": "t-rellin-shaman",
    "name": "T'rellin Shaman",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 22,
      "dr": 1,
      "speed": "30 ft (climb 30)",
      "type": "Humanoid (Insectoid Caster)",
      "environment": "Canopy sanctuaries in high oak groves",
      "tr": 1,
      "tier": "Easy",
      "xp": 10,
      "soulCore": "Naturebound",
      "coreRarity": "Common"
    },
    "abilityScores5e": {
      "str": 10,
      "dex": 14,
      "con": 13,
      "wis": 18,
      "int": 16,
      "cha": 17
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 9,
      "nim": 10,
      "end": 11,
      "wis": 14,
      "int": 12,
      "arc": 13,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Staff of Lichen",
        "diceExpr": "1d6",
        "damageType": "Bludgeoning",
        "ability5e": "wis",
        "abilitySolryn": "wis",
        "note": "On hit, target's next saving throw is at -1 (fungal spores cling to skin). Melee 5 ft."
      }
    ],
    "abilities": [
      "Entangle (1/rest) (Spell (15 ft radius)): Targets make Nimbleness save (DC 14) or become Restrained for 1 round.",
      "Sporeblind (1/rest) (Spell (Targeted)): Wisdom save (DC 13) or suffer Disadvantage on next attack.",
      "Chitin Shield (1/rest)",
      "Canopy Seer: Interprets canopy omens and listens to the breath of the wind. Remains behind warriors, supporting with terrain manipulation and DR buffs."
    ],
    "lore": "T'rellin Shamans interpret canopy omens and listen to the breath of the wind. They believe the 'Veil Above' shelters them from skyfire and death. Outsiders who show respect may be offered riddles or strange prophecies. Draped in veils of moss and woven lichen, the shaman bears swirling patterns of spore-dust on its green chitin, its antennae constantly twitching as it listens to the canopy's voice."
  },
  {
    "id": "t-rellin-warrior",
    "name": "T'rellin Warrior",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 28,
      "dr": 3,
      "speed": "35 ft (climb 35)",
      "type": "Humanoid (Insectoid)",
      "environment": "Giant oak canopy strongholds",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 18,
      "dex": 16,
      "con": 17,
      "wis": 14,
      "int": 6,
      "cha": 6
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 14,
      "nim": 12,
      "end": 13,
      "wis": 10,
      "int": 6,
      "arc": 4,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Scythe Slash",
        "diceExpr": "2d4+4",
        "damageType": "Slashing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "If attacking from above or higher elevation, deal +1d4 damage. On max damage, target must succeed Endurance save (DC 13) or be knocked back 5 ft. Melee 5 ft."
      }
    ],
    "abilities": [
      "Resin Net (1/rest) (Special (15 ft range)): Target must succeed a Nimbleness save (DC 14) or become Entangled (movement reduced to 5 ft for 1 round).",
      "Canopy Ambusher: Climb speed equal to walking speed. Remains motionless among leaves and bark until striking (Stealth DC 16 to detect). Uses elevation, ambush, and retreat paths.",
      "Tactical Retreat: If overwhelmed, retreats to alert the colony. Watchful, suspicious of outsiders, but honorable in combat."
    ],
    "lore": "T'rellin warriors act as elite scouts and defenders of their treetop villages. While they avoid conflict with ground-walkers, they are capable of brutal efficiency if provoked or if their colony is threatened. Muscular despite their small size, with widened forelimbs ending in sharp, mantis-like blades. Their chitin is dark green or mottled gray for camouflage."
  },
  {
    "id": "triceratops",
    "name": "Triceratops",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 65,
      "dr": 4,
      "speed": "50 ft",
      "type": "Beast (Armored Herbivore)",
      "environment": "Prehistoric valleys, open plains, druidic preserves",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 9,
      "con": 17,
      "wis": 11,
      "int": 2,
      "cha": 5
    },
    "armorClass5e": 13,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 6,
      "end": 14,
      "wis": 7,
      "int": 1,
      "arc": 2,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "4d8+6",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Trampling Charge: if moved 20+ ft toward target and hits, Strength save (DC 13) or knocked Prone. Bonus Stomp vs prone target. Melee 5 ft."
      },
      {
        "name": "Stomp (vs Prone only)",
        "diceExpr": "3d10+6",
        "damageType": "Bludgeoning",
        "note": "Bonus action after Trampling Charge. Only vs prone targets."
      }
    ],
    "abilities": [
      "Trampling Charge (Passive): If it moves 20+ ft straight toward a target and hits with Gore, target makes Strength save (DC 13) or is knocked Prone. Can make a bonus Stomp attack against a prone target."
    ],
    "lore": "A heavily armored herbivore with three horns and a bone frill, the Triceratops is as dangerous as any predator when threatened. At 50 ft speed it closes fast, and a Trampling Charge into bonus Stomp can deal 7d8+3d10+12 in one turn — potentially over 60 damage to any creature knocked prone."
  },
  {
    "id": "tyrannosaurus-rex",
    "name": "Tyrannosaurus Rex",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 90,
      "dr": 4,
      "speed": "50 ft",
      "type": "Beast (Apex Predator)",
      "environment": "Prehistoric valleys, overgrown ruins, druidic preserves",
      "tr": 5,
      "tier": "Deadly",
      "xp": 250
    },
    "abilityScores5e": {
      "str": 25,
      "dex": 10,
      "con": 19,
      "wis": 12,
      "int": 2,
      "cha": 9
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 21,
      "nim": 7,
      "end": 16,
      "wis": 8,
      "int": 1,
      "arc": 3,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Bite (Multiattack, 10 ft)",
        "diceExpr": "4d12+7",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: one Bite + one Tail (not same target). Medium or smaller targets are Grappled (DC 17) and Restrained — T-Rex can't bite another while grappling."
      },
      {
        "name": "Tail (Multiattack, 10 ft)",
        "diceExpr": "3d8+7",
        "damageType": "Bludgeoning",
        "note": "Must target a different creature than the Bite. Reach 10 ft."
      }
    ],
    "abilities": [
      "Apex Predator: STR 25, 50 ft speed — the fastest Large+ creature in the bestiary. Passive Perception 17 makes ambushing it nearly impossible. A grappled Medium or smaller target is fully Restrained until escape (DC 17 Strength)."
    ],
    "lore": "The apex of the prehistoric food chain. 50 ft speed means it closes on almost anything in a single move. Its Bite averages 35 piercing damage and locks a Medium or smaller target in its jaws — Restrained and unable to escape without a DC 17 Strength check — while its Tail swats a second target simultaneously."
  },
  {
    "id": "velociraptor",
    "name": "Velociraptor",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 13,
      "dr": 1,
      "speed": "40 ft",
      "type": "Beast (Pack Predator)",
      "environment": "Prehistoric valleys, jungle ruins, druidic preserves",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 16,
      "con": 12,
      "wis": 12,
      "int": 4,
      "cha": 6
    },
    "armorClass5e": 14,
    "abilityScoresSolryn": {
      "str": 4,
      "nim": 12,
      "end": 8,
      "wis": 8,
      "int": 2,
      "arc": 2,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Bite (Multiattack)",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "Multiattack: one Bite + one Claws. Pounce: if moved 20+ ft toward target and hits with Claws, Strength save (DC 12) or knocked Prone; bonus Bite vs prone. Melee 5 ft."
      },
      {
        "name": "Claws (Multiattack)",
        "diceExpr": "1d8+2",
        "damageType": "Slashing",
        "note": "Melee 5 ft."
      }
    ],
    "abilities": [
      "Pack Tactics (Passive): Gains advantage on attack rolls if an ally is within 5 ft of the target and not incapacitated."
    ],
    "lore": "A small, feathered pack predator that hunts with terrifying coordination. Individually fragile, a pack of 6-8 raptors with Pack Tactics advantage and Pounce knockdown chains can overwhelm creatures far larger than themselves. 40 ft speed makes them nearly impossible to outrun."
  },
  {
    "id": "venomous-swarm",
    "name": "Venomous Swarm",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 36,
      "dr": 2,
      "speed": "10 ft / fly 40",
      "type": "Swarm of Tiny Beasts (Insects)",
      "environment": "Forests, caves, ruins, swamps, anywhere warm",
      "tr": 1,
      "tier": "Easy",
      "xp": 10
    },
    "abilityScores5e": {
      "str": 3,
      "dex": 18,
      "con": 10,
      "wis": 10,
      "int": 1,
      "cha": 3
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 2,
      "nim": 14,
      "end": 7,
      "wis": 7,
      "int": 1,
      "arc": 1,
      "lck": 6
    },
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "4d6",
        "damageType": "( below half HP) Piercing",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also (2d6 below half HP) Piercing) Targets in the swarm's space. Sneak Attack: +2d6 Poison if it has advantage or target is unaware. Reach 0 ft (occupies same space as target)."
      }
    ],
    "abilities": [
      "Venomous Sting (Passive): Creatures starting their turn in the swarm's space must make Endurance save (DC 13) or take 2d6 Poison, half on success.",
      "Swarm (Passive): Can occupy another creature's space and move through any opening large enough for a Tiny insect. Cannot regain HP or gain temp HP."
    ],
    "lore": "A cloud of tiny venomous insects — wasps, hornets, or stinging beetles — that overwhelm prey with countless stings. The swarm occupies the same space as its target, making escape difficult without AoE. Venomous Sting ticks poison every turn for free, making prolonged exposure increasingly dangerous."
  },
  {
    "id": "vulturis-bone-shaman",
    "name": "Vulturis Bone Shaman",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 75,
      "dr": 3,
      "speed": "30 ft (glide)",
      "type": "Monstrosity (Carrion Caster)",
      "environment": "Battlefields, wastelands, bone-strewn ruins",
      "tr": 5,
      "tier": "Deadly",
      "xp": 250
    },
    "abilityScores5e": {
      "str": 12,
      "dex": 16,
      "con": 18,
      "wis": 18,
      "int": 14,
      "cha": 14
    },
    "armorClass5e": 16,
    "abilityScoresSolryn": {
      "str": 9,
      "nim": 12,
      "end": 15,
      "wis": 14,
      "int": 10,
      "arc": 10,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Bone Staff (Multiattack)",
        "diceExpr": "2d6+4",
        "damageType": "Bludg. + Necrotic",
        "ability5e": "wis",
        "abilitySolryn": "wis",
        "note": "(also 1d10 Bludg. + Necrotic) Multiattack with Rotting Beak. Melee 5 ft."
      },
      {
        "name": "Rotting Beak (Multiattack)",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "note": "Target must make Endurance save (DC 15) or become Poisoned for 1 minute (save ends each turn)."
      },
      {
        "name": "Blackened Feather Swarm (Rech 5-6)",
        "diceExpr": "6d6",
        "damageType": "Necrotic (15 ft radius)",
        "note": "All creatures take 6d6 Necrotic and must make Strength save (DC 15) or be knocked Prone."
      }
    ],
    "abilities": [
      "Bone Rites (3 fetishes/rest): Expend a bone fetish for: Wail of the Forgotten (20 ft, DC 15 WIS or Frightened), Curse of Withering (30 ft, DC 15 END or disadvantage on STR/DEX), or Raise the Fallen (animate a skeletal vulturis from a corpse).",
      "Tainted Flesh (Passive): Melee attackers take 2d6 Necrotic damage from decayed energy stored within its flesh."
    ],
    "lore": "The Bone Shaman fights with cruelty and cunning, staying at the edge of battle, weakening foes before sending in its minions. It whispers to the bones it carries, speaking with the dead without components. Their bones whisper secrets; their magic twists the dying into something unnatural."
  },
  {
    "id": "vulturis-deathlord",
    "name": "Vulturis Deathlord",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 110,
      "dr": 5,
      "speed": "40 ft (glide)",
      "type": "Monstrosity (Apex Carrion Lord)",
      "environment": "Battlefields, carrion wastelands, bone-throne lairs",
      "tr": 7,
      "tier": "Deadly",
      "xp": 600
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 16,
      "con": 20,
      "wis": 16,
      "int": 14,
      "cha": 18
    },
    "armorClass5e": 18,
    "abilityScoresSolryn": {
      "str": 18,
      "nim": 12,
      "end": 17,
      "wis": 12,
      "int": 10,
      "arc": 14,
      "lck": 9
    },
    "attacks": [
      {
        "name": "Beak (Multiattack x3)",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: 1 Beak + 2 Talon Swipes. If target is below half HP, Strength save (DC 16) or be knocked Prone."
      },
      {
        "name": "Talon Swipe (x2, 10 ft)",
        "diceExpr": "2d8+6",
        "damageType": "Slashing",
        "note": "Reach 10 ft. Swooping Predator: if moved 20+ ft before attacking, gain advantage and +4d6 damage."
      },
      {
        "name": "Death Dive (Rech 5-6)",
        "diceExpr": "8d8",
        "damageType": "Bludg. (20 ft line)",
        "note": "If airborne, dives at high speed. Nimbleness save (DC 16) or take full damage and be knocked Prone."
      }
    ],
    "abilities": [
      "Aura of Dread (10 ft): Creatures starting their turn within 10 ft must make Wisdom save (DC 16) or be Frightened until end of next turn. Success = immune for 24 hours.",
      "Unholy Resilience (1/rest): First time it would drop to 0 HP, remains at 1 HP and gains 20 temporary HP instead.",
      "Rending Frenzy (Rech 5-6): Strikes all creatures within 10 ft. Nimbleness save (DC 16) or take 6d8 Slashing, half on success."
    ],
    "lore": "It does not hunt for food. It hunts for sport. The Deathlord is an apex predator that strikes hard and fast, seeking to overwhelm foes with sheer brutality. It swoops in, attacks, then glides away before enemies can counterattack. If the battle turns against it, it Death Dives and flees, waiting for another chance to hunt."
  },
  {
    "id": "vulturis",
    "name": "Vulturis",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 60,
      "dr": 3,
      "speed": "30 ft (glide)",
      "type": "Monstrosity (Carrion Stalker)",
      "environment": "Battlefields, wastelands, highland cliffs, ruins",
      "tr": 4,
      "tier": "Tough",
      "xp": 160
    },
    "abilityScores5e": {
      "str": 14,
      "dex": 18,
      "con": 16,
      "wis": 14,
      "int": 12,
      "cha": 10
    },
    "armorClass5e": 17,
    "abilityScoresSolryn": {
      "str": 12,
      "nim": 14,
      "end": 13,
      "wis": 10,
      "int": 8,
      "arc": 6,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Beak (Multiattack)",
        "diceExpr": "1d10+4",
        "damageType": "(+) Piercing (+ Necrotic)",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "(also (+1d6) Piercing (+ Necrotic)) Multiattack with Talons. +1d6 Necrotic if target is below half HP (Tear Flesh). Melee 5 ft."
      },
      {
        "name": "Talons (Multiattack)",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "note": "Target must succeed Strength save (DC 14) or be knocked Prone. Melee 5 ft."
      }
    ],
    "abilities": [
      "Mark the Dying (Rech 5-6) (Special (30 ft, 3 targets)): Up to 3 creatures make Wisdom save (DC 14) or be Frightened for 1 minute and glow faintly, allowing all Vulturis within 60 ft to track them through walls.",
      "Death Sense (Passive, 60 ft): Can sense creatures below 10 HP within 60 ft, even through walls. Knows they are weakened but not exact HP.",
      "Pack Tactics (Passive): Gains advantage on attack rolls if an ally is within 5 ft of the target. Feast Upon the Fallen: can consume a corpse to regain 10 HP and gain advantage on next attack.",
      "Carrion Ambusher (Passive): If motionless for 1 minute, gains advantage on Stealth. Glides silently — travels 10 ft forward for every 5 ft fallen, taking no fall damage."
    ],
    "lore": "Called 'Graveborne' or 'Shadow-Wings' by survivors. Many believe they commune with the dead, speaking with souls before feasting on remains. Some claim they have eldritch patrons whispering secrets of the afterlife. Regardless of origins, one thing is certain: if you see their red eyes gleaming in the darkness, it's already too late."
  },
  {
    "id": "weeping-cypress",
    "name": "Weeping Cypress",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 80,
      "dr": 5,
      "speed": "10 ft (root-crawl)",
      "type": "Plant (Sentient Swamp Guardian)",
      "environment": "Deep swamps, cursed bogs, old battlefields lost to marsh",
      "tr": 4,
      "tier": "Tough",
      "xp": 160,
      "soulCore": "Naturebound (Heartwood)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 22,
      "dex": 3,
      "con": 22,
      "wis": 18,
      "int": 4,
      "cha": 12
    },
    "armorClass5e": 11,
    "abilityScoresSolryn": {
      "str": 17,
      "nim": 3,
      "end": 18,
      "wis": 14,
      "int": 5,
      "arc": 10,
      "lck": 7
    },
    "attacks": [
      {
        "name": "Grieving Tendril (20 ft reach)",
        "diceExpr": "2d6",
        "damageType": "Bludgeoning",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "If target is Frightened or Charmed, they take an additional 1d6 Psychic damage."
      },
      {
        "name": "Lash of Roots (10 ft line)",
        "diceExpr": "2d4",
        "damageType": "Piercing",
        "note": "On hit, target is Restrained until end of next turn. Endurance save (DC 14) to end early."
      }
    ],
    "abilities": [
      "Sap Weep (Rech 5-6) (Special (15 ft radius)): Creatures must succeed Wisdom save (DC 15) or be Charmed and Weeping (incapacitated with sorrow) for 1 round.",
      "Echoes of Grief (Aura, 10 ft): Creatures within 10 ft must make Wisdom save (DC 13) each round or suffer disadvantage on attacks as voices whisper from within the bark.",
      "Stillness of Ages (Passive): If motionless for 1 minute, becomes indistinguishable from a non-magical tree. DC 18 Insight or Arcana to detect."
    ],
    "lore": "Said to grow only where a soul died in despair. Some believe their roots consume pain. Others say they are prisons for fallen dryads who disobeyed the gods. A towering, ancient cypress with bark twisted into faces mid-scream. Moss drapes from its branches like funeral veils, and from its central trunk, black sap leaks and forms faintly glowing pools."
  },
  {
    "id": "whippoorwail",
    "name": "Whippoorwail",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 ft fly / 10 ft hop",
      "type": "Magical Beast (Soul-Drinker, Spirit-Tethered)",
      "environment": "Forest edges, grave glades, hillsides near burial grounds",
      "tr": 1,
      "tier": "Easy",
      "xp": 10,
      "soulCore": "Ethereal",
      "coreRarity": "Common"
    },
    "abilityScores5e": {
      "str": 5,
      "dex": 18,
      "con": 9,
      "wis": 16,
      "int": 8,
      "cha": 14
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 4,
      "nim": 14,
      "end": 6,
      "wis": 12,
      "int": 6,
      "arc": 10,
      "lck": 8
    },
    "attacks": [
      {
        "name": "Soul Peck",
        "diceExpr": "1d4+2",
        "damageType": "Piercing + 1 Arcane",
        "ability5e": "dex",
        "abilitySolryn": "nim",
        "note": "If target is below half HP, they must succeed a Luck save (DC 12) or lose 1 additional HP and suffer -1 to Endurance saves for 1 round."
      }
    ],
    "abilities": [
      "Cry of the Dying (1/rest) (Special (60 ft audible)): All living creatures who can hear must make a Wisdom save (DC 13) or become Soul-Shaken (-1 to all checks and saves for 1 minute). Undead and constructs are immune.",
      "Death-Linked: If a creature within 30 ft drops to 0 HP, the Whippoorwail gains +1 DR for 1 round and may immediately fly up to 15 ft without provoking reactions.",
      "Fade Between (1/day): Becomes partially incorporeal until the start of its next turn. Ignores non-magical attacks and terrain.",
      "Omen Beast: If heard during a long rest, the party does not recover Luck Dice unless the bird is found and driven off."
    ],
    "lore": "Considered a death omen across Solryn, the Whippoorwail is said to sing for the dying and feed on the soul's heat. Some believe their presence calls the Reaper. Others say they are the Reaper's pet. Its weak, unstable soul core is destroyed if slain with radiant damage."
  },
  {
    "id": "willowwitch",
    "name": "Willowwitch",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 52,
      "dr": 2,
      "speed": "30 ft",
      "type": "Fey-Spirit (Swampbound Entity)",
      "environment": "Swamps, cursed willow groves, fog-shrouded riverbanks",
      "tr": 4,
      "tier": "Tough",
      "xp": 160,
      "soulCore": "Blighted (Griefroot)",
      "coreRarity": "Rare"
    },
    "abilityScores5e": {
      "str": 6,
      "dex": 16,
      "con": 11,
      "wis": 20,
      "int": 18,
      "cha": 18
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 6,
      "nim": 12,
      "end": 9,
      "wis": 15,
      "int": 13,
      "arc": 14,
      "lck": 10
    },
    "attacks": [
      {
        "name": "Grasp of Mourning",
        "diceExpr": "2d4",
        "damageType": "Psychic + Necrotic",
        "ability5e": "cha",
        "abilitySolryn": "arc",
        "note": "(also 1d4 Psychic + Necrotic) Target must succeed Wisdom save (DC 15) or forget the last action they took (cannot repeat it next round). Melee 5 ft."
      }
    ],
    "abilities": [
      "Sorrow's Lullaby (Rech 5-6) (Special (15 ft radius)): All creatures must make Wisdom save (DC 15) or be Charmed and Slowed for 1 round. If already Charmed, they become Unconscious (save ends early if damaged).",
      "Memory Leech (1/rest) (Special (Ranged)): Drains memories from a single target. Intelligence save (DC 16) or forget one known spell, ability, or name for 1 hour.",
      "Sympathy Feed (Passive): Gains +1 DR against any creature that is Charmed or Unconscious nearby.",
      "Hidden in Grief (Passive): Cannot be detected by creatures currently under the Frightened, Charmed, or Sorrowed condition."
    ],
    "lore": "Willowwitches are believed to form when a dryad dies from heartbreak. They remember every name ever whispered beneath their trees — and resent those who forget the dead. A willowy, feminine figure with bark-textured skin and moss for hair, her limbs ending in twisted roots. Glowing tears stream constantly down her wooden cheeks."
  },
  {
    "id": "wood-golem",
    "name": "Wood Golem",
    "category": "creature",
    "systems": [
      "dnd5e",
      "solryn"
    ],
    "stats": {
      "hp": 90,
      "dr": 4,
      "speed": "30 ft",
      "type": "Construct (Nature Warden)",
      "environment": "Druidic groves, enchanted forests, ancient nature shrines",
      "tr": 5,
      "tier": "Deadly",
      "xp": 250
    },
    "abilityScores5e": {
      "str": 19,
      "dex": 12,
      "con": 16,
      "wis": 10,
      "int": 6,
      "cha": 5
    },
    "armorClass5e": 15,
    "abilityScoresSolryn": {
      "str": 15,
      "nim": 8,
      "end": 13,
      "wis": 7,
      "int": 4,
      "arc": 4,
      "lck": 5
    },
    "attacks": [
      {
        "name": "Slam (x2)",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning (Magical)",
        "ability5e": "str",
        "abilitySolryn": "str",
        "note": "Multiattack: two Slam attacks. Melee 5 ft."
      }
    ],
    "abilities": [
      "Entangling Roots (Rech 5-6) (Special (20 ft radius)): Roots erupt in 20 ft radius. Area = difficult terrain for 1 min. Chosen creatures make Strength save (DC 15) or be Restrained. DC 15 Strength check (action) to escape.",
      "Fire Vulnerability & Magic Resistance: Vulnerable to Fire damage — the obvious counter. Magic Resistance gives advantage on spell saves. Resistant to nonmagical piercing and slashing. Immune to poison and psychic."
    ],
    "lore": "A towering guardian of living and carved wood, animated by druidic rites. Its Entangling Roots can lock down an entire party in a 20 ft radius, turning the battlefield into a killing ground for allied creatures. Fire is the obvious answer, but Magic Resistance means even fire spells require good rolls. Easy to counter in open terrain; devastating in a dense forest."
  }
];
