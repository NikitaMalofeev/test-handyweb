import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { IProduct } from '@/entities/product/models/productTypes';
import { fetchProductById } from '@/entities/product/api/fetchProductById';
import { Flex } from 'antd';
import { Loader } from '@/shared/ui/Loader/Loader';
import Image from 'next/image';
import { fetchAllProducts } from '@/entities/product/api/fetchAllProducts';

type ProductDetailProps = {
    product: IProduct;
};

const ProductDetail = ({ product }: ProductDetailProps) => {
    const router = useRouter();

    if (router.isFallback) {
        return <Loader />;
    }

    return (
        <div style={{ backgroundColor: '#d1feff', height: '100%' }}>
            <Flex vertical align="center">
                <h1>{product.title}</h1>
                <Image src={product.image} alt={product.title} width={200} height={200} />
                <p style={{ maxWidth: '500px' }}>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>
                    Rating: {product.rating?.rate} / 5 ({product.rating?.count} reviews)
                </p>
            </Flex>
        </div>
    );
};

export const getStaticPaths: GetStaticPaths = async () => {
    const products = await fetchAllProducts();

    const paths = products.map((product) => ({
        params: { id: product.id.toString() },
    }));

    return {
        paths,
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const product = await fetchProductById(params!.id as string);

    if (!product) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            product,
        },
        revalidate: 60,
    };
};

export default ProductDetail;
