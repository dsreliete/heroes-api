//nao esqueca de instalar o mocha. Como? npm i --save-dev mocha
//se eu definir o nome do arquivo postgres.test.js
// na hora que eu rodar o teste eu posso chamar apenas mocha *.test.js

// ctrl + shift + crase cria terminal 
const assert = require('assert')
const Postgres = require('../db/strategies/postgres/postgres')
const HeroiSchema = require('./../db/strategies/postgres/schemas/heroisSchema')
const DBContext = require('../db/strategies/base/dbContextStrategies')

const MOCK_HEROI_CADASTRAR = { nome: 'Gaviao Negro', poder: 'flexas' };
const MOCK_HEROI_ATUALIZAR = { nome: 'Mulher Gavião', poder: 'grito' };

let context = {}

describe('Postgres Strategy', function () {
    this.timeout(Infinity)

    this.beforeAll(async () => {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroiSchema) 
        context = new DBContext(new Postgres(connection, model))

        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
    })
    
    it('verificar Postgres SQL Connection', async function () {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('cadastrar heroi', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('listar herois', async () => {
        const [result] = await context.read({nome : MOCK_HEROI_CADASTRAR.nome})
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('atualizar nome de um heroi', async () => {
        const [itemAtualizar] = await context.read({ nome : MOCK_HEROI_ATUALIZAR.nome })
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        assert.deepEqual(result, 1)

        const [itemAtualizado] = await context.read({ id: itemAtualizar.id })
        assert.deepEqual(itemAtualizado.nome, novoItem.nome)
    })

    it('remover heroi por id', async () => {
        const [heroi] = await context.read({})
        const result = await context.delete(heroi.id)
        assert.deepEqual(result, 1)
    })
})