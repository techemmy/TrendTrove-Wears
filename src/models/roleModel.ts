import { Model, DataTypes } from "sequelize";
import { RoleAttributes } from "../types/models/roleType";

class Role extends Model<RoleAttributes> implements RoleAttributes {
  id: number;
  name: string;
  permissions: number;
}

export default (sequelize) => {
  return Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      permissions: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { sequelize }
  );
};
