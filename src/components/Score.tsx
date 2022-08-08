interface Props {
  score: number;
}

function Score({ score }: Props) {
  return (
    <span className="text-white text-lg">
      <span className="font-bold">Score:</span> {score}
    </span>
  );
}

export default Score;
