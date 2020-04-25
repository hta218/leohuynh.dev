'use strict';

require('./src/assets/scss/init.scss');
require('./static/css/prismjs/theme.min.css');
require('./static/css/imageLightbox.css');
const handleImageLightbox = require('./static/js/imageLightbox.js');
exports.onRouteUpdate = handleImageLightbox
