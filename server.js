import Fastify from 'fastify'
import send_file from './index.js'

const app = Fastify({ logger: true })

await app.register(send_file)

app.get('/', (_, rep) => {
    return rep.send_file('./bar.html')
})

await app.listen({ port: 3000 })
