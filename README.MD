Fullstack project! 

LATEST: i deployed this in render so yeah,, links are
CLIENT :
https://chatly-client-sen7.onrender.com

SERVER:
https://chatly-0b3p.onrender.com

Chatly! a mini clone of messenger from facebook!

Features:
- Messaging friends etc.
- Add, Unfriend etc.
- Friendslist
- Profile Like facebook 
- Coming soon... (still thinking)

Project Tech Stack
- Client (React.js)
- Backend (Express.js)
- Database (Mysql)

Project contains.. :
- Websocket!
- 

[Websocket]
- install socker in client and backend!
- do web socket set up in backend! and connect the client via using socket.io listening to the port of the server! so they are both conenctede!
- used in :
--> Active status (Knowing wich users are online!)
--> In sync add friend, request sent, unfriend, chat auto sync with friends!


<---------------------------------------- CLIENT SIDE DESIGN ------------------------------------------->

[Components]    
- Reusable designs! used in pages!
[Pages]         
- Holds the compoenents needed! act as parent!
[css]           
- Holds the css of components, pages, etc. (ideal : have separated css for each)
[Layouts]       
- Handle and wrapped needed compoentns like sidebar, navbars etc.
- has props for havign bool! needed in routes customizing!
- Ideal for building and customizing whihc page has navbars, has sidebars etc
- Adding sidebars that are mostly in the app so its there
[Context]
- Holds the datas act as provider of it to make the website in sync,
- uses connection from backend and web socket!
- stay in sync
[Routes]
- Manage the pages and layouts! 
- this is where you customize wihich pages has thje layouts! like some pages doesnt have navbar so put 
layouts (navbar = false) like that , so the layouts should have props! 
- Layout sometimes has props! like showsidebar = bool, so that is where customizing happen!
