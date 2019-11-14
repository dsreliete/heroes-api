//npm i jsonwebtoken -> gera um token de autorizacao
const BaseRoute = require('./base/baseRoute')
const Joi = require('joi')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('./../helpers/passwordHelpers')

const failAction = (request, h, err) => { throw err }

class AuthRoutes extends BaseRoute {
    constructor(secret, db) {
        super()
        this.secret = secret
        this.db = db
    }
    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false, //nap precisa de token
                tags: ['api'],
                description:'obter token',
                notes: 'faz login com user e senha do banco',
                validate: {
                    failAction,
                    payload: {
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    }
                }
            },
            handler: async (request) => {
                const { username, password } = request.payload

                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })

                if(!usuario) {
                    return Boom.unauthorized('O usuario informado nao existe')
                }

                const match = await PasswordHelper.comparaPasswords(password, usuario.password)

                if(!match) {
                    return Boom.unauthorized('O usuario ou senha inválidos')
                }

                //passa um username e id simulando reorno do banco e uma chave privada
                const token = Jwt.sign({
                    username: username,
                    id: usuario.id
                }, this.secret)
                return {
                    token: token
                }

            }
        }
    }
    
}

module.exports = AuthRoutes