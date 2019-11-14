//npm i boom -> lib pra tratamento de erro customizado
const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

const failAction = (request, h, err) => { throw err }

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }
// http://localhost:5000/herois?skip=0&limit=10
    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                tags: ['api'],
                description: 'listar heróis',
                notes: 'filtra nomes e pagina resultados',
                //valida os dados da requisicao
                //payload -> body
                //headers -> header
                //params -> na URL: id
                //query -> ?skip=0&limit=10
                validate: {
                    failAction: failAction,
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    },
                    headers
                }
            },
            handler: (request, headers) => {
                try {
                    const {
                        skip,
                        limit,
                        nome
                    } = request.query

                    //traga tudo que tenha um pedaco da query nome enviada 
                    //usando modulo regex do node 
                    const query = {
                        nome: { $regex: `.*${nome}*.` }
                    }

                    return this.db.read(nome ? query : {}, skip, limit)
                } catch (error) {
                    console.log('Deu ruim!!!', error);
                    return Boom.internal()
                    // return 'Erro interno do Servidor';
                }
            }
        }
    }
// http://localhost:5000/herois
    create() {
        return {
            path:'/herois',
            method:'POST',
            config: {
                tags: ['api'],
                description: 'cadastrar heróis',
                notes: 'cadastra heróis por nome e poder',
                validate: {
                    //payload -> body
                    //headers -> header
                    //params -> na URL: id
                    //query -> ?skip=0&limit=10
                    failAction,
                    headers,
                    payload: {
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(3).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {
                        nome,
                        poder,
                    } = request.payload
                    const result = await this.db.create({nome, poder})
                    return {
                        message: 'Heroi cadastrado com sucesso',
                        _id: result._id
                    }
                } catch (error) {
                    console.log('Deu ruim!!!', error);
                    return Boom.internal()
                    // return 'Erro interno do Servidor';
                }
            }
        }
    }
// http://localhost:5000/herois/:id
    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                tags: ['api'],
                description: 'atualizar herói por id',
                notes: 'pode atualizar qualquer campo',
                validate: {
                    params: {
                        id: Joi.string().required()
                    },
                    headers,
                    payload: { //nao precisa de required pq o usuario pode mandar um dos objetos
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(3).max(100)
                    }
                }
            },
            handler: async (request) => {
                try {
                    const {
                        id
                    } = request.params;

                    // const payload = request.payload
                    const {
                        payload
                    } = request

                    //todas as chaves que tiver undefined, ou seja q nao tem valor 
                    //eu retiro da lista pra nao atualizar indevidamente
                    const dadosString = JSON.stringify(payload)
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)
                    
                    if(result.nModified !== 1) 
                        return Boom.preconditionFailed('Id não encontrado no banco')
                    
                    return {
                        message : 'Heroi atualizado com sucesso'
                    }
                } catch (error) {
                    console.log('Deu ruim!!!', error);
                    // return 'Erro interno do Servidor';
                    return Boom.internal()
                }
            }

        }
    }
// http://localhost:5000/herois/:id
    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                // informacao pra popular swagger: tags, description, notes
                tags: ['api'],
                description: 'deletar herói',
                notes: 'deleta herói por id',
                validate: {
                    failAction,
                    params: {
                        id: Joi.string().required()
                    }, 
                    headers
                }
            },
            handler: async (request) => {
                try {
                    const { id } = request.params;
                    const result = await this.db.delete(id)
                    if (result.n !== 1) 
                        return Boom.preconditionFailed('Id não encontrado no banco')
                    return {
                        message: 'Heroi removido com sucesso'
                    }
                } catch (error) {
                    console.log('Deu ruim!!!', error);
                    return Boom.internal()
                    // return 'Erro interno do Servidor';
                }
            }

        }
    }
}

module.exports = HeroRoutes