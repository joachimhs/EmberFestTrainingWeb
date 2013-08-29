LDBB.BucketKeyRoute = Ember.Route.extend({
    model: function(key) {
        console.log('BucketKeyRoute: ' + key.key_id);
        var bucket = this.modelFor ('bucket');
        console.log(bucket);
        return LDBB.Key.find(bucket.get('id'), key.key_id);
    }
});

LDBB.BucketKeyController = Ember.ObjectController.extend({
    editKey: function(key) {
        key.set('isEditing', true);
    },


    saveKey: function(key) {
        key.set('isEditing', false);
        console.log(LDBB.Model.toJSON(key));
        LDBB.Key.updateRecord(key);
    }
});