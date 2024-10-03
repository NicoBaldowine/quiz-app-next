import { Barlow_Condensed } from 'next/font/google'
import './globals.css'  // Make sure this import is present

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-barlow-condensed',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} font-sans`}>
      <body>{children}</body>
    </html>
  )
}
