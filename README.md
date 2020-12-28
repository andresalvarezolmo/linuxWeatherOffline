# linuxweather
To run on your computer 
  - Create database: run file from sql/database.sql on a MySQL DBMS
  - Check access credentials to your DB instance at js/db.js
    ```javascript
    const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '1234',
    database: 'weatherapp'
    });
    ```
  - Install npm packages: # npm init
  - Init server: # nodemon
