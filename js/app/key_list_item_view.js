LDBB.KeyListView = Ember.View.extend({
    tagName: "span",
    template: Ember.Handlebars.compile('{{this}} <span class="glyphicon glyphicon-chevron-right pull-right"></span>')
});