import { DiceRoller } from "./components/dice-roller.js";
import { RollDialog } from "./components/roll-dialog.js";
import { TalismanDieBase } from "./talisman-dice.js";
import { TalismanDieKismet } from "./talisman-dice.js";
import { TalismanActor, TalismanEnemy } from "./actor/actor.js";
import { TalismanActorSheet } from "./actor/actor-sheet.js";
import { TalismanEnemySheet } from "./actor/enemy-sheet.js";
import { TalismanItem } from "./item/item.js";
import { TalismanItemSheet } from "./item/item-sheet.js";
import TalismanHooks from "./talisman-hooks.js";

Hooks.once("init", async function () {
    game.talisman = {
        DiceRoller,
        RollDialog,
        TalismanActor,
        TalismanEnemy,
        TalismanItem,
    };

    CONFIG.Dice.terms["b"] = TalismanDieBase;
    CONFIG.Dice.terms["k"] = TalismanDieKismet;

    // Define custom Entity classes
    CONFIG.Actor.entityClass = TalismanActor;
    CONFIG.Item.entityClass = TalismanItem;
    CONFIG.TinyMCE.toolbar = "styleselect forecolor backcolor bullist numlist image table hr link removeformat code fontsizeselect save";

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("talisman", TalismanActorSheet, { makeDefault: true, types: ["character"] });
    Actors.registerSheet("talisman", TalismanEnemySheet, { makeDefault: true, types: ["enemy"] });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("talisman", TalismanItemSheet, { makeDefault: true });

    /* ---------------------------------------- */

    /** HANDLEBARS */

    _preloadHandlebarsTemplates();

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

    Handlebars.registerHelper("toUpperCase", function (str) {
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
/* Talisman Hooks */
/* -------------------------------------------- */

Hooks.on("preUpdateOwnedItem", (actor, item, data) => TalismanHooks.onPreUpdateOwnedItem({ actor: actor, item: item, updateData: data }));
Hooks.on("preUpdateItem", (item, data) => TalismanHooks.onPreUpdateItem({ item: item, updateData: data }));
Hooks.on("preUpdateToken", (scene, token, data) => TalismanHooks.onPreUpdateTokenOwnedItem({ token: token, updateData: data }));

Hooks.on("createActor", async (actor, options, userId) => {
    let updateData = {};
    updateData["token.vision"] = true;
    if (actor.data.type == "character") {
        updateData["token.disposition"] = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
        updateData["token.actorLink"] = true;
    }
    await actor.update(updateData, { renderSheet: true });
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

/* -------------------------------------------- */
/** LOAD PARTIALS
/* -------------------------------------------- */

function _preloadHandlebarsTemplates() {
    const templatePaths = ["systems/talisman/templates/item/partials/item-header.html"];
    return loadTemplates(templatePaths);
}
