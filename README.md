# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). This was part of the Week three course work for Lighthouse Labs web dev bootcamp. www.lighthouselabs.ca. Bootstrap was used for basic styling.

## What it looks like

!["The login page"](https://github.com/ermurray/tinyapp/blob/master/docs/urls-login.png?raw=true)
!["Create new short url"](https://github.com/ermurray/tinyapp/blob/master/docs/urls-new.png?raw=true)
!["Specific short url and edit form"](https://github.com/ermurray/tinyapp/blob/master/docs/urls-show.png?raw=true)
!["My urls list"](https://github.com/ermurray/tinyapp/blob/master/docs/urls.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
- Go to localhost:8080 you will be redirected to the login page (homepage not created yet)
- if you do not have a login already click register in Nav bar
- Register for Tiny app if registration successfull and your email is not already in use you will be redirected to login where you can login and see your URLs (will be blank until you have created some.)
- Create your own unique short urls from the nav bar  and your "MY URLs" page will populate with all that you have created. From there you can edit or delete which ever you like.

