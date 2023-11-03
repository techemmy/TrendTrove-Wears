export interface ProductAttributes {
    id?: number;
    name: string;
    price: string;
    category: string;
    sizes?: string[];
    shortDescription: string;
    longDescription?: string;
    available: boolean;
    imageURL: string;
}
