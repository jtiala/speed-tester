import { assign, createMachine } from "xstate";

export interface GameSettings {
  numberOfButtons: number;
  maxQueuedFlashes: number;
  minTimeout: number;
  maxTimeout: number;
}

export interface GameState {
  queuedFlashes: number[];
  lastFlash?: number;
  score: number;
}

const commonGameSettings = {
  minTimeout: 200,
  maxTimeout: 2000,
  maxQueuedFlashes: 10,
};

export const classicGameSettings: GameSettings = {
  ...commonGameSettings,
  numberOfButtons: 4,
};

export const easyGameSettings: GameSettings = {
  ...commonGameSettings,
  maxTimeout: 3000,
  maxQueuedFlashes: 1000000,
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
  maxQueuedFlashes: 4,
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
        queuedFlashes: [],
        score: 0,
      },
    },
    initial: "initial",
    states: {
      initial: {
        entry: "clearTimer",
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
            cond: "queueLimitReached",
            target: "gameOver",
          },
        ],
        invoke: {
          id: "startTimer",
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
            actions: "handleFlash",
          },
          CLICK: [
            {
              cond: "clickInvalid",
              target: "gameOver",
            },
            {
              actions: "handleClick",
            },
          ],
        },
      },
      gameOver: {
        entry: "clearTimer",
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
        target: "initial",
      },
    },
  },
  {
    actions: {
      setGameSettings: assign((context, event) => {
        if (event.type !== "START") {
          return {};
        }

        return {
          gameSettings: event.gameSettings,
        };
      }),
      resetGameState: assign(({ gameState }) => ({
        gameState: {
          ...gameState,
          queuedFlashes: [],
          score: 0,
        },
      })),
      handleFlash: assign(({ gameSettings, gameState }, event) => {
        if (event.type !== "FLASH") {
          return {};
        }

        const button = getRandomButton(
          gameSettings.numberOfButtons,
          gameState.lastFlash
        );

        return {
          gameState: {
            ...gameState,
            queuedFlashes: [...gameState.queuedFlashes, button],
            lastFlash: button,
          },
        };
      }),
      handleClick: assign(({ gameState }) => ({
        gameState: {
          ...gameState,
          queuedFlashes: gameState.queuedFlashes.slice(1),
          score: gameState.score + 1,
        },
      })),
      clearTimer: () => {
        let id = window.setTimeout(() => undefined, 0);

        while (id--) {
          window.clearTimeout(id);
        }
      },
    },
    guards: {
      queueLimitReached: ({ gameSettings, gameState }) =>
        gameState.queuedFlashes.length > gameSettings.maxQueuedFlashes,
      clickInvalid: ({ gameState }, event) =>
        event.type !== "CLICK" ||
        gameState.queuedFlashes.length === 0 ||
        gameState.queuedFlashes[0] !== event.button,
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
