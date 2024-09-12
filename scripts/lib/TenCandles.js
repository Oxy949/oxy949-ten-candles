export class TenCandles {
  
  static init() {

  }

  static checkTimer(startedTime, burnFinalTime, checkEverySecTemp) {

    let timeElapsed = (Date.now() - startedTime) / 1000; // Время в секундах

    console.log("Прощло секунд " + timeElapsed);
    //console.log("Свеча потухла спустя " + timeElapsed.toFixed(2) + " секунд.");
    game.abouttime.doIn({ second: checkEverySecTemp}, checkTimer, startedTime, burnFinalTime, checkEverySecTemp);
  }

  static startTimer(minBurnTime = 10, maxBurnTime = 30, checkEverySec = 1) {

    // Генерируем случайное время в пределах минимального и максимального времени
    let burnTime = Math.floor(Math.random() * (maxBurnTime - minBurnTime + 1)) + minBurnTime;

    console.log(`Свеча будет гореть в течение ${burnTime} секунд.`);


    let startTime = Date.now();
    checkTimer(startTime, burnTime, checkEverySec);
  }
}  