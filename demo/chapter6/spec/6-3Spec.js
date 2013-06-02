var docclass = new DocClass();
var cl = new docclass.Classifier(docclass.getwords);

cl.train('the quick brown fox jumps over the lazy dog', 'good');
cl.train('make quick money in the online casino', 'bad');

// console.log("cl.fcount('quick', 'good'): " + cl.fcount('quick', 'good')); // => 1.0
// console.log("cl.fcount('quick', 'bad'): " + cl.fcount('quick', 'bad')); // => 1.0

var result = "cl.fcount('quick', 'good'): " + cl.fcount('quick', 'good') + "\n";
result += "cl.fcount('quick', 'bad'): " + cl.fcount('quick', 'bad') + '\n';
$('#result').val(result);
