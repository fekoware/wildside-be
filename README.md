# Wildsight (Backend)

Wildsight is the backend for a wildlife-themed web application, built with Node.js and Express. The purpose of this project is to provide a RESTful API to manage wildlife-related data, such as species information, habitats, and sightings. 
## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Technologies](#technologies)
- [License](#license)

## Features

- RESTful API to manage wildlife data
- CRUD operations for species, and sightings
- Query support for filtering data
- Well-structured response format
- Error handling

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fekoware/wildside-be.git
2. Navigate to the project directory:
    
 ```bash
    cd wildside-be

```
3. Install dependencies:

  ```bash
npm install

```

3. Set up the environment variables:

Create a .env file in the root of your project and add the necessary environment variables (e.g., database connection string, port number).

Example .env:

```bash
=DB_URL=your-database-url
PORT=5000

```
4. Run the development server:

```bash

npm run dev
```

## Technologies
- Node.js - JavaScript runtime
- Express - Web framework for Node.js
- PostgreSQL - Database for storing data
- Jest - Testing framework


License
This project is licensed under the MIT License. See the LICENSE file for details.
