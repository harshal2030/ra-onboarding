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
    icons: {
        icon: [
            {
                rel: "icon",
                url: "https://indothai.co.in/wp-content/uploads/2024/12/cropped-image-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
            {
                rel: "icon",
                url: "https://indothai.co.in/wp-content/uploads/2024/12/cropped-image-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                rel: "apple-touch-icon",
                url: "https://indothai.co.in/wp-content/uploads/2024/12/cropped-image-180x180.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    },
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
