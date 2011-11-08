(function() {
  var byId, extractIssues, getField, q, q1, view, _ref;
  window.hub = new EventEmitter2({
    verbose: true
  });
  q = document.querySelectorAll.bind(document);
  q1 = document.querySelector.bind(document);
  byId = document.getElementById.bind(document);
  view = {
    getTask: function(id) {
      return byId(id);
    },
    getPhase: function(phase) {
      return q1("[data-phase='" + phase + "']");
    },
    getTaskList: function(phase) {
      return q1("[data-phase='" + phase + "'] .tasks");
    },
    moveTask: function(task, toPhase) {
      var toPhaseList;
      task = this.getTask(task);
      toPhaseList = this.getTaskList(toPhase);
      return toPhaseList.appendChild(task);
    }
  };
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
    youtrack.executeIssueCommand(moveEvent.task, moveEvent.toPhase);
    return view.moveTask(moveEvent.task, moveEvent.toPhase);
  });
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
    return resource.view('board.jade', function(viewStr) {
      var fn, jade;
      jade = require('jade');
      fn = jade.compile(viewStr);
      return youtrack.getProjectStates(p, function(_, states) {
        var boardFn, i, phases, rendered, state;
        jade = require('jade');
        boardFn = jade.compile(viewStr);
        i = 0;
        phases = (function() {
          var _i, _len, _ref2, _results;
          _ref2 = states.state;
          _results = [];
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            state = _ref2[_i];
            if (state['@resolved'] === "false") {
              _results.push({
                name: state['@name'],
                tasks: []
              });
            }
          }
          return _results;
        })();
        rendered = boardFn({
          phases: phases
        });
        $('.board').replaceWith($(rendered));
        return youtrack.getIssuesForProject(p, function(issuesResponse) {
          var issue, _i, _len, _ref2;
          _ref2 = extractIssues(issuesResponse);
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            issue = _ref2[_i];
            hub.emit('task-add', issue);
          }
          return window.board.initDragAndDrop();
        });
      });
    });
  });
  $(function() {
    return hub.emit('load-project', 'EX');
  });
  $(function() {
    return youtrack.getProjects(function(projects) {
      var p;
      if (!Array.isArray(projects)) {
        p = projects.project;
        return $('.project-chooser').find('.dropdown-menu li').remove().end().find('.dropdown-toggle').text(p['@name']).attr('data-id', p['@shortName']).end();
      }
    });
  });
  $(function() {
    $('.dropdown-menu').on('click', 'a', function(e) {
      var id, item, menu, text, toggle;
      toggle = $(this).closest('.dropdown').find('.dropdown-toggle');
      text = toggle.text();
      id = toggle.attr('data-id');
      toggle.text($(this).text()).attr('data-id', $(this).attr('data-id'));
      menu = $(this).closest('.dropdown-menu');
      item = $(this).remove();
      item.text(text).attr('data-id', id);
      menu.append($('<li></li>').append(item));
      return $('.board').removeClass(id).addClass(toggle.attr('data-id'));
    });
    $('.tasks').on('click', '.task', function() {
      return location.href = 'http://localhost:8282/issue/' + $(this).attr('id');
    });
    $('.container').on('dblclick', function() {
      if (document.body.classList.contains('full-screen') && (document.body.webkitExitFullScreen != null)) {
        return document.body.webkitExitFullScreen();
      } else {
        return document.body.webkitRequestFullScreen();
      }
    });
    $('.fullScreen').on('click', function() {
      return document.body.webkitRequestFullScreen();
    });
    document.body.onwebkitfullscreenchange = function() {
      return this.classList.toggle('full-screen');
    };
    return window.board.initDragAndDrop();
  });
}).call(this);
