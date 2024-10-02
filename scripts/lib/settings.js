class CandlesSettingsForm extends FormApplication {
    constructor(...args) {
        super(...args);
        this.candlesArray = game.settings.get('oxy949-ten-candles', 'candlesArray');
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "candles-settings-form",
            title: "Candles Lights Settings",
            template: "modules/oxy949-ten-candles/templates/settings-form.html",
            width: 500,
            height: "auto",
            closeOnSubmit: true
        });
    }

    getData() {
        return {
            candles: this.candlesArray,
            audioPaths: this.audioSettings
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Обработчик для добавления новой свечи
        html.find("#add-candle").click(() => {
            this.candlesArray.push([]);
            this.render();
        });

        // Обработчик для удаления свечи
        html.find(".remove-candle").click(ev => {
            const index = ev.currentTarget.dataset.index;
            this.candlesArray.splice(index, 1);
            this.render();
        });
    }

    async _updateObject(event, formData) {
        // Преобразуем данные формы в нужные форматы
        const updatedCandlesArray = Object.keys(formData)
            .filter(key => key.startsWith('candle-'))
            .map(key => formData[key].split(',').map(id => id.trim()));

        // Сохраняем обновленный массив свечей в настройках модуля
        await game.settings.set('oxy949-ten-candles', 'candlesArray', updatedCandlesArray);

        // Сохраняем обновленные пути аудио в настройках модуля
        const audioPaths = {
            burnPaper: formData["audio-burnPaper"],
            candleLight: formData["audio-candleLight"],
            candleBlow: formData["audio-candleBlow"]
        };
    }
}


export const registerSettings = function() {
	// Register any custom module settings here
	let modulename = "oxy949-ten-candles";

	game.settings.register(modulename, 'candlesConfigPath', {
		name: "Candles Config File Path",
		hint: "Specify the path to the JSON file containing candle and bowl UUIDs.",
		scope: 'world',
		config: true,
		type: String,
		default: 'modules/'+modulename+'/candlesConfig.json', // Укажи путь по умолчанию
		filePicker: true, // Позволяет выбрать файл через интерфейс Foundry
        requiresReload: true
	  });

	/*
	game.settings.registerMenu(modulename, 'candlesMenu', {
        name: "Candles Lights UUID\'s",
        label: "Configure candles",
        hint: "Open the window to configure candle light settings.",
        icon: "fas fa-candle-holder",
        type: CandlesSettingsForm,
        restricted: true
    });
	
	// Регистрация настройки для массива чаши
	game.settings.register(modulename, 'bowlArray', {
	  name: 'Bowl Lights UUID\'s',
	  hint: 'Enter an array of identifiers for the bowl.',
	  scope: 'world',
	  config: true,
	  type: Array,
	  default: ["TlN6Vd0IbZ4JUXUS", "p8tV1sHQgpnKqYGX", "0SU38BAtAayGA7ID"]
	});
	*/

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

	// Минимальное время горения свечи
	game.settings.register(modulename, 'minCandleBurnTime', {
		name: 'Minimum Candle Burn Time',
		hint: 'The minimum time a candle will burn (in seconds).',
		scope: 'world',    // Настройка для всей игры
		config: true,      // Отображение в интерфейсе
		type: Number,      // Тип данных - число
		default: 3600       // Значение по умолчанию (например, 60 секунд)
	  });
	
	  // Максимальное время горения свечи
	  game.settings.register(modulename, 'maxCandleBurnTime', {
		name: 'Maximum Candle Burn Time',
		hint: 'The maximum time a candle will burn (in seconds).',
		scope: 'world',
		config: true,
		type: Number,
		default: 10800      // Значение по умолчанию (например, 300 секунд)
	  });

	  // Максимальное время горения свечи
	  game.settings.register(modulename, 'checkCandleExtinguish', {
		name: 'Candle Randomized Extinguishing Check Time',
		hint: 'For randomized extinguishing, we check for chance every THIS second.',
		scope: 'world',
		config: true,
		type: Number,
		default: 60      // Значение по умолчанию (например, 60 секунд)
	  });

	  // Максимальное время горения свечи
	  game.settings.register(modulename, 'bowlBurnTime', {
		name: 'Bowl Burn Time',
		hint: 'The maximum time a bolw will burn (in seconds).',
		scope: 'world',
		config: true,
		type: Number,
		default: 20      // Значение по умолчанию (например, 300 секунд)
	  });

	  game.settings.register(modulename, 'playerSuccessesTableUUID', {
		name: "Player Successes Table UUID",
		hint: "The UUID of the table used for player successes.",
		scope: 'world',
		config: true,
		type: String,
		default: 'RollTable.EPikqOlVc9kH5W4Z' // Укажи путь по умолчанию
	  });

	  game.settings.register(modulename, 'playerFailureTableUUID', {
		name: "Player Failures Table UUID",
		hint: "The UUID of the table used for player failures.",
		scope: 'world',
		config: true,
		type: String,
		default: 'RollTable.QulbF0kweM0fLYeR' // Укажи путь по умолчанию
	  });

	  game.settings.register(modulename, 'gmSuccessesTableUUID', {
		name: "GM Successes Table UUID",
		hint: "The UUID of the table used for GM successes.",
		scope: 'world',
		config: true,
		type: String,
		default: 'RollTable.MYGlgDUYhDefkaka' // Укажи путь по умолчанию
	  });

	  game.settings.register(modulename, 'gmFailureTableUUID', {
		name: "GM Failures Table UUID",
		hint: "The UUID of the table used for GM failures.",
		scope: 'world',
		config: true,
		type: String,
		default: 'RollTable.rEQuJVcuEaKpZvE5' // Укажи путь по умолчанию
	  });

	game.settings.register(modulename, "updateSceneDarkness", {
		name: "Change Scene Darkness",
		hint: "Update scene darkness level from 0.5 to 1",
		scope: "world",
		config: true,
		type: Boolean,
		default: true,
		requiresReload: true
	});

	game.settings.register(modulename, "candleTimers", {
        name: "Candle Timers",
        scope: "world",
        config: false,  // Не показывать в интерфейсе настроек
        type: Object, 
        default: {}
    });
}
