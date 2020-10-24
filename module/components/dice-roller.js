export class DiceRoller {
    static rollDice({ num = 2 } = {}) {
        //let rollFormula = `${num}d6[base] + 1d6[kismet]`;
        let rollFormula = `${num}db + 1dk`;
        let r = new Roll(rollFormula);
        r.roll();
        console.warn(r);

        // if num==2
        //get TOTAL
        console.warn(`TOTAL = ${r.total}`);
        // get num of duplicates
        let diceResults = [];
        r.dice[0].results.forEach((element) => {
            diceResults.push(element.result);
        });
        diceResults.push(r.dice[1].results[0].result);
        let dup = DiceRoller.findMaxDuplicates(diceResults);
        console.warn(`DUPLICATES = ${dup}`, dup);
        DiceRoller.SendToChat(r);

        // -----------------------
        //if num==3
        //get all that are bigger than diff {DIFF ???}
        //get the one with most dupicates
    }

    _evaluateResult(array) {}

    static findMaxDuplicates(array) {
        var counts = {};
        for (var i = 0; i < array.length; i++) {
            var num = array[i];
            counts[num] = counts[num] ? counts[num] + 1 : 1;
        }
        return counts;
    }

    static async SendToChat(_roll) {
        let rollData = {};
        const html = await renderTemplate("systems/talisman/templates/chat/roll.html", rollData);
        let chatData = {
            user: game.user._id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
            type: CHAT_MESSAGE_TYPES.ROLL,
            roll: _roll,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperRecipients("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        await ChatMessage.create(chatData);
    }
}
