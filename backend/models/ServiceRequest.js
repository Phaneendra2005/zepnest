const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../config/database');

const ServiceRequest = sequelize.define(
  'ServiceRequest',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM('Plumbing', 'Electrical', 'Cleaning', 'Carpentry', 'Other'),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    preferred_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Completed', 'Cancelled'),
      defaultValue: 'Pending',
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: 'service_requests',
    timestamps: true,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['status'] },
    ],
  }
);

module.exports = ServiceRequest;
