/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./Code/Pages/App/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./Code/Pages/App/index.tsx":
/*!**********************************!*\
  !*** ./Code/Pages/App/index.tsx ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, exports) {

eval("throw new Error(\"Module build failed (from ./node_modules/babel-loader/lib/index.js):\\nSyntaxError: /Users/mac/Documents/Compiler/Code/Pages/App/index.tsx: Unexpected token (30:3)\\n\\n\\u001b[0m \\u001b[90m 28 | \\u001b[39m        \\u001b[36msuper\\u001b[39m (props)\\u001b[0m\\n\\u001b[0m \\u001b[90m 29 | \\u001b[39m\\u001b[0m\\n\\u001b[0m\\u001b[31m\\u001b[1m>\\u001b[22m\\u001b[39m\\u001b[90m 30 | \\u001b[39m\\u001b[33m<<\\u001b[39m\\u001b[33m<<\\u001b[39m\\u001b[33m<<\\u001b[39m\\u001b[33m<\\u001b[39m \\u001b[33mHEAD\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m    | \\u001b[39m   \\u001b[31m\\u001b[1m^\\u001b[22m\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 31 | \\u001b[39m\\u001b[33m===\\u001b[39m\\u001b[33m===\\u001b[39m\\u001b[33m=\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 32 | \\u001b[39m        \\u001b[36mconst\\u001b[39m plusSign \\u001b[33m=\\u001b[39m \\u001b[33mFiniteStateAutomata\\u001b[39m\\u001b[33m.\\u001b[39mbasicFSA(\\u001b[32m'+'\\u001b[39m)\\u001b[33m;\\u001b[39m\\u001b[0m\\n\\u001b[0m \\u001b[90m 33 | \\u001b[39m        plusSign\\u001b[33m.\\u001b[39msetName(\\u001b[32m\\\"Plus sign\\\"\\u001b[39m)\\u001b[33m;\\u001b[39m\\u001b[0m\\n    at _class.raise (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:3939:15)\\n    at _class.unexpected (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:5248:16)\\n    at _class.jsxParseIdentifier (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:3418:14)\\n    at _class.jsxParseNamespacedName (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:3428:23)\\n    at _class.jsxParseElementName (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:3439:23)\\n    at _class.jsxParseOpeningElementAt (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:3524:24)\\n    at _class.jsxParseElementAt (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:3557:33)\\n    at _class.jsxParseElement (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:3626:19)\\n    at _class.parseExprAtom (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:3633:21)\\n    at _class.parseExprSubscripts (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:5924:21)\\n    at _class.parseMaybeUnary (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:5903:21)\\n    at _class.parseMaybeUnary (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:10213:54)\\n    at _class.parseExprOp (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:5858:46)\\n    at _class.parseExprOp (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:9848:48)\\n    at _class.parseExprOps (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:5822:17)\\n    at _class.parseMaybeConditional (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:5784:21)\\n    at _class.parseMaybeAssign (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:5731:21)\\n    at _class.parseMaybeAssign (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:10169:87)\\n    at _class.parseExpression (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:5684:21)\\n    at _class.parseStatementContent (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:7259:21)\\n    at _class.parseStatementContent (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:9916:58)\\n    at _class.parseStatement (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:7145:17)\\n    at _class.parseBlockOrModuleBlockBody (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:7696:23)\\n    at _class.parseBlockBody (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:7683:10)\\n    at _class.parseBlock (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:7672:10)\\n    at _class.parseFunctionBody (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:6925:24)\\n    at _class.parseFunctionBodyAndFinish (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:6905:10)\\n    at _class.parseFunctionBodyAndFinish (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:9773:56)\\n    at _class.parseMethod (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:6857:10)\\n    at _class.pushClassMethod (/Users/mac/Documents/Compiler/node_modules/@babel/parser/lib/index.js:8076:30)\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9Db2RlL1BhZ2VzL0FwcC9pbmRleC50c3guanMiLCJzb3VyY2VzIjpbXSwibWFwcGluZ3MiOiIiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./Code/Pages/App/index.tsx\n");

/***/ })

/******/ });