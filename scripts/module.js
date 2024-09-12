// Import TypeScript modules
import { registerSettings } from './lib/settings.js';
import { TenCandles } from './lib/TenCandles.js';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */
Hooks.once('init', async function () {
    console.log('Ten Candles | Initializing');
    // Assign custom classes and constants here

    // Register custom module settings
    registerSettings();
    // Preload Handlebars templates
    // await preloadTemplates();
    // Register custom sheets (if any)
});
let operations;

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */
Hooks.once('setup', function () {
    // Do anything after initialization but before ready
      operations = {
        test: TenCandles.test
      };

      //@ts-ignore
      game.candles = operations;
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once('ready', function () {

  //@ts-ignore
  if (game.modules.get("foundryvtt-simple-calendar").active) {
    //@ts-ignore
  } else console.warn("simple calendar not loaded");

    // emergency clearing of the queue ElapsedTime._flushQueue();
    TenCandles.init();
    // Do this until simple calendar is ready early
});

