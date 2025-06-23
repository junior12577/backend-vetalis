import mongoose from "mongoose";


const AgendamentoSchema = new mongoose.Schema({
  pet: { type: String, required: true },
  nome_tutor: { type: String, required: true },
  idade_pet: { type: Number, required: true },
  Telefone: { type: String, required: true },
  Email: { type: String, required: true },
  Rua: { type: String, required: true },
  Cidade: { type: String, required: true },
  Estado: { type: String, required: true },
  Motivo: { type: String, required: true },
  Data: { type: Date, required: true },
  Horario: { type: String, required: true },
});

const Agendamento = mongoose.model('Agendamento', AgendamentoSchema);

export default mongoose.model('Agendamentos', AgendamentoSchema)