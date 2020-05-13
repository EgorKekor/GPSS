const queue = require ("./queue.js");
const transact = require ("./transact.js");
const blMan = require ("./blockManager.js");

const E = 0;
const G = 1;
const Q = 2;
const D = 3;
const A = 4;
const T = 5;


class Model {
    constructor(params) {
        this.params = params;
        this.FEC = queue.createPrior();
        this.CEC = new Set;
        this.currentTime = 0;
        this.Transactnum = 0;
        this.blockManager = blMan.createBlockManager(params.modelTime, params.channels);
        this.lastTime = 0;
    }


    _promote = (transact) => {
        while (this.blockManager.trigger(transact));
    }

    _exponential = (N) => {
        return Math.log(1 - Math.random()) * -N;
    }

    _createTransact = (startTime, curB, nextB) => {
        const tr = transact.createTransact(this.Transactnum++, startTime, curB, nextB, 0);
        this.lastTime = +startTime;
        this.counter++;
        this.blockManager.createIn(curB);
        this.FEC.push(tr.startTime, tr);
    }

    _printModel = () => {
        const cec = [];
        for (const elem of this.CEC) {
            cec.push(`[${elem.num}, ${elem.startTime}, ${elem.currentBlock}, ${elem.prior}, ${elem.nextBlock}]`);
        }

        console.log(`TIME: ${this.currentTime}`);
        console.log(`CEC: ${cec}`);
        this.FEC.print();
    }




    

    Finish = () => {
        return +this.currentTime >= +this.params.modelTime; 
    };

    Input = () => {
        this._createTransact(this.params.modelTime, E, T);
        this._createTransact(this._exponential(this.params.Tc), E, G);
    }

    WriteStat = () => {
        this.blockManager.writeQueue();
    }

    Correct = () => {
        this._createTransact(this._exponential(this.params.Tc) + this.lastTime, E, G);

        const transacts = this.FEC.popMin();
        this.currentTime = transacts[0].startTime;

        for (const transact of transacts) {
            this.CEC.add(transact);
        }

        this._printModel();
    }

    Watch = () => {
        let cnt = 0;
        for (const transact of this.CEC) {
            this._promote(transact);

            switch (transact.chain) {
                case "CEC-CEC": {
                    cnt++;
                    break;
                }
                case "CEC-FEC": {
                    this.CEC.delete(transact);
                    transact.startTime = this.currentTime + this._exponential(this.params.Ts);
                    this.FEC.push(transact.startTime, transact);
                    break;
                }
                case "CEC-EXIT": {
                    this.CEC.delete(transact);
                    this.counter--;
                    break;
                }
                default: {
                    break;
                }
            }

        }
        this.blockManager.endPromote(this.currentTime);
        this._printModel();
    }
}

module.exports.createModel = (params) => {
    return new Model(params);
}