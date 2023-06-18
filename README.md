# Roll20-Macros-Script
A script for Roll20 that will create macros from a #-delimited text file of macro text

Commands:
!delete macros - Deletes all of the messaging player's macros
!create macros - Creates macros for the messaging player from the text in their "Macros" Handout

Oddities:
For some reason, the newly created macros don't work unless you open each one and hit "Save Changes". 

Example "Macros" Handout: 
```
################################################################################

&{template:default}{{name= Skill Check}}{{Outcome = ?{Skill| Perception, **Perception** [[d20 + 14]]| Acrobatics, **Acrobatics** [[d20 + 11]]| Arcana, **Arcana** [[d20 + 10]]| Athletics, **Athletics** [[d20 + 3]]| Crafting, **Crafting** [[d20 + 10]]| Deception, **Deception** [[d20 + 0]]| Diplomacy, **Diplomacy** [[d20 + 0]]| Intimidation, **Intimidation** [[d20 + 0]]| Medicine, **Medicine** [[d20 + 4]]| Nature, **Nature** [[d20 + 14]]| Occultism, **Occultism** [[d20 + 10]]| Performance, **Performance** [[d20 + 0]]| Religion, **Religion** [[d20 + 12]]| Society, **Society** [[d20 + 10]]| Stealth, **Stealth** [[d20 + 11]]| Survival, **Survival** [[d20 + 14]]| Thievery, **Thievery** [[d20 + 11]]}}}

################################################################################

&{template:default}{{name= Saving Throws}}{{Outcome = ?{Save| Will, **Will** [[d20 + 14]]| Fortitude, **Fortitude** [[d20 + 11]]| Reflex, **Reflex** [[d20 + 13]]}}}

################################################################################

&{template:default}{{name= Healing Potion}}{{Effect = ?{Potion| Minor, **Minor Healing Potion**
Regain [[1d8]] HP | Lesser, **Lesser Healing Potion**
Regain [[2d8+5]] HP | Moderate, **Moderate Healing Potion**
Regain [[3d8+10]] HP | Greater, **Greater Healing Potion**
Regain [[6d8+20]] HP | Major, **Major Healing Potion**
Regain [[8d8+30]] HP}}}

################################################################################

&{template:default}{{name= Ignite Fireworks}}{{Range= 60 ft}}{{Area= ?{Metamagic| None, 10 ft burst | Widened, **Widened** 15 ft burst}}}{{Save= **REFLEX**, DC [[22]]}}{{Damage= [[1d8]] fire damage
[[1d8]] sonic damage}}{{Effect= **Critical Success** The creature is unaffected.
**Success** The creature takes half damage and is dazzled for [[1]] round.
**Failure** The creature takes full damage and is dazzled for [[3]] rounds.
**Critical Failure** The creature takes double damage, takes [[1d4]] persistent fire damage, and is dazzled for [[1]] minute.}}

################################################################################
```

