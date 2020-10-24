export class TalismanDieBase extends Die {
    constructor(termData) {
        termData.faces = 6;
        super(termData);
    }

    /* -------------------------------------------- */

    /** @override */
    static DENOMINATION = "b";

    /** @override */
    get total() {
        return this.results.length;
    }

    /* -------------------------------------------- */

    /** @override */
    static getResultLabel(result) {
        return {
            1: '<img src="systems/talisman/ui/dice/tdb1.png" />',
            2: '<img src="systems/talisman/ui/dice/tdb2.png" />',
            3: '<img src="systems/talisman/ui/dice/tdb3.png" />',
            4: '<img src="systems/talisman/ui/dice/tdb4.png" />',
            5: '<img src="systems/talisman/ui/dice/tdb5.png" />',
            6: '<img src="systems/talisman/ui/dice/tdb6.png" />',
        }[result];
    }
}

export class TalismanDieKismet extends Die {
    constructor(termData) {
        termData.faces = 6;
        super(termData);
    }
    /* -------------------------------------------- */

    /** @override */
    static DENOMINATION = "k";

    /** @override */
    get total() {
        return this.results.length;
    }

    /* -------------------------------------------- */

    /** @override */
    static getResultLabel(result) {
        return {
            1: '<img src="systems/talisman/ui/dice/tdk1.png" />',
            2: '<img src="systems/talisman/ui/dice/tdk2.png" />',
            3: '<img src="systems/talisman/ui/dice/tdk3.png" />',
            4: '<img src="systems/talisman/ui/dice/tdk4.png" />',
            5: '<img src="systems/talisman/ui/dice/tdk5.png" />',
            6: '<img src="systems/talisman/ui/dice/tdk6.png" />',
        }[result];
    }
}
