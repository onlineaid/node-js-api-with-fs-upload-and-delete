const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const {OAuth2} = google.auth;
const AUTH_PLAYGROUND  = 'https://developers.google.com/oauthplayground'

const {
    GM_CLIENT_ID ,
    GM_CLIENT_SECRET,
    GM_REFRESH_TOKEN,
    SERVICE_EMAIL
} = process.env


const auth2client = new OAuth2(
    GM_CLIENT_ID ,
    GM_CLIENT_SECRET,
    GM_REFRESH_TOKEN,
    AUTH_PLAYGROUND
)


const sendEmail = (to, url, txt) => {
    auth2client.setCredentials( {
        refresh_token : GM_REFRESH_TOKEN
    })

    const access_token = auth2client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service : 'gmail',
        auth: {
            type: 'OAuth2',
            user: SERVICE_EMAIL,
            clientId: GM_CLIENT_ID,
            clientSecret: GM_CLIENT_SECRET,
            refreshToken: GM_REFRESH_TOKEN,
            access_token
        }
    })

    const mailOptions = {
        from: SERVICE_EMAIL,
        to: to,
        subject : 'Online Aid Service',
        html : `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the Online Aid.</h2>
            <p>Congratulations! You're almost set to start using Online✮SHOP.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if(err) return err;
        return infor
    })

}

module.exports = sendEmail


