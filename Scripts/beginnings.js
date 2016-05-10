function getOneTrickData () {
  $.get('/mongo', function(data) {
    oneTricks = data[0];
  }).done(function() {
    console.log(oneTricks)
  });
}
//Give details of last 10 games played when r
function fillOneTricks (champClickedId, summonerClickedId, summonerCount) {
  var cur = 0;
  for (i=0; i < 10; i++) {
    $.get('/lol/' + oneTricks[champClickedId][summonerCount]["region"] + '.api.pvp.net/api/lol/' + oneTricks[champClickedId][summonerCount]["region"] + '/v2.2/match/' + oneTricks[champClickedId][summonerCount]["matchDetails"][i]["matchId"]["matchId"] + '?includeTimeline=false&api_key=', function(data) {
      oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["champions"] = [];
      data["participants"].forEach(function (summoner) {
        oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["champions"].push(summoner["championId"]);
        if (summoner["championId"] + "" === champClickedId) {
          oneTrick = summoner;
        }
      });
      oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["masteries"] = oneTrick.masteries;
      oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["matchDuration"] = Math.ceil(data.matchDuration / 60) + " minutes";
      if (oneTrick.stats.winner === true) {
        oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["victory"] = "Victory";
      } else {
        oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["victory"] = "Defeat";
      }
      oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["items"] = [oneTrick.stats.item0, oneTrick.stats.item1, oneTrick.stats.item2, oneTrick.stats.item3, oneTrick.stats.item4, oneTrick.stats.item5, oneTrick.stats.item6];
      oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["kda"] = oneTrick["stats"]["kills"] + "/" + oneTrick["stats"]["deaths"] + "/" + oneTrick["stats"]["assists"];
      oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["runes"] = oneTrick.runes;
      oneTricks[champClickedId][summonerCount]["matchDetails"][cur + ""]["sumSpells"] = [oneTrick.spell1Id, oneTrick.spell2Id];
      cur++;
    }).done(function() {
      if (cur === 10) {
        displaySummonerGames(champClickedId, summonerCount);
      }
    });
  }
}
