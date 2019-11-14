const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelpers')

const SENHA = 'Eliete@12345'
const HASH = '$2b$04$ujryfIGHgRGJL43b74Am2.I.gZeisFf1w4xshZkTQAuS8Ik9D7Dx6' 

describe('UserHelper test suite', function () {

    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(SENHA)
        assert.ok(result.length > 10)
    })

    it('deve validar nossa senha: compara senha e seu hash', async () => {
        const result = await PasswordHelper.comparaPasswords(SENHA, HASH)
        assert.ok(result)
    })
})