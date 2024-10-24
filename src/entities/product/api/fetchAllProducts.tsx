import axios from "axios";
import { IProduct } from "../models/productTypes";

export const fetchAllProducts = async (): Promise<IProduct[]> => {
    try {
        const response = await axios.get(`https://fakestoreapi.com/products/`, {
        });
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch products");
    }
};
