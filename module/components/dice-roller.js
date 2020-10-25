export class DiceRoller {
    static rollDice({ num = 2 } = {}) {
        //let rollFormula = `${num}d6[base] + 1d6[kismet]`;
        let rollFormula = `${num}db + 1dk`;
        let r = new Roll(rollFormula);
        r.roll();
        DiceRoller.sendToChat(r);
    }

    static findMaxDuplicates(array) {
        var counts = {};
        for (var i = 0; i < array.length; i++) {
            var num = array[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        return counts;
    }

    static countDuplicates(arr) {
        var count = {};
        arr.forEach(function (i) {
            count[i] = (count[i] || 0) + 1;
        });
        console.warn(count);
        let maxDup = Object.keys(count).reduce((a, b) => (count[a] > count[b] ? a : b));
        console.warn(maxDup);
        if (count[maxDup] == 1) return 0;
        else return count[maxDup];
        //return maxDup;
    }

    static async sendToChat(r) {
        let baseDice = [];
        let diceResults = [];
        r.dice[0].results.forEach((element) => {
            baseDice.push(element.result);
        });
        diceResults = [...baseDice];
        diceResults.push(r.dice[1].results[0].result);
        //let dup = DiceRoller.findMaxDuplicates(diceResults);
        let dup = DiceRoller.countDuplicates(diceResults);
        let total = baseDice.length < 3 ? diceResults.reduce((acc, res) => acc + res, 0) : "?";
        let discardable = baseDice.length < 3 ? null : true;
        /*if (baseDice.length < 3) {
            total = diceResults.reduce((acc, res) => acc + res, 0);
        } else {
            discardable = true;
        }*/
        let rollData = {
            baseDice: baseDice,
            kismetDice: r.dice[1].results[0].result,
            diceResults: diceResults,
            duplicates: baseDice.length < 3 ? dup : "?",
            total: total,
            discardable: discardable,
        };
        console.warn(rollData);
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
        await ChatMessage.create(chatData);
    }

    static updateMessage(message, html, el) {
        console.log(`updating: ${message.id} with el`);
        console.log(el.currentTarget.dataset);
        let ignoreDieIndex = el.currentTarget.dataset.index;
        let diceResults = [];
        let baseDice = message.roll.dice[0].results.map((i) => i.result);
        baseDice.splice(ignoreDieIndex, 1);
        diceResults = [...baseDice];
        diceResults.push(message.roll.dice[1].results[0].result);
        //let dup = DiceRoller.findMaxDuplicates(diceResults);
        let dup = DiceRoller.countDuplicates(diceResults);
        let total = diceResults.reduce((acc, res) => acc + res, 0);
        //console.log(diceResults, total, dup);
        //update DUPLICATES
        html.find(".label-success").html(dup);
        //update TOTAL
        html.find(".label-total").html(total);
        //update opacity
        $(el.currentTarget).addClass("discarded");
        let diceImages = html.find(".dice-image");
        diceImages.each((i, e) => {
            if (el.currentTarget.dataset.index != e.dataset.index) {
                $(e).removeClass("discarded");
            }
        });
    }
}
