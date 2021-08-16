- [Website](#website)
- [Install `cypress-firebase`, `firebase-admin` and `cross-env`.](#install-cypress-firebase-firebase-admin-and-cross-env)
- [Add configurations to angular.json](#add-configurations-to-angularjson)
- [add scripts to package.json](#add-scripts-to-packagejson)
- [apps > my-angular-app-e2e > src > support > commands.ts](#apps--my-angular-app-e2e--src--support--commandsts)
- [apps > my-angular-app-e2e > src > plugins > index.js](#apps--my-angular-app-e2e--src--plugins--indexjs)

# Website

https://github.com/prescottprue/cypress-firebase

# Install `cypress-firebase`, `firebase-admin` and `cross-env`.

```sh
npm install --save-dev --save-exact cypress-firebase firebase-admin cross-env
```

# Add configurations to angular.json

projects > my-angular-app-e2e > architect > e2e > configurations

```json
"emulator-demo": {
    "devServerTarget": "my-angular-app:serve:emulator-demo"
},
"emulator-real": {
    "devServerTarget": "my-angular-app:serve:emulator-real"
},
```

# add scripts to package.json

```json
"--- cypress ---": "",
"cypress:emulate-demo": "cross-env FIRESTORE_EMULATOR_HOST=\"localhost:8080\" FIREBASE_AUTH_EMULATOR_HOST=\"localhost:9099\" CYPRESS_USE_DEMO_PROJECT=\"true\" GCLOUD_PROJECT=\"demo-1\" ng e2e --watch -c emulator-demo",
"cypress:emulate-real": "cross-env FIRESTORE_EMULATOR_HOST=\"localhost:8080\" FIREBASE_AUTH_EMULATOR_HOST=\"localhost:9099\" CYPRESS_USE_DEMO_PROJECT=\"true\" GCLOUD_PROJECT=\"emulators-codelab-a5a89\" ng e2e --watch -c emulator-real",
```

# apps > my-angular-app-e2e > src > support > commands.ts

# apps > my-angular-app-e2e > src > plugins > index.js
