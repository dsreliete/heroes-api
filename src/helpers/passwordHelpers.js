const Bcrypt = require('bcrypt')

const {
    promisify
} = require('util')

const hashAsync = promisify(Bcrypt.hash)
const compareAsync = promisify(Bcrypt.compare)
const SALT = parseInt(process.env.SALT_PSWD)

class PasswordHelper {
    //cria um hash da senha passada
    static hashPassword(pass) {
            return hashAsync(pass, SALT)
    }

    //compara hashs
    static comparaPasswords(pass, hash){
        return compareAsync(pass, hash)
    }
}

module.exports = PasswordHelper