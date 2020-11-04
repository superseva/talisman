/**
 * Extend the basic Item with some very simple modifications.
 * @extends {Item}
 */
export class TalismanItem extends Item {
    /**
     * Augment the basic Item data model with additional dynamic data.
     */
    prepareData() {
        super.prepareData();

        // Get the Item's data
        const itemData = this.data;
        const actorData = this.actor ? this.actor.data : {};
        const data = itemData.data;
    }

    async updateArmor({ index = 0, increase = true } = {}) {
        let ap = [...this.data.data.points];
        if (increase) ap[index] = ap[index] < 2 ? ap[index] + 1 : 0;
        else ap[index] = 0;
        let updateData = { data: {} };
        updateData.data["points"] = ap;
        let armorValue = 0;
        ap.forEach((element) => {
            if (parseInt(element) == 0) armorValue++;
        });
        let ratingVal = { rating: { value: armorValue } };
        updateData.data = { ...updateData.data, ...ratingVal };
        this.update(updateData);
    }

    rollSpellDamage() {
        let formula = this.data.data.damage.value;
        let actorOptions = null;
        if (this.actor) {
            actorOptions = this.actor.getRollShortcuts();
        }
        let r = new Roll(formula, actorOptions);
        r.roll().toMessage();
    }

    rollWeaponDamage() {
        let formula = this.data.data.damage.value;
        let actorOptions = null;
        if (this.actor) {
            actorOptions = this.actor.getRollShortcuts();
            const damage_mod = this.actor.data.data.damage_modifier[this.data.data.damage.type].value;
            formula = `${formula} + ${damage_mod}`;
        }
        let r = new Roll(formula, actorOptions);
        r.roll().toMessage();
    }

    /**
     * Send To Chat
     */
    async sendToChat() {
        const itemData = duplicate(this.data);
        if (itemData.img.includes("/mystery-man")) {
            itemData.img = null;
        }
        itemData.isWeapon = itemData.type === "weapon";
        itemData.isArmor = itemData.type === "armor";
        itemData.isGear = itemData.type === "gear";
        itemData.isAbility = itemData.type === "ability";
        itemData.isSpell = itemData.type === "spell";
        itemData.isSkill = itemData.type === "skill";
        itemData.isFollower = itemData.type === "follower";
        const html = await renderTemplate("systems/talisman/templates/chat/item.html", itemData);
        const chatData = {
            user: game.user._id,
            rollMode: game.settings.get("core", "rollMode"),
            content: html,
        };
        if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
            chatData.whisper = ChatMessage.getWhisperIDs("GM");
        } else if (chatData.rollMode === "selfroll") {
            chatData.whisper = [game.user];
        }
        ChatMessage.create(chatData);
    }

    /**
     * Handle clickable rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    async roll() {
        // Basic template rendering data
        const token = this.actor.token;
        const item = this.data;
        const actorData = this.actor ? this.actor.data.data : {};
        const itemData = item.data;

        let roll = new Roll("d20+@abilities.str.mod", actorData);
        let label = `Rolling ${item.name}`;
        roll.roll().toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
        });
    }
}
