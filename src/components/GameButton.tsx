import classNames from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonNumber: number;
  isFlashing: boolean;
}

function GameButton({ buttonNumber, isFlashing, ...props }: Props) {
  const colors = ["orange", "red", "yellow", "green", "blue"];
  const color = colors[buttonNumber % colors.length];

  const classes = classNames(
    "rounded-full p-6 tablet:p-10 desktop:p-20 shadow-2xl active:shadow-xl outline-none transition-all duration-75",
    "border-t border-b-4 border-x-2 tablet:border-b-8 tablet:border-x-4",
    {
      // red
      "border-red-900": color === "red",
      "bg-red-500 active:border-red-600": color === "red" && !isFlashing,
      "bg-red-200 active:border-red-300": color === "red" && isFlashing,
      "shadow-red-400": color === "red" && isFlashing,

      // yellow
      "border-yellow-900": color === "yellow",
      "bg-yellow-500 active:border-yellow-600":
        color === "yellow" && !isFlashing,
      "bg-yellow-200 active:border-yellow-300":
        color === "yellow" && isFlashing,
      "shadow-yellow-400": color === "yellow" && isFlashing,

      // green
      "border-green-900": color === "green",
      "bg-green-500 active:border-green-600": color === "green" && !isFlashing,
      "bg-green-200 active:border-green-300": color === "green" && isFlashing,
      "shadow-green-400": color === "green" && isFlashing,

      // blue
      "border-blue-900": color === "blue",
      "bg-blue-500 active:border-blue-600": color === "blue" && !isFlashing,
      "bg-blue-200 active:border-blue-300": color === "blue" && isFlashing,
      "shadow-blue-400": color === "blue" && isFlashing,

      // orange
      "border-orange-900": color === "orange",
      "bg-orange-500 active:border-orange-600":
        color === "orange" && !isFlashing,
      "bg-orange-200 active:border-orange-300":
        color === "orange" && isFlashing,
      "shadow-orange-400": color === "orange" && isFlashing,
    }
  );

  return (
    <button className={classes} {...props}>
      <span className="sr-only">{buttonNumber}</span>
    </button>
  );
}

export default GameButton;
