(function() {
  var model, moveEvent, q, _ref;
  window.hub = new EventEmitter2({
    verbose: true
  });
  q = document.querySelectorAll.bind(document);
  if ((_ref = String.prototype.contains) == null) {
    String.prototype.contains = function(s) {
      return this.indexOf(s) !== -1;
    };
  }
  hub.on('task-filter-changed', function(filterEvent) {
    var task, tasks, _i, _len, _results;
    tasks = [].slice.call(q('.task'));
    _results = [];
    for (_i = 0, _len = tasks.length; _i < _len; _i++) {
      task = tasks[_i];
      _results.push(!task.textContent.toUpperCase().contains(filterEvent.query.toUpperCase()) ? task.classList.add('filtered-out') : task.classList.remove('filtered-out'));
    }
    return _results;
  });
  hub.on('task-move', function(moveEvent) {
    return console.log(moveEvent);
  });
  model = {
    phases: {
      'devStart': [
        {
          id: 1,
          title: 'capture the flag'
        }
      ],
      'working': [
        {
          id: 3,
          title: 'Conquer the world'
        }
      ],
      'devDone': [
        {
          id: 1,
          title: 'Rescue the princess'
        }
      ],
      'test': []
    },
    'prod': [
      {
        id: 4,
        title: 'Conquer the world'
      }
    ]
  };
  moveEvent = {
    name: 'task-move',
    fromPhase: 'test',
    toPhase: 'prod'
  };
  $(function() {
    var bin, bins, el, t, tasks, _i, _len, _results;
    tasks = document.querySelectorAll(".task");
    el = null;
    t = 0;
    while (t < tasks.length) {
      el = tasks[t];
      el.setAttribute("draggable", "true");
      el.addEventListener("dragstart", function(e) {
        e.dataTransfer.effectAllowed = "copy";
        return e.dataTransfer.setData("Text", this.id);
      });
      t++;
    }
    bins = [].slice.call(document.querySelectorAll(".tasks"));
    _results = [];
    for (_i = 0, _len = bins.length; _i < _len; _i++) {
      bin = bins[_i];
      bin.addEventListener("dragover", function(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.dataTransfer.dropEffect = "copy";
        return false;
      });
      bin.addEventListener("dragenter", function(e) {
        return false;
      });
      bin.addEventListener("dragleave", function() {});
      _results.push(bin.addEventListener("drop", (function(bin) {
        return function(e) {
          var from, id, p;
          e.stopPropagation();
          e.preventDefault();
          id = e.dataTransfer.getData("Text");
          el = document.getElementById(id);
          p = el.parentNode;
          p.removeChild(el);
          while ((p = p.parentNode) && !p.dataset.phase) {
            console.log(p);
          }
          from = bin;
          while ((from = from.parentNode) && !from.dataset.phase) {
            console.log(from.dataset.phase);
          }
          hub.emit('task-move', {
            task: id,
            fromPhase: from.dataset.phase,
            toPhase: p.dataset.phase
          });
          bin.appendChild(el);
          return false;
        };
      })(bin)));
    }
    return _results;
  });
}).call(this);
