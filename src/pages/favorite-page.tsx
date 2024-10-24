import { RootState, useAppSelector } from '@/app/store/store';
import { fetchProductById } from '@/entities/product/api/fetchProductById';
import { IProduct } from '@/entities/product/models/productTypes';
import { useEffect, useState } from 'react';


const FavoritesPage = () => {
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
            loadFavoriteProducts();
        } else {
            setIsLoading(false);
        }
    }, [favoriteIds]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (favoriteProducts.length === 0) {
        return <div>No favorite products</div>;
    }

    return (
        <div>
            <h1>Your Favorite Products</h1>
            <div >
                {favoriteProducts.map(product => (
                    <div key={product.id}>
                        <img src={product.image} alt={product.title} width={100} />
                        <h3>{product.title}</h3>
                        <p>Price: ${product.price}</p>
                        <p>Rating: {product.rating?.rate} / 5 ({product.rating?.count} reviews)</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesPage;
