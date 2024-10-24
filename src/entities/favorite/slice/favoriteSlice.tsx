import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteState {
    favoriteIds: number[];
}

const initialState: FavoriteState = {
    favoriteIds: [],
};

const favoriteSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        addFavorite: (state, action: PayloadAction<number>) => {
            if (!state.favoriteIds.includes(action.payload)) {
                state.favoriteIds.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<number>) => {
            state.favoriteIds = state.favoriteIds.filter(id => id !== action.payload);
        },
        clearFavorites: (state) => {
            state.favoriteIds = [];
        }
    },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
