Object.apply = function(obj, cfg){
  for(var i in cfg){
    obj[i] = cfg[i];
  }
}

Object.applyIf = function(obj, cfg){
  for(var i in cfg){
    if(obj[i] === undefined){
      obj[i] = cfg[i];
    }
  }
}

Array.prototype.shuffle = function() {
    var tmp, current, top = this.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = this[current];
        this[current] = this[top];
        this[top] = tmp;
    }

    return this;
}
