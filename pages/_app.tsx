import Header from '@/components/Header'
import '@/styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <NextUIProvider>
      <>
        <Head>
          <title>Results Analyser</title>
          <meta name='robots' content='follow, index' />
          <meta name='description' content='description' />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>
        {router.pathname !== '/' && <Header />}
        <Component {...pageProps} />
      </>
    </NextUIProvider>
  )
}
