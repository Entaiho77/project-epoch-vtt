// AUTO-GENERATED — do not edit by hand.
// Produced by scripts/genBestiary.ts from data/bestiary-source.json (all creatures:
// the canonical starters + the SRD/Eribor conversions). Conversions carry
// provisional: true — their soul-core types and TR6+/Legendary bands are best-effort.
// Regenerate with: npm run gen:bestiary
import type { BestiaryEntry } from '@solryn/shared-types';

export const generatedBestiary: BestiaryEntry[] = [
  {
    "id": "mossback-hare",
    "name": "Mossback Hare",
    "category": "creature",
    "stats": {
      "hp": 8,
      "dr": 0,
      "speed": "35",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Non-combatant",
      "type": "Beast",
      "soulCore": "none",
      "native": "Highland meadows"
    },
    "abilities": [
      "Burrow Dodge",
      "Lichen Blend: Natural camouflage",
      "Harvestable: Sleeproot moss (healing ingredient)"
    ],
    "attacks": []
  },
  {
    "id": "duskwatcher-owlcat",
    "name": "Duskwatcher Owlcat",
    "category": "creature",
    "stats": {
      "hp": 22,
      "dr": 1,
      "speed": "30 / glide 40",
      "damage": "Claw/bite 1d6+3 slashing (Pounce adds +1d4)",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Predator",
      "soulCore": "none",
      "native": "Highland woods, Canopy trails"
    },
    "abilities": [
      "Silent Descent",
      "Twilight Tracker",
      "Hiss-Screech"
    ],
    "attacks": [
      {
        "name": "Claw/bite",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "note": "Pounce adds +1d4"
      }
    ]
  },
  {
    "id": "bramble-boar",
    "name": "Bramble Boar",
    "category": "creature",
    "stats": {
      "hp": 28,
      "dr": 2,
      "speed": "30",
      "damage": "Gore 1d6+4 piercing (Charge adds +1d4)",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Highland thickets, Brambles"
    },
    "abilities": [
      "Thornshake: Area of effect",
      "Brushbreaker",
      "Pain-Fueled Rage"
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "1d6+4",
        "damageType": "Piercing",
        "note": "Charge adds +1d4"
      }
    ]
  },
  {
    "id": "crag-hound",
    "name": "Crag Hound",
    "category": "creature",
    "stats": {
      "hp": 24,
      "dr": 2,
      "speed": "35",
      "damage": "Bite 1d6+3 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Shadow Beast",
      "soulCore": "Shadowbound (DC14)",
      "native": "Mountain passes, Cliff trails"
    },
    "abilities": [
      "Mountain Ghost",
      "Death-Stalker",
      "Shadowmeld"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+3",
        "damageType": "Piercing"
      }
    ]
  },
  {
    "id": "knockerkin",
    "name": "Knockerkin",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 1,
      "speed": "25 / climb 20",
      "damage": "Pick jab 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Fey",
      "soulCore": "none",
      "native": "Abandoned mines, Caves"
    },
    "abilities": [
      "False Echo",
      "Tunnel Slinker",
      "Greed Sense"
    ],
    "attacks": [
      {
        "name": "Pick jab",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ]
  },
  {
    "id": "lantern-wraith",
    "name": "Lantern Wraith",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 1,
      "speed": "20 float",
      "damage": "Lantern touch 1d6 arcane",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Spirit",
      "soulCore": "Arcane/Spirit (DC14)",
      "native": "Misty forests, Old roads"
    },
    "abilities": [
      "Lurelight Pulse",
      "Misty Allure",
      "Ethereal Drift"
    ],
    "attacks": [
      {
        "name": "Lantern touch",
        "diceExpr": "1d6",
        "damageType": "Arcane"
      }
    ]
  },
  {
    "id": "hollow-man",
    "name": "Hollow Man",
    "category": "creature",
    "stats": {
      "hp": 22,
      "dr": 2,
      "speed": "25",
      "damage": "Slam 1d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Construct",
      "soulCore": "none",
      "native": "Deep woods, Abandoned farmland"
    },
    "abilities": [
      "Effigy Stillness",
      "Silent Lurch",
      "Restraining thorns"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      }
    ]
  },
  {
    "id": "whippoorwail",
    "name": "Whippoorwail",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 fly",
      "damage": "Peck 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Spirit Beast",
      "soulCore": "Fading Core (DC13)",
      "native": "Forest edges, Burial grounds"
    },
    "abilities": [
      "Death-Linked",
      "Cry of the Dying: Blocks Luck recovery"
    ],
    "attacks": [
      {
        "name": "Peck",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ]
  },
  {
    "id": "hollowkin",
    "name": "Hollowkin",
    "category": "creature",
    "stats": {
      "hp": 28,
      "dr": 2,
      "speed": "30 / hover 20",
      "damage": "Mind lash 1d8 psychic",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Spirit",
      "soulCore": "Ethereal Core (DC14)",
      "native": "Highland ridges, Misty ruins"
    },
    "abilities": [
      "Misty Veil",
      "Fade Step",
      "Test of the Soul",
      "Mirror Echo"
    ],
    "attacks": [
      {
        "name": "Mind lash",
        "diceExpr": "1d8",
        "damageType": "Psychic"
      }
    ]
  },
  {
    "id": "trellin-shaman",
    "name": "T'rellin Shaman",
    "category": "creature",
    "stats": {
      "hp": 22,
      "dr": 1,
      "speed": "30 / climb 30",
      "damage": "Staff strike 1d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Insectoid Caster",
      "soulCore": "Naturebound Core (DC14)",
      "native": "Canopy sanctuaries, Oak groves"
    },
    "abilities": [
      "Spellcaster",
      "Nature magic"
    ],
    "attacks": [
      {
        "name": "Staff strike",
        "diceExpr": "1d6",
        "damageType": "Bludgeoning"
      }
    ]
  },
  {
    "id": "acid-fly",
    "name": "Acid Fly",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 40",
      "damage": "Acid Bite 2d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Acidic Glow: The Acid Fly emits a faint bioluminescent green glow from its thorax, dimly illuminating a 5-foot radius. The glow intensifies when it is agitated or ready to explode.",
      "Rotting Attraction: The Acid Fly is naturally drawn to the scent of rotting meat or fresh blood within 60 feet. If such material is present, it prioritizes flying toward it unless directly threatened.",
      "Swarm Instinct: Acid Flies tend to gather in large numbers. If at least three Acid Flies are within 5 feet of each other, they all gain Advantage on attack rolls against the same target.",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Fire Frailty: Takes double damage from Fire attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed."
    ],
    "attacks": [
      {
        "name": "Acid Bite",
        "diceExpr": "2d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "queen-acid-fly",
    "name": "Queen Acid Fly",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30 / fly 50",
      "damage": "Acid Spit 4d6 acid / Ravenous Bite 3d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "Naturebound Core (DC17)",
      "native": "Wilderness"
    },
    "abilities": [
      "Hive Mother: The Queen Acid Fly is surrounded by a constant swarm of Acid Flies. At the start of her turn, 1d6 Acid Flies (use Swarm of Insects stats, but deal acid damage instead of piercing) emerge from her bloated abdomen. She can control up to 10…",
      "Acidward: Immune to Acid damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Steadfast Form: Cannot be charmed, frightened, poisoned."
    ],
    "attacks": [
      {
        "name": "Acid Spit",
        "diceExpr": "4d6",
        "damageType": "Acid"
      },
      {
        "name": "Ravenous Bite",
        "diceExpr": "3d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "vulturis",
    "name": "Vulturis",
    "category": "creature",
    "stats": {
      "hp": 41,
      "dr": 3,
      "speed": "30",
      "damage": "Beak 1d10+2 piercing / Talons 2d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Caverns, Crypts, Frozen Wastes"
    },
    "abilities": [
      "Glide: The Vulturis can extend its wings to slow its descent, traveling 10 feet forward for every 5 feet it falls. It takes no damage from falling and can move up to its speed horizontally while gliding. Carrion Ambusher. The Vulturis is a…",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Steadfast Form: Cannot be poisoned, diseased."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Talons",
        "diceExpr": "2d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "vulturis-bone-shaman",
    "name": "Vulturis Bone Shaman",
    "category": "creature",
    "stats": {
      "hp": 62,
      "dr": 4,
      "speed": "30",
      "damage": "Bone Staff 4d6 bludgeoning / Rotting Beak 1d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Glide: The Bone Shaman can extend its wings to slow its descent, moving 10 feet forward for every 5 feet it falls. It takes no damage from falling. Speaker of the Dead. The Bone Shaman can cast *speak with dead* once per short rest. It requires…",
      "Rotting Beak: Rotting Beak. *Melee Weapon Attack:* +6 to hit, reach 5 ft., one target. Hit: 9 (1d8 + 3) piercing damage and the target must make a DC 15 Constitution saving throw or become poisoned for 1 minute. The target repeats…",
      "Raise the Fallen: Raise the Fallen. The Bone Shaman animates a skeletal vulturis (use ghoul stats) from the remains of a fallen creature within 10 feet. Blackened Feather Swarm (once per encounter). The Bone Shaman flutters its wings,…",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Steadfast Form: Cannot be poisoned, diseased."
    ],
    "attacks": [
      {
        "name": "Bone Staff",
        "diceExpr": "4d6",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Rotting Beak",
        "diceExpr": "1d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "vulturis-deathlord",
    "name": "Vulturis Deathlord",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40",
      "damage": "Beak 3d10 piercing / Talon Swipe 3d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "Naturebound Core (DC17)",
      "native": "Wilderness"
    },
    "abilities": [
      "Glide: The Deathlord can glide, moving 20 feet forward for every 5 feet it falls. It takes no damage from falling. Aura of Dread. Any creature that starts its turn within 10 feet of the Deathlord must make a DC 16 Wisdom saving throw or be…",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Bludgeoning from non-magical weapons-Hardened: Takes half damage from Bludgeoning from non-magical weapons attacks",
      "Steadfast Form: Cannot be frightened, poisoned."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Talon Swipe",
        "diceExpr": "3d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "drakein-warrior",
    "name": "Drakein Warrior",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 3,
      "speed": "30",
      "damage": "Claw 1d8+1 slashing / Drakeblade 2d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Pack Tactics: The Drakekin Warrior has advantage on attack rolls against a creature if at least one of the Drakekin's allies is within 5 feet of the creature and not incapacitated. Draconic Resilience. The Drakekin’s thick, scaled hide grants it a…",
      "Fire-Hardened: Takes half damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d8+1",
        "damageType": "Slashing"
      },
      {
        "name": "Drakeblade",
        "diceExpr": "2d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "drakein-warlord",
    "name": "Drakein Warlord",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30",
      "damage": "Drakefang Greatsword 5d10 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Draconic Commander: All allied Drakekin within 30 feet gain advantage on melee attack rolls and saving throws against being frightened. Pack Tactics. The Warlord has advantage on attack rolls against a creature if at least one of the Warlord's allies is…",
      "Multiattack: Multiattack. The Warlord makes three melee attacks with its Drakefang Greatsword. Drakefang Greatsword. *Melee Weapon Attack:* +9 to hit, reach 5 ft., one target. Hit: 15 (2d10 + 5) slashing damage plus 7 (2d6) fire…",
      "Fire-Hardened: Takes half damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Drakefang Greatsword",
        "diceExpr": "5d10",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "drakein-fire-priest",
    "name": "Drakein Fire Priest",
    "category": "creature",
    "stats": {
      "hp": 41,
      "dr": 4,
      "speed": "30",
      "damage": "Drakeflame Staff 5d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Fiery Devotion: Whenever the Fire Priest casts a spell that deals fire damage, it can choose one ally within 30 feet to gain 10 temporary hit points. Blessing of the Flame. All allied Drakekin within 30 feet deal an additional 4 (1d8) fire damage with…",
      "Spellcasting: The Fire Priest is a 9th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 15, +7 to hit with spell attacks). It has the following spells prepared: Cantrips (At Will): Sacred Flame, Thaumaturgy, Fire Bolt 1st Level (4…",
      "Fire-Hardened: Takes half damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Drakeflame Staff",
        "diceExpr": "5d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "hydra",
    "name": "Hydra",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / swim 30",
      "damage": "Bite 6d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound Core (DC18)",
      "native": "Wilderness"
    },
    "abilities": [
      "Red Head: Immune to fire, vulnerable to cold",
      "Blue Head: Immune to lightning, vulnerable to psychic",
      "Green Head: Immune to poison, vulnerable to radiant",
      "White Head: Immune to cold, vulnerable to fire",
      "Black Head: Immune to acid, vulnerable to thunder",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Bludgeoning)-Hardened: Takes half damage from Bludgeoning) attacks",
      "Steadfast Form: Cannot be charmed, frightened, stunned.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "6d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "hyena-gnoll",
    "name": "Hyena Gnoll",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 3,
      "speed": "30",
      "damage": "Bite 2d8 piercing / Spear 2d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Pack Tactics: The hyena gnoll has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally isn’t incapacitated.",
      "Rampage: When the hyena gnoll reduces a creature to 0 hit points with a melee attack on its turn, it can take a bonus action to move up to half its speed and make a bite attack.",
      "Hyena Companion (Optional): The hyena gnoll is often accompanied by a trained hyena, which acts independently but follows its commands. The hyena has the statistics of a regular hyena."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d8",
        "damageType": "Piercing"
      },
      {
        "name": "Spear",
        "diceExpr": "2d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "hyena-gnoll-barbarian-warlord",
    "name": "Hyena Gnoll Barbarian Warlord",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 4,
      "speed": "30",
      "damage": "Strike 4d8+1 bludgeoning (scaled to TR band (source attack unparsed))",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Pack Tactics: The warlord has advantage on an attack roll against a creature if at least one of its allies is within 5 feet of the creature and the ally isn’t incapacitated.",
      "Rage (Recharges after a Long Rest): As a bonus action, the warlord enters a rage for 1 minute. While raging:",
      "Reckless Attack: At the start of its turn, the warlord can make all melee attacks this turn with advantage, but attack rolls against it also have advantage until the start of its next turn."
    ],
    "attacks": [
      {
        "name": "Strike",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning",
        "note": "scaled to TR band (source attack unparsed)"
      }
    ],
    "provisional": true
  },
  {
    "id": "hyena-gnoll-shaman",
    "name": "Hyena Gnoll Shaman",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 3,
      "speed": "30",
      "damage": "Bite 2d6 piercing / Quarterstaff 2d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "The Abyss, Wilderness"
    },
    "abilities": [
      "Pack Tactics: The hyena gnoll shaman has advantage on an attack roll against a creature if at least one of the shaman's allies is within 5 feet of the creature and the ally isn’t incapacitated. Spellcasting: The hyena gnoll shaman is a 4th-level…",
      "Cantrips (at will): *Druidcraft, Produce Flame, Thorn Whip*"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6",
        "damageType": "Piercing"
      },
      {
        "name": "Quarterstaff",
        "diceExpr": "2d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "abyssal-maw",
    "name": "Abyssal Maw",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / swim 50",
      "damage": "Bite 3d12+2 piercing / Tentacle Slam 2d10+3 bludgeoning / Tail Swipe 1d10 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Aberration",
      "soulCore": "Infernal Core (DC19)",
      "native": "The Abyss, The Underdark"
    },
    "abilities": [
      "Legendary Hunger: If the Abyssal Maw reduces a creature to 0 HP with a bite, it regains HP equal to half the creature’s maximum HP. Abyssal Regeneration: The Abyssal Maw regains 20 HP at the start of its turn unless it takes radiant or force damage.…",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Psychicward: Immune to Psychic damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d12+2",
        "damageType": "Piercing"
      },
      {
        "name": "Tentacle Slam",
        "diceExpr": "2d10+3",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Tail Swipe",
        "diceExpr": "1d10",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "thorned-spider",
    "name": "Thorned Spider",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 4,
      "speed": "30 / climb 40",
      "damage": "Bite 4d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Thorned Body: The thorned spider's body is covered in sharp thorns. A creature that touches the spider or hits it with a melee attack while within 5 feet of it takes 5 (1d10) piercing damage.",
      "Web Walker: The thorned spider can move across its own webs and other webs without being hindered by difficult terrain.",
      "Poison Resistance: The thorned spider has resistance to poison damage.",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "shield-spider",
    "name": "Shield Spider",
    "category": "creature",
    "stats": {
      "hp": 41,
      "dr": 3,
      "speed": "30 / climb 30",
      "damage": "Bite 4d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Caverns, Wilderness"
    },
    "abilities": [
      "Boney Carapace: The Shield Spider’s AC is 16 due to its boney carapace, providing natural armor.",
      "Underground Ambusher: The Shield Spider has advantage on attack rolls against creatures that have not yet acted in combat when it ambushes from its underground nest.",
      "Spider Climb: The Shield Spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "phase-spider",
    "name": "Phase Spider",
    "category": "creature",
    "stats": {
      "hp": 33,
      "dr": 4,
      "speed": "40 / climb 40",
      "damage": "Bite 3d10+2 lightning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Always Elusive: Attacks against the Phase Spider are always made at disadvantage.",
      "Lightning Bite: The Phase Spider’s bite deals lightning damage instead of poison.",
      "Phase Step (At Will): As a bonus action, the Phase Spider magically teleports up to 10 feet to an unoccupied space it can see.",
      "Lightning-Hardened: Takes half damage from Lightning attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10+2",
        "damageType": "Lightning"
      }
    ],
    "provisional": true
  },
  {
    "id": "skull-spider",
    "name": "Skull Spider",
    "category": "creature",
    "stats": {
      "hp": 50,
      "dr": 4,
      "speed": "30 / climb 30",
      "damage": "Bite 4d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Undead",
      "soulCore": "Shadow Core (DC16)",
      "native": "Shadowlands, Crypts, Ruins"
    },
    "abilities": [
      "Skull Carapace: The Skull Spider’s AC is 14 due to its hardened exoskeleton, providing natural armor.",
      "Undead Nature: The Skull Spider does not require air, food, drink, or sleep.",
      "Deathly Stealth: The Skull Spider has advantage on Dexterity (Stealth) checks made to hide in dark or dimly lit areas.",
      "Spider Climb: The Skull Spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Undying Husk: Immune to Poison damage; cannot be poisoned.",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "arachnid-horror",
    "name": "Arachnid Horror",
    "category": "creature",
    "stats": {
      "hp": 41,
      "dr": 4,
      "speed": "30 / climb 30",
      "damage": "Bite 4d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Web Trap: The arachnid horror can use its web to create a trap on the ground or in the air. As an action, the arachnid horror can create a 10-foot cube of webbing. The area becomes difficult terrain, and a creature entering or starting its turn in…",
      "Venomous Bite: A creature that takes damage from the arachnid horror's bite attack must succeed on a DC 15 Constitution saving throw or be poisoned for 1 minute. While poisoned in this way, the creature is also paralyzed. The creature can repeat the…",
      "Wall Climb: The arachnid horror can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bone-naga",
    "name": "Bone Naga",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 5,
      "speed": "30 / swim 30",
      "damage": "Bite 5d6 piercing / Tail 2d8+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Undead",
      "soulCore": "Shadow Core (DC17)",
      "native": "The Abyss, Crypts, Ruins"
    },
    "abilities": [
      "Undead Nature: The Bone Naga does not require air, food, drink, or sleep.",
      "Rejuvenation: If destroyed, the Bone Naga regains all its hit points in 24 hours unless holy water is sprinkled on its remains or a Remove Curse, Greater Restoration, or Wish spell is cast on them.",
      "Spellcasting: The Bone Naga is a 10th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 15, +7 to hit with spell attacks). It has the following spells prepared: Cantrips (at will): *Chill Touch, Mage Hand, Minor Illusion",
      "Undying Husk: Immune to Poison damage; cannot be poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Steadfast Form: Cannot be charmed, frightened."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "5d6",
        "damageType": "Piercing"
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "bloated-zombie",
    "name": "Bloated Zombie",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "20",
      "damage": "Slam 2d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Crypts, Ruins"
    },
    "abilities": [
      "Undead Fortitude: If damage reduces the Bloated Zombie to 0 hit points, it must make a DC 5 + the damage taken Constitution saving throw, unless the damage is radiant or from a critical hit. On a success, it drops to 1 HP instead.",
      "Slow Movement: Due to its bloated and decayed form, the Bloated Zombie's speed is 20 feet.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "swift-zombie",
    "name": "Swift Zombie",
    "category": "creature",
    "stats": {
      "hp": 19,
      "dr": 3,
      "speed": "40",
      "damage": "Claw 1d6 slashing / Bite 2d4 piercing / Slam 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Coastal Waters, Crypts, Ruins"
    },
    "abilities": [
      "Undead Fortitude: If damage reduces the Swift Zombie to 0 HP, it must make a DC 5 + the damage taken Constitution saving throw, unless the damage is radiant or from a critical hit. On a success, it drops to 1 HP instead.",
      "Accelerated Speed: The Swift Zombie’s unnaturally enhanced agility grants it a speed of 40 feet.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d6",
        "damageType": "Slashing"
      },
      {
        "name": "Bite",
        "diceExpr": "2d4",
        "damageType": "Piercing"
      },
      {
        "name": "Slam",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "spectral-knight",
    "name": "Spectral Knight",
    "category": "creature",
    "stats": {
      "hp": 58,
      "dr": 4,
      "speed": "30",
      "damage": "Ethereal Sword 4d8+1 force",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Undead",
      "soulCore": "Shadow Core (DC16)",
      "native": "The Abyss, Frozen Wastes, Crypts"
    },
    "abilities": [
      "Ethereal Sight: The Spectral Knight can see 60 ft. into the Ethereal Plane when it is on the Material Plane, and vice versa.",
      "Incorporeal Movement: The Spectral Knight can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Undead Nature: The Spectral Knight does not require air, food, drink, or sleep.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, prone, restrained."
    ],
    "attacks": [
      {
        "name": "Ethereal Sword",
        "diceExpr": "4d8+1",
        "damageType": "Force"
      }
    ],
    "provisional": true
  },
  {
    "id": "spectral-sorcerer",
    "name": "Spectral Sorcerer",
    "category": "creature",
    "stats": {
      "hp": 50,
      "dr": 5,
      "speed": "30 / fly 40",
      "damage": "Spectral Touch 5d6 necrotic / Necrotic Bolt 3d6 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Undead",
      "soulCore": "Shadow Core (DC17)",
      "native": "Crypts, Ruins"
    },
    "abilities": [
      "Incorporeal Movement: The Spectral Sorcerer can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Undead Nature: The Spectral Sorcerer does not require air, food, drink, or sleep.",
      "Spellcasting: The Spectral Sorcerer is a 12th-level spellcaster. Its spellcasting ability is Charisma (spell save DC 16, +8 to hit with spell attacks). It has the following spells prepared:",
      "Cantrips (at will): *Chill Touch, Mage Hand, Minor Illusion, Prestidigitation*",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, prone, restrained."
    ],
    "attacks": [
      {
        "name": "Spectral Touch",
        "diceExpr": "5d6",
        "damageType": "Necrotic"
      },
      {
        "name": "Necrotic Bolt",
        "diceExpr": "3d6",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "shadow-specter",
    "name": "Shadow Specter",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 4,
      "speed": "0 / fly 40",
      "damage": "Life Drain 3d6 necrotic / Shadow Bolt 2d6+1 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Undead",
      "soulCore": "Shadow Core (DC16)",
      "native": "Shadowlands, Crypts, Ruins"
    },
    "abilities": [
      "Incorporeal Movement: The Shadow Specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Shadowy Form: While in dim light or darkness, the Shadow Specter has advantage on Dexterity (Stealth) checks and is invisible to creatures with darkvision.",
      "Weakness to Bright Light: When exposed to bright light, the Shadow Specter takes 10 (3d6) radiant damage at the start of each of its turns and has disadvantage on attack rolls and ability checks. If it takes damage from bright light, it must succeed on a DC 13…",
      "Possess Shadow: The Shadow Specter can attempt to possess a creature’s shadow. As an action, the Specter targets one creature it can see within 30 feet. The target must succeed on a DC 15 Charisma saving throw or be possessed for 1 hour. While possessed:",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, grappled, paralyzed, petrified, prone, restrained, unconscious."
    ],
    "attacks": [
      {
        "name": "Life Drain",
        "diceExpr": "3d6",
        "damageType": "Necrotic"
      },
      {
        "name": "Shadow Bolt",
        "diceExpr": "2d6+1",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "ghost",
    "name": "Ghost",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 3,
      "speed": "0 / fly 40",
      "damage": "Withering Touch 4d6 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Frozen Wastes, Crypts, Ruins"
    },
    "abilities": [
      "Ethereal Sight: The ghost can see 60 feet into the Ethereal Plane when it is on the Material Plane, and vice versa.",
      "Incorporeal Movement: The ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Mournful Task: Upon encountering the players, there is a 50% chance (1d20; 1-10 = hostile, 11-20 = non-hostile) that the ghost is non-hostile. If non-hostile, the ghost offers the players a task related to its unfinished business.",
      "Etherealness: The ghost can move into the Ethereal Plane as an action. While on the Ethereal Plane, the ghost is invisible and cannot be attacked or affect the Material Plane.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, grappled, paralyzed, petrified, prone, restrained, unconscious."
    ],
    "attacks": [
      {
        "name": "Withering Touch",
        "diceExpr": "4d6",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "soul-bound-lich",
    "name": "Soul-Bound Lich",
    "category": "creature",
    "stats": {
      "hp": 74,
      "dr": 6,
      "speed": "30",
      "damage": "Paralyzing Touch 10d6 cold",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Undead",
      "soulCore": "Shadow Core (DC18)",
      "native": "Crypts, Ruins"
    },
    "abilities": [
      "Rejuvenation: If the Soul-Bound Lich is destroyed, it regains all its hit points in 1d10 days unless a Remove Curse, Greater Restoration, or Wish spell is cast on its remains.",
      "Disguise Self: The Soul-Bound Lich can cast Disguise Self at will without expending a spell slot. It uses this ability to appear as a kind older traveler.",
      "Soul Bound: The Soul-Bound Lich can bind its soul to a child's body. When it does so, the child falls ill within 1d4 days after the lich leaves the village. The child must make a DC 18 Constitution saving throw or be possessed by the lich. If the…",
      "Spellcasting: The Soul-Bound Lich is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 18, +10 to hit with spell attacks). It has the following spells prepared:",
      "Cantrips (at will): Chill Touch, Mage Hand, Minor Illusion, Prestidigitation",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Paralyzing Touch",
        "diceExpr": "10d6",
        "damageType": "Cold"
      }
    ],
    "provisional": true
  },
  {
    "id": "aether-wraith",
    "name": "Aether Wraith",
    "category": "creature",
    "stats": {
      "hp": 74,
      "dr": 6,
      "speed": "0 / fly 40",
      "damage": "Spectral Claw 10d6 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Undead",
      "soulCore": "Shadow Core (DC18)",
      "native": "Crypts, Ruins"
    },
    "abilities": [
      "Incorporeal Movement: The Aether Wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object. Mana Nullification Aura. Creatures within 30 feet of the Aether Wraith…",
      "Hit: Hit:* 21 (6d6) necrotic damage. If the target is a spellcaster, they lose one spell slot of the highest level they have available. Envelop (once per encounter). The Aether Wraith attempts to envelop a creature within 30…",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, grappled, paralyzed, petrified, prone, restrained, stunned.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Spectral Claw",
        "diceExpr": "10d6",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "magical-ooze",
    "name": "Magical Ooze",
    "category": "creature",
    "stats": {
      "hp": 28,
      "dr": 4,
      "speed": "10",
      "damage": "Pseudopod 4d8+1 acid",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Ooze",
      "soulCore": "none",
      "native": "Caverns"
    },
    "abilities": [
      "Amorphous: The Magical Ooze can move through a space as narrow as 1 inch wide without squeezing.",
      "Split: When the Magical Ooze reaches 0 hit points, it splits into two identical oozes, each with full hit points. Each clone is capable of splitting again if its hit points reach 0, following the same rules.",
      "Resilient: The Magical Ooze has advantage on saving throws against spells and other magical effects.",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Steadfast Form: Cannot be blinded, charmed, deafened, frightened, prone."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "4d8+1",
        "damageType": "Acid"
      }
    ],
    "provisional": true
  },
  {
    "id": "brontosaurus",
    "name": "Brontosaurus",
    "category": "creature",
    "stats": {
      "hp": 67,
      "dr": 4,
      "speed": "30",
      "damage": "Stomp 2d8+2 bludgeoning / Tail 2d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Trampling Charge: If the Brontosaurus moves at least 20 feet straight toward a creature and then hits it with a stomp attack on the same turn, the target must succeed on a DC 16 Strength saving throw or be knocked prone. If the target is prone, the…",
      "None-Hardened: Takes half damage from None attacks",
      "Steadfast Form: Cannot be none."
    ],
    "attacks": [
      {
        "name": "Stomp",
        "diceExpr": "2d8+2",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Tail",
        "diceExpr": "2d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "velociraptor",
    "name": "Velociraptor",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "40",
      "damage": "Bite 1d4 piercing / Claws 1d4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Pack Tactics: The velociraptor has advantage on an attack roll against a creature if at least one of the velociraptor’s allies is within 5 feet of the creature and the ally isn’t incapacitated. Pounce. If the velociraptor moves at least 20 feet straight…"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "tyrannosaurus-rex",
    "name": "Tyrannosaurus Rex",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "50",
      "damage": "Bite 3d12 piercing / Tail 2d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d12",
        "damageType": "Piercing"
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "triceratops",
    "name": "Triceratops",
    "category": "creature",
    "stats": {
      "hp": 52,
      "dr": 4,
      "speed": "50",
      "damage": "Gore 2d8+1 piercing / Stomp 2d10 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "2d8+1",
        "damageType": "Piercing"
      },
      {
        "name": "Stomp",
        "diceExpr": "2d10",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "pteranodon",
    "name": "Pteranodon",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 60",
      "damage": "Beak 1d4 piercing / Talons 1d4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight: The pteranodon has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Talons",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "stone-golem",
    "name": "Stone Golem",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30",
      "damage": "Slam 6d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are considered magical.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Psychicward: Immune to Psychic damage",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "6d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "iron-golem",
    "name": "Iron Golem",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "30",
      "damage": "Slam 7d8+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Construct",
      "soulCore": "Earthen Core (DC18)",
      "native": "Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are considered magical.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Fireward: Immune to Fire damage",
      "Psychicward: Immune to Psychic damage",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "7d8+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "clay-golem",
    "name": "Clay Golem",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "20",
      "damage": "Slam 5d10 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Berserk: When the golem starts its turn with 60 HP or fewer, roll a d6. On a 6, the golem goes berserk. While berserk, it attacks the nearest creature. If no creature is nearby, it attacks an object smaller than itself. The golem remains berserk…",
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Acidward: Immune to Acid damage",
      "Psychicward: Immune to Psychic damage",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "5d10",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "flesh-golem",
    "name": "Flesh Golem",
    "category": "creature",
    "stats": {
      "hp": 51,
      "dr": 4,
      "speed": "30",
      "damage": "Slam 4d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Berserk: When the golem starts its turn with 40 HP or fewer, roll a d6. On a 6, the golem goes berserk. While berserk, it attacks the nearest creature. If no creature is nearby, it attacks an object smaller than itself. The golem remains berserk…",
      "Aversion to Fire: If the golem takes fire damage, it has disadvantage on attack rolls and ability checks until the end of its next turn.",
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Lightning Absorption: If the golem takes lightning damage, it regains HP equal to the damage dealt instead of taking damage.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Lightningward: Immune to Lightning damage",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "glass-golem",
    "name": "Glass Golem",
    "category": "creature",
    "stats": {
      "hp": 62,
      "dr": 4,
      "speed": "30",
      "damage": "Slam 3d10+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Reflective Surface: When the golem is targeted by a spell that requires a ranged attack roll, roll a d6. On a 4 or higher, the spell is reflected back at the caster as though it originated from the golem, turning the caster into the target.",
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Psychicward: Immune to Psychic damage",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Thunder Frailty: Takes double damage from Thunder attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "3d10+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "wood-golem",
    "name": "Wood Golem",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30",
      "damage": "Slam 6d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Construct",
      "soulCore": "none",
      "native": "Frozen Wastes, Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Psychicward: Immune to Psychic damage",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Fire Frailty: Takes double damage from Fire attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "6d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "ice-golem",
    "name": "Ice Golem",
    "category": "creature",
    "stats": {
      "hp": 92,
      "dr": 6,
      "speed": "30",
      "damage": "Slam 7d8+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Construct",
      "soulCore": "Earthen Core (DC18)",
      "native": "Frozen Wastes, Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Coldward: Immune to Cold damage",
      "Psychicward: Immune to Psychic damage",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Fire Frailty: Takes double damage from Fire attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "7d8+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "fire-golem",
    "name": "Fire Golem",
    "category": "creature",
    "stats": {
      "hp": 103,
      "dr": 6,
      "speed": "30",
      "damage": "Slam 7d8+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Construct",
      "soulCore": "Earthen Core (DC18)",
      "native": "Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Heated Body: A creature that touches the golem or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Fireward: Immune to Fire damage",
      "Psychicward: Immune to Psychic damage",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Cold Frailty: Takes double damage from Cold attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "7d8+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "lightning-golem",
    "name": "Lightning Golem",
    "category": "creature",
    "stats": {
      "hp": 98,
      "dr": 6,
      "speed": "30",
      "damage": "Slam 7d8+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Construct",
      "soulCore": "Earthen Core (DC18)",
      "native": "Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Charged Body: A creature that touches the golem or hits it with a melee attack while within 5 feet of it takes 10 (3d6) lightning damage.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Lightningward: Immune to Lightning damage",
      "Psychicward: Immune to Psychic damage",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Cold Frailty: Takes double damage from Cold attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "7d8+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "crystal-golem",
    "name": "Crystal Golem",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "30",
      "damage": "Slam 6d10 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Construct",
      "soulCore": "Earthen Core (DC18)",
      "native": "Shadowlands, Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Reflective Body: When the golem is hit by a ranged spell attack that targets only the golem, roll a d6. On a 4 or higher, the spell is reflected back at the caster, as if it originated from the golem.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Psychic-Hardened: Takes half damage from Psychic attacks",
      "Thunder Frailty: Takes double damage from Thunder attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "6d10",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "shadow-golem",
    "name": "Shadow Golem",
    "category": "creature",
    "stats": {
      "hp": 92,
      "dr": 6,
      "speed": "30",
      "damage": "Slam 4d8+1 bludgeoning / Shadowy Grasp 3d8+1 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Construct",
      "soulCore": "Earthen Core (DC18)",
      "native": "Deserts, Shadowlands, Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form. Magic Resistance. The golem has advantage on saving throws against spells and other magical effects. Magic Weapons. The golem’s weapon attacks are magical. Shadow…",
      "Multiattack: Multiattack. The golem makes two slam or shadowy grasp attacks. Slam. *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 18 (3d8 + 5) bludgeoning damage. Shadowy Grasp. *Melee Weapon Attack:* +10 to hit,…",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Bludgeoningward: Immune to Bludgeoning damage",
      "Piercingward: Immune to Piercing damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Psychic-Hardened: Takes half damage from Psychic attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Shadowy Grasp",
        "diceExpr": "3d8+1",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "sand-golem",
    "name": "Sand Golem",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "30 / burrow 20",
      "damage": "Slam 7d8+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Construct",
      "soulCore": "Earthen Core (DC18)",
      "native": "Deserts, Storm Coasts, Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form. Magic Resistance. The golem has advantage on saving throws against spells and other magical effects. Magic Weapons. The golem’s weapon attacks are magical. Sand Cloak.…",
      "Multiattack: Multiattack. The golem makes two slam attacks. Slam. *Melee Weapon Attack:* +10 to hit, reach 5 ft., one target. *Hit:* 19 (3d8 + 6) bludgeoning damage. Sandstorm Blast (once per encounter). The golem releases a…",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "7d8+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "earth-golem",
    "name": "Earth Golem",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "30 / burrow 20",
      "damage": "Slam 4d10 bludgeoning / Rock Throw 2d10+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Construct",
      "soulCore": "Earthen Core (DC18)",
      "native": "Ruins"
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form. Magic Resistance. The golem has advantage on saving throws against spells and other magical effects. Magic Weapons. The golem’s weapon attacks are magical. Earth Glide.…",
      "Multiattack: Multiattack. The golem makes two slam attacks. Slam. *Melee Weapon Attack:* +12 to hit, reach 5 ft., one target. *Hit:* 21 (3d10 + 7) bludgeoning damage. Rock Throw. *Ranged Weapon Attack:* +12 to hit, range 30/60 ft.,…",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "4d10",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Rock Throw",
        "diceExpr": "2d10+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "insectoids",
    "name": "Insectoids",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "20 / climb 10",
      "damage": "Claw Attack 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "The Nine Hells, Caverns, Frozen Wastes"
    },
    "abilities": [
      "Perfect Camouflage: When the small rock crab is not moving, it is indistinguishable from a boulder. It has advantage on Dexterity (Stealth) checks made to hide in rocky terrain. Creatures that fail a DC 13 Wisdom (Perception) check cannot discern that the…",
      "Amphibious: The small rock crab can breathe air and water.",
      "Sneak Attack: The small rock crab deals an extra 1d6 damage to one creature it hits with an attack if it has advantage on the attack roll."
    ],
    "attacks": [
      {
        "name": "Claw Attack",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "rock-crab",
    "name": "Rock Crab",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 3,
      "speed": "20 / climb 10",
      "damage": "Claw Attack 2d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "The Nine Hells, Wilderness"
    },
    "abilities": [
      "Perfect Camouflage: When the rock crab is not moving, it is indistinguishable from a boulder. It has advantage on Dexterity (Stealth) checks made to hide in rocky terrain. Creatures that fail a DC 15 Wisdom (Perception) check cannot discern that the rock crab…",
      "Amphibious: The rock crab can breathe air and water.",
      "Sneak Attack: The rock crab deals an extra 2d6 damage to one creature it hits with an attack if it has advantage on the attack roll."
    ],
    "attacks": [
      {
        "name": "Claw Attack",
        "diceExpr": "2d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-rock-crab",
    "name": "Giant Rock Crab",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 4,
      "speed": "20 / climb 10",
      "damage": "Claw Attack 4d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "The Nine Hells, Wilderness"
    },
    "abilities": [
      "Perfect Camouflage: When the giant rock crab is not moving, it is indistinguishable from a boulder. It has advantage on Dexterity (Stealth) checks made to hide in rocky terrain. Creatures that fail a DC 17 Wisdom (Perception) check cannot discern that the…",
      "Amphibious: The giant rock crab can breathe air and water.",
      "Sneak Attack: The giant rock crab deals an extra 3d6 damage to one creature it hits with an attack if it has advantage on the attack roll."
    ],
    "attacks": [
      {
        "name": "Claw Attack",
        "diceExpr": "4d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-praying-mantis",
    "name": "Giant Praying Mantis",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 3,
      "speed": "30 / climb 20",
      "damage": "Scythe Attack 2d8 slashing / Mandibles 1d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Ambusher: The giant praying mantis has advantage on attack rolls against creatures it has surprised.",
      "Camouflage: The giant praying mantis can use its natural coloration to blend into its surroundings. While motionless, it is indistinguishable from the surrounding vegetation. It has advantage on Dexterity (Stealth) checks made to hide.",
      "Keen Senses: The giant praying mantis has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Scythe Attack",
        "diceExpr": "2d8",
        "damageType": "Slashing"
      },
      {
        "name": "Mandibles",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "frostbite-mantis",
    "name": "Frostbite Mantis",
    "category": "creature",
    "stats": {
      "hp": 51,
      "dr": 4,
      "speed": "40 / climb 30",
      "damage": "Claws 2d8+1 slashing / Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Icy Aura: At the start of each of the frostbite mantis's turns, each creature within 10 feet of it takes 5 (1d10) cold damage, and any nonmagical liquid within the area freezes.",
      "Frostbite: When the frostbite mantis hits a creature with its claw attack, the target must succeed on a DC 15 Constitution saving throw or take 14 (4d6) cold damage and have its speed reduced by 10 feet until the end of its next turn.",
      "Camouflage: The frostbite mantis has advantage on Dexterity (Stealth) checks made to hide in snowy or icy terrain. While motionless, it is indistinguishable from its surroundings.",
      "Cold-Hardened: Takes half damage from Cold attacks"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d8+1",
        "damageType": "Slashing"
      },
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "magma-mantis",
    "name": "Magma Mantis",
    "category": "creature",
    "stats": {
      "hp": 52,
      "dr": 4,
      "speed": "40 / climb 30",
      "damage": "Claws 2d8+1 slashing / Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Elemental",
      "soulCore": "Storm Core (DC16)",
      "native": "Volcanic Wastes, Elemental Planes"
    },
    "abilities": [
      "Lava Blood: When the magma mantis takes damage from a melee attack, its lava-like blood splashes on the attacker. The attacker must succeed on a DC 15 Dexterity saving throw or take 14 (4d6) fire damage.",
      "Fiery Strike: When the magma mantis hits a creature with its claws, the target takes an additional 10 (3d6) fire damage. If the target is a flammable object, it ignites and continues to burn until extinguished.",
      "Heat Immunity: The magma mantis is immune to fire damage and can withstand extreme heat without harm.",
      "Fire-Hardened: Takes half damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d8+1",
        "damageType": "Slashing"
      },
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "venomous-swarm",
    "name": "Venomous Swarm",
    "category": "creature",
    "stats": {
      "hp": 20,
      "dr": 2,
      "speed": "10 / fly 40",
      "damage": "Bites 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
      "Venomous Sting: A creature that starts its turn in the swarm's space must make a DC 13 Constitution saving throw, taking 7 (2d6) poison damage on a failed save, or half as much damage on a successful one.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "burrowing-beetle",
    "name": "Burrowing Beetle",
    "category": "creature",
    "stats": {
      "hp": 36,
      "dr": 4,
      "speed": "30 / burrow 20",
      "damage": "Mandibles 1d10+3 piercing / Acidic Spit 1d8 acid",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Caverns, Wilderness"
    },
    "abilities": [
      "Burrower: The burrowing beetle can burrow through earth and unworked stone at a speed of 20 feet. When it burrows into unprotected flesh, it deals additional damage.",
      "Armor Plating: The burrowing beetle's thick exoskeleton provides it with enhanced protection, granting it a higher armor class.",
      "Acid-Hardened: Takes half damage from Acid attacks"
    ],
    "attacks": [
      {
        "name": "Mandibles",
        "diceExpr": "1d10+3",
        "damageType": "Piercing"
      },
      {
        "name": "Acidic Spit",
        "diceExpr": "1d8",
        "damageType": "Acid"
      }
    ],
    "provisional": true
  },
  {
    "id": "fire-ant-colossus",
    "name": "Fire Ant Colossus",
    "category": "creature",
    "stats": {
      "hp": 66,
      "dr": 5,
      "speed": "40 / climb 20",
      "damage": "Mandible Crush 5d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "Naturebound Core (DC17)",
      "native": "Wilderness"
    },
    "abilities": [
      "Fire Aura: At the start of each of the fire ant colossus's turns, each creature within 10 feet of it takes 10 (3d6) fire damage, and flammable objects in the area that aren't being worn or carried ignite. A creature that touches the fire ant colossus…",
      "Fire-Hardened: Takes half damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Mandible Crush",
        "diceExpr": "5d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "summoned-fire-ants",
    "name": "Summoned Fire Ants",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / climb 20",
      "damage": "Bites 3d4+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny fire ant. The swarm can't regain hit points or gain temporary hit points.",
      "Fire Aura: At the start of each of the swarm's turns, each creature in the swarm's space takes 3 (1d6) fire damage, and flammable objects in the area that aren't being worn or carried ignite. A creature that touches the swarm or hits it with a melee…",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "3d4+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "necrotic-scarab",
    "name": "Necrotic Scarab",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 4,
      "speed": "30 / burrow 10",
      "damage": "Claw Attack 5d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Undead",
      "soulCore": "Shadow Core (DC16)",
      "native": "Crypts, Ruins"
    },
    "abilities": [
      "Necrotic Touch: When the necrotic scarab hits a creature with its claw attack, the target must succeed on a DC 15 Constitution saving throw or take 14 (4d6) necrotic damage and have its hit point maximum reduced by the same amount. The reduction lasts…",
      "Corpse Reanimation: As an action, the necrotic scarab can touch a corpse within 5 feet and reanimate it as a zombie under its control. The zombie acts on the necrotic scarab's initiative and obeys its mental commands. The necrotic scarab can control up to…",
      "Carapace Shield: The necrotic scarab's tough exoskeleton grants it resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks. Once per day, the necrotic scarab can use its carapace to shield itself from harm, gaining temporary hit…",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, poisoned."
    ],
    "attacks": [
      {
        "name": "Claw Attack",
        "diceExpr": "5d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "chimeric-insectoid",
    "name": "Chimeric Insectoid",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 4,
      "speed": "40 / climb 30",
      "damage": "Claw Attack 1d8+2 slashing / Stinger Attack 3d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Adaptive Morphing: The chimeric insectoid can adapt its abilities based on the situation. As a bonus action, it can choose one of the following adaptations:",
      "Ant Strength: Gain advantage on Strength checks and saving throws for 1 minute.",
      "Beetle Armor: Gain a +2 bonus to AC for 1 minute.",
      "Wasp Agility: Gain advantage on Dexterity checks and saving throws for 1 minute.",
      "Multi-Strike: The chimeric insectoid can make multiple attacks in a single turn. It can make three attacks: two with its claws and one with its stinger.",
      "Toxic Spray: The chimeric insectoid can expel a spray of toxic venom. As an action, it can release a 30-foot cone of toxic spray. Each creature in that area must make a DC 15 Constitution saving throw, taking 28 (8d6) poison damage on a failed save, or…",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Steadfast Form: Cannot be charmed, frightened."
    ],
    "attacks": [
      {
        "name": "Claw Attack",
        "diceExpr": "1d8+2",
        "damageType": "Slashing"
      },
      {
        "name": "Stinger Attack",
        "diceExpr": "3d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "lightning-bug-leviathan",
    "name": "Lightning Bug Leviathan",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40 / fly 80",
      "damage": "Bite 4d6 piercing / Tail Attack 3d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "Naturebound Core (DC17)",
      "native": "Wilderness"
    },
    "abilities": [
      "Blinding Flash: As a bonus action, the lightning bug leviathan can emit a blinding flash of light in a 30-foot radius. Each creature in that area must succeed on a DC 17 Constitution saving throw or be blinded until the end of their next turn.",
      "Electric Shock: When the lightning bug leviathan hits a creature with its bite or tail attack, the target must succeed on a DC 17 Constitution saving throw or take an additional 22 (4d10) lightning damage and be stunned until the end of their next turn.",
      "Flight: The lightning bug leviathan can fly at a speed of 80 feet. It can hover in place and maneuver with great agility.",
      "Lightning-Hardened: Takes half damage from Lightning attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d6",
        "damageType": "Piercing"
      },
      {
        "name": "Tail Attack",
        "diceExpr": "3d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "hive-mind-queen",
    "name": "Hive Mind Queen",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30 / fly 50",
      "damage": "Sting 4d8 piercing / Claws 2d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "Naturebound Core (DC17)",
      "native": "Wilderness"
    },
    "abilities": [
      "Hive Control: The hive mind queen can telepathically communicate with and command any insect within 1 mile of her. These insects obey her commands without question and act on her initiative.",
      "Pheromone Manipulation: The hive mind queen can release pheromones to influence the behavior of other creatures. As an action, she can choose one of the following effects:",
      "Calm: All creatures within 30 feet of the queen must succeed on a DC 18 Wisdom saving throw or be charmed for 1 minute.",
      "Fear: All creatures within 30 feet of the queen must succeed on a DC 18 Wisdom saving throw or be frightened for 1 minute.",
      "Rage: All insects within 30 feet of the queen gain advantage on attack rolls and deal an extra 1d6 damage for 1 minute.",
      "Royal Guard: The hive mind queen is always accompanied by 1d4 + 2 royal guard insects. These loyal protectors have an AC of 16, 50 hit points, and can make one attack per turn with a +6 to hit, dealing 12 (2d8 + 3) piercing damage. They act on the…"
    ],
    "attacks": [
      {
        "name": "Sting",
        "diceExpr": "4d8",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "2d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "royal-swarm",
    "name": "Royal Swarm",
    "category": "creature",
    "stats": {
      "hp": 28,
      "dr": 3,
      "speed": "30 / fly 40",
      "damage": "Bites 2d6 piercing / Venomous Sting 2d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Swamps, Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Swarm: The royal swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
      "Hive Loyalty: The royal swarm has advantage on attack rolls when it is within 30 feet of the Hive Mind Queen and has at least one ally within 5 feet of the target that isn't incapacitated.",
      "Protect the Queen: When a creature makes an attack against the Hive Mind Queen and is within 5 feet of the royal swarm, the swarm can use its reaction to impose disadvantage on the attack roll.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d6",
        "damageType": "Piercing"
      },
      {
        "name": "Venomous Sting",
        "diceExpr": "2d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swamp-leech",
    "name": "Swamp Leech",
    "category": "creature",
    "stats": {
      "hp": 36,
      "dr": 3,
      "speed": "20 / swim 30",
      "damage": "Bite 2d6+1 piercing / Constrict 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Swamps, Wilderness"
    },
    "abilities": [
      "Life Drain: When the swamp leech hits a creature with its bite attack, the target must succeed on a DC 15 Constitution saving throw or take 14 (4d6) necrotic damage and have its hit point maximum reduced by the same amount. The reduction lasts until…",
      "Camouflage: The swamp leech has advantage on Dexterity (Stealth) checks made to hide in swampy terrain. While motionless, it is indistinguishable from its surroundings.",
      "Regeneration: The swamp leech regains 10 hit points at the start of its turn if it has at least 1 hit point. If the swamp leech takes fire or acid damage, this trait doesn’t function at the start of the swamp leech’s next turn.",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "And slashing-Hardened: Takes half damage from And slashing attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Constrict",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "stinging-nettle-hornet",
    "name": "Stinging Nettle Hornet",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Sting 2d6+2 piercing / Bite 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Paralyzing Sting: When the stinging nettle hornet hits a creature with its sting attack, the target must succeed on a DC 14 Constitution saving throw or be paralyzed for 1 minute. The paralyzed target can repeat the saving throw at the end of each of its…",
      "Aerial Agility: The stinging nettle hornet can take the Disengage or Dash action as a bonus action on each of its turns.",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Steadfast Form: Cannot be charmed, frightened."
    ],
    "attacks": [
      {
        "name": "Sting",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      },
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "carrion-beetle",
    "name": "Carrion Beetle",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 3,
      "speed": "30 / burrow 10",
      "damage": "Rotting Bite 1d8+2 piercing / Claw 2d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Caverns, Crypts, Coastal Waters"
    },
    "abilities": [
      "Foul Stench: The carrion beetle emits a nauseating odor in a 10-foot radius. Creatures that start their turn within this area must succeed on a DC 14 Constitution saving throw or be poisoned until the start of their next turn. While poisoned in this…",
      "Scavenger Instinct: The carrion beetle has advantage on Wisdom (Perception) checks to detect dead or dying creatures within 60 feet.",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Rotting Bite",
        "diceExpr": "1d8+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "juvenile-carrion-beetles",
    "name": "Juvenile Carrion Beetles",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "20 / burrow 10",
      "damage": "Bite 1d6 piercing / Claw 1d4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Caverns, Coastal Waters, Wilderness"
    },
    "abilities": [
      "Foul Stench: The juvenile carrion beetle emits a nauseating odor in a 5-foot radius. Creatures that start their turn within this area must succeed on a DC 12 Constitution saving throw or be poisoned until the start of their next turn. While poisoned in…",
      "Scavenger Instinct: The juvenile carrion beetle has advantage on Wisdom (Perception) checks to detect dead or dying creatures within 30 feet.",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "juvenile-carrion-beetle-swarm",
    "name": "Juvenile Carrion Beetle Swarm",
    "category": "creature",
    "stats": {
      "hp": 24,
      "dr": 2,
      "speed": "20 / burrow 10",
      "damage": "Bites 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Caverns, Frozen Wastes, Coastal Waters"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny beetle. The swarm can't regain hit points or gain temporary hit points.",
      "Foul Stench: The juvenile carrion beetle swarm emits a nauseating odor in a 10-foot radius. Creatures that start their turn within this area must succeed on a DC 12 Constitution saving throw or be poisoned until the start of their next turn. While…",
      "Scavenger Instinct: The juvenile carrion beetle swarm has advantage on Wisdom (Perception) checks to detect dead or dying creatures within 30 feet.",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "crystal-moth",
    "name": "Crystal Moth",
    "category": "creature",
    "stats": {
      "hp": 30,
      "dr": 4,
      "speed": "20 / fly 60",
      "damage": "Proboscis 3d6+1 piercing / Wing Buffet 2d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Fey",
      "soulCore": "Naturebound Core (DC16)",
      "native": "Deserts, Forests, Ruins"
    },
    "abilities": [
      "Mesmerizing Wings: As an action, the crystal moth can cause its wings to shimmer and glow, mesmerizing creatures within 30 feet of it. Each creature in that area must succeed on a DC 16 Wisdom saving throw or be charmed for 1 minute. While charmed in this…",
      "Energy Drain: When the crystal moth hits a creature with its proboscis attack, the target must succeed on a DC 16 Constitution saving throw or take 14 (4d6) necrotic damage and have its hit point maximum reduced by the same amount. The reduction lasts…",
      "Radiant-Hardened: Takes half damage from Radiant attacks",
      "Psychic-Hardened: Takes half damage from Psychic attacks",
      "Steadfast Form: Cannot be charmed, frightened."
    ],
    "attacks": [
      {
        "name": "Proboscis",
        "diceExpr": "3d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Wing Buffet",
        "diceExpr": "2d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "sand-scorpion",
    "name": "Sand Scorpion",
    "category": "creature",
    "stats": {
      "hp": 42,
      "dr": 4,
      "speed": "40 / burrow 30",
      "damage": "Claw 1d6+1 bludgeoning / Sting 3d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Deserts, Shadowlands, Wilderness"
    },
    "abilities": [
      "Sand Burrow: The sand scorpion can burrow through sand and loose earth at a speed of 30 feet. While burrowing, it leaves no tunnel or hole behind and is effectively hidden from view.",
      "Venomous Sting: When the sand scorpion hits a creature with its sting attack, the target must succeed on a DC 15 Constitution saving throw or take 21 (6d6) poison damage and be poisoned for 1 minute. The poisoned target can repeat the saving throw at the…",
      "Heat Resistance: The sand scorpion has resistance to fire damage due to its adaptation to the harsh desert environment.",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d6+1",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Sting",
        "diceExpr": "3d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "shadow-wasp",
    "name": "Shadow Wasp",
    "category": "creature",
    "stats": {
      "hp": 36,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Sting 2d6+2 piercing / Bite 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Shadowlands, Wilderness"
    },
    "abilities": [
      "Shadow Clones: The shadow wasp can create up to three illusory duplicates of itself as a bonus action. These duplicates last for 1 minute or until destroyed. Each duplicate has an AC of 14 and 1 hit point. When an attacker targets the shadow wasp with an…",
      "Poison Sting: When the shadow wasp hits a creature with its sting attack, the target must succeed on a DC 14 Constitution saving throw or take 21 (6d6) poison damage and be poisoned for 1 minute. The poisoned target can repeat the saving throw at the…",
      "Stealth: The shadow wasp has advantage on Dexterity (Stealth) checks made in dim light or darkness.",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks"
    ],
    "attacks": [
      {
        "name": "Sting",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      },
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "rock-hopper",
    "name": "Rock Hopper",
    "category": "creature",
    "stats": {
      "hp": 28,
      "dr": 3,
      "speed": "60",
      "damage": "Claws 2d8 slashing / Bite 2d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Rock Smash: The rock hopper can use its powerful legs to leap and smash into rocky terrain or structures. As an action, it can make a melee attack against a rock or structure within 5 feet of it. On a hit, the rock hopper deals 18 (4d8) bludgeoning…",
      "Powerful Leap: The rock hopper can jump long distances with ease. It can long jump up to 60 feet and high jump up to 30 feet, with or without a running start.",
      "Earth Tremor: When the rock hopper lands from a jump, it can create a small tremor in the ground. Each creature within 10 feet of where the rock hopper lands must succeed on a DC 14 Dexterity saving throw or be knocked prone.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d8",
        "damageType": "Slashing"
      },
      {
        "name": "Bite",
        "diceExpr": "2d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "emberfly",
    "name": "Emberfly",
    "category": "creature",
    "stats": {
      "hp": 21,
      "dr": 3,
      "speed": "20 / fly 60",
      "damage": "Bite 2d8 piercing / Firebolt 2d6 fire",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Elemental",
      "soulCore": "none",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Ember Aura: At the start of each of the emberfly's turns, each creature within 5 feet of it takes 5 (1d10) fire damage, and flammable objects in the area that aren’t being worn or carried ignite. A creature that touches the emberfly or hits it with a…",
      "Fiery Wings: When the emberfly uses its wings to fly, it leaves a trail of sparks and embers in its wake. Creatures that follow the path of the emberfly's flight take 5 (1d10) fire damage for each 10 feet of the path they enter.",
      "Flame Resistance: The emberfly has resistance to fire damage.",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d8",
        "damageType": "Piercing"
      },
      {
        "name": "Firebolt",
        "diceExpr": "2d6",
        "damageType": "Fire"
      }
    ],
    "provisional": true
  },
  {
    "id": "acidic-silk-spinner",
    "name": "Acidic Silk Spinner",
    "category": "creature",
    "stats": {
      "hp": 33,
      "dr": 3,
      "speed": "30 / climb 40",
      "damage": "Bite 4d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Acidic Silk: The acidic silk spinner can produce silk that is coated with a potent acid. When a creature touches or is restrained by the acidic silk, it takes 7 (2d6) acid damage at the start of each of its turns.",
      "Web Walker: The acidic silk spinner can move across its own webs and other webs without being hindered by difficult terrain.",
      "Climbing Agility: The acidic silk spinner has advantage on Dexterity (Stealth) checks made to hide in web-covered areas.",
      "Acid-Hardened: Takes half damage from Acid attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "larval-swarm-of-acidic-silk-spinners",
    "name": "Larval Swarm of Acidic Silk Spinners",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 3,
      "speed": "20 / climb 20",
      "damage": "Bites 4d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Swarm: The larval swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny larva. The swarm can't regain hit points or gain temporary hit points.",
      "Acidic Silk: The larval swarm produces silk that is coated with a potent acid. When a creature touches or is restrained by the acidic silk, it takes 5 (1d10) acid damage at the start of each of its turns.",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "4d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "pyrocricket",
    "name": "Pyrocricket",
    "category": "creature",
    "stats": {
      "hp": 20,
      "dr": 3,
      "speed": "40 / climb 20",
      "damage": "Bite 1d8+1 piercing / Fiery Claws 2d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Ignite: At the start of each of the pyrocricket's turns, each creature within 5 feet of it takes 5 (1d10) fire damage, and flammable objects in the area that aren’t being worn or carried ignite.",
      "Fire Leap: The pyrocricket can leap up to 20 feet as a bonus action, leaving a trail of fire in its wake. Each creature in the path must succeed on a DC 14 Dexterity saving throw or take 7 (2d6) fire damage.",
      "Fire Resistance: The pyrocricket has resistance to fire damage.",
      "Fire-Hardened: Takes half damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+1",
        "damageType": "Piercing"
      },
      {
        "name": "Fiery Claws",
        "diceExpr": "2d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bloodsucker-mosquito",
    "name": "Bloodsucker Mosquito",
    "category": "creature",
    "stats": {
      "hp": 24,
      "dr": 3,
      "speed": "20 / fly 60",
      "damage": "Bite 1d4 piercing / Proboscis 3d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Coastal Waters, Wilderness"
    },
    "abilities": [
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Proboscis",
        "diceExpr": "3d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "frost-beetle",
    "name": "Frost Beetle",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 4,
      "speed": "30 / burrow 20",
      "damage": "Mandibles 2d8+1 piercing / Icy Claws 3d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Ice Armor: The frost beetle's carapace is coated in a layer of ice, granting it resistance to cold damage and a +2 bonus to AC against melee attacks.",
      "Cold Resistance: The frost beetle has resistance to cold damage.",
      "Cold-Hardened: Takes half damage from Cold attacks"
    ],
    "attacks": [
      {
        "name": "Mandibles",
        "diceExpr": "2d8+1",
        "damageType": "Piercing"
      },
      {
        "name": "Icy Claws",
        "diceExpr": "3d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bladed-dragonfly",
    "name": "Bladed Dragonfly",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 3,
      "speed": "10 / fly 80",
      "damage": "Bite 2d6 piercing / Wing Slash 2d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Storm Core (DC15)",
      "native": "The Void, Mountains"
    },
    "abilities": [
      "Wing Slash: The bladed dragonfly's wings are razor-sharp, allowing it to make slashing attacks as it flies by its foes. When it hits a creature with its wing slash attack, the target takes an additional 7 (2d6) slashing damage and must succeed on a DC…",
      "High-Speed Flight: The bladed dragonfly can fly at incredible speeds, granting it advantage on Dexterity (Stealth) checks made to avoid detection while flying and advantage on Dexterity saving throws to avoid area effects.",
      "Aerial Acrobatics: The bladed dragonfly is highly agile in the air, allowing it to take the Disengage or Dash action as a bonus action on each of its turns.",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6",
        "damageType": "Piercing"
      },
      {
        "name": "Wing Slash",
        "diceExpr": "2d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ironclad-beetle",
    "name": "Ironclad Beetle",
    "category": "creature",
    "stats": {
      "hp": 56,
      "dr": 4,
      "speed": "30",
      "damage": "Mandibles 1d10+2 piercing / Charge 2d8+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Iron Defense: The ironclad beetle's tough exoskeleton grants it resistance to all damage except for psychic damage.",
      "Siege Monster: The ironclad beetle deals double damage to objects and structures.",
      "Relentless: If the ironclad beetle takes 20 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Mandibles",
        "diceExpr": "1d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Charge",
        "diceExpr": "2d8+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "glowing-firefly",
    "name": "Glowing Firefly",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "20 / fly 50",
      "damage": "Bite 1d6 piercing / Light Flash 1d6+2 radiant",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Bioluminescence: The glowing firefly can emit bright, colorful light from its abdomen. As a bonus action, it can choose to shed bright light in a 20-foot radius and dim light for an additional 20 feet. The light lasts until the firefly dismisses it (no…"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Light Flash",
        "diceExpr": "1d6+2",
        "damageType": "Radiant"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-glowing-fireflies",
    "name": "Swarm of Glowing Fireflies",
    "category": "creature",
    "stats": {
      "hp": 30,
      "dr": 3,
      "speed": "20 / fly 50",
      "damage": "Bites 3d6 piercing / Light Flash 1d6 radiant",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny firefly. The swarm can't regain hit points or gain temporary hit points.",
      "Bioluminescence: The swarm of glowing fireflies can emit bright, colorful light from their abdomens. As a bonus action, the swarm can choose to shed bright light in a 20-foot radius and dim light for an additional 20 feet. The light lasts until the swarm…"
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "3d6",
        "damageType": "Piercing"
      },
      {
        "name": "Light Flash",
        "diceExpr": "1d6",
        "damageType": "Radiant"
      }
    ],
    "provisional": true
  },
  {
    "id": "horned-rhinoceros-beetle",
    "name": "Horned Rhinoceros Beetle",
    "category": "creature",
    "stats": {
      "hp": 63,
      "dr": 4,
      "speed": "40",
      "damage": "Horn 2d10 piercing / Mandibles 2d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Horn Charge: If the horned rhinoceros beetle moves at least 20 feet straight toward a target and then hits it with a horn attack on the same turn, the target takes an extra 14 (4d6) piercing damage. If the target is a creature, it must succeed on a DC…",
      "Heavy Armor: The horned rhinoceros beetle's tough exoskeleton grants it resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.",
      "Trample: When the horned rhinoceros beetle moves through the space of a prone creature, that creature must succeed on a DC 16 Strength saving throw or take 14 (4d6) bludgeoning damage and be pushed 10 feet away.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Horn",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      },
      {
        "name": "Mandibles",
        "diceExpr": "2d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "sonic-cicada",
    "name": "Sonic Cicada",
    "category": "creature",
    "stats": {
      "hp": 22,
      "dr": 3,
      "speed": "20 / fly 60",
      "damage": "Bite 1d6+1 piercing / Sonic Screech 2d6+1 thunder",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Wing Buzz: As an action, the sonic cicada can create a continuous buzzing sound with its wings. Each creature within 30 feet of the cicada that can hear the sound must succeed on a DC 14 Wisdom saving throw or be incapacitated for 1 minute. The…",
      "Sound Manipulation: The sonic cicada can use sound to create simple auditory illusions. As an action, it can mimic the sounds of other creatures, create phantom noises, or amplify or mute existing sounds within a 30-foot radius. These effects last for 1…",
      "Thunder-Hardened: Takes half damage from Thunder attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Sonic Screech",
        "diceExpr": "2d6+1",
        "damageType": "Thunder"
      }
    ],
    "provisional": true
  },
  {
    "id": "wasteland-roach",
    "name": "Wasteland Roach",
    "category": "creature",
    "stats": {
      "hp": 33,
      "dr": 3,
      "speed": "30 / climb 20",
      "damage": "Bite 2d6 piercing / Claws 2d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Swamps, Wilderness"
    },
    "abilities": [
      "Regeneration: The wasteland roach regains 10 hit points at the start of its turn if it has at least 1 hit point. If the roach takes fire or acid damage, this trait doesn't function at the start of its next turn.",
      "Poison Resistance: The wasteland roach has resistance to poison damage and advantage on saving throws against poison.",
      "Survival Instinct: The wasteland roach has advantage on Wisdom (Perception) checks to detect threats and traps within 60 feet.",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "2d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swamp-centipede",
    "name": "Swamp Centipede",
    "category": "creature",
    "stats": {
      "hp": 40,
      "dr": 4,
      "speed": "40 / climb 30",
      "damage": "Bite 3d8 piercing / Claws 2d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "The Void, Swamps, Wilderness"
    },
    "abilities": [
      "Venomous Bite: When the swamp centipede hits a creature with its bite attack, the target must succeed on a DC 15 Constitution saving throw or take 18 (4d8) poison damage and be poisoned for 1 minute. The poisoned target can repeat the saving throw at the…",
      "Rapid Movement: The swamp centipede can use the Dash action as a bonus action on each of its turns, allowing it to move swiftly through swampy terrain.",
      "Swamp Camouflage: The swamp centipede has advantage on Dexterity (Stealth) checks made to hide in swampy or marshy terrain. While motionless, it is indistinguishable from its surroundings.",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d8",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "2d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "void-dragon",
    "name": "Void Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+2 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "The Void, Astral Plane, Storm Coasts"
    },
    "abilities": [
      "Void Step: As a bonus action, the void dragon can teleport to an unoccupied space it can see within 60 feet.",
      "Temporal Shift: The void dragon can manipulate time, giving it advantage on attack rolls, ability checks, and saving throws until the end of its next turn. It can use this ability once per short or long rest.",
      "Psychic-Hardened: Takes half damage from Psychic attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+2",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "storm-dragon",
    "name": "Storm Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+2 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Frozen Wastes, Storm Coasts, Mountains"
    },
    "abilities": [
      "Storm Aura: At the start of each of the storm dragon's turns, each creature within 10 feet of it takes 10 (3d6) lightning or thunder damage (dragon's choice).",
      "Storm Control: The storm dragon can create and control stormy weather in a 1-mile radius around its lair. It can use its action to summon a storm, causing heavy rain, strong winds, lightning, and thunder.",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+2",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "crystal-dragon",
    "name": "Crystal Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+1 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Deserts, Mountains"
    },
    "abilities": [
      "Crystalline Aura: The crystal dragon emits a radiant light from its body. Each creature within 10 feet of the dragon that starts its turn there must make a DC 21 Constitution saving throw or be blinded until the end of its next turn.",
      "Radiant Resonance: When the crystal dragon takes radiant damage, it can use its reaction to emit a burst of radiant energy. Each creature within 10 feet of the dragon must make a DC 21 Dexterity saving throw, taking 18 (4d8) radiant damage on a failed save,…",
      "Radiant-Hardened: Takes half damage from Radiant attacks",
      "Psychic-Hardened: Takes half damage from Psychic attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "sand-dragon",
    "name": "Sand Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / burrow 30",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+2 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Deserts, Storm Coasts, Shadowlands"
    },
    "abilities": [
      "Sand Burrow: The sand dragon can burrow through sand and loose earth at a speed of 30 feet, leaving no tunnel or hole behind and remaining hidden from view.",
      "Sandstorm: The sand dragon can use its action to create a sandstorm in a 30-foot radius centered on itself. The sandstorm lasts for 1 minute or until the dragon dismisses it (no action required). The area is heavily obscured, and each creature other…",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+2",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "shadow-dragon",
    "name": "Shadow Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+1 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Volcanic Wastes, Shadowlands, Mountains"
    },
    "abilities": [
      "Shadow Stealth: While in dim light or darkness, the shadow dragon can take the Hide action as a bonus action.",
      "Shadow Aura: At the start of each of the shadow dragon's turns, each creature within 10 feet of it takes 10 (3d6) necrotic damage.",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "lava-dragon",
    "name": "Lava Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+2 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Frozen Wastes, Volcanic Wastes, Rivers"
    },
    "abilities": [
      "Magma Body: When a creature touches the lava dragon or hits it with a melee attack while within 5 feet of it, the creature takes 10 (3d6) fire damage.",
      "Lava Flow: The lava dragon can use its action to create a river of lava in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 28 (8d6) fire damage on a failed save, or half as much damage…",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+2",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "frost-dragon",
    "name": "Frost Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+1 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Frozen Wastes, Mountains"
    },
    "abilities": [
      "Icy Body: When a creature touches the frost dragon or hits it with a melee attack while within 5 feet of it, the creature takes 10 (3d6) cold damage.",
      "Freezing Presence: The frost dragon can use its action to create a freezing aura in a 30-foot radius centered on itself. The area is heavily obscured by icy mist, and each creature other than the dragon that starts its turn in the area must make a DC 22…",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "ghost-dragon",
    "name": "Ghost Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+1 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Undead",
      "soulCore": "Shadow Core (DC19)",
      "native": "Forests, Frozen Wastes, Crypts"
    },
    "abilities": [
      "Incorporeal Movement: The ghost dragon can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Ethereal Sight: The ghost dragon can see 60 feet into the Ethereal Plane when it is on the Material Plane, and vice versa.",
      "Coldward: Immune to Cold damage",
      "Psychicward: Immune to Psychic damage",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Steadfast Form: Cannot be charmed, exhausted, frightened, paralyzed, poisoned.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "forest-dragon",
    "name": "Forest Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+1 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Forests, Mountains"
    },
    "abilities": [
      "Forest Camouflage: The forest dragon has advantage on Dexterity (Stealth) checks made to hide in forest terrain.",
      "Forest Control: The forest dragon can use its action to control plant life in a 60-foot radius centered on itself. It can create difficult terrain, entangle creatures, and manipulate plants to attack foes. Each creature in the area must make a DC 21…",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "dream-dragon",
    "name": "Dream Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+1 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Dream Sight: The dream dragon can see into the dreams of creatures within 120 feet of it, even while the creatures are awake.",
      "Illusionary Aura: The dream dragon can use its action to create an aura of illusions in a 30-foot radius centered on itself. Each creature in that area must make a DC 21 Wisdom saving throw. On a failed save, the creature is charmed and experiences vivid…",
      "Psychic-Hardened: Takes half damage from Psychic attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "iron-dragon",
    "name": "Iron Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10+2 piercing / Claw 3d6+2 slashing / Tail 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Magnetic Field: The iron dragon can use its action to create a magnetic field in a 30-foot radius centered on itself. Each creature in that area that is wearing or carrying metal objects must make a DC 22 Strength saving throw, taking 18 (4d8) bludgeoning…",
      "Iron Defense: The iron dragon's metallic body grants it resistance to bludgeoning, piercing, and slashing damage from nonmagical attacks.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+2",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "crystal-dragonfly-dragon",
    "name": "Crystal Dragonfly Dragon",
    "category": "creature",
    "stats": {
      "hp": 82,
      "dr": 7,
      "speed": "30 / fly 90",
      "damage": "Bite 4d8+1 piercing / Claw 4d6+1 slashing / Wing Slash 1d10+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm Core (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Mesmerizing Wings: The crystal dragonfly dragon's wings shimmer and refract light. Each creature within 30 feet of the dragon that can see its wings must succeed on a DC 19 Wisdom saving throw or be charmed for 1 minute. While charmed in this way, a creature…",
      "Energy Drain: When the crystal dragonfly dragon hits a creature with its bite or claw attack, the target must succeed on a DC 19 Constitution saving throw or take 14 (4d6) radiant damage and have its energy drained. The drained target has its speed…",
      "Radiant-Hardened: Takes half damage from Radiant attacks",
      "Psychic-Hardened: Takes half damage from Psychic attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d8+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "4d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Wing Slash",
        "diceExpr": "1d10+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "flutterdrake",
    "name": "Flutterdrake",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 40",
      "damage": "Bite 3d4+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Storm Core (DC14)",
      "native": "Forests, Mountains"
    },
    "abilities": [
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Steadfast Form: Cannot be charmed."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d4+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "aboleth",
    "name": "Aboleth",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "10 / swim 40",
      "damage": "Tentacle 8d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Aberration",
      "soulCore": "none",
      "native": "Coastal Waters, The Underdark"
    },
    "abilities": [
      "Amphibious: The aboleth can breathe air and water.",
      "Mucous Cloud: While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe…",
      "Probing Telepathy: If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
      "Enslave: The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Tentacle",
        "diceExpr": "8d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "acolyte",
    "name": "Acolyte",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Club 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Spellcasting: The acolyte is a 1st-level spellcaster. (Innate magic — see notes.)"
    ],
    "attacks": [
      {
        "name": "Club",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-black-dragon",
    "name": "Adult Black Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 5d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Caustic (DC18)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Acid Breath: The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Acidward: Immune to Acid damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "5d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-blue-dragon",
    "name": "Adult Blue Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 5d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm (DC18)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Lightning Breath: The dragon exhales lightning in a 90-foot line that is 5 ft. wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Lightningward: Immune to Lightning damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "5d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-brass-dragon",
    "name": "Adult Brass Dragon",
    "category": "creature",
    "stats": {
      "hp": 95,
      "dr": 6,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10+2 piercing / Claw 6d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Infernal (DC18)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 45 (13d6) fire damage on a failed… (Once per encounter.)",
      "Fireward: Immune to Fire damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-bronze-dragon",
    "name": "Adult Bronze Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10+2 piercing / Claw 6d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm (DC18)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning… (Once per encounter.)",
      "Lightningward: Immune to Lightning damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-copper-dragon",
    "name": "Adult Copper Dragon",
    "category": "creature",
    "stats": {
      "hp": 101,
      "dr": 6,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10+2 piercing / Claw 6d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Caustic (DC18)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed… (Once per encounter.)",
      "Acidward: Immune to Acid damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-gold-dragon",
    "name": "Adult Gold Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 7d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Infernal (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 66 (12d10) fire damage on a failed save, or half as… (Once per encounter.)",
      "Fireward: Immune to Fire damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "7d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-green-dragon",
    "name": "Adult Green Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 5d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Venom (DC18)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Poison Breath: The dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 56 (16d6) poison damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "5d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-red-dragon",
    "name": "Adult Red Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10+2 piercing / Claw 6d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Infernal (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Fire Breath: The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Fireward: Immune to Fire damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-silver-dragon",
    "name": "Adult Silver Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10+2 piercing / Claw 6d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Tidal (DC18)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 20 Constitution saving throw, taking 58 (13d8) cold damage on a failed save, or… (Once per encounter.)",
      "Coldward: Immune to Cold damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "adult-white-dragon",
    "name": "Adult White Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 5d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Tidal (DC18)",
      "native": "Frozen Wastes, Mountains"
    },
    "abilities": [
      "Ice Walk: The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 14 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Cold Breath: The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Coldward: Immune to Cold damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "5d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "air-elemental",
    "name": "Air Elemental",
    "category": "creature",
    "stats": {
      "hp": 50,
      "dr": 4,
      "speed": "0 / hover 90",
      "damage": "Slam 4d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Elemental",
      "soulCore": "Storm (DC16)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Air Form: The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.",
      "Whirlwind: Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8 + 2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be grappled, paralyzed, petrified, prone, restrained, unconscious."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-black-dragon",
    "name": "Ancient Black Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10 piercing / Claw 6d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Caustic (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Acid Breath: The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Acidward: Immune to Acid damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-blue-dragon",
    "name": "Ancient Blue Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10 piercing / Claw 6d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Lightning Breath: The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Lightningward: Immune to Lightning damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-brass-dragon",
    "name": "Ancient Brass Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 7d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Infernal (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons: Fire Breath. The dragon exhales fire in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Dexterity saving throw, taking 56 (16d6) fire damage on a… (Once per encounter.)",
      "Fireward: Immune to Fire damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "7d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-bronze-dragon",
    "name": "Ancient Bronze Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 7d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Storm (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning… (Once per encounter.)",
      "Lightningward: Immune to Lightning damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "7d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-copper-dragon",
    "name": "Ancient Copper Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 7d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Caustic (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 63 (14d8) acid damage on a… (Once per encounter.)",
      "Acidward: Immune to Acid damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "7d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-gold-dragon",
    "name": "Ancient Gold Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 7d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Infernal (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 24 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 71 (13d10) fire damage on a failed save, or half as… (Once per encounter.)",
      "Fireward: Immune to Fire damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "7d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-green-dragon",
    "name": "Ancient Green Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 7d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Venom (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Poison Breath: The dragon exhales poisonous gas in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 77 (22d6) poison damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "7d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-red-dragon",
    "name": "Ancient Red Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10 piercing / Claw 6d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Infernal (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Fire Breath: The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Fireward: Immune to Fire damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-silver-dragon",
    "name": "Ancient Silver Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 3d10 piercing / Claw 7d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Tidal (DC19)",
      "native": "Mountains"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Breath Weapons: The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 24 Constitution saving throw, taking 67 (15d8) cold damage on a failed save, or… (Once per encounter.)",
      "Coldward: Immune to Cold damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "7d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ancient-white-dragon",
    "name": "Ancient White Dragon",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Bite 4d10 piercing / Claw 6d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Tidal (DC19)",
      "native": "Frozen Wastes, Mountains"
    },
    "abilities": [
      "Ice Walk: The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its… (Once per encounter.)",
      "Cold Breath: The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 72 (16d8) cold damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Coldward: Immune to Cold damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "6d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "androsphinx",
    "name": "Androsphinx",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 60",
      "damage": "Claw 7d10+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound (DC19)",
      "native": "Wilderness"
    },
    "abilities": [
      "Inscrutable: The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.",
      "Magic Weapons: The sphinx's weapon attacks are magical.",
      "Spellcasting: The sphinx is a 12th-level spellcaster. (Innate magic — see notes.)",
      "Psychicward: Immune to Psychic damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Steadfast Form: Cannot be charmed, frightened.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "7d10+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "animated-armor",
    "name": "Animated Armor",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 3,
      "speed": "25",
      "damage": "Slam 2d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Antimagic Susceptibility: The armor is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the armor must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.",
      "False Appearance: While the armor remains motionless, it is indistinguishable from a normal suit of armor.",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Psychicward: Immune to Psychic damage",
      "Steadfast Form: Cannot be blinded, charmed, deafened, frightened, paralyzed, petrified."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "ankheg",
    "name": "Ankheg",
    "category": "creature",
    "stats": {
      "hp": 21,
      "dr": 2,
      "speed": "30 / burrow 10",
      "damage": "Bite 2d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Acid Spray: The ankheg spits acid in a line that is 30 ft. long and 5 ft. wide, provided that it has no creature grappled. Each creature in that line must make a DC 13 Dexterity saving throw, taking 10 (3d6) acid damage on a failed save, or half as… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ape",
    "name": "Ape",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / climb 30",
      "damage": "Fist 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Fist",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "archmage",
    "name": "Archmage",
    "category": "creature",
    "stats": {
      "hp": 54,
      "dr": 6,
      "speed": "30",
      "damage": "Dagger 13d4+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Humanoid",
      "soulCore": "Shadow (DC18)",
      "native": "Settlements"
    },
    "abilities": [
      "Magic Resistance: The archmage has advantage on saving throws against spells and other magical effects.",
      "Spellcasting: The archmage is an 18th-level spellcaster. (Innate magic — see notes.)",
      "Damage from spells-Hardened: Takes half damage from Damage from spells attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Dagger",
        "diceExpr": "13d4+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "assassin",
    "name": "Assassin",
    "category": "creature",
    "stats": {
      "hp": 43,
      "dr": 5,
      "speed": "30",
      "damage": "Shortsword 8d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Assassinate: During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.",
      "Evasion: If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.",
      "Sneak Attack (1/Turn): The assassin deals an extra 13 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the assassin that isn't incapacitated and the assassin doesn't have disadvantage on the attack roll.",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "8d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "awakened-shrub",
    "name": "Awakened Shrub",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20",
      "damage": "Rake 1d4+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Plant",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "False Appearance: While the shrub remains motionless, it is indistinguishable from a normal shrub.",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Tinder-Dry: Takes double damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Rake",
        "diceExpr": "1d4+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "awakened-tree",
    "name": "Awakened Tree",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 2,
      "speed": "20",
      "damage": "Slam 2d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Plant",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "False Appearance: While the tree remains motionless, it is indistinguishable from a normal tree.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Tinder-Dry: Takes double damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "axe-beak",
    "name": "Axe Beak",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "50",
      "damage": "Beak 1d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "azer",
    "name": "Azer",
    "category": "creature",
    "stats": {
      "hp": 21,
      "dr": 2,
      "speed": "30",
      "damage": "Warhammer 1d8+4 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Elemental",
      "soulCore": "none",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Heated Body: A creature that touches the azer or hits it with a melee attack while within 5 ft. of it takes 5 (1d10) fire damage.",
      "Heated Weapons: When the azer hits with a metal melee weapon, it deals an extra 3 (1d6) fire damage (included in the attack).",
      "Illumination: The azer sheds bright light in a 10-foot radius and dim light for an additional 10 ft..",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Warhammer",
        "diceExpr": "1d8+4",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "baboon",
    "name": "Baboon",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / climb 30",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Pack Tactics: The baboon has advantage on an attack roll against a creature if at least one of the baboon's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "badger",
    "name": "Badger",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / burrow 5",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The badger has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "balor",
    "name": "Balor",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "40 / fly 80",
      "damage": "Longsword 5d8+1 slashing / Whip 5d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Fiend",
      "soulCore": "Infernal (DC19)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Death Throes: When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much damage on a successful one. The explosion ignites flammable objects in that area that aren't being worn or carried, and…",
      "Fire Aura: At the start of each of the balor's turns, each creature within 5 feet of it takes 10 (3d6) fire damage, and flammable objects in the aura that aren't being worn or carried ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.",
      "Magic Resistance: The balor has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The balor's weapon attacks are magical.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "5d8+1",
        "damageType": "Slashing"
      },
      {
        "name": "Whip",
        "diceExpr": "5d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bandit",
    "name": "Bandit",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Scimitar 1d4 slashing / Light Crossbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      },
      {
        "name": "Light Crossbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bandit-captain",
    "name": "Bandit Captain",
    "category": "creature",
    "stats": {
      "hp": 36,
      "dr": 2,
      "speed": "30",
      "damage": "Scimitar 1d6+1 slashing / Dagger 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Dagger",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "barbed-devil",
    "name": "Barbed Devil",
    "category": "creature",
    "stats": {
      "hp": 61,
      "dr": 4,
      "speed": "30",
      "damage": "Claw 1d6+1 piercing / Tail 1d6+3 piercing / Hurl Flame 1d6+3 fire",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Fiend",
      "soulCore": "Infernal (DC16)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Barbed Hide: At the start of each of its turns, the barbed devil deals 5 (1d10) piercing damage to any creature grappling it.",
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d6+3",
        "damageType": "Piercing"
      },
      {
        "name": "Hurl Flame",
        "diceExpr": "1d6+3",
        "damageType": "Fire"
      }
    ],
    "provisional": true
  },
  {
    "id": "basilisk",
    "name": "Basilisk",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 3,
      "speed": "20",
      "damage": "Bite 4d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Petrifying Gaze: If a creature starts its turn within 30 ft. of the basilisk and the two of them can see each other, the basilisk can force the creature to make a DC 12 Constitution saving throw if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained.…"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bat",
    "name": "Bat",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "5 / fly 30",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Echolocation: The bat can't use its blindsight while deafened.",
      "Keen Hearing: The bat has advantage on Wisdom (Perception) checks that rely on hearing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bearded-devil",
    "name": "Bearded Devil",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 3,
      "speed": "30",
      "damage": "Beard 1d8+1 piercing / Glaive 1d10+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fiend",
      "soulCore": "none",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Steadfast: The devil can't be frightened while it can see an allied creature within 30 feet of it.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Beard",
        "diceExpr": "1d8+1",
        "damageType": "Piercing"
      },
      {
        "name": "Glaive",
        "diceExpr": "1d10+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "behir",
    "name": "Behir",
    "category": "creature",
    "stats": {
      "hp": 92,
      "dr": 6,
      "speed": "50 / climb 40",
      "damage": "Bite 2d10+2 piercing / Constrict 4d10 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound (DC18)",
      "native": "Wilderness"
    },
    "abilities": [
      "Lightning Breath: The behir exhales a line of lightning that is 20 ft. long and 5 ft. wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Lightningward: Immune to Lightning damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Constrict",
        "diceExpr": "4d10",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "berserker",
    "name": "Berserker",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 2,
      "speed": "30",
      "damage": "Greataxe 1d12+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Reckless: At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "1d12+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "black-bear",
    "name": "Black Bear",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40 / climb 30",
      "damage": "Bite 1d4 piercing / Claws 1d4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The bear has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "black-dragon-wyrmling",
    "name": "Black Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Caustic (DC14)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Acid Breath: The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 22 (5d8) acid damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Acidward: Immune to Acid damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "black-pudding",
    "name": "Black Pudding",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 3,
      "speed": "20 / climb 20",
      "damage": "Pseudopod 4d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Ooze",
      "soulCore": "none",
      "native": "Caverns"
    },
    "abilities": [
      "Amorphous: The pudding can move through a space as narrow as 1 inch wide without squeezing.",
      "Corrosive Form: A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its…",
      "Spider Climb: The pudding can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Acidward: Immune to Acid damage",
      "Coldward: Immune to Cold damage",
      "Lightningward: Immune to Lightning damage",
      "Slashingward: Immune to Slashing damage",
      "Steadfast Form: Cannot be blinded, charmed, exhausted, frightened, prone."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "4d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "blink-dog",
    "name": "Blink Dog",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "40",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Fey",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "Keen Hearing and Smell: The dog has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Teleport: The dog magically teleports, along with any equipment it is wearing or carrying, up to 40 ft. to an unoccupied space it can see. Before or after teleporting, the dog can make one bite attack. (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "blood-hawk",
    "name": "Blood Hawk",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / fly 60",
      "damage": "Beak 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight: The hawk has advantage on Wisdom (Perception) checks that rely on sight.",
      "Pack Tactics: The hawk has advantage on an attack roll against a creature if at least one of the hawk's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "blue-dragon-wyrmling",
    "name": "Blue Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 4,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Storm (DC15)",
      "native": "Mountains"
    },
    "abilities": [
      "Lightning Breath: The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Lightningward: Immune to Lightning damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "boar",
    "name": "Boar",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Tusk 1d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the boar moves at least 20 ft. straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 3 (1d6) slashing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.",
      "Relentless: If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
    ],
    "attacks": [
      {
        "name": "Tusk",
        "diceExpr": "1d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bone-devil",
    "name": "Bone Devil",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40 / fly 40",
      "damage": "Claw 1d8+4 slashing / Sting 4d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Fiend",
      "soulCore": "Infernal (DC17)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d8+4",
        "damageType": "Slashing"
      },
      {
        "name": "Sting",
        "diceExpr": "4d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "brass-dragon-wyrmling",
    "name": "Brass Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Infernal (DC14)",
      "native": "Mountains"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 14 (4d6) fire damage on a failed… (Once per encounter.)",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bronze-dragon-wyrmling",
    "name": "Bronze Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Storm (DC14)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d10) lightning… (Once per encounter.)",
      "Lightningward: Immune to Lightning damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "brown-bear",
    "name": "Brown Bear",
    "category": "creature",
    "stats": {
      "hp": 19,
      "dr": 2,
      "speed": "40 / climb 30",
      "damage": "Bite 1d6 piercing / Claws 1d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The bear has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bugbear",
    "name": "Bugbear",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 3,
      "speed": "30",
      "damage": "Morningstar 1d8 piercing / Javelin 1d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Brute: A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack).",
      "Surprise Attack: If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack."
    ],
    "attacks": [
      {
        "name": "Morningstar",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      },
      {
        "name": "Javelin",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "bulette",
    "name": "Bulette",
    "category": "creature",
    "stats": {
      "hp": 52,
      "dr": 4,
      "speed": "40 / burrow 40",
      "damage": "Bite 3d12 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Standing Leap: The bulette's long jump is up to 30 ft. and its high jump is up to 15 ft., with or without a running start."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d12",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "camel",
    "name": "Camel",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "50",
      "damage": "Bite 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "cat",
    "name": "Cat",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40 / climb 30",
      "damage": "Claws 1d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The cat has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "centaur",
    "name": "Centaur",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 2,
      "speed": "50",
      "damage": "Pike 1d4 piercing / Hooves 1d6 bludgeoning / Longbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the centaur moves at least 30 ft. straight toward a target and then hits it with a pike attack on the same turn, the target takes an extra 10 (3d6) piercing damage."
    ],
    "attacks": [
      {
        "name": "Pike",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Hooves",
        "diceExpr": "1d6",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Longbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "chain-devil",
    "name": "Chain Devil",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 5,
      "speed": "30",
      "damage": "Chain 8d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Fiend",
      "soulCore": "Infernal (DC17)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Animate Chains: Up to four chains the devil can see within 60 feet of it magically sprout razor-edged barbs and animate under the devil's control, provided that the chains aren't being worn or carried. Each animated chain is an object with AC 20, 20 hit… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Chain",
        "diceExpr": "8d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "chimera",
    "name": "Chimera",
    "category": "creature",
    "stats": {
      "hp": 63,
      "dr": 4,
      "speed": "30 / fly 60",
      "damage": "Bite 1d6+3 piercing / Horns 1d12 bludgeoning / Claws 1d6+3 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Fire Breath: The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+3",
        "damageType": "Piercing"
      },
      {
        "name": "Horns",
        "diceExpr": "1d12",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+3",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "chuul",
    "name": "Chuul",
    "category": "creature",
    "stats": {
      "hp": 51,
      "dr": 3,
      "speed": "30 / swim 30",
      "damage": "Pincer 4d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Aberration",
      "soulCore": "none",
      "native": "The Underdark"
    },
    "abilities": [
      "Amphibious: The chuul can breathe air and water.",
      "Sense Magic: The chuul senses magic within 120 feet of it at will. This trait otherwise works like the detect magic spell but isn't itself magical.",
      "Tentacles: One creature grappled by the chuul must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns,… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned."
    ],
    "attacks": [
      {
        "name": "Pincer",
        "diceExpr": "4d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "cloaker",
    "name": "Cloaker",
    "category": "creature",
    "stats": {
      "hp": 43,
      "dr": 5,
      "speed": "10 / fly 40",
      "damage": "Bite 4d6+1 piercing / Tail 3d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Aberration",
      "soulCore": "none",
      "native": "The Underdark"
    },
    "abilities": [
      "Damage Transfer: While attached to a creature, the cloaker takes only half the damage dealt to it (rounded down). and that creature takes the other half.",
      "False Appearance: While the cloaker remains motionless without its underside exposed, it is indistinguishable from a dark leather cloak.",
      "Light Sensitivity: While in bright light, the cloaker has disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight.",
      "Moan: Each creature within 60 feet of the cloaker that can hear its moan and that isn't an aberration must succeed on a DC 13 Wisdom saving throw or become frightened until the end of the cloaker's next turn. If a creature's saving throw is… (Once per encounter.)",
      "Phantasms: The cloaker magically creates three illusory duplicates of itself if it isn't in bright light. The duplicates move with it and mimic its actions, shifting position so as to make it impossible to track which cloaker is the real one. If the… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Tail",
        "diceExpr": "3d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "cloud-giant",
    "name": "Cloud Giant",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40",
      "damage": "Morningstar 6d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [
      "Keen Smell: The giant has advantage on Wisdom (Perception) checks that rely on smell.",
      "Innate Spellcasting: The giant's innate spellcasting ability is Charisma. (Innate magic — see notes.)"
    ],
    "attacks": [
      {
        "name": "Morningstar",
        "diceExpr": "6d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "cockatrice",
    "name": "Cockatrice",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / fly 40",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "commoner",
    "name": "Commoner",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Club 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Club",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "constrictor-snake",
    "name": "Constrictor Snake",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / swim 30",
      "damage": "Bite 1d4 piercing / Constrict 1d4 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Constrict",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "copper-dragon-wyrmling",
    "name": "Copper Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Caustic (DC14)",
      "native": "Mountains"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 18 (4d8) acid damage on a failed… (Once per encounter.)",
      "Acidward: Immune to Acid damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "couatl",
    "name": "Couatl",
    "category": "creature",
    "stats": {
      "hp": 53,
      "dr": 4,
      "speed": "30 / fly 90",
      "damage": "Bite 1d6+3 piercing / Constrict 1d6+3 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Celestial",
      "soulCore": "Radiant (DC15)",
      "native": "The Upper Planes"
    },
    "abilities": [
      "Innate Spellcasting: The couatl's spellcasting ability is Charisma (spell save DC 14). (Innate magic — see notes.)",
      "Magic Weapons: The couatl's weapon attacks are magical.",
      "Shielded Mind: The couatl is immune to scrying and to any effect that would sense its emotions, read its thoughts, or detect its location.",
      "Psychicward: Immune to Psychic damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Radiant-Hardened: Takes half damage from Radiant attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+3",
        "damageType": "Piercing"
      },
      {
        "name": "Constrict",
        "diceExpr": "1d6+3",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "crab",
    "name": "Crab",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / swim 20",
      "damage": "Claw 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Amphibious: The crab can breathe air and water."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "crocodile",
    "name": "Crocodile",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / swim 20",
      "damage": "Bite 1d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Hold Breath: The crocodile can hold its breath for 15 minutes."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "cult-fanatic",
    "name": "Cult Fanatic",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Dagger 3d4+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Dark Devotion: The fanatic has advantage on saving throws against being charmed or frightened.",
      "Spellcasting: The fanatic is a 4th-level spellcaster. (Innate magic — see notes.)"
    ],
    "attacks": [
      {
        "name": "Dagger",
        "diceExpr": "3d4+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "cultist",
    "name": "Cultist",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Scimitar 1d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Dark Devotion: The cultist has advantage on saving throws against being charmed or frightened."
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "darkmantle",
    "name": "Darkmantle",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / fly 30",
      "damage": "Crush 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Caverns, Wilderness"
    },
    "abilities": [
      "Echolocation: The darkmantle can't use its blindsight while deafened.",
      "False Appearance: While the darkmantle remains motionless, it is indistinguishable from a cave formation such as a stalactite or stalagmite."
    ],
    "attacks": [
      {
        "name": "Crush",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "death-dog",
    "name": "Death Dog",
    "category": "creature",
    "stats": {
      "hp": 21,
      "dr": 2,
      "speed": "40",
      "damage": "Bite 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Two-Headed: The dog has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, or knocked unconscious."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "deep-gnome-svirfneblin",
    "name": "Deep Gnome (Svirfneblin)",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "20",
      "damage": "War Pick 1d4 piercing / Poisoned Dart 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Stone Camouflage: The gnome has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
      "Gnome Cunning: The gnome has advantage on Intelligence, Wisdom, and Charisma saving throws against magic.",
      "Innate Spellcasting: The gnome's innate spellcasting ability is Intelligence (spell save DC 11). (Innate magic — see notes.)"
    ],
    "attacks": [
      {
        "name": "War Pick",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Poisoned Dart",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "deer",
    "name": "Deer",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "50",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "deva",
    "name": "Deva",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30 / fly 90",
      "damage": "Mace 8d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Celestial",
      "soulCore": "Radiant (DC17)",
      "native": "The Upper Planes"
    },
    "abilities": [
      "Angelic Weapons: The deva's weapon attacks are magical. When the deva hits with any weapon, the weapon deals an extra 4d8 radiant damage (included in the attack).",
      "Innate Spellcasting: The deva's spellcasting ability is Charisma (spell save DC 17). (Innate magic — see notes.)",
      "Magic Resistance: The deva has advantage on saving throws against spells and other magical effects.",
      "Radiant-Hardened: Takes half damage from Radiant attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, exhausted, frightened."
    ],
    "attacks": [
      {
        "name": "Mace",
        "diceExpr": "8d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "dire-wolf",
    "name": "Dire Wolf",
    "category": "creature",
    "stats": {
      "hp": 20,
      "dr": 2,
      "speed": "50",
      "damage": "Bite 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Hearing and Smell: The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "djinni",
    "name": "Djinni",
    "category": "creature",
    "stats": {
      "hp": 89,
      "dr": 6,
      "speed": "30 / fly 90",
      "damage": "Scimitar 10d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Elemental",
      "soulCore": "Storm (DC18)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Elemental Demise: If the djinni dies, its body disintegrates into a warm breeze, leaving behind only equipment the djinni was wearing or carrying.",
      "Innate Spellcasting: The djinni's innate spellcasting ability is Charisma (spell save DC 17, +9 to hit with spell attacks). (Innate magic — see notes.)",
      "Create Whirlwind: A 5-foot-radius, 30-foot-tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. The whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature… (Once per encounter.)",
      "Lightningward: Immune to Lightning damage",
      "Thunderward: Immune to Thunder damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "10d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "doppelganger",
    "name": "Doppelganger",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 3,
      "speed": "30",
      "damage": "Slam 4d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Shapechanger: The doppelganger can use its action to polymorph into a Small or Medium humanoid it has seen, or back into its true form. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Ambusher: In the first round of combat, the doppelganger has advantage on attack rolls against any creature it has surprised.",
      "Surprise Attack: If the doppelganger surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 10 (3d6) damage from the attack.",
      "Steadfast Form: Cannot be charmed."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "4d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "draft-horse",
    "name": "Draft Horse",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Hooves 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "dragon-turtle",
    "name": "Dragon Turtle",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "20 / swim 40",
      "damage": "Bite 2d12+3 piercing / Claw 1d8+4 slashing / Tail 2d12+3 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Dragon",
      "soulCore": "Infernal (DC19)",
      "native": "Coastal Waters, Mountains"
    },
    "abilities": [
      "Amphibious: The dragon turtle can breathe air and water.",
      "Steam Breath: The dragon turtle exhales scalding steam in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 52 (15d6) fire damage on a failed save, or half as much damage on a successful one. Being underwater… (Once per encounter.)",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d12+3",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d8+4",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "2d12+3",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "dretch",
    "name": "Dretch",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20",
      "damage": "Bite 1d4 piercing / Claws 1d4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Fiend",
      "soulCore": "none",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Fetid Cloud: A 10-foot radius of disgusting green gas extends out from the dretch. The gas spreads around corners, and its area is lightly obscured. It lasts for 1 minute or until a strong wind disperses it. Any creature that starts its turn in that… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "drider",
    "name": "Drider",
    "category": "creature",
    "stats": {
      "hp": 68,
      "dr": 4,
      "speed": "30 / climb 30",
      "damage": "Bite 1d10+4 piercing / Longbow 2d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Fey Ancestry: The drider has advantage on saving throws against being charmed, and magic can't put the drider to sleep.",
      "Innate Spellcasting: The drider's innate spellcasting ability is Wisdom (spell save DC 13). (Innate magic — see notes.)",
      "Spider Climb: The drider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Sunlight Sensitivity: While in sunlight, the drider has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Web Walker: The drider ignores movement restrictions caused by webbing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+4",
        "damageType": "Piercing"
      },
      {
        "name": "Longbow",
        "diceExpr": "2d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "drow",
    "name": "Drow",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Shortsword 1d4 piercing / Hand Crossbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Fey Ancestry: The drow has advantage on saving throws against being charmed, and magic can't put the drow to sleep.",
      "Innate Spellcasting: The drow's spellcasting ability is Charisma (spell save DC 11). (Innate magic — see notes.)",
      "Sunlight Sensitivity: While in sunlight, the drow has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Hand Crossbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "druid",
    "name": "Druid",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Spellcasting: The druid is a 4th-level spellcaster. (Innate magic — see notes.)"
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "dryad",
    "name": "Dryad",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Club 3d4+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fey",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "Innate Spellcasting: The dryad's innate spellcasting ability is Charisma (spell save DC 14). (Innate magic — see notes.)",
      "Magic Resistance: The dryad has advantage on saving throws against spells and other magical effects.",
      "Speak with Beasts and Plants: The dryad can communicate with beasts and plants as if they shared a language.",
      "Tree Stride: Once on her turn, the dryad can use 10 ft. of her movement to step magically into one living tree within her reach and emerge from a second living tree within 60 ft. of the first tree, appearing in an unoccupied space within 5 ft. of the second tree. Both trees must be large or bigger.",
      "Fey Charm: The dryad targets one humanoid or beast that she can see within 30 feet of her. If the target can see the dryad, it must succeed on a DC 14 Wisdom saving throw or be magically charmed. The charmed creature regards the dryad as a trusted… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Club",
        "diceExpr": "3d4+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "duergar",
    "name": "Duergar",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 3,
      "speed": "25",
      "damage": "War Pick 1d8 piercing / Javelin 1d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Duergar Resilience: The duergar has advantage on saving throws against poison, spells, and illusions, as well as to resist being charmed or paralyzed.",
      "Sunlight Sensitivity: While in sunlight, the duergar has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Enlarge: For 1 minute, the duergar magically increases in size, along with anything it is wearing or carrying. While enlarged, the duergar is Large, doubles its damage dice on Strength-based weapon attacks (included in the attacks), and makes… (Once per encounter.)",
      "Invisibility: The duergar magically turns invisible until it attacks, casts a spell, or uses its Enlarge, or until its concentration is broken, up to 1 hour (as if concentrating on a spell). Any equipment the duergar wears or carries is invisible with… (Once per encounter.)",
      "Poison-Hardened: Takes half damage from Poison attacks"
    ],
    "attacks": [
      {
        "name": "War Pick",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      },
      {
        "name": "Javelin",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "dust-mephit",
    "name": "Dust Mephit",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / fly 30",
      "damage": "Claws 1d4+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Elemental",
      "soulCore": "none",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Death Burst: When the mephit dies, it explodes in a burst of dust. Each creature within 5 ft. of it must then succeed on a DC 10 Constitution saving throw or be blinded for 1 minute. A blinded creature can repeat the saving throw on each of its turns, ending the effect on itself on a success.",
      "Innate Spellcasting: The mephit can innately cast sleep, requiring no material components. (Innate magic — see notes.)",
      "Blinding Breath: The mephit exhales a 15-foot cone of blinding dust. Each creature in that area must succeed on a DC 10 Dexterity saving throw or be blinded for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Tinder-Dry: Takes double damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "eagle",
    "name": "Eagle",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / fly 60",
      "damage": "Talons 1d4+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight: The eagle has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Talons",
        "diceExpr": "1d4+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "earth-elemental",
    "name": "Earth Elemental",
    "category": "creature",
    "stats": {
      "hp": 69,
      "dr": 4,
      "speed": "30 / burrow 30",
      "damage": "Slam 4d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Elemental",
      "soulCore": "Earthen (DC16)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Earth Glide: The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through.",
      "Siege Monster: The elemental deals double damage to objects and structures.",
      "Hardened Vitality: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Thunder Frailty: Takes double damage from Thunder attacks",
      "Steadfast Form: Cannot be paralyzed, petrified, unconscious."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "efreeti",
    "name": "Efreeti",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / fly 60",
      "damage": "Scimitar 5d6 slashing / Hurl Flame 4d6+2 fire",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Elemental",
      "soulCore": "Infernal (DC18)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Elemental Demise: If the efreeti dies, its body disintegrates in a flash of fire and puff of smoke, leaving behind only equipment the djinni was wearing or carrying.",
      "Innate Spellcasting: The efreeti's innate spell casting ability is Charisma (spell save DC 15, +7 to hit with spell attacks). (Innate magic — see notes.)",
      "Fireward: Immune to Fire damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "5d6",
        "damageType": "Slashing"
      },
      {
        "name": "Hurl Flame",
        "diceExpr": "4d6+2",
        "damageType": "Fire"
      }
    ],
    "provisional": true
  },
  {
    "id": "elephant",
    "name": "Elephant",
    "category": "creature",
    "stats": {
      "hp": 42,
      "dr": 3,
      "speed": "40",
      "damage": "Gore 1d8+2 piercing / Stomp 1d10+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Trampling Charge: If the elephant moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the elephant can make one stomp attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "1d8+2",
        "damageType": "Piercing"
      },
      {
        "name": "Stomp",
        "diceExpr": "1d10+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "elk",
    "name": "Elk",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "50",
      "damage": "Ram 1d4 bludgeoning / Hooves 1d4 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the elk moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Hooves",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "erinyes",
    "name": "Erinyes",
    "category": "creature",
    "stats": {
      "hp": 84,
      "dr": 6,
      "speed": "30 / fly 60",
      "damage": "Longsword 3d8 poison / Longbow 5d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Fiend",
      "soulCore": "Infernal (DC18)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Hellish Weapons: The erinyes's weapon attacks are magical and deal an extra 13 (3d8) poison damage on a hit (included in the attacks).",
      "Magic Resistance: The erinyes has advantage on saving throws against spells and other magical effects.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "3d8",
        "damageType": "Poison"
      },
      {
        "name": "Longbow",
        "diceExpr": "5d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ettercap",
    "name": "Ettercap",
    "category": "creature",
    "stats": {
      "hp": 24,
      "dr": 2,
      "speed": "30 / climb 30",
      "damage": "Bite 1d8+1 piercing / Claws 1d4+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Spider Climb: The ettercap can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the ettercap knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The ettercap ignores movement restrictions caused by webbing.",
      "Web: Ranged Weapon Attack: +4 to hit, range 30/60 ft., one Large or smaller creature. Hit: The creature is restrained by webbing. As an action, the restrained creature can make a DC 11 Strength check, escaping from the webbing on a success. The… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d4+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ettin",
    "name": "Ettin",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 3,
      "speed": "40",
      "damage": "Battleaxe 1d8+2 slashing / Morningstar 1d8+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [
      "Two Heads: The ettin has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious.",
      "Wakeful: When one of the ettin's heads is asleep, its other head is awake."
    ],
    "attacks": [
      {
        "name": "Battleaxe",
        "diceExpr": "1d8+2",
        "damageType": "Slashing"
      },
      {
        "name": "Morningstar",
        "diceExpr": "1d8+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "fire-elemental",
    "name": "Fire Elemental",
    "category": "creature",
    "stats": {
      "hp": 56,
      "dr": 4,
      "speed": "50",
      "damage": "Touch 5d6+2 fire",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Elemental",
      "soulCore": "Infernal (DC16)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Fire Form: The elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 5 ft. of it takes 5 (1d10) fire damage. In addition, the elemental can enter a hostile creature's space and stop there. The first time…",
      "Illumination: The elemental sheds bright light in a 30-foot radius and dim light in an additional 30 ft..",
      "Water Susceptibility: For every 5 ft. the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage.",
      "Hardened Vitality: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Fireward: Immune to Fire damage",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be grappled, paralyzed, petrified, prone, restrained, unconscious."
    ],
    "attacks": [
      {
        "name": "Touch",
        "diceExpr": "5d6+2",
        "damageType": "Fire"
      }
    ],
    "provisional": true
  },
  {
    "id": "fire-giant",
    "name": "Fire Giant",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30",
      "damage": "Greatsword 8d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "8d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "flying-snake",
    "name": "Flying Snake",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / fly 60",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Flyby: The snake doesn't provoke opportunity attacks when it flies out of an enemy's reach."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "flying-sword",
    "name": "Flying Sword",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "0 / hover 50",
      "damage": "Longsword 1d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Antimagic Susceptibility: The sword is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the sword must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.",
      "False Appearance: While the sword remains motionless and isn't flying, it is indistinguishable from a normal sword.",
      "Lifeless Frame: Immune to Poison damage; cannot be poisoned.",
      "Psychicward: Immune to Psychic damage",
      "Steadfast Form: Cannot be blinded, charmed, frightened, paralyzed, petrified."
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "1d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "frog",
    "name": "Frog",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / swim 20",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Non-combatant",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Amphibious: The frog can breathe air and water",
      "Standing Leap: The frog's long jump is up to 10 ft. and its high jump is up to 5 ft., with or without a running start."
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "frost-giant",
    "name": "Frost Giant",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40",
      "damage": "Greataxe 4d12+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [
      "Coldward: Immune to Cold damage"
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "4d12+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "gargoyle",
    "name": "Gargoyle",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 2,
      "speed": "30 / fly 60",
      "damage": "Bite 1d6+1 piercing / Claws 1d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Elemental",
      "soulCore": "none",
      "native": "Elemental Planes"
    },
    "abilities": [
      "False Appearance: While the gargoyle remains motion less, it is indistinguishable from an inanimate statue.",
      "Hardened Vitality: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be petrified."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "gelatinous-cube",
    "name": "Gelatinous Cube",
    "category": "creature",
    "stats": {
      "hp": 46,
      "dr": 2,
      "speed": "15",
      "damage": "Pseudopod 2d6+2 acid",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Ooze",
      "soulCore": "none",
      "native": "Caverns"
    },
    "abilities": [
      "Ooze Cube: The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on the saving throw. Creatures inside the cube can be seen but have total cover. A creature within 5 feet of the cube can take an action to…",
      "Transparent: Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot a cube that has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of the cube is surprised by the cube.",
      "Engulf: The cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 Dexterity saving throw. On a successful save, the creature can… (Once per encounter.)",
      "Steadfast Form: Cannot be blinded, charmed, deafened, exhausted, frightened, prone."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "2d6+2",
        "damageType": "Acid"
      }
    ],
    "provisional": true
  },
  {
    "id": "ghast",
    "name": "Ghast",
    "category": "creature",
    "stats": {
      "hp": 20,
      "dr": 2,
      "speed": "30",
      "damage": "Bite 1d8 piercing / Claws 1d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Stench: Any creature that starts its turn within 5 ft. of the ghast must succeed on a DC 10 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the ghast's Stench for 24 hours.",
      "Turn Defiance: The ghast and any ghouls within 30 ft. of it have advantage on saving throws against effects that turn undead.",
      "Undying Husk: Immune to Poison damage; cannot be poisoned or exhausted.",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Steadfast Form: Cannot be charmed."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ghoul",
    "name": "Ghoul",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Bite 1d6+1 piercing / Claws 1d4+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Undying Husk: Immune to Poison damage; cannot be poisoned or exhausted.",
      "Steadfast Form: Cannot be charmed."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d4+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-ape",
    "name": "Giant Ape",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "40 / climb 40",
      "damage": "Fist 3d10+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Fist",
        "diceExpr": "3d10+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-badger",
    "name": "Giant Badger",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / burrow 10",
      "damage": "Bite 1d4 piercing / Claws 1d4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The badger has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-bat",
    "name": "Giant Bat",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 60",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Echolocation: The bat can't use its blindsight while deafened.",
      "Keen Hearing: The bat has advantage on Wisdom (Perception) checks that rely on hearing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-boar",
    "name": "Giant Boar",
    "category": "creature",
    "stats": {
      "hp": 23,
      "dr": 2,
      "speed": "40",
      "damage": "Tusk 2d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the boar moves at least 20 ft. straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
      "Relentless: If the boar takes 10 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
    ],
    "attacks": [
      {
        "name": "Tusk",
        "diceExpr": "2d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-centipede",
    "name": "Giant Centipede",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / climb 30",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-constrictor-snake",
    "name": "Giant Constrictor Snake",
    "category": "creature",
    "stats": {
      "hp": 33,
      "dr": 2,
      "speed": "30 / swim 30",
      "damage": "Bite 1d6 piercing / Constrict 1d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Constrict",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-crab",
    "name": "Giant Crab",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / swim 30",
      "damage": "Claw 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Amphibious: The crab can breathe air and water."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-crocodile",
    "name": "Giant Crocodile",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 4,
      "speed": "30 / swim 50",
      "damage": "Bite 2d10+1 piercing / Tail 1d8+4 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Hold Breath: The crocodile can hold its breath for 30 minutes."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+1",
        "damageType": "Piercing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8+4",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-eagle",
    "name": "Giant Eagle",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 80",
      "damage": "Beak 1d6 piercing / Talons 1d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight: The eagle has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Talons",
        "diceExpr": "1d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-elk",
    "name": "Giant Elk",
    "category": "creature",
    "stats": {
      "hp": 23,
      "dr": 2,
      "speed": "60",
      "damage": "Ram 1d4 bludgeoning / Hooves 1d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the elk moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Hooves",
        "diceExpr": "1d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-fire-beetle",
    "name": "Giant Fire Beetle",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Bite 1d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Illumination: The beetle sheds bright light in a 10-foot radius and dim light for an additional 10 ft.."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-frog",
    "name": "Giant Frog",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / swim 30",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Amphibious: The frog can breathe air and water",
      "Standing Leap: The frog's long jump is up to 20 ft. and its high jump is up to 10 ft., with or without a running start."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-goat",
    "name": "Giant Goat",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Ram 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the goat moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 5 (2d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
      "Sure-Footed: The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-hyena",
    "name": "Giant Hyena",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 2,
      "speed": "50",
      "damage": "Bite 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Rampage: When the hyena reduces a creature to 0 hit points with a melee attack on its turn, the hyena can take a bonus action to move up to half its speed and make a bite attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-lizard",
    "name": "Giant Lizard",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / climb 30",
      "damage": "Bite 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-octopus",
    "name": "Giant Octopus",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 2,
      "speed": "10 / swim 60",
      "damage": "Tentacles 2d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Hold Breath: While out of water, the octopus can hold its breath for 1 hour.",
      "Underwater Camouflage: The octopus has advantage on Dexterity (Stealth) checks made while underwater.",
      "Water Breathing: The octopus can breathe only underwater.",
      "Ink Cloud: A 20-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Tentacles",
        "diceExpr": "2d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-owl",
    "name": "Giant Owl",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "5 / fly 60",
      "damage": "Talons 1d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Flyby: The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
      "Keen Hearing and Sight: The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
    ],
    "attacks": [
      {
        "name": "Talons",
        "diceExpr": "1d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-poisonous-snake",
    "name": "Giant Poisonous Snake",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / swim 30",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-rat",
    "name": "Giant Rat",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The rat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pack Tactics: The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-rat-diseased",
    "name": "Giant Rat (Diseased)",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The rat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pack Tactics: The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-scorpion",
    "name": "Giant Scorpion",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 3,
      "speed": "40",
      "damage": "Claw 1d8+4 bludgeoning / Sting 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d8+4",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Sting",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-sea-horse",
    "name": "Giant Sea Horse",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "0 / swim 40",
      "damage": "Ram 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Charge: If the sea horse moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) bludgeoning damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.",
      "Water Breathing: The sea horse can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-shark",
    "name": "Giant Shark",
    "category": "creature",
    "stats": {
      "hp": 69,
      "dr": 4,
      "speed": "0 / swim 50",
      "damage": "Bite 3d10+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Blood Frenzy: The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Water Breathing: The shark can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-spider",
    "name": "Giant Spider",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / climb 30",
      "damage": "Bite 1d8+4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Spider Climb: The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The spider ignores movement restrictions caused by webbing.",
      "Web: Ranged Weapon Attack: +5 to hit, range 30/60 ft., one creature. Hit: The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can also be… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-toad",
    "name": "Giant Toad",
    "category": "creature",
    "stats": {
      "hp": 21,
      "dr": 2,
      "speed": "20 / swim 40",
      "damage": "Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Amphibious: The toad can breathe air and water",
      "Standing Leap: The toad's long jump is up to 20 ft. and its high jump is up to 10 ft., with or without a running start."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-vulture",
    "name": "Giant Vulture",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 60",
      "damage": "Beak 1d4+1 piercing / Talons 1d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight and Smell: The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell.",
      "Pack Tactics: The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d4+1",
        "damageType": "Piercing"
      },
      {
        "name": "Talons",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-wasp",
    "name": "Giant Wasp",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / fly 50",
      "damage": "Sting 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Sting",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-weasel",
    "name": "Giant Weasel",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "40",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Hearing and Smell: The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "giant-wolf-spider",
    "name": "Giant Wolf Spider",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "40 / climb 40",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Spider Climb: The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The spider ignores movement restrictions caused by webbing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "gibbering-mouther",
    "name": "Gibbering Mouther",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 2,
      "speed": "10 / swim 10",
      "damage": "Bites 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Aberration",
      "soulCore": "none",
      "native": "The Underdark"
    },
    "abilities": [
      "Aberrant Ground: The ground in a 10-foot radius around the mouther is doughlike difficult terrain. Each creature that starts its turn in that area must succeed on a DC 10 Strength saving throw or have its speed reduced to 0 until the start of its next turn.",
      "Gibbering: The mouther babbles incoherently while it can see any creature and isn't incapacitated. Each creature that starts its turn within 20 feet of the mouther and can hear the gibbering must succeed on a DC 10 Wisdom saving throw. On a failure, the creature can't take reactions until the start of its…",
      "Blinding Spittle: The mouther spits a chemical glob at a point it can see within 15 feet of it. The glob explodes in a blinding flash of light on impact. Each creature within 5 feet of the flash must succeed on a DC 13 Dexterity saving throw or be blinded… (Once per encounter.)",
      "Steadfast Form: Cannot be prone."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "glabrezu",
    "name": "Glabrezu",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40",
      "damage": "Pincer 3d10+2 bludgeoning / Fist 3d4+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Fiend",
      "soulCore": "Infernal (DC17)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Innate Spellcasting: The glabrezu's spellcasting ability is Intelligence (spell save DC 16). (Innate magic — see notes.)",
      "Magic Resistance: The glabrezu has advantage on saving throws against spells and other magical effects.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Pincer",
        "diceExpr": "3d10+2",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Fist",
        "diceExpr": "3d4+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "gladiator",
    "name": "Gladiator",
    "category": "creature",
    "stats": {
      "hp": 62,
      "dr": 4,
      "speed": "30",
      "damage": "Shield Bash 8d4 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Brave: The gladiator has advantage on saving throws against being frightened.",
      "Brute: A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack)."
    ],
    "attacks": [
      {
        "name": "Shield Bash",
        "diceExpr": "8d4",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "gnoll",
    "name": "Gnoll",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Bite 1d4 piercing / Longbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Rampage: When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a bonus action to move up to half its speed and make a bite attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Longbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "goat",
    "name": "Goat",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Ram 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the goat moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 2 (1d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 10 Strength saving throw or be knocked prone.",
      "Sure-Footed: The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "goblin",
    "name": "Goblin",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Scimitar 1d4 slashing / Shortbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Nimble Escape: The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      },
      {
        "name": "Shortbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "goblin-warrior",
    "name": "Goblin Warrior",
    "category": "creature",
    "stats": {
      "hp": 5,
      "dr": 5,
      "speed": "30",
      "damage": "Short Sword 1d6+1 slashing / Shortbow 1d6 piercing (Range 80/320)",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Caves, Ruins"
    },
    "abilities": [
      "Nimble Escape: Can disengage or hide as a bonus action"
    ],
    "attacks": [
      {
        "name": "Short Sword",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      },
      {
        "name": "Shortbow",
        "diceExpr": "1d6",
        "damageType": "Piercing",
        "note": "Range 80/320"
      }
    ],
    "provisional": true
  },
  {
    "id": "gold-dragon-wyrmling",
    "name": "Gold Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 33,
      "dr": 4,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Infernal (DC15)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 22 (4d10) fire damage on a failed save, or half as… (Once per encounter.)",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "gorgon",
    "name": "Gorgon",
    "category": "creature",
    "stats": {
      "hp": 63,
      "dr": 4,
      "speed": "40",
      "damage": "Gore 2d12 piercing / Hooves 2d10 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Trampling Charge: If the gorgon moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 16 Strength saving throw or be knocked prone. If the target is prone, the gorgon can make one attack with its hooves against it as a bonus action.",
      "Petrifying Breath: The gorgon exhales petrifying gas in a 30-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw. On a failed save, a target begins to turn to stone and is restrained. The restrained target must repeat the… (Once per encounter.)",
      "Steadfast Form: Cannot be petrified."
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "2d12",
        "damageType": "Piercing"
      },
      {
        "name": "Hooves",
        "diceExpr": "2d10",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "gray-ooze",
    "name": "Gray Ooze",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / climb 10",
      "damage": "Pseudopod 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Ooze",
      "soulCore": "none",
      "native": "Caverns"
    },
    "abilities": [
      "Amorphous: The ooze can move through a space as narrow as 1 inch wide without squeezing.",
      "Corrode Metal: Any nonmagical weapon made of metal that hits the ooze corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the ooze is destroyed after dealing…",
      "False Appearance: While the ooze remains motionless, it is indistinguishable from an oily pool or wet rock.",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Steadfast Form: Cannot be blinded, charmed, deafened, exhausted, frightened, prone."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "green-dragon-wyrmling",
    "name": "Green Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 21,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Venom (DC14)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Poison Breath: The dragon exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 11 Constitution saving throw, taking 21 (6d6) poison damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "green-hag",
    "name": "Green Hag",
    "category": "creature",
    "stats": {
      "hp": 45,
      "dr": 4,
      "speed": "30",
      "damage": "Claws 3d8 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fey",
      "soulCore": "Naturebound (DC15)",
      "native": "Forests"
    },
    "abilities": [
      "Amphibious: The hag can breathe air and water.",
      "Innate Spellcasting: The hag's innate spellcasting ability is Charisma (spell save DC 12). (Innate magic — see notes.)",
      "Mimicry: The hag can mimic animal sounds and humanoid voices. A creature that hears the sounds can tell they are imitations with a successful DC 14 Wisdom (Insight) check."
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "3d8",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "grick",
    "name": "Grick",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / climb 30",
      "damage": "Tentacles 1d6+3 slashing / Beak 1d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Stone Camouflage: The grick has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Tentacles",
        "diceExpr": "1d6+3",
        "damageType": "Slashing"
      },
      {
        "name": "Beak",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "griffon",
    "name": "Griffon",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 2,
      "speed": "30 / fly 80",
      "damage": "Beak 1d6 piercing / Claws 1d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight: The griffon has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "grimlock",
    "name": "Grimlock",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Spiked Bone Club 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Blind Senses: The grimlock can't use its blindsight while deafened and unable to smell.",
      "Keen Hearing and Smell: The grimlock has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Stone Camouflage: The grimlock has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
      "Steadfast Form: Cannot be blinded."
    ],
    "attacks": [
      {
        "name": "Spiked Bone Club",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "guard",
    "name": "Guard",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "guardian-naga",
    "name": "Guardian Naga",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40",
      "damage": "Bite 6d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Rejuvenation: If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.",
      "Spellcasting: The naga is an 11th-level spellcaster. (Innate magic — see notes.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Steadfast Form: Cannot be charmed."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "6d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "gynosphinx",
    "name": "Gynosphinx",
    "category": "creature",
    "stats": {
      "hp": 75,
      "dr": 6,
      "speed": "40 / fly 60",
      "damage": "Claw 7d8+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound (DC18)",
      "native": "Wilderness"
    },
    "abilities": [
      "Inscrutable: The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.",
      "Magic Weapons: The sphinx's weapon attacks are magical.",
      "Spellcasting: The sphinx is a 9th-level spellcaster. (Innate magic — see notes.)",
      "Psychicward: Immune to Psychic damage",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "7d8+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "half-red-dragon-veteran",
    "name": "Half-Red Dragon Veteran",
    "category": "creature",
    "stats": {
      "hp": 36,
      "dr": 4,
      "speed": "30",
      "damage": "Shortsword 5d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Fire Breath: The veteran exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Fire-Hardened: Takes half damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "5d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "harpy",
    "name": "Harpy",
    "category": "creature",
    "stats": {
      "hp": 21,
      "dr": 2,
      "speed": "20 / fly 40",
      "damage": "Claws 1d4+2 slashing / Club 1d4+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4+2",
        "damageType": "Slashing"
      },
      {
        "name": "Club",
        "diceExpr": "1d4+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "hawk",
    "name": "Hawk",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 60",
      "damage": "Talons 1d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight: The hawk has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Talons",
        "diceExpr": "1d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "hell-hound",
    "name": "Hell Hound",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 3,
      "speed": "50",
      "damage": "Bite 3d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fiend",
      "soulCore": "none",
      "native": "The Nine Hells, The Lower Planes"
    },
    "abilities": [
      "Keen Hearing and Smell: The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The hound has advantage on an attack roll against a creature if at least one of the hound's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Fire Breath: The hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 21 (6d6) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "hezrou",
    "name": "Hezrou",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30",
      "damage": "Bite 2d10 piercing / Claws 5d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Fiend",
      "soulCore": "Infernal (DC17)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Magic Resistance: The hezrou has advantage on saving throws against spells and other magical effects.",
      "Stench: Any creature that starts its turn within 10 feet of the hezrou must succeed on a DC 14 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the hezrou's stench for 24 hours.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "5d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "hill-giant",
    "name": "Hill Giant",
    "category": "creature",
    "stats": {
      "hp": 58,
      "dr": 4,
      "speed": "40",
      "damage": "Greatclub 4d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Greatclub",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "hippogriff",
    "name": "Hippogriff",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "40 / fly 60",
      "damage": "Beak 1d6 piercing / Claws 1d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight: The hippogriff has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "hobgoblin",
    "name": "Hobgoblin",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Longbow 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Martial Advantage: Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 ft. of an ally of the hobgoblin that isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Longbow",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "homunculus",
    "name": "Homunculus",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "20 / fly 40",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Telepathic Bond: While the homunculus is on the same plane of existence as its master, it can magically convey what it senses to its master, and the two can communicate telepathically.",
      "Lifeless Frame: Immune to Poison damage; cannot be poisoned.",
      "Steadfast Form: Cannot be charmed."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "horned-devil",
    "name": "Horned Devil",
    "category": "creature",
    "stats": {
      "hp": 98,
      "dr": 6,
      "speed": "20 / fly 60",
      "damage": "Fork 3d8 piercing / Tail 1d8+4 piercing / Hurl Flame 3d6+1 fire",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Fiend",
      "soulCore": "Infernal (DC18)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Fork",
        "diceExpr": "3d8",
        "damageType": "Piercing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d8+4",
        "damageType": "Piercing"
      },
      {
        "name": "Hurl Flame",
        "diceExpr": "3d6+1",
        "damageType": "Fire"
      }
    ],
    "provisional": true
  },
  {
    "id": "hunter-shark",
    "name": "Hunter Shark",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 2,
      "speed": "0 / swim 40",
      "damage": "Bite 1d8+4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Blood Frenzy: The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Water Breathing: The shark can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "hyena",
    "name": "Hyena",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "50",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Pack Tactics: The hyena has advantage on an attack roll against a creature if at least one of the hyena's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ice-devil",
    "name": "Ice Devil",
    "category": "creature",
    "stats": {
      "hp": 99,
      "dr": 6,
      "speed": "40",
      "damage": "Bite 3d6+1 piercing / Claws 1d10+4 slashing / Tail 3d6+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Fiend",
      "soulCore": "Infernal (DC18)",
      "native": "Frozen Wastes, The Lower Planes"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d10+4",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "3d6+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "ice-mephit",
    "name": "Ice Mephit",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / fly 30",
      "damage": "Claws 1d4+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Elemental",
      "soulCore": "none",
      "native": "Frozen Wastes, Elemental Planes"
    },
    "abilities": [
      "Death Burst: When the mephit dies, it explodes in a burst of jagged ice. Each creature within 5 ft. of it must make a DC 10 Dexterity saving throw, taking 4 (1d8) slashing damage on a failed save, or half as much damage on a successful one.",
      "False Appearance: While the mephit remains motionless, it is indistinguishable from an ordinary shard of ice.",
      "Innate Spellcasting: The mephit can innately cast fog cloud, requiring no material components. (Innate magic — see notes.)",
      "Frost Breath: The mephit exhales a 15-foot cone of cold air. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 5 (2d4) cold damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Coldward: Immune to Cold damage",
      "Brittle Frame: Takes double damage from Bludgeoning attacks",
      "Tinder-Dry: Takes double damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "imp",
    "name": "Imp",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "20 / fly 40",
      "damage": "Sting (Bite in Beast Form) 3d4+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fiend",
      "soulCore": "none",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Shapechanger: The imp can use its action to polymorph into a beast form that resembles a rat (speed 20 ft.), a raven (20 ft., fly 60 ft.), or a spider (20 ft., climb 20 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or…",
      "Devil's Sight: Magical darkness doesn't impede the imp's darkvision.",
      "Magic Resistance: The imp has advantage on saving throws against spells and other magical effects.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Sting (Bite in Beast Form)",
        "diceExpr": "3d4+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "invisible-stalker",
    "name": "Invisible Stalker",
    "category": "creature",
    "stats": {
      "hp": 57,
      "dr": 4,
      "speed": "50 / hover 50",
      "damage": "Slam 5d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Elemental",
      "soulCore": "Venom (DC16)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Invisibility: The stalker is invisible.",
      "Faultless Tracker: The stalker is given a quarry by its summoner. The stalker knows the direction and distance to its quarry as long as the two of them are on the same plane of existence. The stalker also knows the location of its summoner.",
      "Hardened Vitality: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be grappled, paralyzed, petrified, prone, restrained, unconscious."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "5d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "jackal",
    "name": "Jackal",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Hearing and Smell: The jackal has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The jackal has advantage on an attack roll against a creature if at least one of the jackal's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "killer-whale",
    "name": "Killer Whale",
    "category": "creature",
    "stats": {
      "hp": 50,
      "dr": 3,
      "speed": "0 / swim 60",
      "damage": "Bite 4d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Echolocation: The whale can't use its blindsight while deafened.",
      "Hold Breath: The whale can hold its breath for 30 minutes",
      "Keen Hearing: The whale has advantage on Wisdom (Perception) checks that rely on hearing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "knight",
    "name": "Knight",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 4,
      "speed": "30",
      "damage": "Greatsword 4d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Brave: The knight has advantage on saving throws against being frightened.",
      "Leadership: For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 ft. of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "4d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "kobold",
    "name": "Kobold",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Dagger 1d4 piercing / Sling 1d4 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Sunlight Sensitivity: While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Pack Tactics: The kobold has advantage on an attack roll against a creature if at least one of the kobold's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Dagger",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Sling",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "kraken",
    "name": "Kraken",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "20 / swim 60",
      "damage": "Bite 5d8 piercing / Tentacle 5d6+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound (DC19)",
      "native": "Wilderness"
    },
    "abilities": [
      "Amphibious: The kraken can breathe air and water.",
      "Freedom of Movement: The kraken ignores difficult terrain, and magical effects can't reduce its speed or cause it to be restrained. It can spend 5 feet of movement to escape from nonmagical restraints or being grappled.",
      "Siege Monster: The kraken deals double damage to objects and structures.",
      "Lightning Storm: The kraken magically creates three bolts of lightning, each of which can strike a target the kraken can see within 120 feet of it. A target must make a DC 23 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or… (Once per encounter.)",
      "Lightningward: Immune to Lightning damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Steadfast Form: Cannot be frightened, paralyzed.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "5d8",
        "damageType": "Piercing"
      },
      {
        "name": "Tentacle",
        "diceExpr": "5d6+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "lamia",
    "name": "Lamia",
    "category": "creature",
    "stats": {
      "hp": 53,
      "dr": 3,
      "speed": "30",
      "damage": "Claws 2d10 slashing / Dagger 1d4+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Innate Spellcasting: The lamia's innate spellcasting ability is Charisma (spell save DC 13). (Innate magic — see notes.)"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d10",
        "damageType": "Slashing"
      },
      {
        "name": "Dagger",
        "diceExpr": "1d4+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "lemure",
    "name": "Lemure",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "15",
      "damage": "Fist 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Fiend",
      "soulCore": "none",
      "native": "The Nine Hells, The Lower Planes"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the lemure's darkvision.",
      "Hellish Rejuvenation: A lemure that dies in the Nine Hells comes back to life with all its hit points in 1d10 days unless it is killed by a good-aligned creature with a bless spell cast on that creature or its remains are sprinkled with holy water.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Steadfast Form: Cannot be charmed, frightened."
    ],
    "attacks": [
      {
        "name": "Fist",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "lich",
    "name": "Lich",
    "category": "creature",
    "stats": {
      "hp": 74,
      "dr": 7,
      "speed": "30",
      "damage": "Paralyzing Touch 12d6 cold",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Undead",
      "soulCore": "Shadow (DC19)",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Legendary Resistance: If the lich fails a saving throw, it can choose to succeed instead.",
      "Rejuvenation: If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery.",
      "Spellcasting: The lich is an 18th-level spellcaster. (Innate magic — see notes.)",
      "Turn Resistance: The lich has advantage on saving throws against any effect that turns undead.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Paralyzing Touch",
        "diceExpr": "12d6",
        "damageType": "Cold"
      }
    ],
    "provisional": true
  },
  {
    "id": "lion",
    "name": "Lion",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "50",
      "damage": "Bite 1d8 piercing / Claw 1d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The lion has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pack Tactics: The lion has advantage on an attack roll against a creature if at least one of the lion's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Pounce: If the lion moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the lion can make one bite attack against it as a bonus action.",
      "Running Leap: With a 10-foot running start, the lion can long jump up to 25 ft.."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "lizard",
    "name": "Lizard",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / climb 20",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "lizardfolk",
    "name": "Lizardfolk",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / swim 30",
      "damage": "Bite 1d4 piercing / Heavy Club 1d4 bludgeoning / Javelin 1d4 piercing / Spiked Shield 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Hold Breath: The lizardfolk can hold its breath for 15 minutes."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Heavy Club",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Javelin",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Spiked Shield",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "mage",
    "name": "Mage",
    "category": "creature",
    "stats": {
      "hp": 22,
      "dr": 4,
      "speed": "30",
      "damage": "Dagger 8d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Frozen Wastes, Settlements"
    },
    "abilities": [
      "Spellcasting: The mage is a 9th-level spellcaster. (Innate magic — see notes.)"
    ],
    "attacks": [
      {
        "name": "Dagger",
        "diceExpr": "8d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "magma-mephit",
    "name": "Magma Mephit",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / fly 30",
      "damage": "Claws 1d4+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Elemental",
      "soulCore": "none",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Death Burst: When the mephit dies, it explodes in a burst of lava. Each creature within 5 ft. of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one.",
      "False Appearance: While the mephit remains motionless, it is indistinguishable from an ordinary mound of magma.",
      "Innate Spellcasting: The mephit can innately cast heat metal (spell save DC 10), requiring no material components. (Innate magic — see notes.)",
      "Fire Breath: The mephit exhales a 15-foot cone of fire. Each creature in that area must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Frost-Brittle: Takes double damage from Cold attacks"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "magmin",
    "name": "Magmin",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Touch 1d6+2 fire",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Elemental",
      "soulCore": "none",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Death Burst: When the magmin dies, it explodes in a burst of fire and magma. Each creature within 10 ft. of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one. Flammable objects that aren't being worn or carried in that area are…",
      "Ignited Illumination: As a bonus action, the magmin can set itself ablaze or extinguish its flames. While ablaze, the magmin sheds bright light in a 10-foot radius and dim light for an additional 10 ft.",
      "Fireward: Immune to Fire damage",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Touch",
        "diceExpr": "1d6+2",
        "damageType": "Fire"
      }
    ],
    "provisional": true
  },
  {
    "id": "mammoth",
    "name": "Mammoth",
    "category": "creature",
    "stats": {
      "hp": 69,
      "dr": 4,
      "speed": "40",
      "damage": "Gore 1d8+4 piercing / Stomp 2d10 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Trampling Charge: If the mammoth moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 18 Strength saving throw or be knocked prone. If the target is prone, the mammoth can make one stomp attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "1d8+4",
        "damageType": "Piercing"
      },
      {
        "name": "Stomp",
        "diceExpr": "2d10",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "manticore",
    "name": "Manticore",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 3,
      "speed": "30 / fly 50",
      "damage": "Bite 1d8 piercing / Claw 1d6 slashing / Tail Spike 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Tail Spike Regrowth: The manticore has twenty-four tail spikes. Used spikes regrow when the manticore finishes a long rest."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d6",
        "damageType": "Slashing"
      },
      {
        "name": "Tail Spike",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "marilith",
    "name": "Marilith",
    "category": "creature",
    "stats": {
      "hp": 104,
      "dr": 6,
      "speed": "40",
      "damage": "Longsword 6d8+1 slashing / Tail 1d10 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Fiend",
      "soulCore": "Infernal (DC18)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Magic Resistance: The marilith has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The marilith's weapon attacks are magical.",
      "Reactive: The marilith can take one reaction on every turn in combat.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "6d8+1",
        "damageType": "Slashing"
      },
      {
        "name": "Tail",
        "diceExpr": "1d10",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "mastiff",
    "name": "Mastiff",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Hearing and Smell: The mastiff has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "medusa",
    "name": "Medusa",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "30",
      "damage": "Snake Hair 1d10+4 piercing / Shortsword 1d4 piercing / Longbow 1d8+4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Petrifying Gaze: When a creature that can see the medusa's eyes starts its turn within 30 ft. of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn't incapacitated and can see the creature. If the saving throw fails by 5 or more, the creature is instantly petrified.…"
    ],
    "attacks": [
      {
        "name": "Snake Hair",
        "diceExpr": "1d10+4",
        "damageType": "Piercing"
      },
      {
        "name": "Shortsword",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "merfolk",
    "name": "Merfolk",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / swim 40",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Amphibious: The merfolk can breathe air and water."
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "merrow",
    "name": "Merrow",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 2,
      "speed": "10 / swim 40",
      "damage": "Bite 1d4 piercing / Claws 1d4 slashing / Harpoon 1d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Amphibious: The merrow can breathe air and water."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      },
      {
        "name": "Harpoon",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "mimic",
    "name": "Mimic",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 2,
      "speed": "15",
      "damage": "Pseudopod 1d6 bludgeoning / Bite 1d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Shapechanger: The mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn 't transformed. It reverts to its true form if it dies.",
      "Adhesive (Object Form Only): The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled by it (escape DC 13). Ability checks made to escape this grapple have disadvantage.",
      "False Appearance (Object Form Only): While the mimic remains motionless, it is indistinguishable from an ordinary object.",
      "Grappler: The mimic has advantage on attack rolls against any creature grappled by it.",
      "Acidward: Immune to Acid damage",
      "Steadfast Form: Cannot be prone."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "1d6",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Bite",
        "diceExpr": "1d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "minotaur",
    "name": "Minotaur",
    "category": "creature",
    "stats": {
      "hp": 42,
      "dr": 3,
      "speed": "40",
      "damage": "Greataxe 1d12+1 slashing / Gore 1d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the minotaur moves at least 10 ft. straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 ft. away and knocked prone.",
      "Labyrinthine Recall: The minotaur can perfectly recall any path it has traveled.",
      "Reckless: At the start of its turn, the minotaur can gain advantage on all melee weapon attack rolls it makes during that turn, but attack rolls against it have advantage until the start of its next turn."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "1d12+1",
        "damageType": "Slashing"
      },
      {
        "name": "Gore",
        "diceExpr": "1d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "minotaur-skeleton",
    "name": "Minotaur Skeleton",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 2,
      "speed": "40",
      "damage": "Greataxe 1d8 slashing / Gore 1d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Charge: If the skeleton moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Brittle Frame: Takes double damage from Bludgeoning attacks"
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "1d8",
        "damageType": "Slashing"
      },
      {
        "name": "Gore",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "mule",
    "name": "Mule",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Hooves 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Settlements, Wilderness"
    },
    "abilities": [
      "Beast of Burden: The mule is considered to be a Large animal for the purpose of determining its carrying capacity.",
      "Sure-Footed: The mule has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "mummy",
    "name": "Mummy",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 3,
      "speed": "20",
      "damage": "Rotting Fist 4d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Dreadful Glare: The mummy targets one creature it can see within 60 ft. of it. If the target can see the mummy, it must succeed on a DC 11 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target… (Once per encounter.)",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Tinder-Dry: Takes double damage from Fire attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed."
    ],
    "attacks": [
      {
        "name": "Rotting Fist",
        "diceExpr": "4d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "mummy-lord",
    "name": "Mummy Lord",
    "category": "creature",
    "stats": {
      "hp": 53,
      "dr": 6,
      "speed": "20",
      "damage": "Rotting Fist 10d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Undead",
      "soulCore": "Shadow (DC18)",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Magic Resistance: The mummy lord has advantage on saving throws against spells and other magical effects.",
      "Rejuvenation: A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again. The new body appears within 5 feet of the mummy lord's heart.",
      "Spellcasting: The mummy lord is a 10th-level spellcaster. (Innate magic — see notes.)",
      "Dreadful Glare: The mummy lord targets one creature it can see within 60 feet of it. If the target can see the mummy lord, it must succeed on a DC 16 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If… (Once per encounter.)",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Tinder-Dry: Takes double damage from Fire attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Rotting Fist",
        "diceExpr": "10d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "nalfeshnee",
    "name": "Nalfeshnee",
    "category": "creature",
    "stats": {
      "hp": 101,
      "dr": 6,
      "speed": "20 / fly 30",
      "damage": "Bite 3d10+1 piercing / Claw 5d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Fiend",
      "soulCore": "Infernal (DC18)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Magic Resistance: The nalfeshnee has advantage on saving throws against spells and other magical effects.",
      "Horror Nimbus: The nalfeshnee magically emits scintillating, multicolored light. Each creature within 15 feet of the nalfeshnee that can see the light must succeed on a DC 15 Wisdom saving throw or be frightened for 1 minute. A creature can repeat the… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "5d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "night-hag",
    "name": "Night Hag",
    "category": "creature",
    "stats": {
      "hp": 62,
      "dr": 4,
      "speed": "30",
      "damage": "Claws (Hag Form Only) 4d8+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Fiend",
      "soulCore": "Infernal (DC16)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Innate Spellcasting: The hag's innate spellcasting ability is Charisma (spell save DC 14, +6 to hit with spell attacks). (Innate magic — see notes.)",
      "Magic Resistance: The hag has advantage on saving throws against spells and other magical effects.",
      "Night Hag Items: A night hag carries two very rare magic items that she must craft for herself If either object is lost, the night hag will go to great lengths to retrieve it, as creating a new tool takes time and effort. Heartstone: This lustrous black gem allows a night hag to become ethereal while it is in her…",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed."
    ],
    "attacks": [
      {
        "name": "Claws (Hag Form Only)",
        "diceExpr": "4d8+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "nightmare",
    "name": "Nightmare",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 3,
      "speed": "60 / fly 90",
      "damage": "Hooves 3d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fiend",
      "soulCore": "none",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Confer Fire Resistance: The nightmare can grant resistance to fire damage to anyone riding it.",
      "Illumination: The nightmare sheds bright light in a 10-foot radius and dim light for an additional 10 feet.",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "3d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "noble",
    "name": "Noble",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Rapier 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Rapier",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ochre-jelly",
    "name": "Ochre Jelly",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 2,
      "speed": "10 / climb 10",
      "damage": "Pseudopod 2d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Ooze",
      "soulCore": "none",
      "native": "Caverns"
    },
    "abilities": [
      "Amorphous: The jelly can move through a space as narrow as 1 inch wide without squeezing.",
      "Spider Climb: The jelly can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Lightningward: Immune to Lightning damage",
      "Slashingward: Immune to Slashing damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Steadfast Form: Cannot be blinded, charmed, exhausted, frightened, prone."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "2d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "octopus",
    "name": "Octopus",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "5 / swim 30",
      "damage": "Tentacles 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Hold Breath: While out of water, the octopus can hold its breath for 30 minutes.",
      "Underwater Camouflage: The octopus has advantage on Dexterity (Stealth) checks made while underwater.",
      "Water Breathing: The octopus can breathe only underwater.",
      "Ink Cloud: A 5-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Tentacles",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "ogre",
    "name": "Ogre",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 2,
      "speed": "40",
      "damage": "Greatclub 1d8 bludgeoning / Javelin 1d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Greatclub",
        "diceExpr": "1d8",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Javelin",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "ogre-zombie",
    "name": "Ogre Zombie",
    "category": "creature",
    "stats": {
      "hp": 47,
      "dr": 2,
      "speed": "30",
      "damage": "Morningstar 1d8+4 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Undead Fortitude: If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
      "Undying Husk: Immune to Poison damage; cannot be poisoned."
    ],
    "attacks": [
      {
        "name": "Morningstar",
        "diceExpr": "1d8+4",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "oni",
    "name": "Oni",
    "category": "creature",
    "stats": {
      "hp": 61,
      "dr": 4,
      "speed": "30 / fly 30",
      "damage": "Claw (Oni Form Only) 1d8+4 slashing / Glaive 2d10+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [
      "Innate Spellcasting: The oni's innate spellcasting ability is Charisma (spell save DC 13). (Innate magic — see notes.)",
      "Magic Weapons: The oni's weapon attacks are magical.",
      "Regeneration: The oni regains 10 hit points at the start of its turn if it has at least 1 hit point."
    ],
    "attacks": [
      {
        "name": "Claw (Oni Form Only)",
        "diceExpr": "1d8+4",
        "damageType": "Slashing"
      },
      {
        "name": "Glaive",
        "diceExpr": "2d10+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "orc",
    "name": "Orc",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Greataxe 1d4 slashing / Javelin 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Aggressive: As a bonus action, the orc can move up to its speed toward a hostile creature that it can see."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      },
      {
        "name": "Javelin",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "otyugh",
    "name": "Otyugh",
    "category": "creature",
    "stats": {
      "hp": 63,
      "dr": 4,
      "speed": "30",
      "damage": "Bite 1d8+2 piercing / Tentacle 3d8 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Aberration",
      "soulCore": "none",
      "native": "The Underdark"
    },
    "abilities": [
      "Limited Telepathy: The otyugh can magically transmit simple messages and images to any creature within 120 ft. of it that can understand a language. This form of telepathy doesn't allow the receiving creature to telepathically respond.",
      "Tentacle Slam: The otyugh slams creatures grappled by it into each other or a solid surface. Each creature must succeed on a DC 14 Constitution saving throw or take 10 (2d6 + 3) bludgeoning damage and be stunned until the end of the otyugh's next turn.… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+2",
        "damageType": "Piercing"
      },
      {
        "name": "Tentacle",
        "diceExpr": "3d8",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "owl",
    "name": "Owl",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "5 / fly 60",
      "damage": "Talons 1d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Flyby: The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
      "Keen Hearing and Sight: The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
    ],
    "attacks": [
      {
        "name": "Talons",
        "diceExpr": "1d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "owlbear",
    "name": "Owlbear",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 3,
      "speed": "40",
      "damage": "Beak 1d10 piercing / Claws 1d8+4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight and Smell: The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d8+4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "panther",
    "name": "Panther",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "50 / climb 40",
      "damage": "Bite 1d4 piercing / Claw 1d4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The panther has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pounce: If the panther moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "pegasus",
    "name": "Pegasus",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 2,
      "speed": "60 / fly 90",
      "damage": "Hooves 2d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Celestial",
      "soulCore": "Radiant (DC14)",
      "native": "The Upper Planes"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "pit-fiend",
    "name": "Pit Fiend",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "30 / fly 60",
      "damage": "Bite 3d6+1 piercing / Claw 1d8+4 slashing / Mace 2d6+1 bludgeoning / Tail 2d10+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Fiend",
      "soulCore": "Infernal (DC19)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Fear Aura: Any creature hostile to the pit fiend that starts its turn within 20 feet of the pit fiend must make a DC 21 Wisdom saving throw, unless the pit fiend is incapacitated. On a failed save, the creature is frightened until the start of its next turn. If a creature's saving throw is successful, the…",
      "Magic Resistance: The pit fiend has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The pit fiend's weapon attacks are magical.",
      "Innate Spellcasting: The pit fiend's spellcasting ability is Charisma (spell save DC 21). (Innate magic — see notes.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d8+4",
        "damageType": "Slashing"
      },
      {
        "name": "Mace",
        "diceExpr": "2d6+1",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Tail",
        "diceExpr": "2d10+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "planetar",
    "name": "Planetar",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "40 / fly 120",
      "damage": "Greatsword 10d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Celestial",
      "soulCore": "Radiant (DC18)",
      "native": "The Upper Planes"
    },
    "abilities": [
      "Angelic Weapons: The planetar's weapon attacks are magical. When the planetar hits with any weapon, the weapon deals an extra 5d8 radiant damage (included in the attack).",
      "Divine Awareness: The planetar knows if it hears a lie.",
      "Innate Spellcasting: The planetar's spellcasting ability is Charisma (spell save DC 20). (Innate magic — see notes.)",
      "Magic Resistance: The planetar has advantage on saving throws against spells and other magical effects.",
      "Radiant-Hardened: Takes half damage from Radiant attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, exhausted, frightened.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "10d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "plesiosaurus",
    "name": "Plesiosaurus",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 2,
      "speed": "20 / swim 40",
      "damage": "Bite 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Hold Breath: The plesiosaurus can hold its breath for 1 hour."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "poisonous-snake",
    "name": "Poisonous Snake",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30 / swim 30",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "polar-bear",
    "name": "Polar Bear",
    "category": "creature",
    "stats": {
      "hp": 23,
      "dr": 2,
      "speed": "40 / swim 30",
      "damage": "Bite 1d6 piercing / Claws 1d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The bear has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "pony",
    "name": "Pony",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Hooves 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "priest",
    "name": "Priest",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "25",
      "damage": "Mace 2d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Divine Eminence: As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6…",
      "Spellcasting: The priest is a 5th-level spellcaster. (Innate magic — see notes.)"
    ],
    "attacks": [
      {
        "name": "Mace",
        "diceExpr": "2d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "pseudodragon",
    "name": "Pseudodragon",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "15 / fly 60",
      "damage": "Bite 1d4 piercing / Sting 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Dragon",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [
      "Keen Senses: The pseudodragon has advantage on Wisdom (Perception) checks that rely on sight, hearing, or smell.",
      "Magic Resistance: The pseudodragon has advantage on saving throws against spells and other magical effects.",
      "Limited Telepathy: The pseudodragon can magically communicate simple ideas, emotions, and images telepathically with any creature within 100 ft. of it that can understand a language."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Sting",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "purple-worm",
    "name": "Purple Worm",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "50 / burrow 30",
      "damage": "Bite 4d8 piercing / Tail Stinger 4d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound (DC18)",
      "native": "Wilderness"
    },
    "abilities": [
      "Tunneler: The worm can burrow through solid rock at half its burrow speed and leaves a 10-foot-diameter tunnel in its wake.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d8",
        "damageType": "Piercing"
      },
      {
        "name": "Tail Stinger",
        "diceExpr": "4d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "quasit",
    "name": "Quasit",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "40",
      "damage": "Claw (Bite in Beast Form) 3d4+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fiend",
      "soulCore": "none",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Shapechanger: The quasit can use its action to polymorph into a beast form that resembles a bat (speed 10 ft. fly 40 ft.), a centipede (40 ft., climb 40 ft.), or a toad (40 ft., swim 40 ft.), or back into its true form . Its statistics are the same in each form, except for the speed changes noted. Any equipment…",
      "Magic Resistance: The quasit has advantage on saving throws against spells and other magical effects.",
      "Scare: One creature of the quasit's choice within 20 ft. of it must succeed on a DC 10 Wisdom saving throw or be frightened for 1 minute. The target can repeat the saving throw at the end of each of its turns, with disadvantage if the quasit is… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Claw (Bite in Beast Form)",
        "diceExpr": "3d4+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "quipper",
    "name": "Quipper",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "0 / swim 40",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Blood Frenzy: The quipper has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Water Breathing: The quipper can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "rakshasa",
    "name": "Rakshasa",
    "category": "creature",
    "stats": {
      "hp": 61,
      "dr": 6,
      "speed": "40",
      "damage": "Claw 10d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Fiend",
      "soulCore": "Infernal (DC18)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Limited Magic Immunity: The rakshasa can't be affected or detected by spells of 6th level or lower unless it wishes to be. It has advantage on saving throws against all other spells and magical effects.",
      "Innate Spellcasting: The rakshasa's innate spellcasting ability is Charisma (spell save DC 18, +10 to hit with spell attacks). (Innate magic — see notes.)",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Piercing from magic weapons wielded by good creatures Frailty: Takes double damage from Piercing from magic weapons wielded by good creatures attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "10d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "rat",
    "name": "Rat",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The rat has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "raven",
    "name": "Raven",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / fly 50",
      "damage": "Beak 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Mimicry: The raven can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering. A creature that hears the sounds can tell they are imitations with a successful DC 10 Wisdom (Insight) check."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "red-dragon-wyrmling",
    "name": "Red Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 41,
      "dr": 4,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Infernal (DC15)",
      "native": "Mountains"
    },
    "abilities": [
      "Fire Breath: The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "reef-shark",
    "name": "Reef Shark",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "0 / swim 40",
      "damage": "Bite 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Pack Tactics: The shark has advantage on an attack roll against a creature if at least one of the shark's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Water Breathing: The shark can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "remorhaz",
    "name": "Remorhaz",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "30 / burrow 20",
      "damage": "Bite 6d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound (DC18)",
      "native": "Wilderness"
    },
    "abilities": [
      "Heated Body: A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.",
      "Coldward: Immune to Cold damage",
      "Fireward: Immune to Fire damage",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "6d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "rhinoceros",
    "name": "Rhinoceros",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 2,
      "speed": "40",
      "damage": "Gore 1d8+4 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Charge: If the rhinoceros moves at least 20 ft. straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "1d8+4",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "riding-horse",
    "name": "Riding Horse",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "60",
      "damage": "Hooves 1d4+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "roc",
    "name": "Roc",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "20 / fly 120",
      "damage": "Beak 4d8 piercing / Talons 4d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound (DC18)",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight: The roc has advantage on Wisdom (Perception) checks that rely on sight.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "4d8",
        "damageType": "Piercing"
      },
      {
        "name": "Talons",
        "diceExpr": "4d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "roper",
    "name": "Roper",
    "category": "creature",
    "stats": {
      "hp": 51,
      "dr": 5,
      "speed": "10 / climb 10",
      "damage": "Bite 4d8+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Caverns, Wilderness"
    },
    "abilities": [
      "False Appearance: While the roper remains motionless, it is indistinguishable from a normal cave formation, such as a stalagmite.",
      "Grasping Tendrils: The roper can have up to six tendrils at a time. Each tendril can be attacked (AC 20; 10 hit points; immunity to poison and psychic damage). Destroying a tendril deals no damage to the roper, which can extrude a replacement tendril on its next turn. A tendril can also be broken if a creature takes…",
      "Spider Climb: The roper can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d8+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "rug-of-smothering",
    "name": "Rug of Smothering",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 2,
      "speed": "10",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Antimagic Susceptibility: The rug is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the rug must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.",
      "Damage Transfer: While it is grappling a creature, the rug takes only half the damage dealt to it, and the creature grappled by the rug takes the other half.",
      "False Appearance: While the rug remains motionless, it is indistinguishable from a normal rug.",
      "Lifeless Frame: Immune to Poison damage; cannot be poisoned.",
      "Psychicward: Immune to Psychic damage",
      "Steadfast Form: Cannot be blinded, charmed, frightened, paralyzed, petrified."
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "rust-monster",
    "name": "Rust Monster",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "40",
      "damage": "Bite 1d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Iron Scent: The rust monster can pinpoint, by scent, the location of ferrous metal within 30 feet of it.",
      "Rust Metal: Any nonmagical weapon made of metal that hits the rust monster corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the rust monster is destroyed…"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "saber-toothed-tiger",
    "name": "Saber-Toothed Tiger",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 2,
      "speed": "40",
      "damage": "Bite 1d6 piercing / Claw 1d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The tiger has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pounce: If the tiger moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "sahuagin",
    "name": "Sahuagin",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / swim 40",
      "damage": "Bite 1d4 piercing / Claws 1d4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Blood Frenzy: The sahuagin has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Limited Amphibiousness: The sahuagin can breathe air and water, but it needs to be submerged at least once every 4 hours to avoid suffocating.",
      "Shark Telepathy: The sahuagin can magically command any shark within 120 feet of it, using a limited telepathy."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "salamander",
    "name": "Salamander",
    "category": "creature",
    "stats": {
      "hp": 50,
      "dr": 4,
      "speed": "30",
      "damage": "Spear 1d6 fire / Tail 5d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Elemental",
      "soulCore": "Infernal (DC16)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Heated Body: A creature that touches the salamander or hits it with a melee attack while within 5 ft. of it takes 7 (2d6) fire damage.",
      "Heated Weapons: Any metal melee weapon the salamander wields deals an extra 3 (1d6) fire damage on a hit (included in the attack).",
      "Fireward: Immune to Fire damage",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Frost-Brittle: Takes double damage from Cold attacks"
    ],
    "attacks": [
      {
        "name": "Spear",
        "diceExpr": "1d6",
        "damageType": "Fire"
      },
      {
        "name": "Tail",
        "diceExpr": "5d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "satyr",
    "name": "Satyr",
    "category": "creature",
    "stats": {
      "hp": 17,
      "dr": 2,
      "speed": "40",
      "damage": "Ram 1d4 bludgeoning / Shortsword 1d4 piercing / Shortbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Fey",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "Magic Resistance: The satyr has advantage on saving throws against spells and other magical effects."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Shortsword",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Shortbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "scorpion",
    "name": "Scorpion",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10",
      "damage": "Sting 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Sting",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "scout",
    "name": "Scout",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Shortsword 1d4 piercing / Longbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Keen Hearing and Sight: The scout has advantage on Wisdom (Perception) checks that rely on hearing or sight."
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Longbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "sea-hag",
    "name": "Sea Hag",
    "category": "creature",
    "stats": {
      "hp": 29,
      "dr": 2,
      "speed": "30 / swim 40",
      "damage": "Claws 2d6+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fey",
      "soulCore": "none",
      "native": "Coastal Waters, Forests"
    },
    "abilities": [
      "Amphibious: The hag can breathe air and water.",
      "Horrific Appearance: Any humanoid that starts its turn within 30 feet of the hag and can see the hag's true form must make a DC 11 Wisdom saving throw. On a failed save, the creature is frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the hag is…",
      "Death Glare: The hag targets one frightened creature she can see within 30 ft. of her. If the target can see the hag, it must succeed on a DC 11 Wisdom saving throw against this magic or drop to 0 hit points. (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d6+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "sea-horse",
    "name": "Sea Horse",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "0 / swim 20",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Non-combatant",
      "type": "Beast",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Water Breathing: The sea horse can breathe only underwater."
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "shadow",
    "name": "Shadow",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "40",
      "damage": "Strength Drain 1d6+2 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Amorphous: The shadow can move through a space as narrow as 1 inch wide without squeezing.",
      "Shadow Stealth: While in dim light or darkness, the shadow can take the Hide action as a bonus action. Its stealth bonus is also improved to +6.",
      "Sunlight Weakness: While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Light-Cursed: Takes double damage from Radiant attacks",
      "Steadfast Form: Cannot be frightened, grappled, paralyzed, petrified, prone, restrained."
    ],
    "attacks": [
      {
        "name": "Strength Drain",
        "diceExpr": "1d6+2",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "shambling-mound",
    "name": "Shambling Mound",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "20 / swim 20",
      "damage": "Slam 4d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Plant",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "Lightning Absorption: Whenever the shambling mound is subjected to lightning damage, it takes no damage and regains a number of hit points equal to the lightning damage dealt.",
      "Lightningward: Immune to Lightning damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Steadfast Form: Cannot be blinded, exhausted."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "shield-guardian",
    "name": "Shield Guardian",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "30",
      "damage": "Fist 5d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Construct",
      "soulCore": "none",
      "native": "Ruins"
    },
    "abilities": [
      "Bound: The shield guardian is magically bound to an amulet. As long as the guardian and its amulet are on the same plane of existence, the amulet's wearer can telepathically call the guardian to travel to it, and the guardian knows the distance and direction to the amulet. If the guardian is within 60…",
      "Regeneration: The shield guardian regains 10 hit points at the start of its turn if it has at least 1 hit. point.",
      "Spell Storing: A spellcaster who wears the shield guardian's amulet can cause the guardian to store one spell of 4th level or lower. To do so, the wearer must cast the spell on the guardian. The spell has no effect but is stored within the guardian. When commanded to do so by the wearer or when a situation arises…",
      "Lifeless Frame: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed."
    ],
    "attacks": [
      {
        "name": "Fist",
        "diceExpr": "5d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "shrieker",
    "name": "Shrieker",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "0",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Non-combatant",
      "type": "Plant",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "False Appearance: While the shrieker remains motionless, it is indistinguishable from an ordinary fungus.",
      "Steadfast Form: Cannot be blinded, frightened."
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "silver-dragon-wyrmling",
    "name": "Silver Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Tidal (DC14)",
      "native": "Mountains"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 15-foot cone. Each creature in that area must make a DC 13 Constitution saving throw, taking 18 (4d8) cold damage on a failed save, or… (Once per encounter.)",
      "Coldward: Immune to Cold damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "skeleton",
    "name": "Skeleton",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Shortsword 1d4 piercing / Shortbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Undying Husk: Immune to Poison damage; cannot be poisoned or exhausted.",
      "Brittle Frame: Takes double damage from Bludgeoning attacks"
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Shortbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "solar",
    "name": "Solar",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 7,
      "speed": "50 / fly 150",
      "damage": "Greatsword 12d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Celestial",
      "soulCore": "Radiant (DC19)",
      "native": "The Upper Planes"
    },
    "abilities": [
      "Angelic Weapons: The solar's weapon attacks are magical. When the solar hits with any weapon, the weapon deals an extra 6d8 radiant damage (included in the attack).",
      "Divine Awareness: The solar knows if it hears a lie.",
      "Innate Spellcasting: The solar's spell casting ability is Charisma (spell save DC 25). (Innate magic — see notes.)",
      "Magic Resistance: The solar has advantage on saving throws against spells and other magical effects.",
      "Hardened Vitality: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Radiant-Hardened: Takes half damage from Radiant attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, frightened.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "12d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "specter",
    "name": "Specter",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "0 / hover 50",
      "damage": "Life Drain 2d6+2 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Incorporeal Movement: The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Sunlight Sensitivity: While in sunlight, the specter has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, grappled, paralyzed, petrified, prone, restrained, unconscious."
    ],
    "attacks": [
      {
        "name": "Life Drain",
        "diceExpr": "2d6+2",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "spider",
    "name": "Spider",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / climb 20",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Spider Climb: The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The spider ignores movement restrictions caused by webbing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "spirit-naga",
    "name": "Spirit Naga",
    "category": "creature",
    "stats": {
      "hp": 41,
      "dr": 5,
      "speed": "40",
      "damage": "Bite 8d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Rejuvenation: If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.",
      "Spellcasting: The naga is a 10th-level spellcaster. (Innate magic — see notes.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Steadfast Form: Cannot be charmed."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "8d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "sprite",
    "name": "Sprite",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 40",
      "damage": "Longsword 1d4 slashing / Shortbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Fey",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "Heart Sight: The sprite touches a creature and magically knows the creature's current emotional state. If the target fails a DC 10 Charisma saving throw, the sprite also knows the creature's alignment. Celestials, fiends, and undead automatically fail… (Once per encounter.)"
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      },
      {
        "name": "Shortbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "spy",
    "name": "Spy",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Shortsword 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Cunning Action: On each of its turns, the spy can use a bonus action to take the Dash, Disengage, or Hide action.",
      "Sneak Attack (1/Turn): The spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the spy that isn't incapacitated and the spy doesn't have disadvantage on the attack roll."
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "steam-mephit",
    "name": "Steam Mephit",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30 / fly 30",
      "damage": "Claws 1d4+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Elemental",
      "soulCore": "none",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Death Burst: When the mephit dies, it explodes in a cloud of steam. Each creature within 5 ft. of the mephit must succeed on a DC 10 Dexterity saving throw or take 4 (1d8) fire damage.",
      "Innate Spellcasting: The mephit can innately cast blur, requiring no material components. (Innate magic — see notes.)",
      "Steam Breath: The mephit exhales a 15-foot cone of scalding steam. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 4 (1d8) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "stirge",
    "name": "Stirge",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "10 / fly 40",
      "damage": "Blood Drain 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Blood Drain",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "stone-giant",
    "name": "Stone Giant",
    "category": "creature",
    "stats": {
      "hp": 69,
      "dr": 4,
      "speed": "40",
      "damage": "Greatclub 4d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [
      "Stone Camouflage: The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
    ],
    "attacks": [
      {
        "name": "Greatclub",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "storm-giant",
    "name": "Storm Giant",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 6,
      "speed": "50 / swim 50",
      "damage": "Greatsword 10d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Giant",
      "soulCore": "Earthen (DC18)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The giant can breathe air and water.",
      "Innate Spellcasting: The giant's innate spellcasting ability is Charisma (spell save DC 17). (Innate magic — see notes.)",
      "Lightning Strike: The giant hurls a magical lightning bolt at a point it can see within 500 feet of it. Each creature within 10 feet of that point must make a DC 17 Dexterity saving throw, taking 54 (12d8) lightning damage on a failed save, or half as much… (Once per encounter.)",
      "Lightningward: Immune to Lightning damage",
      "Thunderward: Immune to Thunder damage",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "10d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "succubus-incubus",
    "name": "Succubus/Incubus",
    "category": "creature",
    "stats": {
      "hp": 36,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Claw (Fiend Form Only) 4d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Fiend",
      "soulCore": "none",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Telepathic Bond: The fiend ignores the range restriction on its telepathy when communicating with a creature it has charmed. The two don't even need to be on the same plane of existence.",
      "Shapechanger: The fiend can use its action to polymorph into a Small or Medium humanoid, or back into its true form. Without wings, the fiend loses its flying speed. Other than its size and speed, its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to…",
      "Charm: One humanoid the fiend can see within 30 feet of it must succeed on a DC 15 Wisdom saving throw or be magically charmed for 1 day. The charmed target obeys the fiend's verbal or telepathic commands. If the target suffers any harm or… (Once per encounter.)",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Poison-Hardened: Takes half damage from Poison attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Claw (Fiend Form Only)",
        "diceExpr": "4d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-bats",
    "name": "Swarm of Bats",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "0 / fly 30",
      "damage": "Bites 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Echolocation: The swarm can't use its blindsight while deafened.",
      "Keen Hearing: The swarm has advantage on Wisdom (Perception) checks that rely on hearing.",
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny bat. The swarm can't regain hit points or gain temporary hit points.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-beetles",
    "name": "Swarm of Beetles",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / climb 20",
      "damage": "Bites 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-centipedes",
    "name": "Swarm of Centipedes",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / climb 20",
      "damage": "Bites 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-insects",
    "name": "Swarm of Insects",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / climb 20",
      "damage": "Bites 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-poisonous-snakes",
    "name": "Swarm of Poisonous Snakes",
    "category": "creature",
    "stats": {
      "hp": 20,
      "dr": 2,
      "speed": "30 / swim 30",
      "damage": "Bites 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny snake. The swarm can't regain hit points or gain temporary hit points.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-quippers",
    "name": "Swarm of Quippers",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "0 / swim 40",
      "damage": "Bites 2d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Coastal Waters, Wilderness"
    },
    "abilities": [
      "Blood Frenzy: The swarm has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny quipper. The swarm can't regain hit points or gain temporary hit points.",
      "Water Breathing: The swarm can breathe only underwater.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-rats",
    "name": "Swarm of Rats",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "Bites 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The swarm has advantage on Wisdom (Perception) checks that rely on smell.",
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. The swarm can't regain hit points or gain temporary hit points.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-ravens",
    "name": "Swarm of Ravens",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / fly 50",
      "damage": "Beaks 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny raven. The swarm can't regain hit points or gain temporary hit points.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Beaks",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-spiders",
    "name": "Swarm of Spiders",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20 / climb 20",
      "damage": "Bites 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
      "Spider Climb: The swarm can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the swarm knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The swarm ignores movement restrictions caused by webbing.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "swarm-of-wasps",
    "name": "Swarm of Wasps",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "5 / fly 30",
      "damage": "Bites 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Swarm of Tiny Beasts",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Slashing-Hardened: Takes half damage from Slashing attacks",
      "Steadfast Form: Cannot be charmed, frightened, grappled, paralyzed, petrified, prone, restrained, stunned."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "tarrasque",
    "name": "Tarrasque",
    "category": "creature",
    "stats": {
      "hp": 105,
      "dr": 8,
      "speed": "40",
      "damage": "Bite 2d12 piercing / Claw 1d8+4 slashing / Horns 2d10 piercing / Tail 2d6+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Monstrosity",
      "soulCore": "Naturebound (DC19)",
      "native": "Wilderness"
    },
    "abilities": [
      "Legendary Resistance: If the tarrasque fails a saving throw, it can choose to succeed instead.",
      "Magic Resistance: The tarrasque has advantage on saving throws against spells and other magical effects.",
      "Reflective Carapace: Any time the tarrasque is targeted by a magic missile spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the…",
      "Siege Monster: The tarrasque deals double damage to objects and structures.",
      "Frightful Presence: Each creature of the tarrasque's choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Fireward: Immune to Fire damage",
      "Spectral Resilience: Immune to nonmagical weapon damage",
      "Steadfast Form: Cannot be charmed, frightened, paralyzed.",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR7 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d12",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d8+4",
        "damageType": "Slashing"
      },
      {
        "name": "Horns",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      },
      {
        "name": "Tail",
        "diceExpr": "2d6+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "thug",
    "name": "Thug",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 1,
      "speed": "30",
      "damage": "Mace 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Pack Tactics: The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Mace",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "tiger",
    "name": "Tiger",
    "category": "creature",
    "stats": {
      "hp": 20,
      "dr": 2,
      "speed": "40",
      "damage": "Bite 1d8 piercing / Claw 1d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Smell: The tiger has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pounce: If the tiger moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "treant",
    "name": "Treant",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "30",
      "damage": "Slam 8d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Plant",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "False Appearance: While the treant remains motionless, it is indistinguishable from a normal tree.",
      "Siege Monster: The treant deals double damage to objects and structures.",
      "Bludgeoning-Hardened: Takes half damage from Bludgeoning attacks",
      "Piercing-Hardened: Takes half damage from Piercing attacks",
      "Tinder-Dry: Takes double damage from Fire attacks"
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "8d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "tribal-warrior",
    "name": "Tribal Warrior",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "30",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Pack Tactics: The warrior has advantage on an attack roll against a creature if at least one of the warrior's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "troll",
    "name": "Troll",
    "category": "creature",
    "stats": {
      "hp": 46,
      "dr": 4,
      "speed": "30",
      "damage": "Bite 1d6+1 piercing / Claw 4d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Giant",
      "soulCore": "none",
      "native": "Mountains"
    },
    "abilities": [
      "Keen Smell: The troll has advantage on Wisdom (Perception) checks that rely on smell.",
      "Regeneration: The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "4d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "unicorn",
    "name": "Unicorn",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 4,
      "speed": "50",
      "damage": "Hooves 1d12+4 bludgeoning / Horn 1d8+4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Celestial",
      "soulCore": "Radiant (DC16)",
      "native": "The Upper Planes"
    },
    "abilities": [
      "Charge: If the unicorn moves at least 20 ft. straight toward a target and then hits it with a horn attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.",
      "Innate Spellcasting: The unicorn's innate spellcasting ability is Charisma (spell save DC 14). (Innate magic — see notes.)",
      "Magic Resistance: The unicorn has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The unicorn's weapon attacks are magical.",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Steadfast Form: Cannot be charmed, paralyzed."
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "1d12+4",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Horn",
        "diceExpr": "1d8+4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "vampire-spawn",
    "name": "Vampire Spawn",
    "category": "creature",
    "stats": {
      "hp": 45,
      "dr": 4,
      "speed": "30",
      "damage": "Bite 3d6+1 piercing / Claws 1d6+4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Undead",
      "soulCore": "Shadow (DC16)",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Regeneration: The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      "Spider Climb: The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Vampire Weaknesses: The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage when it ends its turn in running water. Stake to the Heart. The vampire is destroyed if a piercing weapon…",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "vampire-bat-form",
    "name": "Vampire, Bat Form",
    "category": "creature",
    "stats": {
      "hp": 79,
      "dr": 6,
      "speed": "5 / fly 30",
      "damage": "Bite 10d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Undead",
      "soulCore": "Shadow (DC18)",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Shapechanger: If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its…",
      "Legendary Resistance: If the vampire fails a saving throw, it can choose to succeed instead.",
      "Misty Escape: When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it…",
      "Regeneration: The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      "Spider Climb: The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Vampire Weaknesses: The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into…",
      "Charm: The vampire targets one humanoid it can see within 30 ft. of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the… (Once per encounter.)",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "10d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "vampire-mist-form",
    "name": "Vampire, Mist Form",
    "category": "creature",
    "stats": {
      "hp": 79,
      "dr": 6,
      "speed": "0 / fly 20",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Undead",
      "soulCore": "Shadow (DC18)",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Shapechanger: If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its…",
      "Legendary Resistance: If the vampire fails a saving throw, it can choose to succeed instead.",
      "Misty Escape: When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it…",
      "Regeneration: The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      "Spider Climb: The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Vampire Weaknesses: The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into…",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "vampire-vampire-form",
    "name": "Vampire, Vampire Form",
    "category": "creature",
    "stats": {
      "hp": 79,
      "dr": 6,
      "speed": "30",
      "damage": "Unarmed Strike 2d8+2 bludgeoning / Bite 7d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Legendary",
      "type": "Undead",
      "soulCore": "Shadow (DC18)",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Shapechanger: If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its…",
      "Legendary Resistance: If the vampire fails a saving throw, it can choose to succeed instead.",
      "Misty Escape: When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it…",
      "Regeneration: The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      "Spider Climb: The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Vampire Weaknesses: The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into…",
      "Charm: The vampire targets one humanoid it can see within 30 ft. of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the… (Once per encounter.)",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Legendary Trait: Acts twice between each player's turn (bonus minor actions). Unshakeable 3/long rest (negate a failed save or a critical hit against it). [Extrapolated TR6 band — unplaytested.]"
    ],
    "attacks": [
      {
        "name": "Unarmed Strike",
        "diceExpr": "2d8+2",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Bite",
        "diceExpr": "7d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "veteran",
    "name": "Veteran",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 4,
      "speed": "30",
      "damage": "Shortsword 4d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "4d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "violet-fungus",
    "name": "Violet Fungus",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "5",
      "damage": "Rotting Touch 1d8 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Plant",
      "soulCore": "none",
      "native": "Forests"
    },
    "abilities": [
      "False Appearance: While the violet fungus remains motionless, it is indistinguishable from an ordinary fungus.",
      "Steadfast Form: Cannot be blinded, frightened."
    ],
    "attacks": [
      {
        "name": "Rotting Touch",
        "diceExpr": "1d8",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "vrock",
    "name": "Vrock",
    "category": "creature",
    "stats": {
      "hp": 57,
      "dr": 4,
      "speed": "40 / fly 60",
      "damage": "Beak 2d6+1 piercing / Talons 2d10 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Fiend",
      "soulCore": "Infernal (DC16)",
      "native": "The Lower Planes"
    },
    "abilities": [
      "Magic Resistance: The vrock has advantage on saving throws against spells and other magical effects.",
      "Spores: A 15-foot-radius cloud of toxic spores extends out from the vrock. The spores spread around corners. Each creature in that area must succeed on a DC 14 Constitution saving throw or become poisoned. While poisoned in this way, a target… (Once per encounter.)",
      "Stunning Screech: The vrock emits a horrific screech. Each creature within 20 feet of it that can hear it and that isn't a demon must succeed on a DC 14 Constitution saving throw or be stunned until the end of the vrock's next turn . (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned.",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "2d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Talons",
        "diceExpr": "2d10",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "vulture",
    "name": "Vulture",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "10 / fly 50",
      "damage": "Beak 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Sight and Smell: The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell.",
      "Pack Tactics: The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "warhorse",
    "name": "Warhorse",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "60",
      "damage": "Hooves 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Trampling Charge: If the horse moves at least 20 ft. straight toward a creature and then hits it with a hooves attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the horse can make another attack with its hooves against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "warhorse-skeleton",
    "name": "Warhorse Skeleton",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "60",
      "damage": "Hooves 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Brittle Frame: Takes double damage from Bludgeoning attacks"
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "water-elemental",
    "name": "Water Elemental",
    "category": "creature",
    "stats": {
      "hp": 63,
      "dr": 4,
      "speed": "30 / swim 90",
      "damage": "Slam 4d8+1 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Elemental",
      "soulCore": "Tidal (DC16)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Water Form: The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.",
      "Freeze: If the elemental takes cold damage, it partially freezes; its speed is reduced by 20 ft. until the end of its next turn.",
      "Whelm: Each creature in the elemental's space must make a DC 15 Strength saving throw. On a failure, a target takes 13 (2d8 + 4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until this grapple ends, the… (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be grappled, paralyzed, petrified, prone, restrained, unconscious."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "4d8+1",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "weasel",
    "name": "Weasel",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "30",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Hearing and Smell: The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "werebear-bear-form",
    "name": "Werebear, Bear Form",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "40 / climb 30",
      "damage": "Claw 4d8+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its…",
      "Keen Smell: The werebear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "4d8+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "werebear-human-form",
    "name": "Werebear, Human Form",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "30",
      "damage": "Greataxe 3d12 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its…",
      "Keen Smell: The werebear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "3d12",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "werebear-hybrid-form",
    "name": "Werebear, Hybrid Form",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "40 / climb 30",
      "damage": "Bite 1d10+2 piercing / Claw 1d8+2 slashing / Greataxe 1d10 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its…",
      "Keen Smell: The werebear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d8+2",
        "damageType": "Slashing"
      },
      {
        "name": "Greataxe",
        "diceExpr": "1d10",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "wereboar-boar-form",
    "name": "Wereboar, Boar Form",
    "category": "creature",
    "stats": {
      "hp": 43,
      "dr": 3,
      "speed": "40",
      "damage": "Tusks 4d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Charge (Boar or Hybrid Form Only): If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
      "Relentless: If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Tusks",
        "diceExpr": "4d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "wereboar-human-form",
    "name": "Wereboar, Human Form",
    "category": "creature",
    "stats": {
      "hp": 43,
      "dr": 3,
      "speed": "30",
      "damage": "Maul 4d6 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Relentless: If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Maul",
        "diceExpr": "4d6",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  },
  {
    "id": "wereboar-hybrid-form",
    "name": "Wereboar, Hybrid Form",
    "category": "creature",
    "stats": {
      "hp": 43,
      "dr": 3,
      "speed": "30",
      "damage": "Maul 1d6+3 bludgeoning / Tusks 1d6+3 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Charge (Boar or Hybrid Form Only): If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
      "Relentless: If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Maul",
        "diceExpr": "1d6+3",
        "damageType": "Bludgeoning"
      },
      {
        "name": "Tusks",
        "diceExpr": "1d6+3",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "wererat-human-form",
    "name": "Wererat, Human Form",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 2,
      "speed": "30",
      "damage": "Shortsword 1d6+1 piercing / Hand Crossbow 1d6+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it…",
      "Keen Smell: The wererat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Hand Crossbow",
        "diceExpr": "1d6+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "wererat-hybrid-form",
    "name": "Wererat, Hybrid Form",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 2,
      "speed": "30",
      "damage": "Bite 1d4 piercing / Shortsword 1d6 piercing / Hand Crossbow 1d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it…",
      "Keen Smell: The wererat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      },
      {
        "name": "Shortsword",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Hand Crossbow",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "wererat-rat-form",
    "name": "Wererat, Rat Form",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 2,
      "speed": "30",
      "damage": "Bite 3d4+1 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it…",
      "Keen Smell: The wererat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d4+1",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "weretiger-human-form",
    "name": "Weretiger, Human Form",
    "category": "creature",
    "stats": {
      "hp": 66,
      "dr": 3,
      "speed": "30",
      "damage": "Scimitar 1d6+3 slashing / Longbow 1d8+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it…",
      "Keen Hearing and Smell: The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d6+3",
        "damageType": "Slashing"
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "weretiger-hybrid-form",
    "name": "Weretiger, Hybrid Form",
    "category": "creature",
    "stats": {
      "hp": 66,
      "dr": 3,
      "speed": "30",
      "damage": "Bite 1d6 piercing / Claw 1d6 slashing / Scimitar 1d4 slashing / Longbow 1d4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it…",
      "Keen Hearing and Smell: The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pounce: If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d6",
        "damageType": "Slashing"
      },
      {
        "name": "Scimitar",
        "diceExpr": "1d4",
        "damageType": "Slashing"
      },
      {
        "name": "Longbow",
        "diceExpr": "1d4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "weretiger-tiger-form",
    "name": "Weretiger, Tiger Form",
    "category": "creature",
    "stats": {
      "hp": 66,
      "dr": 3,
      "speed": "40",
      "damage": "Bite 1d10+1 piercing / Claw 1d8+2 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it…",
      "Keen Hearing and Smell: The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pounce: If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d8+2",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "werewolf-human-form",
    "name": "Werewolf, Human Form",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 3,
      "speed": "30",
      "damage": "—",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [],
    "provisional": true
  },
  {
    "id": "werewolf-hybrid-form",
    "name": "Werewolf, Hybrid Form",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 3,
      "speed": "30",
      "damage": "Bite 1d8+2 piercing / Claws 1d6+4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "werewolf-wolf-form",
    "name": "Werewolf, Wolf Form",
    "category": "creature",
    "stats": {
      "hp": 32,
      "dr": 3,
      "speed": "40",
      "damage": "Bite 3d8 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Humanoid",
      "soulCore": "none",
      "native": "Settlements"
    },
    "abilities": [
      "Shapechanger: The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Spectral Resilience: Immune to nonmagical weapon damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d8",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "white-dragon-wyrmling",
    "name": "White Dragon Wyrmling",
    "category": "creature",
    "stats": {
      "hp": 18,
      "dr": 3,
      "speed": "30 / fly 60",
      "damage": "Bite 2d10 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Dragon",
      "soulCore": "Tidal (DC14)",
      "native": "Mountains"
    },
    "abilities": [
      "Cold Breath: The dragon exhales an icy blast of hail in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 22 (5d8) cold damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Coldward: Immune to Cold damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "wight",
    "name": "Wight",
    "category": "creature",
    "stats": {
      "hp": 25,
      "dr": 3,
      "speed": "30",
      "damage": "Life Drain 1d6+3 necrotic / Longbow 1d8+4 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Sunlight Sensitivity: While in sunlight, the wight has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Life Drain",
        "diceExpr": "1d6+3",
        "damageType": "Necrotic"
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+4",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "will-o-wisp",
    "name": "Will-o'-Wisp",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 3,
      "speed": "0 / hover 50",
      "damage": "Shock 1d8+4 lightning",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Consume Life: As a bonus action, the will-o'-wisp can target one creature it can see within 5 ft. of it that has 0 hit points and is still alive. The target must succeed on a DC 10 Constitution saving throw against this magic or die. If the target dies, the will-o'-wisp regains 10 (3d6) hit points.",
      "Ephemeral: The will-o'-wisp can't wear or carry anything.",
      "Incorporeal Movement: The will-o'-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Variable Illumination: The will-o'-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of ft. equal to the chosen radius. The will-o'-wisp can alter the radius as a bonus action.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Lightningward: Immune to Lightning damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Necrotic-Hardened: Takes half damage from Necrotic attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be grappled, paralyzed, prone, restrained, unconscious."
    ],
    "attacks": [
      {
        "name": "Shock",
        "diceExpr": "1d8+4",
        "damageType": "Lightning"
      }
    ],
    "provisional": true
  },
  {
    "id": "winter-wolf",
    "name": "Winter Wolf",
    "category": "creature",
    "stats": {
      "hp": 41,
      "dr": 3,
      "speed": "50",
      "damage": "Bite 4d6 piercing",
      "initiativeMod": 0,
      "threatLevel": "Tough",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Frozen Wastes, Wilderness"
    },
    "abilities": [
      "Keen Hearing and Smell: The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Snow Camouflage: The wolf has advantage on Dexterity (Stealth) checks made to hide in snowy terrain.",
      "Cold Breath: The wolf exhales a blast of freezing wind in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Coldward: Immune to Cold damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d6",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "wolf",
    "name": "Wolf",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "40",
      "damage": "Bite 1d4+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Beast",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Hearing and Smell: The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "worg",
    "name": "Worg",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 2,
      "speed": "50",
      "damage": "Bite 1d6+2 piercing",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Monstrosity",
      "soulCore": "none",
      "native": "Wilderness"
    },
    "abilities": [
      "Keen Hearing and Smell: The worg has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "wraith",
    "name": "Wraith",
    "category": "creature",
    "stats": {
      "hp": 37,
      "dr": 4,
      "speed": "0 / hover 60",
      "damage": "Life Drain 4d8+1 necrotic",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Undead",
      "soulCore": "Shadow (DC16)",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Incorporeal Movement: The wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Sunlight Sensitivity: While in sunlight, the wraith has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Undying Husk: Immune to Poison damage; cannot be exhausted or poisoned.",
      "Necroticward: Immune to Necrotic damage",
      "Acid-Hardened: Takes half damage from Acid attacks",
      "Cold-Hardened: Takes half damage from Cold attacks",
      "Fire-Hardened: Takes half damage from Fire attacks",
      "Lightning-Hardened: Takes half damage from Lightning attacks",
      "Thunder-Hardened: Takes half damage from Thunder attacks",
      "Mundane Ward: Takes half damage from nonmagical weapons",
      "Steadfast Form: Cannot be charmed, grappled, paralyzed, petrified, prone, restrained."
    ],
    "attacks": [
      {
        "name": "Life Drain",
        "diceExpr": "4d8+1",
        "damageType": "Necrotic"
      }
    ],
    "provisional": true
  },
  {
    "id": "wyvern",
    "name": "Wyvern",
    "category": "creature",
    "stats": {
      "hp": 61,
      "dr": 4,
      "speed": "20 / fly 80",
      "damage": "Bite 1d6+3 piercing / Claws 1d8+4 slashing / Stinger 1d6+3 piercing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Storm (DC16)",
      "native": "Mountains"
    },
    "abilities": [],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+3",
        "damageType": "Piercing"
      },
      {
        "name": "Claws",
        "diceExpr": "1d8+4",
        "damageType": "Slashing"
      },
      {
        "name": "Stinger",
        "diceExpr": "1d6+3",
        "damageType": "Piercing"
      }
    ],
    "provisional": true
  },
  {
    "id": "xorn",
    "name": "Xorn",
    "category": "creature",
    "stats": {
      "hp": 40,
      "dr": 4,
      "speed": "20 / burrow 20",
      "damage": "Bite 2d6+1 piercing / Claw 3d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Elemental",
      "soulCore": "Earthen (DC16)",
      "native": "Elemental Planes"
    },
    "abilities": [
      "Earth Glide: The xorn can burrow through nonmagical, unworked earth and stone. While doing so, the xorn doesn't disturb the material it moves through.",
      "Stone Camouflage: The xorn has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
      "Treasure Sense: The xorn can pinpoint, by scent, the location of precious metals and stones, such as coins and gems, within 60 ft. of it.",
      "Mundane Ward: Takes half damage from nonmagical weapons"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-black-dragon",
    "name": "Young Black Dragon",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10 piercing / Claw 1d12+4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Caustic (DC16)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Acid Breath: The dragon exhales acid in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 49 (11d8) acid damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Acidward: Immune to Acid damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d12+4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-blue-dragon",
    "name": "Young Blue Dragon",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10+2 piercing / Claw 4d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Storm (DC17)",
      "native": "Mountains"
    },
    "abilities": [
      "Lightning Breath: The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Lightningward: Immune to Lightning damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "4d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-brass-dragon",
    "name": "Young Brass Dragon",
    "category": "creature",
    "stats": {
      "hp": 61,
      "dr": 4,
      "speed": "40 / fly 80",
      "damage": "Bite 1d10+2 piercing / Claw 3d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Infernal (DC16)",
      "native": "Mountains"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 42 (12d6) fire damage on a failed… (Once per encounter.)",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-bronze-dragon",
    "name": "Young Bronze Dragon",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10 piercing / Claw 5d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Storm (DC17)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 15 Dexterity saving throw, taking 55 (10d10) lightning… (Once per encounter.)",
      "Lightningward: Immune to Lightning damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "5d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-copper-dragon",
    "name": "Young Copper Dragon",
    "category": "creature",
    "stats": {
      "hp": 65,
      "dr": 4,
      "speed": "40 / fly 80",
      "damage": "Bite 1d10+2 piercing / Claw 3d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Caustic (DC16)",
      "native": "Mountains"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 40 (9d8) acid damage on a failed… (Once per encounter.)",
      "Acidward: Immune to Acid damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-gold-dragon",
    "name": "Young Gold Dragon",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10 piercing / Claw 5d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Infernal (DC17)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 55 (10d10) fire damage on a failed save, or half as… (Once per encounter.)",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "5d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-green-dragon",
    "name": "Young Green Dragon",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10+2 piercing / Claw 4d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Venom (DC17)",
      "native": "Mountains"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Poison Breath: The dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Hardened Vitality: Immune to Poison damage; cannot be poisoned."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+2",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "4d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-red-dragon",
    "name": "Young Red Dragon",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10+1 piercing / Claw 4d6+1 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Infernal (DC17)",
      "native": "Mountains"
    },
    "abilities": [
      "Fire Breath: The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Fireward: Immune to Fire damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+1",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "4d6+1",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-silver-dragon",
    "name": "Young Silver Dragon",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 5,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10 piercing / Claw 5d6 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Tidal (DC17)",
      "native": "Mountains"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 17 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or… (Once per encounter.)",
      "Coldward: Immune to Cold damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "5d6",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "young-white-dragon",
    "name": "Young White Dragon",
    "category": "creature",
    "stats": {
      "hp": 70,
      "dr": 4,
      "speed": "40 / fly 80",
      "damage": "Bite 2d10 piercing / Claw 1d12+4 slashing",
      "initiativeMod": 0,
      "threatLevel": "Deadly",
      "type": "Dragon",
      "soulCore": "Tidal (DC16)",
      "native": "Frozen Wastes, Mountains"
    },
    "abilities": [
      "Ice Walk: The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
      "Cold Breath: The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 15 Constitution saving throw, taking 45 (10d8) cold damage on a failed save, or half as much damage on a successful one. (Once per encounter.)",
      "Coldward: Immune to Cold damage"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10",
        "damageType": "Piercing"
      },
      {
        "name": "Claw",
        "diceExpr": "1d12+4",
        "damageType": "Slashing"
      }
    ],
    "provisional": true
  },
  {
    "id": "zombie",
    "name": "Zombie",
    "category": "creature",
    "stats": {
      "hp": 16,
      "dr": 1,
      "speed": "20",
      "damage": "Slam 1d6+2 bludgeoning",
      "initiativeMod": 0,
      "threatLevel": "Easy",
      "type": "Undead",
      "soulCore": "none",
      "native": "Ruins, Crypts"
    },
    "abilities": [
      "Undead Fortitude: If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead.",
      "Undying Husk: Immune to Poison damage; cannot be poisoned."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning"
      }
    ],
    "provisional": true
  }
];
