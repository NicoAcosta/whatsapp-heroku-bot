const request = require("request");
let Parser = require("rss-parser"),
  resquests = require("./resquests.js"),
  parser = new Parser();

module.exports.matchs_du_jour_details = (res, id, message) => {
  var charge;

  request(
    {
      uri: "https://api.football-data.org/v2/matches/" + id,
      method: "GET",
      headers: {
        "X-Auth-Token": "184380ba95b646908ca4206dbfd09049"
      }
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        var firstHours = "";
        var laHours = "";
        var statusFr = "";

        var utcDate = Date.parse(body.match.utcDate);
        let dates = dateBuilderInt(utcDate);

        const lastUpdated = Date.parse(body.match.lastUpdated);
        let lastDates = dateBuilderInt(lastUpdated);

        var formattedLastDate =
          lastDates.jr.substr(-2) +
          "/" +
          lastDates.mois.substr(-2) +
          "/" +
          lastDates.annee +
          " à " +
          lastDates.hours.substr(-2) +
          ":" +
          lastDates.minutes.substr(-2) +
          ":" +
          lastDates.seconds.substr(-2);
        var formattedDate =
          dates.hours.substr(-2) + ":" + dates.minutes.substr(-2);

        var compId = body.match.competition.id;
        var compName = body.match.competition.name;
        var homeTeam = body.match.homeTeam.name;
        var awayTeam = body.match.awayTeam.name;

        var matchday = body.match.matchday;
        var status = body.match.status;
        var score = body.match.fullTime;

        var stade =
          "*• STADE* ____________________ 🏟️\n\n      " + body.match.venue;

        var scoresHalf =
          body.match.score.halfTime.homeTeam +
          " - " +
          body.match.score.halfTime.homeTeam;
        var scoresFinal =
          body.match.score.fullTime.homeTeam +
          " - " +
          body.match.score.fullTime.homeTeam;
        var extraTime =
          body.match.score.extraTime.homeTeam +
          " - " +
          body.match.score.extraTime.homeTeam;
        var penalties =
          body.match.score.penalties.homeTeam +
          " - " +
          body.match.score.penalties.homeTeam;

        var nbrMatchsPasse = body.head2head.numberOfMatches;
        var totalButsPasse = body.head2head.totalGoals;

        var statsHomeTeam =
          "   🔹 *" +
          homeTeam +
          "*\n\n         _Victoires :_    *" +
          body.head2head.homeTeam.wins +
          "*\n         _Égalités  :_    *" +
          body.head2head.homeTeam.draws +
          "*\n         _Défaites :_     *" +
          body.head2head.homeTeam.losses +
          "*";

        var statsAwayTeam =
          "   🔸 *" +
          awayTeam +
          "*\n\n         _Victoires :_    *" +
          body.head2head.awayTeam.wins +
          "*\n         _Égalités  :_    *" +
          body.head2head.awayTeam.draws +
          "*\n         _Défaites :_     *" +
          body.head2head.awayTeam.losses +
          "*";

        var lesStats =
          "*• LES MATCHS PASSÉS* ____ 🏆\n         _*" +
          nbrMatchsPasse +
          "* rencontres_\n         _*" +
          totalButsPasse +
          "* buts marqués_\n\n" +
          statsHomeTeam +
          "\n\n" +
          statsAwayTeam;

        var rencontre = "⚽ *" + homeTeam + "* vs *" + awayTeam + "*";

        var eme = matchday + "ème";
        if (matchday == "1") {
          eme = matchday + "ère";
        }
        if (matchday == null) {
          eme = "...";
        }

        switch (status) {
          case "FINISHED":
            status = "Terminé";
            break;

          case "IN_PLAY":
            status = "En cours";
            break;

          case "SCHEDULED":
            status = "À venir [" + formattedDate + "] ⏳";
            break;

          case "POSTPONED":
            status = "Reporté";
            break;
        }

        var lesScores =
          "*• STATUT:*       *_" +
          status +
          "_*\n\n*• JOURNÉE :*   *_" +
          eme +
          "_*\n\n" +
          stade +
          "\n\n*• SCORES* __________________  🥅\n\n";

        if (scoresFinal != "null - null") {
          lesScores =
            lesScores + "      _Final :_          *" + scoresFinal + "*\n";
        } else {
          lesScores =
            lesScores + "      _Final :_                  *à venir...*\n";
        }

        if (scoresHalf != "null - null") {
          lesScores = lesScores + "      _Mi-temps :_  *" + scoresHalf + "*\n";
        } else {
          lesScores = lesScores + "      _Mi-temps :_          *à venir...*\n";
        }

        if (extraTime != "null - null") {
          lesScores = lesScores + "      _Prolong. :_    *" + extraTime + "*\n";
        }

        if (penalties != "null - null") {
          lesScores =
            lesScores + "      _Pénalit. :_      *" + penalties + "*\n";
        }

        if (compName == "Serie A") {
          if (compId == "2019") {
            compName = compName + " - Italie";
          } else {
            compName = compName + " - Brasil";
          }
        }

        var text =
          rencontre +
          "\n      _(" +
          compName +
          ")_\n       _____\n       _Infos mise à jour le_\n       _" +
          formattedLastDate +
          "_\n\n" +
          lesScores +
          "\n\n" +
          lesStats +
          "\n\n\n           ____ ⚽ ____";

        console.log(body);
        res
          .sendText(message.from, text)
          .then(result => {
            const btnMenu = [
              {
                buttonText: {
                  displayText: "MENU"
                }
              }
            ];

            res
              .sendButtons(
                message.from,
                "Retour au MENU",
                btnMenu,
                "Cliquez MENU"
              )
              .then(result => {
                console.log("Result: ", result); //return object success
              })
              .catch(erro => {
                console.error("Error when sending: ", erro); //return object error
              });
          })
          .catch(erro => {
            console.error("Error when sending: ", erro); //return object error
          });
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

module.exports.dateBuilder = dateTemp => {
  var date = new Date(dateTemp);
  var annee = date.getFullYear();
  var mois = date.getMonth() + 1;
  var jr = date.getDate();
  var day = date.getDay();
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  return {
    date: date,
    annee: annee,
    mois: mois,
    jr: jr,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    day: day
  };
};

function dateBuilderInt(dateTemp) {
  var date = new Date(dateTemp);
  var annee = date.getFullYear();
  var mois = "0" + (date.getMonth() + 1);
  var jr = "0" + date.getDate();
  var day = date.getDay();
  var hours = "0" + date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();

  return {
    date: date,
    annee: annee,
    mois: mois,
    jr: jr,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    day: day
  };
}

async function retriveRss(signe, signe_minuscule, res, message) {
  let feed = await parser.parseURL(
    "https://www.asiaflash.com/horoscope/rss_horojour_" +
      signe_minuscule +
      ".xml"
  );
  console.log(feed.title);

  feed.items.forEach(item => {
    console.log(item.title + ":" + item.link + " / " + item.contentSnippet);
  });

  const unixTimeZero = Date.parse(feed.items[0].isoDate);
  var date = new Date(unixTimeZero);
  var annee = date.getFullYear();
  var mois = date.getMonth() + 1;
  var jr = date.getDate();
  var texte = feed.items[0].contentSnippet;
  res
    .sendText(
      message.from,
      "*L'horoscope du " +
        signe +
        "*\n_" +
        jr +
        "/" +
        mois +
        "/" +
        annee +
        "_\n\n_(Le texte à la source connaît quelques problèmes de syntaxe. veillez faire avec en attendant s'il vous plaît.)_\n\n" +
        texte.substring(0, texte.length - 62) +
        "\n___🌞 _Bonne journée_ 🌞___"
    )
    .then(result => {
      const btnMenu = [
        {
          buttonText: {
            displayText: "MENU"
          }
        }
      ];

      res
        .sendButtons(message.from, "Retour au MENU", btnMenu, "Cliquez MENU")
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });
    })
    .catch(erro => {
      console.error("Error when sending: ", erro); //return object error
    });
}

async function retriveRssInfos(url, res, message) {
  console.log(
    "retriveRssInfos" + "______________________________________________"
  );
  let feed = await parser.parseURL(url);

  var items = feed.items;

  var tiret = "";
  var nbrCaractereTitre;
  var titre;

  if (url == "https://www.france24.com/fr/rss") {
    titre = "France 24";
  } else if (url == "https://www.jeuneafrique.com/feed/") {
    titre = "Jeune Afrique";
  } else {
    titre = feed.title;
  }

  nbrCaractereTitre = titre.length;
  var nbrTitret = Math.trunc((25 - nbrCaractereTitre) / 2);
  console.log(nbrTitret);

  for (let i = 0; i < nbrTitret; i++) {
    tiret = tiret + "_";
  }

  var listeTitres =
    tiret +
    " *" +
    titre.trim() +
    "* " +
    tiret +
    "\n_Choisissez le numéro d'un article pour lire son contrnu._\n\n";

  console.log(feed.items[2]);

  for (let i = 0; i < items.length; i++) {
    var isoDate = Date.parse(items[i].isoDate);
    var date = await dateBuilderInt(isoDate);

    var formattedDate =
      date.jr +
      "/" +
      date.mois +
      "/" +
      date.annee +
      " à " +
      date.hours +
      "h " +
      date.minutes.substr(-2) +
      " min";

    var auteur;
    if (titre == "France 24") {
      auteur = "France 24";
    } else {
      auteur = items[i]["creator"];
    }
    listeTitres =
      listeTitres +
      "\n*" +
      (i + 1) +
      " _______________*\n      | _" +
      formattedDate +
      "_\n      | _" +
      auteur +
      "_\n      | *" +
      items[i].title.trim() +
      "*\n";
  }

  const btnMenu = [
    {
      buttonText: {
        displayText: "MENU"
      }
    }
  ];

  let charge = {
    fulfillmentMessages: [
      {
        text: {
          text: [listeTitres]
        }
      },
      {
        text: {
          text: ["0️⃣ *MENU* ⤴️"]
        }
      }
    ]
  };
  res
    .sendText(message.from, listeTitres)
    .then(result => {})
    .catch(erro => {
      console.error("Error when sending: ", erro); //return object error
    });
}

async function retriveRssInfosDetails(url, numArticle, res) {
  console.log("retriveRssInfosDetails");
  let feed = await parser.parseURL(url);

  var items = feed.items;
  let charge;

  var isoDate = Date.parse(items[numArticle].isoDate);
  var date = await dateBuilderInt(isoDate);

  var titre;

  if (url == "https://www.france24.com/fr/rss") {
    titre = "France 24";
  } else if (url == "https://www.jeuneafrique.com/feed/") {
    titre = "Jeune Afrique";
  } else {
    titre = feed.title;
  }

  var formattedDate =
    date.jr +
    "/" +
    date.mois +
    "/" +
    date.annee +
    " à " +
    (date.hours + 1) +
    "h " +
    date.minutes.substr(-2) +
    " min";

  var auteur = items[numArticle].creator;

  if (
    url == "https://beninwebtv.com/feed/" ||
    url == "http://leprogresinfo.net/feed/" ||
    url == "https://www.jeuneafrique.com/feed/" ||
    url == "https://www.france24.com/fr/rss"
  ) {
    charge = {
      fulfillmentMessages: [
        {
          text: {
            text: [
              "*" +
                items[numArticle].title.trim() +
                "*\n_(" +
                titre.trim() +
                ")_\n\n     | _Publié le: " +
                formattedDate +
                "_\n     | _Auteur: " +
                auteur +
                "_\n\n     " +
                items[numArticle].contentSnippet.split("[…]")[0] +
                "... _Lire la suite à la source_.\n\n     _Source : " +
                titre +
                "_"
            ]
          }
        },
        {
          text: {
            text: ["0️⃣ *MENU* ⤴️"]
          }
        }
      ]
    };
  } else {
    charge = {
      fulfillmentMessages: [
        {
          text: {
            text: [
              "*" +
                items[numArticle].title.trim() +
                "*\n_(" +
                titre.trim() +
                ")_\n\n     | _Publié le: " +
                formattedDate +
                "_\n     | _Auteur: " +
                auteur +
                "_\n\n     " +
                items[numArticle]["content:encodedSnippet"] +
                "\n\n     _Source : " +
                titre +
                "_"
            ]
          }
        },
        {
          text: {
            text: ["0️⃣ *MENU* ⤴️"]
          }
        }
      ]
    };
  }

  res.status(200).send(charge);
}

module.exports.retriveRss = retriveRss;
module.exports.retriveRssInfos = retriveRssInfos;
module.exports.retriveRssInfosDetails = retriveRssInfosDetails;
