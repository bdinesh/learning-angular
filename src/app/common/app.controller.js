function AppController(AuthService) {
    let self = this;

    self.$onInit = function(){
        self.userName = AuthService.getAuthenticatedUser();
    };
}

angular
    .module('common')
    .controller('AppController', AppController);
