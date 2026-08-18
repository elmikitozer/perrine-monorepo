# Sources de la charte PV Studio

Fichiers sources et déclinaisons non utilisées par le site. Ils sont versionnés ici
volontairement **hors de `public/`** : tout ce qui se trouve dans `public/` est servi
tel quel par Next.js et donc téléchargeable publiquement, ce qui n'a aucun intérêt
pour des `.ai` / `.pdf` de plusieurs mégaoctets.

Seules les images réellement affichées vivent dans `public/images/` :

| Fichier                                       | Usage                          |
| --------------------------------------------- | ------------------------------ |
| `logo/logotype_A_clear_borders.png`           | logotype de la barre de nav    |
| `logo/logotype-a.png`                         | image de partage par défaut    |
| `monogramme/monogramme_clear.png`             | splash d'ouverture             |
| `monogramme/monogramme_dégradé_clear.png`     | splash d'ouverture             |
| `monogramme/monogramme-noir.png`              | pied de page                   |
| `motifs/web/vuittonage-rose.jpg`              | voile de survol des vignettes  |

Le motif web est une version allégée (700 px, ~120 Ko) de `motifs/jpg/vuittonage_rose.jpg`
(3509 px, 2,1 Mo). Pour la régénérer :

```sh
sips -Z 700 -s format jpeg -s formatOptions 58 \
  brand-assets/motifs/jpg/vuittonage_rose.jpg \
  --out public/images/motifs/web/vuittonage-rose.jpg
```
