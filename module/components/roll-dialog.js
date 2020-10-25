import { DiceRoller } from "./dice-roller.js";

export class RollDialog {
    static async prepareDialog({ diceNum = 2, aspect = 0, modifier = 0 } = {}) {
        let htmlData = {
            diceNum: diceNum,
            aspect: aspect,
            modifier: modifier,
        };
        let htmlContent = await renderTemplate("systems/talisman/templates/dialog/roll-dialog.html", htmlData);
        return new Promise((resolve) => {
            let d = new Dialog({
                title: "Rolling",
                content: htmlContent,
                buttons: {
                    roll: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Roll",
                        callback: (html) => {
                            let hasBonusDie = html.find(".bonus-die-check").prop("checked");
                            if (hasBonusDie) diceNum = 3;
                            else diceNum = 2;
                            let hasFocus = html.find(".focus-check").prop("checked");
                            let _asp = parseInt(html.find(".aspect-value")[0].value);
                            let _mod = parseInt(html.find(".modifier-value")[0].value);
                            DiceRoller.rollDice({ num: diceNum, aspect: _asp, modifier: _mod, hasFocus: hasFocus });
                        },
                    },
                },
                default: "roll",
                close: () => {},
            });
            d.render(true);
        });
    }
}
