# ner-frontend

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```
## Docker Build & Run
```bash
$ docker build -t ekko771/ner-third-party-frontend:<tag> . -f Dockerfile
$ docker run -p 30001:30001 ekko771/ner-third-party-frontend:<tag>
```
For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
