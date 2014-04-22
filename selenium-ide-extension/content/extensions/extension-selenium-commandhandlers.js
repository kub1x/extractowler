/*
* Copyright 2004 ThoughtWorks, Inc
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
*/

// A naming convention used in this file:
//
//
//   - a "seleniumApi" is an instance of the Selenium object, defined in selenium-api.js.
//
//   - a "Method" is an unbound function whose target must be supplied when it's called, ie.
//     it should be invoked using Function.call() or Function.apply()
//
//   - a "Block" is a function that has been bound to a target object, so can be called invoked directly
//     (or with a null target)
//
//   - "CommandHandler" is effectively an abstract base for
//     various handlers including ActionHandler, AccessorHandler and AssertHandler.
//     Subclasses need to implement an execute(seleniumApi, command) function,
//     where seleniumApi is the Selenium object, and command a SeleniumCommand object.
//
//   - Handlers will return a "result" object (ActionResult, AccessorResult, AssertResult).
//     ActionResults may contain a .terminationCondition function which is run by 
//     -executionloop.js after the command is run; we'll run it over and over again
//     until it returns true or the .terminationCondition throws an exception.
//     AccessorResults will contain the results of running getter (e.g. getTitle returns
//     the title as a string).

objectExtend(CommandHandlerFactory.prototype, {

    registerOwler: function(name, owlerBlock) {
        this.handlers[name] = new OwlerHandler(owlerBlock);
    },

    _registerAllOwlers: function(seleniumApi) {
        for (var functionName in seleniumApi) {
            var match = /^owl([A-Z].+)$/.exec(functionName);
            if (match) {
                var owlerMethod = seleniumApi[functionName];
                var owlerBlock = fnBind(owlerMethod, seleniumApi);
                var baseName = match[1];
                this.registerOwler(functionName, owlerBlock);
            }
        }
    },

    registerAll: function(seleniumApi) {
        this._registerAllAccessors(seleniumApi);
        this._registerAllActions(seleniumApi);
        this._registerAllAsserts(seleniumApi);
        this._registerAllOwlers(seleniumApi);
    },
});


function OwlerHandler(owlerBlock) {
  this.owlerBlock = owlerBlock;
  // constructor defined at: 
  // chrome://selenium-ide/content/selenium/scripts/selenium-commandhandlers.js:286
  CommandHandler.call(this, "owler", false);
}
OwlerHandler.prototype = new CommandHandler;
OwlerHandler.prototype.execute = function(seleniumApi, command) {
    //var handlerCondition = this.owlerBlock(command.target, command.value);
    return new OwlerResult(terminationCondition);
};
