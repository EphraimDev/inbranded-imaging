const path = require('path');

const validateImage = (file, cb) => {
	const ext = path.extname(file.originalname);
	const extensions = ['.png', '.jpg', '.jpeg', '.gif'];
	if (!extensions.includes(ext)) {
		return cb(new Error('Only images are allowed'));
	}

	cb(null, true);
};

module.exports = {
	validateImage,
};
