import { DiceRoller } from "./components/dice-roller.js";
import { TalismanDieBase } from "./talisman-dice.js";
import { TalismanDieKismet } from "./talisman-dice.js";

Hooks.once("init", async function () {
    game.talisman = {
        DiceRoller,
    };
    CONFIG.Dice.terms["b"] = TalismanDieBase;
    CONFIG.Dice.terms["k"] = TalismanDieKismet;
});
