'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
          type: Sequelize.STRING,
      },
      last_name: {
          type: Sequelize.STRING,
      },
      email: {
          type: Sequelize.STRING,
          unique: true,
      },
      password: {
          type: Sequelize.STRING,
      },
      phone: {
          type: Sequelize.STRING,
      },
      dob: {
          type: Sequelize.DATE,
      },
      address: {
          type: Sequelize.STRING,
      },
      gender: {
          type: Sequelize.STRING,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
