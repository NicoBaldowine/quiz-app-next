import '../styles/globals.css';
import { Inter, Barlow_Condensed } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-barlow-condensed: ${barlowCondensed.style.fontFamily};
        }
      `}</style>
      <main className={`${inter.className} ${barlowCondensed.variable}`}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
