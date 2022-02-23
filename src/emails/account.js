// const sendgridAPIkey = 'SG.bBO3BvrBQc2zFzzDV8nrQA.CBGKogOzGSjgNO6dnUGdgBHpHGUNcq0NsUEFdLHPnFc'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendwlcemail = (email,name)=>{
    sgMail.send({
        to:email,
        from:'abhishah0196@gmail.com',
        subject:'Thanks for creating account',
        text:`welcome ${name} ! how are you?`
    })
}
const sendrmvemail = (email,name2)=>{
    sgMail.send({
        to:email,
        from:'abhishah0196@gmail.com',
        subject:'Why are you Deleting account?',
        text:` ${name2} ! how are you? Please create a new account`
    })
}
module.exports = {
    sendwlcemail,
    sendrmvemail
}




// sgMail.send({
//     to:'anshshah0961@gmail.com',
//     from:'abhishah0196@gmail.com',
//     subject:'first mail',
//     text:'hello'
// })