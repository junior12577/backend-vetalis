import fs from 'fs';
import path from 'path';
import juice from 'juice';
import { dirname } from 'path';
import { fileURLToPath } from 'url';


export function gerarHtmlEmail(dados) {
  const { nomePet, nomeTutor, data, hora, motivo } = dados;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



  const cssPath = path.resolve(__dirname, './emailStyles.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  const dataFormatada = new Date(data).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const html = `
    <html>
      <head><style>${css}</style></head>
      <body>
        <h2>Consulta Agendada</h2>
        
        <p><strong>Pet:</strong> ${nomePet}</p>
        <p><strong>Tutor:</strong> ${nomeTutor}</p>
        <p><strong>Data:</strong> ${dataFormatada}</p>
        <p><strong>Horário:</strong> ${hora}</p>
        <p><strong>Motivo:</strong> ${motivo}</p>
        <p><strong>Endereço:</strong> Rua São Salvador, 63-1 - Jardim Belo Horizonte, Campinas - SP, 13076-540<br>
        Clínica Veterinária Vetalis</p>
      </body>
      <footer>
      <img src="cid:logo" alt="Logo da Clínica" style="width: 150px; margin-bottom: 20px;" />
      </footer>
    </html>
  `;

  return juice(html);
}
