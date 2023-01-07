import { useEffect } from "react";

import { ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

import Layout from "./Layout";
import Epoch from "./Epoch";
import { webVitals } from "../lib/vitals";

const analyticsId = import.meta.env.VITE_VERCEL_ANALYTICS_ID;

export default function App() {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "color-scheme",
        defaultValue: "light",
        getInitialValueInEffect: true,
    });

    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

    useEffect(() => {
        webVitals({
            analyticsId,
        });
    }, []);

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
                <Layout>
                    <Epoch />
                </Layout>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
