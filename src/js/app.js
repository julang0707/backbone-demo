var apiUrl = 'https://openapi.etsy.com/v2/';
var apiKey = 'h9oq2yf3twf4ziejn10b717i';

var Listing = Backbone.Model.extend({
  defaults: {
    name: 'New Listing',
    shop: 'Default Shop',
    image: 'img/default.png',
    shopUrl: '/shop/1',
    listingUrl: '/listing/1',
    price: 0.0
  },

  sync: function(method, collection, options) {
    options.dataType = 'jsonp';
    return Backbone.sync(method, collection, options);
  },

  parse: function(response) {
    var data = response;

    // If we are directly returning data from Etsy API
    // use the first item in the results array,
    // otherwise, the data is being passed in from the
    // collection's parse method and is already in
    // the correct format.
    if (_.has(response, 'results')) {
      data = response.results[0];
    }

    return {
      name: data.title,
      shop: data.Shop,
      image: _.first(data.Images),
      price: data.price
    };
  },

  url: function() {
    return apiUrl + 'listings/' + this.get('id') + '.js?includes=Images,Shop&api_key=' + apiKey;
  },

  initialize: function() {
    console.log('new instance created!');
  },

  calculateSalesTax: function() {
    return this.get('price') * .0927;
  }
});

var Listings = Backbone.Collection.extend({
  model: Listing,

  initialize: function(options) {
    this.state = options.state;
  },

  sync: function(method, collection, options) {
    options.dataType = 'jsonp';
    return Backbone.sync(method, collection, options);
  },

  parse: function(response) {
    return response.results;
  },

  url: function() {
    return apiUrl + 'listings/' + this.state + '.js?includes=Images,Shop&api_key=' + apiKey;
  }
});

// var listings = new Listings({
//   state: 'active'
// });
//
// listings.fetch().done(function() {
//   console.log(listings);
// });

var ListingView = Backbone.View.extend({
  template: _.template($('#itemTemplate').html(), {}),
  render: function() {
    this.$el.html(this.model.toJSON());
  }
});

var ListingsView = Backbone.View.extend({
  el: $('.content'),

  initialize: function() {
  },

  render: function() {
    this.collection.each(function(listing) {
      var listingView = new ListingsView({
        model: listing
      });
      listingView.render();
      this.$el.append(listingView.el)
    },
    this);
    return this;
  }
});

var HeaderView = Backbone.View.extend({
  template: _.template($('#headerTemplate').html()),
  render: function() {
    this.$el.html(this.template());
  }
})

var header = new HeaderView({
  el: $('header.top')
});

header.render();

var listings = new Listings({
  state: 'active'
});

var listingsView = new ListingsView({
  collection: listings
});

listings.fetch().done(function() {
  listingsView.render();
})

var Categories = Backbone.Model.extend({
  defaults: {
    categories: []
  },

  sync: function(method, collection, options) {
    options.dataType = 'jsonp';
    return Backbone.sync(method, collection, options);
  },

  url: function() {
    return apiUrl + '/taxonomy/categories' + '.js?api_key=' + apiKey;
  },

  parse: function(response) {
    var categories = response.results.map(function(cat) {
      return {
        name: cat.short_name,
        url: cat.short_name.toLowerCase()
          .replace(' ', '-')
          .replace('&', '')
      }
    });

    return {
      categories: categories
    };
  }
});

var categories = new Categories();

var CategoriesView = Backbone.View.extend({
  template: _.template($('#categoriesTemplate').html()),

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
  }
});

var categoriesList = new CategoriesView({
  el: $('.sidebar'),
  model: categories
});

categories.fetch().done(function() {
  categoriesList.render();
});

// Javascript example from Etsy homework
// function getListings(state){
//   var url = apiUrl + 'listings/' + state + '.js?includes=Images,Shop&api_key=' + apiKey;
//   return $.ajax(url, {
//     dataType: 'jsonp'
//   });
// }
//
// getListings('active').done(function(response){
//   var listings = response.results.map(function(data){
//     var x = new Listing();
//     x.parse(data);
//     return x;
//   });
//
//   console.log(listings);
// });
