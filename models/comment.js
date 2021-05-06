'use strict'

module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        content: {
            type: DataTypes.UUID,
        },
    });
    Comment.associate = models => {
        Comment.belongsTo(models.User,{
            foreignKey: 'userId',
            as: 'user',
        })
    }
    return Comment;
}