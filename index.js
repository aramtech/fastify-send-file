import fp from 'fastify-plugin'
import { PassThrough } from 'node:stream'
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

        const wrapper = new PassThrough({
            flush(cb) {
                this.finished = true
                cb()
            }
        })

        wrapper.getHeader = reply.getHeader.bind(reply)
        wrapper.setHeader = reply.header.bind(reply)
        wrapper.removeHeader = () => { }
        wrapper.finished = false

        Object.defineProperty(wrapper, 'statusCode', {
            get: () => reply.raw.statusCode,
            set: next => reply.status(next)
        })

        wrapper.on('pipe', () => {
            reply.send(wrapper)
        })

        wrapper.on('error', err => {
            if (err.code === 'ENOENT') {
                reply.callNotFound()
            }
        })

        stream.pipe(wrapper)

        return this
    }

    app.decorateReply('send_file', send_file)
    app.decorateReply('sendFile', send_file)
}

export default fp(send_file_plugin)
