const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function setup() {
  const templateConfigFileName = path.resolve(
    './apps/time-tracker/src/assets/config.template.json',
  );

  console.log('Setup config file');
  const config = JSON.parse((await fs.promises.readFile(templateConfigFileName)).toString());
  config.serverUrl = process.env.TIMETRACKER_WEB_SERVER_URL || config.serverUrl;
  config.auth0Domain = process.env.TIMETRACKER_WEB_AUTH0_DOMAIN || config.auth0Domain;
  config.auth0ClientId = process.env.TIMETRACKER_WEB_AUTH0_CLIEND_ID || config.auth0ClientId;
  config.auth0Audience = process.env.TIMETRACKER_WEB_AUTH0_AUDIENCE || config.auth0Audience;

  const configFileName = path.resolve('./apps/time-tracker/src/assets/config.json');
  await fs.promises.writeFile(configFileName, JSON.stringify(config));
}

setup().catch((err) => console.log(err));
