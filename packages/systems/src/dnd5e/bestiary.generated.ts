// AUTO-GENERATED — do not edit by hand.
// Produced by scripts/genDnd5eBestiary.ts from data/srd-monsters-5e.json (raw 5e SRD stat
// blocks from 5e-bits/5e-database). This is the 5e bestiary — independent of Solryn's
// Solryn-compressed bestiary.generated.ts. Regenerate with: npm run gen:bestiary5e
import type { BestiaryEntry } from '@solryn/shared-types';

export const generatedBestiary: BestiaryEntry[] = [
  {
    "id": "aboleth",
    "name": "Aboleth",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 135,
      "hd": "18d10",
      "speed": "10 ft., swim 40 ft.",
      "type": "Aberration",
      "cr": 10,
      "crLabel": "10",
      "str": 21,
      "dex": 9,
      "con": 15,
      "int": 18,
      "wis": 15,
      "cha": 18,
      "saves": "CON +6, INT +8, WIS +6"
    },
    "abilities": [
      "Amphibious: The aboleth can breathe air and water.",
      "Mucous Cloud: While underwater, the aboleth is surrounded by transformative mucus. A creature that touches the aboleth or that hits it with a melee attack while within 5 ft. of it must make a DC 14 Constitution saving throw. On a failure, the creature is diseased for 1d4 hours. The diseased creature can breathe only underwater.",
      "Probing Telepathy: If a creature communicates telepathically with the aboleth, the aboleth learns the creature's greatest desires if the aboleth can see the creature.",
      "Multiattack: The aboleth makes three tentacle attacks.",
      "Enslave: The aboleth targets one creature it can see within 30 ft. of it. The target must succeed on a DC 14 Wisdom saving throw or be magically charmed by the aboleth until the aboleth dies or until it is on a different plane of existence from the target. The charmed target is under the aboleth's control and can't take reactions, and the aboleth and the target can communicate telepathically with each other over any distance. Whenever the charmed target takes damage, the target can repeat the saving throw. On a success, the effect ends. No more than once every 24 hours, the target can also repeat the saving throw when it is at least 1 mile away from the aboleth.",
      "Detect (Legendary): The aboleth makes a Wisdom (Perception) check.",
      "Tail Swipe (Legendary): The aboleth makes one tail attack.",
      "Psychic Drain (Costs 2 Actions) (Legendary): One creature charmed by the aboleth takes 10 (3d6) psychic damage, and the aboleth regains hit points equal to the damage the creature takes."
    ],
    "saves": [
      {
        "name": "Tentacle",
        "ability": "CON",
        "dc": 14,
        "success": "none"
      },
      {
        "name": "Enslave",
        "ability": "WIS",
        "dc": 14,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Tentacle",
        "diceExpr": "2d6+5",
        "damageType": "Bludgeoning",
        "attackBonus": 9,
        "note": "+ 1d12 acid"
      },
      {
        "name": "Tail",
        "diceExpr": "3d6+5",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "acolyte",
    "name": "Acolyte",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 9,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 10,
      "dex": 10,
      "con": 10,
      "int": 10,
      "wis": 14,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Spellcasting: The acolyte is a 1st-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). The acolyte has following cleric spells prepared: - Cantrips (at will): light, sacred flame, thaumaturgy - 1st level (3 slots): bless, cure wounds, sanctuary"
    ],
    "attacks": [
      {
        "name": "Club",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "adult-black-dragon",
    "name": "Adult Black Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 19,
      "hp": 195,
      "hd": "17d12",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 14,
      "crLabel": "14",
      "str": 23,
      "dex": 14,
      "con": 21,
      "int": 14,
      "wis": 13,
      "cha": 17,
      "saves": "DEX +7, CON +10, WIS +6, CHA +8"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Acid Breath: The dragon exhales acid in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 16,
        "success": "none"
      },
      {
        "name": "Acid Breath",
        "ability": "DEX",
        "dc": 18,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "attackBonus": 11,
        "note": "+ 1d8 acid"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 11
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+6",
        "damageType": "Bludgeoning",
        "attackBonus": 11
      }
    ]
  },
  {
    "id": "adult-blue-dragon",
    "name": "Adult Blue Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 19,
      "hp": 225,
      "hd": "18d12",
      "speed": "40 ft., burrow 30 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 16,
      "crLabel": "16",
      "str": 25,
      "dex": 10,
      "con": 23,
      "int": 16,
      "wis": 15,
      "cha": 19,
      "saves": "DEX +5, CON +11, WIS +7, CHA +9"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Lightning Breath: The dragon exhales lightning in a 90-foot line that is 5 ft. wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6 + 7) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 17,
        "success": "none"
      },
      {
        "name": "Lightning Breath",
        "ability": "DEX",
        "dc": 19,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+7",
        "damageType": "Piercing",
        "attackBonus": 12,
        "note": "+ 1d10 lightning"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+7",
        "damageType": "Slashing",
        "attackBonus": 12
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+7",
        "damageType": "Bludgeoning",
        "attackBonus": 12
      }
    ]
  },
  {
    "id": "adult-brass-dragon",
    "name": "Adult Brass Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 18,
      "hp": 172,
      "hd": "15d12",
      "speed": "40 ft., burrow 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 13,
      "crLabel": "13",
      "str": 23,
      "dex": 10,
      "con": 21,
      "int": 14,
      "wis": 13,
      "cha": 17,
      "saves": "DEX +5, CON +10, WIS +6, CHA +8"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 45 (13d6) fire damage on a failed save, or half as much damage on a successful one. Sleep Breath. The dragon exhales sleep gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 16,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "attackBonus": 11
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 11
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+6",
        "damageType": "Bludgeoning",
        "attackBonus": 11
      }
    ]
  },
  {
    "id": "adult-bronze-dragon",
    "name": "Adult Bronze Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 19,
      "hp": 212,
      "hd": "17d12",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 15,
      "crLabel": "15",
      "str": 25,
      "dex": 10,
      "con": 23,
      "int": 16,
      "wis": 15,
      "cha": 19,
      "saves": "DEX +5, CON +11, WIS +7, CHA +9"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 90-foot line that is 5 feet wide. Each creature in that line must make a DC 19 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one. Repulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 19 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 20 Dexterity saving throw or take 14 (2d6 + 7) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 17,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+7",
        "damageType": "Piercing",
        "attackBonus": 12
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+7",
        "damageType": "Slashing",
        "attackBonus": 12
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+7",
        "damageType": "Bludgeoning",
        "attackBonus": 12
      }
    ]
  },
  {
    "id": "adult-copper-dragon",
    "name": "Adult Copper Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 18,
      "hp": 184,
      "hd": "16d12",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 14,
      "crLabel": "14",
      "str": 23,
      "dex": 12,
      "con": 21,
      "int": 18,
      "wis": 15,
      "cha": 17,
      "saves": "DEX +6, CON +10, WIS +7, CHA +8"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 60-foot line that is 5 feet wide. Each creature in that line must make a DC 18 Dexterity saving throw, taking 54 (12d8) acid damage on a failed save, or half as much damage on a successful one. Slowing Breath. The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 18 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 16,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "attackBonus": 11
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 11
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+6",
        "damageType": "Bludgeoning",
        "attackBonus": 11
      }
    ]
  },
  {
    "id": "adult-gold-dragon",
    "name": "Adult Gold Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 19,
      "hp": 256,
      "hd": "19d12",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 17,
      "crLabel": "17",
      "str": 27,
      "dex": 14,
      "con": 25,
      "int": 16,
      "wis": 15,
      "cha": 24,
      "saves": "DEX +8, CON +13, WIS +8, CHA +13"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 66 (12d10) fire damage on a failed save, or half as much damage on a successful one. Weakening Breath. The dragon exhales gas in a 60-foot cone. Each creature in that area must succeed on a DC 21 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 21,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+8",
        "damageType": "Piercing",
        "attackBonus": 14
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+8",
        "damageType": "Slashing",
        "attackBonus": 14
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+8",
        "damageType": "Bludgeoning",
        "attackBonus": 14
      }
    ]
  },
  {
    "id": "adult-green-dragon",
    "name": "Adult Green Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 19,
      "hp": 207,
      "hd": "18d12",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 15,
      "crLabel": "15",
      "str": 23,
      "dex": 12,
      "con": 21,
      "int": 18,
      "wis": 15,
      "cha": 17,
      "saves": "DEX +6, CON +10, WIS +7, CHA +8"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
      "Poison Breath: The dragon exhales poisonous gas in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 56 (16d6) poison damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 16,
        "success": "none"
      },
      {
        "name": "Poison Breath",
        "ability": "CON",
        "dc": 18,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "attackBonus": 11,
        "note": "+ 2d6 poison"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 11
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+6",
        "damageType": "Bludgeoning",
        "attackBonus": 11
      }
    ]
  },
  {
    "id": "adult-red-dragon",
    "name": "Adult Red Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 19,
      "hp": 256,
      "hd": "19d12",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 17,
      "crLabel": "17",
      "str": 27,
      "dex": 10,
      "con": 25,
      "int": 16,
      "wis": 13,
      "cha": 21,
      "saves": "DEX +6, CON +13, WIS +7, CHA +11"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Fire Breath: The dragon exhales fire in a 60-foot cone. Each creature in that area must make a DC 21 Dexterity saving throw, taking 63 (18d6) fire damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 19,
        "success": "none"
      },
      {
        "name": "Fire Breath",
        "ability": "DEX",
        "dc": 21,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+8",
        "damageType": "Piercing",
        "attackBonus": 14,
        "note": "+ 2d6 fire"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+8",
        "damageType": "Slashing",
        "attackBonus": 14
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+8",
        "damageType": "Bludgeoning",
        "attackBonus": 14
      }
    ]
  },
  {
    "id": "adult-silver-dragon",
    "name": "Adult Silver Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 19,
      "hp": 243,
      "hd": "18d12",
      "speed": "40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 16,
      "crLabel": "16",
      "str": 27,
      "dex": 10,
      "con": 25,
      "int": 16,
      "wis": 13,
      "cha": 21,
      "saves": "DEX +5, CON +12, WIS +6, CHA +10"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 20 Constitution saving throw, taking 58 (13d8) cold damage on a failed save, or half as much damage on a successful one. Paralyzing Breath. The dragon exhales paralyzing gas in a 60-foot cone. Each creature in that area must succeed on a DC 20 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 18,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+8",
        "damageType": "Piercing",
        "attackBonus": 13
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+8",
        "damageType": "Slashing",
        "attackBonus": 13
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+8",
        "damageType": "Bludgeoning",
        "attackBonus": 13
      }
    ]
  },
  {
    "id": "adult-white-dragon",
    "name": "Adult White Dragon",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 18,
      "hp": 200,
      "hd": "16d12",
      "speed": "40 ft., burrow 30 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 13,
      "crLabel": "13",
      "str": 22,
      "dex": 10,
      "con": 22,
      "int": 8,
      "wis": 12,
      "cha": 12,
      "saves": "DEX +5, CON +11, WIS +6, CHA +6"
    },
    "abilities": [
      "Ice Walk: The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 ft. of the dragon and aware of it must succeed on a DC 14 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Cold Breath: The dragon exhales an icy blast in a 60-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 10 ft. of the dragon must succeed on a DC 19 Dexterity saving throw or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 14,
        "success": "none"
      },
      {
        "name": "Cold Breath",
        "ability": "CON",
        "dc": 19,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "attackBonus": 11,
        "note": "+ 1d8 cold"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 11
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+6",
        "damageType": "Bludgeoning",
        "attackBonus": 11
      }
    ]
  },
  {
    "id": "air-elemental",
    "name": "Air Elemental",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 15,
      "hp": 90,
      "hd": "12d10",
      "speed": "fly 90 ft., (hover)",
      "type": "Elemental",
      "cr": 5,
      "crLabel": "5",
      "str": 14,
      "dex": 20,
      "con": 14,
      "int": 6,
      "wis": 10,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Air Form: The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.",
      "Multiattack: The elemental makes two slam attacks.",
      "Whirlwind: Each creature in the elemental's space must make a DC 13 Strength saving throw. On a failure, a target takes 15 (3d8 + 2) bludgeoning damage and is flung up 20 feet away from the elemental in a random direction and knocked prone. If a thrown target strikes an object, such as a wall or floor, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 13 Dexterity saving throw or take the same damage and be knocked prone. If the saving throw is successful, the target takes half the bludgeoning damage and isn't flung away or knocked prone."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d8+5",
        "damageType": "Bludgeoning",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "ancient-black-dragon",
    "name": "Ancient Black Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 22,
      "hp": 367,
      "hd": "21d20",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 21,
      "crLabel": "21",
      "str": 27,
      "dex": 14,
      "con": 25,
      "int": 16,
      "wis": 15,
      "cha": 19,
      "saves": "DEX +9, CON +14, WIS +9, CHA +11"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Acid Breath: The dragon exhales acid in a 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 67 (15d8) acid damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 19,
        "success": "none"
      },
      {
        "name": "Acid Breath",
        "ability": "DEX",
        "dc": 22,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+8",
        "damageType": "Piercing",
        "attackBonus": 15,
        "note": "+ 2d8 acid"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+8",
        "damageType": "Slashing",
        "attackBonus": 15
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+8",
        "damageType": "Bludgeoning",
        "attackBonus": 15
      }
    ]
  },
  {
    "id": "ancient-blue-dragon",
    "name": "Ancient Blue Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 22,
      "hp": 481,
      "hd": "26d20",
      "speed": "40 ft., burrow 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 23,
      "crLabel": "23",
      "str": 29,
      "dex": 10,
      "con": 27,
      "int": 18,
      "wis": 17,
      "cha": 21,
      "saves": "DEX +7, CON +15, WIS +10, CHA +12"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Lightning Breath: The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6 + 9) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 20,
        "success": "none"
      },
      {
        "name": "Lightning Breath",
        "ability": "DEX",
        "dc": 23,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+9",
        "damageType": "Piercing",
        "attackBonus": 16,
        "note": "+ 2d10 lightning"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+9",
        "damageType": "Slashing",
        "attackBonus": 16
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+9",
        "damageType": "Bludgeoning",
        "attackBonus": 16
      }
    ]
  },
  {
    "id": "ancient-brass-dragon",
    "name": "Ancient Brass Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 20,
      "hp": 297,
      "hd": "17d20",
      "speed": "40 ft., burrow 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 20,
      "crLabel": "20",
      "str": 27,
      "dex": 10,
      "con": 25,
      "int": 16,
      "wis": 15,
      "cha": 19,
      "saves": "DEX +6, CON +13, WIS +8, CHA +10"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 18 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons: Fire Breath. The dragon exhales fire in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 21 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one. Sleep Breath. The dragon exhales sleep gas in a 90-foot cone. Each creature in that area must succeed on a DC 21 Constitution saving throw or fall unconscious for 10 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it.",
      "Change Shape: The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 18,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+8",
        "damageType": "Piercing",
        "attackBonus": 14
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+8",
        "damageType": "Slashing",
        "attackBonus": 14
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+8",
        "damageType": "Bludgeoning",
        "attackBonus": 14
      }
    ]
  },
  {
    "id": "ancient-bronze-dragon",
    "name": "Ancient Bronze Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 22,
      "hp": 444,
      "hd": "24d20",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 22,
      "crLabel": "22",
      "str": 29,
      "dex": 10,
      "con": 27,
      "int": 18,
      "wis": 17,
      "cha": 21,
      "saves": "DEX +7, CON +15, WIS +10, CHA +12"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 20 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 120-foot line that is 10 feet wide. Each creature in that line must make a DC 23 Dexterity saving throw, taking 88 (16d10) lightning damage on a failed save, or half as much damage on a successful one. Repulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 23 Strength saving throw. On a failed save, the creature is pushed 60 feet away from the dragon.",
      "Change Shape: The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 24 Dexterity saving throw or take 16 (2d6 + 9) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 20,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+9",
        "damageType": "Piercing",
        "attackBonus": 16
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+9",
        "damageType": "Slashing",
        "attackBonus": 16
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+9",
        "damageType": "Bludgeoning",
        "attackBonus": 16
      }
    ]
  },
  {
    "id": "ancient-copper-dragon",
    "name": "Ancient Copper Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 21,
      "hp": 350,
      "hd": "20d20",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 21,
      "crLabel": "21",
      "str": 27,
      "dex": 12,
      "con": 25,
      "int": 20,
      "wis": 17,
      "cha": 19,
      "saves": "DEX +8, CON +14, WIS +10, CHA +11"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 90-foot line that is 10 feet wide. Each creature in that line must make a DC 22 Dexterity saving throw, taking 63 (14d8) acid damage on a failed save, or half as much damage on a successful one. Slowing Breath. The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 22 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save.",
      "Change Shape: The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 19,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+8",
        "damageType": "Piercing",
        "attackBonus": 15
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+8",
        "damageType": "Slashing",
        "attackBonus": 15
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+8",
        "damageType": "Bludgeoning",
        "attackBonus": 15
      }
    ]
  },
  {
    "id": "ancient-gold-dragon",
    "name": "Ancient Gold Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 22,
      "hp": 546,
      "hd": "28d20",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 24,
      "crLabel": "24",
      "str": 30,
      "dex": 14,
      "con": 29,
      "int": 18,
      "wis": 17,
      "cha": 28,
      "saves": "DEX +9, CON +16, WIS +10, CHA +16"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 24 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 71 (13d10) fire damage on a failed save, or half as much damage on a successful one. Weakening Breath. The dragon exhales gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
      "Change Shape: The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 24,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+10",
        "damageType": "Piercing",
        "attackBonus": 17
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+10",
        "damageType": "Slashing",
        "attackBonus": 17
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+10",
        "damageType": "Bludgeoning",
        "attackBonus": 17
      }
    ]
  },
  {
    "id": "ancient-green-dragon",
    "name": "Ancient Green Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 21,
      "hp": 385,
      "hd": "22d20",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 22,
      "crLabel": "22",
      "str": 27,
      "dex": 12,
      "con": 25,
      "int": 20,
      "wis": 17,
      "cha": 19,
      "saves": "DEX +8, CON +14, WIS +10, CHA +11"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Poison Breath: The dragon exhales poisonous gas in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 77 (22d6) poison damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 23 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 19,
        "success": "none"
      },
      {
        "name": "Poison Breath",
        "ability": "CON",
        "dc": 22,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+8",
        "damageType": "Piercing",
        "attackBonus": 15,
        "note": "+ 3d6 poison"
      },
      {
        "name": "Claw",
        "diceExpr": "4d6+8",
        "damageType": "Slashing",
        "attackBonus": 15
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+8",
        "damageType": "Bludgeoning",
        "attackBonus": 15
      }
    ]
  },
  {
    "id": "ancient-red-dragon",
    "name": "Ancient Red Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 22,
      "hp": 546,
      "hd": "28d20",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 24,
      "crLabel": "24",
      "str": 30,
      "dex": 10,
      "con": 29,
      "int": 18,
      "wis": 15,
      "cha": 23,
      "saves": "DEX +7, CON +16, WIS +9, CHA +13"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Fire Breath: The dragon exhales fire in a 90-foot cone. Each creature in that area must make a DC 24 Dexterity saving throw, taking 91 (26d6) fire damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 21,
        "success": "none"
      },
      {
        "name": "Fire Breath",
        "ability": "DEX",
        "dc": 24,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+10",
        "damageType": "Piercing",
        "attackBonus": 17,
        "note": "+ 4d6 fire"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+10",
        "damageType": "Slashing",
        "attackBonus": 17
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+10",
        "damageType": "Bludgeoning",
        "attackBonus": 17
      }
    ]
  },
  {
    "id": "ancient-silver-dragon",
    "name": "Ancient Silver Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 22,
      "hp": 487,
      "hd": "25d20",
      "speed": "40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 23,
      "crLabel": "23",
      "str": 30,
      "dex": 10,
      "con": 29,
      "int": 18,
      "wis": 15,
      "cha": 23,
      "saves": "DEX +7, CON +16, WIS +9, CHA +13"
    },
    "abilities": [
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 21 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 24 Constitution saving throw, taking 67 (15d8) cold damage on a failed save, or half as much damage on a successful one. Paralyzing Breath. The dragon exhales paralyzing gas in a 90-foot cone. Each creature in that area must succeed on a DC 24 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success.",
      "Change Shape: The dragon magically polymorphs into a humanoid or beast that has a challenge rating no higher than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the dragon's choice). In a new form, the dragon retains its alignment, hit points, Hit Dice, ability to speak, proficiencies, Legendary Resistance, lair actions, and Intelligence, Wisdom, and Charisma scores, as well as this action. Its statistics and capabilities are otherwise replaced by those of the new form, except any class features or legendary actions of that form.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 25 Dexterity saving throw or take 17 (2d6 + 10) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 21,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+10",
        "damageType": "Piercing",
        "attackBonus": 17
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+10",
        "damageType": "Slashing",
        "attackBonus": 17
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+10",
        "damageType": "Bludgeoning",
        "attackBonus": 17
      }
    ]
  },
  {
    "id": "ancient-white-dragon",
    "name": "Ancient White Dragon",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 20,
      "hp": 333,
      "hd": "18d20",
      "speed": "40 ft., burrow 40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 20,
      "crLabel": "20",
      "str": 26,
      "dex": 10,
      "con": 26,
      "int": 10,
      "wis": 13,
      "cha": 14,
      "saves": "DEX +6, CON +14, WIS +7, CHA +8"
    },
    "abilities": [
      "Ice Walk: The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
      "Legendary Resistance: If the dragon fails a saving throw, it can choose to succeed instead.",
      "Multiattack: The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.",
      "Frightful Presence: Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours .",
      "Cold Breath: The dragon exhales an icy blast in a 90-foot cone. Each creature in that area must make a DC 22 Constitution saving throw, taking 72 (16d8) cold damage on a failed save, or half as much damage on a successful one.",
      "Detect (Legendary): The dragon makes a Wisdom (Perception) check.",
      "Tail Attack (Legendary): The dragon makes a tail attack.",
      "Wing Attack (Costs 2 Actions) (Legendary): The dragon beats its wings. Each creature within 15 ft. of the dragon must succeed on a DC 22 Dexterity saving throw or take 15 (2d6 + 8) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 16,
        "success": "none"
      },
      {
        "name": "Cold Breath",
        "ability": "CON",
        "dc": 22,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+8",
        "damageType": "Piercing",
        "attackBonus": 14,
        "note": "+ 2d8 cold"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+8",
        "damageType": "Slashing",
        "attackBonus": 14
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+8",
        "damageType": "Bludgeoning",
        "attackBonus": 14
      }
    ]
  },
  {
    "id": "androsphinx",
    "name": "Androsphinx",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 199,
      "hd": "19d10",
      "speed": "40 ft., fly 60 ft.",
      "type": "Monstrosity",
      "cr": 17,
      "crLabel": "17",
      "str": 22,
      "dex": 10,
      "con": 20,
      "int": 16,
      "wis": 18,
      "cha": 23,
      "saves": "DEX +6, CON +11, INT +9, WIS +10"
    },
    "abilities": [
      "Inscrutable: The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.",
      "Magic Weapons: The sphinx's weapon attacks are magical.",
      "Spellcasting: The sphinx is a 12th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 18, +10 to hit with spell attacks). It requires no material components to cast its spells. The sphinx has the following cleric spells prepared: - Cantrips (at will): sacred flame, spare the dying, thaumaturgy - 1st level (4 slots): command, detect evil and good, detect magic - 2nd level (3 slots): lesser restoration, zone of truth - 3rd level (3 slots): dispel magic, tongues - 4th level (3 slots): banishment, freedom of movement - 5th level (2 slots): flame strike, greater restoration - 6th level (1 slot): heroes' feast",
      "Multiattack: The sphinx makes two claw attacks.",
      "Roar: The sphinx emits a magical roar. Each time it roars before finishing a long rest, the roar is louder and the effect is different, as detailed below. Each creature within 500 feet of the sphinx and able to hear the roar must make a saving throw. First Roar. Each creature that fails a DC 18 Wisdom saving throw is frightened for 1 minute. A frightened creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Second Roar. Each creature that fails a DC 18 Wisdom saving throw is deafened and frightened for 1 minute. A frightened creature is paralyzed and can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Third Roar. Each creature makes a DC 18 Constitution saving throw. On a failed save, a creature takes 44 (8d10) thunder damage and is knocked prone. On a successful save, the creature takes half as much damage and isn't knocked prone.",
      "Claw Attack (Legendary): The sphinx makes one claw attack.",
      "Teleport (Costs 2 Actions) (Legendary): The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.",
      "Cast a Spell (Costs 3 Actions) (Legendary): The sphinx casts a spell from its list of prepared spells, using a spell slot as normal."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "2d10+6",
        "damageType": "Slashing",
        "attackBonus": 12
      }
    ]
  },
  {
    "id": "animated-armor",
    "name": "Animated Armor",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 18,
      "hp": 33,
      "hd": "6d8",
      "speed": "25 ft.",
      "type": "Construct",
      "cr": 1,
      "crLabel": "1",
      "str": 14,
      "dex": 11,
      "con": 13,
      "int": 1,
      "wis": 3,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Antimagic Susceptibility: The armor is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the armor must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.",
      "False Appearance: While the armor remains motionless, it is indistinguishable from a normal suit of armor.",
      "Multiattack: The armor makes two melee attacks."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "ankheg",
    "name": "Ankheg",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 39,
      "hd": "6d10",
      "speed": "30 ft., burrow 10 ft.",
      "type": "Monstrosity",
      "cr": 2,
      "crLabel": "2",
      "str": 17,
      "dex": 11,
      "con": 13,
      "int": 1,
      "wis": 13,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Acid Spray: The ankheg spits acid in a line that is 30 ft. long and 5 ft. wide, provided that it has no creature grappled. Each creature in that line must make a DC 13 Dexterity saving throw, taking 10 (3d6) acid damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Acid Spray",
        "ability": "DEX",
        "dc": 13,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5,
        "note": "+ 1d6 acid"
      }
    ]
  },
  {
    "id": "ape",
    "name": "Ape",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 19,
      "hd": "3d8",
      "speed": "30 ft., climb 30 ft.",
      "type": "Beast",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 16,
      "dex": 14,
      "con": 14,
      "int": 6,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The ape makes two fist attacks."
    ],
    "attacks": [
      {
        "name": "Fist",
        "diceExpr": "1d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      },
      {
        "name": "Rock",
        "diceExpr": "1d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "archmage",
    "name": "Archmage",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 99,
      "hd": "18d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 12,
      "crLabel": "12",
      "str": 10,
      "dex": 14,
      "con": 12,
      "int": 20,
      "wis": 15,
      "cha": 16,
      "saves": "INT +9, WIS +6"
    },
    "abilities": [
      "Magic Resistance: The archmage has advantage on saving throws against spells and other magical effects.",
      "Spellcasting: The archmage is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 17, +9 to hit with spell attacks). The archmage can cast disguise self and invisibility at will and has the following wizard spells prepared: - Cantrips (at will): fire bolt, light, mage hand, prestidigitation, shocking grasp - 1st level (4 slots): detect magic, identify, mage armor*, magic missile - 2nd level (3 slots): detect thoughts, mirror image, misty step - 3rd level (3 slots): counterspell, fly, lightning bolt - 4th level (3 slots): banishment, fire shield, stoneskin* - 5th level (3 slots): cone of cold, scrying, wall of force - 6th level (1 slot): globe of invulnerability - 7th level (1 slot): teleport - 8th level (1 slot): mind blank* - 9th level (1 slot): time stop * The archmage casts these spells on itself before combat."
    ],
    "attacks": [
      {
        "name": "Dagger",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "assassin",
    "name": "Assassin",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 78,
      "hd": "12d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 8,
      "crLabel": "8",
      "str": 11,
      "dex": 16,
      "con": 14,
      "int": 13,
      "wis": 11,
      "cha": 10,
      "saves": "DEX +6, INT +4"
    },
    "abilities": [
      "Assassinate: During its first turn, the assassin has advantage on attack rolls against any creature that hasn't taken a turn. Any hit the assassin scores against a surprised creature is a critical hit.",
      "Evasion: If the assassin is subjected to an effect that allows it to make a Dexterity saving throw to take only half damage, the assassin instead takes no damage if it succeeds on the saving throw, and only half damage if it fails.",
      "Sneak Attack (1/Turn): The assassin deals an extra 13 (4d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the assassin that isn't incapacitated and the assassin doesn't have disadvantage on the attack roll.",
      "Multiattack: The assassin makes two shortsword attacks."
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 6,
        "note": "+ 7d6 poison"
      },
      {
        "name": "Light Crossbow",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 6,
        "note": "+ 7d6 poison"
      }
    ]
  },
  {
    "id": "awakened-shrub",
    "name": "Awakened Shrub",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 9,
      "hp": 10,
      "hd": "3d6",
      "speed": "20 ft.",
      "type": "Plant",
      "cr": 0,
      "crLabel": "0",
      "str": 3,
      "dex": 8,
      "con": 11,
      "int": 10,
      "wis": 10,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "False Appearance: While the shrub remains motionless, it is indistinguishable from a normal shrub."
    ],
    "attacks": [
      {
        "name": "Rake",
        "diceExpr": "1d4-1",
        "damageType": "Slashing",
        "attackBonus": 1
      }
    ]
  },
  {
    "id": "awakened-tree",
    "name": "Awakened Tree",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 13,
      "hp": 59,
      "hd": "7d12",
      "speed": "20 ft.",
      "type": "Plant",
      "cr": 2,
      "crLabel": "2",
      "str": 19,
      "dex": 6,
      "con": 15,
      "int": 10,
      "wis": 10,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "False Appearance: While the tree remains motionless, it is indistinguishable from a normal tree."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "3d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "axe-beak",
    "name": "Axe Beak",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 19,
      "hd": "3d10",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 14,
      "dex": 12,
      "con": 12,
      "int": 2,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d8+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "azer",
    "name": "Azer",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 39,
      "hd": "6d8",
      "speed": "30 ft.",
      "type": "Elemental",
      "cr": 2,
      "crLabel": "2",
      "str": 17,
      "dex": 12,
      "con": 15,
      "int": 12,
      "wis": 13,
      "cha": 10,
      "saves": "CON +4"
    },
    "abilities": [
      "Heated Body: A creature that touches the azer or hits it with a melee attack while within 5 ft. of it takes 5 (1d10) fire damage.",
      "Heated Weapons: When the azer hits with a metal melee weapon, it deals an extra 3 (1d6) fire damage (included in the attack).",
      "Illumination: The azer sheds bright light in a 10-foot radius and dim light for an additional 10 ft.."
    ],
    "attacks": [
      {
        "name": "Warhammer",
        "diceExpr": "1d8+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5,
        "note": "+ 1d6 fire"
      }
    ]
  },
  {
    "id": "baboon",
    "name": "Baboon",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 3,
      "hd": "1d6",
      "speed": "30 ft., climb 30 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 8,
      "dex": 14,
      "con": 11,
      "int": 4,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Pack Tactics: The baboon has advantage on an attack roll against a creature if at least one of the baboon's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4-1",
        "damageType": "Piercing",
        "attackBonus": 1
      }
    ]
  },
  {
    "id": "badger",
    "name": "Badger",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 10,
      "hp": 3,
      "hd": "1d4",
      "speed": "20 ft., burrow 5 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 4,
      "dex": 11,
      "con": 12,
      "int": 2,
      "wis": 12,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The badger has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "balor",
    "name": "Balor",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 19,
      "hp": 262,
      "hd": "21d12",
      "speed": "40 ft., fly 80 ft.",
      "type": "Fiend (Demon)",
      "cr": 19,
      "crLabel": "19",
      "str": 26,
      "dex": 15,
      "con": 22,
      "int": 20,
      "wis": 16,
      "cha": 22,
      "saves": "STR +14, CON +12, WIS +9, CHA +12"
    },
    "abilities": [
      "Death Throes: When the balor dies, it explodes, and each creature within 30 feet of it must make a DC 20 Dexterity saving throw, taking 70 (20d6) fire damage on a failed save, or half as much damage on a successful one. The explosion ignites flammable objects in that area that aren't being worn or carried, and it destroys the balor's weapons.",
      "Fire Aura: At the start of each of the balor's turns, each creature within 5 feet of it takes 10 (3d6) fire damage, and flammable objects in the aura that aren't being worn or carried ignite. A creature that touches the balor or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.",
      "Magic Resistance: The balor has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The balor's weapon attacks are magical.",
      "Multiattack: The balor makes two attacks: one with its longsword and one with its whip.",
      "Teleport: The balor magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "3d8+8",
        "damageType": "Slashing",
        "attackBonus": 14,
        "note": "+ 3d8 lightning"
      },
      {
        "name": "Whip",
        "diceExpr": "2d6+8",
        "damageType": "Slashing",
        "attackBonus": 14,
        "note": "+ 3d6 fire"
      }
    ]
  },
  {
    "id": "bandit",
    "name": "Bandit",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 11,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 11,
      "dex": 12,
      "con": 12,
      "int": 10,
      "wis": 10,
      "cha": 10,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d6+1",
        "damageType": "Slashing",
        "attackBonus": 3
      },
      {
        "name": "Light Crossbow",
        "diceExpr": "1d8+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "bandit-captain",
    "name": "Bandit Captain",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 65,
      "hd": "10d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 2,
      "crLabel": "2",
      "str": 15,
      "dex": 16,
      "con": 14,
      "int": 14,
      "wis": 11,
      "cha": 14,
      "saves": "STR +4, DEX +5, WIS +2"
    },
    "abilities": [
      "Multiattack: The captain makes three melee attacks: two with its scimitar and one with its dagger. Or the captain makes two ranged attacks with its daggers."
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Dagger",
        "diceExpr": "1d4+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "barbed-devil",
    "name": "Barbed Devil",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 110,
      "hd": "13d8",
      "speed": "30 ft.",
      "type": "Fiend (Devil)",
      "cr": 5,
      "crLabel": "5",
      "str": 16,
      "dex": 17,
      "con": 18,
      "int": 12,
      "wis": 14,
      "cha": 14,
      "saves": "STR +6, CON +7, WIS +5, CHA +5"
    },
    "abilities": [
      "Barbed Hide: At the start of each of its turns, the barbed devil deals 5 (1d10) piercing damage to any creature grappling it.",
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The devil makes three melee attacks: one with its tail and two with its claws. Alternatively, it can use Hurl Flame twice."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Tail",
        "diceExpr": "2d6+3",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Hurl Flame",
        "diceExpr": "3d6",
        "damageType": "Fire",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "basilisk",
    "name": "Basilisk",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 52,
      "hd": "8d8",
      "speed": "20 ft.",
      "type": "Monstrosity",
      "cr": 3,
      "crLabel": "3",
      "str": 16,
      "dex": 8,
      "con": 15,
      "int": 2,
      "wis": 8,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Petrifying Gaze: If a creature starts its turn within 30 ft. of the basilisk and the two of them can see each other, the basilisk can force the creature to make a DC 12 Constitution saving throw if the basilisk isn't incapacitated. On a failed save, the creature magically begins to turn to stone and is restrained. It must repeat the saving throw at the end of its next turn. On a success, the effect ends. On a failure, the creature is petrified until freed by the greater restoration spell or other magic. A creature that isn't surprised can avert its eyes to avoid the saving throw at the start of its turn. If it does so, it can't see the basilisk until the start of its next turn, when it can avert its eyes again. If it looks at the basilisk in the meantime, it must immediately make the save. If the basilisk sees its reflection within 30 ft. of it in bright light, it mistakes itself for a rival and targets itself with its gaze."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+3",
        "damageType": "Piercing",
        "attackBonus": 5,
        "note": "+ 2d6 poison"
      }
    ]
  },
  {
    "id": "bat",
    "name": "Bat",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 12,
      "hp": 1,
      "hd": "1d4",
      "speed": "5 ft., fly 30 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 2,
      "dex": 15,
      "con": 8,
      "int": 2,
      "wis": 12,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Echolocation: The bat can't use its blindsight while deafened.",
      "Keen Hearing: The bat has advantage on Wisdom (Perception) checks that rely on hearing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 0
      }
    ]
  },
  {
    "id": "bearded-devil",
    "name": "Bearded Devil",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 52,
      "hd": "8d8",
      "speed": "30 ft.",
      "type": "Fiend (Devil)",
      "cr": 3,
      "crLabel": "3",
      "str": 16,
      "dex": 15,
      "con": 15,
      "int": 9,
      "wis": 11,
      "cha": 11,
      "saves": "STR +5, CON +4, WIS +2"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Steadfast: The devil can't be frightened while it can see an allied creature within 30 feet of it.",
      "Multiattack: The devil makes two attacks: one with its beard and one with its glaive."
    ],
    "attacks": [
      {
        "name": "Beard",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Glaive",
        "diceExpr": "1d10+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "behir",
    "name": "Behir",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 17,
      "hp": 168,
      "hd": "16d12",
      "speed": "50 ft., climb 40 ft.",
      "type": "Monstrosity",
      "cr": 11,
      "crLabel": "11",
      "str": 23,
      "dex": 16,
      "con": 18,
      "int": 7,
      "wis": 14,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The behir makes two attacks: one with its bite and one to constrict.",
      "Lightning Breath: The behir exhales a line of lightning that is 20 ft. long and 5 ft. wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 66 (12d10) lightning damage on a failed save, or half as much damage on a successful one.",
      "Swallow: The behir makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is also swallowed, and the grapple ends. While swallowed, the target is blinded and restrained, it has total cover against attacks and other effects outside the behir, and it takes 21 (6d6) acid damage at the start of each of the behir's turns. A behir can have only one creature swallowed at a time. If the behir takes 30 damage or more on a single turn from the swallowed creature, the behir must succeed on a DC 14 Constitution saving throw at the end of that turn or regurgitate the creature, which falls prone in a space within 10 ft. of the behir. If the behir dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 15 ft. of movement, exiting prone."
    ],
    "saves": [
      {
        "name": "Lightning Breath",
        "ability": "DEX",
        "dc": 16,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10+6",
        "damageType": "Piercing",
        "attackBonus": 10
      },
      {
        "name": "Constrict",
        "diceExpr": "2d10+6",
        "damageType": "Bludgeoning",
        "attackBonus": 10,
        "note": "+ 2d10+6 slashing"
      }
    ]
  },
  {
    "id": "berserker",
    "name": "Berserker",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 67,
      "hd": "9d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 2,
      "crLabel": "2",
      "str": 16,
      "dex": 12,
      "con": 17,
      "int": 9,
      "wis": 11,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Reckless: At the start of its turn, the berserker can gain advantage on all melee weapon attack rolls during that turn, but attack rolls against it have advantage until the start of its next turn."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "1d12+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "black-bear",
    "name": "Black Bear",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 19,
      "hd": "3d8",
      "speed": "40 ft., climb 30 ft.",
      "type": "Beast",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 15,
      "dex": 10,
      "con": 14,
      "int": 2,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The bear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: The bear makes two attacks: one with its bite and one with its claws."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 3
      },
      {
        "name": "Claws",
        "diceExpr": "2d4+2",
        "damageType": "Slashing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "black-dragon-wyrmling",
    "name": "Black Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 33,
      "hd": "6d8",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "type": "Dragon",
      "cr": 2,
      "crLabel": "2",
      "str": 15,
      "dex": 14,
      "con": 13,
      "int": 10,
      "wis": 11,
      "cha": 13,
      "saves": "DEX +4, CON +3, WIS +2, CHA +3"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Acid Breath: The dragon exhales acid in a 15-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 22 (5d8) acid damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Acid Breath",
        "ability": "DEX",
        "dc": 11,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4,
        "note": "+ 1d4 acid"
      }
    ]
  },
  {
    "id": "black-pudding",
    "name": "Black Pudding",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 7,
      "hp": 85,
      "hd": "10d10",
      "speed": "20 ft., climb 20 ft.",
      "type": "Ooze",
      "cr": 4,
      "crLabel": "4",
      "str": 16,
      "dex": 5,
      "con": 16,
      "int": 1,
      "wis": 6,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Amorphous: The pudding can move through a space as narrow as 1 inch wide without squeezing.",
      "Corrosive Form: A creature that touches the pudding or hits it with a melee attack while within 5 feet of it takes 4 (1d8) acid damage. Any nonmagical weapon made of metal or wood that hits the pudding corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal or wood that hits the pudding is destroyed after dealing damage. The pudding can eat through 2-inch-thick, nonmagical wood or metal in 1 round.",
      "Spider Climb: The pudding can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "1d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5,
        "note": "+ 4d8 acid"
      }
    ]
  },
  {
    "id": "blink-dog",
    "name": "Blink Dog",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 22,
      "hd": "4d8",
      "speed": "40 ft.",
      "type": "Fey",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 12,
      "dex": 17,
      "con": 12,
      "int": 10,
      "wis": 13,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The dog has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Teleport: The dog magically teleports, along with any equipment it is wearing or carrying, up to 40 ft. to an unoccupied space it can see. Before or after teleporting, the dog can make one bite attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "blood-hawk",
    "name": "Blood Hawk",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 7,
      "hd": "2d6",
      "speed": "10 ft., fly 60 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 6,
      "dex": 14,
      "con": 10,
      "int": 3,
      "wis": 14,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Keen Sight: The hawk has advantage on Wisdom (Perception) checks that rely on sight.",
      "Pack Tactics: The hawk has advantage on an attack roll against a creature if at least one of the hawk's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "blue-dragon-wyrmling",
    "name": "Blue Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 52,
      "hd": "8d8",
      "speed": "30 ft., burrow 15 ft., fly 60 ft.",
      "type": "Dragon",
      "cr": 3,
      "crLabel": "3",
      "str": 17,
      "dex": 10,
      "con": 15,
      "int": 12,
      "wis": 11,
      "cha": 15,
      "saves": "DEX +2, CON +4, WIS +2, CHA +4"
    },
    "abilities": [
      "Lightning Breath: The dragon exhales lightning in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Lightning Breath",
        "ability": "DEX",
        "dc": 12,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+3",
        "damageType": "Piercing",
        "attackBonus": 5,
        "note": "+ 1d6 lightning"
      }
    ]
  },
  {
    "id": "boar",
    "name": "Boar",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 11,
      "hd": "2d8",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 13,
      "dex": 11,
      "con": 12,
      "int": 2,
      "wis": 9,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Charge: If the boar moves at least 20 ft. straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 3 (1d6) slashing damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.",
      "Relentless: If the boar takes 7 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
    ],
    "attacks": [
      {
        "name": "Tusk",
        "diceExpr": "1d6+1",
        "damageType": "Slashing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "bone-devil",
    "name": "Bone Devil",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 19,
      "hp": 142,
      "hd": "15d10",
      "speed": "40 ft., fly 40 ft.",
      "type": "Fiend (Devil)",
      "cr": 9,
      "crLabel": "9",
      "str": 18,
      "dex": 16,
      "con": 18,
      "int": 13,
      "wis": 14,
      "cha": 16,
      "saves": "INT +5, WIS +6, CHA +7"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The devil makes three attacks: two with its claws and one with its sting."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d8+4",
        "damageType": "Slashing",
        "attackBonus": 8
      },
      {
        "name": "Sting",
        "diceExpr": "2d8+4",
        "damageType": "Piercing",
        "attackBonus": 8,
        "note": "+ 5d6 poison"
      }
    ]
  },
  {
    "id": "brass-dragon-wyrmling",
    "name": "Brass Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 16,
      "hd": "3d8",
      "speed": "30 ft., burrow 15 ft., fly 60 ft.",
      "type": "Dragon",
      "cr": 1,
      "crLabel": "1",
      "str": 15,
      "dex": 10,
      "con": 13,
      "int": 10,
      "wis": 11,
      "cha": 13,
      "saves": "DEX +2, CON +3, WIS +2, CHA +3"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 14 (4d6) fire damage on a failed save, or half as much damage on a successful one. Sleep Breath. The dragon exhales sleep gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw or fall unconscious for 1 minute. This effect ends for a creature if the creature takes damage or someone uses an action to wake it."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "bronze-dragon-wyrmling",
    "name": "Bronze Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 32,
      "hd": "5d8",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "type": "Dragon",
      "cr": 2,
      "crLabel": "2",
      "str": 17,
      "dex": 10,
      "con": 15,
      "int": 12,
      "wis": 11,
      "cha": 15,
      "saves": "DEX +2, CON +4, WIS +2, CHA +4"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 12 Dexterity saving throw, taking 16 (3d10) lightning damage on a failed save, or half as much damage on a successful one. Repulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 12 Strength saving throw. On a failed save, the creature is pushed 30 feet away from the dragon."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "brown-bear",
    "name": "Brown Bear",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 34,
      "hd": "4d10",
      "speed": "40 ft., climb 30 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 19,
      "dex": 10,
      "con": 16,
      "int": 2,
      "wis": 13,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The bear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: The bear makes two attacks: one with its bite and one with its claws."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+4",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Claws",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "bugbear",
    "name": "Bugbear",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 27,
      "hd": "5d8",
      "speed": "30 ft.",
      "type": "Humanoid (Goblinoid)",
      "cr": 1,
      "crLabel": "1",
      "str": 15,
      "dex": 14,
      "con": 13,
      "int": 8,
      "wis": 11,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Brute: A melee weapon deals one extra die of its damage when the bugbear hits with it (included in the attack).",
      "Surprise Attack: If the bugbear surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 7 (2d6) damage from the attack."
    ],
    "attacks": [
      {
        "name": "Morningstar",
        "diceExpr": "2d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Javelin",
        "diceExpr": "2d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "bulette",
    "name": "Bulette",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 94,
      "hd": "9d10",
      "speed": "40 ft., burrow 40 ft.",
      "type": "Monstrosity",
      "cr": 5,
      "crLabel": "5",
      "str": 19,
      "dex": 11,
      "con": 21,
      "int": 2,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Standing Leap: The bulette's long jump is up to 30 ft. and its high jump is up to 15 ft., with or without a running start.",
      "Deadly Leap: If the bulette jumps at least 15 ft. as part of its movement, it can then use this action to land on its feet in a space that contains one or more other creatures. Each of those creatures must succeed on a DC 16 Strength or Dexterity saving throw (target's choice) or be knocked prone and take 14 (3d6 + 4) bludgeoning damage plus 14 (3d6 + 4) slashing damage. On a successful save, the creature takes only half the damage, isn't knocked prone, and is pushed 5 ft. out of the bulette's space into an unoccupied space of the creature's choice. If no unoccupied space is within range, the creature instead falls prone in the bulette's space."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d12+4",
        "damageType": "Piercing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "camel",
    "name": "Camel",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 9,
      "hp": 15,
      "hd": "2d10",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 16,
      "dex": 8,
      "con": 14,
      "int": 2,
      "wis": 8,
      "cha": 5,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "cat",
    "name": "Cat",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 12,
      "hp": 2,
      "hd": "1d4",
      "speed": "40 ft., climb 30 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 3,
      "dex": 15,
      "con": 10,
      "int": 3,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The cat has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1",
        "damageType": "Slashing",
        "attackBonus": 0
      }
    ]
  },
  {
    "id": "centaur",
    "name": "Centaur",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 45,
      "hd": "6d10",
      "speed": "50 ft.",
      "type": "Monstrosity",
      "cr": 2,
      "crLabel": "2",
      "str": 18,
      "dex": 14,
      "con": 14,
      "int": 9,
      "wis": 13,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Charge: If the centaur moves at least 30 ft. straight toward a target and then hits it with a pike attack on the same turn, the target takes an extra 10 (3d6) piercing damage.",
      "Multiattack: The centaur makes two attacks: one with its pike and one with its hooves or two with its longbow."
    ],
    "attacks": [
      {
        "name": "Pike",
        "diceExpr": "1d10+4",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Hooves",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "chain-devil",
    "name": "Chain Devil",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 85,
      "hd": "10d8",
      "speed": "30 ft.",
      "type": "Fiend (Devil)",
      "cr": 8,
      "crLabel": "8",
      "str": 18,
      "dex": 15,
      "con": 18,
      "int": 11,
      "wis": 12,
      "cha": 14,
      "saves": "CON +7, WIS +4, CHA +5"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The devil makes two attacks with its chains.",
      "Animate Chains: Up to four chains the devil can see within 60 feet of it magically sprout razor-edged barbs and animate under the devil's control, provided that the chains aren't being worn or carried. Each animated chain is an object with AC 20, 20 hit points, resistance to piercing damage, and immunity to psychic and thunder damage. When the devil uses Multiattack on its turn, it can use each animated chain to make one additional chain attack. An animated chain can grapple one creature of its own but can't make attacks while grappling. An animated chain reverts to its inanimate state if reduced to 0 hit points or if the devil is incapacitated or dies."
    ],
    "attacks": [
      {
        "name": "Chain",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "chimera",
    "name": "Chimera",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 114,
      "hd": "12d10",
      "speed": "30 ft., fly 60 ft.",
      "type": "Monstrosity",
      "cr": 6,
      "crLabel": "6",
      "str": 19,
      "dex": 11,
      "con": 19,
      "int": 3,
      "wis": 14,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The chimera makes three attacks: one with its bite, one with its horns, and one with its claws. When its fire breath is available, it can use the breath in place of its bite or horns.",
      "Fire Breath: The dragon head exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 31 (7d8) fire damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Fire Breath",
        "ability": "DEX",
        "dc": 15,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Horns",
        "diceExpr": "1d12+4",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      },
      {
        "name": "Claws",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "chuul",
    "name": "Chuul",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 16,
      "hp": 93,
      "hd": "11d10",
      "speed": "30 ft., swim 30 ft.",
      "type": "Aberration",
      "cr": 4,
      "crLabel": "4",
      "str": 19,
      "dex": 10,
      "con": 16,
      "int": 5,
      "wis": 11,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The chuul can breathe air and water.",
      "Sense Magic: The chuul senses magic within 120 feet of it at will. This trait otherwise works like the detect magic spell but isn't itself magical.",
      "Multiattack: The chuul makes two pincer attacks. If the chuul is grappling a creature, the chuul can also use its tentacles once.",
      "Tentacles: One creature grappled by the chuul must succeed on a DC 13 Constitution saving throw or be poisoned for 1 minute. Until this poison ends, the target is paralyzed. The target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    "saves": [
      {
        "name": "Tentacles",
        "ability": "CON",
        "dc": 13,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Pincer",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "clay-golem",
    "name": "Clay Golem",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 133,
      "hd": "14d10",
      "speed": "20 ft.",
      "type": "Construct",
      "cr": 9,
      "crLabel": "9",
      "str": 20,
      "dex": 9,
      "con": 18,
      "int": 3,
      "wis": 8,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Acid Absorption: Whenever the golem is subjected to acid damage, it takes no damage and instead regains a number of hit points equal to the acid damage dealt.",
      "Berserk: Whenever the golem starts its turn with 60 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points.",
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Multiattack: The golem makes two slam attacks.",
      "Haste: Until the end of its next turn, the golem magically gains a +2 bonus to its AC, has advantage on Dexterity saving throws, and can use its slam attack as a bonus action."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d10+5",
        "damageType": "Bludgeoning",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "cloaker",
    "name": "Cloaker",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 78,
      "hd": "12d10",
      "speed": "10 ft., fly 40 ft.",
      "type": "Aberration",
      "cr": 8,
      "crLabel": "8",
      "str": 17,
      "dex": 15,
      "con": 12,
      "int": 13,
      "wis": 12,
      "cha": 14,
      "saves": ""
    },
    "abilities": [
      "Damage Transfer: While attached to a creature, the cloaker takes only half the damage dealt to it (rounded down). and that creature takes the other half.",
      "False Appearance: While the cloaker remains motionless without its underside exposed, it is indistinguishable from a dark leather cloak.",
      "Light Sensitivity: While in bright light, the cloaker has disadvantage on attack rolls and Wisdom (Perception) checks that rely on sight.",
      "Multiattack: The cloaker makes two attacks: one with its bite and one with its tail.",
      "Moan: Each creature within 60 feet of the cloaker that can hear its moan and that isn't an aberration must succeed on a DC 13 Wisdom saving throw or become frightened until the end of the cloaker's next turn. If a creature's saving throw is successful, the creature is immune to the cloaker's moan for the next 24 hours.",
      "Phantasms: The cloaker magically creates three illusory duplicates of itself if it isn't in bright light. The duplicates move with it and mimic its actions, shifting position so as to make it impossible to track which cloaker is the real one. If the cloaker is ever in an area of bright light, the duplicates disappear. Whenever any creature targets the cloaker with an attack or a harmful spell while a duplicate remains, that creature rolls randomly to determine whether it targets the cloaker or one of the duplicates. A creature is unaffected by this magical effect if it can't see or if it relies on senses other than sight. A duplicate has the cloaker's AC and uses its saving throws. If an attack hits a duplicate, or if a duplicate fails a saving throw against an effect that deals damage, the duplicate disappears."
    ],
    "saves": [
      {
        "name": "Moan",
        "ability": "WIS",
        "dc": 13,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+3",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Tail",
        "diceExpr": "1d8+3",
        "damageType": "Slashing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "cloud-giant",
    "name": "Cloud Giant",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 14,
      "hp": 200,
      "hd": "16d12",
      "speed": "40 ft.",
      "type": "Giant",
      "cr": 9,
      "crLabel": "9",
      "str": 27,
      "dex": 10,
      "con": 22,
      "int": 12,
      "wis": 16,
      "cha": 16,
      "saves": "CON +10, WIS +7, CHA +7"
    },
    "abilities": [
      "Keen Smell: The giant has advantage on Wisdom (Perception) checks that rely on smell.",
      "Innate Spellcasting: The giant's innate spellcasting ability is Charisma. It can innately cast the following spells, requiring no material components: At will: detect magic, fog cloud, light 3/day each: feather fall, fly, misty step, telekinesis 1/day each: control weather, gaseous form",
      "Multiattack: The giant makes two morningstar attacks."
    ],
    "attacks": [
      {
        "name": "Morningstar",
        "diceExpr": "3d8+8",
        "damageType": "Piercing",
        "attackBonus": 12
      },
      {
        "name": "Rock",
        "diceExpr": "4d10+8",
        "damageType": "Bludgeoning",
        "attackBonus": 12
      }
    ]
  },
  {
    "id": "cockatrice",
    "name": "Cockatrice",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 11,
      "hp": 27,
      "hd": "6d6",
      "speed": "20 ft., fly 40 ft.",
      "type": "Monstrosity",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 6,
      "dex": 12,
      "con": 12,
      "int": 2,
      "wis": 13,
      "cha": 5,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "commoner",
    "name": "Commoner",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 4,
      "hd": "1d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0,
      "crLabel": "0",
      "str": 10,
      "dex": 10,
      "con": 10,
      "int": 10,
      "wis": 10,
      "cha": 10,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Club",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "constrictor-snake",
    "name": "Constrictor Snake",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 13,
      "hd": "2d10",
      "speed": "30 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 15,
      "dex": 14,
      "con": 12,
      "int": 1,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Constrict",
        "diceExpr": "1d8+2",
        "damageType": "Bludgeoning",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "copper-dragon-wyrmling",
    "name": "Copper Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 22,
      "hd": "4d8",
      "speed": "30 ft., climb 30 ft., fly 60 ft.",
      "type": "Dragon",
      "cr": 1,
      "crLabel": "1",
      "str": 15,
      "dex": 12,
      "con": 13,
      "int": 14,
      "wis": 11,
      "cha": 13,
      "saves": "DEX +3, CON +3, WIS +2, CHA +3"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 20-foot line that is 5 feet wide. Each creature in that line must make a DC 11 Dexterity saving throw, taking 18 (4d8) acid damage on a failed save, or half as much damage on a successful one. Slowing Breath. The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 11 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "couatl",
    "name": "Couatl",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 19,
      "hp": 97,
      "hd": "13d8",
      "speed": "30 ft., fly 90 ft.",
      "type": "Celestial",
      "cr": 4,
      "crLabel": "4",
      "str": 16,
      "dex": 20,
      "con": 17,
      "int": 18,
      "wis": 20,
      "cha": 18,
      "saves": "CON +5, WIS +7, CHA +6"
    },
    "abilities": [
      "Innate Spellcasting: The couatl's spellcasting ability is Charisma (spell save DC 14). It can innately cast the following spells, requiring only verbal components: At will: detect evil and good, detect magic, detect thoughts 3/day each: bless, create food and water, cure wounds, lesser restoration, protection from poison, sanctuary, shield 1/day each: dream, greater restoration, scrying",
      "Magic Weapons: The couatl's weapon attacks are magical.",
      "Shielded Mind: The couatl is immune to scrying and to any effect that would sense its emotions, read its thoughts, or detect its location.",
      "Change Shape: The couatl magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the couatl's choice). In a new form, the couatl retains its game statistics and ability to speak, but its AC, movement modes, Strength, Dexterity, and other actions are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks. If the new form has a bite attack, the couatl can use its bite in that form."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+5",
        "damageType": "Piercing",
        "attackBonus": 8
      },
      {
        "name": "Constrict",
        "diceExpr": "2d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "crab",
    "name": "Crab",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 11,
      "hp": 2,
      "hd": "1d4",
      "speed": "20 ft., swim 20 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 2,
      "dex": 11,
      "con": 10,
      "int": 1,
      "wis": 8,
      "cha": 2,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The crab can breathe air and water."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1",
        "damageType": "Bludgeoning",
        "attackBonus": 0
      }
    ]
  },
  {
    "id": "crocodile",
    "name": "Crocodile",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 19,
      "hd": "3d10",
      "speed": "20 ft., swim 20 ft.",
      "type": "Beast",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 15,
      "dex": 10,
      "con": 13,
      "int": 2,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Hold Breath: The crocodile can hold its breath for 15 minutes."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "cult-fanatic",
    "name": "Cult Fanatic",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 22,
      "hd": "6d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 2,
      "crLabel": "2",
      "str": 11,
      "dex": 14,
      "con": 12,
      "int": 10,
      "wis": 13,
      "cha": 14,
      "saves": ""
    },
    "abilities": [
      "Dark Devotion: The fanatic has advantage on saving throws against being charmed or frightened.",
      "Spellcasting: The fanatic is a 4th-level spellcaster. Its spell casting ability is Wisdom (spell save DC 11, +3 to hit with spell attacks). The fanatic has the following cleric spells prepared: Cantrips (at will): light, sacred flame, thaumaturgy - 1st level (4 slots): command, inflict wounds, shield of faith - 2nd level (3 slots): hold person, spiritual weapon",
      "Multiattack: The fanatic makes two melee attacks."
    ],
    "attacks": [
      {
        "name": "Dagger",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "cultist",
    "name": "Cultist",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 9,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 11,
      "dex": 12,
      "con": 10,
      "int": 10,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Dark Devotion: The cultist has advantage on saving throws against being charmed or frightened."
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d6+1",
        "damageType": "Slashing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "darkmantle",
    "name": "Darkmantle",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 11,
      "hp": 22,
      "hd": "5d6",
      "speed": "10 ft., fly 30 ft.",
      "type": "Monstrosity",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 16,
      "dex": 12,
      "con": 13,
      "int": 2,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Echolocation: The darkmantle can't use its blindsight while deafened.",
      "False Appearance: While the darkmantle remains motionless, it is indistinguishable from a cave formation such as a stalactite or stalagmite.",
      "Darkness Aura: A 15-foot radius of magical darkness extends out from the darkmantle, moves with it, and spreads around corners. The darkness lasts as long as the darkmantle maintains concentration, up to 10 minutes (as if concentrating on a spell). Darkvision can't penetrate this darkness, and no natural light can illuminate it. If any of the darkness overlaps with an area of light created by a spell of 2nd level or lower, the spell creating the light is dispelled."
    ],
    "attacks": [
      {
        "name": "Crush",
        "diceExpr": "1d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "death-dog",
    "name": "Death Dog",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 39,
      "hd": "6d8",
      "speed": "40 ft.",
      "type": "Monstrosity",
      "cr": 1,
      "crLabel": "1",
      "str": 15,
      "dex": 14,
      "con": 14,
      "int": 3,
      "wis": 13,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Two-Headed: The dog has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, or knocked unconscious.",
      "Multiattack: The dog makes two bite attacks."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "deep-gnome-svirfneblin",
    "name": "Deep Gnome (Svirfneblin)",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 15,
      "hp": 16,
      "hd": "3d6",
      "speed": "20 ft.",
      "type": "Humanoid (Gnome)",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 15,
      "dex": 14,
      "con": 14,
      "int": 12,
      "wis": 10,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Stone Camouflage: The gnome has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
      "Gnome Cunning: The gnome has advantage on Intelligence, Wisdom, and Charisma saving throws against magic.",
      "Innate Spellcasting: The gnome's innate spellcasting ability is Intelligence (spell save DC 11). It can innately cast the following spells, requiring no material components: At will: nondetection (self only) 1/day each: blindness/deafness, blur, disguise self"
    ],
    "attacks": [
      {
        "name": "War Pick",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Poisoned Dart",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "deer",
    "name": "Deer",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 4,
      "hd": "1d8",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 11,
      "dex": 16,
      "con": 11,
      "int": 2,
      "wis": 14,
      "cha": 5,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "deva",
    "name": "Deva",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 136,
      "hd": "16d8",
      "speed": "30 ft., fly 90 ft.",
      "type": "Celestial",
      "cr": 10,
      "crLabel": "10",
      "str": 18,
      "dex": 18,
      "con": 18,
      "int": 17,
      "wis": 20,
      "cha": 20,
      "saves": "WIS +9, CHA +9"
    },
    "abilities": [
      "Angelic Weapons: The deva's weapon attacks are magical. When the deva hits with any weapon, the weapon deals an extra 4d8 radiant damage (included in the attack).",
      "Innate Spellcasting: The deva's spellcasting ability is Charisma (spell save DC 17). The deva can innately cast the following spells, requiring only verbal components: At will: detect evil and good 1/day each: commune, raise dead",
      "Magic Resistance: The deva has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The deva makes two melee attacks.",
      "Healing Touch: The deva touches another creature. The target magically regains 20 (4d8 + 2) hit points and is freed from any curse, disease, poison, blindness, or deafness.",
      "Change Shape: The deva magically polymorphs into a humanoid or beast that has a challenge rating equal to or less than its own, or back into its true form. It reverts to its true form if it dies. Any equipment it is wearing or carrying is absorbed or borne by the new form (the deva's choice). In a new form, the deva retains its game statistics and ability to speak, but its AC, movement modes, Strength, Dexterity, and special senses are replaced by those of the new form, and it gains any statistics and capabilities (except class features, legendary actions, and lair actions) that the new form has but that it lacks."
    ],
    "attacks": [
      {
        "name": "Mace",
        "diceExpr": "1d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 8,
        "note": "+ 4d8 radiant"
      }
    ]
  },
  {
    "id": "dire-wolf",
    "name": "Dire Wolf",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 37,
      "hd": "5d10",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 17,
      "dex": 15,
      "con": 15,
      "int": 3,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "djinni",
    "name": "Djinni",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 161,
      "hd": "14d10",
      "speed": "30 ft., fly 90 ft.",
      "type": "Elemental",
      "cr": 11,
      "crLabel": "11",
      "str": 21,
      "dex": 15,
      "con": 22,
      "int": 15,
      "wis": 16,
      "cha": 20,
      "saves": "DEX +6, WIS +7, CHA +9"
    },
    "abilities": [
      "Elemental Demise: If the djinni dies, its body disintegrates into a warm breeze, leaving behind only equipment the djinni was wearing or carrying.",
      "Innate Spellcasting: The djinni's innate spellcasting ability is Charisma (spell save DC 17, +9 to hit with spell attacks). It can innately cast the following spells, requiring no material components: At will: detect evil and good, detect magic, thunderwave 3/day each: create food and water (can create wine instead of water), tongues, wind walk 1/day each: conjure elemental (air elemental only), creation, gaseous form, invisibility, major image, plane shift",
      "Multiattack: The djinni makes three scimitar attacks.",
      "Create Whirlwind: A 5-foot-radius, 30-foot-tall cylinder of swirling air magically forms on a point the djinni can see within 120 feet of it. The whirlwind lasts as long as the djinni maintains concentration (as if concentrating on a spell). Any creature but the djinni that enters the whirlwind must succeed on a DC 18 Strength saving throw or be restrained by it. The djinni can move the whirlwind up to 60 feet as an action, and creatures restrained by the whirlwind move with it. The whirlwind ends if the djinni loses sight of it. A creature can use its action to free a creature restrained by the whirlwind, including itself, by succeeding on a DC 18 Strength check. If the check succeeds, the creature is no longer restrained and moves to the nearest space outside the whirlwind."
    ],
    "saves": [
      {
        "name": "Create Whirlwind",
        "ability": "STR",
        "dc": 18,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "2d6+5",
        "damageType": "Slashing",
        "attackBonus": 9,
        "note": "+ 1d6 lightning"
      }
    ]
  },
  {
    "id": "doppelganger",
    "name": "Doppelganger",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 52,
      "hd": "8d8",
      "speed": "30 ft.",
      "type": "Monstrosity (Shapechanger)",
      "cr": 3,
      "crLabel": "3",
      "str": 11,
      "dex": 18,
      "con": 14,
      "int": 11,
      "wis": 12,
      "cha": 14,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The doppelganger can use its action to polymorph into a Small or Medium humanoid it has seen, or back into its true form. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Ambusher: In the first round of combat, the doppelganger has advantage on attack rolls against any creature it has surprised.",
      "Surprise Attack: If the doppelganger surprises a creature and hits it with an attack during the first round of combat, the target takes an extra 10 (3d6) damage from the attack.",
      "Multiattack: The doppelganger makes two melee attacks.",
      "Read Thoughts: The doppelganger magically reads the surface thoughts of one creature within 60 ft. of it. The effect can penetrate barriers, but 3 ft. of wood or dirt, 2 ft. of stone, 2 inches of metal, or a thin sheet of lead blocks it. While the target is in range, the doppelganger can continue reading its thoughts, as long as the doppelganger's concentration isn't broken (as if concentrating on a spell). While reading the target's mind, the doppelganger has advantage on Wisdom (Insight) and Charisma (Deception, Intimidation, and Persuasion) checks against the target."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "1d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "draft-horse",
    "name": "Draft Horse",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 10,
      "hp": 19,
      "hd": "3d10",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 18,
      "dex": 10,
      "con": 12,
      "int": 2,
      "wis": 11,
      "cha": 7,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d4+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "dragon-turtle",
    "name": "Dragon Turtle",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 20,
      "hp": 341,
      "hd": "22d20",
      "speed": "20 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 17,
      "crLabel": "17",
      "str": 25,
      "dex": 10,
      "con": 20,
      "int": 10,
      "wis": 12,
      "cha": 12,
      "saves": "DEX +6, CON +11, WIS +7"
    },
    "abilities": [
      "Amphibious: The dragon turtle can breathe air and water.",
      "Multiattack: The dragon turtle makes three attacks: one with its bite and two with its claws. It can make one tail attack in place of its two claw attacks.",
      "Steam Breath: The dragon turtle exhales scalding steam in a 60-foot cone. Each creature in that area must make a DC 18 Constitution saving throw, taking 52 (15d6) fire damage on a failed save, or half as much damage on a successful one. Being underwater doesn't grant resistance against this damage."
    ],
    "saves": [
      {
        "name": "Steam Breath",
        "ability": "CON",
        "dc": 18,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d12+7",
        "damageType": "Piercing",
        "attackBonus": 13
      },
      {
        "name": "Claw",
        "diceExpr": "2d8+7",
        "damageType": "Slashing",
        "attackBonus": 13
      },
      {
        "name": "Tail",
        "diceExpr": "3d12+7",
        "damageType": "Bludgeoning",
        "attackBonus": 13
      }
    ]
  },
  {
    "id": "dretch",
    "name": "Dretch",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 11,
      "hp": 18,
      "hd": "4d6",
      "speed": "20 ft.",
      "type": "Fiend (Demon)",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 11,
      "dex": 11,
      "con": 12,
      "int": 5,
      "wis": 8,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The dretch makes two attacks: one with its bite and one with its claws.",
      "Fetid Cloud: A 10-foot radius of disgusting green gas extends out from the dretch. The gas spreads around corners, and its area is lightly obscured. It lasts for 1 minute or until a strong wind disperses it. Any creature that starts its turn in that area must succeed on a DC 11 Constitution saving throw or be poisoned until the start of its next turn. While poisoned in this way, the target can take either an action or a bonus action on its turn, not both, and can't take reactions."
    ],
    "saves": [
      {
        "name": "Fetid Cloud",
        "ability": "CON",
        "dc": 11,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing",
        "attackBonus": 2
      },
      {
        "name": "Claws",
        "diceExpr": "2d4",
        "damageType": "Slashing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "drider",
    "name": "Drider",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 19,
      "hp": 123,
      "hd": "13d10",
      "speed": "30 ft., climb 30 ft.",
      "type": "Monstrosity",
      "cr": 6,
      "crLabel": "6",
      "str": 16,
      "dex": 16,
      "con": 18,
      "int": 13,
      "wis": 14,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Fey Ancestry: The drider has advantage on saving throws against being charmed, and magic can't put the drider to sleep.",
      "Innate Spellcasting: The drider's innate spellcasting ability is Wisdom (spell save DC 13). The drider can innately cast the following spells, requiring no material components: At will: dancing lights 1/day each: darkness, faerie fire",
      "Spider Climb: The drider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Sunlight Sensitivity: While in sunlight, the drider has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Web Walker: The drider ignores movement restrictions caused by webbing.",
      "Multiattack: The drider makes three attacks, either with its longsword or its longbow. It can replace one of those attacks with a bite attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4",
        "damageType": "Piercing",
        "attackBonus": 6,
        "note": "+ 2d8 poison"
      },
      {
        "name": "Longsword",
        "diceExpr": "1d8+3",
        "damageType": "Slashing",
        "attackBonus": 6
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 6,
        "note": "+ 1d8 poison"
      }
    ]
  },
  {
    "id": "drow",
    "name": "Drow",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 13,
      "hd": "3d8",
      "speed": "30 ft.",
      "type": "Humanoid (Elf)",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 10,
      "dex": 14,
      "con": 10,
      "int": 11,
      "wis": 11,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Fey Ancestry: The drow has advantage on saving throws against being charmed, and magic can't put the drow to sleep.",
      "Innate Spellcasting: The drow's spellcasting ability is Charisma (spell save DC 11). It can innately cast the following spells, requiring no material components: At will: dancing lights 1/day each: darkness, faerie fire",
      "Sunlight Sensitivity: While in sunlight, the drow has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Hand Crossbow",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "druid",
    "name": "Druid",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 27,
      "hd": "5d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 2,
      "crLabel": "2",
      "str": 10,
      "dex": 12,
      "con": 13,
      "int": 12,
      "wis": 15,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Spellcasting: The druid is a 4th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 12, +4 to hit with spell attacks). It has the following druid spells prepared: - Cantrips (at will): druidcraft, produce flame, shillelagh - 1st level (4 slots): entangle, longstrider, speak with animals, thunderwave - 2nd level (3 slots): animal messenger, barkskin"
    ],
    "attacks": [
      {
        "name": "Quarterstaff",
        "diceExpr": "1d6",
        "damageType": "Bludgeoning",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "dryad",
    "name": "Dryad",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 22,
      "hd": "5d8",
      "speed": "30 ft.",
      "type": "Fey",
      "cr": 1,
      "crLabel": "1",
      "str": 10,
      "dex": 12,
      "con": 11,
      "int": 14,
      "wis": 15,
      "cha": 18,
      "saves": ""
    },
    "abilities": [
      "Innate Spellcasting: The dryad's innate spellcasting ability is Charisma (spell save DC 14). The dryad can innately cast the following spells, requiring no material components: At will: druidcraft 3/day each: entangle, goodberry 1/day each: barkskin, pass without trace, shillelagh",
      "Magic Resistance: The dryad has advantage on saving throws against spells and other magical effects.",
      "Speak with Beasts and Plants: The dryad can communicate with beasts and plants as if they shared a language.",
      "Tree Stride: Once on her turn, the dryad can use 10 ft. of her movement to step magically into one living tree within her reach and emerge from a second living tree within 60 ft. of the first tree, appearing in an unoccupied space within 5 ft. of the second tree. Both trees must be large or bigger.",
      "Fey Charm: The dryad targets one humanoid or beast that she can see within 30 feet of her. If the target can see the dryad, it must succeed on a DC 14 Wisdom saving throw or be magically charmed. The charmed creature regards the dryad as a trusted friend to be heeded and protected. Although the target isn't under the dryad's control, it takes the dryad's requests or actions in the most favorable way it can. Each time the dryad or its allies do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the dryad dies, is on a different plane of existence from the target, or ends the effect as a bonus action. If a target's saving throw is successful, the target is immune to the dryad's Fey Charm for the next 24 hours. The dryad can have no more than one humanoid and up to three beasts charmed at a time."
    ],
    "saves": [
      {
        "name": "Fey Charm",
        "ability": "WIS",
        "dc": 14,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Club",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "duergar",
    "name": "Duergar",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 26,
      "hd": "4d8",
      "speed": "25 ft.",
      "type": "Humanoid (Dwarf)",
      "cr": 1,
      "crLabel": "1",
      "str": 14,
      "dex": 11,
      "con": 14,
      "int": 11,
      "wis": 10,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Duergar Resilience: The duergar has advantage on saving throws against poison, spells, and illusions, as well as to resist being charmed or paralyzed.",
      "Sunlight Sensitivity: While in sunlight, the duergar has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Enlarge: For 1 minute, the duergar magically increases in size, along with anything it is wearing or carrying. While enlarged, the duergar is Large, doubles its damage dice on Strength-based weapon attacks (included in the attacks), and makes Strength checks and Strength saving throws with advantage. If the duergar lacks the room to become Large, it attains the maximum size possible in the space available.",
      "Invisibility: The duergar magically turns invisible until it attacks, casts a spell, or uses its Enlarge, or until its concentration is broken, up to 1 hour (as if concentrating on a spell). Any equipment the duergar wears or carries is invisible with it."
    ],
    "attacks": [
      {
        "name": "War Pick",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Javelin",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "dust-mephit",
    "name": "Dust Mephit",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 17,
      "hd": "5d6",
      "speed": "30 ft., fly 30 ft.",
      "type": "Elemental",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 5,
      "dex": 14,
      "con": 10,
      "int": 9,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Death Burst: When the mephit dies, it explodes in a burst of dust. Each creature within 5 ft. of it must then succeed on a DC 10 Constitution saving throw or be blinded for 1 minute. A blinded creature can repeat the saving throw on each of its turns, ending the effect on itself on a success.",
      "Innate Spellcasting: The mephit can innately cast sleep, requiring no material components. Its innate spellcasting ability is Charisma.",
      "Blinding Breath: The mephit exhales a 15-foot cone of blinding dust. Each creature in that area must succeed on a DC 10 Dexterity saving throw or be blinded for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    "saves": [
      {
        "name": "Blinding Breath",
        "ability": "DEX",
        "dc": 10,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "eagle",
    "name": "Eagle",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 3,
      "hd": "1d6",
      "speed": "10 ft., fly 60 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 6,
      "dex": 15,
      "con": 10,
      "int": 2,
      "wis": 14,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Sight: The eagle has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Talons",
        "diceExpr": "1d4+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "earth-elemental",
    "name": "Earth Elemental",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 126,
      "hd": "12d10",
      "speed": "30 ft., burrow 30 ft.",
      "type": "Elemental",
      "cr": 5,
      "crLabel": "5",
      "str": 20,
      "dex": 8,
      "con": 20,
      "int": 5,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Earth Glide: The elemental can burrow through nonmagical, unworked earth and stone. While doing so, the elemental doesn't disturb the material it moves through.",
      "Siege Monster: The elemental deals double damage to objects and structures.",
      "Multiattack: The elemental makes two slam attacks."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d8+5",
        "damageType": "Bludgeoning",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "efreeti",
    "name": "Efreeti",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 200,
      "hd": "16d10",
      "speed": "40 ft., fly 60 ft.",
      "type": "Elemental",
      "cr": 11,
      "crLabel": "11",
      "str": 22,
      "dex": 12,
      "con": 24,
      "int": 16,
      "wis": 15,
      "cha": 16,
      "saves": "INT +7, WIS +6, CHA +7"
    },
    "abilities": [
      "Elemental Demise: If the efreeti dies, its body disintegrates in a flash of fire and puff of smoke, leaving behind only equipment the djinni was wearing or carrying.",
      "Innate Spellcasting: The efreeti's innate spell casting ability is Charisma (spell save DC 15, +7 to hit with spell attacks). It can innately cast the following spells, requiring no material components: At will: detect magic 3/day: enlarge/reduce, tongues 1/day each: conjure elemental (fire elemental only), gaseous form, invisibility, major image, plane shift, wall of fire",
      "Multiattack: The efreeti makes two scimitar attacks or uses its Hurl Flame twice."
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 10,
        "note": "+ 2d6 fire"
      },
      {
        "name": "Hurl Flame",
        "diceExpr": "5d6",
        "damageType": "Fire",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "elephant",
    "name": "Elephant",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 12,
      "hp": 76,
      "hd": "8d12",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 4,
      "crLabel": "4",
      "str": 22,
      "dex": 9,
      "con": 17,
      "int": 3,
      "wis": 11,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Trampling Charge: If the elephant moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the elephant can make one stomp attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "3d8+6",
        "damageType": "Piercing",
        "attackBonus": 8
      },
      {
        "name": "Stomp",
        "diceExpr": "3d10+6",
        "damageType": "Bludgeoning",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "elk",
    "name": "Elk",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 10,
      "hp": 13,
      "hd": "2d10",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 16,
      "dex": 10,
      "con": 12,
      "int": 2,
      "wis": 10,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Charge: If the elk moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      },
      {
        "name": "Hooves",
        "diceExpr": "2d4+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "erinyes",
    "name": "Erinyes",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 18,
      "hp": 153,
      "hd": "18d8",
      "speed": "30 ft., fly 60 ft.",
      "type": "Fiend (Devil)",
      "cr": 12,
      "crLabel": "12",
      "str": 18,
      "dex": 16,
      "con": 18,
      "int": 14,
      "wis": 14,
      "cha": 18,
      "saves": "DEX +7, CON +8, WIS +6, CHA +8"
    },
    "abilities": [
      "Hellish Weapons: The erinyes's weapon attacks are magical and deal an extra 13 (3d8) poison damage on a hit (included in the attacks).",
      "Magic Resistance: The erinyes has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The erinyes makes three attacks"
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "1d8+4",
        "damageType": "Slashing",
        "attackBonus": 8,
        "note": "+ 3d8 poison"
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 7,
        "note": "+ 3d8 poison"
      }
    ]
  },
  {
    "id": "ettercap",
    "name": "Ettercap",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 44,
      "hd": "8d8",
      "speed": "30 ft., climb 30 ft.",
      "type": "Monstrosity",
      "cr": 2,
      "crLabel": "2",
      "str": 14,
      "dex": 15,
      "con": 13,
      "int": 7,
      "wis": 12,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Spider Climb: The ettercap can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the ettercap knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The ettercap ignores movement restrictions caused by webbing.",
      "Multiattack: The ettercap makes two attacks: one with its bite and one with its claws.",
      "Web: Ranged Weapon Attack: +4 to hit, range 30/60 ft., one Large or smaller creature. Hit: The creature is restrained by webbing. As an action, the restrained creature can make a DC 11 Strength check, escaping from the webbing on a success. The effect ends if the webbing is destroyed. The webbing has AC 10, 5 hit points, is vulnerable to fire damage and immune to bludgeoning damage."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4,
        "note": "+ 1d8 poison"
      },
      {
        "name": "Claws",
        "diceExpr": "2d4+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "ettin",
    "name": "Ettin",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 85,
      "hd": "10d10",
      "speed": "40 ft.",
      "type": "Giant",
      "cr": 4,
      "crLabel": "4",
      "str": 21,
      "dex": 8,
      "con": 17,
      "int": 6,
      "wis": 10,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Two Heads: The ettin has advantage on Wisdom (Perception) checks and on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious.",
      "Wakeful: When one of the ettin's heads is asleep, its other head is awake.",
      "Multiattack: The ettin makes two attacks: one with its battleaxe and one with its morningstar."
    ],
    "attacks": [
      {
        "name": "Battleaxe",
        "diceExpr": "2d8+5",
        "damageType": "Slashing",
        "attackBonus": 7
      },
      {
        "name": "Morningstar",
        "diceExpr": "2d8+5",
        "damageType": "Piercing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "fire-elemental",
    "name": "Fire Elemental",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 102,
      "hd": "12d10",
      "speed": "50 ft.",
      "type": "Elemental",
      "cr": 5,
      "crLabel": "5",
      "str": 10,
      "dex": 17,
      "con": 16,
      "int": 6,
      "wis": 10,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Fire Form: The elemental can move through a space as narrow as 1 inch wide without squeezing. A creature that touches the elemental or hits it with a melee attack while within 5 ft. of it takes 5 (1d10) fire damage. In addition, the elemental can enter a hostile creature's space and stop there. The first time it enters a creature's space on a turn, that creature takes 5 (1d10) fire damage and catches fire; until someone takes an action to douse the fire, the creature takes 5 (1d10) fire damage at the start of each of its turns.",
      "Illumination: The elemental sheds bright light in a 30-foot radius and dim light in an additional 30 ft..",
      "Water Susceptibility: For every 5 ft. the elemental moves in water, or for every gallon of water splashed on it, it takes 1 cold damage.",
      "Multiattack: The elemental makes two touch attacks."
    ],
    "attacks": [
      {
        "name": "Touch",
        "diceExpr": "2d6+3",
        "damageType": "Fire",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "fire-giant",
    "name": "Fire Giant",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 18,
      "hp": 162,
      "hd": "13d12",
      "speed": "30 ft.",
      "type": "Giant",
      "cr": 9,
      "crLabel": "9",
      "str": 25,
      "dex": 9,
      "con": 23,
      "int": 10,
      "wis": 14,
      "cha": 13,
      "saves": "DEX +3, CON +10, CHA +5"
    },
    "abilities": [
      "Multiattack: The giant makes two greatsword attacks."
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "6d6+7",
        "damageType": "Slashing",
        "attackBonus": 11
      },
      {
        "name": "Rock",
        "diceExpr": "4d10+7",
        "damageType": "Bludgeoning",
        "attackBonus": 11
      }
    ]
  },
  {
    "id": "flesh-golem",
    "name": "Flesh Golem",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 9,
      "hp": 93,
      "hd": "11d8",
      "speed": "30 ft.",
      "type": "Construct",
      "cr": 5,
      "crLabel": "5",
      "str": 19,
      "dex": 9,
      "con": 18,
      "int": 6,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Berserk: Whenever the golem starts its turn with 40 hit points or fewer, roll a d6. On a 6, the golem goes berserk. On each of its turns while berserk, the golem attacks the nearest creature it can see. If no creature is near enough to move to and attack, the golem attacks an object, with preference for an object smaller than itself. Once the golem goes berserk, it continues to do so until it is destroyed or regains all its hit points. The golem's creator, if within 60 feet of the berserk golem, can try to calm it by speaking firmly and persuasively. The golem must be able to hear its creator, who must take an action to make a DC 15 Charisma (Persuasion) check. If the check succeeds, the golem ceases being berserk. If it takes damage while still at 40 hit points or fewer, the golem might go berserk again.",
      "Aversion of Fire: If the golem takes fire damage, it has disadvantage on attack rolls and ability checks until the end of its next turn.",
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Lightning Absorption: Whenever the golem is subjected to lightning damage, it takes no damage and instead regains a number of hit points equal to the lightning damage dealt.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Multiattack: The golem makes two slam attacks."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "flying-snake",
    "name": "Flying Snake",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 14,
      "hp": 5,
      "hd": "2d4",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 4,
      "dex": 18,
      "con": 11,
      "int": 2,
      "wis": 12,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Flyby: The snake doesn't provoke opportunity attacks when it flies out of an enemy's reach."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 6,
        "note": "+ 3d4 poison"
      }
    ]
  },
  {
    "id": "flying-sword",
    "name": "Flying Sword",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 17,
      "hp": 17,
      "hd": "5d6",
      "speed": "0 ft., fly 50 ft., (hover)",
      "type": "Construct",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 12,
      "dex": 15,
      "con": 11,
      "int": 1,
      "wis": 5,
      "cha": 1,
      "saves": "DEX +4"
    },
    "abilities": [
      "Antimagic Susceptibility: The sword is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the sword must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.",
      "False Appearance: While the sword remains motionless and isn't flying, it is indistinguishable from a normal sword."
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "1d8+1",
        "damageType": "Slashing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "frog",
    "name": "Frog",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 11,
      "hp": 1,
      "hd": "1d4",
      "speed": "20 ft., swim 20 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 1,
      "dex": 13,
      "con": 8,
      "int": 1,
      "wis": 8,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The frog can breathe air and water",
      "Standing Leap: The frog's long jump is up to 10 ft. and its high jump is up to 5 ft., with or without a running start."
    ]
  },
  {
    "id": "frost-giant",
    "name": "Frost Giant",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 15,
      "hp": 138,
      "hd": "12d12",
      "speed": "40 ft.",
      "type": "Giant",
      "cr": 8,
      "crLabel": "8",
      "str": 23,
      "dex": 9,
      "con": 21,
      "int": 9,
      "wis": 10,
      "cha": 12,
      "saves": "CON +8, WIS +3, CHA +4"
    },
    "abilities": [
      "Multiattack: The giant makes two greataxe attacks."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "3d12+6",
        "damageType": "Slashing",
        "attackBonus": 9
      },
      {
        "name": "Rock",
        "diceExpr": "4d10+6",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "gargoyle",
    "name": "Gargoyle",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 52,
      "hd": "7d8",
      "speed": "30 ft., fly 60 ft.",
      "type": "Elemental",
      "cr": 2,
      "crLabel": "2",
      "str": 15,
      "dex": 11,
      "con": 16,
      "int": 6,
      "wis": 11,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "False Appearance: While the gargoyle remains motion less, it is indistinguishable from an inanimate statue.",
      "Multiattack: The gargoyle makes two attacks: one with its bite and one with its claws."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Claws",
        "diceExpr": "1d6+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "gelatinous-cube",
    "name": "Gelatinous Cube",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 6,
      "hp": 84,
      "hd": "8d10",
      "speed": "15 ft.",
      "type": "Ooze",
      "cr": 2,
      "crLabel": "2",
      "str": 14,
      "dex": 3,
      "con": 20,
      "int": 1,
      "wis": 6,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Ooze Cube: The cube takes up its entire space. Other creatures can enter the space, but a creature that does so is subjected to the cube's Engulf and has disadvantage on the saving throw. Creatures inside the cube can be seen but have total cover. A creature within 5 feet of the cube can take an action to pull a creature or object out of the cube. Doing so requires a successful DC 12 Strength check, and the creature making the attempt takes 10 (3d6) acid damage. The cube can hold only one Large creature or up to four Medium or smaller creatures inside it at a time.",
      "Transparent: Even when the cube is in plain sight, it takes a successful DC 15 Wisdom (Perception) check to spot a cube that has neither moved nor attacked. A creature that tries to enter the cube's space while unaware of the cube is surprised by the cube.",
      "Engulf: The cube moves up to its speed. While doing so, it can enter Large or smaller creatures' spaces. Whenever the cube enters a creature's space, the creature must make a DC 12 Dexterity saving throw. On a successful save, the creature can choose to be pushed 5 feet back or to the side of the cube. A creature that chooses not to be pushed suffers the consequences of a failed saving throw. On a failed save, the cube enters the creature's space, and the creature takes 10 (3d6) acid damage and is engulfed. The engulfed creature can't breathe, is restrained, and takes 21 (6d6) acid damage at the start of each of the cube's turns. When the cube moves, the engulfed creature moves with it. An engulfed creature can try to escape by taking an action to make a DC 12 Strength check. On a success, the creature escapes and enters a space of its choice within 5 feet of the cube."
    ],
    "saves": [
      {
        "name": "Engulf",
        "ability": "DEX",
        "dc": 12,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "3d6",
        "damageType": "Acid",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "ghast",
    "name": "Ghast",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 36,
      "hd": "8d8",
      "speed": "30 ft.",
      "type": "Undead",
      "cr": 2,
      "crLabel": "2",
      "str": 16,
      "dex": 17,
      "con": 10,
      "int": 11,
      "wis": 10,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Stench: Any creature that starts its turn within 5 ft. of the ghast must succeed on a DC 10 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the ghast's Stench for 24 hours.",
      "Turn Defiance: The ghast and any ghouls within 30 ft. of it have advantage on saving throws against effects that turn undead."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d8+3",
        "damageType": "Piercing",
        "attackBonus": 3
      },
      {
        "name": "Claws",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "ghost",
    "name": "Ghost",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 45,
      "hd": "10d8",
      "speed": "0 ft., fly 40 ft., (hover)",
      "type": "Undead",
      "cr": 4,
      "crLabel": "4",
      "str": 7,
      "dex": 13,
      "con": 10,
      "int": 10,
      "wis": 12,
      "cha": 17,
      "saves": ""
    },
    "abilities": [
      "Ethereal Sight: The ghost can see 60 ft. into the Ethereal Plane when it is on the Material Plane, and vice versa.",
      "Incorporeal Movement: The ghost can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Etherealness: The ghost enters the Ethereal Plane from the Material Plane, or vice versa. It is visible on the Material Plane while it is in the Border Ethereal, and vice versa, yet it can't affect or be affected by anything on the other plane.",
      "Horrifying Visage: Each non-undead creature within 60 ft. of the ghost that can see it must succeed on a DC 13 Wisdom saving throw or be frightened for 1 minute. If the save fails by 5 or more, the target also ages 1d4 × 10 years. A frightened target can repeat the saving throw at the end of each of its turns, ending the frightened condition on itself on a success. If a target's saving throw is successful or the effect ends for it, the target is immune to this ghost's Horrifying Visage for the next 24 hours. The aging effect can be reversed with a greater restoration spell, but only within 24 hours of it occurring.",
      "Possession: One humanoid that the ghost can see within 5 ft. of it must succeed on a DC 13 Charisma saving throw or be possessed by the ghost; the ghost then disappears, and the target is incapacitated and loses control of its body. The ghost now controls the body but doesn't deprive the target of awareness. The ghost can't be targeted by any attack, spell, or other effect, except ones that turn undead, and it retains its alignment, Intelligence, Wisdom, Charisma, and immunity to being charmed and frightened. It otherwise uses the possessed target's statistics, but doesn't gain access to the target's knowledge, class features, or proficiencies. The possession lasts until the body drops to 0 hit points, the ghost ends it as a bonus action, or the ghost is turned or forced out by an effect like the dispel evil and good spell. When the possession ends, the ghost reappears in an unoccupied space within 5 ft. of the body. The target is immune to this ghost's Possession for 24 hours after succeeding on the saving throw or after the possession ends."
    ],
    "saves": [
      {
        "name": "Horrifying Visage",
        "ability": "WIS",
        "dc": 13,
        "success": "none"
      },
      {
        "name": "Possession",
        "ability": "CHA",
        "dc": 13,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Withering Touch",
        "diceExpr": "4d6+3",
        "damageType": "Necrotic",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "ghoul",
    "name": "Ghoul",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "5d8",
      "speed": "30 ft.",
      "type": "Undead",
      "cr": 1,
      "crLabel": "1",
      "str": 13,
      "dex": 15,
      "con": 10,
      "int": 7,
      "wis": 10,
      "cha": 6,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+2",
        "damageType": "Piercing",
        "attackBonus": 2
      },
      {
        "name": "Claws",
        "diceExpr": "2d4+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-ape",
    "name": "Giant Ape",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 12,
      "hp": 157,
      "hd": "15d12",
      "speed": "40 ft., climb 40 ft.",
      "type": "Beast",
      "cr": 7,
      "crLabel": "7",
      "str": 23,
      "dex": 14,
      "con": 18,
      "int": 7,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The ape makes two fist attacks."
    ],
    "attacks": [
      {
        "name": "Fist",
        "diceExpr": "3d10+6",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      },
      {
        "name": "Rock",
        "diceExpr": "7d6+6",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "giant-badger",
    "name": "Giant Badger",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 13,
      "hd": "2d8",
      "speed": "30 ft., burrow 10 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 13,
      "dex": 10,
      "con": 15,
      "int": 2,
      "wis": 12,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The badger has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: The badger makes two attacks: one with its bite and one with its claws."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing",
        "attackBonus": 3
      },
      {
        "name": "Claws",
        "diceExpr": "2d4+1",
        "damageType": "Slashing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "giant-bat",
    "name": "Giant Bat",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 22,
      "hd": "4d10",
      "speed": "10 ft., fly 60 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 15,
      "dex": 16,
      "con": 11,
      "int": 2,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Echolocation: The bat can't use its blindsight while deafened.",
      "Keen Hearing: The bat has advantage on Wisdom (Perception) checks that rely on hearing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-boar",
    "name": "Giant Boar",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 42,
      "hd": "5d10",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 2,
      "crLabel": "2",
      "str": 17,
      "dex": 10,
      "con": 16,
      "int": 2,
      "wis": 7,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Charge: If the boar moves at least 20 ft. straight toward a target and then hits it with a tusk attack on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
      "Relentless: If the boar takes 10 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
    ],
    "attacks": [
      {
        "name": "Tusk",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "giant-centipede",
    "name": "Giant Centipede",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 13,
      "hp": 4,
      "hd": "1d6",
      "speed": "30 ft., climb 30 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 5,
      "dex": 14,
      "con": 12,
      "int": 1,
      "wis": 7,
      "cha": 3,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-constrictor-snake",
    "name": "Giant Constrictor Snake",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 12,
      "hp": 60,
      "hd": "8d12",
      "speed": "30 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 2,
      "crLabel": "2",
      "str": 19,
      "dex": 14,
      "con": 12,
      "int": 1,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Constrict",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "giant-crab",
    "name": "Giant Crab",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 13,
      "hd": "3d8",
      "speed": "30 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 13,
      "dex": 15,
      "con": 11,
      "int": 1,
      "wis": 9,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The crab can breathe air and water."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d6+1",
        "damageType": "Bludgeoning",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "giant-crocodile",
    "name": "Giant Crocodile",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 14,
      "hp": 85,
      "hd": "9d12",
      "speed": "30 ft., swim 50 ft.",
      "type": "Beast",
      "cr": 5,
      "crLabel": "5",
      "str": 21,
      "dex": 9,
      "con": 17,
      "int": 2,
      "wis": 10,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Hold Breath: The crocodile can hold its breath for 30 minutes.",
      "Multiattack: The crocodile makes two attacks: one with its bite and one with its tail."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10+5",
        "damageType": "Piercing",
        "attackBonus": 8
      },
      {
        "name": "Tail",
        "diceExpr": "2d8+5",
        "damageType": "Bludgeoning",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "giant-eagle",
    "name": "Giant Eagle",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 26,
      "hd": "4d10",
      "speed": "10 ft., fly 80 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 16,
      "dex": 17,
      "con": 13,
      "int": 8,
      "wis": 14,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Keen Sight: The eagle has advantage on Wisdom (Perception) checks that rely on sight.",
      "Multiattack: The eagle makes two attacks: one with its beak and one with its talons."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Talons",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "giant-elk",
    "name": "Giant Elk",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 14,
      "hp": 42,
      "hd": "5d12",
      "speed": "60 ft.",
      "type": "Beast",
      "cr": 2,
      "crLabel": "2",
      "str": 19,
      "dex": 16,
      "con": 14,
      "int": 7,
      "wis": 14,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Charge: If the elk moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be knocked prone."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      },
      {
        "name": "Hooves",
        "diceExpr": "4d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "giant-fire-beetle",
    "name": "Giant Fire Beetle",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 13,
      "hp": 4,
      "hd": "1d6",
      "speed": "30 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 8,
      "dex": 10,
      "con": 12,
      "int": 1,
      "wis": 7,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Illumination: The beetle sheds bright light in a 10-foot radius and dim light for an additional 10 ft.."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6-1",
        "damageType": "Slashing",
        "attackBonus": 1
      }
    ]
  },
  {
    "id": "giant-frog",
    "name": "Giant Frog",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 18,
      "hd": "4d8",
      "speed": "30 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 12,
      "dex": 13,
      "con": 11,
      "int": 2,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The frog can breathe air and water",
      "Standing Leap: The frog's long jump is up to 20 ft. and its high jump is up to 10 ft., with or without a running start.",
      "Swallow: The frog makes one bite attack against a Small or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the frog, and it takes 5 (2d4) acid damage at the start of each of the frog's turns. The frog can have only one target swallowed at a time. If the frog dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 5 ft. of movement, exiting prone."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "giant-goat",
    "name": "Giant Goat",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 19,
      "hd": "3d10",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 17,
      "dex": 11,
      "con": 12,
      "int": 3,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Charge: If the goat moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 5 (2d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
      "Sure-Footed: The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "2d4+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "giant-hyena",
    "name": "Giant Hyena",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 45,
      "hd": "6d10",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 16,
      "dex": 14,
      "con": 14,
      "int": 2,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Rampage: When the hyena reduces a creature to 0 hit points with a melee attack on its turn, the hyena can take a bonus action to move up to half its speed and make a bite attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "giant-lizard",
    "name": "Giant Lizard",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 19,
      "hd": "3d10",
      "speed": "30 ft., climb 30 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 15,
      "dex": 12,
      "con": 13,
      "int": 2,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-octopus",
    "name": "Giant Octopus",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 52,
      "hd": "8d10",
      "speed": "10 ft., swim 60 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 17,
      "dex": 13,
      "con": 13,
      "int": 4,
      "wis": 10,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Hold Breath: While out of water, the octopus can hold its breath for 1 hour.",
      "Underwater Camouflage: The octopus has advantage on Dexterity (Stealth) checks made while underwater.",
      "Water Breathing: The octopus can breathe only underwater.",
      "Ink Cloud: A 20-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action."
    ],
    "attacks": [
      {
        "name": "Tentacles",
        "diceExpr": "2d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "giant-owl",
    "name": "Giant Owl",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 19,
      "hd": "3d10",
      "speed": "5 ft., fly 60 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 13,
      "dex": 15,
      "con": 12,
      "int": 8,
      "wis": 13,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Flyby: The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
      "Keen Hearing and Sight: The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
    ],
    "attacks": [
      {
        "name": "Talons",
        "diceExpr": "2d6+1",
        "damageType": "Slashing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "giant-poisonous-snake",
    "name": "Giant Poisonous Snake",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 11,
      "hd": "2d8",
      "speed": "30 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 10,
      "dex": 18,
      "con": 13,
      "int": 2,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "giant-rat",
    "name": "Giant Rat",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 7,
      "hd": "2d6",
      "speed": "30 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 7,
      "dex": 15,
      "con": 11,
      "int": 2,
      "wis": 10,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The rat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pack Tactics: The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-rat-diseased",
    "name": "Giant Rat (Diseased)",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 7,
      "hd": "2d6",
      "speed": "30 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 7,
      "dex": 15,
      "con": 11,
      "int": 2,
      "wis": 10,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The rat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pack Tactics: The rat has advantage on an attack roll against a creature if at least one of the rat's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-scorpion",
    "name": "Giant Scorpion",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 15,
      "hp": 52,
      "hd": "7d10",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 3,
      "crLabel": "3",
      "str": 15,
      "dex": 13,
      "con": 15,
      "int": 1,
      "wis": 9,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The scorpion makes three attacks: two with its claws and one with its sting."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "1d8+2",
        "damageType": "Bludgeoning",
        "attackBonus": 4
      },
      {
        "name": "Sting",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-sea-horse",
    "name": "Giant Sea Horse",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 16,
      "hd": "3d10",
      "speed": "0 ft., swim 40 ft.",
      "type": "Beast",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 12,
      "dex": 15,
      "con": 11,
      "int": 2,
      "wis": 12,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Charge: If the sea horse moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 7 (2d6) bludgeoning damage. If the target is a creature, it must succeed on a DC 11 Strength saving throw or be knocked prone.",
      "Water Breathing: The sea horse can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d6+1",
        "damageType": "Bludgeoning",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "giant-shark",
    "name": "Giant Shark",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 13,
      "hp": 126,
      "hd": "11d12",
      "speed": "swim 50 ft.",
      "type": "Beast",
      "cr": 5,
      "crLabel": "5",
      "str": 23,
      "dex": 11,
      "con": 21,
      "int": 1,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Blood Frenzy: The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Water Breathing: The shark can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d10+6",
        "damageType": "Piercing",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "giant-spider",
    "name": "Giant Spider",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 26,
      "hd": "4d10",
      "speed": "30 ft., climb 30 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 14,
      "dex": 16,
      "con": 12,
      "int": 2,
      "wis": 11,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Spider Climb: The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The spider ignores movement restrictions caused by webbing.",
      "Web: Ranged Weapon Attack: +5 to hit, range 30/60 ft., one creature. Hit: The target is restrained by webbing. As an action, the restrained target can make a DC 12 Strength check, bursting the webbing on a success. The webbing can also be attacked and destroyed (AC 10; hp 5; vulnerability to fire damage; immunity to bludgeoning, poison, and psychic damage)."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "giant-toad",
    "name": "Giant Toad",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 39,
      "hd": "6d10",
      "speed": "20 ft., swim 40 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 15,
      "dex": 13,
      "con": 13,
      "int": 2,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The toad can breathe air and water",
      "Standing Leap: The toad's long jump is up to 20 ft. and its high jump is up to 10 ft., with or without a running start.",
      "Swallow: The toad makes one bite attack against a Medium or smaller target it is grappling. If the attack hits, the target is swallowed, and the grapple ends. The swallowed target is blinded and restrained, it has total cover against attacks and other effects outside the toad, and it takes 10 (3d6) acid damage at the start of each of the toad's turns. The toad can have only one target swallowed at a time. If the toad dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 5 feet of movement, exiting prone."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4,
        "note": "+ 1d10 poison"
      }
    ]
  },
  {
    "id": "giant-vulture",
    "name": "Giant Vulture",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 10,
      "hp": 22,
      "hd": "3d10",
      "speed": "10 ft., fly 60 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 15,
      "dex": 10,
      "con": 15,
      "int": 6,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Sight and Smell: The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell.",
      "Pack Tactics: The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Multiattack: The vulture makes two attacks: one with its beak and one with its talons."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "2d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Talons",
        "diceExpr": "2d6+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-wasp",
    "name": "Giant Wasp",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 13,
      "hd": "3d8",
      "speed": "10 ft., fly 50 ft., swim 50 ft.",
      "type": "Beast",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 10,
      "dex": 14,
      "con": 10,
      "int": 1,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Sting",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "giant-weasel",
    "name": "Giant Weasel",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 9,
      "hd": "2d8",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 11,
      "dex": 16,
      "con": 10,
      "int": 4,
      "wis": 12,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "giant-wolf-spider",
    "name": "Giant Wolf Spider",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 11,
      "hd": "2d8",
      "speed": "40 ft., climb 40 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 12,
      "dex": 16,
      "con": 13,
      "int": 3,
      "wis": 12,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Spider Climb: The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The spider ignores movement restrictions caused by webbing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "gibbering-mouther",
    "name": "Gibbering Mouther",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 9,
      "hp": 67,
      "hd": "9d8",
      "speed": "10 ft., swim 10 ft.",
      "type": "Aberration",
      "cr": 2,
      "crLabel": "2",
      "str": 10,
      "dex": 8,
      "con": 16,
      "int": 3,
      "wis": 10,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Aberrant Ground: The ground in a 10-foot radius around the mouther is doughlike difficult terrain. Each creature that starts its turn in that area must succeed on a DC 10 Strength saving throw or have its speed reduced to 0 until the start of its next turn.",
      "Gibbering: The mouther babbles incoherently while it can see any creature and isn't incapacitated. Each creature that starts its turn within 20 feet of the mouther and can hear the gibbering must succeed on a DC 10 Wisdom saving throw. On a failure, the creature can't take reactions until the start of its next turn and rolls a d8 to determine what it does during its turn. On a 1 to 4, the creature does nothing. On a 5 or 6, the creature takes no action or bonus action and uses all its movement to move in a randomly determined direction. On a 7 or 8, the creature makes a melee attack against a randomly determined creature within its reach or does nothing if it can't make such an attack.",
      "Multiattack: The gibbering mouther makes one bite attack and, if it can, uses its Blinding Spittle.",
      "Blinding Spittle: The mouther spits a chemical glob at a point it can see within 15 feet of it. The glob explodes in a blinding flash of light on impact. Each creature within 5 feet of the flash must succeed on a DC 13 Dexterity saving throw or be blinded until the end of the mouther's next turn."
    ],
    "saves": [
      {
        "name": "Blinding Spittle",
        "ability": "DEX",
        "dc": 13,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "5d6",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "glabrezu",
    "name": "Glabrezu",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 157,
      "hd": "15d10",
      "speed": "40 ft.",
      "type": "Fiend (Demon)",
      "cr": 9,
      "crLabel": "9",
      "str": 20,
      "dex": 15,
      "con": 21,
      "int": 19,
      "wis": 17,
      "cha": 16,
      "saves": "STR +9, CON +9, WIS +7, CHA +7"
    },
    "abilities": [
      "Innate Spellcasting: The glabrezu's spellcasting ability is Intelligence (spell save DC 16). The glabrezu can innately cast the following spells, requiring no material components: At will: darkness, detect magic, dispel magic 1/day each: confusion, fly, power word stun",
      "Magic Resistance: The glabrezu has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The glabrezu makes four attacks: two with its pincers and two with its fists. Alternatively, it makes two attacks with its pincers and casts one spell."
    ],
    "attacks": [
      {
        "name": "Pincer",
        "diceExpr": "2d10+5",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      },
      {
        "name": "Fist",
        "diceExpr": "2d4+2",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "gladiator",
    "name": "Gladiator",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 112,
      "hd": "15d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 5,
      "crLabel": "5",
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 10,
      "wis": 12,
      "cha": 15,
      "saves": "STR +7, DEX +5, CON +6"
    },
    "abilities": [
      "Brave: The gladiator has advantage on saving throws against being frightened.",
      "Brute: A melee weapon deals one extra die of its damage when the gladiator hits with it (included in the attack).",
      "Multiattack: The gladiator makes three melee attacks or two ranged attacks."
    ],
    "attacks": [
      {
        "name": "Spear",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Shield Bash",
        "diceExpr": "2d4+4",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "gnoll",
    "name": "Gnoll",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 22,
      "hd": "5d8",
      "speed": "30 ft.",
      "type": "Humanoid (Gnoll)",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 14,
      "dex": 12,
      "con": 11,
      "int": 6,
      "wis": 10,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Rampage: When the gnoll reduces a creature to 0 hit points with a melee attack on its turn, the gnoll can take a bonus action to move up to half its speed and make a bite attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Spear",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "goat",
    "name": "Goat",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 4,
      "hd": "1d8",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 12,
      "dex": 10,
      "con": 11,
      "int": 2,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Charge: If the goat moves at least 20 ft. straight toward a target and then hits it with a ram attack on the same turn, the target takes an extra 2 (1d4) bludgeoning damage. If the target is a creature, it must succeed on a DC 10 Strength saving throw or be knocked prone.",
      "Sure-Footed: The goat has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "1d4+1",
        "damageType": "Bludgeoning",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "goblin",
    "name": "Goblin",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 15,
      "hp": 7,
      "hd": "2d6",
      "speed": "30 ft.",
      "type": "Humanoid (Goblinoid)",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 8,
      "dex": 14,
      "con": 10,
      "int": 10,
      "wis": 8,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Nimble Escape: The goblin can take the Disengage or Hide action as a bonus action on each of its turns."
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d6+2",
        "damageType": "Slashing",
        "attackBonus": 4
      },
      {
        "name": "Shortbow",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "gold-dragon-wyrmling",
    "name": "Gold Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 60,
      "hd": "8d8",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "type": "Dragon",
      "cr": 3,
      "crLabel": "3",
      "str": 19,
      "dex": 14,
      "con": 17,
      "int": 14,
      "wis": 11,
      "cha": 16,
      "saves": "DEX +4, CON +5, WIS +2, CHA +5"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 22 (4d10) fire damage on a failed save, or half as much damage on a successful one. Weakening Breath. The dragon exhales gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "gorgon",
    "name": "Gorgon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 19,
      "hp": 114,
      "hd": "12d10",
      "speed": "40 ft.",
      "type": "Monstrosity",
      "cr": 5,
      "crLabel": "5",
      "str": 20,
      "dex": 11,
      "con": 18,
      "int": 2,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Trampling Charge: If the gorgon moves at least 20 feet straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 16 Strength saving throw or be knocked prone. If the target is prone, the gorgon can make one attack with its hooves against it as a bonus action.",
      "Petrifying Breath: The gorgon exhales petrifying gas in a 30-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw. On a failed save, a target begins to turn to stone and is restrained. The restrained target must repeat the saving throw at the end of its next turn. On a success, the effect ends on the target. On a failure, the target is petrified until freed by the greater restoration spell or other magic."
    ],
    "saves": [
      {
        "name": "Petrifying Breath",
        "ability": "CON",
        "dc": 13,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "2d12+5",
        "damageType": "Piercing",
        "attackBonus": 8
      },
      {
        "name": "Hooves",
        "diceExpr": "2d10+5",
        "damageType": "Bludgeoning",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "gray-ooze",
    "name": "Gray Ooze",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 8,
      "hp": 22,
      "hd": "3d8",
      "speed": "10 ft., climb 10 ft.",
      "type": "Ooze",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 12,
      "dex": 6,
      "con": 16,
      "int": 1,
      "wis": 6,
      "cha": 2,
      "saves": ""
    },
    "abilities": [
      "Amorphous: The ooze can move through a space as narrow as 1 inch wide without squeezing.",
      "Corrode Metal: Any nonmagical weapon made of metal that hits the ooze corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the ooze is destroyed after dealing damage. The ooze can eat through 2-inch-thick, nonmagical metal in 1 round.",
      "False Appearance: While the ooze remains motionless, it is indistinguishable from an oily pool or wet rock."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "1d6+1",
        "damageType": "Bludgeoning",
        "attackBonus": 3,
        "note": "+ 2d6 acid"
      }
    ]
  },
  {
    "id": "green-dragon-wyrmling",
    "name": "Green Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 38,
      "hd": "7d8",
      "speed": "30 ft., fly 60 ft., swim 30 ft.",
      "type": "Dragon",
      "cr": 2,
      "crLabel": "2",
      "str": 15,
      "dex": 12,
      "con": 13,
      "int": 14,
      "wis": 11,
      "cha": 13,
      "saves": "DEX +3, CON +3, WIS +2, CHA +3"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Poison Breath: The dragon exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 11 Constitution saving throw, taking 21 (6d6) poison damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Poison Breath",
        "ability": "CON",
        "dc": 11,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4,
        "note": "+ 1d6 poison"
      }
    ]
  },
  {
    "id": "green-hag",
    "name": "Green Hag",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 82,
      "hd": "11d8",
      "speed": "30 ft.",
      "type": "Fey",
      "cr": 3,
      "crLabel": "3",
      "str": 18,
      "dex": 12,
      "con": 16,
      "int": 13,
      "wis": 14,
      "cha": 14,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The hag can breathe air and water.",
      "Innate Spellcasting: The hag's innate spellcasting ability is Charisma (spell save DC 12). She can innately cast the following spells, requiring no material components: At will: dancing lights, minor illusion, vicious mockery",
      "Mimicry: The hag can mimic animal sounds and humanoid voices. A creature that hears the sounds can tell they are imitations with a successful DC 14 Wisdom (Insight) check.",
      "Illusory Appearance: The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like another creature of her general size and humanoid shape. The illusion ends if the hag takes a bonus action to end it or if she dies. The changes wrought by this effect fail to hold up to physical inspection. For example, the hag could appear to have smooth skin, but someone touching her would feel her rough flesh. Otherwise, a creature must take an action to visually inspect the illusion and succeed on a DC 20 Intelligence (Investigation) check to discern that the hag is disguised.",
      "Invisible Passage: The hag magically turns invisible until she attacks or casts a spell, or until her concentration ends (as if concentrating on a spell). While invisible, she leaves no physical evidence of her passage, so she can be tracked only by magic. Any equipment she wears or carries is invisible with her."
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d8+4",
        "damageType": "Slashing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "grick",
    "name": "Grick",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 27,
      "hd": "6d8",
      "speed": "30 ft., climb 30 ft.",
      "type": "Monstrosity",
      "cr": 2,
      "crLabel": "2",
      "str": 14,
      "dex": 14,
      "con": 11,
      "int": 3,
      "wis": 14,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Stone Camouflage: The grick has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
      "Multiattack: The grick makes one attack with its tentacles. If that attack hits, the grick can make one beak attack against the same target."
    ],
    "attacks": [
      {
        "name": "Tentacles",
        "diceExpr": "2d6+2",
        "damageType": "Slashing",
        "attackBonus": 4
      },
      {
        "name": "Beak",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "griffon",
    "name": "Griffon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 59,
      "hd": "7d10",
      "speed": "30 ft., fly 80 ft.",
      "type": "Monstrosity",
      "cr": 2,
      "crLabel": "2",
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 2,
      "wis": 13,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Keen Sight: The griffon has advantage on Wisdom (Perception) checks that rely on sight.",
      "Multiattack: The griffon makes two attacks: one with its beak and one with its claws."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d8+4",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Claws",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "grimlock",
    "name": "Grimlock",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 11,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Grimlock)",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 16,
      "dex": 12,
      "con": 12,
      "int": 9,
      "wis": 8,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Blind Senses: The grimlock can't use its blindsight while deafened and unable to smell.",
      "Keen Hearing and Smell: The grimlock has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Stone Camouflage: The grimlock has advantage on Dexterity (Stealth) checks made to hide in rocky terrain."
    ],
    "attacks": [
      {
        "name": "Spiked Bone Club",
        "diceExpr": "1d4+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5,
        "note": "+ 1d4 piercing"
      }
    ]
  },
  {
    "id": "guard",
    "name": "Guard",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 11,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 13,
      "dex": 12,
      "con": 12,
      "int": 10,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Spear",
        "diceExpr": "1d6+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "guardian-naga",
    "name": "Guardian Naga",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 127,
      "hd": "15d10",
      "speed": "40 ft.",
      "type": "Monstrosity",
      "cr": 10,
      "crLabel": "10",
      "str": 19,
      "dex": 18,
      "con": 16,
      "int": 16,
      "wis": 19,
      "cha": 18,
      "saves": "DEX +8, CON +7, INT +7, WIS +8, CHA +8"
    },
    "abilities": [
      "Rejuvenation: If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.",
      "Spellcasting: The naga is an 11th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 16, +8 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following cleric spells prepared: - Cantrips (at will): mending, sacred flame, thaumaturgy - 1st level (4 slots): command, cure wounds, shield of faith - 2nd level (3 slots): calm emotions, hold person - 3rd level (3 slots): bestow curse, clairvoyance - 4th level (3 slots): banishment, freedom of movement - 5th level (2 slots): flame strike, geas - 6th level (1 slot): true seeing",
      "Spit Poison: Ranged Weapon Attack: +8 to hit, range 15/30 ft., one creature. Hit: The target must make a DC 15 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+4",
        "damageType": "Piercing",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "gynosphinx",
    "name": "Gynosphinx",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 136,
      "hd": "16d10",
      "speed": "40 ft., fly 60 ft.",
      "type": "Monstrosity",
      "cr": 11,
      "crLabel": "11",
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 18,
      "wis": 18,
      "cha": 18,
      "saves": ""
    },
    "abilities": [
      "Inscrutable: The sphinx is immune to any effect that would sense its emotions or read its thoughts, as well as any divination spell that it refuses. Wisdom (Insight) checks made to ascertain the sphinx's intentions or sincerity have disadvantage.",
      "Magic Weapons: The sphinx's weapon attacks are magical.",
      "Spellcasting: The sphinx is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 16, +8 to hit with spell attacks). It requires no material components to cast its spells. The sphinx has the following wizard spells prepared: - Cantrips (at will): mage hand, minor illusion, prestidigitation - 1st level (4 slots): detect magic, identify, shield - 2nd level (3 slots): darkness, locate object, suggestion - 3rd level (3 slots): dispel magic, remove curse, tongues - 4th level (3 slots): banishment, greater invisibility - 5th level (1 slot): legend lore",
      "Multiattack: The sphinx makes two claw attacks.",
      "Claw Attack (Legendary): The sphinx makes one claw attack.",
      "Teleport (Costs 2 Actions) (Legendary): The sphinx magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see.",
      "Cast a Spell (Costs 3 Actions) (Legendary): The sphinx casts a spell from its list of prepared spells, using a spell slot as normal."
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "2d8+4",
        "damageType": "Slashing",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "half-red-dragon-veteran",
    "name": "Half-Red Dragon Veteran",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 18,
      "hp": 65,
      "hd": "10d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 5,
      "crLabel": "5",
      "str": 16,
      "dex": 13,
      "con": 14,
      "int": 10,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack.",
      "Fire Breath: The veteran exhales fire in a 15-foot cone. Each creature in that area must make a DC 15 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Fire Breath",
        "ability": "DEX",
        "dc": 15,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "1d8+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Shortsword",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Heavy Crossbow",
        "diceExpr": "1d10+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "harpy",
    "name": "Harpy",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 38,
      "hd": "7d8",
      "speed": "20 ft., fly 40 ft.",
      "type": "Monstrosity",
      "cr": 1,
      "crLabel": "1",
      "str": 12,
      "dex": 13,
      "con": 12,
      "int": 7,
      "wis": 10,
      "cha": 13,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The harpy makes two attacks: one with its claws and one with its club.",
      "Luring Song: The harpy sings a magical melody. Every humanoid and giant within 300 ft. of the harpy that can hear the song must succeed on a DC 11 Wisdom saving throw or be charmed until the song ends. The harpy must take a bonus action on its subsequent turns to continue singing. It can stop singing at any time. The song ends if the harpy is incapacitated. While charmed by the harpy, a target is incapacitated and ignores the songs of other harpies. If the charmed target is more than 5 ft. away from the harpy, the must move on its turn toward the harpy by the most direct route. It doesn't avoid opportunity attacks, but before moving into damaging terrain, such as lava or a pit, and whenever it takes damage from a source other than the harpy, a target can repeat the saving throw. A creature can also repeat the saving throw at the end of each of its turns. If a creature's saving throw is successful, the effect ends on it. A target that successfully saves is immune to this harpy's song for the next 24 hours."
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d4+1",
        "damageType": "Slashing",
        "attackBonus": 3
      },
      {
        "name": "Club",
        "diceExpr": "1d4+1",
        "damageType": "Bludgeoning",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "hawk",
    "name": "Hawk",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 13,
      "hp": 1,
      "hd": "1d4",
      "speed": "10 ft., fly 60 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 5,
      "dex": 16,
      "con": 8,
      "int": 2,
      "wis": 14,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Keen Sight: The hawk has advantage on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Talons",
        "diceExpr": "1",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "hell-hound",
    "name": "Hell Hound",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 45,
      "hd": "7d8",
      "speed": "50 ft.",
      "type": "Fiend",
      "cr": 3,
      "crLabel": "3",
      "str": 17,
      "dex": 12,
      "con": 14,
      "int": 6,
      "wis": 13,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The hound has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The hound has advantage on an attack roll against a creature if at least one of the hound's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Fire Breath: The hound exhales fire in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 21 (6d6) fire damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Fire Breath",
        "ability": "DEX",
        "dc": 12,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 5,
        "note": "+ 2d6 fire"
      }
    ]
  },
  {
    "id": "hezrou",
    "name": "Hezrou",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 16,
      "hp": 136,
      "hd": "13d10",
      "speed": "30 ft.",
      "type": "Fiend (Demon)",
      "cr": 8,
      "crLabel": "8",
      "str": 19,
      "dex": 17,
      "con": 20,
      "int": 5,
      "wis": 12,
      "cha": 13,
      "saves": "STR +7, CON +8, WIS +4"
    },
    "abilities": [
      "Magic Resistance: The hezrou has advantage on saving throws against spells and other magical effects.",
      "Stench: Any creature that starts its turn within 10 feet of the hezrou must succeed on a DC 14 Constitution saving throw or be poisoned until the start of its next turn. On a successful saving throw, the creature is immune to the hezrou's stench for 24 hours.",
      "Multiattack: The hezrou makes three attacks: one with its bite and two with its claws."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claws",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "hill-giant",
    "name": "Hill Giant",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 13,
      "hp": 105,
      "hd": "10d12",
      "speed": "40 ft.",
      "type": "Giant",
      "cr": 5,
      "crLabel": "5",
      "str": 21,
      "dex": 8,
      "con": 19,
      "int": 5,
      "wis": 9,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The giant makes two greatclub attacks."
    ],
    "attacks": [
      {
        "name": "Greatclub",
        "diceExpr": "3d8+5",
        "damageType": "Bludgeoning",
        "attackBonus": 8
      },
      {
        "name": "Rock",
        "diceExpr": "3d10+5",
        "damageType": "Bludgeoning",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "hippogriff",
    "name": "Hippogriff",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 19,
      "hd": "3d10",
      "speed": "40 ft., fly 60 ft.",
      "type": "Monstrosity",
      "cr": 1,
      "crLabel": "1",
      "str": 17,
      "dex": 13,
      "con": 13,
      "int": 2,
      "wis": 12,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Keen Sight: The hippogriff has advantage on Wisdom (Perception) checks that rely on sight.",
      "Multiattack: The hippogriff makes two attacks: one with its beak and one with its claws."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d10+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Claws",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "hobgoblin",
    "name": "Hobgoblin",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 18,
      "hp": 11,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Goblinoid)",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 13,
      "dex": 12,
      "con": 12,
      "int": 10,
      "wis": 10,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Martial Advantage: Once per turn, the hobgoblin can deal an extra 7 (2d6) damage to a creature it hits with a weapon attack if that creature is within 5 ft. of an ally of the hobgoblin that isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "1d8+1",
        "damageType": "Slashing",
        "attackBonus": 3
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "homunculus",
    "name": "Homunculus",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 13,
      "hp": 5,
      "hd": "2d4",
      "speed": "20 ft., fly 40 ft.",
      "type": "Construct",
      "cr": 0,
      "crLabel": "0",
      "str": 4,
      "dex": 15,
      "con": 11,
      "int": 10,
      "wis": 10,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Telepathic Bond: While the homunculus is on the same plane of existence as its master, it can magically convey what it senses to its master, and the two can communicate telepathically."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "horned-devil",
    "name": "Horned Devil",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 178,
      "hd": "17d10",
      "speed": "20 ft., fly 60 ft.",
      "type": "Fiend (Devil)",
      "cr": 11,
      "crLabel": "11",
      "str": 22,
      "dex": 17,
      "con": 21,
      "int": 12,
      "wis": 16,
      "cha": 17,
      "saves": "STR +10, DEX +7, WIS +7, CHA +7"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The devil makes three melee attacks: two with its fork and one with its tail. It can use Hurl Flame in place of any melee attack."
    ],
    "attacks": [
      {
        "name": "Fork",
        "diceExpr": "2d8+6",
        "damageType": "Piercing",
        "attackBonus": 10
      },
      {
        "name": "Tail",
        "diceExpr": "1d8+6",
        "damageType": "Piercing",
        "attackBonus": 10
      },
      {
        "name": "Hurl Flame",
        "diceExpr": "4d6",
        "damageType": "Fire",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "hunter-shark",
    "name": "Hunter Shark",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 45,
      "hd": "6d10",
      "speed": "swim 40 ft.",
      "type": "Beast",
      "cr": 2,
      "crLabel": "2",
      "str": 18,
      "dex": 13,
      "con": 15,
      "int": 1,
      "wis": 10,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Blood Frenzy: The shark has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Water Breathing: The shark can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d8+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "hydra",
    "name": "Hydra",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 15,
      "hp": 172,
      "hd": "15d12",
      "speed": "30 ft., swim 30 ft.",
      "type": "Monstrosity",
      "cr": 8,
      "crLabel": "8",
      "str": 20,
      "dex": 12,
      "con": 20,
      "int": 2,
      "wis": 10,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Hold Breath: The hydra can hold its breath for 1 hour.",
      "Multiple Heads: The hydra has five heads. While it has more than one head, the hydra has advantage on saving throws against being blinded, charmed, deafened, frightened, stunned, and knocked unconscious. Whenever the hydra takes 25 or more damage in a single turn, one of its heads dies. If all its heads die, the hydra dies. At the end of its turn, it grows two heads for each of its heads that died since its last turn, unless it has taken fire damage since its last turn. The hydra regains 10 hit points for each head regrown in this way.",
      "Reactive Heads: For each head the hydra has beyond one, it gets an extra reaction that can be used only for opportunity attacks.",
      "Wakeful: While the hydra sleeps, at least one of its heads is awake.",
      "Multiattack: The hydra makes as many bite attacks as it has heads."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+5",
        "damageType": "Piercing",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "hyena",
    "name": "Hyena",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 5,
      "hd": "1d8",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 11,
      "dex": 13,
      "con": 12,
      "int": 2,
      "wis": 12,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Pack Tactics: The hyena has advantage on an attack roll against a creature if at least one of the hyena's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "ice-devil",
    "name": "Ice Devil",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 180,
      "hd": "19d10",
      "speed": "40 ft.",
      "type": "Fiend (Devil)",
      "cr": 14,
      "crLabel": "14",
      "str": 21,
      "dex": 14,
      "con": 18,
      "int": 18,
      "wis": 15,
      "cha": 18,
      "saves": "DEX +7, CON +9, WIS +7, CHA +9"
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the devil's darkvision.",
      "Magic Resistance: The devil has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The devil makes three attacks: one with its bite, one with its claws, and one with its tail.",
      "Wall of Ice: The devil magically forms an opaque wall of ice on a solid surface it can see within 60 feet of it. The wall is 1 foot thick and up to 30 feet long and 10 feet high, or it's a hemispherical dome up to 20 feet in diameter. When the wall appears, each creature in its space is pushed out of it by the shortest route. The creature chooses which side of the wall to end up on, unless the creature is incapacitated. The creature then makes a DC 17 Dexterity saving throw, taking 35 (10d6) cold damage on a failed save, or half as much damage on a successful one. The wall lasts for 1 minute or until the devil is incapacitated or dies. The wall can be damaged and breached; each 10-foot section has AC 5, 30 hit points, vulnerability to fire damage, and immunity to acid, cold, necrotic, poison, and psychic damage. If a section is destroyed, it leaves behind a sheet of frigid air in the space the wall occupied. Whenever a creature finishes moving through the frigid air on a turn, willingly or otherwise, the creature must make a DC 17 Constitution saving throw, taking 17 (5d6) cold damage on a failed save, or half as much damage on a successful one. The frigid air dissipates when the rest of the wall vanishes."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+5",
        "damageType": "Piercing",
        "attackBonus": 10,
        "note": "+ 3d6 cold"
      },
      {
        "name": "Claws",
        "diceExpr": "2d4+5",
        "damageType": "Slashing",
        "attackBonus": 10,
        "note": "+ 3d6 cold"
      },
      {
        "name": "Tail",
        "diceExpr": "2d6+5",
        "damageType": "Bludgeoning",
        "attackBonus": 10,
        "note": "+ 3d6 cold"
      }
    ]
  },
  {
    "id": "ice-mephit",
    "name": "Ice Mephit",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 11,
      "hp": 21,
      "hd": "6d6",
      "speed": "30 ft., fly 30 ft.",
      "type": "Elemental",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 7,
      "dex": 13,
      "con": 10,
      "int": 9,
      "wis": 11,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Death Burst: When the mephit dies, it explodes in a burst of jagged ice. Each creature within 5 ft. of it must make a DC 10 Dexterity saving throw, taking 4 (1d8) slashing damage on a failed save, or half as much damage on a successful one.",
      "False Appearance: While the mephit remains motionless, it is indistinguishable from an ordinary shard of ice.",
      "Innate Spellcasting: The mephit can innately cast fog cloud, requiring no material components. Its innate spellcasting ability is Charisma.",
      "Frost Breath: The mephit exhales a 15-foot cone of cold air. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 5 (2d4) cold damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Frost Breath",
        "ability": "DEX",
        "dc": 10,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4+1",
        "damageType": "Slashing",
        "attackBonus": 3,
        "note": "+ 1d4 cold"
      }
    ]
  },
  {
    "id": "imp",
    "name": "Imp",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 13,
      "hp": 10,
      "hd": "3d4",
      "speed": "20 ft., fly 40 ft.",
      "type": "Fiend (Devil)",
      "cr": 1,
      "crLabel": "1",
      "str": 6,
      "dex": 17,
      "con": 13,
      "int": 11,
      "wis": 12,
      "cha": 14,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The imp can use its action to polymorph into a beast form that resembles a rat (speed 20 ft.), a raven (20 ft., fly 60 ft.), or a spider (20 ft., climb 20 ft.), or back into its true form. Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Devil's Sight: Magical darkness doesn't impede the imp's darkvision.",
      "Magic Resistance: The imp has advantage on saving throws against spells and other magical effects.",
      "Invisibility: The imp magically turns invisible until it attacks, or until its concentration ends (as if concentrating on a spell). Any equipment the imp wears or carries is invisible with it."
    ],
    "attacks": [
      {
        "name": "Sting (Bite in Beast Form)",
        "diceExpr": "1d4+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "invisible-stalker",
    "name": "Invisible Stalker",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 104,
      "hd": "16d8",
      "speed": "50 ft., fly 50 ft., (hover)",
      "type": "Elemental",
      "cr": 6,
      "crLabel": "6",
      "str": 16,
      "dex": 19,
      "con": 14,
      "int": 10,
      "wis": 15,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Invisibility: The stalker is invisible.",
      "Faultless Tracker: The stalker is given a quarry by its summoner. The stalker knows the direction and distance to its quarry as long as the two of them are on the same plane of existence. The stalker also knows the location of its summoner.",
      "Multiattack: The stalker makes two slam attacks."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "iron-golem",
    "name": "Iron Golem",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 20,
      "hp": 210,
      "hd": "20d10",
      "speed": "30 ft.",
      "type": "Construct",
      "cr": 16,
      "crLabel": "16",
      "str": 24,
      "dex": 9,
      "con": 20,
      "int": 3,
      "wis": 11,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Fire Absorption: Whenever the golem is subjected to fire damage, it takes no damage and instead regains a number of hit points equal to the fire damage dealt.",
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Multiattack: The golem makes two melee attacks.",
      "Poison Breath: The golem exhales poisonous gas in a 15-foot cone. Each creature in that area must make a DC 19 Constitution saving throw, taking 45 (10d8) poison damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Poison Breath",
        "ability": "CON",
        "dc": 19,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "3d8+7",
        "damageType": "Bludgeoning",
        "attackBonus": 13
      },
      {
        "name": "Sword",
        "diceExpr": "3d10+7",
        "damageType": "Slashing",
        "attackBonus": 13
      }
    ]
  },
  {
    "id": "jackal",
    "name": "Jackal",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 3,
      "hd": "1d6",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 8,
      "dex": 15,
      "con": 11,
      "int": 3,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The jackal has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The jackal has advantage on an attack roll against a creature if at least one of the jackal's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4-1",
        "damageType": "Piercing",
        "attackBonus": 1
      }
    ]
  },
  {
    "id": "killer-whale",
    "name": "Killer Whale",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 12,
      "hp": 90,
      "hd": "12d12",
      "speed": "swim 60 ft.",
      "type": "Beast",
      "cr": 3,
      "crLabel": "3",
      "str": 19,
      "dex": 10,
      "con": 13,
      "int": 3,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Echolocation: The whale can't use its blindsight while deafened.",
      "Hold Breath: The whale can hold its breath for 30 minutes",
      "Keen Hearing: The whale has advantage on Wisdom (Perception) checks that rely on hearing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "5d6+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "knight",
    "name": "Knight",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 18,
      "hp": 52,
      "hd": "8d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 3,
      "crLabel": "3",
      "str": 16,
      "dex": 11,
      "con": 14,
      "int": 11,
      "wis": 11,
      "cha": 15,
      "saves": "CON +4, WIS +2"
    },
    "abilities": [
      "Brave: The knight has advantage on saving throws against being frightened.",
      "Multiattack: The knight makes two melee attacks.",
      "Leadership: For 1 minute, the knight can utter a special command or warning whenever a nonhostile creature that it can see within 30 ft. of it makes an attack roll or a saving throw. The creature can add a d4 to its roll provided it can hear and understand the knight. A creature can benefit from only one Leadership die at a time. This effect ends if the knight is incapacitated."
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Heavy Crossbow",
        "diceExpr": "1d10",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "kobold",
    "name": "Kobold",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 5,
      "hd": "2d6",
      "speed": "30 ft.",
      "type": "Humanoid (Kobold)",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 7,
      "dex": 15,
      "con": 9,
      "int": 8,
      "wis": 7,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Sunlight Sensitivity: While in sunlight, the kobold has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Pack Tactics: The kobold has advantage on an attack roll against a creature if at least one of the kobold's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Dagger",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Sling",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "kraken",
    "name": "Kraken",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 18,
      "hp": 472,
      "hd": "27d20",
      "speed": "20 ft., swim 60 ft.",
      "type": "Monstrosity (Titan)",
      "cr": 23,
      "crLabel": "23",
      "str": 30,
      "dex": 11,
      "con": 25,
      "int": 22,
      "wis": 18,
      "cha": 20,
      "saves": "STR +17, DEX +7, CON +14, INT +13, WIS +11"
    },
    "abilities": [
      "Amphibious: The kraken can breathe air and water.",
      "Freedom of Movement: The kraken ignores difficult terrain, and magical effects can't reduce its speed or cause it to be restrained. It can spend 5 feet of movement to escape from nonmagical restraints or being grappled.",
      "Siege Monster: The kraken deals double damage to objects and structures.",
      "Multiattack: The kraken makes three tentacle attacks, each of which it can replace with one use of Fling.",
      "Fling: One Large or smaller object held or creature grappled by the kraken is thrown up to 60 feet in a random direction and knocked prone. If a thrown target strikes a solid surface, the target takes 3 (1d6) bludgeoning damage for every 10 feet it was thrown. If the target is thrown at another creature, that creature must succeed on a DC 18 Dexterity saving throw or take the same damage and be knocked prone.",
      "Lightning Storm: The kraken magically creates three bolts of lightning, each of which can strike a target the kraken can see within 120 feet of it. A target must make a DC 23 Dexterity saving throw, taking 22 (4d10) lightning damage on a failed save, or half as much damage on a successful one.",
      "Tentacle Attack or Fling (Legendary): The kraken makes one tentacle attack or uses its Fling.",
      "Lightning Storm (Costs 2 Actions) (Legendary): The kraken uses Lightning Storm.",
      "Ink Cloud (Costs 3 Actions) (Legendary): While underwater, the kraken expels an ink cloud in a 60-foot radius. The cloud spreads around corners, and that area is heavily obscured to creatures other than the kraken. Each creature other than the kraken that ends its turn there must succeed on a DC 23 Constitution saving throw, taking 16 (3d10) poison damage on a failed save, or half as much damage on a successful one. A strong current disperses the cloud, which otherwise disappears at the end of the kraken's next turn."
    ],
    "saves": [
      {
        "name": "Lightning Storm",
        "ability": "DEX",
        "dc": 23,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d8+10",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Tentacle",
        "diceExpr": "3d6+10",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "lamia",
    "name": "Lamia",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 97,
      "hd": "13d10",
      "speed": "30 ft.",
      "type": "Monstrosity",
      "cr": 4,
      "crLabel": "4",
      "str": 16,
      "dex": 13,
      "con": 15,
      "int": 14,
      "wis": 15,
      "cha": 16,
      "saves": ""
    },
    "abilities": [
      "Innate Spellcasting: The lamia's innate spellcasting ability is Charisma (spell save DC 13). It can innately cast the following spells, requiring no material components. At will: disguise self (any humanoid form), major image 3/day each: charm person, mirror image, scrying, suggestion 1/day: geas",
      "Multiattack: The lamia makes two attacks: one with its claws and one with its dagger or Intoxicating Touch.",
      "Intoxicating Touch: Melee Spell Attack: +5 to hit, reach 5 ft., one creature. Hit: The target is magically cursed for 1 hour. Until the curse ends, the target has disadvantage on Wisdom saving throws and all ability checks."
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d10+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Dagger",
        "diceExpr": "1d4+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "lemure",
    "name": "Lemure",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 7,
      "hp": 13,
      "hd": "3d8",
      "speed": "15 ft.",
      "type": "Fiend (Devil)",
      "cr": 0,
      "crLabel": "0",
      "str": 10,
      "dex": 5,
      "con": 11,
      "int": 1,
      "wis": 11,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Devil's Sight: Magical darkness doesn't impede the lemure's darkvision.",
      "Hellish Rejuvenation: A lemure that dies in the Nine Hells comes back to life with all its hit points in 1d10 days unless it is killed by a good-aligned creature with a bless spell cast on that creature or its remains are sprinkled with holy water."
    ],
    "attacks": [
      {
        "name": "Fist",
        "diceExpr": "1d4",
        "damageType": "Bludgeoning",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "lich",
    "name": "Lich",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 135,
      "hd": "18d8",
      "speed": "30 ft.",
      "type": "Undead",
      "cr": 21,
      "crLabel": "21",
      "str": 11,
      "dex": 16,
      "con": 16,
      "int": 20,
      "wis": 14,
      "cha": 16,
      "saves": "CON +10, INT +12, WIS +9"
    },
    "abilities": [
      "Legendary Resistance: If the lich fails a saving throw, it can choose to succeed instead.",
      "Rejuvenation: If it has a phylactery, a destroyed lich gains a new body in 1d10 days, regaining all its hit points and becoming active again. The new body appears within 5 feet of the phylactery.",
      "Spellcasting: The lich is an 18th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 20, +12 to hit with spell attacks). The lich has the following wizard spells prepared: - Cantrips (at will): mage hand, prestidigitation, ray of frost - 1st level (4 slots): detect magic, magic missile, shield, thunderwave - 2nd level (3 slots): acid arrow, detect thoughts, invisibility, mirror image - 3rd level (3 slots): animate dead, counterspell, dispel magic, fireball - 4th level (3 slots): blight, dimension door - 5th level (3 slots): cloudkill, scrying - 6th level (1 slot): disintegrate, globe of invulnerability - 7th level (1 slot): finger of death, plane shift - 8th level (1 slot): dominate monster, power word stun - 9th level (1 slot): power word kill",
      "Turn Resistance: The lich has advantage on saving throws against any effect that turns undead.",
      "Cantrip (Legendary): The lich casts a cantrip.",
      "Paralyzing Touch (Costs 2 Actions) (Legendary): The lich uses its Paralyzing Touch.",
      "Frightening Gaze (Costs 2 Actions) (Legendary): The lich fixes its gaze on one creature it can see within 10 feet of it. The target must succeed on a DC 18 Wisdom saving throw against this magic or become frightened for 1 minute. The frightened target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a target's saving throw is successful or the effect ends for it, the target is immune to the lich's gaze for the next 24 hours.",
      "Disrupt Life (Costs 3 Actions) (Legendary): Each living creature within 20 feet of the lich must make a DC 18 Constitution saving throw against this magic, taking 21 (6d6) necrotic damage on a failed save, or half as much damage on a successful one."
    ],
    "attacks": [
      {
        "name": "Paralyzing Touch",
        "diceExpr": "3d6",
        "damageType": "Cold",
        "attackBonus": 12
      }
    ]
  },
  {
    "id": "lion",
    "name": "Lion",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 26,
      "hd": "4d10",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 17,
      "dex": 15,
      "con": 13,
      "int": 3,
      "wis": 12,
      "cha": 8,
      "saves": ""
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
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Claw",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "lizard",
    "name": "Lizard",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 10,
      "hp": 2,
      "hd": "1d4",
      "speed": "20 ft., climb 20 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 2,
      "dex": 11,
      "con": 10,
      "int": 1,
      "wis": 8,
      "cha": 3,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 0
      }
    ]
  },
  {
    "id": "lizardfolk",
    "name": "Lizardfolk",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 22,
      "hd": "4d8",
      "speed": "30 ft., swim 30 ft.",
      "type": "Humanoid (Lizardfolk)",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 15,
      "dex": 10,
      "con": 13,
      "int": 7,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Hold Breath: The lizardfolk can hold its breath for 15 minutes.",
      "Multiattack: The lizardfolk makes two melee attacks, each one with a different weapon."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Heavy Club",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning",
        "attackBonus": 4
      },
      {
        "name": "Javelin",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Spiked Shield",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "mage",
    "name": "Mage",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 40,
      "hd": "9d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 6,
      "crLabel": "6",
      "str": 9,
      "dex": 14,
      "con": 11,
      "int": 17,
      "wis": 12,
      "cha": 11,
      "saves": "INT +6, WIS +4"
    },
    "abilities": [
      "Spellcasting: The mage is a 9th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks). The mage has the following wizard spells prepared: - Cantrips (at will): fire bolt, light, mage hand, prestidigitation - 1st level (4 slots): detect magic, mage armor, magic missile, shield - 2nd level (3 slots): misty step, suggestion - 3rd level (3 slots): counterspell, fireball, fly - 4th level (3 slots): greater invisibility, ice storm - 5th level (1 slot): cone of cold"
    ],
    "attacks": [
      {
        "name": "Dagger",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "magma-mephit",
    "name": "Magma Mephit",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 11,
      "hp": 22,
      "hd": "5d6",
      "speed": "30 ft., fly 30 ft.",
      "type": "Elemental",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 8,
      "dex": 12,
      "con": 12,
      "int": 7,
      "wis": 10,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Death Burst: When the mephit dies, it explodes in a burst of lava. Each creature within 5 ft. of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one.",
      "False Appearance: While the mephit remains motionless, it is indistinguishable from an ordinary mound of magma.",
      "Innate Spellcasting: The mephit can innately cast heat metal (spell save DC 10), requiring no material components. Its innate spellcasting ability is Charisma.",
      "Fire Breath: The mephit exhales a 15-foot cone of fire. Each creature in that area must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Fire Breath",
        "ability": "DEX",
        "dc": 11,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4+1",
        "damageType": "Slashing",
        "attackBonus": 3,
        "note": "+ 1d4 fire"
      }
    ]
  },
  {
    "id": "magmin",
    "name": "Magmin",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 14,
      "hp": 9,
      "hd": "2d6",
      "speed": "30 ft.",
      "type": "Elemental",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 7,
      "dex": 15,
      "con": 12,
      "int": 8,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Death Burst: When the magmin dies, it explodes in a burst of fire and magma. Each creature within 10 ft. of it must make a DC 11 Dexterity saving throw, taking 7 (2d6) fire damage on a failed save, or half as much damage on a successful one. Flammable objects that aren't being worn or carried in that area are ignited.",
      "Ignited Illumination: As a bonus action, the magmin can set itself ablaze or extinguish its flames. While ablaze, the magmin sheds bright light in a 10-foot radius and dim light for an additional 10 ft."
    ],
    "attacks": [
      {
        "name": "Touch",
        "diceExpr": "2d6",
        "damageType": "Fire",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "mammoth",
    "name": "Mammoth",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 13,
      "hp": 126,
      "hd": "11d12",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 6,
      "crLabel": "6",
      "str": 24,
      "dex": 9,
      "con": 21,
      "int": 3,
      "wis": 11,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Trampling Charge: If the mammoth moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 18 Strength saving throw or be knocked prone. If the target is prone, the mammoth can make one stomp attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "4d8+7",
        "damageType": "Piercing",
        "attackBonus": 10
      },
      {
        "name": "Stomp",
        "diceExpr": "4d10+7",
        "damageType": "Bludgeoning",
        "attackBonus": 10
      }
    ]
  },
  {
    "id": "manticore",
    "name": "Manticore",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 68,
      "hd": "8d10",
      "speed": "30 ft., fly 50 ft.",
      "type": "Monstrosity",
      "cr": 3,
      "crLabel": "3",
      "str": 17,
      "dex": 16,
      "con": 17,
      "int": 7,
      "wis": 12,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Tail Spike Regrowth: The manticore has twenty-four tail spikes. Used spikes regrow when the manticore finishes a long rest.",
      "Multiattack: The manticore makes three attacks: one with its bite and two with its claws or three with its tail spikes."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Claw",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Tail Spike",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "marilith",
    "name": "Marilith",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 189,
      "hd": "18d10",
      "speed": "40 ft.",
      "type": "Fiend (Demon)",
      "cr": 16,
      "crLabel": "16",
      "str": 18,
      "dex": 20,
      "con": 20,
      "int": 18,
      "wis": 16,
      "cha": 20,
      "saves": "STR +9, CON +10, WIS +8, CHA +10"
    },
    "abilities": [
      "Magic Resistance: The marilith has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The marilith's weapon attacks are magical.",
      "Reactive: The marilith can take one reaction on every turn in combat.",
      "Multiattack: The marilith can make seven attacks: six with its longswords and one with its tail.",
      "Teleport: The marilith magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "2d8+4",
        "damageType": "Slashing",
        "attackBonus": 9
      },
      {
        "name": "Tail",
        "diceExpr": "2d10+4",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "mastiff",
    "name": "Mastiff",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 5,
      "hd": "1d8",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 13,
      "dex": 14,
      "con": 12,
      "int": 3,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The mastiff has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "medusa",
    "name": "Medusa",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 127,
      "hd": "17d8",
      "speed": "30 ft.",
      "type": "Monstrosity",
      "cr": 6,
      "crLabel": "6",
      "str": 10,
      "dex": 15,
      "con": 16,
      "int": 12,
      "wis": 13,
      "cha": 15,
      "saves": ""
    },
    "abilities": [
      "Petrifying Gaze: When a creature that can see the medusa's eyes starts its turn within 30 ft. of the medusa, the medusa can force it to make a DC 14 Constitution saving throw if the medusa isn't incapacitated and can see the creature. If the saving throw fails by 5 or more, the creature is instantly petrified. Otherwise, a creature that fails the save begins to turn to stone and is restrained. The restrained creature must repeat the saving throw at the end of its next turn, becoming petrified on a failure or ending the effect on a success. The petrification lasts until the creature is freed by the greater restoration spell or other magic. Unless surprised, a creature can avert its eyes to avoid the saving throw at the start of its turn. If the creature does so, it can't see the medusa until the start of its next turn, when it can avert its eyes again. If the creature looks at the medusa in the meantime, it must immediately make the save. If the medusa sees itself reflected on a polished surface within 30 ft. of it and in an area of bright light, the medusa is, due to its curse, affected by its own gaze.",
      "Multiattack: The medusa makes either three melee attacks--one with its snake hair and two with its shortsword--or two ranged attacks with its longbow."
    ],
    "attacks": [
      {
        "name": "Snake Hair",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 5,
        "note": "+ 4d6 poison"
      },
      {
        "name": "Shortsword",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 5,
        "note": "+ 2d6 poison"
      }
    ]
  },
  {
    "id": "merfolk",
    "name": "Merfolk",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 11,
      "hd": "2d8",
      "speed": "10 ft., swim 40 ft.",
      "type": "Humanoid (Merfolk)",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 10,
      "dex": 13,
      "con": 12,
      "int": 11,
      "wis": 11,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The merfolk can breathe air and water."
    ],
    "attacks": [
      {
        "name": "Spear",
        "diceExpr": "1d6",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "merrow",
    "name": "Merrow",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 45,
      "hd": "6d10",
      "speed": "10 ft., swim 40 ft.",
      "type": "Monstrosity",
      "cr": 2,
      "crLabel": "2",
      "str": 18,
      "dex": 10,
      "con": 15,
      "int": 8,
      "wis": 10,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The merrow can breathe air and water.",
      "Multiattack: The merrow makes two attacks: one with its bite and one with its claws or harpoon."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+4",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Claws",
        "diceExpr": "2d4+4",
        "damageType": "Slashing",
        "attackBonus": 6
      },
      {
        "name": "Harpoon",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "mimic",
    "name": "Mimic",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 58,
      "hd": "9d8",
      "speed": "15 ft.",
      "type": "Monstrosity (Shapechanger)",
      "cr": 2,
      "crLabel": "2",
      "str": 17,
      "dex": 12,
      "con": 15,
      "int": 5,
      "wis": 13,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The mimic can use its action to polymorph into an object or back into its true, amorphous form. Its statistics are the same in each form. Any equipment it is wearing or carrying isn 't transformed. It reverts to its true form if it dies.",
      "Adhesive (Object Form Only): The mimic adheres to anything that touches it. A Huge or smaller creature adhered to the mimic is also grappled by it (escape DC 13). Ability checks made to escape this grapple have disadvantage.",
      "False Appearance (Object Form Only): While the mimic remains motionless, it is indistinguishable from an ordinary object.",
      "Grappler: The mimic has advantage on attack rolls against any creature grappled by it."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "1d8+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      },
      {
        "name": "Bite",
        "diceExpr": "1d8+3",
        "damageType": "Piercing",
        "attackBonus": 5,
        "note": "+ 1d8 acid"
      }
    ]
  },
  {
    "id": "minotaur",
    "name": "Minotaur",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 76,
      "hd": "9d10",
      "speed": "40 ft.",
      "type": "Monstrosity",
      "cr": 3,
      "crLabel": "3",
      "str": 18,
      "dex": 11,
      "con": 16,
      "int": 6,
      "wis": 16,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Charge: If the minotaur moves at least 10 ft. straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 ft. away and knocked prone.",
      "Labyrinthine Recall: The minotaur can perfectly recall any path it has traveled.",
      "Reckless: At the start of its turn, the minotaur can gain advantage on all melee weapon attack rolls it makes during that turn, but attack rolls against it have advantage until the start of its next turn."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "2d12+4",
        "damageType": "Slashing",
        "attackBonus": 6
      },
      {
        "name": "Gore",
        "diceExpr": "2d8+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "minotaur-skeleton",
    "name": "Minotaur Skeleton",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 67,
      "hd": "9d10",
      "speed": "40 ft.",
      "type": "Undead",
      "cr": 2,
      "crLabel": "2",
      "str": 18,
      "dex": 11,
      "con": 15,
      "int": 6,
      "wis": 8,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Charge: If the skeleton moves at least 10 feet straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 14 Strength saving throw or be pushed up to 10 feet away and knocked prone."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "2d12+4",
        "damageType": "Slashing",
        "attackBonus": 6
      },
      {
        "name": "Gore",
        "diceExpr": "2d8+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "mule",
    "name": "Mule",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 11,
      "hd": "2d8",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 14,
      "dex": 10,
      "con": 13,
      "int": 2,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Beast of Burden: The mule is considered to be a Large animal for the purpose of determining its carrying capacity.",
      "Sure-Footed: The mule has advantage on Strength and Dexterity saving throws made against effects that would knock it prone."
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "1d4+2",
        "damageType": "Bludgeoning",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "mummy",
    "name": "Mummy",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 58,
      "hd": "9d8",
      "speed": "20 ft.",
      "type": "Undead",
      "cr": 3,
      "crLabel": "3",
      "str": 16,
      "dex": 8,
      "con": 15,
      "int": 6,
      "wis": 10,
      "cha": 12,
      "saves": "WIS +2"
    },
    "abilities": [
      "Multiattack: The mummy can use its Dreadful Glare and makes one attack with its rotting fist.",
      "Dreadful Glare: The mummy targets one creature it can see within 60 ft. of it. If the target can see the mummy, it must succeed on a DC 11 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies (but not mummy lords) for the next 24 hours."
    ],
    "saves": [
      {
        "name": "Dreadful Glare",
        "ability": "WIS",
        "dc": 11,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Rotting Fist",
        "diceExpr": "2d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5,
        "note": "+ 3d6 necrotic"
      }
    ]
  },
  {
    "id": "mummy-lord",
    "name": "Mummy Lord",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 97,
      "hd": "13d8",
      "speed": "20 ft.",
      "type": "Undead",
      "cr": 15,
      "crLabel": "15",
      "str": 18,
      "dex": 10,
      "con": 17,
      "int": 11,
      "wis": 18,
      "cha": 16,
      "saves": "CON +8, INT +5, WIS +9, CHA +8"
    },
    "abilities": [
      "Magic Resistance: The mummy lord has advantage on saving throws against spells and other magical effects.",
      "Rejuvenation: A destroyed mummy lord gains a new body in 24 hours if its heart is intact, regaining all its hit points and becoming active again. The new body appears within 5 feet of the mummy lord's heart.",
      "Spellcasting: The mummy lord is a 10th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 17, +9 to hit with spell attacks). The mummy lord has the following cleric spells prepared: - Cantrips (at will): sacred flame, thaumaturgy - 1st level (4 slots): command, guiding bolt, shield of faith - 2nd level (3 slots): hold person, silence, spiritual weapon - 3rd level (3 slots): animate dead, dispel magic - 4th level (3 slots): divination, guardian of faith - 5th level (2 slots): contagion, insect plague - 6th level (1 slot): harm",
      "Multiattack: The mummy can use its Dreadful Glare and makes one attack with its rotting fist.",
      "Dreadful Glare: The mummy lord targets one creature it can see within 60 feet of it. If the target can see the mummy lord, it must succeed on a DC 16 Wisdom saving throw against this magic or become frightened until the end of the mummy's next turn. If the target fails the saving throw by 5 or more, it is also paralyzed for the same duration. A target that succeeds on the saving throw is immune to the Dreadful Glare of all mummies and mummy lords for the next 24 hours.",
      "Attack (Legendary): The mummy lord makes one attack with its rotting fist or uses its Dreadful Glare.",
      "Blinding Dust (Legendary): Blinding dust and sand swirls magically around the mummy lord. Each creature within 5 feet of the mummy lord must succeed on a DC 16 Constitution saving throw or be blinded until the end of the creature's next turn.",
      "Blasphemous Word (Costs 2 Actions) (Legendary): The mummy lord utters a blasphemous word. Each non-undead creature within 10 feet of the mummy lord that can hear the magical utterance must succeed on a DC 16 Constitution saving throw or be stunned until the end of the mummy lord's next turn.",
      "Channel Negative Energy (Costs 2 Actions) (Legendary): The mummy lord magically unleashes negative energy. Creatures within 60 feet of the mummy lord, including ones behind barriers and around corners, can't regain hit points until the end of the mummy lord's next turn.",
      "Whirlwind of Sand (Costs 2 Actions) (Legendary): The mummy lord magically transforms into a whirlwind of sand, moves up to 60 feet, and reverts to its normal form. While in whirlwind form, the mummy lord is immune to all damage, and it can't be grappled, petrified, knocked prone, restrained, or stunned. Equipment worn or carried by the mummy lord remain in its possession."
    ],
    "saves": [
      {
        "name": "Dreadful Glare",
        "ability": "WIS",
        "dc": 16,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Rotting Fist",
        "diceExpr": "3d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 9,
        "note": "+ 6d6 necrotic"
      }
    ]
  },
  {
    "id": "nalfeshnee",
    "name": "Nalfeshnee",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 184,
      "hd": "16d10",
      "speed": "20 ft., fly 30 ft.",
      "type": "Fiend (Demon)",
      "cr": 13,
      "crLabel": "13",
      "str": 21,
      "dex": 10,
      "con": 22,
      "int": 19,
      "wis": 12,
      "cha": 15,
      "saves": "CON +11, INT +9, WIS +6, CHA +7"
    },
    "abilities": [
      "Magic Resistance: The nalfeshnee has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The nalfeshnee uses Horror Nimbus if it can. It then makes three attacks: one with its bite and two with its claws.",
      "Horror Nimbus: The nalfeshnee magically emits scintillating, multicolored light. Each creature within 15 feet of the nalfeshnee that can see the light must succeed on a DC 15 Wisdom saving throw or be frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the nalfeshnee's Horror Nimbus for the next 24 hours.",
      "Teleport: The nalfeshnee magically teleports, along with any equipment it is wearing or carrying, up to 120 feet to an unoccupied space it can see."
    ],
    "saves": [
      {
        "name": "Horror Nimbus",
        "ability": "WIS",
        "dc": 15,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "5d10+5",
        "damageType": "Piercing",
        "attackBonus": 10
      },
      {
        "name": "Claw",
        "diceExpr": "3d6+5",
        "damageType": "Slashing",
        "attackBonus": 10
      }
    ]
  },
  {
    "id": "night-hag",
    "name": "Night Hag",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 112,
      "hd": "15d8",
      "speed": "30 ft.",
      "type": "Fiend",
      "cr": 5,
      "crLabel": "5",
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 16,
      "wis": 14,
      "cha": 16,
      "saves": ""
    },
    "abilities": [
      "Innate Spellcasting: The hag's innate spellcasting ability is Charisma (spell save DC 14, +6 to hit with spell attacks). She can innately cast the following spells, requiring no material components: At will: detect magic, magic missile 2/day each: plane shift (self only), ray of enfeeblement, sleep",
      "Magic Resistance: The hag has advantage on saving throws against spells and other magical effects.",
      "Night Hag Items: A night hag carries two very rare magic items that she must craft for herself If either object is lost, the night hag will go to great lengths to retrieve it, as creating a new tool takes time and effort. Heartstone: This lustrous black gem allows a night hag to become ethereal while it is in her possession. The touch of a heartstone also cures any disease. Crafting a heartstone takes 30 days. Soul Bag: When an evil humanoid dies as a result of a night hag's Nightmare Haunting, the hag catches the soul in this black sack made of stitched flesh. A soul bag can hold only one evil soul at a time, and only the night hag who crafted the bag can catch a soul with it. Crafting a soul bag takes 7 days and a humanoid sacrifice (whose flesh is used to make the bag).",
      "Change Shape: The hag magically polymorphs into a Small or Medium female humanoid, or back into her true form. Her statistics are the same in each form. Any equipment she is wearing or carrying isn't transformed. She reverts to her true form if she dies.",
      "Etherealness: The hag magically enters the Ethereal Plane from the Material Plane, or vice versa. To do so, the hag must have a heartstone in her possession.",
      "Nightmare Haunting: While on the Ethereal Plane, the hag magically touches a sleeping humanoid on the Material Plane. A protection from evil and good spell cast on the target prevents this contact, as does a magic circle. As long as the contact persists, the target has dreadful visions. If these visions last for at least 1 hour, the target gains no benefit from its rest, and its hit point maximum is reduced by 5 (1d10). If this effect reduces the target's hit point maximum to 0, the target dies, and if the target was evil, its soul is trapped in the hag's soul bag. The reduction to the target's hit point maximum lasts until removed by the greater restoration spell or similar magic."
    ],
    "attacks": [
      {
        "name": "Claws (Hag Form Only)",
        "diceExpr": "2d8+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "nightmare",
    "name": "Nightmare",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 68,
      "hd": "8d10",
      "speed": "60 ft., fly 90 ft.",
      "type": "Fiend",
      "cr": 3,
      "crLabel": "3",
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 10,
      "wis": 13,
      "cha": 15,
      "saves": ""
    },
    "abilities": [
      "Confer Fire Resistance: The nightmare can grant resistance to fire damage to anyone riding it.",
      "Illumination: The nightmare sheds bright light in a 10-foot radius and dim light for an additional 10 feet.",
      "Ethereal Stride: The nightmare and up to three willing creatures within 5 feet of it magically enter the Ethereal Plane from the Material Plane, or vice versa."
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6,
        "note": "+ 2d6 fire"
      }
    ]
  },
  {
    "id": "noble",
    "name": "Noble",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 9,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 11,
      "dex": 12,
      "con": 11,
      "int": 12,
      "wis": 14,
      "cha": 16,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Rapier",
        "diceExpr": "1d8+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "ochre-jelly",
    "name": "Ochre Jelly",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 8,
      "hp": 45,
      "hd": "6d10",
      "speed": "10 ft., climb 10 ft.",
      "type": "Ooze",
      "cr": 2,
      "crLabel": "2",
      "str": 15,
      "dex": 6,
      "con": 14,
      "int": 2,
      "wis": 6,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Amorphous: The jelly can move through a space as narrow as 1 inch wide without squeezing.",
      "Spider Climb: The jelly can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check."
    ],
    "attacks": [
      {
        "name": "Pseudopod",
        "diceExpr": "2d6+2",
        "damageType": "Bludgeoning",
        "attackBonus": 4,
        "note": "+ 1d6 acid"
      }
    ]
  },
  {
    "id": "octopus",
    "name": "Octopus",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 12,
      "hp": 3,
      "hd": "1d6",
      "speed": "5 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 4,
      "dex": 15,
      "con": 11,
      "int": 3,
      "wis": 10,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Hold Breath: While out of water, the octopus can hold its breath for 30 minutes.",
      "Underwater Camouflage: The octopus has advantage on Dexterity (Stealth) checks made while underwater.",
      "Water Breathing: The octopus can breathe only underwater.",
      "Ink Cloud: A 5-foot-radius cloud of ink extends all around the octopus if it is underwater. The area is heavily obscured for 1 minute, although a significant current can disperse the ink. After releasing the ink, the octopus can use the Dash action as a bonus action."
    ],
    "attacks": [
      {
        "name": "Tentacles",
        "diceExpr": "1",
        "damageType": "Bludgeoning",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "ogre",
    "name": "Ogre",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 59,
      "hd": "7d10",
      "speed": "40 ft.",
      "type": "Giant",
      "cr": 2,
      "crLabel": "2",
      "str": 19,
      "dex": 8,
      "con": 16,
      "int": 5,
      "wis": 7,
      "cha": 7,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Greatclub",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      },
      {
        "name": "Javelin",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "ogre-zombie",
    "name": "Ogre Zombie",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 8,
      "hp": 85,
      "hd": "9d10",
      "speed": "30 ft.",
      "type": "Undead",
      "cr": 2,
      "crLabel": "2",
      "str": 19,
      "dex": 6,
      "con": 18,
      "int": 3,
      "wis": 6,
      "cha": 5,
      "saves": "WIS +0"
    },
    "abilities": [
      "Undead Fortitude: If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead."
    ],
    "attacks": [
      {
        "name": "Morningstar",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "oni",
    "name": "Oni",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 16,
      "hp": 110,
      "hd": "13d10",
      "speed": "30 ft., fly 30 ft.",
      "type": "Giant",
      "cr": 7,
      "crLabel": "7",
      "str": 19,
      "dex": 11,
      "con": 16,
      "int": 14,
      "wis": 12,
      "cha": 15,
      "saves": "DEX +3, CON +6, WIS +4, CHA +5"
    },
    "abilities": [
      "Innate Spellcasting: The oni's innate spellcasting ability is Charisma (spell save DC 13). The oni can innately cast the following spells, requiring no material components: At will: darkness, invisibility 1/day each: charm person, cone of cold, gaseous form, sleep",
      "Magic Weapons: The oni's weapon attacks are magical.",
      "Regeneration: The oni regains 10 hit points at the start of its turn if it has at least 1 hit point.",
      "Multiattack: The oni makes two attacks, either with its claws or its glaive.",
      "Change Shape: The oni magically polymorphs into a Small or Medium humanoid, into a Large giant, or back into its true form. Other than its size, its statistics are the same in each form. The only equipment that is transformed is its glaive, which shrinks so that it can be wielded in humanoid form. If the oni dies, it reverts to its true form, and its glaive reverts to its normal size."
    ],
    "attacks": [
      {
        "name": "Claw (Oni Form Only)",
        "diceExpr": "1d8+4",
        "damageType": "Slashing",
        "attackBonus": 7
      },
      {
        "name": "Glaive",
        "diceExpr": "2d10+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "orc",
    "name": "Orc",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 15,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Orc)",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 16,
      "dex": 12,
      "con": 16,
      "int": 7,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Aggressive: As a bonus action, the orc can move up to its speed toward a hostile creature that it can see."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "1d12+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Javelin",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "otyugh",
    "name": "Otyugh",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 114,
      "hd": "12d10",
      "speed": "30 ft.",
      "type": "Aberration",
      "cr": 5,
      "crLabel": "5",
      "str": 16,
      "dex": 11,
      "con": 19,
      "int": 6,
      "wis": 13,
      "cha": 6,
      "saves": "CON +7"
    },
    "abilities": [
      "Limited Telepathy: The otyugh can magically transmit simple messages and images to any creature within 120 ft. of it that can understand a language. This form of telepathy doesn't allow the receiving creature to telepathically respond.",
      "Multiattack: The otyugh makes three attacks: one with its bite and two with its tentacles.",
      "Tentacle Slam: The otyugh slams creatures grappled by it into each other or a solid surface. Each creature must succeed on a DC 14 Constitution saving throw or take 10 (2d6 + 3) bludgeoning damage and be stunned until the end of the otyugh's next turn. On a successful save, the target takes half the bludgeoning damage and isn't stunned."
    ],
    "saves": [
      {
        "name": "Tentacle Slam",
        "ability": "CON",
        "dc": 14,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d8+3",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Tentacle",
        "diceExpr": "1d8+3",
        "damageType": "Bludgeoning",
        "attackBonus": 6,
        "note": "+ 1d8 piercing"
      }
    ]
  },
  {
    "id": "owl",
    "name": "Owl",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 11,
      "hp": 1,
      "hd": "1d4",
      "speed": "5 ft., fly 60 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 3,
      "dex": 13,
      "con": 8,
      "int": 2,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Flyby: The owl doesn't provoke opportunity attacks when it flies out of an enemy's reach.",
      "Keen Hearing and Sight: The owl has advantage on Wisdom (Perception) checks that rely on hearing or sight."
    ],
    "attacks": [
      {
        "name": "Talons",
        "diceExpr": "1",
        "damageType": "Slashing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "owlbear",
    "name": "Owlbear",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 59,
      "hd": "7d10",
      "speed": "40 ft.",
      "type": "Monstrosity",
      "cr": 3,
      "crLabel": "3",
      "str": 20,
      "dex": 12,
      "con": 17,
      "int": 3,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Sight and Smell: The owlbear has advantage on Wisdom (Perception) checks that rely on sight or smell.",
      "Multiattack: The owlbear makes two attacks: one with its beak and one with its claws."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d10+5",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claws",
        "diceExpr": "2d8+5",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "panther",
    "name": "Panther",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 13,
      "hd": "3d8",
      "speed": "50 ft., climb 40 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 14,
      "dex": 15,
      "con": 10,
      "int": 3,
      "wis": 14,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The panther has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pounce: If the panther moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 12 Strength saving throw or be knocked prone. If the target is prone, the panther can make one bite attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Claw",
        "diceExpr": "1d4+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "pegasus",
    "name": "Pegasus",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 59,
      "hd": "7d10",
      "speed": "60 ft., fly 90 ft.",
      "type": "Celestial",
      "cr": 2,
      "crLabel": "2",
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 10,
      "wis": 15,
      "cha": 13,
      "saves": "DEX +4, WIS +4, CHA +3"
    },
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "phase-spider",
    "name": "Phase Spider",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 32,
      "hd": "5d10",
      "speed": "30 ft., climb 30 ft.",
      "type": "Monstrosity",
      "cr": 3,
      "crLabel": "3",
      "str": 15,
      "dex": 15,
      "con": 12,
      "int": 6,
      "wis": 10,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Ethereal Jaunt: As a bonus action, the spider can magically shift from the Material Plane to the Ethereal Plane, or vice versa.",
      "Spider Climb: The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Walker: The spider ignores movement restrictions caused by webbing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "pit-fiend",
    "name": "Pit Fiend",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 19,
      "hp": 300,
      "hd": "24d10",
      "speed": "30 ft., fly 60 ft.",
      "type": "Fiend (Devil)",
      "cr": 20,
      "crLabel": "20",
      "str": 26,
      "dex": 14,
      "con": 24,
      "int": 22,
      "wis": 18,
      "cha": 24,
      "saves": "DEX +8, CON +13, WIS +10"
    },
    "abilities": [
      "Fear Aura: Any creature hostile to the pit fiend that starts its turn within 20 feet of the pit fiend must make a DC 21 Wisdom saving throw, unless the pit fiend is incapacitated. On a failed save, the creature is frightened until the start of its next turn. If a creature's saving throw is successful, the creature is immune to the pit fiend's Fear Aura for the next 24 hours.",
      "Magic Resistance: The pit fiend has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The pit fiend's weapon attacks are magical.",
      "Innate Spellcasting: The pit fiend's spellcasting ability is Charisma (spell save DC 21). The pit fiend can innately cast the following spells, requiring no material components: At will: detect magic, fireball 3/day each: hold monster, wall of fire",
      "Multiattack: The pit fiend makes four attacks: one with its bite, one with its claw, one with its mace, and one with its tail."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d6+8",
        "damageType": "Piercing",
        "attackBonus": 14
      },
      {
        "name": "Claw",
        "diceExpr": "2d8+8",
        "damageType": "Slashing",
        "attackBonus": 14
      },
      {
        "name": "Mace",
        "diceExpr": "2d6+8",
        "damageType": "Bludgeoning",
        "attackBonus": 14
      },
      {
        "name": "Tail",
        "diceExpr": "3d10+8",
        "damageType": "Bludgeoning",
        "attackBonus": 14
      }
    ]
  },
  {
    "id": "planetar",
    "name": "Planetar",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 19,
      "hp": 200,
      "hd": "16d10",
      "speed": "40 ft., fly 120 ft.",
      "type": "Celestial",
      "cr": 16,
      "crLabel": "16",
      "str": 24,
      "dex": 20,
      "con": 24,
      "int": 19,
      "wis": 22,
      "cha": 25,
      "saves": "CON +12, WIS +11, CHA +12"
    },
    "abilities": [
      "Angelic Weapons: The planetar's weapon attacks are magical. When the planetar hits with any weapon, the weapon deals an extra 5d8 radiant damage (included in the attack).",
      "Divine Awareness: The planetar knows if it hears a lie.",
      "Innate Spellcasting: The planetar's spellcasting ability is Charisma (spell save DC 20). The planetar can innately cast the following spells, requiring no material components: At will: detect evil and good, invisibility (self only) 3/day each: blade barrier, dispel evil and good, flame strike, raise dead 1/day each: commune, control weather, insect plague",
      "Magic Resistance: The planetar has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The planetar makes two melee attacks.",
      "Healing Touch: The planetar touches another creature. The target magically regains 30 (6d8 + 3) hit points and is freed from any curse, disease, poison, blindness, or deafness."
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "4d6+7",
        "damageType": "Slashing",
        "attackBonus": 12,
        "note": "+ 5d8 radiant"
      }
    ]
  },
  {
    "id": "plesiosaurus",
    "name": "Plesiosaurus",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 68,
      "hd": "8d10",
      "speed": "20 ft., swim 40 ft.",
      "type": "Beast",
      "cr": 2,
      "crLabel": "2",
      "str": 18,
      "dex": 15,
      "con": 16,
      "int": 2,
      "wis": 12,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Hold Breath: The plesiosaurus can hold its breath for 1 hour."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d6+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "poisonous-snake",
    "name": "Poisonous Snake",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 13,
      "hp": 2,
      "hd": "1d4",
      "speed": "30 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 2,
      "dex": 16,
      "con": 11,
      "int": 1,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "polar-bear",
    "name": "Polar Bear",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 42,
      "hd": "5d10",
      "speed": "40 ft., swim 30 ft.",
      "type": "Beast",
      "cr": 2,
      "crLabel": "2",
      "str": 20,
      "dex": 10,
      "con": 16,
      "int": 2,
      "wis": 13,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The bear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: The bear makes two attacks: one with its bite and one with its claws."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+5",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claws",
        "diceExpr": "2d6+5",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "pony",
    "name": "Pony",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 11,
      "hd": "2d8",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 15,
      "dex": 10,
      "con": 13,
      "int": 2,
      "wis": 11,
      "cha": 7,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d4+2",
        "damageType": "Bludgeoning",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "priest",
    "name": "Priest",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 27,
      "hd": "5d8",
      "speed": "25 ft.",
      "type": "Humanoid (Any race)",
      "cr": 2,
      "crLabel": "2",
      "str": 10,
      "dex": 10,
      "con": 12,
      "int": 13,
      "wis": 16,
      "cha": 13,
      "saves": ""
    },
    "abilities": [
      "Divine Eminence: As a bonus action, the priest can expend a spell slot to cause its melee weapon attacks to magically deal an extra 10 (3d6) radiant damage to a target on a hit. This benefit lasts until the end of the turn. If the priest expends a spell slot of 2nd level or higher, the extra damage increases by 1d6 for each level above 1st.",
      "Spellcasting: The priest is a 5th-level spellcaster. Its spellcasting ability is Wisdom (spell save DC 13, +5 to hit with spell attacks). The priest has the following cleric spells prepared: - Cantrips (at will): light, sacred flame, thaumaturgy - 1st level (4 slots): cure wounds, guiding bolt, sanctuary - 2nd level (3 slots): lesser restoration, spiritual weapon - 3rd level (2 slots): dispel magic, spirit guardians"
    ],
    "attacks": [
      {
        "name": "Mace",
        "diceExpr": "1d6",
        "damageType": "Bludgeoning",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "pseudodragon",
    "name": "Pseudodragon",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 13,
      "hp": 7,
      "hd": "2d4",
      "speed": "15 ft., fly 60 ft.",
      "type": "Dragon",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 6,
      "dex": 15,
      "con": 13,
      "int": 10,
      "wis": 12,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Keen Senses: The pseudodragon has advantage on Wisdom (Perception) checks that rely on sight, hearing, or smell.",
      "Magic Resistance: The pseudodragon has advantage on saving throws against spells and other magical effects.",
      "Limited Telepathy: The pseudodragon can magically communicate simple ideas, emotions, and images telepathically with any creature within 100 ft. of it that can understand a language."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Sting",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "purple-worm",
    "name": "Purple Worm",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 18,
      "hp": 247,
      "hd": "15d20",
      "speed": "50 ft., burrow 30 ft.",
      "type": "Monstrosity",
      "cr": 15,
      "crLabel": "15",
      "str": 28,
      "dex": 7,
      "con": 22,
      "int": 1,
      "wis": 8,
      "cha": 4,
      "saves": "CON +11, WIS +4"
    },
    "abilities": [
      "Tunneler: The worm can burrow through solid rock at half its burrow speed and leaves a 10-foot-diameter tunnel in its wake.",
      "Multiattack: The worm makes two attacks: one with its bite and one with its stinger."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d8+9",
        "damageType": "Piercing",
        "attackBonus": 9
      },
      {
        "name": "Tail Stinger",
        "diceExpr": "3d6+9",
        "damageType": "Piercing",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "quasit",
    "name": "Quasit",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 13,
      "hp": 7,
      "hd": "3d4",
      "speed": "40 ft.",
      "type": "Fiend (Demon)",
      "cr": 1,
      "crLabel": "1",
      "str": 5,
      "dex": 17,
      "con": 10,
      "int": 7,
      "wis": 10,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The quasit can use its action to polymorph into a beast form that resembles a bat (speed 10 ft. fly 40 ft.), a centipede (40 ft., climb 40 ft.), or a toad (40 ft., swim 40 ft.), or back into its true form . Its statistics are the same in each form, except for the speed changes noted. Any equipment it is wearing or carrying isn't transformed . It reverts to its true form if it dies.",
      "Magic Resistance: The quasit has advantage on saving throws against spells and other magical effects.",
      "Scare: One creature of the quasit's choice within 20 ft. of it must succeed on a DC 10 Wisdom saving throw or be frightened for 1 minute. The target can repeat the saving throw at the end of each of its turns, with disadvantage if the quasit is within line of sight, ending the effect on itself on a success.",
      "Invisibility: The quasit magically turns invisible until it attacks or uses Scare, or until its concentration ends (as if concentrating on a spell). Any equipment the quasit wears or carries is invisible with it."
    ],
    "saves": [
      {
        "name": "Scare",
        "ability": "WIS",
        "dc": 10,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Claw (Bite in Beast Form)",
        "diceExpr": "1d4+3",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "quipper",
    "name": "Quipper",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 13,
      "hp": 1,
      "hd": "1d4",
      "speed": "swim 40 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 2,
      "dex": 16,
      "con": 9,
      "int": 1,
      "wis": 7,
      "cha": 2,
      "saves": ""
    },
    "abilities": [
      "Blood Frenzy: The quipper has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Water Breathing: The quipper can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "rakshasa",
    "name": "Rakshasa",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 110,
      "hd": "13d8",
      "speed": "40 ft.",
      "type": "Fiend",
      "cr": 13,
      "crLabel": "13",
      "str": 14,
      "dex": 17,
      "con": 18,
      "int": 13,
      "wis": 16,
      "cha": 20,
      "saves": ""
    },
    "abilities": [
      "Limited Magic Immunity: The rakshasa can't be affected or detected by spells of 6th level or lower unless it wishes to be. It has advantage on saving throws against all other spells and magical effects.",
      "Innate Spellcasting: The rakshasa's innate spellcasting ability is Charisma (spell save DC 18, +10 to hit with spell attacks). The rakshasa can innately cast the following spells, requiring no material components: At will: detect thoughts, disguise self, mage hand, minor illusion 3/day each: charm person, detect magic, invisibility, major image, suggestion 1/day each: dominate person, fly, plane shift, true seeing",
      "Multiattack: The rakshasa makes two claw attacks"
    ],
    "attacks": [
      {
        "name": "Claw",
        "diceExpr": "2d6+2",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "rat",
    "name": "Rat",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 10,
      "hp": 1,
      "hd": "1d4",
      "speed": "20 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 2,
      "dex": 11,
      "con": 9,
      "int": 2,
      "wis": 10,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The rat has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 0
      }
    ]
  },
  {
    "id": "raven",
    "name": "Raven",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 12,
      "hp": 1,
      "hd": "1d4",
      "speed": "10 ft., fly 50 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 2,
      "dex": 14,
      "con": 8,
      "int": 2,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Mimicry: The raven can mimic simple sounds it has heard, such as a person whispering, a baby crying, or an animal chittering. A creature that hears the sounds can tell they are imitations with a successful DC 10 Wisdom (Insight) check."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "red-dragon-wyrmling",
    "name": "Red Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 75,
      "hd": "10d8",
      "speed": "30 ft., climb 30 ft., fly 60 ft.",
      "type": "Dragon",
      "cr": 4,
      "crLabel": "4",
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 12,
      "wis": 11,
      "cha": 15,
      "saves": "DEX +2, CON +5, WIS +2, CHA +4"
    },
    "abilities": [
      "Fire Breath: The dragon exhales fire in a 15-foot cone. Each creature in that area must make a DC 13 Dexterity saving throw, taking 24 (7d6) fire damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Fire Breath",
        "ability": "DEX",
        "dc": 13,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+4",
        "damageType": "Piercing",
        "attackBonus": 6,
        "note": "+ 1d6 fire"
      }
    ]
  },
  {
    "id": "reef-shark",
    "name": "Reef Shark",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "4d8",
      "speed": "swim 40 ft.",
      "type": "Beast",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 14,
      "dex": 13,
      "con": 13,
      "int": 1,
      "wis": 10,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Pack Tactics: The shark has advantage on an attack roll against a creature if at least one of the shark's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Water Breathing: The shark can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "remorhaz",
    "name": "Remorhaz",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 17,
      "hp": 195,
      "hd": "17d12",
      "speed": "30 ft., burrow 20 ft.",
      "type": "Monstrosity",
      "cr": 11,
      "crLabel": "11",
      "str": 24,
      "dex": 13,
      "con": 21,
      "int": 4,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Heated Body: A creature that touches the remorhaz or hits it with a melee attack while within 5 feet of it takes 10 (3d6) fire damage.",
      "Swallow: The remorhaz makes one bite attack against a Medium or smaller creature it is grappling. If the attack hits, that creature takes the bite's damage and is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the remorhaz, and it takes 21 (6d6) acid damage at the start of each of the remorhaz's turns. If the remorhaz takes 30 damage or more on a single turn from a creature inside it, the remorhaz must succeed on a DC 15 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the remorhaz. If the remorhaz dies, a swallowed creature is no longer restrained by it and can escape from the corpse using 15 feet of movement, exiting prone."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "6d10+7",
        "damageType": "Piercing",
        "attackBonus": 11,
        "note": "+ 3d6 fire"
      }
    ]
  },
  {
    "id": "rhinoceros",
    "name": "Rhinoceros",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 45,
      "hd": "6d10",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 2,
      "crLabel": "2",
      "str": 21,
      "dex": 8,
      "con": 15,
      "int": 2,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Charge: If the rhinoceros moves at least 20 ft. straight toward a target and then hits it with a gore attack on the same turn, the target takes an extra 9 (2d8) bludgeoning damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone."
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "2d8+5",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "riding-horse",
    "name": "Riding Horse",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 10,
      "hp": 13,
      "hd": "2d10",
      "speed": "60 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 16,
      "dex": 10,
      "con": 12,
      "int": 2,
      "wis": 11,
      "cha": 7,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d4+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "roc",
    "name": "Roc",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 15,
      "hp": 248,
      "hd": "16d20",
      "speed": "20 ft., fly 120 ft.",
      "type": "Monstrosity",
      "cr": 11,
      "crLabel": "11",
      "str": 28,
      "dex": 10,
      "con": 20,
      "int": 3,
      "wis": 10,
      "cha": 9,
      "saves": "DEX +4, CON +9, WIS +4, CHA +3"
    },
    "abilities": [
      "Keen Sight: The roc has advantage on Wisdom (Perception) checks that rely on sight.",
      "Multiattack: The roc makes two attacks: one with its beak and one with its talons."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "4d8+9",
        "damageType": "Piercing",
        "attackBonus": 13
      },
      {
        "name": "Talons",
        "diceExpr": "4d6+9",
        "damageType": "Slashing",
        "attackBonus": 13
      }
    ]
  },
  {
    "id": "roper",
    "name": "Roper",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 20,
      "hp": 93,
      "hd": "11d10",
      "speed": "10 ft., climb 10 ft.",
      "type": "Monstrosity",
      "cr": 5,
      "crLabel": "5",
      "str": 18,
      "dex": 8,
      "con": 17,
      "int": 7,
      "wis": 16,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "False Appearance: While the roper remains motionless, it is indistinguishable from a normal cave formation, such as a stalagmite.",
      "Grasping Tendrils: The roper can have up to six tendrils at a time. Each tendril can be attacked (AC 20; 10 hit points; immunity to poison and psychic damage). Destroying a tendril deals no damage to the roper, which can extrude a replacement tendril on its next turn. A tendril can also be broken if a creature takes an action and succeeds on a DC 15 Strength check against it.",
      "Spider Climb: The roper can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Multiattack: The roper makes four attacks with its tendrils, uses Reel, and makes one attack with its bite.",
      "Tendril: Melee Weapon Attack: +7 to hit, reach 50 ft., one creature. Hit: The target is grappled (escape DC 15). Until the grapple ends, the target is restrained and has disadvantage on Strength checks and Strength saving throws, and the roper can't use the same tendril on another target.",
      "Reel: The roper pulls each creature grappled by it up to 25 ft. straight toward it."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d8+4",
        "damageType": "Piercing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "rug-of-smothering",
    "name": "Rug of Smothering",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 33,
      "hd": "6d10",
      "speed": "10 ft.",
      "type": "Construct",
      "cr": 2,
      "crLabel": "2",
      "str": 17,
      "dex": 14,
      "con": 10,
      "int": 1,
      "wis": 3,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Antimagic Susceptibility: The rug is incapacitated while in the area of an antimagic field. If targeted by dispel magic, the rug must succeed on a Constitution saving throw against the caster's spell save DC or fall unconscious for 1 minute.",
      "Damage Transfer: While it is grappling a creature, the rug takes only half the damage dealt to it, and the creature grappled by the rug takes the other half.",
      "False Appearance: While the rug remains motionless, it is indistinguishable from a normal rug.",
      "Smother: Melee Weapon Attack: +5 to hit, reach 5 ft., one Medium or smaller creature. Hit: The creature is grappled (escape DC 13). Until this grapple ends, the target is restrained, blinded, and at risk of suffocating, and the rug can't smother another target. In addition, at the start of each of the target's turns, the target takes 10 (2d6 + 3) bludgeoning damage."
    ]
  },
  {
    "id": "rust-monster",
    "name": "Rust Monster",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 27,
      "hd": "5d8",
      "speed": "40 ft.",
      "type": "Monstrosity",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 13,
      "dex": 12,
      "con": 13,
      "int": 2,
      "wis": 13,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Iron Scent: The rust monster can pinpoint, by scent, the location of ferrous metal within 30 feet of it.",
      "Rust Metal: Any nonmagical weapon made of metal that hits the rust monster corrodes. After dealing damage, the weapon takes a permanent and cumulative -1 penalty to damage rolls. If its penalty drops to -5, the weapon is destroyed. Nonmagical ammunition made of metal that hits the rust monster is destroyed after dealing damage.",
      "Antennae: The rust monster corrodes a nonmagical ferrous metal object it can see within 5 feet of it. If the object isn't being worn or carried, the touch destroys a 1-foot cube of it. If the object is being worn or carried by a creature, the creature can make a DC 11 Dexterity saving throw to avoid the rust monster's touch. If the object touched is either metal armor or a metal shield being worn or carried, its takes a permanent and cumulative -1 penalty to the AC it offers. Armor reduced to an AC of 10 or a shield that drops to a +0 bonus is destroyed. If the object touched is a held metal weapon, it rusts as described in the Rust Metal trait."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "saber-toothed-tiger",
    "name": "Saber-Toothed Tiger",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 52,
      "hd": "7d10",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 2,
      "crLabel": "2",
      "str": 18,
      "dex": 14,
      "con": 15,
      "int": 3,
      "wis": 12,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The tiger has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pounce: If the tiger moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+5",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+5",
        "damageType": "Slashing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "sahuagin",
    "name": "Sahuagin",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "4d8",
      "speed": "30 ft., swim 40 ft.",
      "type": "Humanoid (Sahuagin)",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 13,
      "dex": 11,
      "con": 12,
      "int": 12,
      "wis": 13,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Blood Frenzy: The sahuagin has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Limited Amphibiousness: The sahuagin can breathe air and water, but it needs to be submerged at least once every 4 hours to avoid suffocating.",
      "Shark Telepathy: The sahuagin can magically command any shark within 120 feet of it, using a limited telepathy.",
      "Multiattack: The sahuagin makes two melee attacks: one with its bite and one with its claws or spear."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+1",
        "damageType": "Piercing",
        "attackBonus": 3
      },
      {
        "name": "Claws",
        "diceExpr": "1d4+1",
        "damageType": "Slashing",
        "attackBonus": 3
      },
      {
        "name": "Spear",
        "diceExpr": "1d6+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "salamander",
    "name": "Salamander",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 15,
      "hp": 90,
      "hd": "12d10",
      "speed": "30 ft.",
      "type": "Elemental",
      "cr": 5,
      "crLabel": "5",
      "str": 18,
      "dex": 14,
      "con": 15,
      "int": 11,
      "wis": 10,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Heated Body: A creature that touches the salamander or hits it with a melee attack while within 5 ft. of it takes 7 (2d6) fire damage.",
      "Heated Weapons: Any metal melee weapon the salamander wields deals an extra 3 (1d6) fire damage on a hit (included in the attack).",
      "Multiattack: The salamander makes two attacks: one with its spear and one with its tail."
    ],
    "attacks": [
      {
        "name": "Spear",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 7,
        "note": "+ 1d6 fire"
      },
      {
        "name": "Tail",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 7,
        "note": "+ 2d6 fire"
      }
    ]
  },
  {
    "id": "satyr",
    "name": "Satyr",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 31,
      "hd": "7d8",
      "speed": "40 ft.",
      "type": "Fey",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 12,
      "dex": 16,
      "con": 11,
      "int": 12,
      "wis": 10,
      "cha": 14,
      "saves": ""
    },
    "abilities": [
      "Magic Resistance: The satyr has advantage on saving throws against spells and other magical effects."
    ],
    "attacks": [
      {
        "name": "Ram",
        "diceExpr": "2d4+1",
        "damageType": "Bludgeoning",
        "attackBonus": 3
      },
      {
        "name": "Shortsword",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Shortbow",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "scorpion",
    "name": "Scorpion",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 11,
      "hp": 1,
      "hd": "1d4",
      "speed": "10 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 2,
      "dex": 11,
      "con": 8,
      "int": 1,
      "wis": 8,
      "cha": 2,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Sting",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "scout",
    "name": "Scout",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 16,
      "hd": "3d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 11,
      "dex": 14,
      "con": 12,
      "int": 11,
      "wis": 13,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Sight: The scout has advantage on Wisdom (Perception) checks that rely on hearing or sight.",
      "Multiattack: The scout makes two melee attacks or two ranged attacks."
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "sea-hag",
    "name": "Sea Hag",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 52,
      "hd": "7d8",
      "speed": "30 ft., swim 40 ft.",
      "type": "Fey",
      "cr": 2,
      "crLabel": "2",
      "str": 16,
      "dex": 13,
      "con": 16,
      "int": 12,
      "wis": 12,
      "cha": 13,
      "saves": ""
    },
    "abilities": [
      "Amphibious: The hag can breathe air and water.",
      "Horrific Appearance: Any humanoid that starts its turn within 30 feet of the hag and can see the hag's true form must make a DC 11 Wisdom saving throw. On a failed save, the creature is frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the hag is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the hag's Horrific Appearance for the next 24 hours. Unless the target is surprised or the revelation of the hag's true form is sudden, the target can avert its eyes and avoid making the initial saving throw. Until the start of its next turn, a creature that averts its eyes has disadvantage on attack rolls against the hag.",
      "Death Glare: The hag targets one frightened creature she can see within 30 ft. of her. If the target can see the hag, it must succeed on a DC 11 Wisdom saving throw against this magic or drop to 0 hit points.",
      "Illusory Appearance: The hag covers herself and anything she is wearing or carrying with a magical illusion that makes her look like an ugly creature of her general size and humanoid shape. The effect ends if the hag takes a bonus action to end it or if she dies. The changes wrought by this effect fail to hold up to physical inspection. For example, the hag could appear to have no claws, but someone touching her hand might feel the claws. Otherwise, a creature must take an action to visually inspect the illusion and succeed on a DC 16 Intelligence (Investigation) check to discern that the hag is disguised."
    ],
    "saves": [
      {
        "name": "Death Glare",
        "ability": "WIS",
        "dc": 11,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "sea-horse",
    "name": "Sea Horse",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 11,
      "hp": 1,
      "hd": "1d4",
      "speed": "swim 20 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 1,
      "dex": 12,
      "con": 8,
      "int": 1,
      "wis": 10,
      "cha": 2,
      "saves": ""
    },
    "abilities": [
      "Water Breathing: The sea horse can breathe only underwater."
    ]
  },
  {
    "id": "shadow",
    "name": "Shadow",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 16,
      "hd": "3d8",
      "speed": "40 ft.",
      "type": "Undead",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 6,
      "dex": 14,
      "con": 13,
      "int": 6,
      "wis": 10,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Amorphous: The shadow can move through a space as narrow as 1 inch wide without squeezing.",
      "Shadow Stealth: While in dim light or darkness, the shadow can take the Hide action as a bonus action. Its stealth bonus is also improved to +6.",
      "Sunlight Weakness: While in sunlight, the shadow has disadvantage on attack rolls, ability checks, and saving throws."
    ],
    "attacks": [
      {
        "name": "Strength Drain",
        "diceExpr": "2d6+2",
        "damageType": "Necrotic",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "shambling-mound",
    "name": "Shambling Mound",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 15,
      "hp": 136,
      "hd": "16d10",
      "speed": "20 ft., swim 20 ft.",
      "type": "Plant",
      "cr": 5,
      "crLabel": "5",
      "str": 18,
      "dex": 8,
      "con": 16,
      "int": 5,
      "wis": 10,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Lightning Absorption: Whenever the shambling mound is subjected to lightning damage, it takes no damage and regains a number of hit points equal to the lightning damage dealt.",
      "Multiattack: The shambling mound makes two slam attacks. If both attacks hit a Medium or smaller target, the target is grappled (escape DC 14), and the shambling mound uses its Engulf on it.",
      "Engulf: The shambling mound engulfs a Medium or smaller creature grappled by it. The engulfed target is blinded, restrained, and unable to breathe, and it must succeed on a DC 14 Constitution saving throw at the start of each of the mound's turns or take 13 (2d8 + 4) bludgeoning damage. If the mound moves, the engulfed target moves with it. The mound can have only one creature engulfed at a time."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "shield-guardian",
    "name": "Shield Guardian",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 142,
      "hd": "15d10",
      "speed": "30 ft.",
      "type": "Construct",
      "cr": 7,
      "crLabel": "7",
      "str": 18,
      "dex": 8,
      "con": 18,
      "int": 7,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Bound: The shield guardian is magically bound to an amulet. As long as the guardian and its amulet are on the same plane of existence, the amulet's wearer can telepathically call the guardian to travel to it, and the guardian knows the distance and direction to the amulet. If the guardian is within 60 feet of the amulet's wearer, half of any damage the wearer takes (rounded up) is transferred to the guardian.",
      "Regeneration: The shield guardian regains 10 hit points at the start of its turn if it has at least 1 hit. point.",
      "Spell Storing: A spellcaster who wears the shield guardian's amulet can cause the guardian to store one spell of 4th level or lower. To do so, the wearer must cast the spell on the guardian. The spell has no effect but is stored within the guardian. When commanded to do so by the wearer or when a situation arises that was predefined by the spellcaster, the guardian casts the stored spell with any parameters set by the original caster, requiring no components. When the spell is cast or a new spell is stored, any previously stored spell is lost.",
      "Multiattack: The guardian makes two fist attacks."
    ],
    "attacks": [
      {
        "name": "Fist",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "shrieker",
    "name": "Shrieker",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 5,
      "hp": 13,
      "hd": "3d8",
      "speed": "0 ft.",
      "type": "Plant",
      "cr": 0,
      "crLabel": "0",
      "str": 1,
      "dex": 1,
      "con": 10,
      "int": 1,
      "wis": 3,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "False Appearance: While the shrieker remains motionless, it is indistinguishable from an ordinary fungus."
    ]
  },
  {
    "id": "silver-dragon-wyrmling",
    "name": "Silver Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 45,
      "hd": "6d8",
      "speed": "30 ft., fly 60 ft.",
      "type": "Dragon",
      "cr": 2,
      "crLabel": "2",
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 12,
      "wis": 11,
      "cha": 15,
      "saves": "DEX +2, CON +5, WIS +2, CHA +4"
    },
    "abilities": [
      "Breath Weapons: The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 15-foot cone. Each creature in that area must make a DC 13 Constitution saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one. Paralyzing Breath. The dragon exhales paralyzing gas in a 15-foot cone. Each creature in that area must succeed on a DC 13 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "skeleton",
    "name": "Skeleton",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 13,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Undead",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 10,
      "dex": 14,
      "con": 15,
      "int": 6,
      "wis": 8,
      "cha": 5,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Shortbow",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "solar",
    "name": "Solar",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 21,
      "hp": 243,
      "hd": "18d10",
      "speed": "50 ft., fly 150 ft.",
      "type": "Celestial",
      "cr": 21,
      "crLabel": "21",
      "str": 26,
      "dex": 22,
      "con": 26,
      "int": 25,
      "wis": 25,
      "cha": 30,
      "saves": "INT +14, WIS +14, CHA +17"
    },
    "abilities": [
      "Angelic Weapons: The solar's weapon attacks are magical. When the solar hits with any weapon, the weapon deals an extra 6d8 radiant damage (included in the attack).",
      "Divine Awareness: The solar knows if it hears a lie.",
      "Innate Spellcasting: The solar's spell casting ability is Charisma (spell save DC 25). It can innately cast the following spells, requiring no material components: At will: detect evil and good, invisibility (self only) 3/day each: blade barrier, dispel evil and good, resurrection 1/day each: commune, control weather",
      "Magic Resistance: The solar has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The solar makes two greatsword attacks.",
      "Flying Sword: The solar releases its greatsword to hover magically in an unoccupied space within 5 ft. of it. If the solar can see the sword, the solar can mentally command it as a bonus action to fly up to 50 ft. and either make one attack against a target or return to the solar's hands. If the hovering sword is targeted by any effect, the solar is considered to be holding it. The hovering sword falls if the solar dies.",
      "Healing Touch: The solar touches another creature. The target magically regains 40 (8d8 + 4) hit points and is freed from any curse, disease, poison, blindness, or deafness.",
      "Teleport (Legendary): The solar magically teleports, along with any equipment it is wearing or carrying, up to 120 ft. to an unoccupied space it can see.",
      "Searing Burst (Costs 2 Actions) (Legendary): The solar emits magical, divine energy. Each creature of its choice in a 10-foot radius must make a DC 23 Dexterity saving throw, taking 14 (4d6) fire damage plus 14 (4d6) radiant damage on a failed save, or half as much damage on a successful one.",
      "Blinding Gaze (Costs 3 Actions) (Legendary): The solar targets one creature it can see within 30 ft. of it. If the target can see it, the target must succeed on a DC 15 Constitution saving throw or be blinded until magic such as the lesser restoration spell removes the blindness."
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "4d6+8",
        "damageType": "Slashing",
        "attackBonus": 15,
        "note": "+ 6d8 radiant"
      },
      {
        "name": "Slaying Longbow",
        "diceExpr": "2d8+6",
        "damageType": "Piercing",
        "attackBonus": 13,
        "note": "+ 6d8 radiant"
      }
    ]
  },
  {
    "id": "specter",
    "name": "Specter",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "5d8",
      "speed": "0 ft., fly 50 ft., (hover)",
      "type": "Undead",
      "cr": 1,
      "crLabel": "1",
      "str": 1,
      "dex": 14,
      "con": 11,
      "int": 10,
      "wis": 10,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Incorporeal Movement: The specter can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Sunlight Sensitivity: While in sunlight, the specter has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight."
    ],
    "attacks": [
      {
        "name": "Life Drain",
        "diceExpr": "3d6",
        "damageType": "Necrotic",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "spider",
    "name": "Spider",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 12,
      "hp": 1,
      "hd": "1d4",
      "speed": "20 ft., climb 20 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 2,
      "dex": 14,
      "con": 8,
      "int": 1,
      "wis": 10,
      "cha": 2,
      "saves": ""
    },
    "abilities": [
      "Spider Climb: The spider can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the spider knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The spider ignores movement restrictions caused by webbing."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "spirit-naga",
    "name": "Spirit Naga",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 15,
      "hp": 75,
      "hd": "10d10",
      "speed": "40 ft.",
      "type": "Monstrosity",
      "cr": 8,
      "crLabel": "8",
      "str": 18,
      "dex": 17,
      "con": 14,
      "int": 16,
      "wis": 15,
      "cha": 16,
      "saves": "DEX +6, CON +5, WIS +5, CHA +6"
    },
    "abilities": [
      "Rejuvenation: If it dies, the naga returns to life in 1d6 days and regains all its hit points. Only a wish spell can prevent this trait from functioning.",
      "Spellcasting: The naga is a 10th-level spellcaster. Its spellcasting ability is Intelligence (spell save DC 14, +6 to hit with spell attacks), and it needs only verbal components to cast its spells. It has the following wizard spells prepared: - Cantrips (at will): mage hand, minor illusion, ray of frost - 1st level (4 slots): charm person, detect magic, sleep - 2nd level (3 slots): detect thoughts, hold person - 3rd level (3 slots): lightning bolt, water breathing - 4th level (3 slots): blight, dimension door - 5th level (2 slots): dominate person"
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+4",
        "damageType": "Piercing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "sprite",
    "name": "Sprite",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 15,
      "hp": 2,
      "hd": "1d4",
      "speed": "10 ft., fly 40 ft.",
      "type": "Fey",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 3,
      "dex": 18,
      "con": 10,
      "int": 14,
      "wis": 13,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Heart Sight: The sprite touches a creature and magically knows the creature's current emotional state. If the target fails a DC 10 Charisma saving throw, the sprite also knows the creature's alignment. Celestials, fiends, and undead automatically fail the saving throw.",
      "Invisibility: The sprite magically turns invisible until it attacks or casts a spell, or until its concentration ends (as if concentrating on a spell). Any equipment the sprite wears or carries is invisible with it."
    ],
    "saves": [
      {
        "name": "Heart Sight",
        "ability": "CHA",
        "dc": 10,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "1",
        "damageType": "Slashing",
        "attackBonus": 2
      },
      {
        "name": "Shortbow",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "spy",
    "name": "Spy",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 27,
      "hd": "6d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 1,
      "crLabel": "1",
      "str": 10,
      "dex": 15,
      "con": 10,
      "int": 12,
      "wis": 14,
      "cha": 16,
      "saves": ""
    },
    "abilities": [
      "Cunning Action: On each of its turns, the spy can use a bonus action to take the Dash, Disengage, or Hide action.",
      "Sneak Attack (1/Turn): The spy deals an extra 7 (2d6) damage when it hits a target with a weapon attack and has advantage on the attack roll, or when the target is within 5 ft. of an ally of the spy that isn't incapacitated and the spy doesn't have disadvantage on the attack roll.",
      "Multiattack: The spy makes two melee attacks."
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Hand Crossbow",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "steam-mephit",
    "name": "Steam Mephit",
    "category": "creature",
    "size": "Small",
    "stats": {
      "ac": 10,
      "hp": 21,
      "hd": "6d6",
      "speed": "30 ft., fly 30 ft.",
      "type": "Elemental",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 5,
      "dex": 11,
      "con": 10,
      "int": 11,
      "wis": 10,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Death Burst: When the mephit dies, it explodes in a cloud of steam. Each creature within 5 ft. of the mephit must succeed on a DC 10 Dexterity saving throw or take 4 (1d8) fire damage.",
      "Innate Spellcasting: The mephit can innately cast blur, requiring no material components. Its innate spellcasting ability is Charisma.",
      "Steam Breath: The mephit exhales a 15-foot cone of scalding steam. Each creature in that area must succeed on a DC 10 Dexterity saving throw, taking 4 (1d8) fire damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Steam Breath",
        "ability": "DEX",
        "dc": 10,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Claws",
        "diceExpr": "1d4",
        "damageType": "Slashing",
        "attackBonus": 2,
        "note": "+ 1d4 fire"
      }
    ]
  },
  {
    "id": "stirge",
    "name": "Stirge",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 14,
      "hp": 2,
      "hd": "1d4",
      "speed": "10 ft., fly 40 ft.",
      "type": "Beast",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 4,
      "dex": 16,
      "con": 11,
      "int": 2,
      "wis": 8,
      "cha": 6,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Blood Drain",
        "diceExpr": "1d4+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "stone-giant",
    "name": "Stone Giant",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 17,
      "hp": 126,
      "hd": "11d12",
      "speed": "40 ft.",
      "type": "Giant",
      "cr": 7,
      "crLabel": "7",
      "str": 23,
      "dex": 15,
      "con": 20,
      "int": 10,
      "wis": 12,
      "cha": 9,
      "saves": "DEX +5, CON +8, WIS +4"
    },
    "abilities": [
      "Stone Camouflage: The giant has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
      "Multiattack: The giant makes two greatclub attacks."
    ],
    "attacks": [
      {
        "name": "Greatclub",
        "diceExpr": "3d8+6",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      },
      {
        "name": "Rock",
        "diceExpr": "4d10+6",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "stone-golem",
    "name": "Stone Golem",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 178,
      "hd": "17d10",
      "speed": "30 ft.",
      "type": "Construct",
      "cr": 10,
      "crLabel": "10",
      "str": 22,
      "dex": 9,
      "con": 20,
      "int": 3,
      "wis": 11,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Immutable Form: The golem is immune to any spell or effect that would alter its form.",
      "Magic Resistance: The golem has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The golem's weapon attacks are magical.",
      "Multiattack: The golem makes two slam attacks.",
      "Slow: The golem targets one or more creatures it can see within 10 ft. of it. Each target must make a DC 17 Wisdom saving throw against this magic. On a failed save, a target can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the target can take either an action or a bonus action on its turn, not both. These effects last for 1 minute. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    "saves": [
      {
        "name": "Slow",
        "ability": "WIS",
        "dc": 17,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "3d8+6",
        "damageType": "Bludgeoning",
        "attackBonus": 10
      }
    ]
  },
  {
    "id": "storm-giant",
    "name": "Storm Giant",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 16,
      "hp": 230,
      "hd": "20d12",
      "speed": "50 ft., swim 50 ft.",
      "type": "Giant",
      "cr": 13,
      "crLabel": "13",
      "str": 29,
      "dex": 14,
      "con": 20,
      "int": 16,
      "wis": 18,
      "cha": 18,
      "saves": "STR +14, CON +10, WIS +9, CHA +9"
    },
    "abilities": [
      "Amphibious: The giant can breathe air and water.",
      "Innate Spellcasting: The giant's innate spellcasting ability is Charisma (spell save DC 17). It can innately cast the following spells, requiring no material components: At will: detect magic, feather fall, levitate, light 3/day each: control weather, water breathing",
      "Multiattack: The giant makes two greatsword attacks.",
      "Lightning Strike: The giant hurls a magical lightning bolt at a point it can see within 500 feet of it. Each creature within 10 feet of that point must make a DC 17 Dexterity saving throw, taking 54 (12d8) lightning damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Lightning Strike",
        "ability": "DEX",
        "dc": 17,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Greatsword",
        "diceExpr": "6d6+9",
        "damageType": "Slashing",
        "attackBonus": 14
      },
      {
        "name": "Rock",
        "diceExpr": "4d12+9",
        "damageType": "Bludgeoning",
        "attackBonus": 14
      }
    ]
  },
  {
    "id": "succubus-incubus",
    "name": "Succubus/Incubus",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 66,
      "hd": "12d8",
      "speed": "30 ft., fly 60 ft.",
      "type": "Fiend (Shapechanger)",
      "cr": 4,
      "crLabel": "4",
      "str": 8,
      "dex": 17,
      "con": 13,
      "int": 15,
      "wis": 12,
      "cha": 20,
      "saves": ""
    },
    "abilities": [
      "Telepathic Bond: The fiend ignores the range restriction on its telepathy when communicating with a creature it has charmed. The two don't even need to be on the same plane of existence.",
      "Shapechanger: The fiend can use its action to polymorph into a Small or Medium humanoid, or back into its true form. Without wings, the fiend loses its flying speed. Other than its size and speed, its statistics are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Charm: One humanoid the fiend can see within 30 feet of it must succeed on a DC 15 Wisdom saving throw or be magically charmed for 1 day. The charmed target obeys the fiend's verbal or telepathic commands. If the target suffers any harm or receives a suicidal command, it can repeat the saving throw, ending the effect on a success. If the target successfully saves against the effect, or if the effect on it ends, the target is immune to this fiend's Charm for the next 24 hours. The fiend can have only one target charmed at a time. If it charms another, the effect on the previous target ends.",
      "Draining Kiss: The fiend kisses a creature charmed by it or a willing creature. The target must make a DC 15 Constitution saving throw against this magic, taking 32 (5d10 + 5) psychic damage on a failed save, or half as much damage on a successful one. The target's hit point maximum is reduced by an amount equal to the damage taken. This reduction lasts until the target finishes a long rest. The target dies if this effect reduces its hit point maximum to 0.",
      "Etherealness: The fiend magically enters the Ethereal Plane from the Material Plane, or vice versa."
    ],
    "saves": [
      {
        "name": "Charm",
        "ability": "WIS",
        "dc": 15,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Claw (Fiend Form Only)",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "swarm-of-bats",
    "name": "Swarm of Bats",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "5d8",
      "speed": "0 ft., fly 30 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 5,
      "dex": 15,
      "con": 10,
      "int": 2,
      "wis": 12,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Echolocation: The swarm can't use its blindsight while deafened.",
      "Keen Hearing: The swarm has advantage on Wisdom (Perception) checks that rely on hearing.",
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny bat. The swarm can't regain hit points or gain temporary hit points."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d4",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "swarm-of-beetles",
    "name": "Swarm of Beetles",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "5d8",
      "speed": "20 ft., burrow 5 ft., climb 20 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 3,
      "dex": 13,
      "con": 10,
      "int": 1,
      "wis": 7,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "4d4",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "swarm-of-centipedes",
    "name": "Swarm of Centipedes",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "5d8",
      "speed": "20 ft., climb 20 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 3,
      "dex": 13,
      "con": 10,
      "int": 1,
      "wis": 7,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "4d4",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "swarm-of-insects",
    "name": "Swarm of Insects",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "5d8",
      "speed": "20 ft., climb 20 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 3,
      "dex": 13,
      "con": 10,
      "int": 1,
      "wis": 7,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "4d4",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "swarm-of-poisonous-snakes",
    "name": "Swarm of Poisonous Snakes",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 36,
      "hd": "8d8",
      "speed": "30 ft., swim 30 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 2,
      "crLabel": "2",
      "str": 8,
      "dex": 18,
      "con": 11,
      "int": 1,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny snake. The swarm can't regain hit points or gain temporary hit points."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d6",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "swarm-of-quippers",
    "name": "Swarm of Quippers",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 28,
      "hd": "8d8",
      "speed": "0 ft., swim 40 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 1,
      "crLabel": "1",
      "str": 13,
      "dex": 16,
      "con": 9,
      "int": 1,
      "wis": 7,
      "cha": 2,
      "saves": ""
    },
    "abilities": [
      "Blood Frenzy: The swarm has advantage on melee attack rolls against any creature that doesn't have all its hit points.",
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny quipper. The swarm can't regain hit points or gain temporary hit points.",
      "Water Breathing: The swarm can breathe only underwater."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "4d6",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "swarm-of-rats",
    "name": "Swarm of Rats",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 24,
      "hd": "7d8",
      "speed": "30 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 9,
      "dex": 11,
      "con": 9,
      "int": 2,
      "wis": 10,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The swarm has advantage on Wisdom (Perception) checks that rely on smell.",
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. The swarm can't regain hit points or gain temporary hit points."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "2d6",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "swarm-of-ravens",
    "name": "Swarm of Ravens",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 24,
      "hd": "7d8",
      "speed": "10 ft., fly 50 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 6,
      "dex": 14,
      "con": 8,
      "int": 3,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny raven. The swarm can't regain hit points or gain temporary hit points."
    ],
    "attacks": [
      {
        "name": "Beaks",
        "diceExpr": "2d6",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "swarm-of-spiders",
    "name": "Swarm of Spiders",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "5d8",
      "speed": "20 ft., climb 20 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 3,
      "dex": 13,
      "con": 10,
      "int": 1,
      "wis": 7,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points.",
      "Spider Climb: The swarm can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Web Sense: While in contact with a web, the swarm knows the exact location of any other creature in contact with the same web.",
      "Web Walker: The swarm ignores movement restrictions caused by webbing."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "4d4",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "swarm-of-wasps",
    "name": "Swarm of Wasps",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 22,
      "hd": "5d8",
      "speed": "5 ft., fly 30 ft.",
      "type": "Swarm of Tiny beasts",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 3,
      "dex": 13,
      "con": 10,
      "int": 1,
      "wis": 7,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "Swarm: The swarm can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny insect. The swarm can't regain hit points or gain temporary hit points."
    ],
    "attacks": [
      {
        "name": "Bites",
        "diceExpr": "4d4",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "tarrasque",
    "name": "Tarrasque",
    "category": "creature",
    "size": "Gargantuan",
    "stats": {
      "ac": 25,
      "hp": 676,
      "hd": "33d20",
      "speed": "40 ft.",
      "type": "Monstrosity (Titan)",
      "cr": 30,
      "crLabel": "30",
      "str": 30,
      "dex": 11,
      "con": 30,
      "int": 3,
      "wis": 11,
      "cha": 11,
      "saves": "INT +5, WIS +9, CHA +9"
    },
    "abilities": [
      "Legendary Resistance: If the tarrasque fails a saving throw, it can choose to succeed instead.",
      "Magic Resistance: The tarrasque has advantage on saving throws against spells and other magical effects.",
      "Reflective Carapace: Any time the tarrasque is targeted by a magic missile spell, a line spell, or a spell that requires a ranged attack roll, roll a d6. On a 1 to 5, the tarrasque is unaffected. On a 6, the tarrasque is unaffected, and the effect is reflected back at the caster as though it originated from the tarrasque, turning the caster into the target.",
      "Siege Monster: The tarrasque deals double damage to objects and structures.",
      "Multiattack: The tarrasque can use its Frightful Presence. It then makes five attacks: one with its bite, two with its claws, one with its horns, and one with its tail. It can use its Swallow instead of its bite.",
      "Frightful Presence: Each creature of the tarrasque's choice within 120 feet of it and aware of it must succeed on a DC 17 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, with disadvantage if the tarrasque is within line of sight, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the tarrasque's Frightful Presence for the next 24 hours.",
      "Swallow: The tarrasque makes one bite attack against a Large or smaller creature it is grappling. If the attack hits, the target takes the bite's damage, the target is swallowed, and the grapple ends. While swallowed, the creature is blinded and restrained, it has total cover against attacks and other effects outside the tarrasque, and it takes 56 (16d6) acid damage at the start of each of the tarrasque's turns. If the tarrasque takes 60 damage or more on a single turn from a creature inside it, the tarrasque must succeed on a DC 20 Constitution saving throw at the end of that turn or regurgitate all swallowed creatures, which fall prone in a space within 10 feet of the tarrasque. If the tarrasque dies, a swallowed creature is no longer restrained by it and can escape from the corpse by using 30 feet of movement, exiting prone.",
      "Attack (Legendary): The tarrasque makes one claw attack or tail attack.",
      "Move (Legendary): The tarrasque moves up to half its speed.",
      "Chomp (Costs 2 Actions) (Legendary): The tarrasque makes one bite attack or uses its Swallow."
    ],
    "saves": [
      {
        "name": "Frightful Presence",
        "ability": "WIS",
        "dc": 17,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d12+10",
        "damageType": "Piercing",
        "attackBonus": 19
      },
      {
        "name": "Claw",
        "diceExpr": "4d8+10",
        "damageType": "Slashing",
        "attackBonus": 19
      },
      {
        "name": "Horns",
        "diceExpr": "4d10+10",
        "damageType": "Piercing",
        "attackBonus": 19
      },
      {
        "name": "Tail",
        "diceExpr": "4d6+10",
        "damageType": "Bludgeoning",
        "attackBonus": 19
      }
    ]
  },
  {
    "id": "thug",
    "name": "Thug",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 32,
      "hd": "5d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 15,
      "dex": 11,
      "con": 14,
      "int": 10,
      "wis": 10,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Pack Tactics: The thug has advantage on an attack roll against a creature if at least one of the thug's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Multiattack: The thug makes two melee attacks."
    ],
    "attacks": [
      {
        "name": "Mace",
        "diceExpr": "1d6+2",
        "damageType": "Bludgeoning",
        "attackBonus": 4
      },
      {
        "name": "Heavy Crossbow",
        "diceExpr": "1d10",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "tiger",
    "name": "Tiger",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 37,
      "hd": "5d10",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 1,
      "crLabel": "1",
      "str": 17,
      "dex": 15,
      "con": 14,
      "int": 3,
      "wis": 12,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The tiger has advantage on Wisdom (Perception) checks that rely on smell.",
      "Pounce: If the tiger moves at least 20 ft. straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the tiger can make one bite attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Claw",
        "diceExpr": "1d8+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "treant",
    "name": "Treant",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 16,
      "hp": 138,
      "hd": "12d12",
      "speed": "30 ft.",
      "type": "Plant",
      "cr": 9,
      "crLabel": "9",
      "str": 23,
      "dex": 8,
      "con": 21,
      "int": 12,
      "wis": 16,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "False Appearance: While the treant remains motionless, it is indistinguishable from a normal tree.",
      "Siege Monster: The treant deals double damage to objects and structures.",
      "Multiattack: The treant makes two slam attacks.",
      "Animate Trees: The treant magically animates one or two trees it can see within 60 feet of it. These trees have the same statistics as a treant, except they have Intelligence and Charisma scores of 1, they can't speak, and they have only the Slam action option. An animated tree acts as an ally of the treant. The tree remains animate for 1 day or until it dies; until the treant dies or is more than 120 feet from the tree; or until the treant takes a bonus action to turn it back into an inanimate tree. The tree then takes root if possible."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "3d6+6",
        "damageType": "Bludgeoning",
        "attackBonus": 10
      },
      {
        "name": "Rock",
        "diceExpr": "4d10+6",
        "damageType": "Bludgeoning",
        "attackBonus": 10
      }
    ]
  },
  {
    "id": "tribal-warrior",
    "name": "Tribal Warrior",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 11,
      "hd": "2d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 0.125,
      "crLabel": "1/8",
      "str": 13,
      "dex": 11,
      "con": 12,
      "int": 8,
      "wis": 11,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Pack Tactics: The warrior has advantage on an attack roll against a creature if at least one of the warrior's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Spear",
        "diceExpr": "1d6+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "triceratops",
    "name": "Triceratops",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 13,
      "hp": 95,
      "hd": "10d12",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 5,
      "crLabel": "5",
      "str": 22,
      "dex": 9,
      "con": 17,
      "int": 2,
      "wis": 11,
      "cha": 5,
      "saves": ""
    },
    "abilities": [
      "Trampling Charge: If the triceratops moves at least 20 ft. straight toward a creature and then hits it with a gore attack on the same turn, that target must succeed on a DC 13 Strength saving throw or be knocked prone. If the target is prone, the triceratops can make one stomp attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Gore",
        "diceExpr": "4d8+6",
        "damageType": "Piercing",
        "attackBonus": 9
      },
      {
        "name": "Stomp",
        "diceExpr": "3d10+6",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "troll",
    "name": "Troll",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 15,
      "hp": 84,
      "hd": "8d10",
      "speed": "30 ft.",
      "type": "Giant",
      "cr": 5,
      "crLabel": "5",
      "str": 18,
      "dex": 13,
      "con": 20,
      "int": 7,
      "wis": 9,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Keen Smell: The troll has advantage on Wisdom (Perception) checks that rely on smell.",
      "Regeneration: The troll regains 10 hit points at the start of its turn. If the troll takes acid or fire damage, this trait doesn't function at the start of the troll's next turn. The troll dies only if it starts its turn with 0 hit points and doesn't regenerate.",
      "Multiattack: The troll makes three attacks: one with its bite and two with its claws."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "tyrannosaurus-rex",
    "name": "Tyrannosaurus Rex",
    "category": "creature",
    "size": "Huge",
    "stats": {
      "ac": 13,
      "hp": 136,
      "hd": "13d12",
      "speed": "50 ft.",
      "type": "Beast",
      "cr": 8,
      "crLabel": "8",
      "str": 25,
      "dex": 10,
      "con": 19,
      "int": 2,
      "wis": 12,
      "cha": 9,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The tyrannosaurus makes two attacks: one with its bite and one with its tail. It can't make both attacks against the same target."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "4d12+7",
        "damageType": "Piercing",
        "attackBonus": 10
      },
      {
        "name": "Tail",
        "diceExpr": "3d8+7",
        "damageType": "Bludgeoning",
        "attackBonus": 10
      }
    ]
  },
  {
    "id": "unicorn",
    "name": "Unicorn",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 12,
      "hp": 67,
      "hd": "9d10",
      "speed": "50 ft.",
      "type": "Celestial",
      "cr": 5,
      "crLabel": "5",
      "str": 18,
      "dex": 14,
      "con": 15,
      "int": 11,
      "wis": 17,
      "cha": 16,
      "saves": ""
    },
    "abilities": [
      "Charge: If the unicorn moves at least 20 ft. straight toward a target and then hits it with a horn attack on the same turn, the target takes an extra 9 (2d8) piercing damage. If the target is a creature, it must succeed on a DC 15 Strength saving throw or be knocked prone.",
      "Innate Spellcasting: The unicorn's innate spellcasting ability is Charisma (spell save DC 14). The unicorn can innately cast the following spells, requiring no components: At will: detect evil and good, druidcraft, pass without trace 1/day each: calm emotions, dispel evil and good, entangle",
      "Magic Resistance: The unicorn has advantage on saving throws against spells and other magical effects.",
      "Magic Weapons: The unicorn's weapon attacks are magical.",
      "Multiattack: The unicorn makes two attacks: one with its hooves and one with its horn.",
      "Healing Touch: The unicorn touches another creature with its horn. The target magically regains 11 (2d8 + 2) hit points. In addition, the touch removes all diseases and neutralizes all poisons afflicting the target.",
      "Teleport: The unicorn magically teleports itself and up to three willing creatures it can see within 5 ft. of it, along with any equipment they are wearing or carrying, to a location the unicorn is familiar with, up to 1 mile away.",
      "Hooves (Legendary): The unicorn makes one attack with its hooves.",
      "Shimmering Shield (Costs 2 Actions) (Legendary): The unicorn creates a shimmering, magical field around itself or another creature it can see within 60 ft. of it. The target gains a +2 bonus to AC until the end of the unicorn's next turn.",
      "Heal Self (Costs 3 Actions) (Legendary): The unicorn magically regains 11 (2d8 + 2) hit points."
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      },
      {
        "name": "Horn",
        "diceExpr": "1d8+4",
        "damageType": "Piercing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "vampire-vampire",
    "name": "Vampire, Vampire Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 144,
      "hd": "17d8",
      "speed": "30 ft.",
      "type": "Undead (Shapechanger)",
      "cr": 13,
      "crLabel": "13",
      "str": 18,
      "dex": 18,
      "con": 18,
      "int": 17,
      "wis": 15,
      "cha": 18,
      "saves": "DEX +9, WIS +7, CHA +9"
    },
    "abilities": [
      "Shapechanger: If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies. While in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
      "Legendary Resistance: If the vampire fails a saving throw, it can choose to succeed instead.",
      "Misty Escape: When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point.",
      "Regeneration: The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      "Spider Climb: The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Vampire Weaknesses: The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
      "Multiattack: The vampire makes two attacks, only one of which can be a bite attack.",
      "Charm: The vampire targets one humanoid it can see within 30 ft. of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bit attack. Each time the vampire or the vampire's companions do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect.",
      "Children of the Night: The vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves instead. The called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. The beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a bonus action.",
      "Move (Legendary): The vampire moves up to its speed without provoking opportunity attacks.",
      "Unarmed Strike (Legendary): The vampire makes one unarmed strike.",
      "Bite (Costs 2 Actions) (Legendary): The vampire makes one bite attack."
    ],
    "saves": [
      {
        "name": "Charm",
        "ability": "WIS",
        "dc": 17,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Unarmed Strike",
        "diceExpr": "1d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 9
      },
      {
        "name": "Bite",
        "diceExpr": "1d6+4",
        "damageType": "Piercing",
        "attackBonus": 9,
        "note": "+ 3d6 necrotic"
      }
    ]
  },
  {
    "id": "vampire-bat",
    "name": "Vampire, Bat Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 144,
      "hd": "17d8",
      "speed": "5 ft., fly 30 ft.",
      "type": "Undead (Shapechanger)",
      "cr": 13,
      "crLabel": "13",
      "str": 18,
      "dex": 18,
      "con": 18,
      "int": 17,
      "wis": 15,
      "cha": 18,
      "saves": "DEX +9, WIS +7, CHA +9"
    },
    "abilities": [
      "Shapechanger: If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies. While in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
      "Legendary Resistance: If the vampire fails a saving throw, it can choose to succeed instead.",
      "Misty Escape: When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point.",
      "Regeneration: The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      "Spider Climb: The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Vampire Weaknesses: The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
      "Charm: The vampire targets one humanoid it can see within 30 ft. of it. If the target can see the vampire, the target must succeed on a DC 17 Wisdom saving throw against this magic or be charmed by the vampire. The charmed target regards the vampire as a trusted friend to be heeded and protected. Although the target isn't under the vampire's control, it takes the vampire's requests or actions in the most favorable way it can, and it is a willing target for the vampire's bit attack. Each time the vampire or the vampire's companions do anything harmful to the target, it can repeat the saving throw, ending the effect on itself on a success. Otherwise, the effect lasts 24 hours or until the vampire is destroyed, is on a different plane of existence than the target, or takes a bonus action to end the effect.",
      "Children of the Night: The vampire magically calls 2d4 swarms of bats or rats, provided that the sun isn't up. While outdoors, the vampire can call 3d6 wolves instead. The called creatures arrive in 1d4 rounds, acting as allies of the vampire and obeying its spoken commands. The beasts remain for 1 hour, until the vampire dies, or until the vampire dismisses them as a bonus action.",
      "Move (Legendary): The vampire moves up to its speed without provoking opportunity attacks.",
      "Unarmed Strike (Legendary): The vampire makes one unarmed strike.",
      "Bite (Costs 2 Actions) (Legendary): The vampire makes one bite attack."
    ],
    "saves": [
      {
        "name": "Charm",
        "ability": "WIS",
        "dc": 17,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+4",
        "damageType": "Piercing",
        "attackBonus": 9,
        "note": "+ 3d6 necrotic"
      }
    ]
  },
  {
    "id": "vampire-mist",
    "name": "Vampire, Mist Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 144,
      "hd": "17d8",
      "speed": "fly 20 ft.",
      "type": "Undead (Shapechanger)",
      "cr": 13,
      "crLabel": "13",
      "str": 18,
      "dex": 18,
      "con": 18,
      "int": 17,
      "wis": 15,
      "cha": 18,
      "saves": "DEX +9, WIS +7, CHA +9"
    },
    "abilities": [
      "Shapechanger: If the vampire isn't in sun light or running water, it can use its action to polymorph into a Tiny bat or a Medium cloud of mist, or back into its true form. While in bat form, the vampire can't speak, its walking speed is 5 feet, and it has a flying speed of 30 feet. Its statistics, other than its size and speed, are unchanged. Anything it is wearing transforms with it, but nothing it is carrying does. It reverts to its true form if it dies. While in mist form, the vampire can't take any actions, speak, or manipulate objects. It is weightless, has a flying speed of 20 feet, can hover, and can enter a hostile creature's space and stop there. In addition, if air can pass through a space, the mist can do so without squeezing, and it can't pass through water. It has advantage on Strength, Dexterity, and Constitution saving throws, and it is immune to all nonmagical damage, except the damage it takes from sunlight.",
      "Legendary Resistance: If the vampire fails a saving throw, it can choose to succeed instead.",
      "Misty Escape: When it drops to 0 hit points outside its resting place, the vampire transforms into a cloud of mist (as in the Shapechanger trait) instead of falling unconscious, provided that it isn't in sunlight or running water. If it can't transform, it is destroyed. While it has 0 hit points in mist form, it can't revert to its vampire form, and it must reach its resting place within 2 hours or be destroyed. Once in its resting place, it reverts to its vampire form. It is then paralyzed until it regains at least 1 hit point. After spending 1 hour in its resting place with 0 hit points, it regains 1 hit point.",
      "Regeneration: The vampire regains 20 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      "Spider Climb: The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Vampire Weaknesses: The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage if it ends its turn in running water. Stake to the Heart. If a piercing weapon made of wood is driven into the vampire's heart while the vampire is incapacitated in its resting place, the vampire is paralyzed until the stake is removed. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
      "Move (Legendary): The vampire moves up to its speed without provoking opportunity attacks.",
      "Unarmed Strike (Legendary): The vampire makes one unarmed strike.",
      "Bite (Costs 2 Actions) (Legendary): The vampire makes one bite attack."
    ]
  },
  {
    "id": "vampire-spawn",
    "name": "Vampire Spawn",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 15,
      "hp": 82,
      "hd": "11d8",
      "speed": "30 ft.",
      "type": "Undead",
      "cr": 5,
      "crLabel": "5",
      "str": 16,
      "dex": 16,
      "con": 16,
      "int": 11,
      "wis": 10,
      "cha": 12,
      "saves": "DEX +6, WIS +3"
    },
    "abilities": [
      "Regeneration: The vampire regains 10 hit points at the start of its turn if it has at least 1 hit point and isn't in sunlight or running water. If the vampire takes radiant damage or damage from holy water, this trait doesn't function at the start of the vampire's next turn.",
      "Spider Climb: The vampire can climb difficult surfaces, including upside down on ceilings, without needing to make an ability check.",
      "Vampire Weaknesses: The vampire has the following flaws: Forbiddance. The vampire can't enter a residence without an invitation from one of the occupants. Harmed by Running Water. The vampire takes 20 acid damage when it ends its turn in running water. Stake to the Heart. The vampire is destroyed if a piercing weapon made of wood is driven into its heart while it is incapacitated in its resting place. Sunlight Hypersensitivity. The vampire takes 20 radiant damage when it starts its turn in sunlight. While in sunlight, it has disadvantage on attack rolls and ability checks.",
      "Multiattack: The vampire makes two attacks, only one of which can be a bite attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 6,
        "note": "+ 2d6 necrotic"
      },
      {
        "name": "Claws",
        "diceExpr": "2d4+3",
        "damageType": "Slashing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "veteran",
    "name": "Veteran",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 17,
      "hp": 58,
      "hd": "9d8",
      "speed": "30 ft.",
      "type": "Humanoid (Any race)",
      "cr": 3,
      "crLabel": "3",
      "str": 16,
      "dex": 13,
      "con": 14,
      "int": 10,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The veteran makes two longsword attacks. If it has a shortsword drawn, it can also make a shortsword attack."
    ],
    "attacks": [
      {
        "name": "Longsword",
        "diceExpr": "1d8+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Shortsword",
        "diceExpr": "1d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Heavy Crossbow",
        "diceExpr": "1d10+1",
        "damageType": "Piercing",
        "attackBonus": 3
      }
    ]
  },
  {
    "id": "violet-fungus",
    "name": "Violet Fungus",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 5,
      "hp": 18,
      "hd": "4d8",
      "speed": "5 ft.",
      "type": "Plant",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 3,
      "dex": 1,
      "con": 10,
      "int": 1,
      "wis": 3,
      "cha": 1,
      "saves": ""
    },
    "abilities": [
      "False Appearance: While the violet fungus remains motionless, it is indistinguishable from an ordinary fungus.",
      "Multiattack: The fungus makes 1d4 Rotting Touch attacks."
    ],
    "attacks": [
      {
        "name": "Rotting Touch",
        "diceExpr": "1d8",
        "damageType": "Necrotic",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "vrock",
    "name": "Vrock",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 15,
      "hp": 104,
      "hd": "11d10",
      "speed": "40 ft., fly 60 ft.",
      "type": "Fiend (Demon)",
      "cr": 6,
      "crLabel": "6",
      "str": 17,
      "dex": 15,
      "con": 18,
      "int": 8,
      "wis": 13,
      "cha": 8,
      "saves": "DEX +5, WIS +4, CHA +2"
    },
    "abilities": [
      "Magic Resistance: The vrock has advantage on saving throws against spells and other magical effects.",
      "Multiattack: The vrock makes two attacks: one with its beak and one with its talons.",
      "Spores: A 15-foot-radius cloud of toxic spores extends out from the vrock. The spores spread around corners. Each creature in that area must succeed on a DC 14 Constitution saving throw or become poisoned. While poisoned in this way, a target takes 5 (1d10) poison damage at the start of each of its turns. A target can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. Emptying a vial of holy water on the target also ends the effect on it.",
      "Stunning Screech: The vrock emits a horrific screech. Each creature within 20 feet of it that can hear it and that isn't a demon must succeed on a DC 14 Constitution saving throw or be stunned until the end of the vrock's next turn ."
    ],
    "saves": [
      {
        "name": "Spores",
        "ability": "CON",
        "dc": 14,
        "success": "none"
      },
      {
        "name": "Stunning Screech",
        "ability": "CON",
        "dc": 14,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "2d6+3",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Talons",
        "diceExpr": "2d10+3",
        "damageType": "Slashing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "vulture",
    "name": "Vulture",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 5,
      "hd": "1d8",
      "speed": "10 ft., fly 50 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 7,
      "dex": 10,
      "con": 13,
      "int": 2,
      "wis": 12,
      "cha": 4,
      "saves": ""
    },
    "abilities": [
      "Keen Sight and Smell: The vulture has advantage on Wisdom (Perception) checks that rely on sight or smell.",
      "Pack Tactics: The vulture has advantage on an attack roll against a creature if at least one of the vulture's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Beak",
        "diceExpr": "1d4",
        "damageType": "Piercing",
        "attackBonus": 2
      }
    ]
  },
  {
    "id": "warhorse",
    "name": "Warhorse",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 11,
      "hp": 19,
      "hd": "3d10",
      "speed": "60 ft.",
      "type": "Beast",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 18,
      "dex": 12,
      "con": 13,
      "int": 2,
      "wis": 12,
      "cha": 7,
      "saves": ""
    },
    "abilities": [
      "Trampling Charge: If the horse moves at least 20 ft. straight toward a creature and then hits it with a hooves attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the horse can make another attack with its hooves against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "warhorse-skeleton",
    "name": "Warhorse Skeleton",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 22,
      "hd": "3d10",
      "speed": "60 ft.",
      "type": "Undead",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 18,
      "dex": 12,
      "con": 15,
      "int": 2,
      "wis": 8,
      "cha": 5,
      "saves": ""
    },
    "attacks": [
      {
        "name": "Hooves",
        "diceExpr": "2d6+4",
        "damageType": "Bludgeoning",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "water-elemental",
    "name": "Water Elemental",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 14,
      "hp": 114,
      "hd": "12d10",
      "speed": "30 ft., swim 90 ft.",
      "type": "Elemental",
      "cr": 5,
      "crLabel": "5",
      "str": 18,
      "dex": 14,
      "con": 18,
      "int": 5,
      "wis": 10,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Water Form: The elemental can enter a hostile creature's space and stop there. It can move through a space as narrow as 1 inch wide without squeezing.",
      "Freeze: If the elemental takes cold damage, it partially freezes; its speed is reduced by 20 ft. until the end of its next turn.",
      "Multiattack: The elemental makes two slam attacks.",
      "Whelm: Each creature in the elemental's space must make a DC 15 Strength saving throw. On a failure, a target takes 13 (2d8 + 4) bludgeoning damage. If it is Large or smaller, it is also grappled (escape DC 14). Until this grapple ends, the target is restrained and unable to breathe unless it can breathe water. If the saving throw is successful, the target is pushed out of the elemental's space. The elemental can grapple one Large creature or up to two Medium or smaller creatures at one time. At the start of each of the elemental's turns, each target grappled by it takes 13 (2d8 + 4) bludgeoning damage. A creature within 5 feet of the elemental can pull a creature or object out of it by taking an action to make a DC 14 Strength and succeeding."
    ],
    "saves": [
      {
        "name": "Whelm",
        "ability": "STR",
        "dc": 15,
        "success": "none"
      }
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "2d8+4",
        "damageType": "Bludgeoning",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "weasel",
    "name": "Weasel",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 13,
      "hp": 1,
      "hd": "1d4",
      "speed": "30 ft.",
      "type": "Beast",
      "cr": 0,
      "crLabel": "0",
      "str": 3,
      "dex": 16,
      "con": 8,
      "int": 2,
      "wis": 12,
      "cha": 3,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The weasel has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "werebear-bear",
    "name": "Werebear, Bear Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 135,
      "hd": "18d8",
      "speed": "40 ft., climb 30 ft.",
      "type": "Humanoid (Human)",
      "cr": 5,
      "crLabel": "5",
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 11,
      "wis": 12,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Smell: The werebear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claw",
        "diceExpr": "2d8+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "werebear-human",
    "name": "Werebear, Human Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 135,
      "hd": "18d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 5,
      "crLabel": "5",
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 11,
      "wis": 12,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Smell: The werebear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid."
    ],
    "attacks": [
      {
        "name": "Greataxe",
        "diceExpr": "1d12+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "werebear-hybrid",
    "name": "Werebear, Hybrid Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 135,
      "hd": "18d8",
      "speed": "40 ft., climb 30 ft.",
      "type": "Humanoid (Human)",
      "cr": 5,
      "crLabel": "5",
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 11,
      "wis": 12,
      "cha": 12,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The werebear can use its action to polymorph into a Large bear-humanoid hybrid or into a Large bear, or back into its true form, which is humanoid. Its statistics, other than its size and AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Smell: The werebear has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: In bear form, the werebear makes two claw attacks. In humanoid form, it makes two greataxe attacks. In hybrid form, it can attack like a bear or a humanoid."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claw",
        "diceExpr": "2d8+4",
        "damageType": "Slashing",
        "attackBonus": 7
      },
      {
        "name": "Greataxe",
        "diceExpr": "1d12+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "wereboar-boar",
    "name": "Wereboar, Boar Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 78,
      "hd": "12d8",
      "speed": "40 ft.",
      "type": "Humanoid (Human)",
      "cr": 4,
      "crLabel": "4",
      "str": 17,
      "dex": 10,
      "con": 15,
      "int": 10,
      "wis": 11,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Charge (Boar or Hybrid Form Only): If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
      "Relentless: If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead."
    ],
    "attacks": [
      {
        "name": "Tusks",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "wereboar-human",
    "name": "Wereboar, Human Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 10,
      "hp": 78,
      "hd": "12d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 4,
      "crLabel": "4",
      "str": 17,
      "dex": 10,
      "con": 15,
      "int": 10,
      "wis": 11,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Relentless: If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
      "Multiattack: The wereboar makes two attacks, only one of which can be with its tusks."
    ],
    "attacks": [
      {
        "name": "Maul",
        "diceExpr": "2d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "wereboar-hybrid",
    "name": "Wereboar, Hybrid Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 78,
      "hd": "12d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 4,
      "crLabel": "4",
      "str": 17,
      "dex": 10,
      "con": 15,
      "int": 10,
      "wis": 11,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The wereboar can use its action to polymorph into a boar-humanoid hybrid or into a boar, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Charge (Boar or Hybrid Form Only): If the wereboar moves at least 15 feet straight toward a target and then hits it with its tusks on the same turn, the target takes an extra 7 (2d6) slashing damage. If the target is a creature, it must succeed on a DC 13 Strength saving throw or be knocked prone.",
      "Relentless: If the wereboar takes 14 damage or less that would reduce it to 0 hit points, it is reduced to 1 hit point instead.",
      "Multiattack: The wereboar makes two attacks, only one of which can be with its tusks."
    ],
    "attacks": [
      {
        "name": "Maul",
        "diceExpr": "2d6+3",
        "damageType": "Bludgeoning",
        "attackBonus": 5
      },
      {
        "name": "Tusks",
        "diceExpr": "2d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "wererat-human",
    "name": "Wererat, Human Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 33,
      "hd": "6d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 2,
      "crLabel": "2",
      "str": 10,
      "dex": 15,
      "con": 12,
      "int": 11,
      "wis": 10,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Smell: The wererat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: The wererat makes two attacks, only one of which can be a bite."
    ],
    "attacks": [
      {
        "name": "Shortsword",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Hand Crossbow",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "wererat-hybrid",
    "name": "Wererat, Hybrid Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 33,
      "hd": "6d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 2,
      "crLabel": "2",
      "str": 10,
      "dex": 15,
      "con": 12,
      "int": 11,
      "wis": 10,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Smell: The wererat has advantage on Wisdom (Perception) checks that rely on smell.",
      "Multiattack: The wererat makes two attacks, only one of which can be a bite."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Shortsword",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Hand Crossbow",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "wererat-rat",
    "name": "Wererat, Rat Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 33,
      "hd": "6d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 2,
      "crLabel": "2",
      "str": 10,
      "dex": 15,
      "con": 12,
      "int": 11,
      "wis": 10,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The wererat can use its action to polymorph into a rat-humanoid hybrid or into a giant rat, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Smell: The wererat has advantage on Wisdom (Perception) checks that rely on smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "weretiger-human",
    "name": "Weretiger, Human Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 120,
      "hd": "16d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 4,
      "crLabel": "4",
      "str": 17,
      "dex": 15,
      "con": 16,
      "int": 10,
      "wis": 13,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Multiattack: In humanoid form, the weretiger makes two scimitar attacks or two longbow attacks. In hybrid form, it can attack like a humanoid or make two claw attacks."
    ],
    "attacks": [
      {
        "name": "Scimitar",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "weretiger-hybrid",
    "name": "Weretiger, Hybrid Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 120,
      "hd": "16d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 4,
      "crLabel": "4",
      "str": 17,
      "dex": 15,
      "con": 16,
      "int": 10,
      "wis": 13,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pounce: If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action.",
      "Multiattack: In humanoid form, the weretiger makes two scimitar attacks or two longbow attacks. In hybrid form, it can attack like a humanoid or make two claw attacks."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Claw",
        "diceExpr": "1d8+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Scimitar",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "attackBonus": 5
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "weretiger-tiger",
    "name": "Weretiger, Tiger Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 120,
      "hd": "16d8",
      "speed": "40 ft.",
      "type": "Humanoid (Human)",
      "cr": 4,
      "crLabel": "4",
      "str": 17,
      "dex": 15,
      "con": 16,
      "int": 10,
      "wis": 13,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The weretiger can use its action to polymorph into a tiger-humanoid hybrid or into a tiger, or back into its true form, which is humanoid. Its statistics, other than its size, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The weretiger has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pounce: If the weretiger moves at least 15 feet straight toward a creature and then hits it with a claw attack on the same turn, that target must succeed on a DC 14 Strength saving throw or be knocked prone. If the target is prone, the weretiger can make one bite attack against it as a bonus action."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+3",
        "damageType": "Piercing",
        "attackBonus": 5
      },
      {
        "name": "Claw",
        "diceExpr": "1d8+3",
        "damageType": "Slashing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "werewolf-human",
    "name": "Werewolf, Human Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 11,
      "hp": 58,
      "hd": "9d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 3,
      "crLabel": "3",
      "str": 15,
      "dex": 13,
      "con": 14,
      "int": 10,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Multiattack: The werewolf makes two attacks: two with its spear (humanoid form) or one with its bite and one with its claws (hybrid form)."
    ],
    "attacks": [
      {
        "name": "Spear",
        "diceExpr": "1d6+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "werewolf-hybrid",
    "name": "Werewolf, Hybrid Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 58,
      "hd": "9d8",
      "speed": "30 ft.",
      "type": "Humanoid (Human)",
      "cr": 3,
      "crLabel": "3",
      "str": 15,
      "dex": 13,
      "con": 14,
      "int": 10,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Multiattack: The werewolf makes two attacks: two with its spear (humanoid form) or one with its bite and one with its claws (hybrid form)."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      },
      {
        "name": "Claws",
        "diceExpr": "2d4+2",
        "damageType": "Slashing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "werewolf-wolf",
    "name": "Werewolf, Wolf Form",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 12,
      "hp": 58,
      "hd": "9d8",
      "speed": "40 ft.",
      "type": "Humanoid (Human)",
      "cr": 3,
      "crLabel": "3",
      "str": 15,
      "dex": 13,
      "con": 14,
      "int": 10,
      "wis": 11,
      "cha": 10,
      "saves": ""
    },
    "abilities": [
      "Shapechanger: The werewolf can use its action to polymorph into a wolf-humanoid hybrid or into a wolf, or back into its true form, which is humanoid. Its statistics, other than its AC, are the same in each form. Any equipment it is wearing or carrying isn't transformed. It reverts to its true form if it dies.",
      "Keen Hearing and Smell: The werewolf has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "white-dragon-wyrmling",
    "name": "White Dragon Wyrmling",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 16,
      "hp": 32,
      "hd": "5d8",
      "speed": "30 ft., burrow 15 ft., fly 60 ft., swim 30 ft.",
      "type": "Dragon",
      "cr": 2,
      "crLabel": "2",
      "str": 14,
      "dex": 10,
      "con": 14,
      "int": 5,
      "wis": 10,
      "cha": 11,
      "saves": "DEX +2, CON +4, WIS +2, CHA +2"
    },
    "abilities": [
      "Cold Breath: The dragon exhales an icy blast of hail in a 15-foot cone. Each creature in that area must make a DC 12 Constitution saving throw, taking 22 (5d8) cold damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Cold Breath",
        "ability": "CON",
        "dc": 12,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "1d10+2",
        "damageType": "Piercing",
        "attackBonus": 4,
        "note": "+ 1d4 cold"
      }
    ]
  },
  {
    "id": "wight",
    "name": "Wight",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 14,
      "hp": 45,
      "hd": "6d8",
      "speed": "30 ft.",
      "type": "Undead",
      "cr": 3,
      "crLabel": "3",
      "str": 15,
      "dex": 14,
      "con": 16,
      "int": 10,
      "wis": 13,
      "cha": 15,
      "saves": ""
    },
    "abilities": [
      "Sunlight Sensitivity: While in sunlight, the wight has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Multiattack: The wight makes two longsword attacks or two longbow attacks. It can use its Life Drain in place of one longsword attack."
    ],
    "attacks": [
      {
        "name": "Life Drain",
        "diceExpr": "1d6+2",
        "damageType": "Necrotic",
        "attackBonus": 4
      },
      {
        "name": "Longsword",
        "diceExpr": "1d8+2",
        "damageType": "Slashing",
        "attackBonus": 4
      },
      {
        "name": "Longbow",
        "diceExpr": "1d8+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "will-o-wisp",
    "name": "Will-o'-Wisp",
    "category": "creature",
    "size": "Tiny",
    "stats": {
      "ac": 19,
      "hp": 22,
      "hd": "9d4",
      "speed": "0 ft., fly 50 ft., (hover)",
      "type": "Undead",
      "cr": 2,
      "crLabel": "2",
      "str": 1,
      "dex": 28,
      "con": 10,
      "int": 13,
      "wis": 14,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Consume Life: As a bonus action, the will-o'-wisp can target one creature it can see within 5 ft. of it that has 0 hit points and is still alive. The target must succeed on a DC 10 Constitution saving throw against this magic or die. If the target dies, the will-o'-wisp regains 10 (3d6) hit points.",
      "Ephemeral: The will-o'-wisp can't wear or carry anything.",
      "Incorporeal Movement: The will-o'-wisp can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Variable Illumination: The will-o'-wisp sheds bright light in a 5- to 20-foot radius and dim light for an additional number of ft. equal to the chosen radius. The will-o'-wisp can alter the radius as a bonus action.",
      "Invisibility: The will-o'-wisp and its light magically become invisible until it attacks or uses its Consume Life, or until its concentration ends (as if concentrating on a spell)."
    ],
    "attacks": [
      {
        "name": "Shock",
        "diceExpr": "2d8",
        "damageType": "Lightning",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "winter-wolf",
    "name": "Winter Wolf",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 75,
      "hd": "10d10",
      "speed": "50 ft.",
      "type": "Monstrosity",
      "cr": 3,
      "crLabel": "3",
      "str": 18,
      "dex": 13,
      "con": 14,
      "int": 7,
      "wis": 12,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated.",
      "Snow Camouflage: The wolf has advantage on Dexterity (Stealth) checks made to hide in snowy terrain.",
      "Cold Breath: The wolf exhales a blast of freezing wind in a 15-foot cone. Each creature in that area must make a DC 12 Dexterity saving throw, taking 18 (4d8) cold damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Cold Breath",
        "ability": "DEX",
        "dc": 12,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "wolf",
    "name": "Wolf",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 11,
      "hd": "2d8",
      "speed": "40 ft.",
      "type": "Beast",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 12,
      "dex": 15,
      "con": 12,
      "int": 3,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The wolf has advantage on Wisdom (Perception) checks that rely on hearing or smell.",
      "Pack Tactics: The wolf has advantage on an attack roll against a creature if at least one of the wolf's allies is within 5 ft. of the creature and the ally isn't incapacitated."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d4+2",
        "damageType": "Piercing",
        "attackBonus": 4
      }
    ]
  },
  {
    "id": "worg",
    "name": "Worg",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 26,
      "hd": "4d10",
      "speed": "50 ft.",
      "type": "Monstrosity",
      "cr": 0.5,
      "crLabel": "1/2",
      "str": 16,
      "dex": 13,
      "con": 13,
      "int": 7,
      "wis": 11,
      "cha": 8,
      "saves": ""
    },
    "abilities": [
      "Keen Hearing and Smell: The worg has advantage on Wisdom (Perception) checks that rely on hearing or smell."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+3",
        "damageType": "Piercing",
        "attackBonus": 5
      }
    ]
  },
  {
    "id": "wraith",
    "name": "Wraith",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 13,
      "hp": 67,
      "hd": "9d8",
      "speed": "0 ft., fly 60 ft., (hover)",
      "type": "Undead",
      "cr": 5,
      "crLabel": "5",
      "str": 6,
      "dex": 16,
      "con": 16,
      "int": 12,
      "wis": 14,
      "cha": 15,
      "saves": ""
    },
    "abilities": [
      "Incorporeal Movement: The wraith can move through other creatures and objects as if they were difficult terrain. It takes 5 (1d10) force damage if it ends its turn inside an object.",
      "Sunlight Sensitivity: While in sunlight, the wraith has disadvantage on attack rolls, as well as on Wisdom (Perception) checks that rely on sight.",
      "Create Specter: The wraith targets a humanoid within 10 feet of it that has been dead for no longer than 1 minute and died violently. The target's spirit rises as a specter in the space of its corpse or in the nearest unoccupied space. The specter is under the wraith's control. The wraith can have no more than seven specters under its control at one time."
    ],
    "attacks": [
      {
        "name": "Life Drain",
        "diceExpr": "4d8+3",
        "damageType": "Necrotic",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "wyvern",
    "name": "Wyvern",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 13,
      "hp": 110,
      "hd": "13d10",
      "speed": "20 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 6,
      "crLabel": "6",
      "str": 19,
      "dex": 10,
      "con": 16,
      "int": 5,
      "wis": 12,
      "cha": 6,
      "saves": ""
    },
    "abilities": [
      "Multiattack: The wyvern makes two attacks: one with its bite and one with its stinger. While flying, it can use its claws in place of one other attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claws",
        "diceExpr": "2d8+4",
        "damageType": "Slashing",
        "attackBonus": 7
      },
      {
        "name": "Stinger",
        "diceExpr": "2d6+4",
        "damageType": "Piercing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "xorn",
    "name": "Xorn",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 19,
      "hp": 73,
      "hd": "7d8",
      "speed": "20 ft., burrow 20 ft.",
      "type": "Elemental",
      "cr": 5,
      "crLabel": "5",
      "str": 17,
      "dex": 10,
      "con": 22,
      "int": 11,
      "wis": 10,
      "cha": 11,
      "saves": ""
    },
    "abilities": [
      "Earth Glide: The xorn can burrow through nonmagical, unworked earth and stone. While doing so, the xorn doesn't disturb the material it moves through.",
      "Stone Camouflage: The xorn has advantage on Dexterity (Stealth) checks made to hide in rocky terrain.",
      "Treasure Sense: The xorn can pinpoint, by scent, the location of precious metals and stones, such as coins and gems, within 60 ft. of it.",
      "Multiattack: The xorn makes three claw attacks and one bite attack."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "3d6+3",
        "damageType": "Piercing",
        "attackBonus": 6
      },
      {
        "name": "Claw",
        "diceExpr": "1d6+3",
        "damageType": "Slashing",
        "attackBonus": 6
      }
    ]
  },
  {
    "id": "young-black-dragon",
    "name": "Young Black Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 127,
      "hd": "15d10",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 7,
      "crLabel": "7",
      "str": 19,
      "dex": 14,
      "con": 17,
      "int": 12,
      "wis": 11,
      "cha": 15,
      "saves": "DEX +5, CON +6, WIS +3, CHA +5"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Acid Breath: The dragon exhales acid in a 30-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 49 (11d8) acid damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Acid Breath",
        "ability": "DEX",
        "dc": 14,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+4",
        "damageType": "Piercing",
        "attackBonus": 7,
        "note": "+ 1d8 acid"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "young-blue-dragon",
    "name": "Young Blue Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 152,
      "hd": "16d10",
      "speed": "40 ft., burrow 20 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 9,
      "crLabel": "9",
      "str": 21,
      "dex": 10,
      "con": 19,
      "int": 14,
      "wis": 13,
      "cha": 17,
      "saves": "DEX +4, CON +8, WIS +5, CHA +7"
    },
    "abilities": [
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Lightning Breath: The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 16 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Lightning Breath",
        "ability": "DEX",
        "dc": 16,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+5",
        "damageType": "Piercing",
        "attackBonus": 9,
        "note": "+ 1d10 lightning"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+5",
        "damageType": "Slashing",
        "attackBonus": 9
      }
    ]
  },
  {
    "id": "young-brass-dragon",
    "name": "Young Brass Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 110,
      "hd": "13d10",
      "speed": "40 ft., burrow 20 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 6,
      "crLabel": "6",
      "str": 19,
      "dex": 10,
      "con": 17,
      "int": 12,
      "wis": 11,
      "cha": 15,
      "saves": "DEX +3, CON +6, WIS +3, CHA +5"
    },
    "abilities": [
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 42 (12d6) fire damage on a failed save, or half as much damage on a successful one. Sleep Breath. The dragon exhales sleep gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constitution saving throw or fall unconscious for 5 minutes. This effect ends for a creature if the creature takes damage or someone uses an action to wake it."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "young-bronze-dragon",
    "name": "Young Bronze Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 142,
      "hd": "15d10",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 8,
      "crLabel": "8",
      "str": 21,
      "dex": 10,
      "con": 19,
      "int": 14,
      "wis": 13,
      "cha": 17,
      "saves": "DEX +3, CON +7, WIS +4, CHA +6"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Lightning Breath. The dragon exhales lightning in a 60-foot line that is 5 feet wide. Each creature in that line must make a DC 15 Dexterity saving throw, taking 55 (10d10) lightning damage on a failed save, or half as much damage on a successful one. Repulsion Breath. The dragon exhales repulsion energy in a 30-foot cone. Each creature in that area must succeed on a DC 15 Strength saving throw. On a failed save, the creature is pushed 40 feet away from the dragon."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+5",
        "damageType": "Piercing",
        "attackBonus": 8
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+5",
        "damageType": "Slashing",
        "attackBonus": 8
      }
    ]
  },
  {
    "id": "young-copper-dragon",
    "name": "Young Copper Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 119,
      "hd": "14d10",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 7,
      "crLabel": "7",
      "str": 19,
      "dex": 12,
      "con": 17,
      "int": 16,
      "wis": 13,
      "cha": 15,
      "saves": "DEX +4, CON +6, WIS +4, CHA +5"
    },
    "abilities": [
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Acid Breath. The dragon exhales acid in an 40-foot line that is 5 feet wide. Each creature in that line must make a DC 14 Dexterity saving throw, taking 40 (9d8) acid damage on a failed save, or half as much damage on a successful one. Slowing Breath. The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 14 Constitution saving throw. On a failed save, the creature can't use reactions, its speed is halved, and it can't make more than one attack on its turn. In addition, the creature can use either an action or a bonus action on its turn, but not both. These effects last for 1 minute. The creature can repeat the saving throw at the end of each of its turns, ending the effect on itself with a successful save."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+4",
        "damageType": "Piercing",
        "attackBonus": 7
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "young-gold-dragon",
    "name": "Young Gold Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 178,
      "hd": "17d10",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 10,
      "crLabel": "10",
      "str": 23,
      "dex": 14,
      "con": 21,
      "int": 16,
      "wis": 13,
      "cha": 20,
      "saves": "DEX +6, CON +9, WIS +5, CHA +9"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Fire Breath. The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 55 (10d10) fire damage on a failed save, or half as much damage on a successful one. Weakening Breath. The dragon exhales gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Strength saving throw or have disadvantage on Strength-based attack rolls, Strength checks, and Strength saving throws for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "attackBonus": 10
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 10
      }
    ]
  },
  {
    "id": "young-green-dragon",
    "name": "Young Green Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 136,
      "hd": "16d10",
      "speed": "40 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 8,
      "crLabel": "8",
      "str": 19,
      "dex": 12,
      "con": 17,
      "int": 16,
      "wis": 13,
      "cha": 15,
      "saves": "DEX +4, CON +6, WIS +4, CHA +5"
    },
    "abilities": [
      "Amphibious: The dragon can breathe air and water.",
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Poison Breath: The dragon exhales poisonous gas in a 30-foot cone. Each creature in that area must make a DC 14 Constitution saving throw, taking 42 (12d6) poison damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Poison Breath",
        "ability": "CON",
        "dc": 14,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+4",
        "damageType": "Piercing",
        "attackBonus": 7,
        "note": "+ 2d6 poison"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "young-red-dragon",
    "name": "Young Red Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 178,
      "hd": "17d10",
      "speed": "40 ft., climb 40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 10,
      "crLabel": "10",
      "str": 23,
      "dex": 10,
      "con": 21,
      "int": 14,
      "wis": 11,
      "cha": 19,
      "saves": "DEX +4, CON +9, WIS +4, CHA +8"
    },
    "abilities": [
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Fire Breath: The dragon exhales fire in a 30-foot cone. Each creature in that area must make a DC 17 Dexterity saving throw, taking 56 (16d6) fire damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Fire Breath",
        "ability": "DEX",
        "dc": 17,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "attackBonus": 10,
        "note": "+ 1d6 fire"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 10
      }
    ]
  },
  {
    "id": "young-silver-dragon",
    "name": "Young Silver Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 18,
      "hp": 168,
      "hd": "16d10",
      "speed": "40 ft., fly 80 ft.",
      "type": "Dragon",
      "cr": 9,
      "crLabel": "9",
      "str": 23,
      "dex": 10,
      "con": 21,
      "int": 14,
      "wis": 11,
      "cha": 19,
      "saves": "DEX +4, CON +9, WIS +4, CHA +8"
    },
    "abilities": [
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Breath Weapons: The dragon uses one of the following breath weapons. Cold Breath. The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 17 Constitution saving throw, taking 54 (12d8) cold damage on a failed save, or half as much damage on a successful one. Paralyzing Breath. The dragon exhales paralyzing gas in a 30-foot cone. Each creature in that area must succeed on a DC 17 Constitution saving throw or be paralyzed for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success."
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+6",
        "damageType": "Piercing",
        "attackBonus": 10
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+6",
        "damageType": "Slashing",
        "attackBonus": 10
      }
    ]
  },
  {
    "id": "young-white-dragon",
    "name": "Young White Dragon",
    "category": "creature",
    "size": "Large",
    "stats": {
      "ac": 17,
      "hp": 133,
      "hd": "14d10",
      "speed": "40 ft., burrow 20 ft., fly 80 ft., swim 40 ft.",
      "type": "Dragon",
      "cr": 6,
      "crLabel": "6",
      "str": 18,
      "dex": 10,
      "con": 18,
      "int": 6,
      "wis": 11,
      "cha": 12,
      "saves": "DEX +3, CON +7, WIS +3, CHA +4"
    },
    "abilities": [
      "Ice Walk: The dragon can move across and climb icy surfaces without needing to make an ability check. Additionally, difficult terrain composed of ice or snow doesn't cost it extra movement.",
      "Multiattack: The dragon makes three attacks: one with its bite and two with its claws.",
      "Cold Breath: The dragon exhales an icy blast in a 30-foot cone. Each creature in that area must make a DC 15 Constitution saving throw, taking 45 (10d8) cold damage on a failed save, or half as much damage on a successful one."
    ],
    "saves": [
      {
        "name": "Cold Breath",
        "ability": "CON",
        "dc": 15,
        "success": "half"
      }
    ],
    "attacks": [
      {
        "name": "Bite",
        "diceExpr": "2d10+4",
        "damageType": "Piercing",
        "attackBonus": 7,
        "note": "+ 1d8 cold"
      },
      {
        "name": "Claw",
        "diceExpr": "2d6+4",
        "damageType": "Slashing",
        "attackBonus": 7
      }
    ]
  },
  {
    "id": "zombie",
    "name": "Zombie",
    "category": "creature",
    "size": "Medium",
    "stats": {
      "ac": 8,
      "hp": 22,
      "hd": "3d8",
      "speed": "20 ft.",
      "type": "Undead",
      "cr": 0.25,
      "crLabel": "1/4",
      "str": 13,
      "dex": 6,
      "con": 16,
      "int": 3,
      "wis": 6,
      "cha": 5,
      "saves": "WIS +0"
    },
    "abilities": [
      "Undead Fortitude: If damage reduces the zombie to 0 hit points, it must make a Constitution saving throw with a DC of 5+the damage taken, unless the damage is radiant or from a critical hit. On a success, the zombie drops to 1 hit point instead."
    ],
    "attacks": [
      {
        "name": "Slam",
        "diceExpr": "1d6+1",
        "damageType": "Bludgeoning",
        "attackBonus": 3
      }
    ]
  }
];
