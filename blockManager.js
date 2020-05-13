const fs = require ("fs");


class Block {
    constructor(name, capacity = Number.MAX_SAFE_INTEGER, blocking = false, size = 0) {
        this.name = name;
        this.capacity = capacity;
        this.size = size;
        this.blocking = blocking;
        this.lastTime = 0;
        this.matrix = [];
        this.maxRange = 22;
        while (this.matrix.length <= this.maxRange) {
            this.matrix.push(0.0);
        }
    }

    incr = () => { this.size++; };
    decr = () => {
        if (this.size > 0) {
            this.size--;
        }
    };
    full = () => this.capacity === this.size;
}

const E = 0;
const G = 1;
const Q = 2;
const D = 3;
const A = 4;
const T = 5;

class BlockManager {
    constructor(modelTime, channels) {
        this.channels = channels;
        this.blocks = [
            new Block("EMPTY"),
            new Block("GENERATE"),
            new Block("QUEUE"),
            new Block("DEPART"),
            new Block("ADVANCE", this.channels, true),
            new Block("TERMINATE")
        ];
        this.queStat = fs.openSync("queue.csv", "w+");
        this.modelTime = modelTime;
        this.lastTriggered = E;
    }

    writeQueue = () => {
        for (let i = 0; i < this.blocks[Q].matrix.length; ++i) {
            fs.writeSync(this.queStat, `${this.blocks[Q].matrix[i]}\n`);
        }
        console.log(this.blocks[Q].matrix);
    }

    endPromote = (currentTime) => {
        const percent = (currentTime - this.blocks[Q].lastTime) / this.modelTime;
        let size = this.blocks[Q].size;
        if (size > this.blocks[Q].maxRange) {
            size = this.blocks[Q].maxRange;
        }
        this.blocks[Q].matrix[size] += percent;
        this.blocks[Q].lastTime = currentTime;
    }


    createIn(block) {
        this.blocks[block].incr();
    }


    trigger = (transact) => {
        const blockNum = transact.nextBlock;

        switch (blockNum) {
            case E: {
                console.log("Error: Begin before empty");
                return false;
            }
            case G: {
                transact.currentBlock = G;
                transact.nextBlock = G + 1;
                return true;
            }
            case Q: {
                this.blocks[Q].incr();
                
                transact.currentBlock = Q;
                transact.nextBlock = Q + 1;
                return true;
            }
            case D: {
                transact.currentBlock = D;
                transact.nextBlock = D + 1;
                return true;
            }
            case A: {
                if (this.blocks[A].full()) {
                    transact.currentBlock = A - 1;
                    transact.nextBlock = A;
                    transact.chain = "CEC-CEC";
                    return false;
                } else {
                    this.blocks[A].incr();
                    this.blocks[Q].decr();
                    
                    transact.currentBlock = A;
                    transact.nextBlock = A + 1;
                    transact.chain = "CEC-FEC";
                    return false;
                }
            }
            case T: {
                this.blocks[A].decr();

                transact.currentBlock = T;
                transact.nextBlock = null;
                transact.chain = "CEC-EXIT";
                return false;
            }
        }
    }
}


module.exports.createBlockManager = (modelTime, channels) => {
    return new BlockManager(modelTime, channels);
}