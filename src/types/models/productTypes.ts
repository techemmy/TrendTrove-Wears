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
