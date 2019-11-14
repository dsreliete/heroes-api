//classe customizada de erro
class NotImplementedException extends Error {
    constructor() {
        super("Not Implemented Exception")
    }
}

//simulacao de interface mas é uma classe mae 
class ICrud {
    create(item) {
        throw new NotImplementedException();
    }
    read(item) {
        throw new NotImplementedException();
    }
    update(id, item) {
        throw new NotImplementedException();
    }
    delete(id) {
        throw new NotImplementedException();
    }
    isConnected(){
        throw new NotImplementedException();
    }
    connect(){
        throw new NotImplementedException();
    }
}

module.exports = ICrud