const { db } = require('./admin')

const createProfile = (userRecord, context) => {
  const { uid, email } = userRecord

  return db
    .collection('users')
    .doc(uid)
    .set({ email })
    .catch(console.error)
}

module.exports = { createProfile }
