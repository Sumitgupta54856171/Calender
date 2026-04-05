const express = require("express")
const app = express()
require('dotenv').config
const {mongoconnect} = require("./config/mongoose")
const {createSessionAndBill} = require('./controller/bill')
const cors = require("cors")
const {getsessions} = require('./controller/session')

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    return "Hello world"
})
app.post('/api/sessions',createSessionAndBill)
app.get('/api/sessions/:organizationId',getsessions)


PORT=3000

app.listen(PORT,'0.0.0.0',()=>{
console.log(`server is start http://localhost:${PORT}`)
mongoconnect()
})