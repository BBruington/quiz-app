import '@/styles/globals.css';
import Nav from "@/components/Nav";
import Footer from '../components/footer';
import type { AppProps } from 'next/app';
import {AppWrapper} from "../context/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppWrapper>
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </AppWrapper>
    </>
  )
}
