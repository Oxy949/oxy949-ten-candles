export const registerSettings = function() {
	// Register any custom module settings here
	let modulename = "oxy949-ten-candles";

	// Регистрация настроек для каждого аудиофайла с использованием FilePicker
	game.settings.register(modulename, 'audioPathBurnPaper', {
		name: 'Path to Bowl burn Audio',
		hint: 'Enter the audio file path.',
		scope: 'world',
		config: true,
		type: String,
		filePicker: 'audio', // Включаем FilePicker для выбора файлов
		default: 'modules/'+modulename+'/assets/sfx/burning-paper.mp3',
	});

	game.settings.register(modulename, 'audioPathCandleLight', {
		name: 'Path to candle on Audio',
		hint: 'Enter the audio file path.',
		scope: 'world',
		config: true,
		type: String,
		filePicker: 'audio', // Включаем FilePicker для выбора файлов
		default: 'modules/'+modulename+'/assets/sfx/candle-light.mp3',
	});

	game.settings.register(modulename, 'audioPathCandleBlow', {
		name: 'Path to candle off Audio',
		hint: 'Enter the audio file path.',
		scope: 'world',
		config: true,
		type: String,
		filePicker: 'audio', // Включаем FilePicker для выбора файлов
		default: 'modules/'+modulename+'/assets/sfx/candle-blow.mp3',
	});

	// Регистрация настройки для массива свечей
	game.settings.register(modulename, 'candlesArray', {
		name: 'Candles Lights',
		hint: 'Enter arrays of lights identifiers for each candle.',
		scope: 'world',
		config: true,
		type: Array,
		default: [
		  ["XUPTh4rT6iM2IH6h", "CbFMbnPk12K7ZPWU"],
		  ["6YE9S50sHciN2HHj", "43U9wUydN9rf5y9v"],
		  ["4LtRBthYK3Yv0PoX", "KKs6jupYdEWpdWEt"],
		  ["9zJEqE3IfGpmfYPA", "SzFybV75900CVteF"],
		  ["RnuJBSyPKfoxMV9u", "0XAQ42ZGrYz2HuUT"],
		  ["Gcl9vsbwXZT2Kayh", "daF9FaAXm4nhfOzp"],
		  ["MtLp5ZerEWBPkL2A", "JOCACVmAPgi946PQ"],
		  ["5qy3z9XGOqs1C8aN", "WkIZ6io8z8XBiZE5"],
		  ["XMxZRti0ZH7nM1T8", "KMXOFV1GwHpC2rmg"],
		  ["ADIgSBglENlsWljJ", "PP6XWuSLiXw3jhOw"]
		],
        requiresReload: true
	  });
	
	  // Регистрация настройки для массива чаши
	  game.settings.register(modulename, 'bowlArray', {
		name: 'Bowl Lights',
		hint: 'Enter an array of identifiers for the bowl.',
		scope: 'world',
		config: true,
		type: Array,
		default: ["TlN6Vd0IbZ4JUXUS", "p8tV1sHQgpnKqYGX", "0SU38BAtAayGA7ID"],
        requiresReload: true
	  });
}
