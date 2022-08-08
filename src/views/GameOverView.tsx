import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import Heading from "../components/Heading";
import Score from "../components/Score";
import Stack from "../components/Stack";
import { GameState } from "../state/gameMachine";

interface Props {
  gameState: GameState;
  start: () => void;
  reset: () => void;
}

function GameOverView({ gameState, start, reset }: Props) {
  return (
    <Stack gap="md">
      <Heading level={2}>Game over!</Heading>
      <Score score={gameState.score} />
      <ButtonGroup>
        <Button onClick={start}>Restart</Button>
        <Button onClick={reset}>Select mode</Button>
      </ButtonGroup>
    </Stack>
  );
}

export default GameOverView;
