var keyController;

module("LDBB.BucketKeyController", {
    setup: function() {
        Ember.run(function() {
            LDBB.server.autoRespond = true;
            LDBB.server.respondWith("PUT", "/json/buckets/bucketname/key/keyname",
                [200, { "Content-Type": "text/json" },
                    '{"id":"bucketnameKeyname","bucketName":"bucketname","keyName":"keyname","value":"my value"}'
                ]);

            LDBB.server.respondWith("GET", "/json/buckets",
                [200, { "Content-Type": "text/json" },
                    '{"buckets":[{"id":"Autopulver2","key_ids":["AutopulverFrisbee(EP)2"]},{"id":"The Cliks2","key_ids":["The CliksDirty King","The CliksSnakehouse"]}]}'
                ]);



            Ember.run(function() {
                keyController = LDBB.__container__.lookup("controller:bucketKey");
            });

        });
    },

    teardown: function() {

    }
});

test("Verify keyController", function() {
    LDBB.reset();
    ok(keyController, "Expecting non-null keyController");
});

test("Verify that editKey action updates isEditing flag", function() {
    LDBB.reset();
    var key = LDBB.Key.create();
    keyController.editKey(key);

    ok(key.get('isEditing'), "Expecting isEditing to be true");
});

test("Verify that saving a key will trigger XHR", function() {
    LDBB.reset();
    var key = LDBB.Key.create();
    keyController.editKey(key);

    key.set('id', "BucketNameKeyName");
    key.set('bucketName', "BucketName");
    key.set('keyName', "KeyName");
    key.set('value', 'KeyValue');

    keyController.saveKey(key);

    ok(!key.get('isEditing'), "Expecting isEditing to be false");
});