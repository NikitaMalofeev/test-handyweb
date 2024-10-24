import { fetchProductsFromAPI } from "@/entities/product/api/fetchProductsFromAPI";
import { IProduct } from "@/entities/product/models/productTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CatalogState {
    products: IProduct[];
    searchingProducts: IProduct[];
    isLoading: boolean;
    error: string | null;
    sortOrder: "asc" | "desc";
    selectedCategory: string;
    page: number;
    hasMore: boolean;
}

const initialState: CatalogState = {
    products: [],
    searchingProducts: [],
    isLoading: false,
    error: null,
    sortOrder: "asc",
    selectedCategory: "",
    page: 1,
    hasMore: true,
};

const catalogSlice = createSlice({
    name: "catalog",
    initialState,
    reducers: {
        setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
            state.sortOrder = action.payload;
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
            state.page = 1;
            state.products = [];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setProducts: (state, action: PayloadAction<IProduct[]>) => {
            if (Array.isArray(action.payload)) {
                state.products = [...state.products, ...action.payload];
                state.hasMore = action.payload.length > 0;
            } else {
                state.hasMore = false;
            }
            state.isLoading = false;
        },
        setSearchingProducts: (state, action: PayloadAction<IProduct[]>) => {
            state.searchingProducts = action.payload; // Set products for search results
            state.isLoading = false;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        incrementPage: (state) => {
            state.page += 1;
        },
    },
});

export const { setSortOrder, setSearchingProducts, setCategory, setLoading, setProducts, setError, incrementPage } = catalogSlice.actions;
export default catalogSlice.reducer;

export const fetchProducts = (page: number, limit: number, category: string) => async (dispatch: any, getState: any) => {
    dispatch(setLoading(true));
    try {
        const effectiveLimit = page * limit;
        const products = await fetchProductsFromAPI(1, effectiveLimit, category);
        const existingProducts = getState().catalog.products;
        const newProducts = products.filter(
            (newProduct: IProduct) => !existingProducts.some(
                (existingProduct: IProduct) => existingProduct.id === newProduct.id
            )
        );
        dispatch(setProducts(newProducts));
    } catch (error) {
        dispatch(setError("Failed to fetch products"));
    }
    dispatch(setLoading(false));
};

export const fetchSearchProducts = (searchQuery: string) => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
        const products = await fetchProductsFromAPI(1, 30, "");
        const filteredProducts = products.filter((product: IProduct) =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        dispatch(setSearchingProducts(filteredProducts));
    } catch (error) {
        dispatch(setError("Failed to fetch products"));
    }
    dispatch(setLoading(false));
};
