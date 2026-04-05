const session = require('../model/session')

const createSession = async (req,res)=>{
    try {
        const {organization_id,tutorName,studentName,subject,sessionCost,recurrencePattern,date,startTime,endTime} = req.body
       
        if(req.body.billing_status === 'billed'){
            const invoice = await invoice.create({organization_id,billingPeriod_start:date,billingPeriod_end:date,total_amount:sessionCost})
        }
    }
    catch (error) {
        res.status(500).json({message:"Failed to create session",error:error.message})
    }
}

const getsessions = async(req,res)=>{
    try{
        console.log("Fetching sessions for organization ID:", req.params.organizationId);
        const sessions = await session.find({organization_id:req.params.organizationId})
        console.log("Sessions fetched:", sessions);
        res.status(200).json({message:"Sessions fetched successfully",data:sessions})

    }catch(error){
        res.status(500).json({message:"Failed to get sessions",error:error.message})
    }
}

const getSessionsByDate = async (req, res, next) => {
  try {
    // Frontend se organization_id aur date (optional) lenge
    // URL example: /api/sessions?organization_id=123&date=2026-04-21
    const { organizationId, date } = req.params;

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId is required" });
    }

    // 1. Target Date Set Karo
    // Agar frontend ne date bheji hai toh wo use karo, warna aaj ki date (new Date()) le lo
    const targetDate = date ? new Date(date) : new Date();

    // 2. Start of the Day (Raat ke 12 baje)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    // 3. End of the Day (Raat ke 11:59:59)
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 4. Database Query ($gte aur $lte ka use karke)
    const sessions = await session.find({
      organization_id: organizationId,
      session_date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .sort({ start_time: 1 }); // 1 ka matlab Ascending order (Subah ke sessions pehle aayenge)

    res.status(200).json({
      success: true,
      count: sessions.length,
      message: `Fetched sessions for ${startOfDay.toDateString()}`,
      data: sessions
    });
    console.log(`Fetched ${sessions.length} sessions for organization ID ${organizationId} on date ${targetDate.toDateString()}`);

  } catch (error) {
    next(error);
  }
};

module.exports = {getsessions,getSessionsByDate}