const ICrud = require('./../interfaces/interfaceCrud')
const Mongoose = require('mongoose')

const STATUS = {
    0: 'Disconectado', 
    1: 'Conectado', 
    2: 'Conectando', 
    3: 'Disconectando'
}

class MongoDBStrategy extends ICrud{
    constructor(connection, schema) {
        super();
        this._schema = schema
        this._connection = connection
    }

    async isConnected() {
        const state = STATUS[this._connection.readyState]
        if(state === 'Conectado') return state;
        
        if(state !== 'Conectando') return state

        await new Promise(resolve => setTimeout(resolve, 1000))

        return STATUS[this._connection.readyState]
    }
    
    static connect() {
        Mongoose.connect(process.env.MONGODB_URL,
            { useNewUrlParser: true }, function (error) {
                if (!error) return;
                console.log('Falha na conexao', error)
            })
        const connection = Mongoose.connection
        connection.once('open', () => console.log('database rodando!!!'))  
        return connection
    }

    async create(item) {
        return await this._schema.create(item)
    }

    async read(item, skip, limit) {
        return await this._schema.find(item).skip(skip).limit(limit)
    }

    update(id, item){
        return this._schema.updateOne({_id: id}, {$set: item})
    }

    delete(id) {
        return this._schema.deleteOne({_id : id})
    }

}

module.exports = MongoDBStrategy