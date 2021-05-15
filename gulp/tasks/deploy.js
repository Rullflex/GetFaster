const gulp = require('gulp')
const rsync  = require('gulp-rsync');

module.exports = function deploy(hostname, username, destination) {
	// Деплой на серв через PowerShell от имени Админа --> bash --> gulp deploy
	return gulp.src('build/**')
		.pipe(rsync({
			root: 'build/',
			hostname,
			username,
			destination,
			// include: ['*.htaccess'], // Includes files to deploy
			// exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
			// recursive: true,
			archive: true,
			silent: false,
			compress: true
		}));
	
}



