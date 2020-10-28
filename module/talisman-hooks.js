export default class TalismanHooks {
    static onUpdateItem({ actor = null, item = null, updateData = null, userId = null, diff = null } = {}) {
        if (item.type == "armor") {
            // update points list if rating changes
            if (updateData.data.rating) TalismanHooks._updateArmorPoints(item, updateData);
        }
    }

    static _updateArmorPoints(_item, _updateData) {
        let ap = _item.data.data.points;
        let numOfNewPoints = _updateData.data.rating.max - ap.length;
        if (numOfNewPoints > 0) {
            for (var i = 0; i < numOfNewPoints; i++) ap.push(0);
        } else {
            ap.splice(numOfNewPoints);
        }
        _updateData.data["points"] = ap;
    }
}
