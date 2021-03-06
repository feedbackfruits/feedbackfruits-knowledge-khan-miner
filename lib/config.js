"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').load({ silent: true });
const { NAME = 'khan-academy', KAFKA_ADDRESS = 'tcp://localhost:9092', OUTPUT_TOPIC = 'update_requests', } = process.env;
exports.NAME = NAME;
exports.KAFKA_ADDRESS = KAFKA_ADDRESS;
exports.OUTPUT_TOPIC = OUTPUT_TOPIC;
const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 100;
exports.CONCURRENCY = CONCURRENCY;
