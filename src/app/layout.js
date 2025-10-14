import { Inter } from 'next/font/google'
import { Baloo_Bhai_2, Baloo_Bhaijaan_2 } from 'next/font/google'
import "./globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { Toaster } from 'react-hot-toast';
import Providers from "./providers"; // Import Providers

export const metadata = {
  title: "Crowd Funding Campaigns",
  description: "",
};

const inter = Inter({ subsets: ['latin'] })
const balooBhai2 = Baloo_Bhai_2({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-baloo-bhai-2'
})
const balooBhaijaan2 = Baloo_Bhaijaan_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-baloo-bhaijaan-2'
})

export default function RootLayout({ children }) {

  return (
    <html lang="en" className={`${inter.className} ${balooBhai2.variable} ${balooBhaijaan2.variable}`} suppressHydrationWarning >
      <head>
        <link rel="shortcut icon" href="logo.png" type="image/x-icon" />
      </head>
      <body>
        <Providers>
            <Header />
            {children}
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
            <Footer />
        </Providers></body>
    </html>
  );
}
