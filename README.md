# [Periodic Tables - A Restaurant Reservation App](https://reservation-client-rhart.herokuapp.com/dashboard)
> Robert Hart - Thinkful Final Project

### Table of Contents
1. [Link To Live Application](#link-to-live-application)
2. [API Documentation](#api-documentation)
3. [Screenshots](#screenshots)
4. [Summary](#Summary)
5. [Technologies Used](#technologies-used)
6. [Instalation Instructions](#instalation-instructions)

# Link To Live Application
* ### [Live Application](https://reservation-client-rhart.herokuapp.com/dashboard)

# API Documentation

Reservations Endpoint:
### `GET /reservations`
  Returns a list of reservations, ordered by their `reservation_id`, for a queried date (defaults to current date).

### `POST /reservations`
  Creates a reservation with data from the request body, returning the reservation object. Requires:
    * `first_name`
    * `last_name`
    * `reservation_date` - must not lie on a Tuesday or in the past
    * `reservation_time`- must be between 10:30am and 9:30pm
    * `people` - party size, must be an integer, at least 1

### `GET /reservations/:reservation_id`
  Returns a reservation object with matching `reservation_id`.
  `reservation_id` must exist in the database.

### `PUT /reservations/:reservation_id`
  Updates a reservation object with matching `reservation_id`. 
  `reservation_id` must exist in the database.
  Request body data must adhere to restrictions listed in the `POST` request above.

### `PUT /reservations/:reservation_id/status`
  Updates the `status` of a reservation object with matching `reservation_id` to be one of
    * `seated`
    * `finished`
    * `cancelled`
  Cannot update a reservation which already has a status of `finished` or `canceled`

Tables Endpoint:
### `GET /tables`
  Returns a list of tables, ordered by their `table_name`.

### `POST /tables`
  Creates a table with data from the request body, returning the table object. Requires:
  * `table_name`
  * `capacity` - must be an integer, at least 1

### `GET /tables/:table_id`
  Returns a table object with matching `table_id`.
  `table_id` must exist in the database.

### `GET /tables/:table_id/seat`
  Returns a table object with matching `table_id`.
  `table_id` must exist in the database.

### `PUT /tables/:table_id/seat`
  Adds a `reservation_id` to a table object with matching `table_id` and no existing `reservation_id`, also updates associated reservation's `status` to `seated`.
  `table_id` must exist in the database.
  `reservation_id` must exist in the database.
  Table `capacity` must be no less than the associated reservation's `people`.
  Input reservation `status` must be `booked`.

### `DELETE /tables/:table_id/seat`
  Removes any `reservation_id` from a table object with matching `table_id`, also updates associated reservation's `status` to be `finished`.
  `table_id` must exist in the database.
  Matched table must have a `reservation_id`.


# Screenshots


## Dashboard `/dashboard?date=2021-10-23`
> Displays date, allows user to jump to today (Today), or move one day ahead (Next) or prior (Previous).
> Displays the reservations for the queried date (here 2021-10-23), and the tables that exist in the restaurant. If either of these are missing it provides a link to add reservations or tables respectively.
> Seat and Edit buttons will direct to their respective id's `/seat` or `/edit` pages
> Cancel buttons will cancel a reservation and submit a delete request to the server
> Finish table buttons allow (only) occupied tables to be freed

## Create Reservation `/reservations/new`
> Displays a form for required information. Pressing Submit will submit a post request with the provided data to the server, pressing Cancel will return user to previous page.

## Edit Reservation `/reservations/6/edit`
> Displays a form for required information, defaulting with the associated reservation id (6)'s information. Pressing Submit will submit a put request with the provided data to the server, pressing Cancel will return user to previous page.

## Seat Reservation `/reservations/6/seat`
> Displays a selection form for the tables in the restaurant and the number of people (2) in the reservation's party. Pressing Submit will submit a put request with the selected table's `table_id` to the server, pressing Cancel will return user to previous page. 

## Create Table `/tables/new`
> Displays a form for required information. Pressing Submit will submit a post request with the provided data to the server, pressing Cancel will return user to previous page.

## Search `/search`
> Displays a for a mobile number. Pressing Find will display all reservations associated with the `mobile_number` given in the form.


# Summary

This project was an exercise in developing a full-stack application from scratch. The goal was to allow users to see and update reservations systems internally, with a very straight-forward, interactive userface. 


# Technologies Used

* Backend built with `Node.js`, `Express.js`, and `Knex.js` for a `PostgreSQL` database (hosted on `ElephantSQL`)
* Frontend routing/state-management built with `React.js`
* Styling from `CSS` and `Bootstrap`
* Client and Server hosted on `Heroku`
* Testing with `Jest` (`Puppeteer` for frontend, `Supertest` for backend)


# Installation Instructions
1. Fork or Clone the repo.
2. Run `npm install` to install dependencies.
3. Run `cp ./back-end/.env.sample ./back-end/.env`, and add preferred PostgreSQL database instances to `./back-end/.env`.
4. Run `cp ./front-end/.env.sample ./front-end/.env`, the backend API will defaut to `http://localhost:5000` if there is no change to `./front-end/.env` .
5. Run `npm run start:dev` to start the server in development mode.
