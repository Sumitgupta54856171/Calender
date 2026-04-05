const express = require("express")
const app = express()
require('dotenv').config()
const {mongoconnect} = require("./config/mongoose")
const {createSessionAndBill,getbills,getAdjustments} = require('./controller/bill')
const cors = require("cors")
const {getsessions} = require('./controller/session')
const {resheduleBilledSession} = require('./controller/adjustment')
const {getSessionsByDate} = require('./controller/session')


app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
   res.send("Hello World")
})
app.post('/api/sessions',createSessionAndBill)
app.get('/api/sessions/:organizationId',getsessions)
app.get('/api/sessions/:organizationId/:date',getSessionsByDate)
app.put('/api/sessions/reschedule',resheduleBilledSession)
app.get('/api/bills/:organizationId',getbills)
app.get('/api/adjustments/:organizationId',getAdjustments)

PORT= process.env.port ||3000

app.listen(PORT,'0.0.0.0',()=>{
console.log(`server is start http://localhost:${PORT}`)
mongoconnect()
})