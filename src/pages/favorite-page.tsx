import { RootState, useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchProductById } from '@/entities/product/api/fetchProductById';
import { IProduct } from '@/entities/product/models/productTypes';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import { removeFavorite } from '@/entities/favorite/slice/favoriteSlice';
import HeartFilled from '@ant-design/icons/lib/icons/HeartFilled';
import HeartOutlined from '@ant-design/icons/lib/icons/HeartOutlined';
import { Loader } from '@/shared/ui/Loader/Loader';

const FavoritesPage = () => {
    const dispatch = useAppDispatch();
    const { favoriteIds } = useAppSelector((state: RootState) => state.favorites);
    const [favoriteProducts, setFavoriteProducts] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadFavoriteProducts = async () => {
            const products = await Promise.all(favoriteIds.map((id: string | number) => fetchProductById(id)));
            setFavoriteProducts(products);
            setIsLoading(false);
        };

        if (favoriteIds.length > 0) {
            setIsLoading(true);
            loadFavoriteProducts();
        } else {
            setFavoriteProducts([]);
            setIsLoading(false);
        }
    }, [favoriteIds]);


    const handleToggleFavorite = (id: number) => {
        dispatch(removeFavorite(id));
    };


    if (isLoading) {
        return <Loader />;
    }

    if (favoriteProducts.length === 0) {
        return <div style={{ textAlign: 'center', margin: '10px' }}>No favorite products</div>;
    }

    return (
        <Flex vertical align='center'>
            <h1>Your Favorite Products</h1>
            <div>
                {favoriteProducts.map(product => (
                    <div key={product.id} style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <img src={product.image} alt={product.title} width={100} />
                        <h3>{product.title}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Rating: {product.rating?.rate} / 5 ({product.rating?.count} reviews)</p>
                        {favoriteIds.includes(product.id) ? (
                            <HeartFilled
                                onClick={() => handleToggleFavorite(product.id)}
                                style={{ color: 'red', cursor: 'pointer' }}
                            />
                        ) : (
                            <HeartOutlined
                                onClick={() => handleToggleFavorite(product.id)}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Flex>
    );
};

export default FavoritesPage;
