import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IProduct } from '@/entities/product/models/productTypes';
import { fetchProductById } from '@/entities/product/api/fetchProductById';
import { Flex } from 'antd';
import { Loader } from '@/shared/ui/Loader/Loader';

const ProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState<IProduct | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const loadProduct = async () => {
                try {
                    const fetchedProduct = await fetchProductById(id as string);
                    setProduct(fetchedProduct);
                } catch (err: any) {
                    setError('Failed to fetch product details.');
                } finally {
                    setIsLoading(false);
                }
            };
            loadProduct();
        }
    }, [id]);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div style={{ backgroundColor: '#d1feff', height: '100%' }}>
            <Flex vertical align='center'>
                <h1>{product.title}</h1>
                <img src={product.image} alt={product.title} width={200} />
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Rating: {product.rating?.rate} / 5 ({product.rating?.count} reviews)</p>
            </Flex>
        </div>
    );
};

export default ProductDetail;
