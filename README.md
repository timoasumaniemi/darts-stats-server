# darts-stats-server
 Darts Statistics server

 Backend server for handling Darts Statistics handling. Stores i.e new matches, legs, training matches in the database.
 Handles throw details and checkout throws for storing statistics.

 ***
 To install needed modules:<br>
 <code>npm install</code> 

 Add .env file in the root folder and fill the following details:<br>
 <code>DB_HOST = "....."</code><br>
 <code>DB_USERNAME = "....."</code><br>
 <code>DB_PASSWORD = "....."</code><br>
 <code>DB_DATABASE = "....."</code><br>
 <code>PORT = "....."</code><br>
 
 To run the server: <br>
 <code>npm start</code>

 Current routes (Actual API endpoints) are in <code>/routes</code> folder at corresponding files. See comments for each endpoint for further details:

 Visual Studio Code Postman can be used to sending HTTP Request to server. Tested with "x-www-form-urlencoded" in the request body.

 
