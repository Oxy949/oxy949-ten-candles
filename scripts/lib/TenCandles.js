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
}  