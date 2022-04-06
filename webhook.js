const http = require('http')
const crypto = require('crypto')
const child_process = require('child_process')
const nodemailer = require('./nodemailer')

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
            const event = req.headers['x-github-event']
            const body = Buffer.concat(buffers)
            if(sign(body) !== signature) {
                return res.end('NOT FOUND')
            }
            res.setHeader('Content-type', 'application/json')
            res.end(JSON.stringify({
                ok: true
            }))
            if(event === 'push') {
                const payload = JSON.parse(body.toString())
                const spawn = child_process.spawn
                const buffers = []
                console.log('执行脚本')
                const child = spawn('sh', [`./${payload.repository.name}.sh`])

                child.stdout.on('data', (buffer) => {
                    buffers.push(buffer)
                })
                child.stdout.on('end', () =>{
                    const log = Buffer.concat(buffers).toString()
                    console.log('发送邮箱')
                    nodemailer(`
                        <h3>部署时间：${new Date()}</h1>
                        <h3>部署人: ${payload.pusher.name}</h1>
                        <h3>部署邮箱：${payload.pusher.email}</h1>
                        <h3>提交信息：${payload.head_commit.message}</h1>
                        <h4>部署日志：${log.replace('\r\n', '<br/>')}</h1>
                    `)

                })
            }
        })
    } else {
        res.end('NOT FOUNT')
    }
})


app.listen(4000, () => {
    console.log('webhook服务器启动在http://localhost:4000')
})
