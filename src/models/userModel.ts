import { DataTypes, Model } from "sequelize";
import { UserAttributes } from "../types/models/userType";

class User extends Model<UserAttributes> implements UserAttributes {
  id: number;
  email: string;
  providerIdentity: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export default (sequelize) => {
  return User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      providerIdentity: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    { sequelize }
  );
};
