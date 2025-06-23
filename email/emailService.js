import nodemailer from 'nodemailer';
import { gerarHtmlEmail } from './emailtamplate.js';
import path from 'path';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vetalis.clinica@gmail.com',
    pass: 'cigf mpat isjb zcjq' 
  }
});

export async function enviarEmailConsulta(dados) {
  const { nomePet, nomeTutor, email, data, hora, motivo } = dados;

  const html = gerarHtmlEmail({ nomePet, nomeTutor, data, hora, motivo });

  const mailOptions = {
    from: 'vetalis.clinica@gmail.com',
    to: email,
    subject: `Nova Consulta para ${nomePet}`,
    html: html,
     attachments: [
    {
      filename: 'logo_email.png',
      path: './img/logo_email.png', 
      cid: 'logo' 
    }
  ]
  };

  await transporter.sendMail(mailOptions);
}
