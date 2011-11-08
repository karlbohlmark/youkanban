(function() {
  var fetch, resource;
  fetch = function(url, cb) {
    return $.ajax({
      url: url,
      success: function(r) {
        return cb(r);
      }
    });
  };
  resource = {
    view: function(view, cb) {
      return fetch("/views/" + view, cb);
    }
  };
  window.resource = resource;
}).call(this);
