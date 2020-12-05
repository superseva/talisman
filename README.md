# TALISMAN ADVENTURES

Unofficial Talisman Adventures system for FoundryVTT

## INSTALL

[manifest link](https://raw.githubusercontent.com/superseva/talisman/main/system.json)

## INFO

### Actor Types

-   **Character** \
    (mostly for PC characters)
-   **NPC** \
    Two tabbed sheet fot NPC-s \
     _Followers are handled as items that you can dragg to character sheets_

### Item Types

-   skills
-   abilities
-   spell
-   weapons
-   armor
-   gear
-   follower
-   enemy attack

## HELP

-   Make a ROLL using the 'Roll' button on top of the character sheet or click on Attributes/Aspect to prepopulate the roll-dialog.
-   Macro for opening the dialog in case you need it
    `game.talisman.RollDialog.prepareDialog();`
-   Roller will try to calculate some modifiers like wounds or agility penalty. \
    ![modifiers](./help/roll-modifiers.jpg)
-   Mark Aspect you choose to have a cap of 7 by right clicking on it. \
    ![ascpects](./help/aspects.jpg)
-   Equip armor to get the armor plaque on the Character Sheet. \
    ![armor equip](./help/armor-list.jpg)
    ![armor plaq](./help/armor-plate.jpg)
-   Weapon Damage can be rolled from weapon list. It adds hte bonus you selected in the weapon sheet. \
    ![weapon](./help/wpn-dmg.jpg)
-   You can use @cra to add bonus damage for spells. \
    ![spell](./help/dmg-cra.jpg)
-   You can simulate item being in the backpack by clicking the 'packed' icon in the list. A formula for item weight when calculating encumbrance is Math.ceil(weight/2) \* quantity. \
    ![spell](./help/gear.jpg)
-   You can use symbols in your rich text editor (journals, items descriptions, etc) by utilizing the html text editor. \
     ![symbols](./help/symbols.png)
    Kismet die 6 \
    `<span style="color: #169179; font-family: Talisman;">l </span>`
    Kismet die 1 \
    `<span style="color: #ba372a; font-family: Talisman;">d </span>`
    Light Point \
    `<span style="color: #b16c35; font-family: Talisman;">o </span>`
    Dark Point \
    `<span style="color: #000000; font-family: Talisman;">o </span>`

-   Dice So Nice module supported \
    ![dsn](./help/dice-so-nice.jpg)

### Thank You

    Thanks Pegasus for creating the game and allowing the system to appear on Foundry VTT.
    Special thanks to Discuit for helping me debugging and providing great suggestions

```

```
