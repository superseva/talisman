export class TalismanActor extends Actor {
    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData() {
        super.prepareData();
        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;

        if (actorData.type === "character") this._prepareCharacterData(actorData);
    }

    _prepareCharacterData(actorData) {
        const data = actorData.data;
        // Make modifications to data here. For example:
        //derived values or modifiers

        // SEE WHAT ARMOR IS EQUIPPED
        const _armor = actorData.items.find(
            (i) => i.type == "armor" && (i.data.armor_type != "shield" || i.data.armor_type != "helm") && i.data.equipped == true
        );
        if (!_armor) {
            console.warn("No Armor Found");
        } else {
            actorData.data.equipped_armor = _armor;
        }
    }
}
