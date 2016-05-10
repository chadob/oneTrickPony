var requestProxy = require('express-request-proxy'),
  express = require('express'),
  port = process.env.PORT || 3000,
  app = express(),
  mongodb = require('mongodb'),
  MongoClient = mongodb.MongoClient;
  https = require('https');
  RIOT_KEY = process.env.RIOT_KEY;
  request = require('request');
  Promise = require('bluebird');
  q = require('q');
var oneTricks = {"266": [], "103": [], "84": [], "12": [], "32": [], "34": [], "1": [], "22": [], "136": [], "268": [], "432": [], "53": [], "63": [], "201": [], "51": [], "69": [], "31": [], "42": [], "122": [], "131": [], "36": [], "119": [], "245": [], "60": [], "28": [], "81": [], "9": [], "114": [], "105": [], "3": [], "41": [], "86": [], "150": [], "79": [], "104": [], "120": [], "74": [], "420": [], "39": [], "40": [], "59": [], "24": [], "126": [], "202": [], "222": [], "429": [], "43": [], "30": [], "38": [], "55": [], "10": [], "85": [], "121": [], "203": [], "96": [], "7": [], "64": [], "89": [], "127": [], "236": [], "117": [], "99": [], "54": [], "90": [], "57": [], "11": [], "21": [], "82": [], "25": [], "267": [], "75": [], "111": [], "76": [], "56": [], "20": [], "2": [], "61": [], "80": [], "78": [], "133": [], "33": [], "421": [], "58": [], "107": [], "92": [], "68": [], "13": [], "113": [], "35": [], "98": [], "102": [], "27": [], "14": [], "15": [], "72": [], "37": [], "16": [], "50": [], "134": [], "223": [], "91": [], "44": [], "17": [], "412": [], "18": [], "48": [], "23": [], "4": [], "29": [], "77": [], "6": [], "110": [], "67": [], "45": [], "161": [], "254": [], "112": [], "8": [], "106": [], "19": [], "62": [], "101": [], "5": [], "157": [], "83": [], "154": [], "238": [], "115": [], "26": [], "143": []};
var collection, collectionLastUpdated, oneTrickData, ontrickUpdatedData;
var url = 'mongodb://localhost:27017/oneTrickPony';
var regions = [["br", "BR1"], ["eune", "EUN1"], ["euw", "EUW1"], ["jp", "JP1"], ["kr", "KR"], ["lan", "LA1"], ["las", "LA2"], ["na", "NA1"], ["oce", "OC1"], ["ru", "RU"], ["tr", "TR1"]];
var today = new Date();
var playerList = {};
var playerChampion, playerChampionPoints;
var champClickedId, summonerClickedId;
var oneTrick;
var getRequestCounter = 0;
  var k = 0;
  var l = 0;
  var fails=[];
//function declarations for data
function getRegionPlayers (region, league) {
    return new Promise(function (resolve, reject) {
      request('https://' + region[0] + '.api.pvp.net/api/lol/' + region[0] + '/v2.5/league/' + league + '?type=RANKED_SOLO_5x5&api_key=' + RIOT_KEY, function (error, response, data) {
        if (data) {
          data = JSON.parse(data);
          if (data.entries) {
            data.entries.forEach(function(player) {
              playerList[player.playerOrTeamId] = {id: player.playerOrTeamId, name: player.playerOrTeamName, region: region, rank: league};
            });
            resolve();
          } else {
            resolve();
            getRegionPlayers(region, league);
          }
        } else {
          resolve();
          getRegionPlayers(region, league);
        }
      });
    });
}
//get all master tier and challenger tier players into two objects
  function fillPlayerList () {
    var promises = [];
    var promise;
    var leagueNames = ["master", "challenger"];
    for (var i=0; i < regions.length; i++) {
      for (var j=0; j < leagueNames.length; j++) {
        promise = getRegionPlayers(regions[i], leagueNames[j]);
        promises.push(promise);
      }
    }
    return Promise.all(promises).then(function() {
      console.log("done")
      getTopTen();
    });
  }

function getTopTenRequest (player) {
  return new Promise(function(resolve, reject) {
    request('https://' + playerList[player]["region"][0] + '.api.pvp.net/championmastery/location/' + playerList[player]["region"][1] + '/player/' + playerList[player]["id"] + '/topchampions?count=1&api_key=' + RIOT_KEY, function (err, res, data) {
      if (data !== undefined && JSON.parse(data).status === undefined) {
        k++;
        data = JSON.parse(data)
        playerChampion = "" + data[0]["championId"];
        playerChampionPoints = data[0]["championPoints"];
        if (playerChampionPoints > 100000 && (oneTricks[playerChampion].length < 10)) {
          oneTricks[playerChampion].push({name: playerList[player]["name"], id: playerList[player]["id"], rank: playerList[player]["rank"], champion: playerChampion, championPoints: playerChampionPoints, region: playerList[player]["region"][0], matchDetails: {"0": {}, "1": {}, "2": {}, "3": {}, "4": {}, "5": {}, "6": {}, "7": {}, "8": {}, "9": {}}});
          if (oneTricks[playerChampion].length > 1) {
            oneTricks[playerChampion].sort(function(a,b) {
              return b.championPoints - a.championPoints;
            });
          }
          console.log(k);
          resolve();
        } else if (playerChampionPoints > 100000 && oneTricks[playerChampion].length === 10) {
          for (var i=0; i < 10; i++) {
            if (oneTricks[playerChampion][i]["championPoints"] < playerChampionPoints) {
              oneTricks[playerChampion].splice(i, 0, {name: playerList[player]["name"], id: playerList[player]["id"], rank: playerList[player]["rank"], champion: playerChampion, championPoints: playerChampionPoints, region: playerList[player]["region"][0], matchDetails: {"0": {}, "1": {}, "2": {}, "3": {}, "4": {}, "5": {}, "6": {}, "7": {}, "8": {}, "9": {}}});
              oneTricks[playerChampion].splice(9,1);
              break;
            }
          }
          resolve();
        }
        // console.log(oneTricks);
      } else {
        l++
        console.log("l: " + l);
        resolve();
        getTopTenRequest(player);
      }
    });
  });
}
//cycle through all players in each of the tier objects and find their top champion
function getTopTen () {
  var promises = [], promise;
  for (player in playerList) {
    promise = getTopTenRequest(player);
    promises.push(promise);
  }
  setTimeout(function() {
    getLastTen();
  }, 480000);
  return Promise.all(promises).then(function() {
    console.log("donezo");
    getLastTen();
  });
}

//whole function to get games
function getGames (champion, player) {
  request('https://' + oneTricks[champion][player]["region"] + '.api.pvp.net/api/lol/' + oneTricks[champion][player]["region"] + '/v2.2/matchlist/by-summoner/' + oneTricks[champion][player]["id"] + '?championIds=' + champion + '&seasons=SEASON2016&api_key=' + RIOT_KEY, function (err, res, data) {
    if (data !== undefined && JSON.parse(data).status === undefined) {
      data = JSON.parse(data);
      if (data.matches === undefined || data.matches.length < 10) {
        delete oneTricks[champion][player];
      } else {
        data = data["matches"].slice(0,10);
        console.log(data);
        for (var j=0; j < data.length; j++) {
          oneTricks[champion][player]["matchDetails"][j]["matchId"] = data[j];
        }
      }
    } else {
      getGames(champion, player);
    }
  });
}
function finish () {
  console.log("doner");
  collection.remove({});
  collection.insert(oneTricks);
}
//Search for last 10 games of each of the one tricks
function getLastTen () {
  for (champion in oneTricks) {
    if (oneTricks[champion].length > 0) {
      for (var i = 0; i < oneTricks[champion].length; i++) {
        console.log(oneTricks[champion][i]);
        getGames(champion, i);
      }
    }
  }
  setTimeout(finish, 200000);
}

//get the initial data from mongo and find the top ten players of each champion
function getAllData() {
  fillPlayerList();
}


//on server start, get all data and insert it into the oneTrickData Collection
MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    collection = db.collection('oneTrickData');
    collection.remove({});
    var promises = [];
    getAllData();
  }
});

//clear out the database and get new data
function updateDatabase() {
  var promises = [];
  getAllData();
}

// get data from database.
var getMongoData = function(request, response) {
  collection.find().toArray(function(err, result) {
    if (err) {
      console.log(err);
    } else if (result.length) {
      oneTrickData = result;
      response.send(oneTrickData);
    } else {
      console.log("not found");
    }
  });
}

//update the databse every 24 hours
setInterval(function(){
  updateDatabase();
}, 24 * 60 * 60 * 1000);



//proxy code for hiding key

var proxyRiotGames = function(request, response) {
  console.log('Routing RiotGames request for', request.params[0]);
  request.query.api_key = process.env.RIOT_KEY;
  (requestProxy({
    url: 'https://' + request.params[0]
  }))(request, response);
};

//routing
app.get('/mongo', getMongoData);
app.get('/lol/*', proxyRiotGames);
app.use(express.static('./'));

app.get('/', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.html', { root: '.' });
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});
