import { JetBrains_Mono as FontMono, Inter as FontSans, DM_Sans as FontDMSans } from "next/font/google"
import localFont from 'next/font/local'

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const fontDMSans = FontDMSans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const fontSatoshi = localFont({
  src: '../public/fonts/Satoshi-Regular.ttf',
  variable: "--font-satoshi"
});