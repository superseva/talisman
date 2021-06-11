/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class TalismanItemSheet extends ItemSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["talisman", "sheet", "item"],
            width: 520,
            height: "auto",
            resizable: true,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".item-body", initial: "attributes" }],
        });
    }

    /** @override */
    get template() {
        const path = "systems/talisman/templates/item";
        return `${path}/item-${this.item.data.type}-sheet.html`;
    }

    /* -------------------------------------------- */

    /** @override */
    getData() {
        const data = super.getData().data;
        return data;
    }

    /* -------------------------------------------- */

    /** @override */
    setPosition(options = {}) {
        const position = super.setPosition(options);
        const sheetBody = this.element.find(".item-body");
        const bodyHeight = position.height - 192;
        //sheetBody.css("height", bodyHeight);
        //sheetBody.css("overflow-y", "scroll");
        return position;
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        // Handle armor points clicks (left/right)
        html.find(".armor-point").click((e) => {
            let index = e.currentTarget.dataset["index"];
            let itemId = e.currentTarget.dataset["item_id"];
            let item = {};
            if (this.actor) {
                item = this.actor.items.get(itemId);
            } else {
                item = game.items.get(itemId);
            }
            item.updateArmor({ index: index, increase: true });
        });
        html.find(".armor-point").contextmenu((e) => {
            let index = e.currentTarget.dataset["index"];
            let itemId = e.currentTarget.dataset["item_id"];
            let item = {};
            if (this.actor) {
                item = this.actor.items.get(itemId);
            } else {
                item = game.items.get(itemId);
            }
            item.updateArmor({ index: index, increase: false });
        });
    }
}
