LDBB.BucketListView = Ember.View.extend({
    tagName: "span",
    template: Ember.Handlebars.compile('{{id}} <span class="glyphicon glyphicon-chevron-right  pull-right"></span>')
});