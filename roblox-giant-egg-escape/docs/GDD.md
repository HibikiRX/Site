# GDD : Giant Egg Escape

Version 0.1. Tous les chiffres sont des **valeurs de départ**, rangées dans `src/shared/Config`. On les équilibre ensuite avec les données réelles.

## 1. Piliers

1. **Lisible en 5 secondes.** Un verbe (porter), un danger (la lave), une récompense (l'éclosion).
2. **Un temps fort toutes les 4 minutes.** L'éruption crée de la tension, des histoires et des clips.
3. **Le temps réel travaille pour le joueur.** Les éclosions continuent hors ligne, ce qui donne des raisons de revenir.
4. **Les grandes choses se font à plusieurs.** Les œufs géants demandent plusieurs porteurs.
5. **28 jours de rendez-vous.** L'Œuf Ancestral, la saison et l'évènement du samedi.
6. **Payer fait gagner du temps ou du style, jamais la partie.** Aucune loot box payante.
7. **Tout est données.** Ajouter un œuf, une créature ou un évènement revient à éditer `Config`, plus un mesh éventuel.

## 2. Les boucles

| Échelle | Boucle |
|---|---|
| 30 secondes | Courir → ramasser un œuf → revenir (plus lentement s'il est lourd) → incuber → encaisser → améliorer |
| Session (10–20 min) | 3 à 5 éruptions, une zone plus haute à atteindre, un œuf géant toutes les 15 min, des objectifs de quête |
| Jour | Récupérer les éclosions longues et les revenus hors ligne, faire 3 quêtes, entretenir la série, réchauffer l'Œuf Ancestral, regarder le stock du Marchand |
| Semaine | Une nouvelle famille d'œufs chaque samedi, avec la Méga-éruption |
| 28 jours | Une saison de 30 paliers, l'éclosion de l'Œuf Ancestral, l'album à compléter |

## 3. Le monde

L'île volcanique est compacte (≈ 600 × 600 studs). Cinq zones s'étagent de la plage jusqu'au cratère :

| Zone | Distance au nid (studs) | Relief | Œufs |
|---|---|---|---|
| Plage | 0–80 | plat | Commun |
| Jungle | 80–180 | pente douce | Peu commun |
| Falaises de basalte | 180–280 | pente moyenne, passages étroits | Rare |
| Champs de lave | 280–360 | pente forte, chenaux | Épique |
| Cratère | 360–420 | sommet | Légendaire, Mythique (pendant l'alerte), œufs géants |

- Cinq **chenaux de lave** descendent du cratère. La lave s'arrête à la **ligne de refroidissement**, avant la plage.
- Sur la plage, **8 nids** forment un arc (un par joueur). On y trouve aussi la **Porte d'éclosion** centrale, où l'on dépose les œufs géants, et le **Marchand**.
- Un serveur accueille 8 joueurs. **Les serveurs privés sont gratuits.**
- Le style est low-poly et lumineux (parts et matériaux Roblox). La lave est en Neon. L'éclairage utilise Future avec Atmosphere, réglé sur une lumière de fin d'après-midi fixe.
- Budget : moins de 3 000 parts pour la carte, StreamingEnabled activé, aucun gros asset près du point d'apparition.

## 4. Œufs et portage

| Rareté | Zone | Poids | Éclosion | Revenu de base /s | Apparition |
|---|---|---|---|---|---|
| Commun | Plage | 1 | 20 s | 1 | en continu, 12 au maximum |
| Peu commun | Jungle | 2 | 2 min | 4 | 8 au maximum |
| Rare | Falaises | 3 | 8 min | 15 | 6 au maximum |
| Épique | Champs de lave | 5 | 30 min | 60 | 4 au maximum |
| Légendaire | Cratère | 8 | 2 h | 250 | 1 ou 2 par alerte |
| Mythique | Cratère | 12 | 8 h | 1 000 | 10 % de chances par alerte |

- **Le contenu d'un œuf est tiré au moment où il apparaît** (espèce, taille, mutation) et reste stocké sur l'œuf. Ainsi, payer une éclosion instantanée ne revient jamais à acheter du hasard.
- **Ramassage** : par ProximityPrompt (« E » au clavier, un tap sur mobile). On porte un œuf à la fois, au-dessus de la tête, bras levés (pose procédurale, sans animation importée).
- **Vitesse en portant** : `v = WalkSpeed × clamp(Force / Poids, 0.3, 1)`. La force de départ vaut 3.
- **Lâcher** : par un bouton sur mobile, par une touche ailleurs. Un œuf lâché reste 60 s au sol, puis retourne dans sa zone.
- Les œufs **Dorés** et **Arc-en-ciel** scintillent, ce qui déclenche des courses entre joueurs.
- **Le serveur valide tout** : distance de ramassage, un seul œuf à la fois, délai entre deux actions, vitesse plausible.

## 5. L'éruption

Le cycle dure 240 s et se cale sur l'horloge, donc il est identique sur tous les serveurs.

| Phase | Durée | Ce qui se passe |
|---|---|---|
| Calme | 3:00 | Les œufs apparaissent normalement. |
| Alerte | 0:30 | Grondement et fumée. Des fissures lumineuses marquent les **2 chenaux** qui vont couler. Des œufs Légendaires, parfois un Mythique, apparaissent au cratère. |
| Éruption | 0:20 | La lave descend les 2 chenaux actifs. |
| Refroidissement | 0:10 | La lave devient de l'obsidienne sur laquelle on peut marcher. Les œufs tombés dedans deviennent **Molten** ; le premier qui passe les prend. |

- La phase se calcule ainsi : `phase = f(temps serveur mod 240)`. Côté client, le compte à rebours utilise `workspace:GetServerTimeNow()`.
- Les 2 chenaux actifs sont tirés par un générateur aléatoire dont la graine est le numéro du cycle. L'alerte les montre 30 s à l'avance, donc les joueurs ne peuvent pas apprendre l'ordre par cœur.
- **Toucher la lave** fait lâcher son œuf, projette le joueur de façon comique et le ramène à son nid. Il n'y a pas d'écran de mort, et on ne perd rien d'autre que l'œuf porté.
- La détection se fait côté serveur, par requêtes spatiales (`GetPartBoundsInBox`) toutes les 0,1 s, et pas avec `Touched`.

## 6. Créatures

On lance avec **18 espèces** (3 par rareté), puis on en ajoute 3 chaque semaine.

| Rareté | Espèces (noms de travail) |
|---|---|
| Commun | Pebblin, Shellbo, Crabbit |
| Peu commun | Mossy, Vinelet, Bananuk |
| Rare | Basalto, Cliffowl, Gustling |
| Épique | Emberpup, Magmole, Scorchick |
| Légendaire | Pyrodon, Ashwing, Cindra |
| Mythique | Volcanox, Obsidrake, Solaris |

- **Variantes**, cumulables :
  - Taille : de XS (×0,8) à XL (×1,5). La taille Géant (×4) est réservée aux œufs géants.
  - Mutations : **Molten** ×2 (passage dans la lave), **Dorée** ×3 (1 chance sur 40), **Arc-en-ciel** ×10 (1 chance sur 400).
- **Revenu** = base de la rareté × taille × mutations × bonus (passes, compagnons).
- Les créatures vivent dans l'**enclos** du nid (6 places au départ). Elles sautillent et versent leurs pièces dans un **collecteur** ; on encaisse en marchant dessus.
- **Compagnons** : on peut équiper 3 créatures. Elles suivent le joueur et apportent le bonus de leur espèce : vitesse en %, force, chance en %, temps d'éclosion réduit en % ou pièces en %.
- **Rendu**
  - V1 : créatures procédurales. Un corps sphérique avec des yeux, plus des oreilles, cornes ou ailes en primitives, une palette par espèce et un rebond en tween.
  - V2 : meshes générés par le MCP de Studio (`generate_mesh`) et chargés par leur ID. Si le chargement échoue, on revient au rendu procédural.
- **Éclosion** : l'œuf tremble, se fissure, puis un flash à la couleur de la rareté s'accompagne d'un son. Les raretés Épique et supérieures sont annoncées sur le serveur, et les Mythiques sur tous les serveurs via MessagingService.

## 7. Œufs géants, le cœur social

| Taille | Poids | Porteurs pour aller à vitesse normale | Éclosion | Contenu |
|---|---|---|---|---|
| L | 20 | 2 | 1 h | Épique, taille Géant |
| XL | 40 | 3 | 4 h | Légendaire, taille Géant |
| Titan | 80 | 4 | 12 h | Mythique, taille Géant |

- Toutes les 15 min, un œuf géant tombe au cratère comme une météorite, avec une annonce : « Un œuf TITAN est tombé ! Il faut 4 porteurs ».
- **L'œuf a 4 poignées.** Il se déplace vers la position moyenne de ses porteurs, à une vitesse de `min(WalkSpeed des porteurs) × clamp(ΣForce / Poids, 0.15, 1)`. C'est le serveur qui pilote l'œuf (le serveur en est propriétaire réseau). Un porteur qui s'éloigne à plus de 8 studs lâche sa poignée.
- **On peut le porter seul**, mais c'est très lent. C'est comique, et risqué quand l'éruption arrive.
- Au dépôt à la **Porte d'éclosion**, **chaque porteur reçoit un exemplaire** dans son inventaire d'œufs.
- **Bonus amis** : chaque ami présent sur le serveur donne +10 % de chance, jusqu'à +30 %.
- **Invitation au bon moment** : quand un joueur saisit seul un œuf géant, on affiche « Trop lourd ! Invite un ami » (`SocialService`). Un panneau « Amis en ligne » permet de rejoindre le serveur d'un ami.

## 8. Progression et économie

| Amélioration | Effet | Coût au niveau n | Plafond |
|---|---|---|---|
| Vitesse | +1 WalkSpeed (base 16) | 25 × 1,35ⁿ | 30 niveaux |
| Force | +1 (base 3) | 40 × 1,4ⁿ | 40 niveaux |
| Incubateur | +1 emplacement (2 au départ) | 150, puis 600, 2 500, 10 000, 40 000, 160 000 | 8 (+2 avec le pass) |
| Enclos | +2 places (6 au départ) | 100 × 2,2ⁿ | 20 places |
| Plafond hors ligne | +1 h (8 h au départ) | 500 × 3ⁿ | 16 h |

- **Une seule monnaie**, les Pièces, qui n'est **jamais vendue contre des Robux**.
- On gagne des pièces avec les créatures, les quêtes, la série et la saison. On les dépense en améliorations et chez le Marchand.
- **Repères d'équilibrage** pour un nouveau joueur :
  - première amélioration avant 60 s ;
  - premier œuf Épique après 30 à 45 min de jeu cumulé ;
  - premier Légendaire entre le 2e et le 3e jour.

## 9. Rétention

- **Quêtes quotidiennes**. On en tire 3 chaque jour, avec une remise à zéro à 00:00 UTC. Exemples :
  - « Ramène 15 œufs » ;
  - « Survis à 2 éruptions en portant un œuf » ;
  - « Porte un œuf géant avec quelqu'un ».
- **Série** sur 7 jours, avec une récompense croissante ; le 7e jour donne un œuf Épique. Un jour manqué fait **reculer d'un cran** au lieu de remettre la série à zéro.
- **Marchand** « Old Shelly » (une tortue) :
  - il vend 4 œufs contre des pièces ;
  - son stock change toutes les 10 min ;
  - le stock est tiré à partir d'une graine liée à l'heure, donc il est identique sur tous les serveurs et la communauté en parle ;
  - les probabilités sont affichées.
- **Œuf Ancestral**
  - On le reçoit après la 3e éclosion.
  - Il se réchauffe **une fois par jour où l'on joue au moins 5 min**.
  - Il se fissure aux jours 7, 14 et 21, avec une petite récompense à chaque fois.
  - Il **éclot au 28e réchauffement** et donne un Mythique exclusif à la saison.
  - Il est calé sur la fenêtre J8–28 de l'algorithme.
- **Saison de 28 jours** (« Expédition »)
  - 30 paliers.
  - L'XP vient des œufs ramenés, des quêtes et des éruptions survécues.
  - Une piste gratuite et une piste premium : cosmétiques, compagnon exclusif, apparence de nid.
- **Chaque samedi** : une mise à jour (une nouvelle famille d'œufs et 3 créatures) et une **Méga-éruption** à heure fixe (16:00 UTC, à ajuster selon l'audience). Pendant 10 min, les éruptions ont lieu toutes les 60 s, un Légendaire est garanti au cratère et les chances de Molten sont triplées.
- **Notifications d'expérience** (13 ans et plus, sur accord du joueur)
  - On les propose quand le joueur incube un œuf de 2 h ou plus : « Préviens-moi quand il éclot ».
  - Elles rappellent aussi la Méga-éruption.
  - Une notification par jour et par joueur au maximum.

## 10. Social et croissance

- Les œufs géants et le bonus amis (voir §7) en sont le cœur.
- **Un œuf lâché pendant une éruption peut être pris par n'importe qui**, ce qui crée une rivalité amicale. En revanche, **il n'y a pas de raid de base** : les nouveaux joueurs sont protégés.
- Les éclosions rares sont annoncées au serveur : c'est une preuve sociale qui donne envie.
- **Friend Referral System** : le parrain et le filleul reçoivent le compagnon exclusif « Buddy ». Le parrain se lit dans `GetJoinData().ReferredByPlayerId`. La fonction est disponible après un jour en ligne.
- **Share Link API** : un bouton « Partager mon éclosion » crée un lien profond.
- **Échanges**, après le lancement :
  - une interface sécurisée avec double confirmation ;
  - chaque échange est enregistré dans un journal ;
  - on respecte `PolicyService` (`IsPaidItemTradingAllowed`).
- Le design prévoit dès le départ des moments à filmer : fuir la lave, porter un Titan à quatre, une éclosion mythique, des « recettes » secrètes (certaines mutations n'existent que pendant la Méga-éruption).

## 11. Monétisation

| Type | Article | Prix indicatif |
|---|---|---|
| Pass | Encaissement automatique | 149 R$ |
| Pass | +2 incubateurs | 199 R$ |
| Pass | Gants de Titan (+50 % de force) | 249 R$ |
| Pass | VIP (nid doré, tag, emote) | 299 R$ |
| Produit | Éclosion instantanée (prix selon le temps restant) | 19 à 199 R$ |
| Produit | Totem de chance pour tout le serveur (15 min, annoncé, profite à tous) | 79 R$ |
| Produit | Pack de départ (une seule fois, proposé après le premier Épique) | 99 R$ |
| Produit | Saison premium | 399 R$ |

Règles :
- **On ne vend pas de pièces et pas d'œuf aléatoire contre des Robux.** Le jeu reste ainsi hors du champ des *paid random items*. On affiche quand même toutes les probabilités, avec et sans boost.
- **`PolicyService`** :
  - si `ArePaidRandomItemsRestricted` est vrai, on masque le totem de chance ;
  - si `IsPaidItemTradingAllowed` est faux, les objets issus d'un achat ne sont pas échangeables.
- **Une offre arrive au bon moment, une seule fois** : l'éclosion instantanée quand le joueur incube un œuf long, le pack de départ après son premier Épique. Pas de fenêtre qui revient en boucle.
- **`ProcessReceipt` est idempotent.** Le PurchaseId est enregistré dans le profil, et l'achat n'est accordé qu'une fois le profil sauvegardé.
- Les **publicités vidéo récompensées** viendront quand le jeu sera éligible (seuil d'audience).

## 12. Les 3 premières minutes, contre le bounce

| Moment | Ce qui se passe | Étape du funnel |
|---|---|---|
| 0–5 s | Le joueur apparaît au nid. Un œuf Commun brille à 15 studs, une flèche le montre. | 1 Spawn |
| 5–15 s | Il ramasse l'œuf. | 2 FirstPickup |
| 15–20 s | Il le dépose dans l'incubateur. L'œuf tutoriel éclot en 5 s et donne à coup sûr un Peu commun. | 3 FirstIncubate, 4 FirstHatch |
| 20–40 s | Il encaisse ses pièces. Le bouton « Améliorer » se met à pulser. | 5 FirstCollect |
| 40–60 s | Il achète sa première amélioration de vitesse. | 6 FirstUpgrade |
| 1–2 min | La quête « Ramène 3 œufs » s'affiche, avec le compte à rebours de l'éruption. | 7 ThreeEggs |
| 2–3 min | Il rapporte son premier œuf de la Jungle et reçoit un 2e incubateur. | 8 FirstJungleEgg |
| 3–6 min | Il vit sa première éruption. L'Œuf Ancestral lui est présenté après la 3e éclosion. | 9 FirstEruption |
| 10 min | La session devient « qualifiée ». | 10 TenMinutes |

- Pas d'écran titre, pas de menu bloquant, un chargement minimal.
- Sur mobile, trois gros boutons : Lâcher, Boutique, Album.

## 13. Direction artistique et audio

- Low-poly coloré aux contours lisibles, avec une palette par zone : sable, vert, gris basalte, noir et orange, rouge.
- La lave est en Neon orange avec des étincelles. La fumée et des cendres signalent l'alerte.
- **Sons** : grondement, alarme douce, « pop » d'éclosion propre à chaque rareté. La musique est calme, puis monte pendant l'alerte. Les sons viennent du Creator Store via `search_asset`.
- **Icône et vignettes** : on part de **vraies captures** (`screen_capture`), puis on les retouche. Elles ne doivent jamais tromper le joueur, sinon il repart aussitôt et le bounce s'envole.
- **Vignette principale** : 4 avatars portent un œuf Titan doré devant une coulée de lave, le volcan en éruption derrière eux, avec un texte court comme « GIANT EGGS! ».

## 14. Live ops et diagnostic

- **Rythme** :
  - chaque samedi, une mise à jour de contenu et la Méga-éruption ;
  - tous les 28 jours, une nouvelle saison et un nouvel Œuf Ancestral.
- **Grille de diagnostic**. Les chiffres se trouvent dans Creator Analytics, sous Acquisition → Home Recommendations et sous Retention.

| Symptôme | Cause probable | Action |
|---|---|---|
| Play-through rate faible | Icône ou vignettes peu claires, titre flou | Nouvelles vignettes (garder 2 à 5 actives), montrer l'œuf géant et la lave, essayer un autre titre |
| Bounce < 60 s élevé | Chargement long, apparition confuse, vignette trompeuse | Alléger la zone d'apparition, montrer l'œuf et la flèche tout de suite, rapprocher la vignette de la réalité |
| Bounce 61–180 s élevé | La première récompense arrive trop tard | Première éclosion en moins de 20 s, première amélioration en moins de 60 s, éruption annoncée plus tôt |
| J1 faible | Rien ne pousse à revenir le lendemain | Un œuf long déjà en cours au départ, proposition de notifications, Œuf Ancestral bien visible, aperçu des revenus hors ligne |
| J2–7 faible | Routine quotidienne pauvre | Quêtes plus variées, Marchand plus excitant, objectifs par zone |
| J8–28 faible | Manque de profondeur | Contenu du samedi, saison plus généreuse, mutations et album, échanges |
| Co-play faible | Coopérer ne rapporte pas assez | Œufs géants plus fréquents ou plus rentables, bonus amis, invitations au bon moment |
| Jours avec achat faibles | Offres mal placées ou peu utiles | Offres au bon moment, pack de départ, revoir les prix |
| Temps de jeu faible malgré un J1 correct | Sessions creuses | Plus d'objectifs intermédiaires, évènements plus fréquents |

## 15. Instrumentation (AnalyticsService)

- **Funnel d'onboarding** : les 10 étapes du §12, via `LogOnboardingFunnelStepEvent`.
- **Économie** : chaque source et chaque dépense, via `LogEconomyEvent`.
- **Progression** : zone la plus haute atteinte, rareté la plus haute éclose, via `LogProgressionEvent`.
- **Évènements personnalisés** :
  - `eruption_hit` (rareté de l'œuf perdu), `molten_claimed` ;
  - `giant_delivered` (nombre de porteurs, nombre d'amis parmi eux) ;
  - `invite_prompt_shown` / `invite_sent` ;
  - `notif_optin_shown` / `notif_optin_accepted` ;
  - `offer_shown` / `offer_purchased` (par article).
- Toute nouvelle fonctionnalité arrive avec ses évènements. Sans eux, on ne peut pas l'évaluer.
