const Application = require('../models/Application');
const Job = require('../models/Job');

// Route definition: POST api/applications
exports.applyForJob = async (req, res) => {
    try {
        // Access control: Freelancer only
        if (req.user.role !== 'freelancer') {
            return res.status(403).json({ msg: 'Only Freelancers can apply for jobs' });
        }

        const { jobId, coverLetter } = req.body;

        // Job existence check
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Duplication check
        const existingApp = await Application.findOne({ 
            jobId: jobId, 
            freelancerId: req.user.id 
        });
        if (existingApp) {
            return res.status(400).json({ msg: 'You have already applied for this job' });
        }

        // Application creation
        const newApp = new Application({
            jobId,
            freelancerId: req.user.id,
            coverLetter
        });

        await newApp.save();
        res.json(newApp);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: GET api/applications/job/:jobId
exports.getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);
        
        // Authorization check: Must be job owner
        if (job.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized to view these applications' });
        }

        // Fetch applications with freelancer details
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('freelancerId', 'username email phone skills isPro reputation');

        res.json(applications);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: GET api/applications/my-applications
exports.getMyApplications = async (req, res) => {
    try {
        // Fetch applications by freelancer ID, populate job details
        const applications = await Application.find({ freelancerId: req.user.id })
            .populate('jobId', 'title budget status')
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Route definition: PUT api/applications/unlock/:id
exports.unlockContact = async (req, res) => {
    try {
        const app = await Application.findById(req.params.id).populate('jobId');

        // Application existence check
        if (!app) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        // Authorization check: Must be job owner
        if (app.jobId.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        // Update status
        app.status = 'contacting';
        await app.save();

        res.json({ msg: 'Contact unlocked successfully', app });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};