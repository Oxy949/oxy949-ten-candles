export class TenCandles {
  
  static init() {

  }

  static startTimer(candleId, minBurnTime = 10, maxBurnTime = 30, checkEverySec = 1) {
    // Генерируем случайное время в пределах минимального и максимального времени
    const burnTime = Math.floor(Math.random() * (maxBurnTime - minBurnTime + 1)) + minBurnTime;

    console.log(`Свеча будет гореть в течение ${burnTime} секунд.`);

    // Определяем функцию checkTime
    function checkTime(candleIdTemp, startedTime, burnFinalTime, checkEverySecTemp) {
      let timeElapsed = (Date.now() - startedTime) / 1000; // Время в секундах

      console.log("Прошло секунд " + timeElapsed);

      // Проверяем, потушена ли уже свеча
      if (!game.candles.isCandleLit(candleIdTemp)){
        return; // Прекращаем выполнение дальнейших проверок
      }


      // Проверяем, потухла ли свеча
      if (timeElapsed >= burnFinalTime) {
        console.log("Свеча потухла спустя " + timeElapsed.toFixed(2) + " секунд.");
        game.candles.interact([candleIdTemp], false);
        return; // Прекращаем выполнение дальнейших проверок
      }

      // Повторный вызов функции
      abouttime.doIn({ second: checkEverySecTemp }, checkTime, candleIdTemp, startedTime, burnFinalTime, checkEverySecTemp);
    }

    // Устанавливаем начальное время
    let startTime = Date.now();

    // Запускаем таймер
    abouttime.doIn({ second: minBurnTime }, checkTime, candleId, startTime, burnTime, checkEverySec);
  }

  
  static isCandleLit(candleID) {
    // Получение массивов свечей и чаши из настроек модуля
    /*const candles = game.settings.get('oxy949-ten-candles', 'candlesArray');
    const bowl = game.settings.get('oxy949-ten-candles', 'bowlArray');*/
    let candles = [
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
    let bowl = ["TlN6Vd0IbZ4JUXUS","p8tV1sHQgpnKqYGX","0SU38BAtAayGA7ID"];
    let candleCountId = '2ru6zPY7s96Nf1oI';

    let id = "";
    if (candleID === "bowl")
    {
      id = bowl;
    }
    else
    {
      id = candles[candleID];
    }
    let currentLightStatus = canvas.lighting.placeables.find(light => light.id === id[0]).document.hidden;
    return !currentLightStatus;
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
    let candles = [
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
    let bowl = ["TlN6Vd0IbZ4JUXUS","p8tV1sHQgpnKqYGX","0SU38BAtAayGA7ID"];
    let candleCountId = '2ru6zPY7s96Nf1oI';

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
    async function toggleLight(candleId, lightIds, isBowl = false, desiredStatus = 'toggle') {
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
      if (currentLightStatus === targetLightStatus) return;

      // Получаем количество свечей
      let candleDrawing = canvas.drawings.placeables.find(drawing => drawing.id === candleCountId);
      let candleCount = parseInt(candleDrawing.document.text);

      // Если требуется включить свет
      if (targetLightStatus) {
        candleCount += 1;

        let minCandleBurnTime = game.settings.get('oxy949-ten-candles', 'minCandleBurnTime');
        let maxCandleBurnTime = game.settings.get('oxy949-ten-candles', 'maxCandleBurnTime');
        let bowlBurnTime = game.settings.get('oxy949-ten-candles', 'bowlBurnTime');
        let checkCandleExtinguish = game.settings.get('oxy949-ten-candles', 'checkCandleExtinguish');

        Hooks.callAll("oxy949-ten-candles.lit", candleId);
        // Воспроизведение звука для чаши и свечей
        if (isBowl) {
          game.candles.startTimer(candleId, bowlBurnTime, bowlBurnTime, bowlBurnTime);
          playAudio(game.settings.get('oxy949-ten-candles', 'audioPathBurnPaper'), 1.0);
        } else {
          game.candles.startTimer(candleId, minCandleBurnTime, maxCandleBurnTime, checkCandleExtinguish);
          const randomPitch = Math.random() * (1.0 - 0.5) + 0.5;
          playAudio(game.settings.get('oxy949-ten-candles', 'audioPathCandleLight'), randomPitch);
        }
      } else {
        candleCount -= 1;

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
      await canvas.lighting.updateAll({ hidden: !targetLightStatus }, light => lightIds.includes(light.id));
      await canvas.drawings.updateAll({ text: candleCount.toString() }, drawing => drawing.id === candleCountId);
    }
    
    // Определяем, какой объект (свечу или чашу) нужно обработать
    if (args[0] !== "bowl") {
      toggleLight(parseInt(args[0]), candles[parseInt(args[0])], false, desiredState);
    } else {
      toggleLight("bowl", bowl, true, desiredState);
    }
  }
}  