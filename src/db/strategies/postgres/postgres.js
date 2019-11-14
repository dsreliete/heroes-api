const ICrud = require('./../interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class PostgreSQLStrategy extends ICrud {
    constructor(connection, schema) {
        super();
        this._connection = connection //_ define variavel privada
        this._schema = schema
    }

    async isConnected() {
        try {
            await this._connection.authenticate
            return true
        } catch (error) {
            console.log('fail connection', error)
            return false;
        }
    }

    static async connect() {
        const connection = new Sequelize(process.env.POSTGRES_URL, {   
            quoteIdentifiers: false, // case sensitive
            operatorsAliases: false, // deprecation warning
            logging : false,
            ssl: process.env.SSL_DB,
            dialectOptions: { 
                ssl: process.env.SSL_DB 
            }
        })
        return connection
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        await model.sync()
        return model
    }

    //retorna uma serie de coisas, mas o necessario é dataValues
    async create(item) {
        const { dataValues } = await this._schema.create(item)
        return dataValues
    }

    async read(item){
        return this._schema.findAll({where: item, raw: true})
    }

    //retorna apenas 0 ou 1 e senao existir insere um heroi
    async update(id, item, upsert = false) {
        const fn = upsert ? 'upsert' : 'update'

        return await this._schema[fn](item, {
            where: { id }
        })
    }

    async delete(id) {
        const query = id ? { id } : {}
        return this._schema.destroy({where: query})
    }
}

module.exports = PostgreSQLStrategy