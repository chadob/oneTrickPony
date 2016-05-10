function createChampionIcons() {
  var champListArray = [];
  for (var cur in champList) {
    champList[cur]["id"] = cur;
    champListArray.push(champList[cur]);
  }
  champListArray.sort(function (a,b) {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });
  champListArray.forEach(function(cur) {
    $('.champion-list-container').append('<div class="champion-picture-container ' + cur.name + '"><a href="/summoners" data-champion-id="' + cur.id + '"><img class="champ-picture" src="' + cur.src + '"></img><span>' + cur.name + '</span></a></div>');
    $('select[name="champion-drop-down"]').append('<option value="' + cur.name + '">' + cur.name + '</option>');
  });
}
function displaySummonerNames (champId) {
  var counter = 0;
  oneTricks[champId].forEach(function(summoner) {
    $('.summoner-wrapper').append('<div class="one-trick"> <a href="/games" class="summoner-link" data-counter="' + counter + '" data-summoner-number="' + summoner.id + '"> <img src="' + champList[champId].src + '"> </img> <span class="summoner-name">' + summoner.name + '</span> </a><span class="region"> Region: ' + summoner.region + '</span> <span class="rank">' + "Rank: " + summoner.rank + '</span> <span class="championPoints"> Champion Points: ' + summoner.championPoints + '</span> </div>');
    counter++;
  });
}

var masteryString = '<div class="masteries"><div class="mastery-box-ferocity"><img class="mastery-1-1-2" src="http://ddragon.leagueoflegends.com/cdn/5.23.1/img/mastery/6111.png"></img><img class="mastery-1-2-2" src="http://ddragon.leagueoflegends.com/cdn/5.23.1/img/mastery/6114.png"></img><img class="mastery-2-1-3" src="http://ddragon.leagueoflegends.com/cdn/5.23.1/img/mastery/6121.png"></img><img class="mastery-2-2-3" src="http://ddragon.leagueoflegends.com/cdn/5.23.1/img/mastery/6122.png"></img></</div></div> '

//make each indiviual mastery page
function createMasteryDiv (leftDiv,middleDiv,rightDiv) {
  var masteryCounter = 0;
  for (var mastery in masteryList) {
    if (masteryCounter < 14) {
      leftDiv.append('<img class="' + masteryList[mastery]["class"] + '" src="' + masteryList[mastery]["src"] + '" data-id="' + masteryList[mastery]["id"] + '"></img>');
    } else if (masteryCounter < 27) {
      middleDiv.append('<img class="' + masteryList[mastery]["class"] + '" src="' + masteryList[mastery]["src"] + '" data-id="' + masteryList[mastery]["id"] + '"></img>');
    } else {
      rightDiv.append('<img class="' + masteryList[mastery]["class"] + '" src="' + masteryList[mastery]["src"] + '" data-id="' + masteryList[mastery]["id"] + '"></img>');
    }
    masteryCounter++;
  }
}
function runeMath (champ, summoner, game, gameCounter) {
  var runeCounter = 0;
  var runeQuantity, runeNumber, runeWord, runeSign, runeString;
  oneTricks[champ][summoner]["matchDetails"][game]["runes"].forEach(function(rune) {
    runeString = runeList[rune.runeId]["stats"];
    runeQuantity = rune.rank;
    runeSymbol = runeString[0];
    runeNumber = Number(runeString.split(" ")[0]);
    runeSign = runeString.split(" ")[0][runeNumber.length - 1];
    runeWord = runeString.substr(runeString.indexOf(' ') + 1);
    for (i=0; i < runeQuantity; i++) {
      $('.game' + gameCounter + ' .runes-container').append('<img class="rune-image ' + rune.runeId + '" src="' + runeList[rune.runeId]["src"] + '"></img>');
    }
    $('.game' + gameCounter + ' .runes-description').append('<span class="rune-blurb'  + ' ' + rune.runeId + '">'  + runeQuantity + "x " + runeString + '</span>');
    runeCounter++;
  });
}
function displaySummonerGames (champ, summoner) {
  $('.games-wrapper').empty();
  var gameCounter = 0;
  for (var game in oneTricks[champ][summoner]["matchDetails"]) {
    $('.games-wrapper').append('<div class="game game' + gameCounter + '"><div class="game-link"><img src="' + champList[champ]["src"] + '"></img><div class=summoner-spells-wrapper></div><div class="name-queue-wrapper"><span class="summoner-name">' + oneTricks[champ][summoner]["name"] + '</span> <span class="map"> Summoners Rift </span> <span class="queue">Ranked (Draft Mode) </span><span class="matchDuration">' + oneTricks[champ][summoner]["matchDetails"][game]["matchDuration"] +'</span></div><div class="result-wrapper"><span class="victory">' + oneTricks[champ][summoner]["matchDetails"][game]["victory"] + '</span><span class="kda">' + oneTricks[champ][summoner]["matchDetails"][game]["kda"] + '</span></div><div class="items"></div></div><div class="details"><div class="masteries"><div class="left-mastery-container mastery-container"></div><div class="middle-mastery-container mastery-container"></div><div class="right-mastery-container mastery-container"></div></div><div class="runes-container"></div><div class="runes-description"></div></div</div>');
    createMasteryDiv($('.game' + gameCounter + ' .left-mastery-container'), $('.game' + gameCounter + ' .middle-mastery-container'), $('.game' + gameCounter + ' .right-mastery-container'));
    oneTricks[champ][summoner]["matchDetails"][game]["sumSpells"].forEach(function(spell) {
      $('.game' + gameCounter + ' .summoner-spells-wrapper').append('<img class="summonerSpell" src="' + summonerSpellList[spell]["src"] + '"></img>');
    });
    oneTricks[champ][summoner]["matchDetails"][game]["items"].forEach(function(item) {
      $('.game' + gameCounter + ' .items').append('<img class="item" src="' + itemList[item]["src"] + '"></img>');
    });

    oneTricks[champ][summoner]["matchDetails"][game]["masteries"].forEach(function(mastery) {
      $('.game' + gameCounter + ' .' + mastery.masteryId).css('opacity', 1);
    });
    runeMath(champ, summoner, game, gameCounter);
    gameCounter++;
  }
}
