var home = {
    templateUrl: './home.html',
    bindings: {
        userName: '<'
    }
};

angular
    .module('components')
    .component('home', home)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app.home', {
                url: '/home',
                component: 'home'
            });
    });