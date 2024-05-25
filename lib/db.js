// lib/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '22b01a12b3@A',
  database: 'ecommerce',
});

export default pool;
