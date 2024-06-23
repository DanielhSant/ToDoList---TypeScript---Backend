//construção da API user, vou fazer uma criptografia do usuário e então salva-lo no banco de dados

const bcrypt = require ('bcrypt-nodejs')

module.exports = app => {
    //Trouxe os metodos de validações anteriormente criado
    const {existOrError, notExistOrError, equalOrError} = app.api.validation


    //função de criptografia
    const encryptPassword = password => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    //método de salvamento

    const save = async (req, res) => {
        const user = {...req.body}
        if(req.body.id) user.id = req.params.id

        //implementar lógica para não permitir que alguem se cadastre diretamente sem sem admin
        
        
        try {
            existOrError(user.name, 'Nome não informado')
            existOrError(user.email, 'E-mail não informado')
            existOrError(user.password, 'Senha não informada')
            existOrError(user.confirmPassword, 'Confirmação de senha inválida')
            equalOrError(user.password, user.confirmPassword, 'Senhas não conferem')

            const userFromDB = await app.db('users')
                .where({email: user.email}).first()
            //Verifica se usuário já existe
            if(!user.id){
                notExistOrError(userFromDB, 'Usuário já cadastrado')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        //criptografia da senha do usuário
        user.password = encryptPassword(user.password)
        
        //retirar a confirmação da senha para que não entre no banco de dados
        delete user.confirmPassword

        if(user.id){
            //Verifica se o user está registrado para poder fazer um update
            app.db('users')
                .update(user)
                .where({id: user.id})
                .then(_ => res(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            //Caso não esteja ele insere o novo usuário
            app.db('users')
                .insert(user)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    //metodo get dos clientes
    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .then(users => res.json(users))
            .catch(err => res.status(500).send(err))
    }

    //metodo get de cliente por id
    const getById = (req, res) => {
        app.db('users')
            .select('id', 'nome', 'email', 'admin')
            .where({id: req.params.id})
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            const rowsDeleted = await app.db('users')
                .where({id: req.params.id}).del()
            existOrError(rowsDeleted, 'Usuário não foi encontrado')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return {save, get, getById, remove}
}