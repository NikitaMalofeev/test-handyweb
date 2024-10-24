import axios from "axios";
import { IProduct } from "../models/productTypes";

export const fetchProductsFromAPI = async (page: number, limit: number, category: string): Promise<IProduct[]> => {
    try {
        const categoryParam = category ? `category/${category}` : "";
        const response = await axios.get(`https://fakestoreapi.com/products/${categoryParam}`, {
            params: {
                limit,
                page,
            },
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch products");
    }
};
