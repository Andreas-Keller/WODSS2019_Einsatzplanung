# node/express backend mit firebase db
## Pre-Requisites 
### Creating a Firebase Project
Creating an Firebase application by a click on https://console.firebase.google.com/

### Obtaining service account key
After you click the Generate New Private Key button, a JSON file containing your service account’s credentials will be downloaded. You’ll need this to initialize the SDK in the next step.
To read more: https://firebase.google.com/docs/admin/setup

### Adding the service account key to the project
Put the service key ```.json``` into WODSS2019_Einsatzplanung/Backend/firebase folder.

### Create an Admin user in Firebase
```
1. Add a collection employees
2. Add a new Employee
3. Give this Employee the ADMINISTRATOR Role
```
## Setup
### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start dev
```

