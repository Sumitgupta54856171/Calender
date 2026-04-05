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
    const { organizationId, date } = req.params;

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId is required" });
    }

    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const sessions = await session.find({
      organization_id: organizationId,
      session_date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .sort({ start_time: 1 }); 

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