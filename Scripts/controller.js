var champClickedId, summonerClickedId, champChosen;
var oneTrick, oneTricks;
var getRequestCounter = 0;

//grab data from mongo
getOneTrickData();
//add champ icons
createChampionIcons();
$('.champion-selection-page').on('change', 'select', function(e) {
  console.log('chosen');
  for (var champ in champList) {
    if (champList[champ]["name"] === e.target.value) {
      champChosen = champ;
      break;
    }
  }
  $('.summoner-wrapper').empty();
  displaySummonerNames(champChosen);
  $('.page').hide();
  $('.summoner-selection-page').show();
});
//display the top 10 players of the champion clicked on
$('.champion-picture-container a').on('click', function(e) {
  champClickedId = "" + $(this).attr('data-champion-id');
console.log(champClickedId);
  $('.summoner-wrapper').empty();
  displaySummonerNames(champClickedId);
});
//display the last 10 games by player
$('.summoner-selection-page').on('click', 'a', function(e) {
  summonerClickedId = "" + $(this).attr('data-summoner-number');
  summonerCount = "" + $(this).attr('data-counter');
  fillOneTricks(champClickedId, summonerClickedId, summonerCount);
});


//display runes/masteries underneath game
$('.game').on('click', '.game-link', function(e) {
  console.log("toggle")
  $(this).next().toggle();
  // var curGame = $(this).parent().attr('class').slice(3, $(this).parent().attr('class').length() - 1);
  // $('.game' + curGame + ' .details').toggle();
});
