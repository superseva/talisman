export class DiceRoller {
    static rollDice({ num = 2, aspect = 0, modifier = 0, hasFocus = false } = {}) {
        //let rollFormula = `${num}d6[base] + 1d6[kismet]`;
        let rollFormula = `${num}db + 1dk`;
        let r = new Roll(rollFormula);
        r.roll();
        DiceRoller.sendToChat(r, aspect, modifier, hasFocus);
    }

    static countDuplicates(arr) {
        var count = {};
        arr.forEach(function (i) {
            count[i] = (count[i] || 0) + 1;
        });
        let maxDup = Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b));
        if (count[maxDup] == 1) return 0;
        else return count[maxDup];
    }

    static async sendToChat(r, aspect, modifier, hasFocus) {
        let baseDice = [];
        let diceResults = [];
        r.dice[0].results.forEach((element) => {
            baseDice.push(element.result);
        });
        diceResults = [...baseDice];
        diceResults.push(r.dice[1].results[0].result);
        let dup = DiceRoller.countDuplicates(diceResults);
        let successLevel = DiceRoller.getSuccessLevel(dup);
        successLevel = game.i18n.localize(successLevel);
        let focus = hasFocus ? 2 : 0;
        let total = baseDice.length < 3 ? diceResults.reduce((acc, res) => acc + res, 0) + (aspect + modifier + focus) : "?";
        let discardable = baseDice.length < 3 ? null : true;
        let rollData = {
            baseDice: baseDice,
            kismetDice: r.dice[1].results[0].result,
            diceResults: diceResults,
            duplicates: baseDice.length < 3 ? dup : "?",
            successLevel: baseDice.length < 3 ? successLevel : "?",
            total: total,
            discardable: discardable,
            aspect: aspect,
            modifier: modifier,
            focus: focus,
        };
        //console.warn(rollData);
        const html = await renderTemplate("systems/talisman/templates/chat/roll.html", rollData);
        let chatData = {
            user: game.user._id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            type: CHAT_MESSAGE_TYPES.ROLL,
            roll: r,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        let cm = await ChatMessage.create(chatData);
        cm.setFlag("talisman", "aspect", aspect);
        cm.setFlag("talisman", "modifier", modifier);
        cm.setFlag("talisman", "focus", focus);
    }

    static updateMessage(message, html, el) {
        let ignoreDieIndex = el.currentTarget.dataset.index;
        let diceResults = [];
        let baseDice = message.roll.dice[0].results.map((i) => i.result);
        baseDice.splice(ignoreDieIndex, 1);
        diceResults = [...baseDice];
        diceResults.push(message.roll.dice[1].results[0].result);
        let dup = DiceRoller.countDuplicates(diceResults);
        let successLevel = DiceRoller.getSuccessLevel(dup);
        successLevel = game.i18n.localize(successLevel);
        let aspect = message.getFlag("talisman", "aspect") || 0;
        let modifier = message.getFlag("talisman", "modifier") || 0;
        let focus = message.getFlag("talisman", "focus") || 0;
        let total = diceResults.reduce((acc, res) => acc + res, 0);
        total += aspect + modifier + focus;
        //update DUPLICATES
        html.find(".label-duplicates").html(dup);
        //update SUCCESS
        html.find(".success-value").html(successLevel);
        //update TOTAL
        html.find(".total-value").html(total);
        //update opacity
        $(el.currentTarget).addClass("discarded");
        let diceImages = html.find(".dice-image");
        diceImages.each((i, e) => {
            if (el.currentTarget.dataset.index != e.dataset.index) {
                $(e).removeClass("discarded");
            }
        });
    }

    static getSuccessLevel(num) {
        let scs = "";
        switch (num) {
            case 0:
                scs = "T.SUCCESS_REGULAR";
                break;
            case 1:
                scs = "T.SUCCESS_REGULAR";
                break;
            case 2:
                scs = "T.SUCCESS_GREAT";
                break;
            case 3:
                scs = "T.SUCCESS_EXTRA";
                break;
            default:
                scs = "T.?";
        }
        return scs;
    }
}
