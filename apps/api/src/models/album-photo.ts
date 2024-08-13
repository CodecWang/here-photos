import { type Sequelize } from 'sequelize';

export default (sequelize: Sequelize) => {
  return sequelize.define('AlbumPhoto', {}, { underscored: true });
};
