const admin = require("firebase-admin");

const serviceAccount = require("./wapro.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function test() {
  const docRef = db.collection("users").doc("referals");

  const doc = await docRef.get();

  if (!doc.exists) {
    await docRef.set({
      num: "+22964532018",
      nbrRef: 0
    });
  } else {
    await docRef.update({
      nbrRef: admin.firestore.FieldValue.increment(2)
    });
  }

  console.log("test fonctionne");
}

async function creatUser(num, refCode) {
  const docRef = db.collection("users").doc(num);

  const doc = await docRef.get();

  if (!doc.exists) {
    await docRef.set({
      num: num,
      refCode: refCode,
      nbrRef: 0
    });
    console.log("Le users est créé");
    let user = await retrive(num);
    return user;
  } else {
    console.log("Le users exite");
  }
}

async function updateReferral(refCode) {
  const docRef = db.collection("users");

  const snapshot = await docRef.where("refCode", "==", refCode).get();

  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  } else {
    snapshot.forEach(doc => {
      console.log(doc.id, "=>", doc.data());
      const docRef = db.collection("users").doc(doc.id);
      docRef.update({
        nbrRef: admin.firestore.FieldValue.increment(1)
      });
    });
  }
}

async function retrive(num) {
  const docRef = db.collection("users").doc(num);

  const doc = await docRef.get();
  console.log("Données récupérées");

  if (!doc.exists) {
    console.log("No such document!");
  } else {
    console.log("Document data:", doc.data().nbrRef);
    return doc.data();
  }
}

async function rezo() {

  const docRef = db.collection("users");
  const snapshot = await docRef.get();
  if (snapshot.empty) {
    console.log("No matching documents.");
    return;
  }

  snapshot.forEach(doc => {
    console.log(doc.id, '=>', doc.data());
    const docRef = db.collection("users").doc(doc.id);
      docRef.update({
        nbrRef: 0
      });
  });
}

module.exports.creatUser = creatUser;
module.exports.updateReferral = updateReferral;
module.exports.retrive = retrive;
module.exports.rezo = rezo;
