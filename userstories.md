User Story 1:I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.

User Story 2: I can get an JSON of all users by getting api/exercise/users with the same info as when creating a user.

User Story 3: I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will be the user object also with the exercise fields added.

User Story 4:I can retrieve a JSON with the full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).

User Story 5: I can retrieve a JSON with part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

To search for the log of exercises from a certain userId type the URL address would look like this http://localhost:3000/api/exercise/log?userId=217333