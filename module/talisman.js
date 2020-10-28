import { DiceRoller } from "./components/dice-roller.js";
import { RollDialog } from "./components/roll-dialog.js";
import { TalismanDieBase } from "./talisman-dice.js";
import { TalismanDieKismet } from "./talisman-dice.js";
import { TalismanActor } from "./actor/actor.js";
import { TalismanActorSheet } from "./actor/actor-sheet.js";
import { TalismanItem } from "./item/item.js";
import { TalismanItemSheet } from "./item/item-sheet.js";
import TalismanHooks from "./talisman-hooks.js";

Hooks.once("init", async function () {
    game.talisman = {
        DiceRoller,
        RollDialog,
        TalismanActor,
        TalismanItem,
    };

    CONFIG.Dice.terms["b"] = TalismanDieBase;
    CONFIG.Dice.terms["k"] = TalismanDieKismet;

    // Define custom Entity classes
    CONFIG.Actor.entityClass = TalismanActor;
    CONFIG.Item.entityClass = TalismanItem;

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("talisman", TalismanActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("talisman", TalismanItemSheet, { makeDefault: true });

    /* ---------------------------------------- */

    /** HANDLEBARS */

    Handlebars.registerHelper("concat", function () {
        var outStr = "";
        for (var arg in arguments) {
            if (typeof arguments[arg] != "object") {
                outStr += arguments[arg];
            }
        }
        return outStr;
    });

    Handlebars.registerHelper("toLowerCase", function (str) {
        return str.toLowerCase();
    });

    Handlebars.registerHelper("toUpperrCase", function (str) {
        return str.toUpperCase();
    });

    Handlebars.registerHelper("times", function (n, block) {
        var accum = "";
        for (var i = 0; i < n; ++i) accum += block.fn(i);
        return accum;
    });

    Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
        switch (operator) {
            case "==":
                return v1 == v2 ? options.fn(this) : options.inverse(this);
            case "===":
                return v1 === v2 ? options.fn(this) : options.inverse(this);
            case "!=":
                return v1 != v2 ? options.fn(this) : options.inverse(this);
            case "!==":
                return v1 !== v2 ? options.fn(this) : options.inverse(this);
            case "<":
                return v1 < v2 ? options.fn(this) : options.inverse(this);
            case "<=":
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
            case ">":
                return v1 > v2 ? options.fn(this) : options.inverse(this);
            case ">=":
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
            case "&&":
                return v1 && v2 ? options.fn(this) : options.inverse(this);
            case "||":
                return v1 || v2 ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });
});

Hooks.on("renderChatMessage", (message, html) => {
    if (!message.isRoll || !message.isContentVisible) return;
    html.find(".dice-discardable").click((el) => {
        DiceRoller.updateMessage(message, html, el);
    });
});

/* -------------------------------------------- */
/*  DsN Hooks                                   */
/* -------------------------------------------- */

Hooks.on("diceSoNiceRollComplete", (chatMessageID) => {});

Hooks.once("diceSoNiceReady", (dice3d) => {
    dice3d.addColorset(
        {
            name: "talisman",
            description: "talisman/Wood",
            category: "talisman",
            foreground: "#9F8003",
            background: "#9F8",
            texture: "none",
            edge: "#9F8003",
            material: "glass",
        },
        "default"
    );

    dice3d.addSystem({ id: "talisman", name: "Talisman" }, true);
    dice3d.addDicePreset({
        type: "db",
        labels: [
            "systems/talisman/ui/dice/tdb1.png",
            "systems/talisman/ui/dice/tdb2.png",
            "systems/talisman/ui/dice/tdb3.png",
            "systems/talisman/ui/dice/tdb4.png",
            "systems/talisman/ui/dice/tdb5.png",
            "systems/talisman/ui/dice/tdb6.png",
        ],
        colorset: "talisman",
        system: "talisman",
    });
    dice3d.addDicePreset({
        type: "dk",
        labels: [
            "systems/talisman/ui/dice/tdk1.png",
            "systems/talisman/ui/dice/tdk2.png",
            "systems/talisman/ui/dice/tdk3.png",
            "systems/talisman/ui/dice/tdk4.png",
            "systems/talisman/ui/dice/tdk5.png",
            "systems/talisman/ui/dice/tdk6.png",
        ],
        colorset: "talisman",
        system: "talisman",
    });
});

// Talisman Hooks
//Hooks.on("preUpdateOwnedItem", async (actor, item, updateData) => TalismanHooks.onUpdateItem(actor: actor, options, userId));
Hooks.on("preUpdateItem", (item, data, diff) => TalismanHooks.onUpdateItem({ item: item, updateData: data, diff: diff }));
