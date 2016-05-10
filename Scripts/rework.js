playerList = {}
function fillPlayerList {
  var leagueNames = ["master", "challenger"];
regions.forEach(function(region) {
  leagueNames.forEach(function(league) {
  masterTier[region] = {};
  promise = https.get('https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.5/league/master?type=RANKED_SOLO_5x5&api_key=' + RIOT_KEY, (data) {
    data.entries.forEach(function(player) {
      masterTier[region][player.playerOrTeamId] = {id: player.playerOrTeamId, name: player.playerOrTeamName,  rank: "Challenger"};
    });
  });
  })
});
}
