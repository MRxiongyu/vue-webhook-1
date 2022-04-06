const http = require('http')
const crypto = require('crypto')

const Secret = '123456'

const sign = (body) => {

    return 'sha1=' + crypto.createHmac('sha1', Secret).update(body).digest('hex')
}

const app = http.createServer((req, res) => {
    console.log(req)
    if(req.url==='/webhook' && req.method ==='POST') {


        const buffers = []
        req.on('data', (bufferBean) => {
            buffers.push(bufferBean)
        })

        req.on('end', () => {
            const signature = req.headers['x-hub-signature']
            const body = Buffer.concat(buffers)
            if(sign(body) === signature) {
                const payload = body.toString()
                console.log(payload)
                res.setHeader('Content-type', 'application/json')
                return res.end(JSON.stringify({
                    ok: true
                }))
            }

            return res.end('NOT FOUND')
        })

    }
    return res.end('NOT FOUNT')
})


app.listen(4000, () => {
    console.log('webhook服务器启动在http://localhost:4000')
})
