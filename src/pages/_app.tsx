import { store } from '@/app/store/store';
import { Header } from '@/shared/ui/Header/Header';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import '../app/styles/globals.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Provider store={store}>
                <Header />
                <div style={{ paddingTop: '60px', height: 'calc(100% - 60px)' }}>
                    <Component {...pageProps} />
                </div>
            </Provider>
        </>
    );
}
