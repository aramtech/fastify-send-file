import Fastify from 'fastify'
import send_file from './index.js'

import process from 'node:process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { describe, test, expect, afterEach, beforeEach } from 'vitest'

describe('plugin tests', () => {
    const test_dir_path = path.join(os.tmpdir(), 'fastify-send-file-tmp-dir')
    const create_file_path = name => path.join(test_dir_path, name)
    
    const file_contents = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>COOL DOCUMENT</title>
        </head>
        <body>
            <h1>COOL TITLE</h1>
        </body>
        </html>
    `


    beforeEach(() => {
        if (fs.existsSync(test_dir_path)) {
            fs.rmSync(test_dir_path, { recursive: true })
        }

        fs.mkdirSync(test_dir_path)


        fs.writeFileSync(create_file_path('file.html'), file_contents, 'utf8')
    })

    afterEach(() => {
        if (fs.existsSync(test_dir_path)) {
            fs.rmSync(test_dir_path, { recursive: true })
        }
    })

    test('should throw an error if the file is not found.', async () => {
        const app = Fastify({ logger: false })
        await app.register(send_file)
        
        app.get('/', (_req, rep) => {
            rep.send_file(create_file_path('boom.html'))
        })

        const { statusCode } = await app.inject({
            method: 'GET',
            url: '/'
        })

        expect(statusCode).toBe(500)
    })

    test('should serve the file specified.', async () => {
        const app = Fastify({ logger: false })
        await app.register(send_file)
        
        app.get('/', (_req, rep) => {
            rep.send_file(create_file_path('file.html'))
        })

        const { statusCode, body, headers } = await app.inject({
            method: 'GET',
            url: '/'
        })

        expect(statusCode).toBe(200)
        expect(body).toEqual(file_contents)
    })
})
