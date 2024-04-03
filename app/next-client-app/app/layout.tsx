import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: "CaRROT-Mapper",
  description: "CaRROT-Mapper",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar /> {children}
        </Providers>
      </body>
    </html>
  );
}
