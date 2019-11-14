const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

//se eu quiser rdar em amb de producao: cross-env NODE_ENV=prod npm t
//pra rodar em dev é so dar npm t mesmo
const env = process.env.NODE_ENV || "dev"
ok(env === "prod" || env === "dev", "env invalida")
const configPath = join(__dirname, './config', `.env.${env}`)
//configura o path dos arquivos que o dotenv deve encontrar para ler as variaveis de ambiente
config({
    path: configPath
})
// console.log('ENV**', process.env) //printa todas as variaveis

const MongoDB = require('./src/db/strategies/mongodb/mongodb')
const HeroiSchema = require('./src/db/strategies/mongodb/schemas/heroisSchema')
const DBContext = require('./src/db/strategies/base/dbContextStrategies')
const HeroRoutes = require('./src/routes/heroRoutes')
const AuthRoutes = require('./src/routes/authRoutes')
const UtilRoutes = require('./src/routes/utilRoutes')
const Postgres = require('./src/db/strategies/postgres/postgres')
const UserSchema = require('./src/db/strategies/postgres/schemas/usuarioSchema')
const Hapi = require('hapi')
const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const JWT_SECRET = process.env.JWT_KEY
const HapiJwt = require('hapi-auth-jwt2')
const app = new Hapi.Server({
    port:process.env.PORT
})
// mapeia todos os metodos da classe que eu enviei como parametro
// retorna um array de execucao dos metodos definidos dentro da classe enviada. 
// pq fazemos isso? pra deixar somente a classe heroRoutes com a responsabilidade 
// de definir as rotas para heroes. Api.js deve ser mais abstrata possivel
function mapRoutes(instance, methods) {
    // console.log('rotas mapeadas', methods.map(method => instance[method]()))
    return methods.map(method => instance[method]())
}

async function main() {
    const connectionMongoDB = MongoDB.connect()
    const mongoDBContext = new DBContext(new MongoDB(connectionMongoDB, HeroiSchema))
    
    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UserSchema)
    const postgresContext = new DBContext(new Postgres(connectionPostgres, model))
    
    const swaggerOptions = {
        info: {
            title: 'API Heroes - #Curso NodeBR',
            version:'v1.0'
        },
        lang: 'pt'
    }
    
    await app.register([
        HapiJwt,
        Vision,
        Inert,
        //hapiswagger é plugin customizado, nao mantido pelo Hapi por isso tem padrao diferente
        {
          plugin: HapiSwagger,
          options: swaggerOptions   
        }
    ])
    //estrategia de autenticacao jwt
    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (dado, request) => {
            //verifica no banco se usuario continua ativo
            const [result] = await postgresContext.read({
                username: dado.username.toLowerCase()
            })
            if(!result) {
                return {
                    isValid:false
                }
            }
            return {
                isValid: true
            }
        }
    })
    app.auth.default('jwt') //define estrategia de autenticacao para o app 
    app.route([
        ...mapRoutes(new HeroRoutes(mongoDBContext), HeroRoutes.methods()),
        ...mapRoutes(new AuthRoutes(JWT_SECRET, postgresContext), AuthRoutes.methods()),
        ...mapRoutes(new UtilRoutes(), UtilRoutes.methods())
    ])
    // console.log('rotas', ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()))
    
    await app.start()
    console.log('servidor no ar', app.info.port)

    return app
}
module.exports = main()