import type { AppProps } from 'next/app';

import Head from 'next/head';

import 'tachyons';

const App = ({ Component, pageProps }: AppProps) => (
    <>
        <Head>
            <meta charSet="utf-8" />
            <title>Epoch</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <link rel="icon" type="img/x-icon" href="/favicon.ico" />
        </Head>

        <div id="container">
            <main>
                <Component {...pageProps} />
            </main>
        </div>

        <style jsx global>{`
            html,
            body,
            #__next {

            }
            #__next {
                display: flex;
                flex-direction: column;
                font-family: sans-serif;
            }
            #container {
                flex: 1 0 auto;
                margin: 0 auto 0 auto;
                padding: 0 0 0 0;
                font-size: 12pt;
                max-width: 42em;
            }
            main {
                margin: 0 2em;
            }
        `}</style>
    </>
);

export default App;
