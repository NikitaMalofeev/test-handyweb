import { useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchProducts, setCategory, setSortOrder, incrementPage, setProducts } from '@/entities/catalog/slice/catalogSlice';
import styles from './catalog.module.scss';
import { useRouter } from 'next/router';
import { addFavorite, removeFavorite } from '@/entities/favorite/slice/favoriteSlice';
import HeartFilled from '@ant-design/icons/lib/icons/HeartFilled';
import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined';

export const Catalog = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { products, isLoading, sortOrder, error, hasMore, page, selectedCategory } = useAppSelector((state: RootState) => state.catalog);
    const { favoriteIds } = useAppSelector((state: RootState) => state.favorites);

    const limit = 6;

    const handleSort = (order: 'asc' | 'desc') => {
        dispatch(setSortOrder(order));
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const category = event.target.value;
        dispatch(setCategory(category));
        dispatch(fetchProducts(1, limit, category));
    };

    const handleToggleFavorite = (id: number, event: React.MouseEvent) => {
        event.stopPropagation();
        if (favoriteIds.includes(id)) {
            dispatch(removeFavorite(id));
        } else {
            dispatch(addFavorite(id));
        }
    };

    const handleProductClick = (id: number) => {
        router.push(`/product/${id}`);
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.price - b.price;
        } else {
            return b.price - a.price;
        }
    });

    useEffect(() => {
        dispatch(fetchProducts(1, limit, selectedCategory || ''));
    }, [dispatch, selectedCategory]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading && hasMore) {
                const nextPage = page + 1;
                dispatch(incrementPage());
                dispatch(fetchProducts(nextPage, limit, selectedCategory || ''));
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [dispatch, isLoading, hasMore, page, selectedCategory]);

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
                    <div
                        key={`${product.id}-${page}-${index}`}
                        className={styles.products__card}
                        onClick={() => handleProductClick(product.id)}
                    >
                        <img src={product.image} alt={product.title} width={100} />
                        <h3>{product.title}</h3>
                        <p>Price: ${product.price}</p>
                        {favoriteIds.includes(product.id) ? (
                            <HeartFilled
                                onClick={(e) => handleToggleFavorite(product.id, e)}
                                style={{ color: 'red' }}
                            />
                        ) : (
                            <HeartOutlined
                                onClick={(e) => handleToggleFavorite(product.id, e)}
                            />
                        )}
                    </div>
                ))}
            </div>

            {isLoading && <div>Loading...</div>}
            {!hasMore && <div>No more products</div>}
        </div>
    );
};
