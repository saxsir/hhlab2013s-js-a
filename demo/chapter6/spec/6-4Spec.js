var docclass = new DocClass();
var cl = new docclass.Classifier(docclass.getwords);

docclass.sampletrain(cl);
console.log(cl.fprob('quick', 'good')); // => 0.66666666666666663

console.log(cl.weightedprob('money', 'good', cl.fprob)); // => 0.25
docclass.sampletrain(cl);
console.log(cl.weightedprob('money', 'good', cl.fprob)); // => 0.16666666666666666
