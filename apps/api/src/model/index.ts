import { Sequelize } from 'sequelize';

import createAlbum from './album';
import createAlbumPhoto from './album-photo';
import createExif from './exif';
import createPhoto from './photo';
import createSetting from './setting';
import createThumbnail from './thumbnail';

const database = process.env.DB_DATABASE || 'here';
const username = process.env.DB_USERNAME || 'root';
const password = process.env.DB_PASSWORD || '123456';
const host = process.env.DB_HOST || 'localhost';
const port = +(process.env.DB_PORT || 3306);
// Database connection instance
const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
  timezone: '+08:00',
  logQueryParameters: true,
  // logging: false,
});

// Create database models
const Exif = createExif(sequelize);
const Album = createAlbum(sequelize);
const Photo = createPhoto(sequelize);
const Setting = createSetting(sequelize);
const Thumbnail = createThumbnail(sequelize);
const AlbumPhoto = createAlbumPhoto(sequelize);

// [START] Define associations
Photo.belongsToMany(Album, { through: AlbumPhoto, as: 'albums' });
const photoExif = Photo.hasOne(Exif, { foreignKey: 'photoId', as: 'exif' });
Exif.belongsTo(Photo, { foreignKey: 'photoId' });
const photoThumbnails = Photo.hasMany(Thumbnail, {
  foreignKey: 'photoId',
  as: 'thumbnails',
});

const albumCover = Album.belongsTo(Photo, {
  as: 'cover',
  foreignKey: 'coverId',
});
const albumPhotos = Album.belongsToMany(Photo, {
  through: AlbumPhoto,
  as: 'photos',
});

Thumbnail.belongsTo(Photo, { foreignKey: 'photoId' });
// [END] Define associations

export default {
  sequelize,
  Album,
  AlbumPhoto,
  Exif,
  Photo,
  Setting,
  Thumbnail,
  photoExif,
  photoThumbnails,
  albumCover,
  albumPhotos,
};
