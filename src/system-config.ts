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
  'app/admin',
  'app/shared',
  'app/users'
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