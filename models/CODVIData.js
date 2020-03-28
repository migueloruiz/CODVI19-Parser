const validator = require('is-my-json-valid')
const env = require('./../config')
const MangaPage = require('./mangaPage')

const mangaBodySchema = {
    required: true,
    type: 'object',
    properties: {
      title: {
          required: true,
          type: 'string'
      },
      url: {
          required: true,
          type: 'string'
      }
    }
}

class Manga {
    constructor(title, referenceUrl) {
        this.title = title
        this.referenceUrl = referenceUrl
        this.numberOfPages = 0
        this.pagesUrl = ''
        this.pages = {}
        this.fileName = null
    }

    setPagesData(numberOfPages, relativeUrl) {
        this.numberOfPages = numberOfPages
        this.pagesUrl = env.MANGASTREAM_URL + relativeUrl
        this.generatePagesList()
    }

    generatePagesList() {
        for (var index = 1; index <= this.numberOfPages; index++) {
            this.pages[index] = new MangaPage(`${index}`, `${this.pagesUrl}${index}`)
        }
    }
}

Manga.createWithBody = (body) => {
    return new Promise((resolve, reject) => {
        let validate = validator(mangaBodySchema)
        if (validate(body)) {
            resolve(new Manga(body.title, body.url))
        } else {
            reject({errors: validate.errors})
        }
    })
}


module.exports = Manga