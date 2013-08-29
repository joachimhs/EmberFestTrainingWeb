Ember.Application.reopen({
    templates: [],

    init: function() {
        this._super();

        this.loadTemplates();
    },

    loadTemplates: function() {
        var app = this,
            templates = this.get('templates');

        app.deferReadiness();

        var promises = templates.map(function(name) {
            return Ember.$.get('templates/'+name+'.html').then(function(data) {
                Ember.TEMPLATES[name] = Ember.Handlebars.compile(data);
            });
        });

        Ember.RSVP.all(promises).then(function() {
            app.advanceReadiness();
        });
    }
});

var LDBB = Ember.Application.create({
    templates: ['application', 'header', 'buckets', 'bucket', 'bucket/index', 'bucket/key']
});

LDBB.Router.map(function() {
    this.resource("buckets", {path: "/"}, function() {
        this.resource("bucket", {path: "/bucket/:bucket_id"}, function() {
            this.route("key", {path: "/key/:key_id"});
        });
    });
});
