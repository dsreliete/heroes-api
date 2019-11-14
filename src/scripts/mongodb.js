//comandos 
show dbs //mostra as databases = heroes
use heroes // muda contexto para 1 db especifica no caso heroes
show collections // mostra as colecoes = herois

//insere um heroi
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'

})

/*lista heroi
{ 
    "_id" : ObjectId("5c2e3a89265ef75e8b4b133b"), 
    "nome" : "Flash", 
    "poder" : "Velocidade", 
    "dataNascimento" : "1998-01-01" 
}*/
db.herois.find()
db.herois.find().pretty()
db.herois.findOne()
db.herois.find().limit(200).sort({nome: -1})
/*
{ "_id" : ObjectId("5c2e3a89265ef75e8b4b133b"), "nome" : "Flash", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b757f"), "nome" : "Clone-99", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b757e"), "nome" : "Clone-98", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b757d"), "nome" : "Clone-97", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b757c"), "nome" : "Clone-96", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b757b"), "nome" : "Clone-95", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b757a"), "nome" : "Clone-94", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7579"), "nome" : "Clone-93", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7578"), "nome" : "Clone-92", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7577"), "nome" : "Clone-91", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7576"), "nome" : "Clone-90", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7525"), "nome" : "Clone-9", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7575"), "nome" : "Clone-89", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7574"), "nome" : "Clone-88", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7573"), "nome" : "Clone-87", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7572"), "nome" : "Clone-86", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7571"), "nome" : "Clone-85", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b7570"), "nome" : "Clone-84", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b756f"), "nome" : "Clone-83", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
{ "_id" : ObjectId("5c2e400de0ba5572170b756e"), "nome" : "Clone-82", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
*/
db.herois.find({}, {poder: 1, _id: 0}) // traz somente poder e isenta id pq vem nos resultados por default
/*
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
{ "poder" : "Velocidade" }
*/


//codigo js funciona dentro do mongo kkkkk
for (let i=0; i<= 500; i ++) {
    db.herois.insert({
        nome: `Clone-${i}`,
        poder: 'Velocidade',
        dataNascimento: '1998-01-01'

    })
}

//update: 
//se eu quiser alterar um campo e manter o resto das informacoes
// { "_id" : ObjectId("5c2e3a89265ef75e8b4b133b"), "nome" : "Flash", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
db.herois.update({ _id: ObjectId("5c2e3a89265ef75e8b4b133b")}, 
                 { $set : {nome: 'Mulher Maravilha'}
                })
//WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
// { "_id" : ObjectId("5c2e3a89265ef75e8b4b133b"), "nome" : "Mulher Maravilha", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }


//se eu quiser alterar um campo a partir de um id e eliminar o resto. Nao é interessante isso, mas é possivel fazer...
//Exemplo clone 99:
// { "_id" : ObjectId("5c2e400de0ba5572170b757f"), "nome" : "Clone-99", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
db.herois.update({ _id: ObjectId("5c2e400de0ba5572170b757f") },
                 { nome: 'Lanterna Verde' })
//WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
// { "_id" : ObjectId("5c2e400de0ba5572170b757f"), "nome" : "Lanterna Verde" }

//CUIDADO se eu errar o nome do campo que eu qro fazer update. Por exemplo:
// { "_id" : ObjectId("5c2e400de0ba5572170b757a"), "nome" : "Clone-94", "poder" : "Velocidade", "dataNascimento" : "1998-01-01" }
db.herois.update({ _id: ObjectId("5c2e400de0ba5572170b757a") },
                 { $set : {name: 'Lanterna Verde' }
                })
//nesse caso ele vai adicionar um campo novo
//{ "_id" : ObjectId("5c2e400de0ba5572170b757a"), "nome" : "Clone-94", "poder" : "Velocidade", "dataNascimento" : "1998-01-01", "name" : "Lanterna Verde" }

//se eu quiser fazer update em um valor que é repetitivo ele so vai altera no primeiro que encontrar
db.herois.update({poder : 'Velocidade'},
                 { $set : {poder : 'força superior'}
                })
db.herois.find({ poder: 'força superior' }).count() // = 1
db.herois.find({ poder: 'Velocidade' }).count() // 500


//delete
db.herois.remove({_id : ObjectId("5c2e400de0ba5572170b7525")}) // remove id 9
//WriteResult({ "nRemoved" : 1 })
db.herois.find({ poder: 'Velocidade' }).count() // 499 

db.herois.remove({}) // precisa de query, se eu passar um objeto vazio remove tudo
// WriteResult({ "nRemoved" : 501 })
