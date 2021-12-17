const suits = ["♠", "♦", "♣", "♥"];
const figures = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
const countValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0];
let cash = 1000;
let sabot;
let punto = [];
let banco = [];
let puntoSide = document.getElementsByClassName(".Punto");
let bancoSide = document.getElementsByClassName(".Banco");
let betChoices = document.getElementsByName("bet");
let betAmountField = document.getElementById("betamount");
let clearBtn = document.getElementById("clear");
let startPlayin = document.getElementById("deal");
let wallet = document.getElementById("wallet");
let cardSlots = document.getElementsByClassName('card')
let pcs1 = document.getElementById('pcs1')
let pcs2 = document.getElementById('pcs2')
let pcs3 = document.getElementById('pcs3')
let bcs1 = document.getElementById('bcs1')
let bcs2 = document.getElementById('bcs2')
let bcs3 = document.getElementById('bcs3')

//Démarrer le jeu avec le bouton DEAL
startPlayin.onclick = gameTurn;

//Purger les cartes du tour précédent
clearBtn.onclick = clearHands

//Créer un deck de 52 cartes
function newDeck() {
  let deck = new Array();
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < figures.length; j++) {
      let card = { figure: figures[j], value: countValues[j], suit: suits[i] };
      deck.push(card);
    }
  }
  return deck;
}

//Préparer les decks du sabot (6 decks mélangés)
function getSabot() {
  const deck1 = newDeck();
  const deck2 = newDeck();
  const deck3 = newDeck();
  const deck4 = newDeck();
  const deck5 = newDeck();
  const deck6 = newDeck();
  sabot = deck1.concat(deck2, deck3, deck4, deck5, deck6);
  return sabot;
}

// Mélanger un deck
function shuffle(deck) {
  let currentIndex = deck.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    deck[currentIndex] = deck[randomIndex];
    deck[randomIndex] = deck[currentIndex];
    // [deck[currentIndex], deck[randomIndex]] = [
    //   deck[randomIndex], deck[currentIndex]];
  }
  return deck;
}

//Tirer une carte et l'affecter à une main
function hitCardBanco() {
  banco.push(sabot[0]);
  sabot.splice(0, 1);
  let drawnCard = document.getElementById(`bcs${banco.length}`);
  if (
    banco[banco.length - 1].suit === "♠" ||
    banco[banco.length - 1].suit === "♣"
  ) {
    drawnCard.classList.add("card", "black");
    drawnCard.classList.remove("red");
  } else {
    drawnCard.classList.add("card", "red");
    drawnCard.classList.remove("black");
  }
  drawnCard.innerHTML = `${banco[banco.length - 1].figure} ${
    banco[banco.length - 1].suit
  } `;
  return banco;
}

function hitCardPunto() {
  punto.push(sabot[0]);
  sabot.splice(0, 1);
  let drawnCard = document.getElementById(`pcs${punto.length}`);
  if (
    punto[punto.length - 1].suit === "♠" ||
    punto[punto.length - 1].suit === "♣"
  ) {
    drawnCard.classList.add("card", "black");
    drawnCard.classList.remove("red");
  } else {
    drawnCard.classList.add("card", "red");
    drawnCard.classList.remove("black");
  }
  drawnCard.textContent = `${punto[punto.length - 1].figure} ${
    punto[punto.length - 1].suit
  } `;
  return punto;
}

//Déterminer la valeur de la main
function handValue(arr) {
  let valueSum = 0;
  for (let i = 0; i < arr.length; i++) {
    valueSum += arr[i].value;
  }
  valueSum = valueSum % 10;
  return valueSum;
}

function clearHands() {
  punto.splice(0, 3);
  banco.splice(0, 3);
  pcs1.classList.remove('card')
  pcs1.innerHTML = ""
  pcs2.classList.remove('card')
  pcs2.innerHTML = ""
  pcs3.classList.remove('card')
  pcs3.innerHTML = ""
  bcs1.classList.remove('card')
  bcs1.innerHTML = ""
  bcs2.classList.remove('card')
  bcs2.innerHTML = ""
  bcs3.classList.remove('card')
  bcs3.innerHTML = ""
  return (punto, banco);
}

function getBet() {
  for (let i = 0; i < betChoices.length; i++) {
    if (betChoices[i].checked) {
      return betChoices[i].value;
    }
  }
}

function updateCash() {
  wallet.innerHTML = `$${cash}`;
  return wallet.innerHTML;
}

//Sabot initial
getSabot();
const x = shuffle(sabot);

//Afficher le cash initial
updateCash()


//Un tour de jeu
function gameTurn() {
  let betGain = 0;


  if( pcs1.classList.contains('card')){
    window.alert('CLEAR the previous hand before starting a new one !')
    return
  }

  //Enregistrement des paris
  let playersBet = getBet();
  let betsAmount = parseInt(betAmountField.value);

  if (isNaN(betsAmount)) {
    window.alert(
      "Please bet a valid amount or you will end up in the basement ! "
    );
    return
  }

  //if (betsAmount ===0 || isNaN(betsAmount)) {
  // window.alert("You need to enter a valid bet amount !")
  // break
  //}

  //Vérifier si la bankroll est suffisamment approvisionnée pour parier
  if (cash > betsAmount) {
    //Retrait du montant du pari de la bankroll
    cash -= betsAmount;
  } else {
    window.alert("U too poor ! Not enough cash to play! Or sell a kidney, we will give you a good frice for that !");
    return
  }

  //Vérifier le nombre de cartes restantes dans le sabot et si pas suffisant(minmum 6 cartes), refaire un sabot
  if (sabot.length >= 6) {
    //Distribution des 2 cartes à Punto et Banco
    hitCardPunto();
    hitCardBanco();
    hitCardPunto();
    hitCardBanco();
  } else {
    sabot.splice(0, sabot.length);
    sabot = getSabot();
    shuffle(sabot);
    hitCardPunto();
    hitCardBanco();
    hitCardPunto();
    hitCardBanco();
  }
  console.log(
    "punto",
    punto[0].value,
    "+",
    punto[1].value,
    "=",
    handValue(punto)
  );
  console.log(
    "banco",
    banco[0].value,
    "+",
    banco[1].value,
    "=",
    handValue(banco)
  );
  // Déterminer les valeurs de Punto et tirage/ou non en conséquence
  if (handValue(punto) >= 8 || handValue(banco) >= 8) {
    return checkWin(playersBet, betGain, betsAmount);
  } else if (handValue(punto) === 6 || handValue(punto) === 7) {
    if (handValue(banco) <= 5) {
      hitCardBanco();
    }
  } else {
    hitCardPunto();
    //Déterminer ce que fait Banco en fonction de Punto 3ème carte (si ne marche, passer en switch case)
    if (
      (handValue(banco) === 3 && punto[2].value !== 8) ||
      (handValue(banco) === 4 &&
        (punto[2].value !== 1 ||
          punto[2].value !== 8 ||
          punto[2].value !== 9)) ||
      (handValue(banco) === 5 &&
        (punto[2].value === 4 ||
          punto[2].value === 5 ||
          punto[2].value === 6 ||
          punto[2].value === 7)) ||
      (handValue(banco) === 6 && (punto[2].value === 6 || punto[2].value === 7))
    ) {
      hitCardBanco();
    }
  }
  //Comparer les deux mains, déterminer le résultat
  checkWin(playersBet, betGain, betsAmount);
}

function checkWin(playersBet, betGain, betsAmount) {

  let winner;
  if (handValue(banco) > handValue(punto)) {
    winner = "Banco";
  } else if (handValue(punto) > handValue(banco)) {
    winner = "Punto";
  } else {
    winner = "Equality";
  }
  //Payer en cas de victoire, encaisser en cas de défaite
  if (playersBet === winner) {
    if (playersBet === "Banco") {
      betGain = 1.95 * betsAmount;
    } else if (playersBet === "Punto") {
      betGain = 2 * betsAmount;
    } else {
      betGain = 8 * betsAmount;
    }
  } else {
    betGain === 0;
  }
  cash += betGain;
  updateCash();
  return cash;
}
