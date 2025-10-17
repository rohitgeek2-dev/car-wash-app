import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import "../styles/home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/Header";
import Footer from '../components/Footer';
import AnimatedLayout from "../components/AnimatedLayout";

const poppinsFont = Poppins({
  variable: "--font-poppins", 
  subsets: ["latin"],
  weight: ["600", "700"],
}); 

const robotoFont = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Carwash Detailing Services",
  description: "Wash and care inner and outer full services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppinsFont.variable} ${robotoFont.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
