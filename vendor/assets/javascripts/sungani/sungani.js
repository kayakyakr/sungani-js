// MIT License, see https://github.com/kayakyakr/sungani-js
//= require_directory ../jslib
//= require ./ns
//= require_directory .
//= require_self

(function(){
  try{
    Sungani;
  }
  catch(e){
    Sungani = {
      url: 'http://www.sungani.com',
      socket_url: 'http://sockets.sungani.com'
    };
  }
  
  var socket = null;
  
  Sungani.User.bind('signedin', function(){
    socket = io.connect(Sungani.socket_url);
    
    socket.on('connect', function(){
      socket.emit('user_id', Sungani.User.id);
    });
    
    socket.on('update', function(json){
      Sungani.Match.update(json);
    });
  });
  
  Sungani.User.bind('signedout', function(){
    if(socket){
      socket.disconnect();
    }
  });
  
  Object.defineProperties(Sungani, {
    ajax: {
      /**
       * wrapper to do ajax requests. for now wrap jquery. later do it library-less
       * @params opts     [Object]   Options for jquery request
       * @opts   url      String     URL to send the request to
       * @opts   method   [String]   Method to use to send the reqeust. Default: 'GET'
       * @opts   scope    [Object]   The scope that the response will be called in
       * @opts   success  [Function] Called on success
       * @opts   failure  [Function] Called on failure
       * @opts   callback [Function] Called on success or failure
       * @opts   params   [Object]   The parameters for the ajax call
       */
      value: function(opts){
        // build options hash        
        var option_hash = {
          url: opts['url'],
          type: opts['method'] || 'GET',
          dataType: 'json',
          headers: {
            'X-AUTH-TOKEN': Sungani.User.authentication_token || (localStorage && localStorage.getItem('sungani_authentication_token'))
          }
        };
        
        if(opts['scope']){
          option_hash['context'] = opts['scope'];
        }
        if(opts['success']){
          option_hash['success'] = opts['success'];
        }
        if(opts['failure']){
          option_hash['error'] = opts['failure'];
        }
        if(opts['callback']){
          option_hash['complete'] = opts['callback'];
        }
        if(opts['params']){
          option_hash['data'] = opts['params'];
        }
        
        $.ajax(option_hash);
      }
    },
    socket: {
      get: function(){
        return socket;
      }
    }
  });
})();
