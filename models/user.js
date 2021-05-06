'use strict'

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        first_name: {
            type: DataTypes.STRING,
        },
        last_name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
        },
        phone: {
            type: DataTypes.STRING,
        },
        dob: {
            type: DataTypes.DATE,
        },
        address: {
            type: DataTypes.STRING,
        },
        gender: {
            type: DataTypes.STRING,
        },
    },
    {
        instanceMethods: {
          toJSON: function () {
            var values = Object.assign({}, this.get());
                  return values;
          }
        }
      }
    );

    User.associate = models => {
        User.hasMany(models.Comment,{
            foreignKey: 'userId',
            as: 'comments',
        })
        User.belongsToMany(models.User,{
            as: 'User',
            foreignKey: 'userId',
            through: 'Follow'
        })
        User.belongsToMany(models.User,{
            as: 'Followed',
            foreignKey: 'followId',
            through: 'Follow'
        })
    }

    return User;
}