const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

//se eu quiser rdar em amb de producao: cross-env NODE_ENV=prod npm t
//pra rodar em dev é so dar npm t mesmo
const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "env invalida")

const dirname = __dirname.split("/src")
const configPath = join(dirname[0], './config', `.env.${env}`)
//configura o path dos arquivos que o dotenv deve encontrar para ler as variaveis de ambiente
config({
    path: configPath
})

const assert = require('assert')
const api = require('../../api')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Biônica'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Gavião Negro',
    poder: 'Mira'
}

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTU0NzU4MjczMX0.HR2iLJsk5sTXxtnpjU8ZYJaq2Mg0PauXe3iYAX-BsS0'
const headers = {
    Authorization: TOKEN
}

let app = {}
let MOCK_ID_ATUALIZAR = {}

describe('suite de teste de Api Heroes', function () {
    this.beforeAll(async () => {
        app = await api

        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: MOCK_HEROI_ATUALIZAR
        })

        const dados = JSON.parse(result.payload)
        MOCK_ID_ATUALIZAR = dados._id
    })

    it('cadastrar herois - POST', async () => {
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            headers,
            payload: MOCK_HEROI_CADASTRAR
        })

        const statusCode = result.statusCode
        const {
            message,
            _id
        } = JSON.parse(result.payload)

        assert.notStrictEqual(_id, undefined)
        assert.ok(statusCode === 200)
        assert.deepEqual(message, "Heroi cadastrado com sucesso")
    })

    it('listar herois por meio - GET', async () => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois'
        })
        dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        // console.log('result', result)
        // console.log('payload', result.payload)
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('listar herois com nome especifico ', async () => {
        const NOME = MOCK_HEROI_CADASTRAR.nome
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=10&nome=${NOME}`
        })
        dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        // console.log('result', result)
        // console.log('payload', result.payload)
        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome === NOME)
    })

    it('listar herois com nome incompleto pra testar regex', async () => {
        const NOME = 'Gavião'
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=10&nome=${NOME}`
        })
        dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
    })

    it('listar herois com limite estranho: retorna erro ', async () => {
        const TAMANHO_LIMITE = 'AEE'
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 400)

        const errorResult = {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "child \"limit\" fails because [\"limit\" must be a number]",
            "validation": {
                "source": "query",
                "keys": ["limit"]
            }

        }
        assert.deepEqual(result.payload, JSON.stringify(errorResult))
    })

    it('listar herois com limite diferente do default ', async () => {
        const TAMANHO_LIMITE = 3
        const result = await app.inject({
            method: 'GET',
            headers,
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })
        dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        // console.log('result', result)
        // console.log('payload', result.payload)
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })

    it('atualizar heroi - PATCH ', async () => {
        const expected = {
            poder: 'Super Mira'
        }

        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${MOCK_ID_ATUALIZAR}`,
            payload: JSON.stringify(expected)
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi atualizado com sucesso')
    })

    it('atualizar heroi que nao existe no BD retorna msg de erro', async () => {
        const idInexistente = `5c2e69aa507655827ab6970f`

        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${idInexistente}`,
            payload: JSON.stringify({ poder: 'Super' })
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encontrado no banco'
        }
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })

    it('atualizar heroi com id incorreto retorna msg de erro', async () => {
        const idInexistente = `id`

        const result = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${idInexistente}`,
            payload: JSON.stringify({ poder: 'Super' })
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
        }
        assert.ok(statusCode === 500)
        assert.deepEqual(dados, expected)
    })

    it('remover heroi - DELETE /herois/:id', async () => {
        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${MOCK_ID_ATUALIZAR}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Heroi removido com sucesso')
    })

    it('remover heroi nao encontrado deve retornar erro', async () => {
        const MOCK_ID_ATUALIZAR = '5c36518157e536a2adbc889c'

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${MOCK_ID_ATUALIZAR}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id não encontrado no banco'
        }
        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })

    it('remover heroi com id incorreto deve retornar erro', async () => {
        const MOCK_ID_ATUALIZAR = 'id'

        const result = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${MOCK_ID_ATUALIZAR}`
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
        }
        assert.ok(statusCode === 500)
        assert.deepEqual(dados, expected)
    })
})