"use strict";
// Importe les dépendances et configure le serveur http
const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  app = express().use(body_parser.json()), // creates express http server
  path = require("path"),
  fs = require("fs"),
  dialogflow = require("@google-cloud/dialogflow"),
  uuid = require("uuid"),
  resquests = require("./resquests.js"),
  bdd = require("./bdd.js"),
  venom = require("venom-bot");

let referralCodeGenerator = require("referral-code-generator");
var sessionId; //= uuid.v4();
var clt;

// Définit le port du serveur et log le message en cas de succès
app.listen(process.env.PORT || 5000, () => console.log("le webhook écoute"));

//Creation du chatbot nommé max
venom
  .create(
    "max",
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR); // Optional to log the QR in the terminal
      var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

      if (matches.length !== 3) {
        return new Error("Invalid input string");
      }
      response.type = matches[1];
      response.data = new Buffer.from(matches[2], "base64");

      var imageBuffer = response;
      require("fs").writeFile(
        "out.png",
        imageBuffer["data"],
        "binary",
        function(err) {
          if (err != null) {
            console.log(err);
          }
        }
      );
    },
    undefined,
    { logQR: false }
  )
  .then(client => start(client))
  .catch(erro => {
    console.log(erro);
  });

//Si la creation reussi, on ecoute les messages et evenements entrants
function start(client) {
  client.onMessage(async message => {
    console.log("Message entrant");
    sessionId = message.from;
    let tabuser = sessionId.split("@");

    let user = "+" + tabuser[0];

    if (message.isGroupMsg === false) {
      let nmbrRef = await bdd.retrive(user);

      if (!nmbrRef) {
        resquests.creatNewUser(client, user, sessionId);
      } else {
        if (message.body === "Hi") {
          client
            .sendText(message.from, "Welcome Venom 🕷")
            .then(result => {
              console.log("Result: ", result); //return object success
            })
            .catch(erro => {
              console.error("Error when sending: ", erro); //return object error
            });
        } else if (message.body === "test") {
          console.log("TEST");
          request(
            {
              uri: "https://maxo.edumatique.com",

              query: {
                name: "foo",
                value: "bar"
              },
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              }
            },
            (err, resp, body) => {
              if (!err) {
                console.log(body);
              } else {
                console.error("Unable to send message:" + err);
              }
            }
          );
        } else if (
          message.body.substr(0, 6) == "Jeumax" ||
          message.body.substr(0, 6) == "JEUMAX" ||
          message.body.substr(0, 6) == "jeumax" ||
          message.body.substr(0, 6) == "JeuMax"
        ) {
          await client
            .sendText(
              message.from,
              "*Envie de participer à un jeu pour gagner un jackpot de 500.000F ?*\n\n      Il suffit de suivre les étapes suivantes sans tricher.\n\n   • Enrégister les deux numéros suivants\n   • Partager le texte sous les numéros en statut \n   • Faire des captures et m'envoyer sur Messenger ici m.me/maxofybot  \n   • Attendre jusqu'au tirage au sort.\n\n *Bonne chance*"
            )
            .then(result => {
              console.log("Result: ", result); //return object success
            })
            .catch(erro => {
              console.error("Error when sending: ", erro); //return object error
            });

          await client
            .sendContactVcardList(
              message.from,
              ["22952750532@c.us", "22964532018@c.us"],
              "MAXOFY"
            )
            .then(result => {
              console.log("Result: ", result); //return object success
            })
            .catch(erro => {
              console.error("Error when sending: ", erro); //return object error
            });
          await client
            .sendText(
              message.from,
              "Participez à un jeu sur le robot Maxofy et tentez de gagner 500.000F. Envoyez juste *JEUMAX* sur son numéro wa.me/22952750532 et suivez les instructions\n\n *Bonne chance*"
            )
            .then(result => {
              console.log("Result: ", result); //return object success
            })
            .catch(erro => {
              console.error("Error when sending: ", erro); //return object error
            });
        } else {
          versDialogFlow(message, client);
        }
      }
    } else {
    }
  });
}

//Envoie les message vers DialogFlow pour l'analyse AI
async function versDialogFlow(message, client) {
  let projectId = "magicart-wvtlas";

  var matchs = resquests.matchs;

  // Un identifiant unique pour la session donnée

  // Créer une nouvelle session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "wa.json"
  });
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  let numJournal;
  let user = message.from;

  console.log("\nFonction versDialogFlow()\n");

  // Creation de la requete.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // Le texte exact envoyer à l'agent dialogflow
        text: message.body,
        // La langue utilisée par le client (fr-FR
        languageCode: "fr-FR"
      }
    }
  };

  // Envoyer la demande et enregistrer le résultat
  const responses = await sessionClient.detectIntent(request);
  console.log("DialogFlow : Detected intent");
  console.log(responses.fulfillmentMessages);
  const result = responses[0].queryResult;

  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  Aucune intention correspondante.`);
  }

  const btnMenu = [
    {
      buttonText: {
        displayText: "MENU"
      }
    }
  ];

  let displayName = result.intent.displayName;

  switch (displayName) {
    case "Menu":
      console.log(displayName);

      const list = [
        {
          title: "Choisissez un élément",
          rows: [
            {
              title: "CRYPTOMONNAIES",
              description: "Actus, Prix, Achat, Vente"
            },
            {
              title: "FOOTBALL",
              description: "Scores, Code promo et coupons pari"
            },
            {
              title: "JOURNAUX",
              description: "Actualités politiques d'ici et d'ailleurs"
            },
            {
              title: "HOROSCOPES",
              description: "Prévisions astrologiques"
            },
            {
              title: "CALCULATRICE D'AMOUR",
              description: "Juste pour le fun"
            },
            {
              title: "JEUMAX",
              description: "Tentez de gagner 500000F"
            }
          ]
        }
      ];

      await client
        .sendListMenu(
          message.from,
          "MENU PRINCIPAL",
          "",
          "Découvrez mes fonctions",
          "MENU",
          list
        )
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });

      break;

    case "Default Fallback Intent":
      //Reponse a l'utilisateur
      client
        .sendButtons(
          message.from,
          result.fulfillmentText,
          btnMenu,
          "Cliquez MENU"
        )
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });

      break;

    case "benin_info":
      console.log(displayName);

      const listjournauxbj = [
        {
          title: "Choisissez un parmi les 8 journaaux en ligne",
          rows: [
            {
              title: "24H AU BÉNIN",
              description: "L'information en temps réel"
            },
            {
              title: "LA NATION",
              description: "Votre journal de référence"
            },
            {
              title: "L'ÉVÉNEMENT PRÉCIS",
              description: "Le triomphe de la vérité"
            },
            {
              title: "LA CROIX DU BÉNIN",
              description: "Justice, Vérité, Miséricorde"
            },
            {
              title: "NOTRE EPOQUE",
              description: "Le journal de notre époque"
            },
            {
              title: "LE PROGRÈS",
              description: "Quotidien béninois d'information"
            },
            {
              title: "BÉNIN WEB TV",
              description: "Actualités et Infos du Bénin, d'Afrique..."
            },
            {
              title: "LA NOUVELLE TRIBUNE",
              description: "Site d'informations et d'analyses"
            }
          ]
        }
      ];

      await client
        .sendListMenu(
          message.from,
          "QUELQUES JOURNAUX BÉNINOIS",
          "",
          "Choisissez un journal en ligne",
          "JOURNAUX",
          listjournauxbj
        )
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });

      break;

    case "test":
      console.log(displayName);
      bdd.test();
      break;

    case "infos_menu":
      console.log(displayName);

      client
        .sendLinkPreview(
          message.from,
          "https://facebook.com/alaunetopinfos",
          "Vos actualités sont désormais disponibles sur la page d'information AlaUne."
        )
        .then(result => {
          console.log("Result: ", result); //return object success

          client
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
      break;

    case "football_coupons":
      console.log(displayName);

      const btnsport = [
        {
          buttonText: {
            displayText: "Principaux matchs du jour"
          }
        },
        {
          buttonText: {
            displayText: "CODE PROMO 200%"
          }
        },
        {
          buttonText: {
            displayText: "MENU"
          }
        }
      ];

      client
        .sendButtons(
          message.from,
          "Football et Coupons",
          btnsport,
          "Choisissez une option"
        )
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });

      break;

    case "coupons":
      console.log(displayName);
      client
        .sendText(message.from, result.fulfillmentText)
        .then(result => {})
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });
      break;

    case "zero":
      console.log(displayName);
      resquests.zero(client);
      break;

    case "calcul_love":
      console.log(displayName);
      let noms = result.queryText;
      noms = noms.split(" et ");
      let nom1 = noms[0];
      let nom2 = noms[1];
      if (nom1 && nom2) {
        resquests.calcul_love(client, message, nom1, nom2);
        break;
      }

    case "cryptos_menu":
      console.log(displayName);

      const btnCryptos = [
        {
          buttonText: {
            displayText: "Prix des cryptos"
          }
        },
        {
          buttonText: {
            displayText: "ACHAT/VENTE CRYPTOS"
          }
        },
        {
          buttonText: {
            displayText: "MENU"
          }
        }
      ];

      client
        .sendButtons(
          message.from,
          "CRYPTOMONNAIES",
          btnCryptos,
          "Choisissez une option"
        )
        .then(result => {
          console.log("Result: ", result); //return object success
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });

      break;

    case "prix_des_cryptos":
      console.log(displayName);
      resquests.prix_cryptos(client, message);
      break;

    case "marché_cryptos":
      await client
        .sendContactVcard(message.from, "22962820220@c.us", "MAXOFY CRYPTOS")
        .then(result => {
          console.log("Result: ", result); //return object success

          client
            .sendButtons(
              message.from,
              "Pour tout vos besoins en achat et vente de cryptos, nous sommes disponibles ici 👆",
              btnMenu,
              "Vendeur certifié ✅"
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
      console.log(displayName);

      break;

    case "covid_pays":
      console.log(displayName);
      let code = result.queryText;
      resquests.covid_pays(client, code);
      break;

    case "covid_global":
      console.log(displayName);
      resquests.covid_global(client);
      break;

    case "horoscopes":
      console.log(displayName);

      const btnsigne = [
        {
          buttonText: {
            displayText: "Bélier"
          }
        },
        {
          buttonText: {
            displayText: "Taureau"
          }
        }
      ];

      const listsignes = [
        {
          title: "Choisissez un signe",
          rows: [
            {
              title: "Gémeaux ",
              description: "21 mai-21 juin"
            },
            {
              title: "Cancer ",
              description: "22 juin-23 juil"
            },
            {
              title: "Lion ",
              description: "24 juil-23 août"
            },
            {
              title: "Vierge ",
              description: "24 août-23 sept"
            },
            {
              title: "Balance ",
              description: "24 sept-23 oct"
            },
            {
              title: "Scorpion ",
              description: "24 oct-22 nov"
            },
            {
              title: "Sagittaire ",
              description: "23 nov-2O déc"
            },
            {
              title: "Capricorne ",
              description: "21 déc-20 jan"
            },
            {
              title: "Verseau ",
              description: "21 jan-19 fév"
            },
            {
              title: "Poissons ",
              description: "20 fév-20 mars"
            }
          ]
        }
      ];

      await client
        .sendButtons(
          message.from,
          "Les 2 premiers signes astrologiques",
          btnsigne,
          "Le reste juste après..."
        )
        .then(results => {
          console.log("Result: ", results); //return object success
          client
            .sendListMenu(
              message.from,
              "Les 10 autres signes astrologiques",
              "",
              "Cliquez SIGNES pour choisir parmi les signes restants ",
              "SIGNES",
              listsignes
            )
            .then(results => {
              console.log("Result: ", results); //return object success
            })
            .catch(erro => {
              console.error("Error when sending: ", erro); //return object error
            });
        })
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });

      break;

    case "horoscope":
      console.log(displayName);
      let signe = result.parameters.fields.signeastro.stringValue;
      resquests.horoscope(client, signe, message);
      break;

    case "contacts":
      console.log(displayName);
      let refCode = referralCodeGenerator.alphaNumeric("uppercase", 1, 6);
      resquests.contacts(client, user, refCode);
      break;

    case "ref_view":
      console.log(displayName);
      resquests.view_ref(client, user);

      break;

    case "ref_update":
      console.log(displayName);
      let refCodeUp = result.queryText;
      resquests.update(client, user, refCodeUp);

      break;

    case "ref_number":
      console.log(displayName);
      let refCodeUp1 = result.queryText;
      resquests.update(client, user, refCodeUp1);

      break;

    case "no_code_ref":
      console.log(displayName);
      resquests.view_refCode(client, user);

      break;

    case "matchs_du_jour":
      console.log(displayName);
      resquests.matchs_du_jour(client, message);
      break;

    case "matchs_du_jour_details":
      console.log(displayName);
      let ordre = result.parameters.fields.number.numberValue;
      resquests.vers_matchs_du_jour_details(client, ordre, message);
      break;

    //24h au benin_________________________________________________

    case "24h_au_benin_":
      console.log("24h_au_benin_");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, 311, message);
      break;

    case "24h_au_benin_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //La nation______________________________________________________

    case "la_nation":
      console.log("la_nation");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "la_nation_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //Bénin Web TV______________________________________________________

    case "benin_web_tv":
      console.log("benin_web_tv");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "benin_web_tv_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //Croix du Bénin______________________________________________________

    case "croix_du_benin":
      console.log("croix_du_benin");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "croix_du_benin_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //La Nouvelle Tribune______________________________________________________

    case "la_nouvelle_tribune":
      console.log("la_nouvelle_tribune");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "la_nouvelle_tribune_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //Le Progrès______________________________________________________

    case "le_progres":
      console.log("le_progres");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "le_progres_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //L'événement Précis______________________________________________________

    case "evenement_precis":
      console.log("evenement_precis");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "evenement_precis_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //Notre Epoque______________________________________________________

    case "notre_epoque":
      console.log("notre_epoque");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "notre_epoque_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //Jeune Afrique______________________________________________________

    case "jeune_afrique":
      console.log("jeune_afrique");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "jeune_afrique_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //Jeune Afrique______________________________________________________

    case "francev":
      console.log("francev");
      console.log(displayName);
      numJournal = result.queryText;
      resquests.format_liste_titres_journaux(client, numJournal);
      break;

    case "francev_lecture":
      console.log(displayName);
      var contexte = result.outputContexts[0];
      var journal = contexte.parameters.journal;
      var numArticle = contexte.parameters.number - 1;
      resquests.lecture_articles(client, numArticle, journal);
      break;

    //Fin_______________________________________
    default:
      //Reponse a l'utilisateur
      client
        .sendText(message.from, result.fulfillmentText)
        .then(result => {})
        .catch(erro => {
          console.error("Error when sending: ", erro); //return object error
        });
  }
}

//Rend la page d'acceuil
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

//Rend le code QR
app.get("/qr", (req, res) => {
  res.sendFile(path.join(__dirname + "/out.png"));
});

app.post("/newUser", (req, res) => {
  let user = req.body.query.sender;
  user = user.split(" ").join("");
  resquests.creatNewUser(clt, user);
  console.log(user);
});

//Maintien le serveur en eveil
app.get("/live", (req, res) => {
  console.log("Max est live ?");
  res.send("Yes");
});
