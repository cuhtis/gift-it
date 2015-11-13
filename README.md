# Gift It

## Overview

Gift It is a web application where users can store gift ideas under certain categories (celebration, occasion, friend). When the occasion arrives or is nearing, Gift It will send an email to the user to remind the user of the gift idea.

## Data Model

Gift It will use MongoDB (NoSQL, document-store) as its database.

Gift It will need to store Users, Gifts, as well as category headers of gifts: Type, Occasion and Reason.

* Users will 

First draft schema:

```javascript
// User
// * our site requires authentication so users have a username and password
var User = new mongoose.Schema({
	// username, password provided by plugin
	display_name: {type: String, required: true},
	email: String,
	friends: [Friend],
	gifts: [Gift],
	wishlist: [Gift]
});

// Friend
var Friend = new mongoose.Schema({
	name: {type: String, required: true},
	birthday: [Date],
	is_user: {type: Boolean, required: true},
	account: User,
	gifts: [Gift]
});

// Type
var Type = new mongoose.Schema({
	type: {type: String, required: true},
	gifts: [Gift]
});

// Occasion
var Occasion = new mongoose.Schema({
	occasion: {type: String, required: true},
	gifts: [Gift]
});

// Reason
var Reason = new mongoose.Schema({
	reason: {type: String, required: true},
	gifts: [Gift]
});

// Gift
var Gift = new mongoose.Schema({
	gift_name: String,
	ext_url: String,
	gift_who: [User],
	gift_what: [Type],
	gift_when: [Occasion],
	gift_why: [Reason]
});
```

## Wireframes


## User Stories

* As a student/worker, I want a gift idea logger to record down gift ideas when they come to mind, as I am often busy and forget about them after minutes.
* As a person who enjoys shopping, I want an open environment where I can not only list down gifts I believe my friends will enjoy, but also a place to record gifts for myself in a wishlist.

## Sitemap

## Modules

* Passport:
	Description: User authentication
	Need: Login users to website

* Mongoose:
	Description: Module to connect to MongoDB
	Need: Interact with the MongoDB database

Other Add-ons:

* NodeMailer:
	URL: https://github.com/andris9/Nodemailer
	Description: NodeMailer is an email module that allows you to send emails through a Node.js application.
	Need: I will need NodeMailer to send reminder emails to users.
