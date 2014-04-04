// Generate random text for a variable
// Possible options:
//   length      number indicating how long to make the string (defaults to 8)
//
//   type        string indicating what type of string to create alpha, numeric
//               or alphanumeric (defaults to alphanumeric)
//
//   length|type pipe delimited option list

//Selenium.prototype.doOwl = function( options, varName ) {
//}

Selenium.prototype.doOwlSetSchemas          = function( options, varName ) { }
Selenium.prototype.doOwlSetPublisher        = function( options, varName ) { }
Selenium.prototype.doOwlSetNextPageResolver = function( options, varName ) { }
Selenium.prototype.doOwlSetEncoding         = function( options, varName ) { }
Selenium.prototype.doOwlSetLang             = function( options, varName ) { }

Selenium.prototype.doOwlSetId          = function( options, varName ) { }
Selenium.prototype.doOwlCreateChObject = function( options, varName ) { }
Selenium.prototype.doOwlAddSpec        = function( options, varName ) { }
//Selenium.prototype.doOwlSet = function( options, varName ) { }


//Selenium.prototype.doRandomString = function( options, varName ) {
//    var length = 8;
//    var type   = 'alphanumeric';
//
//    var o = options.split( '|' );
//
//    for ( var i = 0 ; i < 2 ; i ++ ) {
//        if ( o[i] && o[i].match( /^\d+$/ ) )
//            length = o[i];
//
//        if ( o[i] && o[i].match( /^(?:alpha)?(?:numeric)?$/ ) )
//            type = o[i];
//    }
//
//    switch( type ) {
//        case 'alpha'        : storedVars[ varName ] = randomAlpha( length ); break;
//        case 'numeric'      : storedVars[ varName ] = randomNumeric( length ); break;
//        case 'alphanumeric' : storedVars[ varName ] = randomAlphaNumeric( length ); break;
//        default             : storedVars[ varName ] = randomAlphaNumeric( length );
//    };
//};

