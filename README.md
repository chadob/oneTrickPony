# oneTrickPony
Find one trick ponies in master/challenger

Goals:
1. Show off challenger/master tier level one trick pony's builds for players learning champions
-Instead of getting average data from lolking or unreliable builds from probuilds, I bring you data from high level players who have 
  mastered the champion
2. Spotlight those players who have put in the time and effort to master a champion
3. Provide a leaderboard for those players to come back to.

Methodology:
1. Utilize the league endpoint to get a list of all master and challenger players in every region. 
2. Call data from the championmastery endpoint in order to find their top champion and see if they have over 100,000 mastery with it. 
3. A user can then click on their name to check on the last 10 games played using the matchhistory endpoint, 
4. The website will provide the stats from the game using the match endpoint. 
5. I will be making calls to the api once a day to minimize calls needed. 

Tech:
1. Node server: to run it
2. Bluebird module: I used promises a little bit on the server side in order to not make api calls till other ones had completed. 
  Unfortunately, sometimes calls just never responded and so I used a set timeout of like 10 minutes to make sure that no further ones
  would come back
3. Response module: I made my https calls on the server side through the response module because of its ease of access
4. I used express
5. Express-proxy: i used this a little bit to help hide my api key
6. Mongodb: I used this solely for persistant data storage-didn't really mess around with data once it was put in.

Troubles:
1. Learning server side tech: I really did not have a lot of experience with this (never made a server side get request or use a database)
2. Learning about promises. I couldn't use .done in node and so i had to look into promises(unfortunately never got a full grasp on 
  waiting for an array of these before next function call)
3. Sheer abundance of calls took forever to test things, once I became reliant on hearing back from get requests.
4. Wanting to do more: UGGG I didn't have the time to do stuff with the front end like I would ahve liked
5. Failed Api calls. I frequently would just never hear a response from the riot api server(10% of the time)
6. Couldn't get data from diamond one tricks since there is no real good way to get a list of diamond players. Work arounds would take forever.
7. Constantly updating data. My item data is already out of date because of the mage rework

Future Goals:
1. Link to OTP twitch livestreams: maybe a sliding banner spotlighting a player
2. I really wanted to do a sweet animation with choosing a champion, but ran out of time to do it.
  -Basically when you pick on it's icon, the image expands to the whole splash art of the champion and then the splash goes to the 
   background and the list of OTP's comes up
3. Overall clean up of my very basic layout   
4. Figure out promises for server code

Feel free to visit it at onetrickpony.herokuapp.com
