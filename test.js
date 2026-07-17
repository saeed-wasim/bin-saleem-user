// In any API route or component
import { db } from '../server/db.js';
const customers = db.prepare('SELECT * FROM customers').all();
console.log(customers);
console.log('sa');