import {
  DM_Sans as FontDMSans,
  JetBrains_Mono as FontMono,
  Roboto as FontRoboto,
  Inter as FontSans,
} from "next/font/google"
import localFont from "next/font/local"

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
})

export const fontRoboto = FontRoboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
})

export const fontSatoshi = localFont({
  src: "../public/fonts/Satoshi-Regular.ttf",
  variable: "--font-satoshi",
})
