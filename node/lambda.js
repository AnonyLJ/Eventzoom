'use strict'
// autogenerated by claudia-js
require('dotenv').config()
const awsServerlessExpress = require('aws-serverless-express')
const app = require('./dist/src/appExport')
const binaryMimeTypes = [
	'application/octet-stream',
	'font/eot',
	'font/opentype',
	'font/otf',
	'image/jpeg',
	'image/png',
	'image/svg+xml'
]
const server = awsServerlessExpress.createServer(app, null, binaryMimeTypes);
exports.handler = (event, context) => awsServerlessExpress.proxy(server, event, context)