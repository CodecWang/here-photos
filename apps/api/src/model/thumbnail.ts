import type {
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { DataTypes } from 'sequelize';

enum ThumbnailVariant {}

interface ThumbnailModel
  extends Model<
    InferAttributes<ThumbnailModel>,
    InferCreationAttributes<ThumbnailModel>
  > {
  variant: ThumbnailVariant;
  size: number;
  filePath: string;
  width: number;
  height: number;
  format: string;
  photoId?: number;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<ThumbnailModel>(
    'Thumbnail',
    {
      variant: {
        type: DataTypes.TINYINT,
        allowNull: false,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      width: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      height: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      format: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { underscored: true }
  );
};
