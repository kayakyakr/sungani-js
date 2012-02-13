
(function(){
var game = function(config){}

Object.defineProperties(game.prototype, {
  load_matches: {
    value: function(cb){
      $.ajax({
        method: 'GET',
        url: Sungani.url + '/matches',
        dataType: 'json',
        success: function(data, status, xhr){
          this.matches = data;
          cb();
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  },
  matches: {
    value: [],
    enumerable: true
  },
  load: {
    value: function(id, cb){
      $.ajax({
        method: 'GET',
        url: Sungani.url + '/games/' + id,
        dataType: 'json',
        success: function(data, status, xhr){
          Object.apply(this, data);
          if(cb){
            cb();
          }
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  },
  list: {
    value: function(cb){
      $.ajax({
        method: 'GET',
        url: Sungani.url + '/games',
        dataType: 'json',
        success: function(data, status, xhr){
          cb(data);
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  }
});

Sungani.Game = new game();
})();
