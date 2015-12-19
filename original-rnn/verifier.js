var fs = require('fs')
var rl = require('readline')

var answers = []
var answerStream = rl.createInterface({
	input: fs.createReadStream('MSR_Sentence_Completion_Challenge_V1/Data/Holmes.machine_format.answers.txt'),
	terminal: false
})
var i = 0
answerStream.on('line', function(line) {
	var num = parseInt(line.substring(0, line.indexOf(')') - 1))
	answers[num] = line.substring(line.indexOf('[') + 1, line.indexOf(']'))
})

var total = 0
var correct = 0

answerStream.on('close', function() {
	var waitFor = 0
	var working = true
	fs.readdir('results/', function(err, files){
		files.forEach(function(file) {	
			waitFor += 1
			var inStream = rl.createInterface({
				input: fs.createReadStream('results/' + file),
				terminal: false
			})
			var best = ''
			var greatestNum = -999999
			var answerNum = parseInt(file.substring(0, file.indexOf('.')))
			var answer = answers[answerNum]

			inStream.on('line', function(line) {
				var num = parseFloat(line.substring(line.indexOf(':') + 1))
				if (num > greatestNum) {
					best = line.substring(0, line.indexOf(':'))
					greatestNum = num
				}
			})
			inStream.on('close', function() {
				working = false
				if (best == answer) {
					console.log('Correct: ' + answerNum)
					correct += 1
				}
				else {
					console.log('Wrong: ' + answerNum)
					console.log(answer + ' != ' + best)
				}
				total += 1
				waitFor -= 1
			})
		})
	})
	var finish = function() {
		if (waitFor != 0 || working) {
			setTimeout(finish, 25)
			return
		}
		console.log(correct + ' / ' + total)
	}
	finish()
})
