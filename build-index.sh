 #!/bin/bash
 cd public/views && jade layout.jade -o "{body:'`jade board.jade -o \"{phases:[]}\"> /dev/null && cat board.html` '} " && mv layout.html ../index.html 