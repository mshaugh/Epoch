import type { AppProps } from 'next/app';

import Head from 'next/head';

import 'tachyons';

const YEAR = new Date().getFullYear();

const Footer = () => (
    <footer>
        <p>
            Copyright &copy; {YEAR} Max Shaughnessy. All rights reserved.
        </p>

        <style jsx>{`
            footer {
                position: absolute;
                bottom: 0;
                width: 100vw;
                font-size: smaller;
                text-align: center;
                color: hsl(0, 0%, 20%);
                padding: 0.5em;
            }
        `}</style>
    </footer>
);


const App = ({ Component, pageProps }: AppProps) => (
    <>
        <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <link rel="icon" type="img/x-icon" href="/favicon.ico" />
        </Head>

        <div id="container">
            <main>
                <Component {...pageProps} />
            </main>
        </div>

        <Footer />

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
                margin: 0em 2em;
            }
        `}</style>
    </>
);

export default App;
