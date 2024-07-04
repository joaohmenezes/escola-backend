const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas

// Criar um aluno
app.post('/alunos', async (req, res) => {
  try {
    const { nome, dataNascimento, indice } = req.body;
    const novoAluno = await pool.query(
      'INSERT INTO alunos (nome, data_nascimento, indice) VALUES ($1, $2, $3) RETURNING *',
      [nome, dataNascimento, indice]
    );
    res.json(novoAluno.rows[0]);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Obter todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const todosAlunos = await pool.query('SELECT * FROM alunos');
    res.json(todosAlunos.rows);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Obter um aluno específico
app.get('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const aluno = await pool.query('SELECT * FROM alunos WHERE id = $1', [id]);
    if (aluno.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    res.json(aluno.rows[0]);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Atualizar um aluno
app.put('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, dataNascimento, indice } = req.body;
    const atualizarAluno = await pool.query(
      'UPDATE alunos SET nome = $1, data_nascimento = $2, indice = $3 WHERE id = $4 RETURNING *',
      [nome, dataNascimento, indice, id]
    );
    if (atualizarAluno.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    res.json(atualizarAluno.rows[0]);
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

// Excluir um aluno
app.delete('/alunos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const excluirAluno = await pool.query('DELETE FROM alunos WHERE id = $1 RETURNING *', [id]);
    if (excluirAluno.rows.length === 0) {
      return res.status(404).json({ erro: 'Aluno não encontrado' });
    }
    res.json({ mensagem: 'Aluno excluído com sucesso' });
  } catch (erro) {
    console.error(erro.message);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});