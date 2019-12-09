const knex = require('knex')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL,
  })
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      password: 'password',
      email: 'testemail1@email.com'
    },
    {
      id: 2,
      username: 'test-user-2',
      password: 'password',
      email: 'testemail2@email.com'
    },
  ]
}

/**
 * make a bearer token with jwt for authorization header
 * @param {object} user - contains `id`, `username`
 * @param {string} secret - used to create the JWT
 * @returns {string} - for HTTP authorization header
 */
function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

/**
 * remove data from tables and reset sequences for SERIAL id fields
 * @param {knex instance} db
 * @returns {Promise} - when tables are cleared
 */
function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
            "user",
            "category",
            "movies",
            "tv_shows",
            "podcasts",
            "books",
            "movie_comments",
            "tv_show_comments",
            "podcast_comments",
            "book_comments"`
        )
        .then(() =>
          Promise.all([
            trx.raw(`ALTER SEQUENCE user_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE category_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE movies_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE tv_shows_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE podcasts_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE books_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE movie_comments_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE tv_show_comments_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE podcast_comments_id_seq minvalue 0 START WITH 1`),
            trx.raw(`ALTER SEQUENCE book_comments_id_seq minvalue 0 START WITH 1`),
          ])
        )
    )
  }
/**
 * insert users into db with bcrypted passwords and update sequence
 * @param {knex instance} db
 * @param {array} users - array of user objects for insertion
 * @returns {Promise} - when users table seeded
 */
function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.transaction(async trx => {
    await trx.into('user').insert(preppedUsers)

    await trx.raw(
      `SELECT setval('user_id_seq', ?)`,
      [users[users.length - 1].id],
    )
  })
}

function makeThreadArray(){
}

function makeCommentsArray(users){

}

function makeMaliciousComment(users, comments, threadId){

}

function makeMaliciousThreadTitle(user){

}

function makeMaliciousThreadDescription(user){
  
}


module.exports = {
  makeKnexInstance,
  makeUsersArray,
  makeAuthHeader,
  seedUsers,
  cleanTables,
}
