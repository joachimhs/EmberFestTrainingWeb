LDBB.HeaderController = Ember.Controller.extend({
    needs: ['user'],

    newBucketName: null,
    newKeyName: null,
    newKeyValue: null,

    init: function() {
        this._super();
        console.log('init');
    },

    addBucket: function() {
        console.log('adding new bucket: ' + this.get('newBucketName'));
        var bucketId = this.get('newBucketName');
        if (bucketId) {
            var bucket = LDBB.Bucket.create({id: bucketId});
            LDBB.Bucket.createRecord(bucket);
        }
    },

    addKey: function() {
        console.log('adding new key. Bucket: ' + this.get('newBucketName') + " key: " + this.get('newKeyName') + " value: " + this.get('newKeyValue'));
        var bucketId = this.get('newBucketName');
        var keyId = this.get('newKeyName');
        var keyValue = this.get('newKeyValue');

        if (bucketId && keyId && keyValue) {
            var key = LDBB.Key.create({id: bucketId + keyId, bucketName: bucketId, keyName: keyId, value: keyValue});
            LDBB.Key.createRecord(key);
            LDBB.Bucket.reload(bucketId);
        }

        //{"key":{"id":"BucketOneKeyOne","bucketName":"BucketOne","keyName":"KeyOne","value":"Value One"}}

    },

    logIn: function() {
        console.log('logging in');
    }
});