import { store } from '@/app/store/store';
import { Header } from '@/shared/ui/Header/Header';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Provider store={store}>
                <Header />
                <Component {...pageProps} />
            </Provider>
        </>
    );
}
