const User = require('./User');
const ServiceRequest = require('./ServiceRequest');

// Associations
User.hasMany(ServiceRequest, {
  foreignKey: 'user_id',
  as: 'serviceRequests',
  onDelete: 'CASCADE',
});

ServiceRequest.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

module.exports = { User, ServiceRequest };
