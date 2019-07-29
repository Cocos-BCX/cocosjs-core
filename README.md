## Cocosjs Core

It is used for dapp.
Use it to hook up with various clients, including chrome plugins, wallet clients, IOS wallets, Android wallets.

## How to use

npm i cocosjs-core

 '''import Cocosjs from "cocosjs-core";
 import CocosBCX from "cocosjs-plugin-bcx";
 Cocosjs.plugins(new CocosBCX())
 Cocosjs.cocos.connect("My-App").then(connected => {
   if (!connected) return false;
   window.CocosWeb = cocos
 })'''

more information, visit https://www.npmjs.com/package/cocosjs-core

## Using it on DApp

Here is a dapp sample. [cocos-dice](https://github.com/Cocos-BCX/cocos-dice) 
