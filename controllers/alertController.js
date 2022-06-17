const config = require('../config');
const axios = require('axios');



const sendemail =  (emailid,subject,message) =>{
    return new Promise((resolve, reject) => {
 
            
        
       axios.post('https://usw1-apigw.dm1-us.informaticacloud.com/t/ttec.com/chatbot-send-email', { 'to': emailid, 'cc': "",  'subject':subject,'body': message},{headers:{'Authorization': 'Basic a29yZS5haS5kZXY6azByM0AxYjB0'}})
      .then((res) => {
       // console.log(res.data);
        if(res.sstatusCode == '200'){
              console.log('emailsent');
        }
            resolve()
      
      //}
        })
      .catch((error) => {
        console.error(error)
        resolve()
      })
   
  
  });
  }

  

const sendteamsnotification =  (subject,message) =>{
    return new Promise((resolve, reject) => {
 

       axios.post('https://teletechinc.webhook.office.com/webhookb2/a41bc3cd-5c45-42ae-96f0-1e28f0cd8f00@5d5c9a50-c854-4ea3-b05d-16388b14d5b3/IncomingWebhook/949691072396427aba9559da34e163df/6c71ce76-fb70-428e-abc0-35dd098119c4',  {  "title":subject,"text": message })
      .then((res) => {
       // console.log(res.data);
        if(res.statusCode == '200'){
              console.log('team notification sent');
        }
            resolve()
      
      //}
        })
      .catch((error) => {
        console.error(error)
        resolve()

      })
   
  
  });
  }

  module.exports = { sendemail,sendteamsnotification};