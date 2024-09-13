export class TenCandles {
  
  static init() {

  }

  static startTimer(minBurnTime = 10, maxBurnTime = 30, checkEverySec = 1) {
    // Генерируем случайное время в пределах минимального и максимального времени
    const burnTime = Math.floor(Math.random() * (maxBurnTime - minBurnTime + 1)) + minBurnTime;

    console.log(`Свеча будет гореть в течение ${burnTime} секунд.`);

    // Определяем функцию checkTime
    function checkTime(startedTime, burnFinalTime, checkEverySecTemp) {
      let timeElapsed = (Date.now() - startedTime) / 1000; // Время в секундах

      console.log("Прошло секунд " + timeElapsed);

      // Проверяем, потухла ли свеча
      if (timeElapsed >= burnFinalTime) {
        console.log("Свеча потухла спустя " + timeElapsed.toFixed(2) + " секунд.");
        return; // Прекращаем выполнение дальнейших проверок
      }

      // Повторный вызов функции
      abouttime.doIn({ second: checkEverySecTemp }, checkTime, startedTime, burnFinalTime, checkEverySecTemp);
    }

    // Устанавливаем начальное время
    let startTime = Date.now();

    // Запускаем таймер
    abouttime.doIn({ second: minBurnTime }, checkTime, startTime, burnTime, checkEverySec);
  }

  static interact(args) {
    // Получение настроек путей к аудиофайлам
    const audioPathBurnPaper = game.settings.get('oxy949-ten-candles', 'audioPathBurnPaper');
    const audioPathCandleLight = game.settings.get('oxy949-ten-candles', 'audioPathCandleLight');
    const audioPathCandleBlow = game.settings.get('oxy949-ten-candles', 'audioPathCandleBlow');

    // Получение массивов свечей и чаши из настроек модуля
    const candles = game.settings.get('oxy949-ten-candles', 'candlesArray');
    const bowl = game.settings.get('oxy949-ten-candles', 'bowlArray');

    // Функция воспроизведения аудио с заданными параметрами
    function playAudio(audioPath, volume = 1.0) {
      AudioHelper.play({
        src: audioPath,
        volume: volume,
        loop: false,
        autoplay: true,
        fade: 0,
      });
    }

    // Функция для включения/выключения свечи или чаши
    async function toggleLight(lightIds, isBowl = false) {
      // Определяем статус свечи (включена/выключена)
      let lightStatus = canvas.lighting.placeables.find(light => light.id === lightIds[0]).document.hidden;
      
      // Получаем количество свечей
      let candleDrawing = canvas.drawings.placeables.find(drawing => drawing.id === candleCountId);
      let candleCount = parseInt(candleDrawing.document.text);
      
      // Если свет включен, увеличиваем количество свечей, иначе уменьшаем
      if (lightStatus) {
        candleCount += 1;
    
        // Воспроизведение звука для чаши и свечей
        if (isBowl) {
          playAudio(audioPathBurnPaper, 1.0);
        } else {
          const randomPitch = Math.random() * (1.0 - 0.5) + 0.5;
          playAudio(audioPathCandleLight, randomPitch);
        }
      } else {
        candleCount -= 1;
    
        // Воспроизведение звука только для свечей
        if (!isBowl) {
          const randomPitch = Math.random() * (1.0 - 0.5) + 0.5;
          playAudio(audioPathCandleBlow, randomPitch);
        }
      }
    
      // Обновляем состояние свечей и текст с количеством свечей
      await canvas.lighting.updateAll({ hidden: !lightStatus }, light => lightIds.includes(light.id));
      await canvas.drawings.updateAll({ text: candleCount.toString() }, drawing => drawing.id === candleCountId);
    }
    
    // Идентификатор счетчика свечей
    let candleCountId = '2ru6zPY7s96Nf1oI';
    
    // Определяем, какой объект (свечу или чашу) нужно обработать
    if (args[0] !== "bowl") {
      toggleLight(candles[parseInt(args[0])]);
    } else {
      toggleLight(bowl, true);
    }
  }
}  