const request = require("request"),
  bdd = require("./bdd.js"),
  functions = require("./functions.js");
let Parser = require("rss-parser"),
  parser = new Parser(),
  referralCodeGenerator = require("referral-code-generator");

var matchs;

module.exports.creatNewUser = (clt, num, from) => {
  console.log("dans creatNewUser");
  const btnMenu = [
    {
      buttonText: {
        displayText: "JEUMAX"
      }
    },
    {
      buttonText: {
        displayText: "MENU"
      }
    }
  ];
  (async () => {
    let nmbrRef = await bdd.retrive(num);

    //si le user n'existe pas
    if (!nmbrRef) {
      console.log("dans edemin yan ayan");
      let refCode = await referralCodeGenerator.alphaNumeric("uppercase", 1, 6);
      request(
        {
          uri:
            "https://maker.ifttt.com/trigger/contacts/with/key/PFFwI02UIg-ve0F7jJglc",
          qs: {
            value1: num,
            value2: num
          },
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        },
        (err, resp, body) => {
          if (!err) {
          } else {
            console.error("Unable to send message:" + err);
          }
        }
      );

      let user = await bdd.creatUser(num, refCode);
      await clt
        .sendImageAsSticker(
          from,
          "https://res.cloudinary.com/dfrtvaehx/image/upload/v1635450026/Maxofy/Stickers/20211028_203810.png"
        )
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });
      await clt
        .sendText(
          from,
          "🤝 *Je vous souhaite les bienvenus dans mon humble demeure.*\n\n      Salut, je m'appelle *Maxofy* , je suis un robot.\n\n      Chez moi ici, on télécharge des dollars depuis Internet. 😂 En plus il y a de l'actualité politique, sportive et économique.\n\n      Vous aimez les cryptomonnaies ? On en parle ici. ☺️"
        )
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });
      await clt
  .sendImageAsStickerGif(from, 'https://res.cloudinary.com/dfrtvaehx/image/upload/c_scale,w_400/v1635460541/Maxofy/Stickers/sticker_gif_love_001_bg-1_1635460491435.gif')
  .then((result) => {
    console.log('Result: ', result); //return object success
  })
  .catch((erro) => {
    console.error('Error when sending: ', erro); //return object error
  });
      await clt
        .sendButtons(
          from,
          "Tout de suite, vous pouvez participer à un jeu et tentez de gagner une somme de 500.000F, Veuillez cliquer sur *JEUMAX* pour suivre les instructions maintenant!",
          btnMenu,
          "Ne manquez cette belle occasion!"
        )
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });
    } else {
    }
  })();
};

module.exports.zero = res => {
  (async () => {
    let nmbrRef = await bdd.rezo();
    let charge = {
      fulfillmentMessages: [
        {
          text: {
            text: ["Zero effectué avec succès !"]
          }
        },
        {
          text: {
            text: ["0️⃣ *MENU* ⤴️"]
          }
        }
      ]
    };
    res.status(200).send(charge);
  })();
};

module.exports.update = (res, num, refCode) => {
  (async () => {
    await bdd.updateReferral(refCode);
    let user = await bdd.retrive(num);
    let charge = {
      fulfillmentMessages: [
        {
          text: {
            text: [
              "Obtenez des *forfaits illimités* , des *formations en trading* et des *cryptomonnaies* gratuitement en devenant *Membre PRO* . Il suffit d'inviter 20 de vos amis à m'écrire pour débloquer."
            ]
          }
        },
        {
          text: {
            text: [
              "Tapez \n7 pour voir votre *CODE* \n*0* pour découvrir mon *MENU*"
            ]
          }
        }
      ]
    };
    res.status(200).send(charge);
  })();
};

module.exports.view_ref = (res, num) => {
  (async () => {
    let nmbrRef = await bdd.retrive(num);

    //si le user n'existe pas
    if (!nmbrRef) {
      let refCode = await referralCodeGenerator.alphaNumeric("uppercase", 1, 6);
      request(
        {
          uri:
            "https://maker.ifttt.com/trigger/contacts/with/key/PFFwI02UIg-ve0F7jJglc",
          qs: {
            value1: num,
            value2: num
          },
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        },
        (err, resp, body) => {
          if (!err) {
          } else {
            console.error("Unable to send message:" + err);
          }
        }
      );

      let user = await bdd.creatUser(num, refCode);
      nmbrRef = await bdd.retrive(num);
    }

    //on travail avec le user qui existe ici deja
    let charge;
    if (nmbrRef.nbrRef >= 20) {
      charge = {
        fulfillmentMessages: [
          {
            text: {
              text: [
                "Vous avez invité *" +
                  nmbrRef.nbrRef +
                  " personnes*. Vous êtes désormais *Membre PRO* 🎉🎉🎉🎉🎉"
              ]
            }
          },
          {
            text: {
              text: [
                "🎁 Veillez intégrer le groupe des membres pro sur Telegram\n\n https://t.me/joinchat/Mt867DNWEVE2Mzc0."
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
                "Votre code d'invitation est le " +
                  nmbrRef.refCode +
                  "\n\nVous avez invité " +
                  nmbrRef.nbrRef +
                  " personnes.\n\nInvitez encore " +
                  (20 - nmbrRef.nbrRef) +
                  " personnes pour devenir *Membre PRO* et gagner de superbes lots.\n\nVoici un texte que vous pouvez utilisez pour inviter vos amis."
              ]
            }
          },
          {
            text: {
              text: [
                "🎁 *Envie de gagner un forfait illimité, des formations gratuites et des cryptomonnaies? écrivez à ce bot sur ce numéro.* 💰  wa.me/22952750532.\n\nVoici mon code d'invitation: " +
                  nmbrRef.refCode +
                  "\nVeillez l'entrer quand le bot vous le demandera."
              ]
            }
          },
          {
            text: {
              text: ["Tapez *8* pour plus d'informations.\n\n 0️⃣ *MENU* ⤴️"]
            }
          }
        ]
      };
    }

    res.status(200).send(charge);
  })();
};

module.exports.view_refCode = (res, num) => {
  console.log("view_refCode");
  (async () => {
    let user = await bdd.retrive(num);
    console.log("view_refCode async");
    let charge = {
      fulfillmentMessages: [
        {
          text: {
            text: [
              "Obtenez des *forfaits illimités* , des *formations en trading* et des *cryptomonnaies* gratuitement en devenant *Membre PRO* . Il suffit d'inviter 20 de vos amis à m'écrire pour débloquer."
            ]
          }
        },
        {
          text: {
            text: [
              "Tapez \n7 pour voir votre *CODE* \n*0* pour découvrir mon *MENU*"
            ]
          }
        }
      ]
    };
    res.status(200).send(charge);
  })();
};

module.exports.format_liste_titres_journaux = (res, numJournal, message) => {
  let url = "";
  console.log("format_liste_titres_journaux");
  switch (numJournal) {
    case "311":
      url = "http://levenementprecis.com/feed/";
      //https://www.24haubenin.info/spip.php?page=backend
      break;

    case "312":
      url = "https://lanationbenin.info/feed/";
      break;

    case "313":
      url = "http://levenementprecis.com/feed/";
      break;

    case "314":
      url = "https://croixdubenin.com/feed/";
      break;

    case "315":
      url = "https://www.notreepoque.bj/feed/";
      break;

    case "316":
      url = "http://leprogresinfo.net/feed/";
      break;

    case "317":
      url = "https://beninwebtv.com/feed/";
      break;

    case "318":
      url = "https://lanouvelletribune.info/feed/";
      break;

    case "321":
      url = "https://www.jeuneafrique.com/feed/";
      break;

    case "322":
      url = "https://www.france24.com/fr/rss";
      break;
  }

  functions.retriveRssInfos(url, res, message);
};

module.exports.lecture_articles = (res, numArticle, journal) => {
  let url = "";
  console.log("lecture_articles");
  switch (journal) {
    case "24h_au_benin":
      url = "https://www.24haubenin.info/spip.php?page=backend";
      break;

    case "la_nation":
      url = "https://lanationbenin.info/feed/";
      break;

    case "benin_web_tv":
      url = "https://beninwebtv.com/feed/";
      break;

    case "croix_du_benin":
      url = "https://croixdubenin.com/feed/";
      break;

    case "la_nouvelle_tribune":
      url = "https://lanouvelletribune.info/feed/";
      break;

    case "le_progres":
      url = "http://leprogresinfo.net/feed/";
      break;

    case "evenement_precis":
      url = "http://levenementprecis.com/feed/";
      break;

    case "notre_epoque":
      url = "https://www.notreepoque.bj/feed/";
      break;

    case "jeune_afrique":
      url = "https://www.jeuneafrique.com/feed/";
      break;

    case "francev":
      url = "https://www.france24.com/fr/rss";
      break;

    default:
      break;
  }

  functions.retriveRssInfosDetails(url, numArticle, res);
};

module.exports.prix_cryptos = (res, message) => {
  var charge;

  request(
    {
      uri: "https://min-api.cryptocompare.com/data/pricemulti",
      qs: {
        fsyms: "BTC,ETH,XRP,LTC,BCH,BNB,EOS,DOGE,BSV,XLM,ADA,TRX,XRM,BTT,BAT",
        tsyms: "USD"
      },
      method: "GET"
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        let text =
          "Prix des principales cryptomonnaies actuellement.\n\nBitcoin(BTC) \n    " +
          body.BTC.USD +
          " USD \n\nEthereum(ETH) \n    " +
          body.ETH.USD +
          " USD \n\nRipple(XRP) \n    " +
          body.XRP.USD +
          " USD \n\nLitecoin(LTC) \n    " +
          body.LTC.USD +
          " USD \n\nBitcoin Cash(BCH) \n    " +
          body.BCH.USD +
          " USD \n\nBinance Coin(BNB) \n    " +
          body.BNB.USD +
          " USD \n\nDogecoin(DOGE) \n    " +
          body.DOGE.USD +
          " USD \n\nEOS(EOS) \n    " +
          body.EOS.USD +
          " USD \n\nBitcoin SV(BSV) \n    " +
          body.BSV.USD +
          " USD\n\nStellar(XLM) \n    " +
          body.XLM.USD +
          " USD \n\nTron(TRX) \n    " +
          body.TRX.USD +
          " USD \n\nBitTorrent(BTT) \n    " +
          body.BTT.USD +
          " USD";
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

module.exports.prix_btc = res => {
  var charge;

  request(
    {
      uri: "https://min-api.cryptocompare.com/data/pricemulti",
      qs: {
        fsyms: "BTC",
        tsyms: "USD"
      },
      method: "GET"
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        charge = {
          fulfillmentMessages: [
            {
              text: {
                text: [
                  "Le bitcoin coûte actuellement: \n\n     *" +
                    body.BTC.USD +
                    " USD*"
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
        console.log(body);
        res.status(200).send(charge);
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

module.exports.calcul_love = (res, message, nom1, nom2) => {
  var charge;

  request(
    {
      uri: "https://love-calculator.p.rapidapi.com/getPercentage",
      qs: {
        fname: nom1,
        sname: nom2
      },
      method: "GET",
      headers: {
        "x-rapidapi-key": "a9TX7v3RZ5mshDZ5VOCyKOMkrdMUp18VxWfjsng8I7wHl3kL1x",
        "x-rapidapi-host": "love-calculator.p.rapidapi.com",
        useQueryString: true
      }
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        let commentairelove;

        if (body.percentage < 20) {
          commentairelove = "Mais le coeur à ses raisons...";
        } else if (body.percentage >= 20 && body.percentage < 50) {
          commentairelove = "S'il existe déjà, il peut grandir! ❤️";
        } else if (body.percentage >= 50 && body.percentage < 70) {
          commentairelove = "Il est beau l'amour! ❤️";
        } else if (body.percentage >= 70 && body.percentage < 90) {
          commentairelove = "❤️ Main dans la main pour la vie! ❤️";
        } else if (body.percentage >= 90 && body.percentage < 95) {
          commentairelove = "❤️❤️ Presque parfait! ❤️❤️";
        } else if (body.percentage >= 95) {
          commentairelove = "❤️❤️❤️ L'un pour l'autre! ❤️❤️❤️";
        }

        const buttons = [
          {
            buttonText: {
              displayText: "Calculer à nouveau"
            }
          },
          {
            buttonText: {
              displayText: "MENU"
            }
          }
        ];
        console.log(body);
        res
          .sendButtons(
            message.from,
            "La compatibilité amoureuse est de *" +
              body.percentage +
              "%* entre *" +
              nom1 +
              "* et *" +
              nom2 +
              ".*",
            buttons,
            commentairelove
          )
          .then(result => {
            console.log("Result: ", result); //return object success
          })
          .catch(erro => {
            console.error("Error when sending: ", erro); //return object error
          });
      } else {
        console.error("Unable to send message:" + err);
        res
          .sendText(
            message.from,
            "Malheureusement je n'ai pas pu procédé au calcul 😓 \n\nPourriez-vous envoyer la requête comme suit ?: \n\n*Prenom_Graçon et Prenom_Fille.*"
          )
          .then(result => {})
          .catch(erro => {
            console.error("Error when sending: ", erro); //return object error
          });
      }
    }
  );
};

module.exports.covid_pays = (res, code) => {
  var charge;

  request(
    {
      url: "https://covid-19-data.p.rapidapi.com/country/code",
      qs: { code: code },
      headers: {
        "x-rapidapi-key": "a9TX7v3RZ5mshDZ5VOCyKOMkrdMUp18VxWfjsng8I7wHl3kL1x",
        "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
        useQueryString: true
      }
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        charge = {
          fulfillmentMessages: [
            {
              text: {
                text: [
                  "_______ *COVID 19* _______\n\nDerniers chiffres *" +
                    body[0].country +
                    "*\n\n     *" +
                    body[0].confirmed +
                    "* cas confirmés\n     *" +
                    body[0].deaths +
                    "* décès"
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
        console.log(body);
        res.status(200).send(charge);
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

module.exports.covid_global = res => {
  var charge;

  request(
    {
      url: "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total",
      headers: {
        "x-rapidapi-key": "a9TX7v3RZ5mshDZ5VOCyKOMkrdMUp18VxWfjsng8I7wHl3kL1x",
        "x-rapidapi-host": "covid-19-coronavirus-statistics.p.rapidapi.com",
        useQueryString: true
      }
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        const unixTimeZero = Date.parse(body.data.lastChecked);
        var date = new Date(unixTimeZero);
        let dates = functions.dateBuilder(date);

        var day;
        switch (dates.day) {
          case 0:
            day = "Dimanche";
            break;
          case 1:
            day = "Lundi";
            break;
          case 2:
            day = "Mardi";
            break;
          case 3:
            day = "Mercredi";
            break;
          case 4:
            day = "Jeudi";
            break;
          case 5:
            day = "Vendredi";
            break;
          case 6:
            day = "Samedi";
            break;
          default:
            day = "";
        }
        var formattedDate =
          day +
          " " +
          dates.jr +
          "/" +
          dates.mois +
          "/" +
          dates.annee +
          " à " +
          dates.hours +
          ":" +
          dates.minutes.substr(-2) +
          ":" +
          dates.seconds.substr(-2);
        charge = {
          fulfillmentMessages: [
            {
              text: {
                text: [
                  "_______ *COVID 19* _______\n\n_*Statistiques mondiale*_ 🌍 \n\n_Données communiquées par les autorités au plus tard le " +
                    formattedDate +
                    "_\n\n   🤒 *" +
                    body.data.confirmed +
                    "* cas confirmés\n   ⚰️ *" +
                    body.data.deaths +
                    "* décès\n\n____"
                ]
              }
            },
            {
              text: {
                text: [
                  "Besoin des statistiques d'un pays en particulier? " +
                    "\nVeuillez entrer le code du pays.\n\nExemples:\n   *bj* _pour_ le *Bénin* 🇧🇯 \n   *tg* _pour_ le *Togo* 🇹🇬 " +
                    "\n   *fr* _pour_ la *France* 🇫🇷 \n   *us* _pour_ les *USA* 🇺🇲 \n   *cn* _pour_ la *Chine* 🇨🇳 "
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
        console.log(body);
        res.status(200).send(charge);
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

module.exports.contacts = (res, num, refCode) => {
  var charge;

  (async () => {
    let user = await bdd.retrive(num);

    if (user) {
      console.log("Existe");
      let charge = {
        replies: [
          {
            message:
              "Ah je l'oubliais ! voici le numéro de mon créateur.\n\n wa.me/22964532018 \n*Jean-Paul LOVISSOUKPO* \n\n_Veillez l'enregistrer s'il vous plaît, cest *important* pour continuer. Merci._ \n\n_Si vous finissez d'enregistrer, veuillez me renvoyer votre dernier message svp_ 🙏"
          }
        ]
      };
      res.status(200).send(charge);
    } else {
      console.log("N'existe pas");

      request(
        {
          uri:
            "https://maker.ifttt.com/trigger/contacts/with/key/PFFwI02UIg-ve0F7jJglc",
          qs: {
            value1: num,
            value2: num
          },
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        },
        (err, resp, body) => {
          if (!err) {
          } else {
            console.error("Unable to send message:" + err);
          }
        }
      );

      (async () => {
        let user = await bdd.creatUser(num, refCode);
        let charge = {
          replies: [
            {
              message:
                "🤝 *Je vous souhaite les bienvenus dans mon humble demeure.*\n\n      Salut, je m'appelle *Maxofy* , je suis un robot.\n\n      Chez moi ici, on télécharge des dollars depuis Internet. 😂 En plus il y a de l'actualité politique, sportive et économique.\n\n      Vous aimez les cryptomonnaies ? On en parle ici. ☺️\n\n_Envoyez *9* pour continuer._"
            }
          ]
        };
        res.status(200).send(charge);
      })();
    }
  })();
};

module.exports.horoscope = (res, signe, message) => {
  switch (signe) {
    case "Bélier":
      functions.retriveRss(signe, "belier", res, message);
      break;
    case "Taureau":
      functions.retriveRss(signe, "taureau", res, message);
      break;
    case "Gémeaux":
      functions.retriveRss(signe, "gemeaux", res, message);
      break;
    case "Cancer":
      functions.retriveRss(signe, "cancer", res, message);
      break;
    case "Lion":
      functions.retriveRss(signe, "lion", res, message);
      break;
    case "Vierge":
      functions.retriveRss(signe, "vierge", res, message);
      break;
    case "Balance":
      functions.retriveRss(signe, "balance", res, message);
      break;
    case "Scorpion":
      functions.retriveRss(signe, "scorpion", res, message);
      break;
    case "Sagittaire":
      functions.retriveRss(signe, "sagittaire", res, message);
      break;
    case "Capricorne":
      functions.retriveRss(signe, "capricorne", res, message);
      break;
    case "Verseau":
      functions.retriveRss(signe, "verseau", res, message);
      break;
    case "Poissons":
      functions.retriveRss(signe, "poissons", res, message);
      break;
    default:
      signe = "";
  }
};

module.exports.matchs_du_jour = (res, message) => {
  request(
    {
      uri: "https://api.football-data.org/v2/matches",
      method: "GET",
      headers: {
        "X-Auth-Token": "184380ba95b646908ca4206dbfd09049"
      }
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);
        matchs = body;
        var text =
          "📋 *Matchs de la journée* ⚽\n                  ______\n_Choisissez le numéro d'ordre d'un match pour afficher ses détails._\n                  ______";

        var firstHours = "";
        var laHours = "";

        if (body.matches.length == 0) {
          text =
            "Il n'y a aucun match intéressant aujourd'hui 😎 On se retrouve demain. Merci.";
        } else {
          for (let i = 0; i < body.matches.length; i++) {
            const unixTimeZero = Date.parse(body.matches[i].utcDate);
            var date = new Date(unixTimeZero);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            laHours = hours + ":" + minutes.substr(-2);

            var compId = body.matches[i].competition.id;
            var compName = body.matches[i].competition.name;
            var homeTeam = body.matches[i].homeTeam.name;
            var awayTeam = body.matches[i].awayTeam.name;

            if (compName == "Serie A") {
              if (compId == "2019") {
                compName = compName + " - Italie";
              } else {
                compName = compName + " - Brasil";
              }
            }

            if (laHours != firstHours) {
              text =
                text +
                "\n\n\n⏱️ *" +
                laHours +
                "* _______________\n\n             _(" +
                compName +
                ")_\n       *_" +
                (i + 1) +
                "_*>  | *" +
                homeTeam +
                "* vs *" +
                awayTeam +
                "*";
              firstHours = laHours;
            } else {
              text =
                text +
                "\n\n             _(" +
                compName +
                ")_\n       *_" +
                (i + 1) +
                "_*>  | *" +
                homeTeam +
                "* vs *" +
                awayTeam +
                "*";
            }
          }
        }

        console.log(text);

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

module.exports.vers_matchs_du_jour_details = (res, ordre, message) => {
  var charge;

  request(
    {
      uri: "https://api.football-data.org/v2/matches",
      method: "GET",
      headers: {
        "X-Auth-Token": "184380ba95b646908ca4206dbfd09049"
      }
    },
    (err, resp, body) => {
      if (!err) {
        body = JSON.parse(body);

        var id = matchs.matches[ordre - 1].id;
        functions.matchs_du_jour_details(res, id, message);

        console.log(matchs.matches[ordre]);
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
};

exports.matchs = matchs;
