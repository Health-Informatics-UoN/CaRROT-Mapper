"use client";

import * as React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";

export function Providers({ children, ...props }: SessionProviderProps) {
  return <SessionProvider {...props}>{children}</SessionProvider>;
}
