import { DataTypes, Model } from "sequelize";
import { type AddressAttributes } from "../types/models/addressTypes";

class Address extends Model<AddressAttributes> implements AddressAttributes {
  id: number;
  street: string;
  city: string;
  country: string;
}

export default (sequelize): typeof Address => {
  return Address.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { sequelize }
  );
};
