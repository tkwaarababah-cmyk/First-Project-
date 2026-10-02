const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// GET /api/expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM public.expenses ORDER BY id;"
      
    );
res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database error"
    });
  }
});



app.get('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM  public.expenses WHERE id = $1;',
      [id]
    );
    // إذا المصروف غير موجود
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }
        // إذا موجود
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch expense'
    });
  }
});
// POST /api/expenses - إضافة مصروف جديد
app.post('/api/expenses', async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // التحقق من البيانات
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        error: 'Missing required fields: title, amount, category, date'
      });
    }

    //  التحقق من الـ Category
    const validCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    // التحقق من القيم
    if (amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be greater than 0'
      });
    }

    // التحقق من الـ Title
    if (title.trim().length === 0) {
      return res.status(400).json({
        error: 'Title cannot be empty'
      });
    }

    //  التحقق من الـ Date (صيغة صحيحة)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: 'Date must be in format YYYY-MM-DD'
      });
    }

    const result = await pool.query(
      `INSERT INTO public.expenses (title, amount, category, date) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') as date;`,
      [title, amount, category, date]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: 'Failed to create expense',
      message: error.message
    });
  }
});
    app.put('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    //  التحقق من البيانات
    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        error: 'Missing required fields: title, amount, category, date'
      });
    }

    //  التحقق من الـ Category
    const validCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Must be one of: ${validCategories.join(', ')}`
      });
    }

    //  التحقق من القيم
    if (amount <= 0) {
      return res.status(400).json({
        error: 'Amount must be greater than 0'
      });
    }

    //  التحقق من الـ Title
    if (title.trim().length === 0) {
      return res.status(400).json({
        error: 'Title cannot be empty'
      });
    }

    // التحقق من الـ Date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: 'Date must be in format YYYY-MM-DD'
      });
    }

    // تحديث البيانات
    const result = await pool.query(
      `UPDATE public.expenses 
       SET title = $1, amount = $2, category = $3, date = $4 
       WHERE id = $5 
       RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') as date;`,
      [title, amount, category, date, id]
    );

    //  404 - المصروف غير موجود
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    //  200 - تحديث ناجح
    res.status(200).json({
      message: 'Expense updated successfully',
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: 'Failed to update expense',
      success: false,
      message: error.message
    });
  }
});

// DELETE /api/expenses/:id - حذف مصروف
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // حذف المصروف من Database
    const result = await pool.query(
      `DELETE FROM public.expenses 
       WHERE id = $1 
       RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') as date;`,
      [id]
    );

    //  404 - المصروف غير موجود
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Expense not found'
      });
    }

    //  200 - حذف ناجح
    res.status(200).json({
      message: 'Expense deleted successfully',
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: 'Failed to delete expense',
      success: false,
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});