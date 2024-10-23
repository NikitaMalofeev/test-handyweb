
export interface IProduct {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
    description?: string;
    rating?: {
        rate: string,
        count: number
    }
}