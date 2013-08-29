LDBB.Model = Ember.Object.extend();

LDBB.Model.reopenClass({
    find: function(url, id, type, key) {
        console.log('find: ' + type + " id: " + id);

        var foundItem = this.contentArrayContains(id, type);

        if (!foundItem) {
            foundItem = type.create({ id: id, isLoaded: false});
            $.getJSON(url + "/" +  id, function(data) {
                if (data[key]) {
                    foundItem.setProperties(data[key]);
                    foundItem.set('isLoaded', true);
                    foundItem.set('isError', false);
                }
            });
            Ember.get(type, 'collection').pushObject(foundItem);
        }

        console.log('found: ' + foundItem.get('id'));
        return foundItem;
    },

    refresh: function(url, id, type, key) {
        console.log('refresh: ' + type + " id: " + id);
        var foundItem = this.contentArrayContains(id, type);
        console.log(foundItem);
        if (foundItem) {
            foundItem.set('isLoaded', false);
            $.getJSON(url + "/" +  id, function(data) {
                if (data[key]) {
                    foundItem.setProperties(data[key]);
                    foundItem.set('isLoaded', true);
                    foundItem.set('isError', false);
                }
            });
        }
    },

    contentArrayContains: function(id, type) {
        var contains = null;

        Ember.get(type, 'collection').forEach(function(item) {
            if (item.get('id') === id) {
                contains = item;
            }
        });

        return contains;
    },

    findAll: function(url, type, key) {
        console.log('findAll: ' + type + " " + url + " " + key);

        var collection = this;
        $.getJSON(url, function(data) {
            $.each(data[key], function(i, row) {
                var item = collection.contentArrayContains(row.id, type);
                if (!item) {
                    item =  type.create();
                    Ember.get(type, 'collection').pushObject(item);
                }
                item.setProperties(row);
                item.set('isLoaded', true);
                item.set('isError', false);
            });
        });

        return Ember.get(type, 'collection');
    },

    delete: function(url, type, id) {
        console.log('delete: ' + type + " " + id);
        var collection = this;
        $.ajax({
            type: 'DELETE',
            url: url + "/" + id,
            success: function(res, status, xhr) {
                if(res.deleted) {
                    var item = collection.contentArrayContains(id, type);
                    if (item) {
                        Ember.get(type, 'collection').removeObject(item);
                    }
                }
            },
            error: function(xhr, status, err) { alert('Unable to delete: ' + status + " :: " + err); }
        });
    },

    createRecord: function(url, type, model) {
        console.log('save: ' + type + " " + JSON.stringify(model));
        var collection = this;
        model.set('isSaving', true);
        $.ajax({
            type: "POST",
            url: url,
            data: type.toJSON(model),
            success: function(res, status, xhr) {
                if (res.id) {
                    Ember.get(type, 'collection').pushObject(model);
                    model.set('isSaving', false);
                } else {
                    model.set('isError', true);
                }
            },
            error: function(xhr, status, err) { model.set('isError', false);  }
        });

        return model;
    },

    updateRecord: function(url, type, model) {
        console.log('update: ' + type + " " + model.get('id'));
        var collection = this;
        model.set('isSaving', true);
        console.log(JSON.stringify(model));
        $.ajax({
            type: "PUT",
            url: url,
            data: type.toJSON(model),
            success: function(res, status, xhr) {
                if (res.id) {
                    model.set('isSaving', false);
                    model.setProperties(res);
                } else {
                    model.set('isError', true);
                }
            },
            error: function(xhr, status, err) { model.set('isError', false);  }
        });
    },

    reload: function(url, id, type, key) {
        console.log('reload: ' + type + " id: " + id);

        var foundItem = this.contentArrayContains(id, type);

        if (foundItem) {
            foundItem.set('isLoaded', false);

            $.getJSON(url + "/" +  id, function(data) {
                if (data[key]) {
                    foundItem.setProperties(data[key]);
                    foundItem.set('isLoaded', true);
                    foundItem.set('isError', false);
                }
            });
        } else {
            LDBB.Model.find(url, id, type, key);
        }
    },

    toJSON: function(model) {
        var key, meta,
            json = {},
            attributes = model.get('persistentAttributes');

        console.log(attributes);
        if (attributes) {
            attributes.forEach(function(key) {
                console.log(key);
                json[key] =  model.get(key);
            });
        }

        console.log(JSON.stringify(json));
        return JSON.stringify(json);
    }
});

LDBB.Bucket = LDBB.Model.extend({
    persistentAttributes: ['id', 'key_ids'],

    keys: function() {
        console.log('Bucket.keys()');

        var keys = [];

        if (!this.get('key_ids')) {
            LDBB.Bucket.reload(this.get('id'));
        }

        if (this.get('key_ids')) {
            this.get('key_ids').forEach(function(key) {
                keys.pushObject(key);
            });
        }

        return keys;
    }.property('key_ids', 'key_ids.length')
});

LDBB.Bucket.reopenClass({
    collection: Ember.A(),

    find: function(id) {
        return LDBB.Model.find('/json/buckets', id, LDBB.Bucket, 'bucket');
    },

    findAll: function() {
        return LDBB.Model.findAll('/json/buckets', LDBB.Bucket, 'buckets');
    },

    createRecord: function(model) {
        LDBB.Model.createRecord('/json/buckets', LDBB.Bucket, model);
    },

    updateRecord: function(model) {
        LDBB.Model.updateRecord("/json/buckets", LDBB.Bucket, model);
    },

    delete: function(id) {
        LDBB.Model.delete('/json/buckets', LDBB.Bucket, id);
    },

    reload: function(id) {
        return LDBB.Model.reload('/json/buckets', id, LDBB.Bucket, 'bucket');
    }
});

LDBB.Key = LDBB.Model.extend({
    persistentAttributes: ['id', 'bucketName', 'keyName', 'value']
});

LDBB.Key.reopenClass({
    collection: Ember.A(),


    find: function(bucketid, id) {
        return LDBB.Model.find('/json/buckets/' + bucketid + "/key", id, LDBB.Key, 'key');
        return LDBB.Model.find(id, LDBB.Key);
    },

    findAll: function() {
        return LDBB.Model.findAll('/json/buckets', LDBB.Key, 'keys');
    },

    createRecord: function(model) {
        LDBB.Model.createRecord('/json/buckets/' + model.get('bucketName') + "/key/" + model.get('keyName'), LDBB.Key, model);
    },

    updateRecord: function(model) {
        LDBB.Model.updateRecord("/json/buckets/" + model.get('bucketName') + "/key/" + model.get('keyName'), LDBB.Key, model);
    },

    delete: function(id) {
        LDBB.Model.delete("/json/buckets/" + model.get('bucketName') + "/key", LDBB.Key, id);
    }
});