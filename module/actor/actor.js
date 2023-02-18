export class TalismanActor extends Actor {
    /**
     * Augment the basic actor data with additional dynamic data.
     */
    prepareData() {
        super.prepareData();
        // const actorData = this.data;
        // const data = actorData.data;
        // const flags = actorData.flags;

        // if (actorData.type === "character") this._prepareCharacterData(actorData);
    }

    // @override
    prepareBaseData() {
        if (this.type === "character") this._prepareCharacterData();
    }

    _prepareCharacterData(actorData) {
        //const data = actorData.data;
        // Make modifications to data here. For example:
        //derived values or modifiers

        // SEE WHAT ARMOR IS EQUIPPED
        const _armor = this.items.find(
            (i) => i.type == "armor" && i.system.armor_type != "shield" && i.system.armor_type != "helm" && i.system.equipped == true
        );
        if (!_armor) {
            //console.warn("No Armor Found");
            this.system.derived.armor.value = 0;
        } else {
            this.system.equipped_armor = _armor;
            this.system.derived.armor.value = _armor.system.rating.value;
        }

        //SET SPEED
        this.system.derived.speed.value = this.system.aspects.agi.value + 10;

        //SET DAMAGES
        this.system.damage_modifier.physical.value = this.system.attributes.strength.value + this.system.damage_modifier.physical.mod;
        this.system.damage_modifier.psychic.value = this.system.attributes.craft.value + this.system.damage_modifier.psychic.mod;

        //SET LOAD
        const physicalItems = this.items.filter((_item) => _item.system.weight > 0);
        let load = 0;

        physicalItems.forEach((i) => {
            let itemWeight = i.system.packed ? (parseFloat(i.system.weight) / 2) : parseFloat(i.system.weight);
            load += itemWeight * parseInt(i.system.quantity);
        });

        this.system.derived.load.max = this.system.attributes.strength.value * 5;
        this.system.derived.load.value = load;
        this.system.derived.load.penalty = 0;
        if (this.system.derived.load.value > this.system.derived.load.max) {
            this.system.derived.load.penalty = -2;
            this.system.derived.speed.value = Math.floor(this.system.derived.speed.value / 2);
        }
    }

    getRollShortcuts() {
        let out = {};
        // Attributes
        const attr = this.system.attributes;
        for (const name of ["strength", "craft"]) {
            out[name.substring(0, 3)] = attr[name].value;
        }
        // Aspects
        const asp = this.system.aspects;
        if(asp){
            for (const key of Object.keys(asp)) {
                out[key] = asp[key].value;
            }
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
        // const actorData = this.data;
        // const data = actorData.data;
        // const flags = actorData.flags;
    }
}
