# Gift It

## Overview

Gift It is a web application where users can store gift ideas under certain categories (celebration, occasion, friend). When the occasion arrives or is nearing, Gift It will send an email to the user to remind the user of the gift idea.

## Data Model

Gift It will use MongoDB (NoSQL, document-store) as its database.

Gift It will need to store Users, Friends, Gifts, as well as category headers of gifts: Type, Occasion and Reason.

* Users will store Gifts and Friends. 

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
	account: User
});

// Type
var Type = new mongoose.Schema({
	type: {type: String, required: true}
});

// Occasion
var Occasion = new mongoose.Schema({
	occasion: {type: String, required: true},
	date: Date
});

// Reason
var Reason = new mongoose.Schema({
	reason: {type: String, required: true}
});

// Gift
var Gift = new mongoose.Schema({
	gift_name: String,
	ext_url: String,
	gift_who: [Friend],
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

![site map](img/SiteMap.png)

## Modules

* <b>Passport:<b><br>
	<b>Description:</b> User authentication<br>
	<b>Need:</b> Login users to website

* <b>Mongoose:</b><br>
	<b>Description:</b> Module to connect to MongoDB<br>
	<b>Need:</b> Interact with the MongoDB database

Other Add-ons:

* <b>NodeMailer</b> (https://github.com/andris9/Nodemailer)<br>
	<b>Description:</b> NodeMailer is an email module that allows you to send emails through a Node.js application.<br>
	<b>Need:</b> I will need NodeMailer to send reminder emails to users.
