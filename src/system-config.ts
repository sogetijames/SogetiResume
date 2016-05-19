/** Type declaration for ambient System. */
declare var System: any;

const systemConfigPackages: any = {};

const barrels: string[] = [
  // Angular specific barrels.
  '@angular/core',
  '@angular/common',
  '@angular/compiler',
  '@angular/http',
  '@angular/router',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',

  // Thirdparty barrels.
  'rxjs',

  // App specific barrels.
  'app',
  'app/+admin',
  'app/+resumes',
  'app/+resumes/resume-details',
  'app/+resumes/shared',
  'app/+users',
  'app/+users/shared',
  'app/+users/user-login',
  'app/+users/user-register',
  'app/+users/user-reset-password',
  'app/+users/user-settings',
  'app/shared',
  'app/shared/pipes',
  'app/shared/utils'
];

barrels.forEach((barrelName: string) => {
  systemConfigPackages[barrelName] = { main: 'index' };
});

System.config({
  map: {
    '@angular': 'lib/@angular',
    'rxjs': 'lib/rxjs',
    'main': 'main.js',
    'toastr': 'lib/toastr'
  },
  packages: systemConfigPackages
});