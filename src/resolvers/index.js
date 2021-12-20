const path = require("path");
const { mergeResolvers } = require("@graphql-tools/merge");
const { loadFilesSync } = require("@graphql-tools/load-files");
// const { fileLoader, mergeResolvers } = require('merge-graphql-schemas');

const resolversArray = loadFilesSync(path.join(__dirname), { extensions: [".js"] });

module.exports = mergeResolvers(resolversArray);
