import { DiceRoller } from "./dice-roller.js";

export class RollDialog {
    static async prepareDialog({ actor = null, aspectId = null, diceNum = 2, aspect = 0, modifier = 0, focus = false } = {}) {
        let htmlData = {
            diceNum: diceNum,
            aspect: aspect,
            modifier: modifier,
            actor: actor,
            aspectId: aspectId,
            focus: focus,
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
                            let _asp = 0;
                            let wounds = 0;
                            let armorPenalty = 0;
                            let encumbrance = 0;
                            if (actor) {
                                let aspectSelected = html.find(".aspects").val();
                                if (aspectSelected != 0) {
                                    if (aspectSelected.length > 3) {
                                        _asp = actor.data.data.attributes[aspectSelected].value;
                                    } else {
                                        _asp = actor.data.data.aspects[aspectSelected].value;
                                    }
                                }
                                wounds = 0 - actor.data.data.wounds.value * 2;
                                if (actor.data.data.equipped_armor && aspectSelected == "agi") {
                                    if (!actor.data.data.equipped_armor.data.agi_ignored) {
                                        armorPenalty = 0 - Math.abs(actor.data.data.equipped_armor.data.agi_penalty);
                                    }
                                }

                                //check if actor has shield and is ignoring it
                                if (aspectSelected == "agi") {
                                    let shieldAgiPenalty = 0;
                                    let _shield = actor.data.items.find((i) => i.type == "armor" && i.data.armor_type == "shield" && i.data.equipped == true);
                                    if (_shield?.data.agi_penalty) {
                                        shieldAgiPenalty = !_shield.data.agi_ignored ? _shield.data.agi_penalty : 0;
                                    }
                                    armorPenalty -= Math.abs(shieldAgiPenalty);
                                }

                                encumbrance = actor.data.data.derived.load.penalty;
                            } else {
                                _asp = parseInt(html.find(".aspect-value")[0].value);
                            }
                            let _mod = parseInt(html.find(".modifier-value")[0].value);
                            DiceRoller.rollDice({
                                num: diceNum,
                                aspect: _asp,
                                modifier: _mod,
                                hasFocus: hasFocus,
                                wounds: wounds,
                                armorPenalty: armorPenalty,
                                encumbrance: encumbrance,
                            });
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
