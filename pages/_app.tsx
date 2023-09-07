import Header from '@/components/Header'
import '@/styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <>
        <Header />
        <Component {...pageProps} />
      </>
    </NextUIProvider>
  )
}
