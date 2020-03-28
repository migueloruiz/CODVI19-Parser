const router = require('express').Router()
const https = require('https');

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
        https.get("https://dl1ndau7be.execute-api.us-east-1.amazonaws.com/default/coronavirusMexicoStats", resp => {
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
    `

    return text
}

tweetData = (text) => {
    const jsonData = JSON.stringify({ text: text })
    const options = {
        hostname: 'wh.automate.io',
        path: '/webhook/5e7f7d572c74d2691ab2ae4f',
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
