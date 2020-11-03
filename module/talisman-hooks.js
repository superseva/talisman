export default class TalismanHooks {
    static async onCreateActor({ actor = null, options = null, userId = null } = {}) {
        let updateData = {};
        updateData["token.vision"] = true;
        if (actor.data.type == "character") {
            updateData["token.disposition"] = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
            updateData["token.actorLink"] = true;
        }
        await actor.update(updateData, { renderSheet: true });
    }

    static onPreUpdateItem({ item = null, updateData = null } = {}) {
        if (item.type == "armor") {
            // update points list if rating changes
            if (updateData.data.rating) TalismanHooks._updateArmorPoints(item.data, updateData);
        }
    }

    static onPreUpdateOwnedItem({ actor = null, item = null, updateData = null, userId = null, diff = null } = {}) {
        if (item.type == "armor") {
            // update points list if rating changes
            if (updateData.data.rating) TalismanHooks._updateArmorPoints(item, updateData);
        }
    }

    static onPreUpdateTokenOwnedItem({ token = null, updateData = null } = {}) {
        if (!updateData.actorData) return;
        if (!updateData.actorData.items) return;
        updateData.actorData.items.forEach((item) => {
            if (item.type == "armor") TalismanHooks._updateArmorPoints(item, item);
        });
    }

    static _updateArmorPoints(_item, updateData) {
        if (!updateData.data.rating.max) return;
        let ap = _item.data.points;
        let numOfNewPoints = updateData.data.rating.max - ap.length;
        if (updateData.data.rating.max == ap.length) return;
        if (numOfNewPoints > 0) {
            for (var i = 0; i < numOfNewPoints; i++) ap.push(0);
        } else {
            ap.splice(numOfNewPoints);
        }
        updateData.data["points"] = ap;
        let armorValue = 0;
        ap.forEach((element) => {
            if (parseInt(element) == 0) armorValue++;
        });
        updateData.data["rating"]["value"] = armorValue;
    }
}
