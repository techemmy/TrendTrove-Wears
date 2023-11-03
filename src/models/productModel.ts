import { DataTypes, Model } from 'sequelize';
import { PRODUCT_CATEGORIES, PRODUCT_SIZES } from '../constants';
import { type ProductAttributes } from '../types/models/productTypes';

export class Product
    extends Model<ProductAttributes>
    implements ProductAttributes
{
    id: number;
    name: string;
    price: string;
    category: string;
    size: string;
    sizes: string[];
    color: string;
    shortDescription: string;
    longDescription: any;
    available: boolean;
    imageURL: string;
}

export function productFactory(sequelize): typeof Product {
    return Product.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            category: {
                type: DataTypes.ENUM(...Object.values(PRODUCT_CATEGORIES)),
                allowNull: false,
            },
            size: {
                type: DataTypes.INTEGER,
            },
            sizes: {
                type: DataTypes.ARRAY(DataTypes.STRING),
            },
            color: {
                type: DataTypes.STRING,
            },
            shortDescription: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            longDescription: {
                type: DataTypes.STRING,
            },
            available: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            imageURL: DataTypes.STRING,
        },
        { sequelize }
    );
}
