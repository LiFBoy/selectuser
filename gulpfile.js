const gulp = require('gulp');
const babel = require('gulp-babel');
// const typescript = require('gulp-typescript');
// const alias = require('@gulp-plugin/alias');
// const { config } = typescript.createProject('tsconfig.json');
// console.log(config, 'config');
const paths = {
  dest: {
    lib: 'lib',
    esm: 'esm',
    dist: 'dist',
  },
  styles: 'src/**/*.less',
  svg: 'src/**/*.svg',
  scripts: ['src/**/*.{ts,tsx}', '!src/**/interface.ts'],
};

/**
 * 编译脚本文件
 */
function compile() {
  return (
    gulp
      .src(paths.scripts)
      // .pipe(alias(config))
      .pipe(babel()) // 使用gulp-babel处理
      .pipe(gulp.dest(paths.dest.lib))
      .pipe(gulp.dest(paths.dest.esm))
  );
}

/**
 * 复制样式
 */
function copyLess() {
  return gulp
    .src(paths.styles)
    .pipe(gulp.dest(paths.dest.lib))
    .pipe(gulp.dest(paths.dest.esm));
}

function copySvg() {
  return gulp
    .src(paths.svg)
    .pipe(gulp.dest(paths.dest.lib))
    .pipe(gulp.dest(paths.dest.esm));
}

function stylelint() {
  const gulpStylelint = require('gulp-stylelint');
  return gulp.src(['src/**/*.css', 'src/**/*.less', 'src/**/*.scss']).pipe(
    gulpStylelint({
      fix: true,
      reporters: [{ formatter: 'string', console: true }],
    })
  );
}

function eslint() {
  const eslint = require('gulp-eslint');
  return (
    gulp
      .src(paths.scripts)
      // eslint() attaches the lint output to the "eslint" property
      // of the file object so it can be used by other modules.
      .pipe(eslint({ fix: true }))
      // eslint.format() outputs the lint results to the console.
      // Alternatively use eslint.formatEach() (see Docs).
      .pipe(eslint.format())
      // To have the process exit with an error code (1) on
      // lint error, return the stream and pipe to failAfterError last.
      .pipe(eslint.failAfterError())
  );
}

const build = gulp.series(compile, copyLess, copySvg);
exports.build = build;
exports.eslint = eslint;
exports.stylelint = stylelint;
exports.default = build;
