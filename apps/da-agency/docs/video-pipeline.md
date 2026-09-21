# Chaîne vidéo automatique

La cliente envoie un film dans le studio (onglet « Film »), ou change « Début
de la boucle », et publie. Quelques minutes plus tard le site est à jour, sans
intervention.

```
Studio : publication d'un projet (videoMaster ou loopStart modifié)
  └─ webhook Sanity « video-pipeline »        ← à créer, § 2
       └─ API GitHub repository_dispatch      ← jeton à créer, § 1
            └─ .github/workflows/video-pipeline.yml
                 ├─ scripts/transcode-video.mjs   version de lecture H.264 1080p
                 └─ scripts/extract-loops.mjs     boucle de 8 s + poster
                      └─ écrit videoProxy, videoLoop, videoPoster dans Sanity
                           └─ webhook Sanity « sanity-publish » → Vercel (existant, inchangé)
                                └─ rebuild du site
```

Le webhook publish → Vercel existant n'est pas touché. Il se déclenche deux
fois par cycle : à la publication de la cliente (le site est reconstruit avec
les anciens dérivés, sans effet visible), puis quand l'Action écrit les
nouveaux.

Pas de boucle possible : le webhook vidéo ne réagit qu'à `videoMaster` et
`loopStart`, et l'Action n'écrit que les champs de l'onglet « Technique ».

## Ce qui est déjà en place

- Le workflow `.github/workflows/video-pipeline.yml`, sur `main` (GitHub
  n'exécute `repository_dispatch` que depuis la branche par défaut). Il extrait
  le code de `direction-artistique` : si le site change de branche, changer
  `CODE_REF` dans le workflow.
- Les quatre secrets du dépôt, copiés de `.env.local` : `SANITY_API_WRITE_TOKEN`,
  `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`,
  `NEXT_PUBLIC_SANITY_API_VERSION`.

## À créer à la main

### 1. Jeton GitHub

Le webhook Sanity s'authentifie auprès de GitHub avec un jeton personnel. Il
ne sert qu'à appeler `repository_dispatch`.

GitHub → Settings → Developer settings → Personal access tokens.

- **Recommandé, « Fine-grained token »** : Repository access → Only select
  repositories → `elmikitozer/perrine-monorepo`. Permissions → Repository →
  **Contents : Read and write**, rien d'autre (c'est la permission qu'exige
  l'endpoint dispatches). Le jeton ne voit que ce dépôt.
- **Ou « Token (classic) »** : scope **`repo`**, rien d'autre. Plus simple,
  mais il ouvre tous les dépôts du compte.

Nom : `sanity-video-pipeline`. Expiration : un an au plus, GitHub prévient par
mail avant l'échéance. **Un jeton expiré arrête la chaîne sans bruit** : le
film est publié, rien ne se passe. Le symptôme se lit dans le journal du
webhook (§ Dépannage).

Le jeton n'est saisi qu'à un endroit, le webhook ci-dessous. Il ne va ni dans
le dépôt ni dans les secrets GitHub.

### 2. Webhook Sanity

sanity.io/manage → projet `kytkrshh` → API → Webhooks → Create webhook.

| Champ | Valeur |
| --- | --- |
| Name | `video-pipeline` |
| URL | `https://api.github.com/repos/elmikitozer/perrine-monorepo/dispatches` |
| Dataset | `production` |
| Trigger on | **Create** et **Update** (pas Delete) |
| Filter | voir ci-dessous |
| Projection | voir ci-dessous |
| Status | Enabled |
| HTTP method | `POST` |
| API version | `v2021-03-25` ou plus récent (nécessaire à `delta::`) |
| Drafts | **décoché** : seules les publications comptent |
| Versions | décoché |
| Secret | vide (GitHub ne le lit pas, c'est le jeton qui authentifie) |

Filter :

```groq
_type == "project" && (delta::changedAny(videoMaster) || delta::changedAny(loopStart))
```

« Create » couvre le cas d'un projet créé et publié d'emblée avec son film.

Projection — c'est le corps exact que GitHub attend, `event_type` doit valoir
`video-pipeline` :

```groq
{
  "event_type": "video-pipeline",
  "client_payload": {
    "documentId": _id,
    "title": title
  }
}
```

`client_payload` n'est qu'informatif (il apparaît dans le run) : les scripts
passent tous les projets en revue et ne refont que ce qui a changé.

HTTP headers :

| Nom | Valeur |
| --- | --- |
| `Authorization` | `Bearer <le jeton du § 1>` |
| `Accept` | `application/vnd.github+json` |
| `X-GitHub-Api-Version` | `2022-11-28` |

GitHub répond `204 No Content` quand l'appel est accepté.

## Vérifier

1. Studio → un projet avec film → « Début de la boucle » : changer la valeur,
   publier.
2. GitHub → Actions → `video-pipeline` : un run démarre dans les secondes qui
   suivent. Le journal de l'étape « Boucle et poster » montre le projet refait
   et les autres « à jour, on saute ».
3. Vercel : un déploiement `sanity-publish` part à la fin du run.
4. Le site : la tuile d'accueil démarre au nouveau timecode.

Ordres de grandeur : changement de `loopStart`, 2 à 4 minutes de bout en bout
(téléchargement du master, 8 s d'extraction, rebuild). Nouveau film, 10 à 20
minutes selon sa durée, le transcodage 1080p domine.

Sans passer par Sanity, pour tester le workflow seul :

```sh
gh workflow run video-pipeline                      # tout, ne refait que le nécessaire
gh workflow run video-pipeline -f only=villa-dior   # un projet
gh workflow run video-pipeline -f force=true        # tout refaire
```

Un run à vide sort en moins d'une minute, installation comprise : les deux
scripts décident sur le document Sanity seul, avant tout téléchargement.

## Dépannage

- **Publication faite, aucun run** : sanity.io/manage → Webhooks →
  `video-pipeline` → Attempts. `401` = jeton expiré ou mal collé ; `404` =
  jeton sans accès au dépôt, ou URL fausse ; `422` = projection modifiée,
  `event_type` manquant. Aucune tentative = le filtre n'a pas vu de changement
  (brouillon non publié, ou ni le film ni le timecode n'ont changé).
- **Run en échec, « loopStart … trop tard »** : le timecode saisi laisse moins
  de 8 s avant la fin du film. Corriger dans le studio et republier.
- **Run vert, site inchangé** : regarder Vercel. C'est le webhook
  `sanity-publish` existant qui reconstruit, pas cette chaîne.
- **En dernier recours**, la chaîne tourne toujours à la main depuis
  `apps/da-agency` : `pnpm media`.

## Limites connues

- Le dépôt est public : les journaux des runs aussi. Ils ne contiennent que
  des titres de projet et des mesures techniques ; les secrets sont masqués.
- Un master remplacé laisse l'ancien proxy et l'ancienne boucle orphelins dans
  les assets Sanity. Sans conséquence sur le site ; à nettoyer si le quota
  d'assets devient un sujet.
- Deux publications rapprochées : le second run attend la fin du premier
  (`concurrency`), rien n'est perdu.
