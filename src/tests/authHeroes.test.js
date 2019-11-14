const assert = require('assert')
const api = require('../../api')
const DBContext = require('./../db/strategies/base/dbContextStrategies')
const Postgres = require('./../db/strategies/postgres/postgres')
const UserSchema = require('./../db/strategies/postgres/schemas/usuarioSchema')

const USER = {
    username: 'xuxadasilva',
    password: '12345'
}

const USER_DB = {
    ...USER,
    password: '$2b$04$WYeWq8Ir.i1TpJB6VHAHN.85g/.JjHQUiaYMfqj6wZLxIFFqYZwIq'
}

let app = {}

describe('Auth test suite', function () {
    this.beforeAll(async () => {
        app = await api

        //insere um dado no banco automaticament pq nao temos rota de cadastro
        const connectionPostgress = await Postgres.connect()
        const model = await Postgres.defineModel(connectionPostgress, UserSchema)
        const context = new DBContext(new Postgres(connectionPostgress, model))
        await context.update(null, USER_DB, true)
    })

    it('deve obter um token', async () => {
        const result = await app.inject({
            method:'POST',
            url:'/login',
            payload: USER
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.token.length > 10)
    })

    it('deve retonar nao autorizado ao tentar fazer login nao existente', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'eliete',
                password: '123'
            }
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 401)
        assert.deepEqual(dados.error, "Unauthorized")
    })

})