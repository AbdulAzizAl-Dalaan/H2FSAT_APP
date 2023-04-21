const CPA_A = require('./CPA_A');
const CPA_Q = require('./CPA_Q');

CPA_Q.hasMany(CPA_A, { foreignKey: 'questionId' });

module.exports = { CPA_A, CPA_Q };