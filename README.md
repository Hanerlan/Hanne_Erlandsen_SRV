# Hanne_Erlandsen_SRV
A Census application allowing an authenticated Admin user to capture participants' details. 
This application is hosted on the Cyclic.sh platform, uses Cyclic.sh basic authentication, and the participants' data is stored in DynamoDB. 

Authentication is required at all paths starting with /participants. Only the authenticated Admin user can add, retrieve, and manipulate data at these endpoints. 

## Cyclic.sh application URL
https://tiny-lime-greyhound-wear.cyclic.app

## Configuration values
.env file:
```
CYCLIC_DB = tiny-lime-greyhound-wearCyclicDB
```