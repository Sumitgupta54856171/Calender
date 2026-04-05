const Session = require('../model/session'); // Session model import karna zaroori hai
const Invoice = require('../model/invoice'); // Invoice model import karna
const Adjustment = require('../model/adjustment'); // Adjustment model import karna zaroori hai
const mongoose = require('mongoose');

const createSessionAndBill = async (req, res, next) => {

  console.log(req.body);

  try {
    const { 
      organization_id, 
      tutor_name, 
      student_name, 
      session_date, 
      start_time, 
      end_time,
      session_cost, // Yeh zaroori hai bill amount ke liye
      recurrence_pattern, // Optional, agar user ne diya hai toh
      billing_status // Boolean flag frontend se aayega (true/false)
    } = req.body;

    const weeksToCreate = recurrence_pattern ? parseInt(recurrence_pattern, 10) : 1;
    console.log(weeksToCreate)
    const sessionsToInsert = [];

    const addDays = (originalDate, daysToAdd) => {
      const result = new Date(originalDate);
      result.setDate(result.getDate() + daysToAdd);
      return result;
    };

    // 1. Pehle saare sessions ka data array mein jama karo
    for (let i = 0; i < weeksToCreate; i++) {
      const daysOffset = i * 7;
      
      sessionsToInsert.push({
        organization_id,
        tutor_name,
        student_name,
        session_cost, // Default 0 hoga agar nahi bheja toh
        session_date: addDays(session_date, daysOffset),
        start_time: addDays(start_time, daysOffset),
        end_time: addDays(end_time, daysOffset),
        billing_status: billing_status, // Default unbilled
        invoice_id: null
      });
    }

    let createdInvoice = null;

    // 2. THE MAGIC: Agar user chahta hai ki turant bill ban jaye
    if (billing_status == 'billed') {
      // Total amount calculate karo
      const totalAmount = sessionsToInsert.reduce((sum, s) => sum + (s.session_cost || 0), 0);

      // Pehle Invoice create karo taaki uska _id mil sake
      const newInvoice = await Invoice.create([{
        organization_id,
        billingPeriod_start: sessionsToInsert[0].session_date, // Pehli class ki date
        billingPeriod_end: sessionsToInsert[sessionsToInsert.length - 1].session_date, // Aakhiri class ki date
        total_amount: totalAmount,
        status: 'issued'
      }]);

      createdInvoice = newInvoice[0];
      console.log('Created Invoice:', createdInvoice);

      // Ab un saare sessions ko modify karke 'billed' aur invoice_id add kar do
      sessionsToInsert.forEach(session => {
        session.billing_status = 'billed';
        session.invoice_id = createdInvoice._id;
      });
    }

    
    const createdSessions = await Session.insertMany(sessionsToInsert);

   

    res.status(201).json({
      success: true,
      message: billing_status === 'billed' 
        ? `${weeksToCreate} sessions created and billed successfully!` 
        : `${weeksToCreate} sessions created successfully!`,
      data: {
        sessions: createdSessions,
        invoice: createdInvoice // Agar bill nahi bana toh yeh null hoga
      }
    });

  } catch (error) {
    
    next(error);
  } 
};

const getbills = async(req,res,next)=>{
    try {
    const { organizationId } = req.params;

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId is required" });
    }

    // Us organization ke saare invoices fetch karo
    const invoices = await Invoice.find({ organization_id: organizationId })
      .sort({ createdAt: -1 }); // Naye bills sabse upar

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });

  } catch (error) {
    next(error);
  }
}

const getAdjustments = async (req,res)=>{
    try {
    const { organizationId } = req.params; // URL se org id nikalenge

    if (!organizationId) {
      return res.status(400).json({ success: false, message: "organizationId is required" });
    }

    // Organization ke saare adjustments dhoondo aur naye wale pehle dikhao
    const adjustments = await Adjustment.find({ organization_id: organizationId })
      .populate('session_id', 'tutor_name student_name session_date') // Session ka data
      .populate('invoic_id', 'status total_amount') // Purane Invoice ka data
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: adjustments.length,
      data: adjustments
    });

  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSessionAndBill,getbills,getAdjustments
};