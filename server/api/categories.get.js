import { db, initializeDatabase } from '../db.js';

export default defineEventHandler(() => {
  try {
    initializeDatabase();
    const categories = db.prepare('SELECT id, name, description, image FROM categories ORDER BY id DESC').all();
    console.log('Fetched categories:', categories.length);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch categories'
    });
  }
});
