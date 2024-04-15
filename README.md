# Automating two factor authentication - Logging in on web using native app


## Initiation

- Update username and access key in browserstack.yml file under web folder and initiate web automation session

```sh

cd web
npm i
node web.js

```

- Update username, access key and app_id in app.js under app folder and initiate app automation session

```sh

cd app
npm i
node app.js

```

## Working

- Web and app automation sessions are initiated parallely

- App session waits for image to get downloaded from desktop session

- Downloaded image is then injected in the app