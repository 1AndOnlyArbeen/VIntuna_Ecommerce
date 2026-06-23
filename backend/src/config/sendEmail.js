import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RESEND_API) {
  console.log('Provide RESEND_API in side the .env file');
}

// Only construct the client when a key exists; newer resend versions throw on a missing key.
const resend = process.env.RESEND_API ? new Resend(process.env.RESEND_API) : null;

const sendEmail = async ({ sendTo, subject, html }) => {
  if (!resend) {
    console.log('Email skipped: RESEND_API not configured.');
    return null;
  }
  try {
    const { data, error } = await resend.emails.send({
      from: 'VintunaStore <onboarding@resend.dev>',
      to: sendTo,
      subject: subject,
      html: html,
    });

    if (error) {
      return console.error({ error });
    }

    return data;
  } catch (error) {
    console.log(error);
  }
};

export {sendEmail};
