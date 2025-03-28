import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";
import { PlanProvider } from "@/context/PlanContext";
import { FormSaveProvider } from "@/context/FormSaveContext";
import { FormSaveBanner } from "@/components/FormSaveBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Façamos um plano de grupo",
  description:
    "Ferramenta para a criação de planos de grupos escoteiros, como previsto nos documentos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FormSaveProvider>
          <PlanProvider>
            <Navbar className="px-4 py-2" />
            <main className="min-h-screen bg-muted text-foreground">
              {children}
            </main>
            <FormSaveBanner />
          </PlanProvider>
        </FormSaveProvider>
      </body>
    </html>
  );
}
