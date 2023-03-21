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
                                        _asp = actor.system.attributes[aspectSelected].value;
                                    } else {
                                        _asp = actor.system.aspects[aspectSelected].value;
                                    }
                                }
                                wounds = 0 - actor.system.wounds.value * 2;
                                if (actor.system.equipped_armor && aspectSelected == "agi") {
                                    if (!actor.system.equipped_armor.system.agi_ignored) {
                                        armorPenalty = 0 - Math.abs(actor.system.equipped_armor.system.agi_penalty);
                                    }
                                }

                                //check if actor has shield and is ignoring it
                                if (aspectSelected == "agi") {
                                    let shieldAgiPenalty = 0;
                                    let _shield = actor.items.find((i) => i.type == "armor" && i.system.armor_type == "shield" && i.system.equipped == true);
                                    if (_shield?.system.agi_penalty) {
                                        shieldAgiPenalty = !_shield.system.agi_ignored ? _shield.system.agi_penalty : 0;
                                    }
                                    armorPenalty -= Math.abs(shieldAgiPenalty);
                                }

                                encumbrance = actor.system.derived.load.penalty;
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
