class DBContextStrategy {
    constructor(database) {
        this._database = database;
    }
    create(item) {
        return this._database.create(item);
    }
    read(item, skip, limit) {
        return this._database.read(item, skip, limit);
    }
    update(id, item, upsert) {
        return this._database.update(id, item, upsert);
    }
    delete(id) {
        return this._database.delete(id);
    }
    isConnected() {
        return this._database.isConnected()
    }
    connect() {
        return this._database.connect()
    }
}

module.exports = DBContextStrategy