# (Name of Project)

## Overview

(Name of Project) is a web-based music-sharing application. Users can invite others to join a lobby, where they all have shared access to a music player controller.

## Data Model

(Name of Project) will use MongoDB (NoSQL, document-store) as its database.

(Name of Project) will need to store Users, Songs, and Lobby Sessions

* Lobby Sessions will have multiple users
* Lobby Sessions will have multiple songs

First draft schema:

```javascript
// User
// * our site requires authentication so users have a username and password
var User = new mongoose.Schema({
  // username, password provided by plugin
});

// Song
// * A song
var Song = new mongoose.Schema({
	name: String,
	artist: String,
	plays: Number,
	url: String
});

// Lobby Sessions
// * A session of users sharing songs
// * a list can have 0 or more items
var List = new mongoose.Schema({
  userList: [User],
	songList: [Song],
	name: String
});
```

## Wireframes


