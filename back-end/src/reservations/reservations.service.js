const knex = require('../db/connection');
const tableName = 'reservations'

function create(reservation) {
    return knex(tableName)
      .insert(reservation)
      .returning("*")
      .then((res) => res[0]);
}

function read(reservation_id) {
    return knex(tableName)
        .where({ reservation_id })
        .then((res) => res[0])
        .catch(() => {});
}

function update(reservation_id, updatedReservation) {
    return knex(tableName)
      .where({ reservation_id })
      .update(updatedReservation)
      .returning('*')
      .then((res) => res[0]);
  }

module.exports = {
    create,
    read,
    update,
}