# Hearth Arcade
Web Hearthstone UI that allows hundreds of players to control a single hearthstone game.  
Uses Pusher to deliver board states to clients.  

The biggest challenge was making the voting system scale to hundreds of simultaneous users. My solution was sharded counters on the Google Datastore.
