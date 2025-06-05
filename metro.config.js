// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Bạn có thể thêm các tùy chỉnh nếu cần ở đây
// Ví dụ:
// config.resolver.assetExts.push('cjs');

module.exports = config;