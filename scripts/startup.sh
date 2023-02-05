#!/bin/bash
npm run start --prefix ../docker/api/ &

export NODE_OPTIONS=--openssl-legacy-provider
npm run serve --prefix ../docker/vuejs/
