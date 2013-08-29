LDBB.BucketRoute = Ember.Route.extend({
    model: function(bucket) {
        //return Ember.Object.create({"id": bucket.bucket_id});
        console.log('BucketsBucketRoute model: ' + bucket.bucket_id);
        return LDBB.Bucket.find(bucket.bucket_id);
    }
});