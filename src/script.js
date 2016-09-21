(function (angular) {
    //common module

    const commonModule = angular.module('common', [
        'components'
    ]);

    function AuthService() {
        this.getAuthenticatedUser = function () {
            return 'Dinesh';
        };
    }

    commonModule
        .service('AuthService', AuthService);

    //app component

    var app = {
        template: `<div>
  <div ui-view>
  </div>
</div>`,
        controller: function AppController(AuthService) {
            var self = this;
            self.userName;

            self.$onInit = function () {
                self.userName = AuthService.getAuthenticatedUser();
            };
        }
    };

    commonModule
        .component('app', app)
        .config(function ($stateProvider) {
            $stateProvider
                .state('app', {
                    redirectTo: 'app.home',
                    url: '/app',
                    component: 'app'
                });
        });

    //components module

    var componentsModule = angular
        .module('components', []);

    //home component

    const home = {
        template: `<div>
  <span>Welcome to {{ $ctrl.userName }}</span>
</div>`,
        bindings: {
            userName: '@'
        },
        controller: function HomeController() {
            const self = this;

            self.onInit = function () {
                self.userName = self.appCtrl.userName;
                console.log(`Logged in user name: ${self.userName}`);
            };
        }
    };

    componentsModule
        .component('home', home)
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.home', {
                    url: '/home',
                    component: 'home'
                });
        });
})(window.angular);