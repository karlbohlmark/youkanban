(function() {
  var at, byId, q, q1, view, _ref;
  window.hub = new EventEmitter2({
    verbose: true
  });
  q = document.querySelectorAll.bind(document);
  q1 = document.querySelector.bind(document);
  byId = document.getElementById.bind(document);
  at = hub.on.bind(hub);
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
  at('task-filter-changed', function(filterEvent) {
    var task, tasks, _i, _len, _results;
    tasks = [].slice.call(q('.task'));
    _results = [];
    for (_i = 0, _len = tasks.length; _i < _len; _i++) {
      task = tasks[_i];
      _results.push(!task.textContent.toUpperCase().contains(filterEvent.query.toUpperCase()) ? task.classList.add('filtered-out') : task.classList.remove('filtered-out'));
    }
    return _results;
  });
  at('task-move', function(moveEvent) {
    api.executeIssueCommand(moveEvent.task, moveEvent.fromPhase, moveEvent.toPhase);
    return view.moveTask(moveEvent.task, moveEvent.toPhase);
  });
  at('clear-tasks', function() {
    return $('.task').remove();
  });
  at('task-add', function(taskAddEvent) {
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
  at('load-project', function(p) {
    hub.emit('clear-tasks');
    return resource.view('board.jade', function(viewStr) {
      return api.getProjectStates(p, function(_, states) {
        var boardFn, i, jade, phases, rendered, state;
        jade = require('jade');
        boardFn = jade.compile(viewStr);
        i = 0;
        phases = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = states.length; _i < _len; _i++) {
            state = states[_i];
            _results.push({
              name: state,
              tasks: []
            });
          }
          return _results;
        })();
        rendered = boardFn({
          phases: phases
        });
        $('.board').replaceWith($(rendered));
        return api.getIssuesForProject(p, states, function(issues) {
          var issue, _i, _len;
          for (_i = 0, _len = issues.length; _i < _len; _i++) {
            issue = issues[_i];
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
    return api.getProjects(function(projects) {
      var p;
      if (!Array.isArray(projects)) {
        p = projects.project;
        return $('.project-chooser').find('.dropdown-menu li').remove().end().find('.dropdown-toggle').text(p['@name']).attr('data-id', p['@shortName']).end();
      }
    });
  });
  $(function() {
    if (!(window.location.search != null)) {
      window.location.href = 'https://github.com/login/oauth/authorize?client_id=1875e74c695bc9d36482';
    }
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
    $('body').on('click', '.task', function() {
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
