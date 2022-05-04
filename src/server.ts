import express from 'express';
import { prisma } from './prisma';
import nodemailer from 'nodemailer';

const app = express();

app.use(express.json());

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'dd2043dc6f73ce',
    pass: '102ff9a097f21f',
  },
});

app.post('/feedbacks', async (req, res) => {
  const { type, comment, screenshot } = req.body;

  const feedback = await prisma.feedback.create({
    data: {
      type,
      comment,
      screenshot,
    },
  });

  await transport.sendMail({
    from: 'Equipe Feedget <oi@feedget.com>',
    to: 'Rodrigo Mukudai <mkdigo@gmail.com>',
    subject: 'Novo feedback',
    html: [
      `<div style='font-family: sans-serif; font-size: 16px; color: #111;'>`,
      `<p>Tipo do feedback: ${type}</p>`,
      `<p>Comentário: ${comment}</p>`,
      `</div>`,
    ].join('\n'),
  });

  res.status(201).json({
    data: feedback,
  });
});

app.listen(3333, () => {
  console.log('HTTP server running on port 3333!');
});
