import { CheckIcon } from "@heroicons/react/24/solid";
import { twMerge } from "tailwind-merge";

type CheckboxProps = Omit<React.ComponentProps<"input">, "type">;

export const Checkbox = ({ className, ...rest }: CheckboxProps) => {
  return (
    <div className={twMerge("relative h-5 w-5 md:h-6 md:w-6", className)}>
      <input
        type="checkbox"
        className="peer absolute left-0 top-0 m-0 h-full w-full cursor-pointer appearance-none rounded-full border border-light-steel-blue before:absolute before:left-[2px] before:top-[2px] before:z-10 before:h-5 before:w-5 before:scale-0 before:rounded-full before:bg-white before:transition after:absolute after:inset-0 after:h-5 after:w-5 after:scale-0 after:rounded-full after:bg-gradient-to-br after:from-[#55DDFF] after:to-[#C058F3] after:text-xs after:text-white after:transition checked:before:z-0 checked:after:scale-100 hover:before:scale-100 hover:after:scale-100 dark:border-dark-slate-blue dark:before:bg-cherywood md:after:h-6 md:after:w-6"
        {...rest}
      />
      <CheckIcon className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 scale-0 text-white transition peer-checked:scale-100" />
    </div>
  );
};
