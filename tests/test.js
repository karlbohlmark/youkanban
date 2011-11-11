(function() {
  var test;
  test = require('testling');
  test('the test name', function(t) {
    t.equal(2 + 2, 4);
    return t.createWindow('http://localhost:8080/kanban', function(win, $) {
      console.log($('ul').length)
      t.equal($('.board').length, 1);
      return t.end();
    });
  });
}).call(this);
