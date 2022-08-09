import { assign, createMachine } from "xstate";

export interface GameSettings {
  numberOfButtons: number;
  maxUnclickedFlashes: number;
  minTimeout: number;
  maxTimeout: number;
}

export interface GameState {
  flashedButtons: number[];
  score: number;
}

const commonGameSettings = {
  minTimeout: 200,
  maxTimeout: 2000,
  maxUnclickedFlashes: 10,
};

export const classicGameSettings: GameSettings = {
  ...commonGameSettings,
  numberOfButtons: 4,
};

export const easyGameSettings: GameSettings = {
  ...commonGameSettings,
  maxTimeout: 3000,
  maxUnclickedFlashes: 1000000,
  numberOfButtons: 3,
};

export const matrixGameSettings: GameSettings = {
  ...commonGameSettings,
  numberOfButtons: 20,
};

export const rapidGameSettings: GameSettings = {
  ...commonGameSettings,
  minTimeout: 100,
  maxTimeout: 500,
  maxUnclickedFlashes: 4,
  numberOfButtons: 3,
};

export const gameMachine = createMachine(
  {
    predictableActionArguments: true,
    schema: {
      context: {} as {
        gameSettings: GameSettings;
        gameState: GameState;
      },
      events: {} as
        | { type: "START"; gameSettings: GameSettings }
        | { type: "FLASH" }
        | { type: "CLICK"; button: number }
        | { type: "RESET" },
    },
    id: "gameMachine",
    context: {
      gameSettings: classicGameSettings,
      gameState: {
        flashedButtons: [],
        score: 0,
      },
    },
    initial: "initial",
    states: {
      initial: {
        entry: "clearTimeouts",
        on: {
          START: {
            actions: "setGameSettings",
            target: "running",
          },
        },
      },
      running: {
        entry: "resetGameState",
        always: [
          {
            cond: "tooManyUnclickedFlashes",
            target: "gameOver",
          },
        ],
        invoke: {
          src:
            ({ gameSettings }) =>
            (send) => {
              const id = setTimeout(() => {
                timer(
                  () =>
                    send({
                      type: "FLASH",
                    }),
                  gameSettings.minTimeout,
                  gameSettings.maxTimeout
                );
              }, 1000);

              return () => clearTimeout(id);
            },
        },
        on: {
          FLASH: {
            actions: "flashButton",
          },
          CLICK: [
            {
              cond: "clickValid",
              actions: "handleValidClick",
            },
            {
              target: "gameOver",
            },
          ],
        },
      },
      gameOver: {
        entry: "clearTimeouts",
        on: {
          START: {
            actions: "setGameSettings",
            target: "running",
          },
        },
      },
    },
    on: {
      RESET: {
        actions: ["clearTimeouts", "resetGameState"],
        target: "initial",
      },
    },
  },
  {
    actions: {
      setGameSettings: assign(({ gameSettings }, event) => ({
        gameSettings:
          event.type === "START" ? event.gameSettings : gameSettings,
      })),
      resetGameState: assign(({ gameState }) => ({
        gameState: {
          ...gameState,
          flashedButtons: [],
          score: 0,
        },
      })),
      flashButton: assign(({ gameSettings, gameState }, event) => ({
        gameState: {
          ...gameState,
          flashedButtons:
            event.type === "FLASH"
              ? [
                  ...gameState.flashedButtons,
                  getRandomButton(
                    gameSettings.numberOfButtons,
                    gameState.flashedButtons.at(-1)
                  ),
                ]
              : gameState.flashedButtons,
        },
      })),
      handleValidClick: assign(({ gameState }) => ({
        gameState: {
          ...gameState,
          flashedButtons: gameState.flashedButtons.slice(1),
          score: gameState.score + 1,
        },
      })),
      clearTimeouts: () => {
        let id = window.setTimeout(() => undefined, 0);

        while (id--) {
          window.clearTimeout(id);
        }
      },
    },
    guards: {
      tooManyUnclickedFlashes: ({ gameSettings, gameState }) =>
        gameState.flashedButtons.length > gameSettings.maxUnclickedFlashes,
      clickValid: ({ gameState }, event) =>
        event.type === "CLICK" &&
        gameState.flashedButtons.length > 0 &&
        gameState.flashedButtons[0] === event.button,
    },
  }
);

function getRandomButton(
  numberOfButtons: number,
  disallowedButton?: number
): number {
  const randomButton = Math.ceil(Math.random() * numberOfButtons);

  if (randomButton === disallowedButton) {
    return getRandomButton(numberOfButtons, disallowedButton);
  }

  return randomButton;
}

function timer(func: () => void, minTimeout: number, maxTimeout: number) {
  func();

  const timeout = getTimeoutLength(minTimeout, maxTimeout);

  const id = setTimeout(() => {
    timer(func, minTimeout, timeout);
  }, timeout);

  return () => clearTimeout(id);
}

function getTimeoutLength(minTimeout: number, maxTimeout: number) {
  const subtrahend =
    maxTimeout > 1500
      ? maxTimeout * 0.1
      : maxTimeout > 1000
      ? maxTimeout * 0.05
      : maxTimeout * 0.02;
  const timeout = maxTimeout - subtrahend;

  return Math.max(minTimeout, timeout);
}
