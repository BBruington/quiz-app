import '@/styles/globals.css';
import Nav from "@/components/Nav";
import type { AppProps } from 'next/app';
import {AppWrapper} from "../context/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <AppWrapper>
      <Nav />
      <Component {...pageProps} />
    </AppWrapper>
    </>
  )
}
