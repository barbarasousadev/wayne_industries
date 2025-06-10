require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const equipesRoutes = require('./routes/equipesRoutes');
const recursosRoutes = require('./routes/recursosRoutes');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/dashboard', express.static(path.join(__dirname, 'client/dashboard')));
app.use('/funcionario', express.static(path.join(__dirname, 'client/funcionario')));
app.use('/gerente', express.static(path.join(__dirname, 'client/gerente')));
app.use('/login', express.static(path.join(__dirname, 'client/login')));
app.use('/api/equipes', equipesRoutes);
app.use('/api/recursos', recursosRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/relatorios', relatoriosRoutes);
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
app.use(express.static(path.join(__dirname, 'client')));
