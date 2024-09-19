import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { DataTypes } from 'sequelize';

interface AlbumModel
  extends Model<
    InferAttributes<AlbumModel>,
    InferCreationAttributes<AlbumModel>
  > {
  id: CreationOptional<number>;
  title: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;

  coverId?: number;
  setCover: (photoId: number) => Promise<void>;
  addPhotos: (photoIds: number[]) => Promise<void>;
}

export default (sequelize: Sequelize) => {
  return sequelize.define<AlbumModel>(
    'Album',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.CHAR(64),
        allowNull: false,
        unique: true,
      },
      pinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    { underscored: true },
  );
};
