import '../styles/globals.css';
import 'antd/dist/reset.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '../context/ThemeContext';
import { LayoutEventsProvider } from '../context/LayoutEvents';
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo-client';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <LayoutEventsProvider>
          <Component {...pageProps} />
        </LayoutEventsProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}
