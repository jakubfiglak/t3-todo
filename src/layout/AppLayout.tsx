import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import type { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isSignedIn, user } = useUser();

  return (
    <>
      <header className="h-[200px] bg-[url('/images/bg-mobile-light.jpg')] bg-cover px-6 pt-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-widest text-white">
            TODO
          </h1>
          <div>
            <span className="mr-3">🌕</span>
            {isSignedIn ? <SignOutButton /> : <SignInButton />}
            {isSignedIn && <span className="ml-3">{user.firstName}</span>}
          </div>
        </div>
      </header>
      <main className="px-6">{children}</main>
    </>
  );
};
