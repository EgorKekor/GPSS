const SortedMap = require("collections/sorted-map");

class PriorQueue {
    constructor() {
        this._storage = new SortedMap();
    }

    print = () => {
        const fec = [];

        for (const key of this._storage.keys()) {
            for (const tr of this._storage.get(key)) {
                fec.push(`[${tr.num}, ${(+tr.startTime).toFixed(2)}, ${tr.currentBlock}, ${tr.prior}, ${tr.nextBlock}]`);
            }
        }

        console.log(`FEC: ${fec}`);
    }

    push = (weight, value) => {
        const digitWeight = +weight;
        if (!this._storage.has(digitWeight)) {
            this._storage.set(digitWeight, new Array);
        }
        this._storage.get(digitWeight).push(value);
    };

    peekMin = () => {
        let minVal;
        for (const key of this._storage.keys()) {
            return this._storage.get(+key);
        }
    }

    popMin = () => {
        let list;
        for (const key of this._storage.keys()) {
            list = this._storage.get(+key);
            this._storage.delete(+key);
            break;
        }
        return list;
    };
}

module.exports.createPrior = () => {
    return new PriorQueue;
}