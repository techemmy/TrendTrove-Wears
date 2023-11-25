export interface ProductAttributes {
    id?: number;
    name: string;
    price: number;
    category: string;
    sizes?: string[];
    shortDescription: string;
    longDescription?: string;
    available: boolean;
    imageURL: string;
}

export interface CategoryCount {
    category: string;
    count: number;
}

export interface SizesCount {
    sizes: [string];
    count: number;
}
