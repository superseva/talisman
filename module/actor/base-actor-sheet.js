export class TalismanBaseActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return super.defaultOptions;
    }

    /** @override */
    async getData() {
        const superData = await super.getData();
        const data = superData.data;
        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
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

        // Rollable Attribute.
        html.find(".attribute.rollable").click(this._onRollAspect.bind(this));
        // Rollable Button.
        html.find(".roll-button").click(this._onRoll.bind(this));

        //Roll Damage
        html.find(".attack.rollable").click((ev) => {
            const li = $(ev.currentTarget).parents(".item");
            const formula = li.data("formula");
            this._rollTheAttack(formula);
        });
    }

    async _rollTheAttack(formula) {
        let actorOptions = null;
        if (this.actor) {
            actorOptions = this.actor.getRollShortcuts();            
        }
        console.log(actorOptions)
        let r = new Roll(formula, actorOptions);
        await r.evaluate({ async : false }).toMessage();
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
     * Handle clickable attribute rolls.
     * @param {Event} event   The originating click event
     * @private
     */
    _onRollAspect(event) {
        event.preventDefault();
        const element = event.currentTarget;
        const dataset = element.dataset;
        game.talisman.RollDialog.prepareDialog({ aspect: dataset.attribute });
    }

    /**
     * Handle clickable Roll Button.
     * @param {Event} event   The originating click event
     * @private
     */
    _onRoll(event) {
        event.preventDefault();
        const element = event.currentTarget;
        game.talisman.RollDialog.prepareDialog({ aspect: 0 });
    }
}
