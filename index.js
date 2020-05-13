model = require ("./model.js");
params = require ("./modelParams.js");


const Params = params.createParams(10000.0, 5, 45, 213);
const Model = model.createModel(Params);

Model.Input();
let i = 0;
while(!Model.Finish()) {
    Model.Correct();
    Model.Watch();
}
Model.WriteStat();

