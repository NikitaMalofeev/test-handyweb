import { useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchProducts } from '@/entities/catalog/slice/catalogSlice';
import styles from './catalog.module.scss';

export const Catalog = () => {
    const dispatch = useAppDispatch();
    const { products, isLoading, error, page, hasMore } = useAppSelector((state: RootState) => state.catalog);

    const limit = 6;

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading && hasMore) {
            dispatch(fetchProducts({ page, limit }));
        }
    };

    useEffect(() => {
        dispatch(fetchProducts({ page: 1, limit }));
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, page]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Catalog</h1>
            <div className={styles.products}>
                {products.map((product, index) => (
                    <div
                        key={`${product.id}-${index}`} // Уникальный ключ
                        className={styles.products__card}
                    >
                        <img src={product.image} alt={product.title} width={100} />
                        <h3>{product.title}</h3>
                        <p>Price: ${product.price}</p>
                    </div>
                ))}
            </div>
            {isLoading && <div>Loading...</div>}
            {!hasMore && <div>No more products</div>}
        </div>
    );
};

