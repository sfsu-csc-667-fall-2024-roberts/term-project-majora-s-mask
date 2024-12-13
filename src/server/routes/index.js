"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.games = exports.mainLobby = exports.home = exports.auth = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "auth", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var home_1 = require("./home");
Object.defineProperty(exports, "home", { enumerable: true, get: function () { return __importDefault(home_1).default; } });
var main_lobby_1 = require("./main-lobby");
Object.defineProperty(exports, "mainLobby", { enumerable: true, get: function () { return __importDefault(main_lobby_1).default; } });
var games_1 = require("./games");
Object.defineProperty(exports, "games", { enumerable: true, get: function () { return __importDefault(games_1).default; } });
