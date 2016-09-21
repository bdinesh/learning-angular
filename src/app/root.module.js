angular
    .module('root', [
        'ngMaterial',
        'ui.router',
        'ngResource',
        'ngMessages',
        'templates',
        'md.data.table',
        'common',
        'components'
    ])
    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })
    .run(function ($state) {
        //$state.go('app');
    });