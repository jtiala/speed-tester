import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  gap: "md" | "lg";
}

function Stack({ gap, children }: Props) {
  const classes = classNames("flex flex-col items-center", {
    "gap-2 tablet:gap-2 desktop:gap-8": gap === "md",
    "gap-6 tablet:gap-8 desktop:gap-32": gap === "lg",
  });

  return <div className={classes}>{children}</div>;
}

export default Stack;
