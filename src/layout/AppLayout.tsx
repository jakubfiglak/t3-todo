import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { ThemeSwitch } from "~/components/ThemeSwitch";

type LayoutContentWrapperProps = {
  children: ReactNode;
  className?: string;
};

const LayoutContentWrapper = ({
  children,
  className,
}: LayoutContentWrapperProps) => {
  return (
    <div className={twMerge("mx-auto max-w-xl px-6", className)}>
      {children}
    </div>
  );
};

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isSignedIn, user } = useUser();

  return (
    <>
      <header className="h-[200px] bg-[url('/images/bg-mobile-light.jpg')] bg-cover dark:bg-[url('/images/bg-mobile-dark.jpg')] md:h-[300px] md:bg-[url('/images/bg-desktop-light.jpg')] md:dark:bg-[url('/images/bg-desktop-dark.jpg')]">
        <LayoutContentWrapper className="py-12 md:py-16">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-widest text-white md:text-4xl">
              TODO
            </h1>
            <div className="flex items-center gap-3 text-white">
              <ThemeSwitch />
              {isSignedIn && (
                <Image
                  alt={`${user.firstName || "User"} avatar`}
                  src={user.profileImageUrl}
                  height={36}
                  width={36}
                  className="rounded-full"
                />
              )}

              {isSignedIn ? <SignOutButton /> : <SignInButton />}
            </div>
          </div>
        </LayoutContentWrapper>
      </header>
      <main>
        <LayoutContentWrapper>{children}</LayoutContentWrapper>
      </main>
    </>
  );
};
