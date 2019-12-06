const HappeningService = {
  getAllHappeningEvents(db) {
    return db
      .select('*')
      .from('happening');
  },
  getIndividualHappeningEvent(db,id) {
    return db
      .select('*')
      .from('happening')
      .where({ id });
  },
  insertHappeningEvent(db, newHappening) {
    return db
      .insert(newHappening)
      .into('happening')
      .returning('*')
      .then(res => res[0]);
  },
  deleteHappeningEvent(db, id) {
    return db
      .from('happening')
      .where( {id} )
      .delete();
  }
};

module.exports = HappeningService;