(function() {
  $(function() {
    /*
    	$( '.task' ).draggable(
    		revert: true
    	)
    
    	$( '.tasks' ).droppable
    		activeClass: 'ui-state-hover'
    		drop: ( event, ui ) ->
    			console.log this
    			console.log ui
    			ui.draggable.context.style.position = 'static'
    			ui.draggable.context.style.top = 0
    			ui.draggable.context.style.left = 0
    			this.appendChild(ui.draggable.context)
    	*/
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
          var id;
          if (e.stopPropagation) {
            e.stopPropagation();
          }
          id = e.dataTransfer.getData("Text");
          el = document.getElementById(id);
          el.parentNode.removeChild(el);
          console.log(id);
          console.log(e.target);
          bin.appendChild(el);
          return false;
        };
      })(bin)));
    }
    return _results;
  });
}).call(this);
