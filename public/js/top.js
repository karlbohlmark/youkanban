(function() {
  var hub, taskFilterChanged;
  hub = window.hub;
  taskFilterChanged = function(e) {
    return hub.emit('task-filter-changed', {
      query: e.target.value
    });
  };
  $(function() {
    $('.search').on('keyup', taskFilterChanged);
    $('.search').on('click', taskFilterChanged);
    return $('.search').on('change', taskFilterChanged);
  });
}).call(this);
