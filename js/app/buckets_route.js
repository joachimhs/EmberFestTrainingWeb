LDBB.BucketsRoute = Ember.Route.extend({
    model: function() {
        return LDBB.Bucket.findAll();
    }
});