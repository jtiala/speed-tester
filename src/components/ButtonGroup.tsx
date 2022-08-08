import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function ButtonGroup({ children }: Props) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-2">
      {children}
    </div>
  );
}

export default ButtonGroup;
