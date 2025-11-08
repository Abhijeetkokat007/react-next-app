// controllers/personController.js
import { getAllPersons, addPerson } from '../models/personModel.js';

export const getPersons = async (req, res) => {
  try {
    const persons = await getAllPersons();
    res.json(persons);
  } catch (error) {
    console.error('❌ Error fetching persons:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

export const createPerson = async (req, res) => {
  try {
    const data = req.body;

    // 🧠 Case 1: Array of users (bulk insert)
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(400).json({ error: 'Empty data array' });
      }

      const insertedRecords = [];
      for (const user of data) {
        if (!user.name || !user.city) {
          console.warn('⚠️ Skipping invalid record:', user);
          continue;
        }
        const newPerson = await addPerson(user.name, user.city);
        insertedRecords.push(newPerson);
      }

      return res
        .status(201)
        .json({ message: `${insertedRecords.length} records inserted`, data: insertedRecords });
    }

    // 🧠 Case 2: Single object insert
    const { name, city } = data;

    if (!name || !city) {
      return res.status(400).json({ error: 'Name and City are required' });
    }

    const newPerson = await addPerson(name, city);
    res.status(201).json(newPerson);
  } catch (error) {
    console.error('❌ Error inserting person:', error);
    res.status(500).json({ error: 'Insert failed' });
  }
};
