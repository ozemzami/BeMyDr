// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false, 
  firebase : {
    apiKey: "AIzaSyB2Cd5iUwTouZLKn-QZGGWJ_wmnWKwHOQc",
    authDomain: "infermedica-dialog-vghdef.firebaseapp.com",
    databaseURL: "https://infermedica-dialog-vghdef.firebaseio.com",
    projectId: "infermedica-dialog-vghdef",
    storageBucket: "infermedica-dialog-vghdef.appspot.com",
    messagingSenderId: "1014284069404",
    appId: "1:1014284069404:web:df628fb91b5d1af6cb8dd9"
  },
  dialogflow: {
    chatbot: '455984fb1c124a06916f5c16d5ef2d46'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
