import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/providers/AuthProvider";
import AuthProvider from "@/providers/AuthProvider";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import OrganizationProvider from "@/providers/OrganizationProvider";
import { Toaster } from "sonner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tenant Onboarding",
  description: "SaaS Tenant Onboarding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense>

          <AuthProvider>
            <OrganizationProvider>
              <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <Sidebar />
                <div className="flex flex-col">
                  <Header />

                  <div className="flex flex-1 flex-col gap-2 p-2 lg:gap-4 lg:p-4">
                    {children}
                  </div>
                </div>
              </div>
            </OrganizationProvider>
          </AuthProvider>
        </Suspense>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
