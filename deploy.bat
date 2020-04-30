#!/usr/bin/env sh


# build
vue-cli-service build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m 'deploy'


git push -f https://github.com/COVID-19-Modelling/EpiSkylines.git master:gh-pages

