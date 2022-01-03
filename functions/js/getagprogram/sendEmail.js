const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

/**
 * メール送信を行う実体
 * @param {object} mailer
 * {
 *    req
 *    res
 *    functions
 *    to
 *    subject
 *    msg
 * }
 * @return result 処理結果
 */
exports.sendEmail = (mailer) => {
    const result = cors(mailer.req, mailer.res, () => {
        const from = mailer.functions.config().gmail.email;
        const to = mailer.to;
        const msg = mailer.msg;
        const smtpConfig = {
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: from,
                pass: mailer.functions.config().gmail.password,
            },
        };
        const transporter = nodemailer.createTransport(smtpConfig);

        const mailOptions = {
            from: from,
            to: to,
            subject: mailer.subject,
            html: `${msg}`,
        };

        // Getting results
        const result = transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return "error: " + err.toString();
            }
            return "success: " + info.toString();
        });
        return result;
    });
    return result;
};
