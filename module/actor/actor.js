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
        const _armor = actorData.items._source.find(
            (i) => i.type == "armor" && i.data.armor_type != "shield" && i.data.armor_type != "helm" && i.data.equipped == true
        );
        if (!_armor) {
            //console.warn("No Armor Found");
            data.derived.armor.value = 0;
        } else {
            data.equipped_armor = _armor;
            data.derived.armor.value = _armor.data.rating.value;
        }

        //SET SPEED
        data.derived.speed.value = data.aspects.agi.value + 10;

        //SET DAMAGES
        data.damage_modifier.physical.value = data.attributes.strength.value + data.damage_modifier.physical.mod;
        data.damage_modifier.psychic.value = data.attributes.craft.value + data.damage_modifier.psychic.mod;

        //SET LOAD
        const physicalItems = actorData.items._source.filter((_item) => _item.data.weight > 0);
        let load = 0;

        physicalItems.forEach((i) => {
            let itemWeight = i.data.packed ? (parseFloat(i.data.weight) / 2) : parseFloat(i.data.weight);
            load += itemWeight * parseInt(i.data.quantity);
        });

        data.derived.load.max = data.attributes.strength.value * 5;
        data.derived.load.value = load;
        data.derived.load.penalty = 0;
        if (data.derived.load.value > data.derived.load.max) {
            data.derived.load.penalty = -2;
            data.derived.speed.value = Math.floor(data.derived.speed.value / 2);
        }
    }

    getRollShortcuts() {
        let out = {};
        // Attributes
        const attr = this.data.data.attributes;
        for (const name of ["strength", "craft"]) {
            out[name.substring(0, 3)] = attr[name].value;
        }
        // Aspects
        const asp = this.data.data.aspects;
        for (const key of Object.keys(asp)) {
            out[key] = asp[key].value;
        }
        return out;
    }
}

export class TalismanEnemy extends Actor {
    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData() {
        super.prepareData();
        const actorData = this.data;
        const data = actorData.data;
        const flags = actorData.flags;
    }
}
