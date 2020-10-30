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
        console.warn(updateData);
        this.update(updateData);
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
