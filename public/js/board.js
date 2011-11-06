(function() {
  var extractIssues, getField, model, q, _ref;
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
    return $.ajax({
      url: "/rest/issue/" + moveEvent.task + "/execute",
      data: "command=" + moveEvent.toPhase,
      type: 'POST',
      success: function() {},
      error: function() {
        return 'move the task back?';
      }
    });
  });
  model = {
    phases: [
      {
        name: 'devStart',
        issues: []
      }, {
        name: 'working',
        issues: []
      }, {
        name: 'devDone',
        issues: []
      }, {
        name: 'test',
        issues: []
      }
    ]
  };
  hub.on('clear-tasks', function() {
    return $('.task').remove();
  });
  hub.on('task-add', function(taskAddEvent) {
    var newTask, phase, task;
    task = taskAddEvent;
    newTask = $("<li class=\"task\" id=\"" + task.id + "\" draggable=\"true\"><h2 class=\"title\">" + task.title + "</h2><p class=\"body\">" + task.body + "</p></li>");
    newTask.on("dragstart", function(e) {
      e = e.originalEvent;
      e.dataTransfer.effectAllowed = "copy";
      return e.dataTransfer.setData("Text", this.id);
    });
    phase = $("[data-phase='" + task.phase + "']");
    return phase.find('.tasks').append(newTask);
  });
  getField = function(fieldName) {
    return function(i) {
      return i.field.filter(function(f) {
        return f['@name'] === fieldName;
      })[0].value;
    };
  };
  extractIssues = function(issuesResponse) {
    var i, _i, _len, _ref2, _results;
    _ref2 = issuesResponse.issue;
    _results = [];
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      i = _ref2[_i];
      _results.push({
        id: i['@id'],
        title: getField('summary')(i),
        body: getField('description')(i),
        phase: getField('State')(i)
      });
    }
    return _results;
  };
  hub.on('load-project', function(p) {
    hub.emit('clear-tasks');
    return youtrack.getIssuesForProject(p, function(issuesResponse) {
      var issue, _i, _len, _ref2, _results;
      _ref2 = extractIssues(issuesResponse);
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        issue = _ref2[_i];
        _results.push(hub.emit('task-add', issue));
      }
      return _results;
    });
  });
  $(function() {
    return hub.emit('load-project', 'EX');
  });
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
          var id, p, to;
          e.stopPropagation();
          e.preventDefault();
          id = e.dataTransfer.getData("Text");
          el = document.getElementById(id);
          p = el.parentNode;
          p.removeChild(el);
          while ((p = p.parentNode) && !p.dataset.phase) {
            null;
          }
          to = bin;
          while ((to = to.parentNode) && !to.dataset.phase) {
            null;
          }
          hub.emit('task-move', {
            task: id,
            toPhase: to.dataset.phase,
            fromPhase: p.dataset.phase
          });
          bin.appendChild(el);
          return false;
        };
      })(bin)));
    }
    return _results;
  });
}).call(this);
