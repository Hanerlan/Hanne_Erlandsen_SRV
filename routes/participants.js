var express = require('express');
var router = express.Router();
const CyclicDB = require('@cyclic.sh/dynamodb')
const db = CyclicDB(process.env.CYCLIC_DB);
let participants = db.collection('participants')


/* GET */
// list of all participants
router.get('/', async function(req, res, next) {
  let list = await participants.list();
});

// personal details of all active participants (including first and last name)
router.get('/details', async (req, res, next) => {
return 	
});

// all deleted participants' personal details (including first and last name)
router.get('/details/deleted', async (req, res, next) => {
return 	
});

// personal details of the specified participant (including first and last name, active) (only not deleted)
router.get('/details/:email', async (req, res, next) => {
  let item = await participants.get(req.params.key);
});

// work details of the specified participant (including company name and salary with currency) (only not deleted)
router.get('/work/:email', async (req, res, next) => {
return 	
});

// home details of the specified participant (including country and city) (only not deleted)
router.get('/home/:email', async (req, res, next) => {
return 	
});


/* POST */
// add a new participant
router.post('/add', async (req, res, next) => {
return 	
});


/* PUT */
// update the participant of provided email (exact same format as for /participants/add POST)
router.put('/:email', async (req, res, next) => {
return 	
});


/* DELETE */
// 'delete' (soft delete) the participant of provided email 
router.delete('/:email', async (req, res, next) => {
return 	
});

/*
To delete: no permanent deletes, but flag the participants as deleted (soft-delete).
Meaning, the database record is not entirely deleted but flagged as no longer usable.
  -> could be a Boolean field/column named “active” with a value of 0 or 1 to indicate if the participant has been ‘deleted.’ 
*/


module.exports = router;



/*
Ensure only logged-in Admin users can access created endpoints.
The Admin user will authenticate themselves via Basic authentication (set on the Cyclic.sh platform).

All API endpoints need to return a JSON object as a response.
Relevant and descriptive errors should be returned as JSON objects.


Item participant: email (unique identifier), firstname, lastname, dob, active 
fragment work: companyname, salary, currency
fragment home: country, city 

Validate that all properties have been provided in the requests body and if they are correctly formatted.
  -> The DOB is a Date formatted (YYYY/MM/DD) and that the email address has the correct format


CRUD for dynamoDB:
collection.list() – Gets all results from the collection; only the keys of each record, without details.
collection.get(key) – Gets the details of the item.
collection.set(key, propertiesObject) – Adds/updates the record of the selected key.
collection.delete(key) – Deletes the record of the selected key.

*/