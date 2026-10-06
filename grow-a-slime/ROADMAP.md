# 🗺️ Grow a Slime : feuille de route étape par étape

Chaque étape est **une session Claude Code**. Pour chaque étape, tu as un prompt prêt à copier et un critère « c'est fini quand… » vérifiable. On ne passe pas à l'étape suivante tant que ce critère n'est pas rempli.

Le concept complet est dans [README.md](./README.md) et les conventions de code dans [CLAUDE.md](./CLAUDE.md).

---

## Mode d'emploi

1. **Où lancer Claude Code**
   - Les étapes marquées 🧪 ne touchent que la logique pure. Elles marchent partout, y compris dans une session cloud.
   - Les étapes marquées 🎮 doivent tourner **sur ton PC**, avec Roblox Studio ouvert et le **serveur MCP de Studio** connecté. Dans Studio : *Assistant → Settings → MCP Servers → Quick connect → Claude Code*. Avec ce serveur, Claude peut lancer un playtest, exécuter du Luau et lire la sortie.
2. **Une étape = une session = un commit.** Commence chaque session par le prompt de l'étape. Claude coche la case de l'étape dans la liste ci-dessous à la fin.
3. **Teste toi-même 2 minutes** après chaque étape 🎮, en appuyant sur Play dans Studio. Si quelque chose cloche, dis-le à Claude dans la même session avant de commit.
4. **Repo dédié conseillé.** À l'étape 0, déplace ce dossier dans son propre repo GitHub, par exemple `grow-a-slime`. Les chemins de ce fichier sont relatifs à la racine du jeu.

### Gabarit de prompt (déjà inclus dans chaque étape)

```text
Lis CLAUDE.md, README.md et l'étape <N> de ROADMAP.md. Réalise uniquement l'étape <N>.
Respecte les conventions de CLAUDE.md. Lance les tests et le lint, vérifie le critère
« c'est fini quand », coche l'étape dans ROADMAP.md, puis commit.
```

---

## Avancement

- [ ] **Phase 0 : Fondations**
  - [ ] 0. Outillage et squelette Rojo
- [ ] **Phase 1 : MVP jouable**
  - [ ] 1. Config et logique pure (+ simulation d'économie)
  - [ ] 2. Sauvegarde joueur
  - [ ] 3. Carte procédurale : place centrale et 8 ranchs
  - [ ] 4. Slimes procéduraux (rendu, animation, errance)
  - [ ] 5. Boucle nourrir → Goo → récolte, et HUD
  - [ ] 6. Fusion
  - [ ] 7. Boutique à stock tournant et œufs
  - [ ] 8. Onboarding de 60 secondes et funnel analytics
  - [ ] 🏁 **Jalon MVP** : publication privée, test avec 2-3 personnes
- [ ] **Phase 2 : Rétention (J1 → J28)**
  - [ ] 9. Gains hors-ligne, récompense quotidienne, œuf de demain
  - [ ] 10. Météo serveur et mutations
  - [ ] 11. Slimedex et quêtes
  - [ ] 12. Renaissance et agrandissement du ranch
- [ ] **Phase 3 : Co-play (signal n°1 de l'algorithme)**
  - [ ] 13. Bonus d'amis, invitations, serveurs privés
  - [ ] 14. Fusion d'amitié
  - [ ] 15. Événement coop « Slime Géant »
- [ ] **Phase 4 : Monétisation éthique**
  - [ ] 16. Gamepasses et produits dev
  - [ ] 17. Saison de 28 jours
- [ ] **Phase 5 : Lancement et croissance**
  - [ ] 18. Performance et mobile
  - [ ] 19. Classements et badges
  - [ ] 20. Page du jeu : icône, miniatures, description, maturité
  - [ ] 21. Live-ops : routine d'update hebdomadaire

---

## Phase 0 : Fondations

### Étape 0 : Outillage et squelette Rojo 🎮

**Objectif :** un projet Rojo vide qui se synchronise dans Studio, avec lint, format et tests opérationnels.

```text
Lis CLAUDE.md, README.md et l'étape 0 de ROADMAP.md. Réalise uniquement l'étape 0.
- Installe la chaîne d'outils avec Rokit (rokit.toml) : rojo, wally, stylua, selene, lune.
  Vérifie les noms de dépôts actuels de chaque outil avant de les ajouter.
- Crée default.project.json et l'arborescence décrite dans CLAUDE.md
  (src/shared, src/server, src/client, tests/), avec un Main.server.luau et un Main.client.luau
  qui affichent "[GrowASlime] server ready" / "client ready".
- Ajoute stylua.toml, selene.toml (std roblox), .gitignore, wally.toml (vide pour l'instant).
- Crée tests/run.luau : un mini-lanceur Lune qui exécute tous les tests/*.spec.luau et sort
  avec un code d'erreur si un test échoue. Ajoute un test exemple.
- Vérifie que le require par chaîne de caractères ("./Module") fonctionne à la fois sous Lune
  et dans Studio pour un module de src/shared/Logic ; sinon, documente l'alternative dans CLAUDE.md.
- Ajoute un script tâches (Makefile ou scripts/*.sh) : `test`, `lint`, `fmt`, `serve`.
Lance rojo serve, synchronise dans Studio via le MCP, démarre un playtest et vérifie les deux prints.
Coche l'étape, commit.
```

**C'est fini quand :**
- `lune run tests/run` passe.
- `selene src` et `stylua --check src` ne signalent rien.
- Un playtest Studio affiche `server ready` et `client ready`.

---

## Phase 1 : MVP jouable

Objectif de la phase : un nouveau joueur comprend et aime le jeu **en moins de 60 secondes**.

### Étape 1 : Config et logique pure 🧪

**Objectif :** tout l'équilibrage dans des tables, et des fonctions pures testées. Une simulation sert à régler la courbe de progression.

```text
Lis CLAUDE.md, README.md et l'étape 1 de ROADMAP.md. Réalise uniquement l'étape 1.
Dans src/shared/Config : Slimes.luau (10 paliers du README : nom, couleur, taille, production
de base), Mutations.luau (8 mutations : multiplicateur, rendu décrit en données), Weather.luau
(5 météos : poids, durée, mutations boostées), Shop.luau (œufs : prix, palier de départ, temps
d'éclosion), Economy.luau (constantes : plafond hors-ligne 8 h, taille de ranch, etc.).
Dans src/shared/Logic (sans aucune API Roblox, aléatoire injectable via un paramètre rng) :
Economy (production d'un slime avec mutations cumulées, max 3), Merge (règles de fusion :
même palier → palier+1, héritage des mutations), MutationRoll (tirage avec bonus météo),
OfflineEarnings (gains plafonnés), ShopRotation (stock déterministe à partir d'une graine
et d'un index de créneau de 5 min, pour que tous les serveurs aient le même stock).
Écris les tests Lune de chaque module.
Écris tools/simulate.luau : simule un joueur "moyen" (clics/minute, achats gloutons, fusions
automatiques) et affiche le temps pour atteindre chaque palier. Règle la config pour viser :
palier 3 en moins de 5 min, palier 5 vers 30 min, palier 7 vers J2-J3, palier 10 vers J10-J14.
Coche l'étape, commit.
```

**C'est fini quand :** les tests passent, et `lune run tools/simulate` affiche une progression dans les cibles.

### Étape 2 : Sauvegarde joueur 🎮

**Objectif :** des données joueur fiables, sans perte ni duplication.

```text
Lis CLAUDE.md, README.md et l'étape 2 de ROADMAP.md. Réalise uniquement l'étape 2.
Ajoute ProfileStore (loleris) via Wally (vérifie le nom actuel du paquet). Crée
src/server/Services/DataService.luau : schéma versionné (Goo, slimes possédés avec palier et
mutations, œufs en cours, stats, dernière connexion, achats traités), migration de version,
chargement à l'arrivée, sauvegarde à la sortie et à la fermeture du serveur, kick propre en cas
d'échec. Expose Get/Update via des fonctions ; aucun autre service n'accède au DataStore.
Ajoute un leaderstats "Goo". En Studio, active l'accès API pour tester ; si indisponible,
utilise un mode mock en mémoire.
Vérifie via le MCP : playtest, modifier le Goo, quitter, relancer, la valeur est conservée.
Coche l'étape, commit.
```

**C'est fini quand :** le Goo est conservé entre deux playtests.

### Étape 3 : Carte procédurale 🎮

**Objectif :** une place centrale entourée de 8 ranchs, tout générée par code.

```text
Lis CLAUDE.md, README.md et l'étape 3 de ROADMAP.md. Réalise uniquement l'étape 3.
Crée src/server/World/MapBuilder.luau : génère par code une place centrale (sol, chemins,
emplacements réservés pour Boutique, Autel de l'amitié, Statue du Slimedex, Slime Géant)
et 8 ranchs disposés en cercle (herbe, clôtures, portail, panneau avec le nom du joueur).
Style cartoon : couleurs saturées, matériaux SmoothPlastic/Grass, quelques arbres en primitives.
Crée RanchService : attribue un ranch libre à chaque joueur à l'arrivée, le libère au départ,
fait apparaître le joueur dans son ranch. Réglages : 8 joueurs max, StreamingEnabled.
Vérifie via le MCP avec un playtest à 2 joueurs (Test → Clients and Servers).
Coche l'étape, commit.
```

**C'est fini quand :** chaque joueur apparaît dans son propre ranch, avec son nom sur le panneau.

### Étape 4 : Slimes procéduraux 🎮

**Objectif :** des slimes mignons et vivants, sans aucun asset.

```text
Lis CLAUDE.md, README.md et l'étape 4 de ROADMAP.md. Réalise uniquement l'étape 4.
Crée src/client/Visual/SlimeBuilder.luau : construit un slime à partir de (palier, mutations) :
boule semi-transparente (Glass), noyau plus sombre, deux yeux et une bouche en petites parts,
taille selon le palier, et rendu de chaque mutation depuis Config/Mutations (Doré = couleur et
reflets, Arc-en-ciel = teinte qui cycle, Galaxie = ForceField + particules, Gelé = glace, etc.).
Crée SlimeAnimator : rebond idle avec écrasement/étirement (TweenService), clignement des yeux,
petite errance aléatoire dans les limites du ranch.
L'état fait foi côté serveur (dossier par ranch avec attributs), le rendu est côté client.
Ajoute une commande de debug (Studio uniquement) qui fait apparaître un slime de chaque
palier et chaque mutation sur la place, pour une revue visuelle.
Prends une capture via le MCP si possible et décris le résultat.
Coche l'étape, commit.
```

**C'est fini quand :** les 10 paliers et les 8 mutations sont reconnaissables d'un coup d'œil.

### Étape 5 : Boucle de base et HUD 🎮

```text
Lis CLAUDE.md, README.md et l'étape 5 de ROADMAP.md. Réalise uniquement l'étape 5.
SlimeService (serveur) : nourrir un slime (clic/tap, avec limite de débit) fait grossir une
jauge ; quand elle est pleine, le slime "produit" une goutte de Goo dans le ranch. Production
passive selon Logic/Economy. Ramassage par proximité ou par tap. Les gouttes ont une durée de vie.
RemoteEvents dans src/shared/Net : le client envoie des intentions, le serveur valide
(propriétaire du ranch, distance, débit).
HUD (client, construit en code, pensé mobile d'abord) : compteur de Goo animé, gros bouton
d'action contextuel, notifications "+X Goo" flottantes, sons placeholder (IDs dans la config).
Coche l'étape, commit.
```

**C'est fini quand :** nourrir, récolter et voir le Goo monter prend moins de 10 s et donne une sensation satisfaisante.

### Étape 6 : Fusion 🎮

```text
Lis CLAUDE.md, README.md et l'étape 6 de ROADMAP.md. Réalise uniquement l'étape 6.
Fusion : tap sur un slime pour le sélectionner (surbrillance), puis tap sur un slime identique
pour fusionner. Ajoute un bouton "Tout fusionner". Le serveur valide via Logic/Merge.
Effet : les deux slimes se rapprochent, s'aplatissent, flash + particules, le nouveau slime
"pop" avec un rebond, puis une bannière "Nouveau palier : Bulle !" s'affiche la première fois.
Limite de places dans le ranch (Config/Economy) avec un message clair quand c'est plein.
Coche l'étape, commit.
```

**C'est fini quand :** la fusion est lisible et jouissive, y compris sur un écran de téléphone (émulateur Studio).

### Étape 7 : Boutique et œufs 🎮

```text
Lis CLAUDE.md, README.md et l'étape 7 de ROADMAP.md. Réalise uniquement l'étape 7.
ShopService : stock qui tourne toutes les 5 min via Logic/ShopRotation (même stock sur tous
les serveurs), quantités limitées par joueur, compte à rebours visible.
Bâtiment Boutique sur la place + ProximityPrompt + UI de boutique (cartes d'œufs, prix, stock).
Œufs : posés dans le ranch, éclosion minutée avec barre de progression au-dessus, puis
le slime éclot avec une animation.
Coche l'étape, commit.
```

**C'est fini quand :** acheter, attendre l'éclosion et obtenir un slime marche de bout en bout, et le stock change toutes les 5 min.

### Étape 8 : Onboarding de 60 secondes 🎮

**Objectif :** combattre le **rebond à la première partie**, devenu un signal de l'algorithme.

```text
Lis CLAUDE.md, README.md et l'étape 8 de ROADMAP.md. Réalise uniquement l'étape 8.
TutorialController pour les nouveaux joueurs uniquement (flag dans les données) :
t=0 : un slime Gouttelette saute vers le joueur, flèche (Beam) + main animée "Tape !"
t<10s : 1re goutte de Goo ramassée (récompense garantie)
t<30s : on offre un 2e slime identique → flèche vers la fusion
t<60s : 1re fusion → bannière + flèche vers la Boutique avec assez de Goo pour 1 œuf
Pas de texte de plus de 5 mots, tout est skippable, aucun écran bloquant.
Ajoute AnalyticsService:LogOnboardingFunnelStepEvent à chaque étape du tutoriel, et
LogEconomyEvent sur les gains et dépenses de Goo.
Coche l'étape, commit.
```

**C'est fini quand :** une personne qui n'a jamais vu le jeu fait sa première fusion en moins d'une minute sans aide.

### 🏁 Jalon MVP

À faire toi-même :
- Publier le jeu en **privé**.
- Activer les **serveurs privés gratuits**.
- Faire jouer 2-3 personnes, idéalement des enfants de la cible, sans rien leur expliquer.
- Noter où ils bloquent, puis donner la liste à Claude dans une session « corrections MVP ».

---

## Phase 2 : Rétention (J1 → J28)

### Étape 9 : Hors-ligne, quotidien, œuf de demain 🎮

```text
Lis CLAUDE.md, README.md et l'étape 9 de ROADMAP.md. Réalise uniquement l'étape 9.
- Gains hors-ligne via Logic/OfflineEarnings (plafond 8 h) + écran de retour
  "Pendant ton absence, tes slimes ont produit X Goo" avec un bouton de collecte satisfaisant.
- Récompense quotidienne avec série (7 jours, récompense croissante, la série casse
  doucement : -1 jour au lieu de remise à zéro).
- "Œuf de demain" : œuf offert en fin de session qui n'éclot qu'à la prochaine journée de jeu.
- Au moment où l'œuf de demain est posé, propose l'opt-in aux notifications d'expérience
  (ExperienceNotificationService:PromptOptIn), une seule fois.
- Récompenses de temps de jeu dans la session (5/10/20/30 min).
Tests Lune pour toute la logique de dates (fuseaux, passage de minuit UTC, triche d'horloge
impossible : on n'utilise que l'heure serveur).
Coche l'étape, commit.
```

**C'est fini quand :** revenir le lendemain (simulé en changeant la date dans les données) déclenche l'écran de retour, la récompense quotidienne et l'éclosion de l'œuf.

### Étape 10 : Météo serveur et mutations 🎮

```text
Lis CLAUDE.md, README.md et l'étape 10 de ROADMAP.md. Réalise uniquement l'étape 10.
WeatherService : une météo toutes les ~12 min (tirage pondéré depuis Config/Weather),
annoncée 30 s avant ("⚡ Orage arc-en-ciel dans 30 s !"), état répliqué par attributs.
Client : changement de Lighting/Atmosphere/Sky, particules autour de la caméra, sons d'ambiance.
Pendant la météo, chaque slime a une chance (Logic/MutationRoll) de gagner la mutation boostée,
avec un effet visuel et une notification "Ton Pudding est devenu DORÉ !".
Les mutations rares déclenchent une annonce à tout le serveur.
Coche l'étape, commit.
```

**C'est fini quand :** chaque météo est spectaculaire, et on a envie d'attendre la prochaine.

### Étape 11 : Slimedex et quêtes 🎮

```text
Lis CLAUDE.md, README.md et l'étape 11 de ROADMAP.md. Réalise uniquement l'étape 11.
Slimedex : grille paliers × mutations (+ section hybrides vide pour l'étape 14), silhouettes
pour les entrées non découvertes, récompenses de complétion par ligne et par colonne.
Statue du Slimedex sur la place qui affiche le meilleur collectionneur du serveur.
Quêtes : 3 quotidiennes + 3 hebdomadaires, tirées d'un pool en config ("Fusionne 10 slimes",
"Obtiens une mutation pendant un Blizzard", "Joue avec un ami"…), remises à zéro à minuit UTC.
Coche l'étape, commit.
```

### Étape 12 : Renaissance et agrandissement 🎮

```text
Lis CLAUDE.md, README.md et l'étape 12 de ROADMAP.md. Réalise uniquement l'étape 12.
Renaissance : à partir du palier 8, possibilité de tout remettre à zéro contre des "Étoiles
de slime" (bonus permanent de production + cosmétique de ranch). Écran de confirmation clair.
Agrandissement du ranch : places supplémentaires et décorations achetables en Goo.
Relance tools/simulate.luau avec la renaissance et ajuste pour qu'une 1re renaissance tombe
vers J4-J6 pour un joueur quotidien.
Coche l'étape, commit.
```

---

## Phase 3 : Co-play (signal n°1 de l'algorithme)

### Étape 13 : Bonus d'amis et invitations 🎮

```text
Lis CLAUDE.md, README.md et l'étape 13 de ROADMAP.md. Réalise uniquement l'étape 13.
FriendService : détecte les amis présents sur le serveur (Player:IsFriendsWith, en pcall
et mis en cache). Bonus de production de +20 % par ami présent (plafond +60 %), affiché dans le
HUD ("👥 +40 % : 2 amis ici").
Lien visuel (Beam doux) entre amis proches.
Bouton "Inviter un ami" (SocialService:CanSendGameInviteAsync puis PromptGameInvite) visible
dans le HUD et proposé après les moments forts (1re mutation, nouveau palier).
Quand un ami rejoint via invitation ou via "rejoindre", la notification et le message sont
chaleureux : "Léa a rejoint ton ranch !".
Coche l'étape, commit.
```

**C'est fini quand :** en playtest à 2 joueurs amis (ou avec un mock d'amitié en Studio), le bonus s'applique et s'affiche.

### Étape 14 : Fusion d'amitié 🎮

**Objectif :** la mécanique signature, qui crée des **jours de co-play intentionnel**.

```text
Lis CLAUDE.md, README.md et l'étape 14 de ROADMAP.md. Réalise uniquement l'étape 14.
Autel de l'amitié sur la place : deux joueurs amis y déposent chacun un slime. Ils gardent
leurs slimes : la fusion d'amitié ne détruit rien. Chacun reçoit un "œuf hybride" dont le
résultat dépend des deux slimes (table d'hybrides en config : couleurs mélangées,
mutation exclusive "Amitié", noms combinés).
Limite : 1 fusion d'amitié par paire d'amis et par jour (stockée chez les deux joueurs),
compteur visible "Prochaine fusion avec Léa : demain".
Les hybrides remplissent la section dédiée du Slimedex.
Logique (hybride déterministe, limite quotidienne) dans src/shared/Logic avec tests Lune.
Coche l'étape, commit.
```

**C'est fini quand :** deux amis obtiennent chacun un hybride, et une deuxième tentative le même jour est refusée gentiment.

### Étape 15 : Événement coop « Slime Géant » 🎮

```text
Lis CLAUDE.md, README.md et l'étape 15 de ROADMAP.md. Réalise uniquement l'étape 15.
Toutes les 30 min, un Slime Géant affamé apparaît sur la place pour 3 min. Tout le serveur le
nourrit (taps + dons de Goo) pour remplir une jauge commune. Si elle est remplie, il explose
en pluie de récompenses pour tous les participants, plus un bonus si des amis ont participé
ensemble. Annonce 1 min avant, barre de progression globale, classement des contributeurs.
Aucun combat, aucune perte : on reste en maturité Minimal.
Coche l'étape, commit.
```

---

## Phase 4 : Monétisation éthique

### Étape 16 : Gamepasses et produits dev 🎮

```text
Lis CLAUDE.md, README.md et l'étape 16 de ROADMAP.md. Réalise uniquement l'étape 16.
MonetizationService : IDs dans Config/Products.luau (placeholders que je remplirai).
Gamepasses : VIP, Goo ×2, Récolte auto, +4 places (vérif à l'arrivée + à l'achat).
Produits dev : Restock instantané, Potion de chance 15 min, packs de Goo, "Météo offerte"
(déclenche une météo pour tout le serveur avec annonce du nom de l'acheteur).
ProcessReceipt idempotent : PurchaseId mémorisé dans le profil, accordé AVANT de renvoyer
PurchaseGranted, sauvegarde forcée. Aucun objet aléatoire payant.
UI de boutique Robux claire, sans pression (pas de faux comptes à rebours).
Tests Lune pour la logique d'idempotence.
Coche l'étape, commit.
```

**C'est fini quand :** les achats test en Studio s'appliquent une seule fois, même si `ProcessReceipt` est rappelé.

### Étape 17 : Saison de 28 jours 🎮

```text
Lis CLAUDE.md, README.md et l'étape 17 de ROADMAP.md. Réalise uniquement l'étape 17.
Passe de saison de 28 jours (dates en config) : XP gagnée en jouant (quêtes, fusions, météos,
co-play compte double), 30 paliers, piste gratuite + piste premium (produit dev, stockée par
saison). Récompenses : cosmétiques de ranch, slime exclusif de saison, Étoiles.
Écran de fin de saison et transition automatique vers la suivante.
Coche l'étape, commit.
```

---

## Phase 5 : Lancement et croissance

### Étape 18 : Performance et mobile 🎮

```text
Lis CLAUDE.md, README.md et l'étape 18 de ROADMAP.md. Réalise uniquement l'étape 18.
Audit perf : nombre de parts par ranch et sur la place, nombre de slimes animés (LOD : pas
d'animation hors du champ de vision et au-delà d'une distance), particules (budget),
fréquence des remotes. Mesure via le MCP (stats en playtest à 8 joueurs).
Audit UI : toutes les tailles d'écran de l'émulateur Studio (téléphone, tablette, PC, console),
zones tactiles assez grandes, safe areas, texte lisible.
Corrige ce qui dépasse et documente les budgets dans CLAUDE.md.
Coche l'étape, commit.
```

### Étape 19 : Classements et badges 🎮

```text
Lis CLAUDE.md, README.md et l'étape 19 de ROADMAP.md. Réalise uniquement l'étape 19.
Classements (OrderedDataStore) : production totale, Slimedex, contributions au Slime Géant ;
global + hebdomadaire (clé par semaine ISO). Panneaux physiques sur la place + onglet dans l'UI.
Badges (BadgeService) pour les jalons : 1re fusion, 1re mutation, 1re fusion d'amitié,
palier 10, Slimedex complet. IDs dans la config.
Coche l'étape, commit.
```

### Étape 20 : Page du jeu 🧪

**Objectif :** maximiser le **play-through rate**.

```text
Lis CLAUDE.md, README.md et l'étape 20 de ROADMAP.md. Réalise uniquement l'étape 20.
Crée docs/store-page.md :
- 3 propositions de titre (≤ 50 caractères) avec mot-clé en tête,
- description FR + EN (1re ligne = la promesse, puis puces, sans spam de mots-clés),
- 3 briefs d'icône (un sujet unique, gros visage de slime, fond contrasté, lisible en 50 px)
  avec un prompt de génération d'image pour chacun,
- 5 briefs de miniatures (fusion, météo arc-en-ciel, amis à l'autel, Slime Géant, Slimedex),
- plan d'A/B test icône/miniatures dans le Creator Hub,
- réponses visées au questionnaire de maturité (objectif : Minimal) et checklist
  d'éligibilité Roblox Kids/Select (ID vérifié, 2FA, Roblox Plus),
- liste des métriques à suivre chaque semaine dans Creator Analytics : play-through rate,
  rebond 1re partie, jours de jeu et jours de co-play intentionnel par tranche J1 / J2-7 / J8-28,
  jours de dépense.
Coche l'étape, commit.
```

À faire toi-même : générer et choisir les visuels, remplir le Creator Hub, publier en public.

### Étape 21 : Live-ops, routine d'update hebdomadaire 🧪

```text
Lis CLAUDE.md, README.md et l'étape 21 de ROADMAP.md. Réalise uniquement l'étape 21.
Crée docs/live-ops.md et un prompt réutilisable docs/prompts/weekly-update.md qui, à partir
d'un thème ("semaine Halloween", "slimes de l'espace"…), ajoute uniquement par la config :
1 nouvelle espèce ou mutation, 1 météo ou variante, 3 quêtes, 1 récompense de saison,
met à jour le Slimedex, relance tests + simulation, rédige le changelog joueur (FR/EN) et
le texte de l'Événement Roblox à programmer dans le Creator Hub.
Ajoute un calendrier type sur 8 semaines.
Coche l'étape, commit.
```

À partir de là, **une session par semaine** : *« Lis docs/prompts/weekly-update.md, thème : … »*.
