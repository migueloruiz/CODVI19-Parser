const router = require('express').Router()
const https = require('https');
const env = require('../config')

router.get('/', function (req, res) {
    getCIDVIData().then((data) => {
        tweetData(parseCODVIData(data))
        res.sendStatus(200)
    }).catch((error) => {
        console.log(error)
        res.status(404) //.json(error)
    })
})

module.exports = router

getCIDVIData = () => {
    return new Promise((resolve, reject) => {
        https.get(env.DATA_URL, resp => {
            let data = "";
            resp.on("data", chunk => { data += chunk })
            resp.on("end", () => {
                resolve(JSON.parse(data))
            });
        }).on("error", err => {
            reject(err)
        });
    })
}

parseCODVIData = (data) => {
    let text = ""

    text = `
    🇲🇽 Casos Nacionales
    - ${data.national_totals.confirmed_cases} 🦠 Confirmados
    - ${data.national_totals.negative_cases} ❌ Negativos
    - ${data.national_totals.suspicious_cases} ❓ Sospechosos
    - ${data.national_totals.deads} ☠️ Muertes

    Fuente: http://ncov.sinave.gob.mx/mapa.aspx
    ${ data.update_label}
    #CODVID19Mx #CODVID19
    `

    return text
}

tweetData = (text) => {
    const jsonData = JSON.stringify({ text: text })
    const options = {
        hostname: env.TWEET_URL,
        path: env.TWEET_PATH,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(jsonData, 'utf8')
        }
    }

    const req = https.request(options, (res) => {})
    req.write(jsonData)
    req.end()
}
