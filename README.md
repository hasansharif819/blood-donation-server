# Blood Donation App
# Server Live Link --> https://blood-donation-app-server-sandy.vercel.app/
## Register Link --> https://blood-donation-app-server-sandy.vercel.app/api/register
## Login Link --> https://blood-donation-app-server-sandy.vercel.app/api/login

# Technology
* In this project, I have use Node/Express.js for server. 
* Typescript as a programming language. 
* PostgreSQL as Database
* Using Supabase for cloud database
* Prisma as a ORM
* JWT(JSON WEB TOKEN) for authorization
* Zod for validation
* Also use moduler pattern
* Vercel for deploy

# Project Overview
## This project is basically for a Blood Donation App where Donor/user, userProfile and Request are three types of model exists.
* There are three  types of collections available which are 1. users, 2. userProfile, 3. requests.
* Three types of user role exists, these are user, admin and super-admin
* For now admin not setup
* User can register and login.
* User can update their profile
* User can update request status which is request for donation.
* Requester can request for donor
* For now, Anyone can get all the donor-list from the following link
* Get All Donor Link --> https://blood-donation-app-server-sandy.vercel.app/api/donor-list

* Anyone can be
* Register Link --> https://blood-donation-app-server-sandy.vercel.app/api/register
  Format for body
  {
    "name": "Test Donor",
    "email": "test@gmail.com",
    "password": "123456",
    "bloodType": "AB_NEGATIVE",
    "location": "Chittagong",
    "age": 30,
    "bio": "A regular blood donor",
    "lastDonationDate": "2023-10-10"
  }

* Login Link --> https://blood-donation-app-server-sandy.vercel.app/api/login
  Format for body
  {
    "email": "test@gmail.com",
    "password": "123456"
  }
* 
* Change Password --> https://blood-donation-app-server-sandy.vercel.app/api/login/auth/change-password
* You can not use your previous two passwords and also the current password when you change your password
* You need to pass access token using header. Without access token you can not change your password
  Format for changing password
  {
    "currentPassword": "currentPassword",
    "newPassword": "newPassword"
  }

## Also use
* Using ESLint
* Using Prettier
* Global error handling
* Local error handling
* And so on


## Install this node/express app on your local machine, Just clone it and hit the command --> npm install
## You need to create .env file on your root folder where your package.json file is exists.
* In the .env file you have to provide
* 1. Port,
  2. Database url,
  3. Bcrypt salt round
  4. JWT access secret
  5. last is JWT access expires in
  6. JWT Refresh Secret
  7. JWT Refresh Expires In
* Then you have to modify your index.ts file which is in app/config

## Lets share your experience from this app. 

# Thank you
