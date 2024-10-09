#!/bin/sh
set -e

# start application
echo "REACT_APP_OKTO_CLIENT_API_KEY=$REACT_APP_OKTO_CLIENT_API_KEY" > .env
echo "REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID" >> .env
npm run start