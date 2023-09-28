const nodemailer = require("nodemailer");

const { google } = require("googleapis");

const oauth_link = "https://developers.google.com/oauthplayground";
const { EMAIL, MAILING_ID, MAILING_REFRESH, MAILING_SECRET } = process.env;

const oauth2Client = new google.auth.OAuth2(
    MAILING_ID,
    MAILING_SECRET,
    MAILING_REFRESH,
    oauth_link
);

exports.sendVerificationEmail = (email, name, url) => {

    oauth2Client.setCredentials({
        refresh_token: MAILING_REFRESH,
    });

    const accessToken = oauth2Client.getAccessToken();

    const smtp = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: EMAIL,
            clientId: MAILING_ID,
            clientSecret: MAILING_SECRET,
            refreshToken: MAILING_REFRESH,
            accessToken,
        },
    });

    const mailOptions = {
        from: EMAIL,
        to: email,
        subject: "Facebook email verification",
        html: generateEmailTemplate(name, url),
    };

    smtp.sendMail(mailOptions, (err, res) => {
        if (err) return err;
        return res;
    });

};

function generateEmailTemplate(name, url) {
    return `<html>

    <head>
        <style>
            .image-container {
                max-width: 700px;
                margin-bottom: 1rem;
                display: flex;
                align-items: center;
                gap: 10px;
                font-family: Roboto;
                font-weight: 600;
                color: #3b5998;
            }
    
            .image {
                width: 30px;
            }
    
            .content {
                padding: 1rem 0;
                border-top: 1px solid #e5e5e5;
                border-bottom: 1px solid #e5e5e5;
                color: #141823;
                font-size: 17px;
                font-family: Roboto;
            }
    
            .description-block {
                padding: 20px 0;
            }
    
            .description {
                padding: 1.5rem 0;
            }
    
            .activate-link {
                width: 200px;
                padding: 10px 15px;
                background-color: #4c649b;
                color: #fff;
                text-decoration: none;
                font-weight: 600;
            }
    
            .message {
                padding-top: 20px;
            }
    
            .message-content {
                margin: 1.5rem;
                color: #898f9c;
            }
        </style>
    </head>
    
    <body>
        <div class="image-container">
            <img class="image" src="https://res.cloudinary.com/dmhcnhtng/image/upload/v1645134414/logo_cs1si5.png"
                alt="Not Found" />
            <span>Action require: Activate your facebook account</span>
        </div>
        <div class="content">
            <span>Hello ${name}</span>
            <div class="description-block">
                <span class="description">
                    >You recently created an account on facebook. To complete your registration, please confirm your
                    account.
                </span>
                <a href="${url}" class="activate-link">Confirm your account</a>
                <div class="message">
                    <span class="message-content">
                        > facebook allows you to stay in touch with all your friends, once registered on facebook, you can
                        share photos, organize events and much more.
                    </span>
                </div>
            </div>
        </div>
    </body>
    
    </html>`;
}