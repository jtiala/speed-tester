import { useMachine } from "@xstate/react";
import Heading from "./components/Heading";
import Stack from "./components/Stack";
import { gameMachine } from "./state/gameMachine";
import GameOverView from "./views/GameOverView";
import GameView from "./views/GameView";
import StartView from "./views/StartView";

function App() {
  const [state, send] = useMachine(gameMachine);

  const { gameSettings, gameState } = state.context;

  return (
    <div className="min-h-screen w-screen bg-red-600 px-2 tablet:px-4 desktop:px-8 pt-2 tablet:pt-8 desktop:pt-16">
      <Stack gap="lg">
        <header className="container mx-auto">
          <Heading level={1}>
            <a href={import.meta.env.BASE_URL}>Speed Tester</a>
          </Heading>
        </header>
        <main className="container mx-auto">
          {state.value === "initial" && (
            <StartView
              start={(gameSettings) => send({ type: "START", gameSettings })}
            />
          )}
          {state.value === "running" && (
            <GameView
              gameSettings={gameSettings}
              gameState={gameState}
              onClick={(button) => send({ type: "CLICK", button })}
            />
          )}
          {state.value === "gameOver" && (
            <GameOverView
              gameState={gameState}
              start={() => send({ type: "START", gameSettings })}
              reset={() => send({ type: "RESET" })}
            />
          )}
        </main>
      </Stack>
    </div>
  );
}

export default App;
