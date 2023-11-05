import Header from '@/components/Header'
import '@/styles/globals.css'
import { NextUIProvider } from '@nextui-org/react'
import NextProgress from 'next-progress'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter()
  return (
    <SessionProvider session={session}>
      <NextUIProvider>
        <>
          <Head>
            <title>Results Analyser</title>
            <meta name='robots' content='follow, index' />
            <meta name='description' content='description' />
            <meta
              name='viewport'
              content='initial-scale=1, width=device-width'
            />
          </Head>
          {router.pathname === '/' || router.pathname === '/register' ? (
            ''
          ) : (
            <Header />
          )}
          <Component {...pageProps} />
          <NextProgress
            delay={100}
            disableSameRoute={true}
            color='#25be6480'
            height='5px'
            options={{ showSpinner: false }}
          />
        </>
      </NextUIProvider>
    </SessionProvider>
  )
}
