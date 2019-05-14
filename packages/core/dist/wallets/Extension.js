"use strict";var _interopRequireWildcard=require("@babel/runtime/helpers/interopRequireWildcard"),_interopRequireDefault=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports["default"]=void 0;var _defineProperty2=_interopRequireDefault(require("@babel/runtime/helpers/defineProperty")),_classCallCheck2=_interopRequireDefault(require("@babel/runtime/helpers/classCallCheck")),_createClass2=_interopRequireDefault(require("@babel/runtime/helpers/createClass")),_possibleConstructorReturn2=_interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn")),_getPrototypeOf2=_interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf")),_inherits2=_interopRequireDefault(require("@babel/runtime/helpers/inherits")),_regenerator=_interopRequireDefault(require("@babel/runtime/regenerator")),_asyncToGenerator2=_interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator")),PluginTypes=_interopRequireWildcard(require("../plugins/PluginTypes")),_Plugin2=_interopRequireDefault(require("../plugins/Plugin")),_Blockchains=require("../models/Blockchains"),_WalletInterface=require("../models/WalletInterface"),isAvailable=!1,getIsAvailable=function(){"undefined"!=typeof window&&"undefined"!=typeof document&&("undefined"!=typeof window.BcxWeb&&"undefined"!=typeof window.BcxWeb.BCX||"undefined"!=typeof window.BcxWeb&&"undefined"!=typeof window.BcxWeb.getAccountInfo()?isAvailable=!0:document.addEventListener("cocosLoaded",function(){return isAvailable=!0}))},pollExistence=/*#__PURE__*/function(){var a=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(){var b,c,d=arguments;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return b=0<d.length&&void 0!==d[0]?d[0]:null,c=1<d.length&&void 0!==d[1]?d[1]:0,a.abrupt("return",new Promise(function(a){return b||(b=a),isAvailable?b(!0):5<c?b(!1):void setTimeout(function(){return pollExistence(b,c+1)},100)}));case 3:case"end":return a.stop();}},a)}));return function(){return a.apply(this,arguments)}}(),Extension=/*#__PURE__*/function(a){function b(a,c){var d;return(0,_classCallCheck2["default"])(this,b),d=(0,_possibleConstructorReturn2["default"])(this,(0,_getPrototypeOf2["default"])(b).call(this,_Blockchains.Blockchains.COCOSBCX,PluginTypes.WALLET_SUPPORT)),d.name="CocosExtension",d.context=a,d.holderFns=c,d}return(0,_inherits2["default"])(b,a),(0,_createClass2["default"])(b,[{key:"connect",value:function connect(){var a=this;return getIsAvailable(),new Promise(/*#__PURE__*/function(){var b=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function b(c){var d;return _regenerator["default"].wrap(function(b){for(;;)switch(b.prev=b.next){case 0:return b.next=2,pollExistence();case 2:d=b.sent,d&&(!a.holderFns.get().wallet&&(a.holderFns.get().wallet=a.name),c(!0));case 4:case"end":return b.stop();}},b)}));return function(){return b.apply(this,arguments)}}())}},{key:"runBeforeInterfacing",value:function(){var a=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(){var b;return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return this.holderFns.get().wallet===this.name&&(window.BcxWeb.wallet=this.name,b=this.holderFns.get(),"undefined"!=typeof window.BcxWeb&&"undefined"!=typeof window.BcxWeb.BCX?b.cocosBcx=function(){return window.BcxWeb.BCX}:"undefined"!=typeof window.BcxWeb&&"undefined"!=typeof window.BcxWeb.getAccountInfo()&&(b.cocosBcx=function(){return window.BcxWeb})),this.holderFns.set(b),this.context=this.holderFns.get(),a.abrupt("return",!0);case 4:case"end":return a.stop();}},a,this)}));return function runBeforeInterfacing(){return a.apply(this,arguments)}}()},{key:"runAfterInterfacing",value:function(){var a=(0,_asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function a(){return _regenerator["default"].wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return this.context.isExtension=!0,a.abrupt("return",!0);case 2:case"end":return a.stop();}},a,this)}));return function runAfterInterfacing(){return a.apply(this,arguments)}}()},{key:"methods",value:function methods(){return(0,_defineProperty2["default"])({},_WalletInterface.WALLET_METHODS.getIdentity,function(){console.log("getid")})}}]),b}(_Plugin2["default"]);exports["default"]=Extension;