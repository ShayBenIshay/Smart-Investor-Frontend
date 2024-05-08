# Smart-Investor
SmartInvestor: Intelligent Investment Management Platform

This project allows users to track their trade history on the NASDAQ stock market and view their portfolio. 
It provides real-time data updates using the Polygon finance API

To run this project you'll need to follow these steps:
1. Clone the Git repository:
  git clone <repository_url>
2. Create an API Key:
  -Go to the Polygon website [here](https://polygon.io/) 
  -Click on "Create API Key" and follow the provided instructions.
3. Navigate to the src directory and create a new file named api-token.js. Add the following two lines to the api-token.js file:
  //Polygon finance api token
  export const polygonAPIKey = 'YOUR POLYGON API KEY';
4. Navigate to the project directory:
  cd <project_directory>
5. Run the server (ensure Node.js is installed):
  node server.js
  After the server starts, you'll see the message: "Server running at http://localhost:3000/".
7. Access the application by opening a web browser and visiting: http://localhost:3000

*If you encounter issues in step 4 because port 3000 is in use, adjust the port number in the server.js file to a different value.

# Install Node.js
*If you don't have Node.js installed on your system, you can download and install it from the official [Node.js website](https://nodejs.org/). Follow the instructions provided on the website for your specific operating system.
