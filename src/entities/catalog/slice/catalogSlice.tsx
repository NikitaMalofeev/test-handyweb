// catalogSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface IProduct {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
}

interface CatalogState {
    products: IProduct[];
    filteredProducts: IProduct[];
    isLoading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
    selectedCategory: string | null;
    sortOrder: 'asc' | 'desc' | null;
}

const initialState: CatalogState = {
    products: [],
    filteredProducts: [],
    isLoading: false,
    error: null,
    page: 1,
    hasMore: true,
    selectedCategory: null,
    sortOrder: null,
};

export const fetchProducts = createAsyncThunk<
    IProduct[],
    { page: number; limit: number; category?: string }
>('catalog/fetchProducts', async ({ page, limit, category }, { dispatch }) => {
    let url = `https://fakestoreapi.com/products?limit=${limit}&page=${page}`;
    if (category) {
        url = `https://fakestoreapi.com/products/category/${category}?limit=${limit}&page=${page}`;
    }
    const response = await axios.get(url);
    console.log(response)
    dispatch(setProductsList(response.data))
    return response.data;
});

const catalogSlice = createSlice({
    name: 'catalog',
    initialState,
    reducers: {
        setProductsList(state, action: PayloadAction<IProduct[]>) {
            state.products = [...state.products, ...action.payload];
            state.isLoading = false
        },
        setCategory(state, action: PayloadAction<string>) {
            state.selectedCategory = action.payload;
            state.page = 1;
            state.products = []
            state.filteredProducts = [];
            state.hasMore = true;
        },
        setSortOrder(state, action: PayloadAction<'asc' | 'desc' | null>) {
            state.sortOrder = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch products';
            });
    },
});

export const { setProductsList, setCategory, setSortOrder } = catalogSlice.actions;

export default catalogSlice.reducer;
