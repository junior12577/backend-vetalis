import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import Agendamento from "./models/Agendamento.js";
import User from './models/User.js';
import bcrypt from 'bcrypt';
import { enviarEmailConsulta } from './email/emailService.js';
import dotenv from 'dotenv';
dotenv.config();
import moment from 'moment-timezone';




const app = express();
app.use(cors());


app.use(express.json());



app.get("/agendamento", async(req, res) => {
    const agendamentos= await Agendamento.find()

    return res.status(200).json(agendamentos);
})
app.get("/agendamento/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const consulta = await Agendamento.findById(id);
    if (!consulta) return res.status(404).json({ message: "Consulta não encontrada" });
    res.status(200).json(consulta);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar consulta', error: err.message });
  }
});

app.get('/consultas', async (req, res) => {
  const consultas = await Agendamento.find();
  res.json(consultas);
});

app.delete("/agendamento/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Agendamento.findByIdAndDelete(id);
    res.status(200).json({ message: 'Consulta excluída com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir consulta', error: err.message });
  }
});



app.put("/agendamento/:id", async (req, res) => {
  try {
    const { Data } = req.body;

    // Corrigir a data se ela estiver presente na edição
    if (Data) {
      req.body.Data = moment.tz(Data, 'YYYY-MM-DD', 'America/Sao_Paulo').startOf('day').toDate();
    }

    const agendamentoAtualizado = await Agendamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(agendamentoAtualizado);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar consulta', error: err.message });
  }
});



app.post('/agendamento', async (req, res) => {
  try {
    const { Data, Horario } = req.body;

    // Corrigir o fuso da data
    const dataCorrigida = moment.tz(Data, 'YYYY-MM-DD', 'America/Sao_Paulo').startOf('day').toDate();

    // Verificar se já existe consulta para essa data e horário
    const consultaExistente = await Agendamento.findOne({ Data: dataCorrigida, Horario });

    if (consultaExistente) {
      return res.status(409).json({ message: 'Já existe uma consulta agendada para essa data e horário.' });
    }

    // Salvar com a data corrigida
    const novoAgendamento = new Agendamento({ ...req.body, Data: dataCorrigida });
    const salvo = await novoAgendamento.save();

    await enviarEmailConsulta({
      nomePet: salvo.pet,
      nomeTutor: salvo.nome_tutor,
      email: salvo.Email,
      data: salvo.Data,
      hora: salvo.Horario,
      motivo: salvo.Motivo
    });

    return res.status(201).json({ mensagem: 'Consulta agendada e e-mail enviado!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});






import jwt from 'jsonwebtoken';
const JWT_SECRET = 'uma_chave_secreta_supersegura';

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const usuario = await User.findOne({ username });
    if (!usuario) return res.status(400).json({ message: 'Usuário ou senha inválidos' });

    const senhaValida = await bcrypt.compare(password, usuario.password);
    if (!senhaValida) return res.status(400).json({ message: 'Usuário ou senha inválidos' });

    const token = jwt.sign({ id: usuario._id, username: usuario.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Login efetuado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao tentar logar', error: err.message });
  }
});




app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    
    const userExistente = await User.findOne({ username });
    if (userExistente) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

  
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(password, salt);

   
    const novoUsuario = new User({ username, password: senhaHash });
    await novoUsuario.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
  }
});



mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("banco conectado"))
    .catch(() => console.log("deu ruuuuim"))


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
