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
        // const itemData = this.data;
        // const actorData = this.actor ? this.actor.data : {};
        // const data = itemData.data;
    }

    async updateArmor({ index = 0, increase = true } = {}) {
        let ap = [...this.system.points];
        if (increase) ap[index] = ap[index] < 2 ? ap[index] + 1 : 0;
        else ap[index] = 0;
        let updateData = { system: {} };
        updateData.system["points"] = ap;
        let armorValue = 0;
        ap.forEach((element) => {
            if (parseInt(element) == 0) armorValue++;
        });
        let ratingVal = { rating: { value: armorValue } };
        updateData.system = { ...updateData.system, ...ratingVal };
        console.warn(updateData)
        await this.update(updateData);
    }

    async rollSpellDamage() {
        let formula = this.system.damage.value;
        let actorOptions = null;
        if (this.actor) {
            actorOptions = this.actor.getRollShortcuts();
        }
        let r = new Roll(formula, actorOptions);
        await r.roll({ async : false }).toMessage();
    }

    async rollWeaponDamage() {
        let formula = this.system.damage.value;
        let actorOptions = null;
        if (this.actor) {
            actorOptions = this.actor.getRollShortcuts();
            const damage_mod = this.actor.system.damage_modifier[this.system.damage.type].value;
            formula = `${formula} + ${damage_mod}`;
        }
        let r = new Roll(formula, actorOptions);
        await r.roll({ async : false }).toMessage();
    }

    /**
     * Send To Chat
     */
    async sendToChat() {
        const itemData = duplicate(this.system);
        // if (itemData.img.includes("/mystery-man")) {
        //     itemData.img = null;
        // }
        itemData.name = this.name;
        itemData.img = this.img;
        itemData.isWeapon = this.type === "weapon";
        itemData.isArmor = this.type === "armor";
        itemData.isGear = this.type === "gear";
        itemData.isAbility = this.type === "ability";
        itemData.isSpell = this.type === "spell";
        itemData.isSkill = this.type === "skill";
        itemData.isFollower = this.type === "follower";
        const html = await renderTemplate("systems/talisman/templates/chat/item.html", itemData);
        const chatData = {
            user: game.user.id,
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
        console.warn('YO')
        const token = this.actor.token;
        const item = this.data;
        const actorData = this.actor ? this.actor.system : {};
        const itemData = this.system;

        let roll = new Roll("d20+@abilities.str.mod", actorData);
        let label = `Rolling ${this.name}`;
        roll.roll().toMessage({
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            flavor: label,
        });
    }
}
