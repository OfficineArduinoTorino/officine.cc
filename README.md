# APPUNTI DI BOB

```
gem install jekyll
gem install sass
npm install --global gulp-cli
npm install
gulp
```

Il comando `sass` serve a "compilare" i files scss in css, ed applicare le
modifiche che vengono apportate.

Eseguendo il comando `gulp` l'intero sito viene ricompilato (SCSS e Jekyll) e
servito localmente su http://localhost:3000/ .

## Blog

I soliti blog posts di Jekyll, salvati come files individuali in _posts/
seguendo per il filename la convenzione YYYY-MM-DD-title.markdown

È possibile esplicitare un parametro "author": se corrisponde al nome di un
membro del team verranno importati i suoi metadati (nome, avatar, links
social...), altrimenti si può riprendere la stessa struttura e definire un
author manualmente (e.g. in caso di un ospite temporaneo)

Se nessun blog post esiste, l'intera sezione "blog" viene disabilitata.

## Projects

Ogni progetto è definito in un file nella cartella _projects/, che contiene i
suoi metadati ed il contenuto della relativa pagina.

Se nessun progeto esiste, l'intera sezione "projects" viene disabilitata.

```
=================================================
=====     jekyll-gulp-sass-browser-sync     =====
=================================================
```
A project including full setup for Jekyll, GulpJS, SASS, AutoPrefixer &amp; BrowserSync

## System Preparation

To use this project, you'll need the following things installed on your machine.

1. [Jekyll](http://jekyllrb.com/) - `$ gem install jekyll`
2. [NodeJS](http://nodejs.org) - use the installer.
3. [GulpJS](https://github.com/gulpjs/gulp) - `$ npm install -g gulp` (mac users may need sudo)

## Local Installation

1. Inside the directory, run `npm install`.
2. Enjoy

## Usage

**development mode**

This will give you file watching, browser synchronisation, auto-rebuild, CSS injecting etc etc.

```shell
$ gulp
```

**jekyll**

As this is just a Jekyll project, you can use any of the commands listed in their [docs](http://jekyllrb.com/docs/usage/)

## Deploy with Gulp

You can easily deploy your site build to a gh-pages branch. First, follow the instructions at [gulp-gh-pages](https://github.com/rowoot/gulp-gh-pages) to get your branch prepared for the deployment and to install the module. Then, in `gulpfile.js` you'll want to include something like the code below. `gulp.src()` needs to be the path to your final site folder, which by default will be `_site`. If you change the `destination` in your `_config.yml` file, be sure to reflect that in your gulpfile.



```javascript
var deploy = require("gulp-gh-pages");

gulp.task("deploy", ["jekyll-build"], function () {
    return gulp.src("./_site/**/*")
        .pipe(deploy());
});
```
