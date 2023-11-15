var express = require('express');
var router = express.Router();
const CyclicDB = require('@cyclic.sh/dynamodb')
const db = CyclicDB(process.env.CYCLIC_DB);
let participants = db.collection('participants')


/* GET */
// list of all participants
router.get('/', async function(req, res) {
  try {
    let list = await participants.list();
    if (!list) {
      res.status(400).json({ status: 'Failed to retrieve the list of participants.' });
    } 
    res.json({ status: 'success', participants: list })
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
});

// personal details of all active participants (including first and last name)
router.get('/details', async (req, res, next) => {
});

// all deleted participants' personal details (including first and last name)
router.get('/details/deleted', async (req, res, next) => {
  
});

// personal details of the specified participant (including first and last name, active) (only not deleted)
router.get('/details/:email', async (req, res, next) => {
  try {
    let email = req.params.email;
    const existingParticipant = await participants.get(email);

    if(!existingParticipant) {
      return res.status(400).json({ error: 'Participant not found.'})
    }
    
    const isActive = existingParticipant.props.active;

    if(isActive === false) { 
      return res.status(400).json({ error: 'Participant has been deleted.' })
    }

    return res.json({ status: 'success', participant: existingParticipant })
  } catch(err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
});

// work details of the specified participant (including company name and salary with currency) (only not deleted)
router.get('/work/:email', async (req, res, next) => {
  try {
    let email = req.params.email;
    const existingParticipant = await participants.get(email);

    if(!existingParticipant || existingParticipant.props.active === false) {
      return res.status(400).json({ error: 'Participant not found.'})
    }

    const workDetails = existingParticipant.props.work;
    res.json({ status: 'success', participant: workDetails }) 

  } catch(err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
});

// home details of the specified participant (including country and city) (only not deleted)
router.get('/home/:email', async (req, res, next) => {
  try {
    let email = req.params.email;
    const existingParticipant = await participants.get(email);
    
    if(!existingParticipant || existingParticipant.props.active === false) {
      return res.status(400).json({ error: 'Participant not found.'})
    }

    const homeDetails = existingParticipant.props.home;
    res.json({ status: 'success', participant: homeDetails }) 

  } catch(err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
});


/* POST */
// add a new participant
router.post('/add', async (req, res, next) => {
  try {
    const { email, firstName, lastName, dob, work, home, active } = req.body;
    const existingParticipant = await participants.get(email);
    if (existingParticipant) {
      return res.status(409).json({ error: 'A participant with this email already exists.' })
    }

    if (!email || !firstName || !lastName || !dob || !work || !home  || active === undefined) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }
    if (!isValidDate(dob)) {
      return res.status(400).json({ error: 'Invalid date of birth. Correct format is YYYY/MM/DD' })
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email address.' })
    }
    if (typeof active !== 'boolean') {
      return res.status(400).json({ error: 'Invalid active status. Must be true or false.' })
    }
    if (typeof work.salary !== 'number' || isNaN(work.salary)) {
      return res.status(400).json({ error: 'Invalid salary value. Salary must be a number.'})
    }
  
    const newParticipant = await participants.set(email, {
      firstName,
      lastName,
      dob,
      work: {
        companyName: work.companyName,
        salary: work.salary,
        currency: work.currency
      },
      home: {
        country: home.country,
        city: home.city,
      },
      active,
    });
  
    res.json({ status: 'success', message: 'Participant added successfully', participant: newParticipant }) 
  } catch(err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
});


/* PUT */
// update the participant of provided email (exact same format as for /participants/add POST)
router.put('/:email', async (req, res, next) => {

});


/* DELETE */
// soft-delete the participant of provided email 
router.delete('/:email', async (req, res, next) => {
  try {
    const email = req.params.email;
    const existingParticipant = await participants.get(email);

    if (!existingParticipant) {
      return res.status(404).json({ error: 'Participant not found.' });
    }

    if (existingParticipant.props.active === false) {
      return res.status(404).json({ error: 'Participant has already been deleted.' });
    }

    const deletedParticipant = await participants.set(email, { active: false });
  
    return res.json({ status: 'Success', message: 'Participant deleted successfully.', participant: deletedParticipant });
  } catch(err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

function isValidDate(dateString) {
  const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
  return dateRegex.test(dateString);
}

function isValidEmail(email) {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}


module.exports = router;



/*
Ensure only logged-in Admin users can access created endpoints.
The Admin user will authenticate themselves via Basic authentication (set on the Cyclic.sh platform).

All API endpoints need to return a JSON object as a response.
Relevant and descriptive errors should be returned as JSON objects.


CRUD for dynamoDB:
collection.list() – Gets all results from the collection; only the keys of each record, without details.
collection.get(key) – Gets the details of the item.
collection.set(key, propertiesObject) – Adds/updates the record of the selected key.


*/