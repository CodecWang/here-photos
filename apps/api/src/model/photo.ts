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
  tags?: string;
  checkSum: string;
  blurHash?: string;
  shotTime: Date;
  modifiedTime: Date;
  features?: Buffer;
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
      tags: DataTypes.STRING,
      checkSum: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      blurHash: DataTypes.CHAR(32),
      shotTime: DataTypes.DATE,
      modifiedTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      features: DataTypes.BLOB,
    },
    { underscored: true },
  );
};
