import { Sequelize } from 'sequelize';

import createAlbum from './album';
import createAlbumPhoto from './album-photo';
import createExif from './exif';
import createPhoto from './photo';
import createSetting from './setting';
import createThumbnail from './thumbnail';

const sequelize = new Sequelize('echo', 'root', '123456', {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  timezone: '+08:00',
  logQueryParameters: true,
  // logging: false,
});

const Album = createAlbum(sequelize);
const Photo = createPhoto(sequelize);
const Exif = createExif(sequelize);
const Thumbnail = createThumbnail(sequelize);
const AlbumPhoto = createAlbumPhoto(sequelize);
const Setting = createSetting(sequelize);

// album.cover = photo
Album.belongsTo(Photo, { as: 'cover', foreignKey: 'coverId' });

// album.photos = photos
Album.belongsToMany(Photo, { through: AlbumPhoto, as: 'photos' });
// photo.albums = albums
Photo.belongsToMany(Album, { through: AlbumPhoto, as: 'albums' });

// photo.exif = exif
const photoExif = Photo.hasOne(Exif, { foreignKey: 'photoId', as: 'exif' });
// exif.photo = photo
Exif.belongsTo(Photo, { foreignKey: 'photoId' });

// photo.thumbnails = thumbnails
const photoThumbnails = Photo.hasMany(Thumbnail, {
  foreignKey: 'photoId',
  as: 'thumbnails',
});
Thumbnail.belongsTo(Photo, { foreignKey: 'photoId' });

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
};
