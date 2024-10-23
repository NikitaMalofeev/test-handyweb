import { IProduct } from '@/entities/product/models/productTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


interface CatalogState {
    products: IProduct[];
    isLoading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

const initialState: CatalogState = {
    products: [],
    isLoading: false,
    error: null,
    page: 1,
    hasMore: true,
};

interface FetchProductsParams {
    page: number;
    limit: number;
}

export const fetchProducts = createAsyncThunk<IProduct[], FetchProductsParams>(
    'catalog/fetchProducts',
    async ({ page, limit }) => {
        const response = await axios.get(
            `https://fakestoreapi.com/products?limit=${limit}&page=${page}`
        );
        return response.data;
    }
);

const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = [...state.products, ...action.payload];
                state.hasMore = action.payload.length > 0;
                state.page += 1;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch products';
            });
    },
});

export default catalogSlice.reducer;
