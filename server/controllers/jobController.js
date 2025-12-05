const Job = require('../models/Job');
const User = require('../models/User'); 
const Application = require('../models/Application');

// Route definition: POST api/jobs
exports.createJob = async (req, res) => {
    try {
        // Role check: Client only
        if (req.user.role !== 'client') {
            return res.status(403).json({ msg: 'Permission denied. Only Clients can post jobs.' });
        }

        // Fetch user data
        const user = await User.findById(req.user.id);
        
        // Job posting limit definition
        // Premium accounts (isPro=true) get 3 jobs, Free accounts get 1 job.
        const MAX_JOBS = user.isPro ? 3 : 1; 

        // Count current open jobs
        const currentOpenJobs = await Job.countDocuments({ 
            ownerId: req.user.id, 
            status: 'open' 
        });

        // Limit enforcement
        if (currentOpenJobs >= MAX_JOBS) {
            return res.status(400).json({ 
                msg: `Limit reached! ${user.isPro ? 'Premium' : 'Free'} accounts can only have ${MAX_JOBS} open job(s).` 
            });
        }

        const { title, description, budget, requiredSkills, isPremium } = req.body;

        // LOGIC CHANGE: Only PRO users can set isPremium immediately upon creation for free.
        // Regular users must pay via the payment endpoint later.
        let initialPremiumState = false;
        if (isPremium && user.isPro) {
            initialPremiumState = true;
        }

        const newJob = new Job({
            title,
            description,
            budget,
            requiredSkills,
            isPremium: initialPremiumState,
            ownerId: req.user.id
        });

        const job = await newJob.save();
        res.json(job);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: GET api/jobs
exports.getAllJobs = async (req, res) => {
    try {
        // Query parameters
        const { keyword, skill } = req.query;

        // Base query: Only open jobs
        let query = { status: 'open' };

        // Keyword search (Title OR Description)
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Skill filtering (requiredSkills array)
        if (skill) {
            query.requiredSkills = { $regex: skill, $options: 'i' };
        }

        // Database query and sorting (Premium first, then newest)
        const jobs = await Job.find(query)
            .sort({ isPremium: -1, createdAt: -1 }) 
            .populate('ownerId', 'username email'); 

        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: GET api/jobs/:id
exports.getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('ownerId', 'username');
        // Job not found check
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        // Invalid ObjectId handling
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Route definition: GET api/jobs/my-jobs
exports.getMyJobs = async (req, res) => {
    try {
        // Fetch jobs by owner ID
        const jobs = await Job.find({ ownerId: req.user.id })
            .sort({ createdAt: -1 })
            .select('-ownerId'); 
        
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Route definition: PUT api/jobs/:id/close
exports.closeJobOnly = async (req, res) => {
    try {
        // Find job
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Authorization check: Must be job owner
        if (job.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to close this job' });
        }

        // Status check
        if (job.status === 'closed') {
            return res.status(400).json({ msg: 'Job is already closed' });
        }

        // Update status and save
        job.status = 'closed';
        await job.save();

        res.json({ msg: 'Job closed successfully', job });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


// Route definition: PUT api/jobs/close/:jobId/:freelancerId
exports.closeJob = async (req, res) => {
    try {
        const { jobId, freelancerId } = req.params; 
        
        // Parameter validation
        if (!freelancerId) {
            return res.status(400).json({ msg: 'Freelancer ID is required to mark as hired.' });
        }

        // Find job and owner check
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Authorization check
        if (job.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to close this job' });
        }

        // Status check
        if (job.status === 'closed') {
            return res.status(400).json({ msg: 'This job is already closed' });
        }

        // Find selected freelancer
        const freelancer = await User.findById(freelancerId);
        if (!freelancer || freelancer.role !== 'freelancer') {
            return res.status(400).json({ msg: 'Selected freelancer not found or invalid role' });
        }

        // Update Job status
        job.status = 'closed';
        await job.save();

        // Update Freelancer reputation
        freelancer.reputation = (freelancer.reputation || 0) + 1;
        await freelancer.save();

        // Update Application statuses: Selected freelancer
        await Application.findOneAndUpdate(
            { jobId, freelancerId },
            { status: 'contacting' } 
        );
        
        // Update Application statuses: Others (rejected)
        await Application.updateMany(
            { jobId, freelancerId: { $ne: freelancerId } },
            { status: 'rejected' }
        );

        res.json({ 
            msg: 'Job closed successfully. Freelancer reputation updated.', 
            job, 
            freelancerReputation: freelancer.reputation 
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

