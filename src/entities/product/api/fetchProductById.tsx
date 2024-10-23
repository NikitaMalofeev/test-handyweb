import { IProduct } from "../models/productTypes";

export const fetchProductById = async (id: string): Promise<IProduct> => {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    const product = await response.json();
    return product;
};
