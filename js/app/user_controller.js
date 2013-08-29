LDBB.UserController = Ember.ObjectController.extend({
    init: function() {
        this._super();

        console.log('UserController INIT');

        var controller = this;
        // Mozilla Persona
        navigator.id.watch({
            loggedInUser: null,
            onlogin: function(assertion) {
                $.ajax({
                    type: 'POST',
                    url: '/auth/login',
                    data: {assertion: assertion},
                    success: function(res, status, xhr) {
                        if (res.username) {
                            console.log('user logged in: ' + res.username);
                            controller.set('content', Ember.Object.create({"username": res.username}));
                        } else if (res.authFailed) {
                            alert('Login Failed. Reason: ' + res.reason);
                        }
                    },
                    error: function(xhr, status, err) {
                        alert('Login Failed. Reason: ' + xhr.reason);
                    }
                });
            },

            onlogout: function() {
                controller.set('content', null);
            }
        });
    },

    isLoggedIn: function() {
        return this.get('username') != null
    }.property('username')
});