import { DataTypes, type Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  return sequelize.define(
    'Exif',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      shotTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      cameraMake: DataTypes.CHAR(50),
      cameraModel: DataTypes.CHAR(50),
      iso: DataTypes.SMALLINT,
      gpsLatitude: DataTypes.FLOAT,
      gpsLongitude: DataTypes.FLOAT,
    },
    { underscored: true }
  );
};
