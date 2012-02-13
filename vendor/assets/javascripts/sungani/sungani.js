// MIT License, see https://github.com/kayakyakr/sungani-js
//= require_self
//= require ../jslib/microevent
//= require ../jslib/utilities
//= require_directory .

(function(){
  try{
    Sungani;
  }
  catch(e){
    Sungani = {url: 'sungani.heroku.com'};
  }
})();
