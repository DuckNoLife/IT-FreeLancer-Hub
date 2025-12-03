const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Job = require('../models/Job');
const User = require('../models/User');

// Configuration constant
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; 

// Utility: Handle successful payment fulfillment
const fulfillOrder = async (session) => {
    // Extract metadata
    const { service, userId, jobId } = session.metadata;

    console.log(`[Webhook] Fulfillment started for service: ${service}, User: ${userId}`);

    if (service === 'PRO_UPGRADE') {
        // PRO account update
        await User.findByIdAndUpdate(userId, { isPro: true });
        console.log(`[Webhook] User ${userId} successfully upgraded to PRO.`);
        
    } else if (service === 'JOB_PREMIUM') {
        // Premium job update
        await Job.findByIdAndUpdate(jobId, { isPremium: true });
        console.log(`[Webhook] Job ${jobId} successfully promoted to Premium.`);
        
    } else {
        console.error(`[Webhook] Unknown service type: ${service}`);
        return false;
    }

    return true;
};

// Route definition: POST /webhook
// Handler for incoming Stripe events
module.exports = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        // Signature verification
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`[Webhook Error] Invalid signature: ${err.message}`);
        return res.status(400).send(`Webhook Error: Invalid signature.`);
    }
    
    // Event processing: Only handle completed sessions
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            await fulfillOrder(session);
        } catch (error) {
            console.error('[Webhook Fulfillment Error]:', error);
            // Return 500 to signal Stripe to retry the webhook
            return res.status(500).json({ received: true, message: 'Fulfillment failed, will retry.' }); 
        }
    }

    // Acknowledge receipt to Stripe
    res.json({ received: true });
};