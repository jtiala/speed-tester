import classNames from "classnames";

function Button({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = classNames(
    "rounded-full bg-white border-slate-400 active:border-slate-300 text-slate-900 text-lg desktop:text-xl",
    "px-4 py-2 desktop:px-8 desktop:py-5 border-t-1 border-r-2 border-b-4 border-l-2"
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
