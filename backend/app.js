import express from 'express';
import mysql from 'mysql2/promise'; // IMPORTANTE: Usar la versión con promesas
import cors from 'cors';
const app = express();
const corsOptions = {
  origin: [
    'https://main.d3obtzx7klk7yu.amplifyapp.com'
  ],
  methods:['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders:['Content-Type','Authorization'],
  credentials:true,
  optionsSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
const PORT = process.env.PORT || 3000;
// --- Conexión mediante Pool (Mejor para múltiples conexiones simultáneas) ---
const pool = mysql.createPool({
  host: 'database-1.cqfeaks26lig.us-east-1.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  password: 'Stiven101819',
  database: 'restaurant_reviews',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Probar la conexión al iniciar el servidor
pool.getConnection()
  .then(conn => {
    console.log('¡Conexión exitosa a la base de datos MySQL (AWS RDS)!');
    conn.release();
  })
  .catch(err => {
    console.error('Error conectando a la base de datos:', err);
  });
// Ruta básica
app.get('/', (req, res) => {
  res.send('API de Restaurantes funcionando correctamente');
});
// ==========================================
// RUTAS PARA USUARIOS (Tabla: User)
// ==========================================
// Crear un usuario (POST /usuarios)
app.post('/usuarios', async (req, res) => {
  const { name, email, password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const joined = new Date(); // Fecha actual
    const [result] = await conn.query(
      'INSERT INTO User (name, email, password, joined) VALUES (?, ?, ?, ?)',
      [name, email, password, joined]
    );
    res.status(201).json({ ok: true, mensaje: 'Usuario creado.', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al crear el usuario', error: error.message });
  } finally {
    if (conn) conn.release();
  }
});
// Iniciar sesión (POST /login)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT id, name, email, joined FROM User WHERE email = ? AND password = ?', [email, password]);
    if (rows.length > 0) {
      res.json({ ok: true, usuario: rows[0] });
    } else {
      res.status(401).json({ ok: false, mensaje: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al iniciar sesión', error: error.message });
  } finally {
    if (conn) conn.release();
  }
});
// Obtener todos los usuarios (GET /usuarios)
app.get('/usuarios', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT id, name, email, joined FROM User'); // Excluimos el password por seguridad
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener usuarios', error: error.message });
  } finally {
    if (conn) conn.release();
  }
});
// ==========================================
// RUTAS PARA RESTAURANTES (Tabla: Restaurant)
// ==========================================
// Crear un restaurante (POST /restaurantes)
app.post('/restaurantes', async (req, res) => {
  const { name, location, category, image } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.query(
      'INSERT INTO Restaurant (name, location, category, image) VALUES (?, ?, ?, ?)',
      [name, location, category, image]
    );
    res.status(201).json({ ok: true, mensaje: 'Restaurante creado.', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al crear el restaurante', error: error.message });
  } finally {
    if (conn) conn.release();
  }
});
// Obtener todos los restaurantes (GET /restaurantes)
app.get('/restaurantes', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM Restaurant');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener restaurantes', error: error.message });
  } finally {
    if (conn) conn.release();
  }
});
// ==========================================
// RUTAS PARA RESEÑAS (Tabla: Review)
// ==========================================
// Crear una reseña (POST /resenas)
app.post('/resenas', async (req, res) => {
  const { user_id, restaurant_id, rating, text, image, author, author_initial, date, likes, category } = req.body;
  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.query(
      `INSERT INTO Review 
       (user_id, restaurant_id, rating, text, image, author, author_initial, date, likes, category) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, restaurant_id, rating, text, image, author, author_initial, date, likes || 0, category]
    );
    res.status(201).json({ ok: true, mensaje: 'Reseña creada.', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al crear la reseña', error: error.message });
  } finally {
    if (conn) conn.release();
  }
});
// Obtener reseñas, opcionalmente filtradas por restaurante_id (GET /resenas?restaurant_id=X)
app.get('/resenas', async (req, res) => {
  const { restaurant_id } = req.query;
  let conn;
  try {
    conn = await pool.getConnection();
    let query = `
      SELECT 
        Review.*, 
        Restaurant.name AS restaurant, 
        Restaurant.location AS location 
      FROM Review
      LEFT JOIN Restaurant ON Review.restaurant_id = Restaurant.id
    `;
    let params = [];

    // Si se envía el query parameter restaurant_id, filtramos
    if (restaurant_id) {
      query += ' WHERE Review.restaurant_id = ?';
      params.push(restaurant_id);
    }
    
    // Ordenar de más reciente a más antiguo
    query += ' ORDER BY Review.id DESC';

    const [rows] = await conn.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error al obtener las reseñas', error: error.message });
  } finally {
    if (conn) conn.release();
  }
});
// ==========================================
// Iniciar el servidor
// ==========================================
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});