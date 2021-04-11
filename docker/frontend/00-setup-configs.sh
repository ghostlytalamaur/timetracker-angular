#!/bin/sh

echo "Set nginx port to $PORT"

sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf
sed -i 's|$TIMETRACKER_WEB_API|'"$TIMETRACKER_WEB_API"'|g' /etc/nginx/conf.d/default.conf

cp /usr/share/nginx/html/assets/config.template.json /usr/share/nginx/html/assets/config.json

if [ -n "$TIMETRACKER_WEB_SERVER_URL" ]
then
  echo "Set serverUrl to $TIMETRACKER_WEB_SERVER_URL"
  sed -i "s|\"serverUrl\":.*\".*\"|\"serverUrl\":\"$TIMETRACKER_WEB_SERVER_URL\"|g" /usr/share/nginx/html/assets/config.json
fi

if [ -n "$TIMETRACKER_WEB_AUTH0_DOMAIN" ]
then
  echo "Set auth0Domain to $TIMETRACKER_WEB_AUTH0_DOMAIN"
  sed -i "s|\"auth0Domain\":.*\".*\"|\"auth0Domain\":\"$TIMETRACKER_WEB_AUTH0_DOMAIN\"|g" /usr/share/nginx/html/assets/config.json
fi

if [ -n "$TIMETRACKER_WEB_AUTH0_CLIEND_ID" ]
then
  echo "Set auth0ClientId to $TIMETRACKER_WEB_AUTH0_CLIEND_ID"
  sed -i "s|\"auth0ClientId\":.*\".*\"|\"auth0ClientId\":\"$TIMETRACKER_WEB_AUTH0_CLIEND_ID\"|g" /usr/share/nginx/html/assets/config.json
fi

if [ -n "$TIMETRACKER_WEB_AUTH0_AUDIENCE" ]
then
  echo "Set auth0Audience to $TIMETRACKER_WEB_AUTH0_AUDIENCE"
  sed -i "s|\"auth0Audience\":.*\".*\"|\"auth0Audience\":\"$TIMETRACKER_WEB_AUTH0_AUDIENCE\"|g" /usr/share/nginx/html/assets/config.json
fi
