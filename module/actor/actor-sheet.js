export class TalismanActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["talisman", "sheet", "actor"],
            template: "systems/talisman/templates/actor/actor-sheet.html",
            width: 630,
            height: 750,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }],
        });
    }

    /** @override */
    getData() {
        const superData = super.getData();
        const data = superData.data;
        data.dtypes = ["String", "Number", "Boolean"];
        // Prepare items.
        if (this.actor.data.type == "character") {
            this._prepareCharacterItems(data);
        }

        return data;
    }

    /**
     * Organize and classify Items for Character sheets.
     *
     * @param {Object} actorData The actor to prepare.
     *
     * @return {undefined}
     */
    _prepareCharacterItems(sheetData) {
        const actorData = sheetData.actor;
        const gear = [];
        const armor = [];
        const weapons = [];
        const spells = [];
        const skills = [];
        const abilities = [];
        const followers = [];
        for (let i of sheetData.items) {
            //let item = i.data;
            i.img = i.img || DEFAULT_TOKEN;
            if (i.type === "gear") {
                gear.push(i);
            } else if (i.type === "armor") {
                armor.push(i);
            } else if (i.type === "weapon") {
                weapons.push(i);
            } else if (i.type === "spell") {
                spells.push(i);
            } else if (i.type === "skill") {
                skills.push(i);
            } else if (i.type === "ability") {
                abilities.push(i);
            } else if (i.type === "follower") {
                followers.push(i);
            }
        }
        sheetData.gear = gear;
        sheetData.armor = armor;
        sheetData.weapons = weapons;
        sheetData.spells = spells;
        sheetData.skills = skills;
        sheetData.abilities = abilities;
        sheetData.followers = followers;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Add Inventory Item
        html.find(".item-create").click(this._onItemCreate.bind(this));

        // Update Inventory Item
        html.find(".item-edit").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find(".item-delete").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            await item.delete();
            li.slideUp(200, () => this.render(false));
        });

        //Toggle Equip Inventory Item
        html.find(".item-equip").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            await this.actor.updateEmbeddedDocuments("Item", [this._toggleEquipped(li.data("itemId"), item)]);           
        });
        //Toggle Pack Inventory Item
        html.find(".item-pack").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            await this.actor.updateEmbeddedDocuments("Item", [this._togglePacked(li.data("itemId"), item)]);
        });
        // Toggle Spell Memorised
        html.find(".item-memorise").click(async (ev) => {
            const _id = $(ev.currentTarget).data("itemId");
            const item = this.actor.items.get(_id);
            await this.actor.updateEmbeddedDocuments("Item", [this._toggleMemorised(_id, item)]);
        });
        // Toggle Spell Enduring
        html.find(".item-endure").click(async (ev) => {
            const _id = $(ev.currentTarget).data("itemId");
            const item = this.actor.items.get(_id);
            await this.actor.updateEmbeddedDocuments("Item", [this._toggleEnduring(_id, item)]);
        });

        //Set wounds
        html.find(".wounds .btn").click((ev) => {
            const li = $(ev.currentTarget);
            const updateData = {};
            updateData["data.wounds.value"] = li.data("value");
            this.actor.update(updateData);
        });
        html.find(".wounds .cancel-btn").click((ev) => {
            const updateData = {};
            updateData["data.wounds.value"] = 0;
            this.actor.update(updateData);
        });

        //Set Death Tests
        html.find(".deathtests .btn").click((ev) => {
            const li = $(ev.currentTarget);
            const updateData = {};
            updateData["data.death_tests.value"] = li.data("value");
            this.actor.update(updateData);
        });
        html.find(".deathtests .cancel-btn").click((ev) => {
            const updateData = {};
            updateData["data.death_tests.value"] = 0;
            this.actor.update(updateData);
        });

        // Mark Asepct.
        html.find(".aspect .rollable").contextmenu(this._onMarkAttribute.bind(this));

        // Rollable Attribute.
        html.find(".attribute .rollable").click(this._onRollAspect.bind(this));
        // Rollable Aspect.
        html.find(".aspect .rollable").click(this._onRollAspect.bind(this));
        // Rollable skill
        html.find(".skill.rollable").click(this._onRoll.bind(this));
        // Rollable Button.
        html.find(".roll-button").click(this._onRoll.bind(this));

        // Handle armor points clicks (left/right)
        html.find(".armor-point").click((ev) => {
            let index = ev.currentTarget.dataset["index"];
            let armor = this.actor.data.data.equipped_armor;
            const item = this.actor.items.get(armor._id);
            item.updateArmor({ index: index, increase: true });
        });

        html.find(".armor-point").contextmenu((ev) => {
            let index = ev.currentTarget.dataset["index"];
            let armor = this.actor.data.data.equipped_armor;
            const item = this.actor.items.get(armor._id);
            item.updateArmor({ index: index, increase: false });
            return;
        });

        //Roll Spell Test
        html.find(".spell.rollable").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            const itemData = item.data.data;
            let aspectKey;
            if (itemData.granted) {
                aspectKey = "craft";
            } else {
                aspectKey = item.data.data.type;
            }
            game.talisman.RollDialog.prepareDialog({ actor: this.actor, aspectId: aspectKey });
        });

        //Roll Spell Damage
        html.find(".spell-damage.rollable").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.rollSpellDamage();
        });

        //See Spell Description
        html.find(".spell-description.rollable").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const spell = this.actor.items.get(li.data("itemId"));
            const spellData = spell.data.data;
            //console.log(spell);
            let spell_html = `<h4><strong>${spell.name}</strong></h4>
                        <p class='size12'>Action: ${spellData.action}</p>                        
                        <p class='size12'>Spell Points: ${spellData.spell_points}</p>
                        <p class='size12'>Difficulty: ${spellData.difficulty}</p>
                        <p class='size12'>Defence: ${spellData.defence}</p>                    
                        <div class='size12'>${spellData.description}</div>`;
            const spellDescBox = $(".spell-description-box");
            spellDescBox.html(spell_html);
        });

        //Roll Weapon Attack
        html.find(".weapon.rollable").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            let aspectKey = item.data.data.aspect == 0 ? null : item.data.data.aspect;
            let bonus = item.data.data.bonus.value == "" ? 0 : item.data.data.bonus.value;
            let focus = item.data.data.focus;
            game.talisman.RollDialog.prepareDialog({ actor: this.actor, aspectId: aspectKey, modifier: bonus, focus: focus });
        });
        //Roll Damage For Weapon
        html.find(".weapon-damage.rollable").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.rollWeaponDamage(this.actor.data.data.damage_modifier.physical.value);
        });

        // Chatable Item
        html.find(".chaty").click(this._onItemSendToChat.bind(this));

        // Drag events for macros.
        if (this.actor.isOwner) {
            let handler = (ev) => this._onDragItemStart(ev);
            html.find("li.item").each((i, li) => {
                if (li.classList.contains("inventory-header")) return;
                li.setAttribute("draggable", true);
                li.addEventListener("dragstart", handler, false);
            });
        }
    }

    /**
     * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
     * @param {Event} event   The originating click event
     * @private
     */
    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const data = duplicate(header.dataset);
        const name = `New ${type.capitalize()}`;
        const itemData = {
            name: name,
            type: type,
            data: data,
        };
        delete itemData.data["type"];
        return await Item.create(itemData, { parent: this.actor });
    }

    /**
     * Handle right-click aspect.
     * @param {Event} event   The originating click event
     * @private
     */
    async _onMarkAttribute(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataKey = element.dataset["key"];
        let obj = duplicate(this.actor.data.data.aspects);
        Object.keys(obj).forEach((k) => {
            obj[k].cap = 6;
        });
        obj[dataKey].cap = 7;
        await this.actor.update({ "data.aspects": obj });
    }

    /**
     * Handle clickable attribute rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    _onRollAspect(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        game.talisman.RollDialog.prepareDialog({ actor: this.actor, aspectId: dataset["key"] });
    }

    _onItemSendToChat(event) {
        event.preventDefault();
        const itemId = $(event.currentTarget).data("item-id");
        const item = this.actor.items.get(itemId);
        if (!item) return;
        item.sendToChat();
    }

    /**
     * Handle clickable Roll Button.
     * @param {Event} event   The originating click event
     * @private
     */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        game.talisman.RollDialog.prepareDialog({ actor: this.actor });
    }

    //Toggle Equipment
    _toggleEquipped(id, item) {
        return {
            _id: id,
            data: {
                equipped: !item.data.data.equipped,
            },
        };
    }

    //Toggle Packed
    _togglePacked(id, item) {
        return {
            _id: id,
            data: {
                packed: !item.data.data.packed,
            },
        };
    }

    //Toggle Memorised
    _toggleMemorised(id, item) {
        return {
            _id: id,
            data: {
                memorised: !item.data.data.memorised,
            },
        };
    }

    //Toggle Enduring
    _toggleEnduring(id, item) {
        return {
            _id: id,
            data: {
                enduring: !item.data.data.enduring,
            },
        };
    }
}
