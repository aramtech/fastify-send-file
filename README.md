
# fastify-send-file

Decorates your reply objects with a `send_file` function

# Installation

```bash
npm i aramtech/fastify-send-file --save # NOTE: DON"T FORGET THE `--save` 
```

# Usage

```js
import Fastify from 'fastify'
import send_file_plugin from 'fastify-send-file'
import path from 'node:path'
import process from 'node:process'

const app = Fastify()

app.register(send_file_plugin)

const filepath = path.join(process.cwd(), 'index.html')

app.get('/', async (_, rep) => await rep.send_file(filepath))

app.listen({ port: 3000 })
```

Now whenever the user hits `GET:/` they'll get `index.html` served to them

# Todo

- [ ] Add typescript type definition files

