import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "IndoThai Securities - Client Onboarding",
    description: "Secure client onboarding powered by IndoThai Securities",
    applicationName: "IndoThai Securities",
    keywords: [
        "IndoThai Securities",
        "client onboarding",
        "securities",
        "KYC",
        "verification",
    ],
    formatDetection: {
        telephone: false,
    },
    metadataBase: new URL("https://indothai.co.in"),
    robots: {
        index: false,
        follow: false,
    },
    manifest: "/manifest.json",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#2563eb" },
        { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
    ],
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
                <Toaster position="top-right" />
                {children}
            </body>
        </html>
    );
}
