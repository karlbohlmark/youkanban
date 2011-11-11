test = require('testling')
test('the test name', (t)->
    t.equal(2 + 2, 4)
    
    t.log(window.navigator.appName)
    
    t.createWindow('http://localhost:8080/kanban', (win, $)-> 
        t.equal($('.board').length, 0)
        t.end()
    )
)
  
