import '../styles/globals.css';
import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext';
import { LayoutEventsProvider } from '../context/LayoutEvents';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <LayoutEventsProvider>
        <Component {...pageProps} />
      </LayoutEventsProvider>
    </ThemeProvider>
  );
}
