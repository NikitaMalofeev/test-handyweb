import { useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchProducts, setCategory, setSortOrder } from '@/entities/catalog/slice/catalogSlice';
import styles from './catalog.module.scss';

export const Catalog = () => {
    const dispatch = useAppDispatch();
    const { products, filteredProducts, isLoading, error, hasMore, page, selectedCategory, sortOrder } = useAppSelector((state: RootState) => state.catalog);

    const limit = 6;

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading && hasMore) {
            dispatch(fetchProducts({ page, limit, category: selectedCategory ? selectedCategory : '' })); // Подгружаем 6 товаров с учётом категории
        }
    };

    const handleSort = (order: 'asc' | 'desc') => {
        dispatch(setSortOrder(order));
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        dispatch(setCategory(category));
        dispatch(fetchProducts({ page: 1, limit, category }));
    };

    useEffect(() => {
        dispatch(fetchProducts({ page: 1, limit, category: selectedCategory ? selectedCategory : '' }));
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.price - b.price;
        } else if (sortOrder === 'desc') {
            return b.price - a.price;
        }
        return 0;
    });

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
                {sortedProducts.map((product) => (
                    <div key={product.id} className={styles.products__card}>
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
