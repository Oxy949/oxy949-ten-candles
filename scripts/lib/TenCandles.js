export class TenCandles {

  static candlesSceneUUID = "Scene.6bENLGOkD71GzMG4";
  static candlesUUIDs = [
    ["XUPTh4rT6iM2IH6h","CbFMbnPk12K7ZPWU"],
    ["6YE9S50sHciN2HHj","43U9wUydN9rf5y9v"],
    ["4LtRBthYK3Yv0PoX","KKs6jupYdEWpdWEt"],
    ["9zJEqE3IfGpmfYPA","SzFybV75900CVteF"],
    ["RnuJBSyPKfoxMV9u","0XAQ42ZGrYz2HuUT"],
    ["Gcl9vsbwXZT2Kayh","daF9FaAXm4nhfOzp"],
    ["MtLp5ZerEWBPkL2A","JOCACVmAPgi946PQ"],
    ["5qy3z9XGOqs1C8aN","WkIZ6io8z8XBiZE5"],
    ["XMxZRti0ZH7nM1T8","KMXOFV1GwHpC2rmg"],
    ["ADIgSBglENlsWljJ","PP6XWuSLiXw3jhOw"]
  ];
  static bowlUUIDs = ["TlN6Vd0IbZ4JUXUS","p8tV1sHQgpnKqYGX","0SU38BAtAayGA7ID"];
  static playerDiceCountTextUUID = "KSonnDd7CnBOuF2I";
  static gmDiceCountTextUUID = "CUo0X0jXWTR5Je7E";
  
  static async init() {
    const configPath = game.settings.get('oxy949-ten-candles', 'candlesConfigPath');

    try {
      const response = await fetch(configPath);
      if (!response.ok) {
        throw new Error(`Не удалось загрузить конфиг: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Загружены данные свечей и чаши: ", data);
      
      // Обновляем массивы UUID
      this.candlesUUIDs = data.candlesUUIDs;
      this.bowlUUIDs = data.bowlUUIDs;
      this.playerDiceCountTextUUID = data.playerDiceCountTextUUID;
      this.gmDiceCountTextUUID = data.gmDiceCountTextUUID;
      this.candlesSceneUUID = data.candlesSceneUUID;

      // Обновляем массивы UUID
      game.candles.candlesUUIDs = this.candlesUUIDs;
      game.candles.bowlUUIDs = this.bowlUUIDs;
      game.candles.playerDiceCountTextUUID = this.playerDiceCountTextUUID;
      game.candles.gmDiceCountTextUUID = this.gmDiceCountTextUUID;
      game.candles.candlesSceneUUID = this.candlesSceneUUID;

    } catch (error) {
      console.error("Ошибка при загрузке файла JSON:", error);
    }
  }

  static startTimer(candleId, minBurnTime = 10, maxBurnTime = 30, checkEverySec = 1) {
    // Генерируем случайное время в пределах минимального и максимального времени
    //const burnTime = Math.floor(Math.random() * (maxBurnTime - minBurnTime + 1)) + minBurnTime;

    console.log(`Свеча будет гореть в течение [${minBurnTime}-${maxBurnTime}] секунд.`);

    // Определяем функцию checkTime
    function checkTime(candleIdTemp, startedTime, burnMinTime, burnFinalTime, checkEverySecTemp) {
      let timeElapsed = (Date.now() - startedTime) / 1000; // Время в секундах

      if (game.candles.isCandlesScene())
      {
        // Проверяем, потушена ли уже свеча
        if (!game.candles.isCandleLit(candleIdTemp)){
          return; // Прекращаем выполнение дальнейших проверок
        }

        // Проверяем, потухла ли свеча
        if (timeElapsed >= burnFinalTime) {
          console.log(`Свеча ${candleIdTemp} потухла спустя ` + timeElapsed.toFixed(2) + " секунд.");
          game.candles.interact([candleIdTemp], false);
          return; // Прекращаем выполнение дальнейших проверок
        }

        
        if (timeElapsed >= burnMinTime) {
          console.log(`${candleIdTemp} Прошло секунд гарения: ` + timeElapsed);

          // Рассчитываем вероятность экспоненциального затухания с учетом минимального времени
          let adjustedTimeElapsed = timeElapsed - burnMinTime; // Время после минимального времени горения
          let adjustedMaxBurnTime = burnFinalTime - burnMinTime; // Время между минимальным и финальным
          let timeRatio = adjustedTimeElapsed / adjustedMaxBurnTime; // Нормализованное время от 0 до 1
          let extinguishChance = 1 - Math.exp(-timeRatio * 3); // Экспоненциальная формула вероятности
          
          console.log(`Шанс затухания: ${(extinguishChance * 100).toFixed(2)}%`);

          // Случайное затухание на основе вычисленного шанса
          if (Math.random() < extinguishChance) {
            console.log("Свеча затухла случайно спустя " + timeElapsed.toFixed(2) + " секунд.");
            game.candles.interact([candleIdTemp], false);
            return; // Прекращаем выполнение дальнейших проверок
          }
        }
      }

      const status = SimpleCalendar.api.clockStatus();
      if (!status.started && !game.paused)
        SimpleCalendar.api.startClock();
      // Повторный вызов функции
      abouttime.doIn({ second: checkEverySecTemp }, checkTime, candleIdTemp, startedTime, burnMinTime, burnFinalTime, checkEverySecTemp);
    }

    // Устанавливаем начальное время
    let startTime = Date.now();

    // Запускаем таймер
    const status = SimpleCalendar.api.clockStatus();
    if (!status.started && !game.paused)
      SimpleCalendar.api.startClock();
    abouttime.doIn({ second: checkEverySec }, checkTime, candleId, startTime, minBurnTime, maxBurnTime, checkEverySec);
  }

  static isCandlesScene() {
    const activeScene = game.scenes.active; // Получаем активную сцену
    return activeScene && activeScene.uuid === game.candles.candlesSceneUUID; // Сравниваем UUID активной сцены с нужным
  }
  
  static isCandleLit(candleID) {
    // Получение массивов свечей и чаши из настроек модуля
    /*const candles = game.settings.get('oxy949-ten-candles', 'candlesArray');
    const bowl = game.settings.get('oxy949-ten-candles', 'bowlArray');*/

    let id = "";
    if (candleID === "bowl")
    {
      id = this.bowlUUIDs;
    }
    else
    {
      id = game.candles.candlesUUIDs[candleID];
    }
    let currentLightStatus = canvas.lighting.placeables.find(light => light.id === id[0]).document.hidden;
    return !currentLightStatus;
  }

  static countLitCandles() {
    // Получение массивов свечей и чаши из настроек модуля
    /*const candles = game.settings.get('oxy949-ten-candles', 'candlesArray');
    const bowl = game.settings.get('oxy949-ten-candles', 'bowlArray');*/

    let litCandleCount = 0; // Счетчик горящих свечей

  // Проходим по всем свечам
  for (let i = 0; i < game.candles.candlesUUIDs.length; i++) {
    if (game.candles.isCandleLit(i)) { // Если свеча горит
      litCandleCount++; // Увеличиваем счетчик
    }
  }

  console.log(`Количество горящих свечей: ${litCandleCount}`);
  return litCandleCount; // Возвращаем количество горящих свечей
  }

  static interact(args, desiredState = 'toggle') {
    // Получение настроек путей к аудиофайлам
    const audioPathBurnPaper = game.settings.get('oxy949-ten-candles', 'audioPathBurnPaper');
    const audioPathCandleLight = game.settings.get('oxy949-ten-candles', 'audioPathCandleLight');
    const audioPathCandleBlow = game.settings.get('oxy949-ten-candles', 'audioPathCandleBlow');

    // Получение массивов свечей и чаши из настроек модуля
    /*
    const candles = game.settings.get('oxy949-ten-candles', 'candlesArray');
    const bowl = game.settings.get('oxy949-ten-candles', 'bowlArray');
    */

    // Функция воспроизведения аудио с заданными параметрами
    function playAudio(audioPath, volume = 1.0) {
      foundry.audio.AudioHelper.play({
        src: audioPath,
        volume: volume,
        loop: false,
        autoplay: true,
        fade: 0,
      });
    }

    // Функция для включения/выключения свечи или чаши
    async function toggleLight(candleId, objIds, isBowl = false, desiredStatus = 'toggle') {
      // Получаем текущее состояние света
      let currentLightStatus = game.candles.isCandleLit(candleId);
      let targetLightStatus;

      // Определяем целевой статус в зависимости от переданного параметра
      if (desiredStatus === 'toggle') {
        targetLightStatus = !currentLightStatus; // Инвертируем текущий статус
      } else {
        targetLightStatus = desiredStatus; // desiredStatus (false) = потушить
      }

      // Если состояние не изменяется, выход из функции
      if (currentLightStatus === targetLightStatus)
        return;

      // Если требуется включить свет
      if (targetLightStatus) {

        let minCandleBurnTime = game.settings.get('oxy949-ten-candles', 'minCandleBurnTime');
        let maxCandleBurnTime = game.settings.get('oxy949-ten-candles', 'maxCandleBurnTime');
        let bowlBurnTime = game.settings.get('oxy949-ten-candles', 'bowlBurnTime');
        let checkCandleExtinguish = game.settings.get('oxy949-ten-candles', 'checkCandleExtinguish');

        Hooks.callAll("oxy949-ten-candles.lit", candleId);
        // Воспроизведение звука для чаши и свечей
        if (isBowl) {
          game.candles.startTimer(candleId, bowlBurnTime, bowlBurnTime, 1);
          playAudio(game.settings.get('oxy949-ten-candles', 'audioPathBurnPaper'), 1.0);
        } else {
          game.candles.startTimer(candleId, minCandleBurnTime, maxCandleBurnTime, checkCandleExtinguish);
          const randomPitch = Math.random() * (1.0 - 0.5) + 0.5;
          playAudio(game.settings.get('oxy949-ten-candles', 'audioPathCandleLight'), randomPitch);
        }
      } else {
        // Воспроизведение звука только для свечей
        if (!isBowl) {
          Hooks.callAll("oxy949-ten-candles.done", candleId);
          const randomPitch = Math.random() * (1.0 - 0.5) + 0.5;
          playAudio(game.settings.get('oxy949-ten-candles', 'audioPathCandleBlow'), randomPitch);
        }
        else{
          Hooks.callAll("oxy949-ten-candles.done", "bowl");
        }
      }

      // Обновляем состояние свечей и текст с количеством свечей
      canvas.lighting.updateAll({ hidden: !targetLightStatus }, light => objIds.includes(light.id));
      canvas.tiles.updateAll({ hidden: !targetLightStatus }, tile => objIds.includes(tile.id));
    }
    
    // Определяем, какой объект (свечу или чашу) нужно обработать
    if (args[0] !== "bowl") {
      toggleLight(parseInt(args[0]), game.candles.candlesUUIDs[parseInt(args[0])], false, desiredState);
    } else {
      toggleLight("bowl", game.candles.bowlUUIDs, true, desiredState);
    }
  }

  static async roll(player, withHope) {
    // Функция выбора случайного сообщения из таблицы
    const getRandomMessageFromTable = async (tableUUID) => {
      const table =  game.tables.find(t => t.uuid === tableUUID);
      if (table) {
        const roll = await table.roll();
        return roll.results[0].text; // Получаем текст первого результата
      }
      return "";
    };

    let dicepoolPlayer = game.candles.playerDiceCountTextUUID;
    let dicepoolGM = game.candles.gmDiceCountTextUUID;

    let playerSuccessesTable = game.settings.get('oxy949-ten-candles', 'playerSuccessesTableUUID');
    let playerFailureTable = game.settings.get('oxy949-ten-candles', 'playerFailureTableUUID');
    let gmSuccessesTable = game.settings.get('oxy949-ten-candles', 'gmSuccessesTableUUID');
    let gmFailureTable = game.settings.get('oxy949-ten-candles', 'gmFailureTableUUID');

    let diceCountPlayers = parseInt(canvas.drawings.placeables[canvas.drawings.placeables.findIndex(drawing => drawing.id === dicepoolPlayer)].document.text);
    let diceCountGM = parseInt(canvas.drawings.placeables[canvas.drawings.placeables.findIndex(drawing => drawing.id === dicepoolGM)].document.text);

    let successes = 0;
    let failures = 0;
    let rollMessage = 'Проверка повествования...';

    let diceCount = player ? diceCountPlayers : diceCountGM;
    let roll = await new Roll(`${diceCount}d6`).evaluate({ async: true });

    if (player && withHope) {
        console.log('Rolling Hope');
        let rollHope = await new Roll('1df').evaluate({ async: true });
        if (rollHope.terms[0].results[0].result >= 1) {
            successes += 1;
        }

        let speaker = ChatMessage.getSpeaker({ actor: game.user.character });
        await rollHope.toMessage({ rollMode: 'publicroll', flavor: 'Кость Надежды:', speaker });
    }

    roll.terms[0].results.forEach(r => {
        if (r.result === 1) { failures += 1 }
        if (r.result === 6) { successes += 1 }
    });

    if (successes > 0) {
        rollMessage = player ? await getRandomMessageFromTable(playerSuccessesTable) : await getRandomMessageFromTable(gmSuccessesTable);
    } else {
        rollMessage = player ? await getRandomMessageFromTable(playerFailureTable) : await getRandomMessageFromTable(gmFailureTable);
    }

    rollMessage += "<p>";
    if (successes === 0) {
        rollMessage += `<strong style="font-size: large;">ПРОВАЛ</strong>`;
    } else {
        if (successes === 1)
            rollMessage += `<strong style="font-size: large;">УСПЕХ</strong>`;
        else {
            rollMessage += `<strong style="font-size: large;">УСПЕХ (${successes})</strong>`;
        }
    }

    let statsMessage = ``;
    if (player)
        statsMessage += `<br>"1" выпало: <strong>${failures}</strong>`;

    // Добавляем кнопку в сообщение
    let buttonId = `reduce-dice`;
    if (player && failures > 0) {  // Уникальный флаг для каждого сообщения
      statsMessage += `<button id="${buttonId}" data-failures="${failures}" style="margin-top: 10px; margin-bottom: 10px;">Убрать все "1" (${failures} шт.) из пула игроков</button>`;
  }

    let flavor = `${rollMessage}${statsMessage}</p>`;

    let speaker = ChatMessage.getSpeaker({ actor: game.user.character });
    let chatMessage = await roll.toMessage({ rollMode: 'publicroll', flavor, speaker });
  }

  static async rollGM() {
    await game.candles.roll(false);
  }

  static async rollPlayer(withHope) {
    await game.candles.roll(true, withHope);
  }

  static async removePlayerDice(count = 1) {
    let playerDiceCountId = game.candles.playerDiceCountTextUUID;
    let gmDiceCountId = game.candles.gmDiceCountTextUUID;

    let playerDiceCountDrawing = canvas.drawings.placeables[canvas.drawings.placeables.findIndex(drawing => drawing.id === playerDiceCountId)];
    let playerDiceCount = parseInt(playerDiceCountDrawing.document.text);
    let gmDiceCountDrawing = canvas.drawings.placeables[canvas.drawings.placeables.findIndex(drawing => drawing.id === gmDiceCountId)];
    let gmDiceCount = parseInt(gmDiceCountDrawing.document.text);
    canvas.drawings.updateAll({text: playerDiceCount-count}, (drawing => (drawing.id === playerDiceCountId)));
    canvas.drawings.updateAll({text: gmDiceCount+count}, (drawing => (drawing.id === gmDiceCountId)));
  }
  
  static async resetPlayerDice() {
    let playerDiceCountId = game.candles.playerDiceCountTextUUID;
    let gmDiceCountId = game.candles.gmDiceCountTextUUID;

    let playerDiceCountDrawing = canvas.drawings.placeables[canvas.drawings.placeables.findIndex(drawing => drawing.id === playerDiceCountId)];
    let playerDiceCount = parseInt(playerDiceCountDrawing.document.text);
    let gmDiceCountDrawing = canvas.drawings.placeables[canvas.drawings.placeables.findIndex(drawing => drawing.id === gmDiceCountId)];
    let gmDiceCount = parseInt(gmDiceCountDrawing.document.text);

    let candleCount = parseInt(game.candles.countLitCandles());

    canvas.drawings.updateAll({text: candleCount}, (drawing => (drawing.id === playerDiceCountId)));
    canvas.drawings.updateAll({text: (10-candleCount)}, (drawing => (drawing.id === gmDiceCountId)));
  }
}  