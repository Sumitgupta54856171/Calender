const Session= require("../model/session")
const Adjustment = require("../model/adjustment")
const Invoice = require("../model/invoice")

const resheduleBilledSession =async (req, res, next) => {
  try {
    const { 
      organization_id, 
      session_id, 
      tutor_name, 
      new_session_date, 
      new_start_time, 
      new_end_time 
    } = req.body;

    const newStartTimeDate = new Date(new_start_time);
    const newEndTimeDate = new Date(new_end_time);

    // 1. Fetch Original Session
    const originalSession = await Session.findById(session_id);
    if (!originalSession) return res.status(404).json({ success: false, message: "Session not found!" });
    
    if (originalSession.billing_status !== 'billed') {
      return res.status(400).json({ success: false, message: "Use normal update for unbilled sessions." });
    }

    const conflictingSession = await Session.findOne({
      organization_id: organization_id,
      tutor_name: tutor_name,
      _id: { $ne: session_id },
      start_time: { $lt: newEndTimeDate },
      end_time: { $gt: newStartTimeDate }
    });

    if (conflictingSession) {
      return res.status(409).json({ success: false, message: "Tutor is already booked!" });
    }


    const newAdjustment = await Adjustment.create({
      organization_id: organization_id,
      session_id: session_id,
      invoic_id: originalSession.invoice_id, 
      credit_amount: originalSession.session_cost, // e.g., 200 Rupees
      type: 'credit',
      description: `Billed session rescheduled. Credit applied to original invoice.`
    });

    const newInvoice = await Invoice.create({
      organization_id: organization_id,
      billingPeriod_start: newStartTimeDate, // Naye session ka start time
      billingPeriod_end: newEndTimeDate,     // Naye session ka end time
      total_amount: originalSession.session_cost, // e.g., 200 Rupees Debit
      status: 'issued'
    });

    const updatedSession = await Session.findByIdAndUpdate(
      session_id,
      {
        session_date: new Date(new_session_date),
        start_time: newStartTimeDate,
        end_time: newEndTimeDate,
        invoice_id: newInvoice._id
      },
      { new: true } 
    );

    res.status(200).json({
      success: true,
      message: "Session rescheduled, credit adjustment created, and new invoice generated!",
      data: {
        session: updatedSession,
        credit_adjustment: newAdjustment,
        new_debit_invoice: newInvoice
      }
    });

  } catch (error) {
    console.error("Reschedule Error:", error);
    next(error);
  }
};

module.exports={resheduleBilledSession}