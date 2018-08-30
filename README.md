## Reminders API

A REST API built with MongoDB, Node.js and Express.
Make sure you have Mongo Driver installed and have a mongo shell running before launching the server.
Securing Node.js RESTful API with JSON Web Tokens, so User needs to be authorised to access resources.
Users passwords are encrypted with npm bcript.

- `git clone`
- `cd into dir`
- `npm i`
- `npm start`
- http://localhost:8080/api/reminders

## User Stories
```As a user of the Reminders API service(health)
So I can make sure the service is up and running
I would like to access a check point

As a user of the Reminders API service(get)
So I can see all my reminders
I would like to be able to display them all

As a developer(get type)
So I can populate all the reminders in the UI
I would like to return them as an array

As a user of the Reminders API service(get)
So I can see my reminders for today
I would like to search them by the date

As a user of the Reminders API service(get)
So I can find tasks
I would like to search them by the context

As a user(post)
So I can use your service
I would like to be able to save a reminder

As a user of the Reminders API service(update)
So I can edit a current reminder
I would like to be able to amend a reminder

As a user of the Reminders API service(delete)
So I can remove an old reminder
I would like to be able to delete a reminder
```
