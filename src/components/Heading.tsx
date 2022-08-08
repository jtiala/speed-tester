import classNames from "classnames";

interface Props {
  level: 1 | 2;
}

function Heading({
  level,
  children,
  ...props
}: Props & React.HTMLAttributes<HTMLHeadingElement>) {
  const classes = classNames("font-display text-white text-center", {
    "text-2xl tablet:text-4xl desktop:text-7xl": level === 1,
    "text-xl tablet:text-2xl desktop:text-4xl": level === 2,
  });

  switch (level) {
    case 1:
      return (
        <h1 className={classes} {...props}>
          {children}
        </h1>
      );
    case 2:
      return (
        <h2 className={classes} {...props}>
          {children}
        </h2>
      );
  }
}

export default Heading;
