# Pull Request Template

## Description

The algorithm calculates an acceptance score (1 to 10) for patients based on demographic and behavioral data, estimating the likelihood that they will accept an appointment offer. Patients with low behavioral data are randomly assigned to the top of the list, ensuring fairness. The API allows filtering by facility location and returns the 10 patients most likely to accept the offer, optimizing resources and improving efficiency in the scheduling process.

You can read the documentation in README.md!

## Requirements

Ensure you have the following installed:

-    **Node.js**: Version 20.14.0 or higher
-    **npm**: Version 10.7.0 or higher
-    **Docker**: Version 27.2.0 or compatible
-    **Docker Compose** version v2.29.2 for desktop!

## Implementation

-    Service - Load the file into memory
-    Separate all calculation methods into a class.
-    Function - Go through the list to obtain **minimums and maximums** using Normalization and Calculate the distance using **Haversine**.
-    Function - Normalize the values ​​with the formula **Min-Max**, remembering to invert the weight if it is Distance, canceled offers and reply time, since the more, the worse.
-    Function - Get the normalized values ​​and calculate with weight, finding the score of that patient.
-    Function - Behavior logic, performs a normalization based on the total sum of offers and uses this value to obtain a normalized data, setting a minimum to be considered little behavioral information.
-    Service - Sorts the patients by score and adds some without behavior randomly among the 10. The random value is set in the environment variables.

## Considerations

1. Prefer to use nodemon with tsx instead of only tsx watch!
2. Since I don't have that many interfaces, I don't separate them into folders!
3. Models: Simple interface / type or class with a constructor, getters and setters?
4. The api route that I'm going to create expects to receive lat and long in body instead of using query params. However, it could receive a complete address and the api itself could get these lat and long values.
5. Used SOLID as the architecture to be followed in my test (Used "I", "O", "S" and "D")! I ​​also kept classes and interfaces but exported functions when necessary (The best of both worlds)!
6. Created the high-level modules in such a way that if it was necessary to create another high-level module I would only need to adjust the imports.
7. Used haversine formula! The Haversine formula determines the great circle distance between two points on a sphere, given their longitudes and latitudes.
8. Since no logic was provided to weight the scores, I created it myself using Min-Max Normalization, defined by x = y - z / a - z. Where y is the current value, z is the minimum and a is the maximum. This logic was used for age, distance and accepted offers
9. For metrics such as CANCELED_OFFERS, DISTANCE and REPLY_TIME, where higher values ​​are worse, the scale was inverted. x_inv = 1 - x.
10. Had to save the total bids to be able to classify someone as "little" behavior
11. Had to normalize the behavior score I created using what I saved from the total offers, so I could separate those with a lot and little behavior later.
12. created a debug route in case you want to test the values, and a route with a prettier response! `api/v1/list-generator/debug`, with the same body!
13. Left the number of good patients and bad patients within the environment variables, to make it easy to change the number of each of the 10. So, the sum of the two variables cannot exceed 10!
14. _I separated production and development! If you want to test the code after building the javascript, you will use .env.prod along with the npm run start script! If you run the application through docker, it will always run in production!_
15. I chose to put all the calculations together in a single file, I could have put them in separate files, it's up to taste!

## Type of change

Please delete options that are not relevant.

-    [x] New feature (non-breaking change which adds functionality)
-    [x] This change requires a documentation update

## How Has This Been Tested?

Please describe the tests that you ran to verify your changes. Provide instructions so we can reproduce.

-    [x] `npm run test:coverage` - is a metric that measures the amount of source code that is executed during test execution.
-    [x] `npm run test`

## Checklist:

-    [x] I have performed a self-review of my own code
-    [x] I have tested my code to prove my fix is effective or that my feature works
-    [x] I have commented my code in areas where it's hard to make the code speak for itself
-    [x] My changes breaks no tests
