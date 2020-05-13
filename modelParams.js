class ModelParams {
    constructor(modelTime = 10000.0, channels = 0, Tc = 50, Ts = 200) {
        if (channels === 0) {
            channels = Math.ceil(Ts / Tc);
        }
        this.modelTime = modelTime.toFixed(10);
        this.channels = channels;
        this.Tc = Tc;
        this.Ts = Ts;
    }
}

module.exports.createParams = (modelTime = 10000, channels = 0, Tc = 50, Ts = 200) => {
    return new ModelParams(modelTime, channels, Tc, Ts);
}