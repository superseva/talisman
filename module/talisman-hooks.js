export default class TalismanHooks {
    static onUpdateItem({ item = null, updateData = null } = {}) {
        if (item.type == "armor") {
            // update points list if rating changes
            if (updateData.data.rating) TalismanHooks._updateArmorPoints(item.data, updateData);
        }
    }

    static onUpdateOwnedItem({ actor = null, item = null, updateData = null, userId = null, diff = null } = {}) {
        if (item.type == "armor") {
            // update points list if rating changes
            if (updateData.data.rating) TalismanHooks._updateArmorPoints(item, updateData);
        }
    }

    static _updateArmorPoints(_item, updateData) {
        if (!updateData.data.rating.max) return;
        let ap = _item.data.points;
        let numOfNewPoints = updateData.data.rating.max - ap.length;
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
