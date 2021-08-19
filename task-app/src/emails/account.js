
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vinicius.wurzel@gmail.com',
        subject: 'Welcome to task app',
        text: `Welcome to the app Mr ${name}`
    })
}

const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'vinicius.wurzel@gmail.com',
        subject: 'Good bye',
        text: `Im sorry that you went Mr ${name}`
    })
}

module.exports = { sendWelcomeEmail, sendByeEmail }