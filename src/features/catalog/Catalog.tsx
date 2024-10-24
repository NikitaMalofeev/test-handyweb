import { useEffect, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchProducts, setCategory, setSortOrder, incrementPage } from '@/entities/catalog/slice/catalogSlice';
import styles from './catalog.module.scss';
import { useRouter } from 'next/router';
import { addFavorite, removeFavorite } from '@/entities/favorite/slice/favoriteSlice';
import HeartFilled from '@ant-design/icons/lib/icons/HeartFilled';
import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined';
import { Button, Select } from 'antd';
const { Option } = Select;
import { catalogSelectOptions } from '@/shared/config/catalogSelectOptions';
import { Loader } from '@/shared/ui/Loader/Loader';
import Image from 'next/image';

export const Catalog = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { products, isLoading, sortOrder, error, hasMore, page, selectedCategory } = useAppSelector((state: RootState) => state.catalog);
    const { favoriteIds } = useAppSelector((state: RootState) => state.favorites);

    const limit = 6;
    const [scrollThreshold, setScrollThreshold] = useState<number>(1500);
    const [isFetching, setIsFetching] = useState(false);

    const handleSort = (order: 'asc' | 'desc') => {
        dispatch(setSortOrder(order));
    };

    const handleCategoryChange = (value: string) => {
        dispatch(setCategory(value));
        dispatch(fetchProducts(1, limit, value));
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
            const currentScrollY = window.scrollY + window.innerHeight;
            const productContainer = document.querySelector(`.${styles.products}`);
            const productsHeight = productContainer ? productContainer.scrollHeight : 0;

            if (!isFetching && ((scrollThreshold && currentScrollY >= scrollThreshold) ||
                (productContainer && currentScrollY >= productsHeight && !isLoading && hasMore))) {

                setIsFetching(true);

                const nextPage = page + 1;
                dispatch(incrementPage());
                dispatch(fetchProducts(nextPage, limit, selectedCategory || '')).then(() => {
                    setIsFetching(false);
                });

                setScrollThreshold((prevThreshold) => prevThreshold + 1500);
            }
        };

        const debounceScroll = () => {
            let timeout: NodeJS.Timeout;
            return () => {
                clearTimeout(timeout);
                timeout = setTimeout(handleScroll, 100);
            };
        };

        const debouncedScroll = debounceScroll();

        window.addEventListener('scroll', debouncedScroll);

        return () => window.removeEventListener('scroll', debouncedScroll);
    }, [dispatch, isLoading, hasMore, page, selectedCategory, scrollThreshold, isFetching]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.catalog}>
            <h1>Catalog</h1>

            <div className={styles.sort__buttons}>
                <Button type={sortOrder === 'asc' ? 'primary' : 'default'} onClick={() => handleSort('asc')}>Sort by Price: Low to High</Button>
                <Button type={sortOrder === 'desc' ? 'primary' : 'default'} onClick={() => handleSort('desc')}>Sort by Price: High to Low</Button>
            </div>

            <div className={styles.filter}>
                <label htmlFor="category">Filter by Category:</label>
                <Select
                    id="category"
                    style={{ width: 200 }}
                    value={selectedCategory || ''}
                    onChange={handleCategoryChange}
                >
                    {catalogSelectOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className={styles.products}>
                {sortedProducts.map((product, index) => (
                    <div
                        key={`${product.id}-${page}-${index}`}
                        className={styles.products__card}
                        onClick={() => handleProductClick(product.id)}
                    >
                        <Image src={product.image} alt={product.title} width={200} height={200} />
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

            {isLoading && <Loader />}
            {(!hasMore && !isLoading) && <div style={{ margin: '20px' }}>No more products</div>}
        </div>
    );
};
