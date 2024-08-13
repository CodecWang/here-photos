import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { DataTypes } from 'sequelize';

interface SettingModel
  extends Model<
    InferAttributes<SettingModel>,
    InferCreationAttributes<SettingModel>
  > {
  id: CreationOptional<number>;
  key: string;
  value: string;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<SettingModel>(
    'Setting',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      key: {
        type: DataTypes.CHAR(32),
        allowNull: false,
        unique: true,
      },
      value: DataTypes.TEXT,
    },
    { underscored: true }
  );
};
