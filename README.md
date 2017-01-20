# Hearth Arcade
Web ui that allows hundreds of players to control a single hearthstone game.
Uses Pusher to deliver board states to users.
I couldn't afford the cost of running this so I never released it to the public.
The biggest challenge was making the voting system scale to hundreds of simultaneous users.
My solution was sharded counters on the Google Datastore. The number of shards would increase depending on the number of players.
