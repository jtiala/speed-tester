import Button from "../components/Button";
import ButtonGroup from "../components/ButtonGroup";
import Heading from "../components/Heading";
import Stack from "../components/Stack";
import {
  GameSettings,
  classicGameSettings,
  matrixGameSettings,
  easyGameSettings,
  rapidGameSettings,
} from "../state/gameMachine";

interface Props {
  start: (gameSettings: GameSettings) => void;
}

function StartView({ start }: Props) {
  return (
    <Stack gap="md">
      <Heading level={2}>Select mode</Heading>
      <ButtonGroup>
        <Button onClick={() => start(classicGameSettings)}>Classic</Button>
        <Button onClick={() => start(easyGameSettings)}>Easy</Button>
        <Button onClick={() => start(matrixGameSettings)}>Matrix</Button>
        <Button onClick={() => start(rapidGameSettings)}>Rapid</Button>
      </ButtonGroup>
    </Stack>
  );
}

export default StartView;
