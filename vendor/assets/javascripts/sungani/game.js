
(function(){
var game = function(config){}

MicroEvent.mixin(game);

Object.defineProperties(game.prototype, {
  load: {
    value: function(){
      Sungani.ajax({
        method: 'GET',
        url: Sungani.url + '/games/' + Sungani.Game.id,
        success: function(data, status, xhr){
          Object.applyValues(this, data);
          this.trigger('load')
        }.bind(this)
      });
    },
    writeable: false,
    configurable: false
  }
});

Sungani.Game = new game();
})();
