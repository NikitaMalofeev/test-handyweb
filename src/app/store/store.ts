import catalogReducer from '../../entities/catalog/slice/catalogSlice';
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { useSelector, TypedUseSelectorHook } from 'react-redux';


export const store = configureStore({
    reducer: {
        catalog: catalogReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
