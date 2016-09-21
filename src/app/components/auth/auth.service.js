function AuthService() {
    this.getAuthenticatedUser = function () {
        return 'Dinesh Bogolu';
    };
}

angular
    .module('components.auth')
    .service('AuthService', AuthService);