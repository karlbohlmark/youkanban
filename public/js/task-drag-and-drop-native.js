(function() {
  var hub, initDragAndDrop;
  hub = window.hub;
  initDragAndDrop = function() {
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
          return false;
        };
      })(bin)));
    }
    return _results;
  };
  window.board = {
    initDragAndDrop: initDragAndDrop
  };
}).call(this);
