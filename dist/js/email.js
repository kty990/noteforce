const Imap = require('node-imap');
const EventEmitter = require('events');

class EmailListener extends EventEmitter {
    constructor(options) {
        super();
        this.imap = new Imap(options);

        this.imap.once('ready', () => {
            this.openInbox((err) => {
                if (err) {
                    this.emit('error', err);
                    return;
                }

                this.imap.on('mail', (numNewMsgs) => {
                    this.fetchNewMessages(numNewMsgs);
                });

                // Set up IMAP IDLE to listen for new messages
                this.imap.idle();
            });
        });

        this.imap.once('error', (err) => {
            this.emit('error', err);
        });

        this.imap.once('end', () => {
            this.emit('end');
        });

        // Connect to the IMAP server
        this.imap.connect();
    }

    openInbox(cb) {
        this.imap.openBox('INBOX', true, cb);
    }

    fetchNewMessages(numNewMsgs) {
        this.openInbox((err, box) => {
            if (err) {
                this.emit('error', err);
                return;
            }

            // Fetch the complete email body for the latest new message
            const f = this.imap.seq.fetch(box.messages.total + ':*', {
                bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
                struct: true,
                markSeen: true, // Mark the message as read
            });

            f.on('message', (msg, seqno) => {
                const emailContent = { headers: null, body: null };

                msg.on('body', (stream, info) => {
                    let buffer = '';
                    stream.on('data', (chunk) => {
                        buffer += chunk.toString('utf8');
                    });

                    stream.once('end', () => {
                        emailContent.body = buffer;
                    });
                });

                msg.once('attributes', (attrs) => {
                    emailContent.headers = attrs['headers'];
                });

                msg.once('end', () => {
                    this.emit('newMessage', emailContent.body, emailContent.headers.date);
                });
            });
        });
    }

    close() {
        this.imap.end();
    }
}

// // Example usage:
// const emailListener = new EmailListener({
//     user: 'your_email_address',
//     password: 'your_email_password',
//     host: 'imap.gmail.com',
//     port: 993,
//     tls: true,
// });

// emailListener.on('newMessage', (content, timestamp) => {
//     console.log('New email content:', content);
//     console.log('Timestamp:', timestamp);
// });

// // To close the connection when needed
// // emailListener.close();

class EmailSender {
    constructor(options) {
        this.transporter = nodemailer.createTransport(options);
    }

    sendEmail(mailOptions) {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(info);
                }
            });
        });
    }
}

// Example usage:
// const emailOptions = {
//   service: 'gmail',
//   auth: {
//     user: 'your_gmail_address',
//     pass: 'your_gmail_password',
//   },
// };

// const emailSender = new EmailSender(emailOptions);

// const mailOptions = {
//   from: 'your_gmail_address',
//   to: 'recipient_email_address',
//   subject: 'Email Subject',
//   text: 'Email Content',
// };

// emailSender.sendEmail(mailOptions)
//   .then((info) => {
//     console.log('Email sent:', info.response);
//   })
//   .catch((error) => {
//     console.error('Error sending email:', error);
//   });

module.exports = { EmailSender, EmailListener }