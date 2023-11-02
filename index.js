import fp from 'fastify-plugin'
import send from '@fastify/send'

async function send_file_plugin(app) {
    const send_file = function (filepath) {
        const reply = this

        const content_type = `${send.mime.getType(filepath) || send.mime.default_type}; charset=UTF-8`
        reply.header('Content-Type', content_type)

        const stream = send(reply.request.raw, filepath)

        stream.on('error', err => {
            if (err.code === 'ENOENT') {
                return reply.callNotFound()
            }
        })

        return reply.send(stream)
    }

    app.decorateReply('send_file', send_file)
    app.decorateReply('sendFile', send_file)
}

export default fp(send_file_plugin)
