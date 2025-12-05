const User = require('../models/User');
const Job = require('../models/Job');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Service price configuration (USD)
const SERVICE_PRICES = {
    UPGRADE_PRO: 20,    // Lifetime PRO membership
    PREMIUM_JOB: 5      // Single job promotion
};

// Utility: Create Stripe Checkout Session
const createCheckoutSession = async (lineItem, successUrl, cancelUrl, metadata) => {
    return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [lineItem],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: metadata.userId,
        metadata: metadata
    });
};


// Route definition: POST api/payment/upgrade-account
exports.upgradeToPro = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Status check
        if (user.isPro) {
            return res.status(400).json({ msg: 'You are already a PRO member (Lifetime access).' });
        }

        const priceInCents = SERVICE_PRICES.UPGRADE_PRO * 100;

        // Create Stripe session for PRO upgrade
        const session = await createCheckoutSession({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Elite Freelancer PRO Membership',
                    description: 'Lifetime access to PRO features (3 open jobs, promote premium).',
                },
                unit_amount: priceInCents,
            },
            quantity: 1,
        },
            // Success URL
            `${process.env.CLIENT_URL}/profile?payment=success`,
            // Cancel URL
            `${process.env.CLIENT_URL}/upgrade-pro?payment=cancelled`,
            // Metadata
            {
                service: 'PRO_UPGRADE',
                userId: req.user.id
            }
        );

        // Redirect URL response
        res.json({ url: session.url }); 

    } catch (err) {
        console.error("Stripe Upgrade PRO Error:", err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: POST api/payment/upgrade-job/:jobId
exports.payForJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        // Job existence check
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Authorization check: Must own the job
        if (job.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized: You do not own this job' });
        }

        const user = await User.findById(req.user.id);
        
        // Status check: Already Premium
        if (job.isPremium) {
            return res.status(400).json({ msg: 'Job is already Premium' });
        }

        // LOGIC CHANGE: Check if user is PRO
        if (user.isPro) {
            // PRO Member: Upgrade immediately for free
            job.isPremium = true;
            await job.save();
            return res.json({ success: true, msg: 'Job promoted to Premium (Free for PRO Member)' });
        }

        // Regular Member: Create Stripe session for $5
        const priceInCents = SERVICE_PRICES.PREMIUM_JOB * 100;

        const session = await createCheckoutSession({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Premium Job: ${job.title}`,
                    description: 'Promote job to the top of the listings.',
                },
                unit_amount: priceInCents,
            },
            quantity: 1,
        },
            // Success URL
            `${process.env.CLIENT_URL}/my-jobs?payment=success`,
            // Cancel URL
            `${process.env.CLIENT_URL}/my-jobs?payment=cancelled`,
            // Metadata
            {
                service: 'JOB_PREMIUM',
                jobId: job._id.toString(),
                userId: req.user.id
            }
        );

        // Redirect URL response
        res.json({ url: session.url });

    } catch (err) {
        console.error("Stripe Job Premium Error:", err.message);
        res.status(500).send('Server Error');
    }
};