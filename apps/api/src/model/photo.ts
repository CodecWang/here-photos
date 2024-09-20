import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { DataTypes } from 'sequelize';

interface PhotoModel
  extends Model<
    InferAttributes<PhotoModel>,
    InferCreationAttributes<PhotoModel>
  > {
  id: CreationOptional<number>;
  filePath: string;
  checkSum: string;
  blurHash?: string;
  shotTime: Date;
  modifiedTime: Date;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<PhotoModel>(
    'Photo',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      checkSum: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      blurHash: {
        type: DataTypes.CHAR(32),
      },
      shotTime: DataTypes.DATE,
      modifiedTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    { underscored: true },
  );
};
