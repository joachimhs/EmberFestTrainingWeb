LDBB.ApplicationController = Ember.Controller.extend({
    needs: ['user'],

    doLogIn: function() {
        var loggedInUser = this.get('controllers.user.content.username');
        console.log('doLogIn Action: ' + loggedInUser);
        navigator.id.request();
    },

    doLogOut: function() {
        console.log('doLogOut Action');
        navigator.id.logout();
    }
});