class Transact {
    constructor(num, startTime, currentBlock, nextBlock, prior) {
        this.num = num;
        this.startTime = startTime;
        this.currentBlock = currentBlock;
        this.nextBlock = nextBlock;
        this.prior = prior;
        this.chain = "FEC";
    }
}

module.exports.createTransact = (num, startTime, currentBlock, nextBlock, prior) => {
    return new Transact(num, startTime, currentBlock, nextBlock, prior);
}