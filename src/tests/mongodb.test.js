//atualizar os arquivos na arvore no node:  rm -rf node_modules/ e depois npm i 
// se nao reconhecer mocha instala novamente npm i --save-dev mocha
const assert = require('assert')
const MongoDB = require('../db/strategies/mongodb/mongodb')
const HeroiSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const DBContext = require('../db/strategies/base/dbContextStrategies')
const MOCK_HEROI_CADASTRAR = { nome: 'Mulher Maravilha', poder: 'Laço' };
const MOCK_HEROI_ATUALIZAR = { nome: `Mulher Gavião-${Date.now()}`, poder: 'Grito' };
let MOCK_HEROI_ATUALIZAR_ID = ''
let context = {} 

describe('MongoDB suite de testes', function () {
    this.beforeAll(async () => {
        const connection = MongoDB.connect()
        // inicializo a estrategia de Mongo passando a conexao e o schema que eu vou utilizar
        context = new DBContext(new MongoDB(connection, HeroiSchema))

        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ATUALIZAR_ID = result._id
    })

    it('verificar conexao MongoDB', async function () {
        const result = await context.isConnected()
        const expected = 'Conectado'
        assert.deepEqual(result, expected)
    })

    it('cadastrar um heroi com sucesso', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('listar herois com sucesso', async () => {
        const [{nome, poder}] = await context.read({nome : MOCK_HEROI_CADASTRAR.nome})
        // const result = { nome, poder }
        // assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })

    it('atualizar um heroi', async () => {
        const item = { nome : 'Pernalonga',
                       poder: 'Velocidade'}

        const result = await context.update(MOCK_HEROI_ATUALIZAR_ID, item)
        assert.deepEqual(result.nModified, 1)
    })

    it('remover um heroi', async () => {
        const result = await context.delete(MOCK_HEROI_ATUALIZAR_ID)
        assert.deepEqual(result.n, 1)
    })
})