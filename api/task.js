
/* Informações que conterão nas tasks
    - Id
    - Nome da task (name)
    - Se está concluida ou não (done)

*/

module.exports = app => {
    const  { existOrError } = app.api.validation

    const save = (req, res) => {
        const task = {...req.body}
        if(req.params.id) task.id = req.params.id

        if(task.id){
            app.db('tasks')
                .update(task)
                .where({id: task.id})
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        } else {
            app.db('tasks')
                .insert(task)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }
    const remove = async (req, res) => {
        try {
            existOrError(req.params.id, 'Código da Tarefa não informado.')

            const rowsDeleted = await app.db('tasks')
                .where({id: req.params.id}).del()

            existOrError(rowsDeleted, 'Task não foi encontrada')

            res.status(204).send()
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    const get = (req, res) => {
        app.db('tasks')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(500).send(err))
    }

    const getByUserId = (req, res) => {
        const userId = req.params.userId

        app.db('tasks')
            .where({userId: userId})
            .then(task => res.json(task))
            .catch(err => res.status(500).send(err))
    }

    return { save, remove, get, getByUserId }
}