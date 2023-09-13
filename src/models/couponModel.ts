import { DataTypes, Model } from 'sequelize';
import { type CouponAttributes } from '../types/models/couponTypes';

export class Coupon
    extends Model<CouponAttributes>
    implements CouponAttributes
{
    id: number;
    maxUsuage: number;
    usage: number;
    code: string;
}

export default (sequelize): typeof Coupon => {
    return Coupon.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            maxUsuage: {
                type: DataTypes.INTEGER,
            },
            usage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            code: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        { sequelize }
    );
};
