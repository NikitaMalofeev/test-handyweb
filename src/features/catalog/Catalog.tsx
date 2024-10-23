import { useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchProducts, setCategory, setSortOrder, incrementPage, setProducts } from '@/entities/catalog/slice/catalogSlice';
import styles from './catalog.module.scss';

export const Catalog = () => {
    const dispatch = useAppDispatch();
    const { products, isLoading, sortOrder, error, hasMore, page, selectedCategory } = useAppSelector((state: RootState) => state.catalog);

    const limit = 6;

    const handleSort = (order: 'asc' | 'desc') => {
        dispatch(setSortOrder(order));
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        dispatch(setCategory(category));
        dispatch(fetchProducts(1, limit, category));
    };

    useEffect(() => {
        dispatch(fetchProducts(1, limit, selectedCategory || ''));
    }, [dispatch, selectedCategory]);

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading && hasMore) {
                dispatch(incrementPage());
                dispatch(fetchProducts(page + 1, limit, selectedCategory || ''));
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore, dispatch, page, selectedCategory]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Catalog</h1>

            <div className={styles.sortButtons}>
                <button onClick={() => handleSort('asc')}>Sort by Price: Low to High</button>
                <button onClick={() => handleSort('desc')}>Sort by Price: High to Low</button>
            </div>

            <div className={styles.filter}>
                <label htmlFor="category">Filter by Category:</label>
                <select id="category" onChange={handleCategoryChange} value={selectedCategory || ''}>
                    <option value="">All Categories</option>
                    <option value="men's clothing">Men's Clothing</option>
                    <option value="women's clothing">Women's Clothing</option>
                    <option value="jewelery">Jewelery</option>
                    <option value="electronics">Electronics</option>
                </select>
            </div>

            <div className={styles.products}>
                {sortedProducts.map((product, index) => (
                    <div key={`${product.id}-${page}-${index}`} className={styles.products__card}>
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

