import { type TodoStatus } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

type StatusSelectProps = {
  className?: string;
};

export const StatusSelect = ({ className }: StatusSelectProps) => {
  const router = useRouter();

  const statuses: Array<TodoStatus | "ALL"> = ["ALL", "ACTIVE", "COMPLETED"];

  return (
    <div
      className={twMerge(
        "flex items-center gap-5 text-grayish-blue",
        className
      )}
    >
      {statuses.map((status) => (
        <Link
          key={status}
          href={{ pathname: "/", query: status !== "ALL" ? { status } : null }}
          className={twMerge(
            "font-bold capitalize transition-colors hover:text-gunmetal dark:hover:text-light-steel-blue",
            router.query.status === status && "text-cornflower-blue",
            status === "ALL" && !router.query.status && "text-cornflower-blue"
          )}
        >
          {status.toLowerCase()}
        </Link>
      ))}
    </div>
  );
};
