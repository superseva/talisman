import { DiceRoller } from "./dice-roller.js";

export class RollDialog {
    static async prepareDialog() {
        let diceNum = 2;
        let aspect = 0;
        let htmlData = {};
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
                            DiceRoller.rollDice({ num: diceNum, aspect: aspect });
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
