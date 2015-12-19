var fs = require('fs')
var rl = require('readline')
var mkdirp = require('mkdirp')
var S = require('string')
var spawn = require('child_process').spawn

var inStream = rl.createInterface({
	input: fs.createReadStream('MSR_Sentence_Completion_Challenge_V1/Data/Holmes.machine_format.questions.txt'),
	terminal: false
})
var index = 0
var prime = ''
var words = ''
inStream.on('line', function(line) {
	prime = line.substring(line.indexOf(')') + 2, line.indexOf('['))
	words += ' ' + line.substring(line.indexOf('[') + 1, line.indexOf(']'))

	index++
	if (index % 5 == 0) {
		//console.log(prime)
		//console.log(words)
		//var child = spawn('th', ['msr.lua', 'data/cv/lm_lstm_epoch17.00_1.2769.t7', '-primetext', prime, '-goal', words, '-id', (index/5)])
		var child = spawn('th', ['msr.lua', 'data2/cv/lm_lstm_epoch25.64_1.4471.t7', '-primetext', prime, '-goal', words, '-id', (index/5)])

		child.stdout.on('data', function(data) {
			console.log(data)
		})
		child.stderr.on('data', function(data) {
			console.log(data)
		})
		child.on('close', function() {
			console.log('Child done')
		})

		words = ''
		prime = ''
	}
})
inStream.on('close', function() {
	outStream.end()
	working = false
	console.log('finished')
})
//th msr.lua data/cv/lm_lstm_epoch6.61_1.3596.t7 -primetext "Hello" -goal "Nope toast"
//17.00_1.2769.t7
//25.64_1.4471
