const app = require('express');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const sharp = require('sharp');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const { validateImage } = require('./utils');
// import image from './image';

dotenv.config();
sharp.cache(false);
const router = app.Router();

router.post('/upload', async (req, res) => {
	try {
		// console.log(req.body)
		// return;
		const { resize, rotate, width, height } = req.query;
		const time = new Date().getTime();
		const storage = multer.diskStorage({
			destination: (_req, file, cb) => {
				cb(null, './files/images');
			},
			filename: (_req, file, cb) => {
				cb(null, time + file.fieldname + path.extname(file.originalname));
			},
		});

		const upload = multer({
			storage: storage,
			fileFilter: function(_req, file, cb) {
				validateImage(file, cb);
			},
		});

		const imageUpload = await upload.single('image');
		imageUpload(req, res, async function(err) {
			if (req.file) {
				const crop = req.query.crop ? req.query.crop : 'cover';

				if (resize == true && rotate) {
					let buffer = await sharp(req.file.path)
						.resize(parseInt(width), parseInt(height), {
							fit: crop,
						})
						.rotate(parseInt(rotate))
						.toBuffer();
					sharp(buffer).toFile(req.file.path);
				} else if (resize == true && !rotate) {
					let buffer = await sharp(req.file.path)
						.resize(parseInt(width), parseInt(height), {
							fit: crop,
						})
						.toBuffer();
					sharp(buffer).toFile(req.file.path);
				} else if (resize != true && rotate) {
					let buffer = await sharp(req.file.path)
						.rotate(parseInt(rotate))
						.toBuffer();
					sharp(buffer).toFile(req.file.path);
				}

				return res.status(200).json({
					status: 'success',
					message: 'File uploaded successfully',
					image: {
						id: req.file.filename,
						url: process.env.URL + '/images/' + req.file.filename,
					},
				});
			} else {
				return res.status(400).json({
					status: 'failed',
					message: err.message,
				});
			}
		});
	} catch (error) {
		return res.status(400).json({
			message: error.message,
			status: 'failed',
		});
	}
});

router.post('/export', async (req, res) => {
	try {
		const { type, file } = req.body;

		if (!['png', 'jpeg', 'jpg', 'pdf'].includes(type)) {
			return res.status(400).json({
				status: 'failed',
				message: 'Incorrect export type',
			});
		}

		if (!file) {
			return res.status(400).json({
				status: 'failed',
				message: 'Image is required',
			});
		}

		fs.stat('files/images/' + file, async function(err, _stat) {
			if (err) {
				return res.status(400).json({
					status: 'failed',
					message: 'file does not exist',
				});
			} else {
				if (type == 'pdf') {
					const doc = new PDFDocument();

					const filename = new Date().getTime() + 'pdf.pdf';
					doc.pipe(fs.createWriteStream('files/pdf/' + filename));

					doc.image('files/images/' + file, {
						fit: [250, 300],
						align: 'center',
						valign: 'center',
                    });

                    doc.end()
                    
                    return res.json({
						status: 'success',
						exported_file: {
							id: filename,
                            url: process.env.URL + '/pdf/' + filename,
						},
						original_file: {
							id: file,
                            url: type == 'pdf' ? process.env.URL + '/pdf/' + file : process.env.URL + '/images/' + file,
						},
					});
				} else {
					const filename = new Date().getTime() + 'image.' + type;
					const buffer = await sharp('files/images/' + file)
						.toFormat(type)
						.toBuffer();
					sharp(buffer).toFile('files/images/' + filename);
					
					return res.json({
						status: 'success',
						exported_file: {
                            id: filename,
                            url: process.env.URL + '/images/' + filename,
						},
						original_file: {
							id: file,
                            url: process.env.URL + '/images/' + file,
						},
					});
				}
			}
		});
		// return res.json(req.body);
	} catch (error) {
		return res.status(400).json({
			status: 'failed',
			message: error.message,
		});
	}
});

module.exports = router;
