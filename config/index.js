const envalid = require('envalid')
const { str, bool, port, url } = envalid

module.exports = envalid.cleanEnv(process.env, {
    PROJECT: str(),
    IS_DEV: bool(),
    HOST: str(),
    PORT: port({ default: 4000, desc: 'The port to start the server on' }),
    DATA_URL: url(),
    TWEET_URL: str(),
    TWEET_PATH: str()
})