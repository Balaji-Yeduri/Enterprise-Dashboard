var config = {};

config.web = {};
config.mongo = {};
config.asknow = {};

config.web.host = 'hostname';
config.web.port = 6379;
config.mongo.host = 'localhost:27017';
config.asknow.host ='https://asknowdev.service-now.com';
config.asknow.auth ='Basic ZXllU2hhcmVfSW50ZWdyYXRvcjpUZWxldGVjaEAx';
config.botsHost = "https://bots.kore.ai/chatbot/hooks/"
config.ELCBot = {
    botID:"st-b57f4910-6ca0-566a-b0e1-bfe26441d0c4",
    jwtToken:"bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYXBwSWQiOiJjcy04YjFhY2EyNS1iYjljLTU3YmItYmRmNS1kZjNjZDg1MzcxZGYifQ.3jKvbCijym85i0ntsU04Wh_236_T9A_jNpk_Z5vPoYc"
}
config.ASDBot = {
    botID:"st-b57f4910-6ca0-566a-b0e1-bfe26441d0c4",
    jwtToken:"bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYXBwSWQiOiJjcy04YjFhY2EyNS1iYjljLTU3YmItYmRmNS1kZjNjZDg1MzcxZGYifQ.3jKvbCijym85i0ntsU04Wh_236_T9A_jNpk_Z5vPoYc"
}
config.Informatica = {
    url:"https://usw1-apigw.dm1-us.informaticacloud.com/t/ttec.com/validate-oid?oracle_id=2123327",
    auth:"Basic a29yZS5haS5kZXY6azByM0AxYjB0"
}

module.exports = config;