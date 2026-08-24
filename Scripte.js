/* =========================================================
   FITLY V2.1
   Script principal
========================================================= */
/* =========================================================
   DONNÉES
========================================================= */
let sportAnswers = {};
let sportStep = 0;
let nutritionAnswers = {};
let nutritionStep = 0;
let history = JSON.parse(
  localStorage.getItem("fitlyHistory") || "[]"
);
let posts = JSON.parse(
  localStorage.getItem("fitlyPosts") || "[]"
);
/* =========================================================
   NAVIGATION
========================================================= */
document.querySelectorAll(".nav button").forEach(function(button){
  button.addEventListener("click", function(){
    const page = button.dataset.page;
    document.querySelectorAll(".page").forEach(function(section){
      section.classList.remove("active");
    });
    const target = document.getElementById(page);
    if(target){
      target.classList.add("active");
    }
    document.querySelectorAll(".nav button").forEach(function(btn){
      btn.classList.remove("active");
    });
    button.classList.add("active");
    window.scrollTo({
      top:0,
      behavior:"smooth"
    });
    updateStats();
  });
});
/* =========================================================
   SPORT
========================================================= */
const sportSteps = [
  {
    title:"Quel est ton objectif ?",
    key:"goal",
    options:[
      ["💪","Prendre du muscle","muscle"],
      ["🔥","Perdre du poids","perte"],
      ["❤️","Me remettre en forme","forme"]
    ]
  },
  {
    title:"Quel est ton niveau ?",
    key:"level",
    options:[
      ["🌱","Débutant","debutant"],
      ["⚡","Intermédiaire","intermediaire"],
      ["🔥","Avancé","avance"]
    ]
  },
  {
    title:"Où vas-tu t'entraîner ?",
    key:"place",
    options:[
      ["🏠","À la maison","maison"],
      ["🏋️","À la salle","salle"]
    ]
  },
  {
    title:"Combien de séances par semaine ?",
    key:"sessions",
    options:[
      ["2️⃣","2 séances",2],
      ["3️⃣","3 séances",3],
      ["4️⃣","4 séances",4],
      ["5️⃣","5 séances",5]
    ]
  },
  {
    title:"Combien de temps par séance ?",
    key:"duration",
    options:[
      ["⏱️","20 minutes",20],
      ["⏱️","30 minutes",30],
      ["⏱️","45 minutes",45],
      ["⏱️","60 minutes",60]
    ]
  },
  {
    title:"Quel matériel as-tu ?",
    key:"equipment",
    options:[
      ["🤸","Aucun matériel","none"],
      ["🏠","Quelques équipements","home"],
      ["🏋️","Équipement complet","gym"]
    ]
  }
];
document.getElementById("startSport")
  .addEventListener("click", startSport);
document.getElementById("cancelSport")
  .addEventListener("click", cancelSport);
function startSport(){
  sportAnswers = {};
  sportStep = 0;
  document.getElementById("sportHome")
    .classList.add("hidden");
  document.getElementById("sportResult")
    .classList.add("hidden");
  document.getElementById("sportQuiz")
    .classList.remove("hidden");
  renderSportQuestion();
}
function cancelSport(){
  document.getElementById("sportQuiz")
    .classList.add("hidden");
  document.getElementById("sportHome")
    .classList.remove("hidden");
}
function renderSportQuestion(){
  const question = sportSteps[sportStep];
  const progress =
    ((sportStep + 1) / sportSteps.length) * 100;
  document.getElementById("sportProgress")
    .style.width = progress + "%";
  let html = "";
  html += `
    <div class="eyebrow">
      QUESTION ${sportStep + 1}/${sportSteps.length}
    </div>
  `;
  html += `
    <h1>${question.title}</h1>
  `;
  question.options.forEach(function(option){
    html += `
      <button
        class="option sportOption"
        data-key="${question.key}"
        data-value="${option[2]}"
      >
        ${option[0]} ${option[1]}
      </button>
    `;
  });
  html += `
    <button
      class="primary"
      id="sportNext"
      disabled
    >
      ${
        sportStep === sportSteps.length - 1
        ? "Créer mon programme 🔥"
        : "Continuer →"
      }
    </button>
  `;
  document.getElementById("sportQuestion")
    .innerHTML = html;
  document.querySelectorAll(".sportOption")
    .forEach(function(button){
      button.addEventListener("click", function(){
        document
          .querySelectorAll(".sportOption")
          .forEach(function(btn){
            btn.classList.remove("selected");
          });
        button.classList.add("selected");
        const key = button.dataset.key;
        let value = button.dataset.value;
        if(key === "sessions" || key === "duration"){
          value = Number(value);
        }
        sportAnswers[key] = value;
        document.getElementById("sportNext")
          .disabled = false;
      });
    });
  document.getElementById("sportNext")
    .addEventListener("click", function(){
      if(sportStep < sportSteps.length - 1){
        sportStep++;
        renderSportQuestion();
      }else{
        generateSport();
      }
    });
}
/* =========================================================
   GÉNÉRATION PROGRAMME SPORT
========================================================= */
function generateSport(){
  document.getElementById("sportQuiz")
    .classList.add("hidden");
  document.getElementById("sportResult")
    .classList.remove("hidden");
  let workouts;
  if(sportAnswers.place === "maison"){
    if(sportAnswers.goal === "muscle"){
      workouts = [
        [
          "Haut du corps",
          [
            "Pompes — 3 × 8-12",
            "Pike push-ups — 3 × 6-10",
            "Pompes inclinées — 3 × 10",
            "Gainage — 3 × 30 sec"
          ]
        ],
        [
          "Jambes",
          [
            "Squats — 3 × 12-15",
            "Fentes — 3 × 10/jambe",
            "Pont fessier — 3 × 15",
            "Mollets — 3 × 20"
          ]
        ],
        [
          "Full body",
          [
            "Pompes — 3 × 10",
            "Squats — 3 × 15",
            "Fentes — 3 × 10/jambe",
            "Gainage — 3 × 30 sec"
          ]
        ]
      ];
    }else{
      workouts = [
        [
          "Full body",
          [
            "Marche rapide — 10 min",
            "Squats — 3 × 12",
            "Pompes adaptées — 3 × 8",
            "Gainage — 3 × 30 sec"
          ]
        ],
        [
          "Cardio",
          [
            "Marche rapide — 15 min",
            "Mountain climbers — 3 × 20",
            "Squats — 3 × 15",
            "Gainage — 3 × 30 sec"
          ]
        ],
        [
          "Mobilité",
          [
            "Marche — 10 min",
            "Fentes — 3 × 10/jambe",
            "Pont fessier — 3 × 15",
            "Gainage — 3 × 20 sec"
          ]
        ]
      ];
    }
  }else{
    workouts = [
      [
        "Pectoraux + triceps",
        [
          "Développé couché — 3 × 8-12",
          "Développé incliné — 3 × 8-12",
          "Écartés — 3 × 12-15",
          "Extension triceps — 3 × 10-15"
        ]
      ],
      [
        "Dos + biceps",
        [
          "Tirage vertical — 3 × 8-12",
          "Rowing — 3 × 8-12",
          "Tirage horizontal — 3 × 10-12",
          "Curl biceps — 3 × 10-15"
        ]
      ],
      [
        "Jambes + épaules",
        [
          "Presse à cuisses — 3 × 10-15",
          "Leg curl — 3 × 10-15",
          "Élévations latérales — 3 × 12-15",
          "Mollets — 3 × 15-20"
        ]
      ]
    ];
  }
  const sessions =
    Number(sportAnswers.sessions || 2);
  let html = `
    <div class="eyebrow">
      TON PROGRAMME
    </div>
    <h1>
      Prêt à commencer 💪
    </h1>
  `;
  for(let i = 0; i < sessions; i++){
    const workout =
      workouts[i % workouts.length];
    html += `
      <div class="workout">
        <h3>
          Séance ${i + 1} — ${workout[0]}
        </h3>
    `;
    workout[1].forEach(function(exercise){
      html += `
        <div class="exercise">
          • ${exercise}
        </div>
      `;
    });
    html += `
        <button
          class="complete"
          data-workout="${Date.now()}-${i}"
        >
          ✓ Terminer la séance
        </button>
      </div>
    `;
  }
  html += `
    <button
      class="primary"
      id="newSport"
    >
      Créer un autre programme
    </button>
  `;
  document.getElementById("sportResult")
    .innerHTML = html;
  document.querySelectorAll(".complete")
    .forEach(function(button){
      button.addEventListener("click", function(){
        if(button.classList.contains("done")){
          return;
        }
        button.classList.add("done");
        button.textContent =
          "✓ Séance terminée";
        history.push({
          timestamp:Date.now()
        });
        localStorage.setItem(
          "fitlyHistory",
          JSON.stringify(history)
        );
        updateStats();
      });
    });
  document.getElementById("newSport")
    .addEventListener("click", function(){
      document.getElementById("sportResult")
        .classList.add("hidden");
      document.getElementById("sportHome")
        .classList.remove("hidden");
    });
}
/* =========================================================
   NUTRITION
========================================================= */
const foods = {
  oats:["Flocons d'avoine",0.14],
  milk:["Lait",0.20],
  banana:["Banane",0.25],
  apple:["Pomme",0.30],
  yogurt:["Yaourt nature",0.35],
  eggs:["Œufs",0.35],
  rice:["Riz",0.30],
  pasta:["Pâtes",0.25],
  potato:["Pommes de terre",0.30],
  chicken:["Poulet",1.20],
  tuna:["Thon",1.10],
  lentils:["Lentilles",0.45],
  beans:["Haricots rouges",0.50],
  vegetables:["Légumes",0.65],
  bread:["Pain complet",0.25],
  cheese:["Fromage",0.45],
  nuts:["Fruits à coque",0.45],
  tomato:["Tomates",0.35]
};
const nutritionSteps = [
  {
    title:"Quel est ton objectif ?",
    key:"goal",
    options:[
      ["💪","Prise de muscle","muscle"],
      ["🔥","Perte de poids","loss"],
      ["⚖️","Maintien / équilibre","balance"]
    ]
  },
  {
    title:"Quel est ton budget par semaine ?",
    key:"budget",
    options:[
      ["💰","25 €",25],
      ["💰","40 €",40],
      ["💰","60 €",60],
      ["💎","80 €",80]
    ]
  },
  {
    title:"Combien de repas par jour ?",
    key:"meals",
    options:[
      ["🍽️","2 repas",2],
      ["🍽️","3 repas",3],
      ["🍽️","3 repas + 1 collation",4]
    ]
  },
  {
    title:"Quel type d'alimentation ?",
    key:"style",
    options:[
      ["🍗","Omnivore","omnivore"],
      ["🥬","Végétarienne","vegetarian"]
    ]
  }
];
document.getElementById("startNutrition")
  .addEventListener("click", startNutrition);
document.getElementById("cancelNutrition")
  .addEventListener("click", cancelNutrition);
function startNutrition(){
  nutritionAnswers = {};
  nutritionStep = 0;
  document.getElementById("nutritionHome")
    .classList.add("hidden");
  document.getElementById("nutritionResult")
    .classList.add("hidden");
  document.getElementById("nutritionQuiz")
    .classList.remove("hidden");
  renderNutritionQuestion();
}
function cancelNutrition(){
  document.getElementById("nutritionQuiz")
    .classList.add("hidden");
  document.getElementById("nutritionHome")
    .classList.remove("hidden");
}
function renderNutritionQuestion(){
  const question =
    nutritionSteps[nutritionStep];
  const progress =
    ((nutritionStep + 1) / nutritionSteps.length) * 100;
  document.getElementById("nutritionProgress")
    .style.width = progress + "%";
  let html = `
    <div class="eyebrow">
      QUESTION ${nutritionStep + 1}/${nutritionSteps.length}
    </div>
    <h1>
      ${question.title}
    </h1>
  `;
  question.options.forEach(function(option){
    html += `
      <button
        class="option nutritionOption"
        data-key="${question.key}"
        data-value="${option[2]}"
      >
        ${option[0]} ${option[1]}
      </button>
    `;
  });
  html += `
    <button
      class="primary"
      id="nutritionNext"
      disabled
    >
      ${
        nutritionStep === nutritionSteps.length - 1
        ? "Générer mon alimentation 🍎"
        : "Continuer →"
      }
    </button>
  `;
  document.getElementById("nutritionQuestion")
    .innerHTML = html;
  document.querySelectorAll(".nutritionOption")
    .forEach(function(button){
      button.addEventListener("click", function(){
        document
          .querySelectorAll(".nutritionOption")
          .forEach(function(btn){
            btn.classList.remove("selected");
          });
        button.classList.add("selected");
        const key = button.dataset.key;
        let value = button.dataset.value;
        if(key === "budget" || key === "meals"){
          value = Number(value);
        }
        nutritionAnswers[key] = value;
        document.getElementById("nutritionNext")
          .disabled = false;
      });
    });
  document.getElementById("nutritionNext")
    .addEventListener("click", function(){
      if(nutritionStep < nutritionSteps.length - 1){
        nutritionStep++;
        renderNutritionQuestion();
      }else{
        generateNutrition();
      }
    });
}
/* =========================================================
   GÉNÉRATION NUTRITION
========================================================= */
function generateNutrition(){
  document.getElementById("nutritionQuiz")
    .classList.add("hidden");
  document.getElementById("nutritionResult")
    .classList.remove("hidden");
  const vegetarian =
    nutritionAnswers.style === "vegetarian";
  const budget =
    Number(nutritionAnswers.budget || 40);
  const meals =
    Number(nutritionAnswers.meals || 3);
  const breakfasts = [
    ["Petit-déjeuner",["oats","milk","banana"]],
    ["Petit-déjeuner",["bread","eggs","apple"]],
    ["Petit-déjeuner",["oats","yogurt","apple"]]
  ];
  const lunches = vegetarian
    ? [
        ["Déjeuner",["rice","lentils","vegetables"]],
        ["Déjeuner",["pasta","tomato","cheese"]],
        ["Déjeuner",["potato","eggs","vegetables"]]
      ]
    : [
        ["Déjeuner",["rice","chicken","vegetables"]],
        ["Déjeuner",["pasta","tuna","tomato"]],
        ["Déjeuner",["potato","chicken","vegetables"]]
      ];
  const dinners = vegetarian
    ? [
        ["Dîner",["pasta","lentils","vegetables"]],
        ["Dîner",["rice","eggs","tomato"]],
        ["Dîner",["potato","beans","vegetables"]]
      ]
    : [
        ["Dîner",["pasta","chicken","vegetables"]],
        ["Dîner",["rice","eggs","vegetables"]],
        ["Dîner",["potato","tuna","tomato"]]
      ];
  const snacks = [
    ["Collation",["banana","yogurt"]],
    ["Collation",["apple","nuts"]],
    ["Collation",["bread","cheese"]]
  ];
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche"
  ];
  let total = 0;
  let shopping = {};
  let menuHTML = "";
  days.forEach(function(day,index){
    let today = [
      breakfasts[index % breakfasts.length],
      lunches[index % lunches.length],
      dinners[index % dinners.length]
    ];
    if(meals === 4){
      today.push(
        snacks[index % snacks.length]
      );
    }
    let dayCost = 0;
    today.forEach(function(meal){
      meal[1].forEach(function(id){
        const food = foods[id];
        dayCost += food[1];
        total += food[1];
        if(!shopping[id]){
          shopping[id] = {
            name:food[0],
            count:0,
            price:food[1]
          };
        }
        shopping[id].count++;
      });
    });
    menuHTML += `
      <div class="day">
        <div class="dayTitle">
          ${day} · ~${dayCost.toFixed(2)} €
        </div>
    `;
    today.forEach(function(meal){
      let price = 0;
      meal[1].forEach(function(id){
        price += foods[id][1];
      });
      menuHTML += `
        <div class="meal">
          <div class="mealName">
            ${meal[0]}
          </div>
          <div class="mealFood">
            ${
              meal[1]
                .map(function(id){
                  return foods[id][0];
                })
                .join(" + ")
            }
          </div>
          <div class="mealPrice">
            ~${price.toFixed(2)} €
          </div>
        </div>
      `;
    });
    menuHTML += `</div>`;
  });
  let shoppingHTML = "";
  Object.values(shopping).forEach(function(item){
    shoppingHTML += `
      <div class="shopping">
        <input type="checkbox">
        <div>
          <strong>
            ${item.name}
          </strong>
          <div style="color:#777;font-size:12px">
            Prévu ${item.count} fois ·
            ~${(item.price * item.count).toFixed(2)} €
          </div>
        </div>
      </div>
    `;
  });
  let budgetMessage = "";
  if(total <= budget){
    budgetMessage = `
      <p style="color:#8eeed5;margin-top:8px">
        ✓ Estimation dans ton budget.
      </p>
    `;
  }else{
    budgetMessage = `
      <p style="color:#ffb1b1;margin-top:8px">
        ⚠️ L'estimation dépasse ton budget.
        Les prix réels peuvent varier selon les magasins.
      </p>
    `;
  }
  let objective = "Maintien / équilibre";
  if(nutritionAnswers.goal === "muscle"){
    objective = "Prise de muscle";
  }
  if(nutritionAnswers.goal === "loss"){
    objective = "Perte de poids";
  }
  let html = `
    <div class="eyebrow">
      TON PROGRAMME
    </div>
    <h1>
      Ta semaine 🍎
    </h1>
    <div class="totalBox">
      <div style="color:#8debd1">
        BUDGET ESTIMÉ
      </div>
      <div class="totalPrice">
        ~${total.toFixed(2)} €
      </div>
      <div style="color:#888">
        Budget choisi :
        ${budget} € / semaine
      </div>
      ${budgetMessage}
    </div>
    <div class="card">
      <h2>
        🎯 Objectif
      </h2>
      <p>
        ${objective}
      </p>
    </div>
    ${menuHTML}
    <div class="card">
      <h2>
        🛒 Liste de courses
      </h2>
      <p>
        Tous les aliments nécessaires
        pour la semaine.
      </p>
      <div style="margin-top:10px">
        ${shoppingHTML}
      </div>
      <button
        class="primary"
        id="copyShopping"
      >
        🛒 Copier ma liste de courses
      </button>
    </div>
    <button
      class="secondary"
      id="newNutrition"
    >
      Modifier mon programme
    </button>
  `;
  document.getElementById("nutritionResult")
    .innerHTML = html;
  localStorage.setItem(
    "fitlyNutrition",
    JSON.stringify({
      answers:nutritionAnswers,
      total:total,
      shopping:shopping
    })
  );
  document.getElementById("copyShopping")
    .addEventListener("click", copyShoppingList);
  document.getElementById("newNutrition")
    .addEventListener("click", function(){
      document.getElementById("nutritionResult")
        .classList.add("hidden");
      document.getElementById("nutritionHome")
        .classList.remove("hidden");
    });
}
/* =========================================================
   LISTE DE COURSES
========================================================= */
function copyShoppingList(){
  const data = JSON.parse(
    localStorage.getItem("fitlyNutrition") || "{}"
  );
  if(!data.shopping){
    return;
  }
  let text =
    "FITLY — LISTE DE COURSES\n\n";
  Object.values(data.shopping)
    .forEach(function(item){
      text +=
        "□ "
        + item.name
        + " — "
        + item.count
        + " portions\n";
    });
  text +=
    "\nBudget estimé : ~"
    + Number(data.total).toFixed(2)
    + " €";
  if(navigator.clipboard){
    navigator.clipboard.writeText(text)
      .then(function(){
        alert(
          "✅ Liste copiée !\n\n"
          + "Tu peux la coller dans Notes."
        );
      })
      .catch(function(){
        alert(text);
      });
  }else{
    alert(text);
  }
}
/* =========================================================
   COMMUNAUTÉ
========================================================= */
document.getElementById("publishPost")
  .addEventListener("click", publishPost);
function publishPost(){
  const input =
    document.getElementById("postText");
  const text =
    input.value.trim();
  if(!text){
    alert(
      "Écris quelque chose avant de publier."
    );
    return;
  }
  posts.unshift({
    text:text,
    date:new Date()
      .toLocaleDateString("fr-FR")
  });
  localStorage.setItem(
    "fitlyPosts",
    JSON.stringify(posts)
  );
  input.value = "";
  renderPosts();
  updateStats();
}
function escapeHTML(text){
  return text
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function renderPosts(){
  const container =
    document.getElementById("posts");
  if(posts.length === 0){
    container.innerHTML = `
      <div
        class="card"
        style="text-align:center;color:#777"
      >
        Aucune publication pour le moment.
      </div>
    `;
    return;
  }
  let html = "";
  posts.forEach(function(post){
    html += `
      <div class="post">
        <div class="user">
          👤 Utilisateur Fitly
        </div>
        <p>
          ${escapeHTML(post.text)}
        </p>
        <div class="date">
          ${post.date}
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}
/* =========================================================
   PROFIL
========================================================= */
document.getElementById("accountButton")
  .addEventListener("click", function(){
    alert(
      "🔐 Les comptes arrivent bientôt.\n\n"
      + "Ils permettront de synchroniser tes "
      + "programmes et ta progression."
    );
  });
/* =========================================================
   STATISTIQUES
========================================================= */
function updateStats(){
  const total =
    history.length;
  const now =
    new Date();
  const day =
    now.getDay();
  const difference =
    day === 0 ? 6 : day - 1;
  const weekStart =
    new Date(now);
  weekStart.setHours(0,0,0,0);
  weekStart.setDate(
    now.getDate() - difference
  );
  const week =
    history.filter(function(item){
      return item.timestamp >=
        weekStart.getTime();
    }).length;
  document.getElementById("sportTotal")
    .textContent = total;
  document.getElementById("sportWeek")
    .textContent = week;
  document.getElementById("profileTotal")
    .textContent = total;
  document.getElementById("profilePosts")
    .textContent = posts.length;
}
/* =========================================================
   INITIALISATION
========================================================= */
renderPosts();
updateStats();
console.log(
  "🔥 Fitly V2.1 chargé correctement."
);
