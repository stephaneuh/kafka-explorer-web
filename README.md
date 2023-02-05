# web-scrapping

## Setup
Run `npm install` without arguments to install nodeJS modules defined in the dependencies section of the package.json file.

It's important that `npm install` is run in the same directory as the package.json file.

## Build web-scrapping docker image
```
cd docker/webscrapping
docker build -t stephaneuh/webscrapping -f Dockerfile .
```

## Local Execution

Start Aurora DB
```
cd docker
docker-compose up -d
```

Start local NodeJS api

```
cd docker/webscrapping/src/app
node src/app/index.js
```

Start Vue.js/React app
```
cd docker/vuejs
export NODE_OPTIONS=--openssl-legacy-provider
npm run serve
```

## Links

link | definition
---|---
http://localhost:8082/| website url (Vue.js/React)
http://localhost:8080/| api location
http://localhost:8081/db/parks/| Mongo Express UI (default user: admin/admin)
## API definition
### Get all parks
```
curl --location --request GET 'http://localhost:8080/park'
```