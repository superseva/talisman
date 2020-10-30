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
        const data = super.getData();
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
        const skills = [];
        for (let i of sheetData.items) {
            //let item = i.data;
            i.img = i.img || DEFAULT_TOKEN;
            if (i.type === "gear") {
                gear.push(i);
            } else if (i.type === "armor") {
                armor.push(i);
            } else if (i.type === "weapon") {
                weapons.push(i);
            } else if (i.type === "skill") {
                skills.push(i);
            }
        }
        actorData.gear = gear;
        actorData.armor = armor;
        actorData.weapons = weapons;
        actorData.skills = skills;
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
            const item = this.actor.getOwnedItem(li.data("itemId"));
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find(".item-delete").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            this.actor.deleteOwnedItem(li.data("itemId"));
            li.slideUp(200, () => this.render(false));
        });

        //Toggle Equip Inventory Item
        html.find(".item-equip").click(async (ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.getOwnedItem(li.data("itemId"));
            await this.actor.updateOwnedItem(this._toggleEquipped(li.data("itemId"), item));
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

        // Rollable Attribute.
        html.find(".attribute .rollable").click(this._onRollAspect.bind(this));
        // Rollable Aspect.
        html.find(".aspect .rollable").click(this._onRollAspect.bind(this));
        // Rollable skill
        html.find(".skill.rollable").click(this._onRoll.bind(this));
        // Rollable Button.
        html.find(".roll-button").click(this._onRoll.bind(this));

        // Handle armor points clicks (left/right)
        html.find(".armor-point").click((e) => {
            let index = e.currentTarget.dataset["index"];
            let armor = this.actor.data.data.equipped_armor;
            const item = this.actor.getOwnedItem(armor._id);
            item.updateArmor({ index: index, increase: true });
        });

        html.find(".armor-point").contextmenu((e) => {
            let index = e.currentTarget.dataset["index"];
            let armor = this.actor.data.data.equipped_armor;
            const item = this.actor.getOwnedItem(armor._id);
            item.updateArmor({ index: index, increase: false });
            return;
        });

        // Drag events for macros.
        if (this.actor.owner) {
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
    _onItemCreate(event) {
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
        return this.actor.createOwnedItem(itemData);
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
}
