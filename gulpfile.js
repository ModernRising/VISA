let project_folder = "dist";
let source_folder = "app";

let path = {
    build:{
        html:project_folder+"/",
        css: project_folder+"/css/",
        js: project_folder+"/js/",
        img: project_folder+"/img/",
        icons: project_folder+"/icons/",
        fonts: project_folder+"/fonts/",

    },
    src:{
        html:[source_folder+"/*.html", "!"+source_folder+"/_*.html"],
        css: source_folder+"/scss/style.scss",
        js: source_folder+"/js/*.js",
        img: source_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
        icons: source_folder+"/icons/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder+"/fonts/*.ttf",

    },
    watch:{
        html:source_folder+"/**/*.html",
        css: source_folder+"/scss/**/*.scss",
        js: source_folder+"/js/**/*.js",
        img: source_folder+"/img/**/*.{jpg,png,svg,gif,ico,webp}",
        icons: source_folder+"/icons/**/*.{jpg,png,svg,gif,ico,webp}",


    },
    clean: "./" + project_folder + "/"
};


let {src, dest} = require("gulp"),
    gulp = require("gulp");
    fileinclude = require("gulp-file-include");
    browsersync = require("browser-sync").create();
    del = require("del");
    scss = require("gulp-sass");
    autoprefixer = require("gulp-autoprefixer");
    clean_css = require("gulp-clean-css");
    rename = require("gulp-rename");
    imagemin = require('gulp-imagemin');
    plumber = require('gulp-plumber');
    ttf2woff = require("gulp-ttf2woff");
    ttf2woff2 = require("gulp-ttf2woff2");

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify: false,
    });
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream());
}

function images() {
    return src(path.src.img)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3,
            })
        )
        .pipe(dest(path.build.img))
        .pipe(dest(path.build.icons))
        .pipe(browsersync.stream());
}

function icon() {
    return src(path.src.icons)
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3,
            })
        )
        .pipe(dest(path.build.icons))
        .pipe(browsersync.stream());
}



function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream());
}


function css() {
    return src(path.src.css)
        .pipe(plumber())
        .pipe(
            scss({
                outputStyle: "expanded"
        }))
        .pipe(
            autoprefixer({
                overrideBrowserslist:["last 5 version"],
                cascade:true
            })
        )
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname:".min.css"
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream());
}

/* function fonts () {
    src(path.src.fonts)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));

} */

function fonts() {
    return src(path.src.fonts)
        .pipe(dest(path.build.fonts));
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], { delay: 500 }, css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img, path.watch.icons], images);
    gulp.watch([path.watch.icons], icon);
}

function clean(params) {
    return del(path.clean);
}



let build = gulp.series(clean, gulp.parallel(css, js, images, icon, html, fonts));
let watch = gulp.parallel(build, watchFiles, browserSync);


exports.fonts = fonts;
exports.icon = icon;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;