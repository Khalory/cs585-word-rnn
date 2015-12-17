var fs = require('fs')
var rl = require('readline')
var mkdirp = require('mkdirp')
var S = require('string')

mkdirp.sync('../Holmes_Pure_Data')

fs.readdir('../Holmes_Training_Data', function(err, files){
	var working = false
	var cutFile = function(file){
		if (working) {
			setTimeout(cutFile.bind(undefined, file), 100)
			return
		}
		working = true
		var outStream = fs.createWriteStream('../Holmes_Pure_Data/' + file)
		console.log(file)
		var inStream = rl.createInterface({
			input: fs.createReadStream('../Holmes_Training_Data/' + file),
			terminal: false
		})
		var started = 0
		inStream.on('line', function(line) {
			//line = line.toString()
			if (started === 0) {
				if (S(line).startsWith('*END*')) {
					started = 1
					console.log('Going on')
				}
				return
			}
			if (started === -1) {
				return
			}
			if (S(line).startsWith('End of Project Gutenberg')) {
				//inStream.end()
				started = -1
				return
			}
			//console.log(line)
			outStream.write(line + '\n')
		})
		inStream.on('close', function() {
			outStream.end()
			working = false
			console.log('finished')
		})
	}
	files.forEach(cutFile)
})
