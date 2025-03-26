#!/bin/sh

set +e

npx prisma migrate deploy --schema=./dist/prisma/schema.prisma
npm run start:prod