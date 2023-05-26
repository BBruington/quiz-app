import '@/styles/globals.css';
import Nav from "@/components/Nav";
import Footer from '../components/footer';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import type { AppProps } from 'next/app';
import {AppWrapper} from "../context/context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ReactNotifications />
      <AppWrapper>
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </AppWrapper>
    </>
  )
}
