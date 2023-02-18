import { TalismanBaseActorSheet } from "./base-actor-sheet.js";

export class TalismanEnemySheet extends TalismanBaseActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["talisman", "sheet", "actor"],
            template: "systems/talisman/templates/actor/enemy-sheet.html",
            width: 600,
            height: 680,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "skills" }],
        });
    }

    /** @override */
    async getData() {
        const context  = await super.getData()
        this._prepareEnemyItems(context);
        context.biographyHTML = await TextEditor.enrichHTML(context.system.biography, {
            secrets: this.actor.isOwner,
            async: true
        });
        context.specialAbilitiesHTML = await TextEditor.enrichHTML(context.system.special_abilities, {
                secrets: this.actor.isOwner,
                async: true
        });
        return context;
    }

    _prepareEnemyItems(context) {
        const attacks = [];
        const gear = [];
        const armor = [];
        const weapons = [];
        const spells = [];
        const skills = [];
        const abilities = [];
        const followers = [];
        for (let i of context.items) {
            i.img = i.img || DEFAULT_TOKEN;
            if (i.type === "enemy_attack") {
                attacks.push(i);
            }
            else if (i.type === "gear") {
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
        context.gear = gear;
        context.armor = armor;
        context.weapons = weapons;
        context.spells = spells;
        context.skills = skills;
        context.abilities = abilities;
        context.followers = followers;
        context.attacks = attacks;
    }
}
