import classNames from "classnames";
import Score from "../components/Score";
import SpeedTesterButton from "../components/SpeedTesterButton";
import Stack from "../components/Stack";
import { GameSettings, GameState } from "../state/gameMachine";

interface Props {
  gameSettings: GameSettings;
  gameState: GameState;
  onClick: (button: number) => void;
}

function GameView({ gameSettings, gameState, onClick }: Props) {
  const flashingButton = gameState.queuedFlashes.at(-1);

  const buttons = Array(gameSettings.numberOfButtons)
    .fill(undefined)
    .map((_, i) => {
      const buttonNumber = i + 1;

      return (
        <SpeedTesterButton
          key={buttonNumber}
          buttonNumber={buttonNumber}
          isFlashing={flashingButton === buttonNumber}
          onClick={() => onClick(buttonNumber)}
        />
      );
    });

  const gridClasses = classNames(
    "grid grid-flow-row grid-cols-5 gap-2 tablet:gap-4 desktop:gap-8",
    {
      "grid-cols-1": gameSettings.numberOfButtons === 1,
      "grid-cols-2": gameSettings.numberOfButtons === 2,
      "grid-cols-3": gameSettings.numberOfButtons === 3,
      "grid-cols-4": gameSettings.numberOfButtons === 4,
      "grid-cols-5": gameSettings.numberOfButtons >= 5,
    }
  );

  return (
    <Stack gap="lg">
      <div className={gridClasses}>{buttons}</div>
      <Score score={gameState.score} />
    </Stack>
  );
}

export default GameView;
