angular
    .module('components.auth', [
        'ui.router',
        'ngStorage'
    ])
    .config(function ($stateProvider) {
        $stateProvider
            .state('auth', {
                redirectTo: 'auth.login',
                url: '/auth',
                template: '<div ui-view></div>'
            });
    });
