(function (doc) {

  function DOM(element) {
    if (!(this instanceof DOM)) {
      return new DOM(element)
    }

    this.element = doc.querySelectorAll(element);
  };

  DOM.isArray = function isArray(param) {
    return getType(param) === "[object Array]";
  }
  DOM.isObject = function isObject(param) {
    return getType(param) === "[object Object]";
  }
  DOM.isFunction = function isFunction(param) {
    return getType(param) === "[object Function]";
  }
  DOM.isNumber = function isNumber(param) {
    return getType(param) === "[object Number]";
  }
  DOM.isString = function isString(param) {
    return getType(param) === "[object String]";
  }
  DOM.isBoolean = function isBoolean(param) {
    return getType(param) === "[object Boolean]";
  }
  DOM.isNull = function isNull(param) {
    return getType(param) === "[object Null]" || getType(param) === "[object Undefined]";
  }
  
  DOM.prototype.on = function on(event, functionCallback) {
    Array.prototype.forEach.call(this.element, (element) => {
      element.addEventListener(event, functionCallback , false);
    })
  }
  DOM.prototype.off = function off(event, functionCallback) {
    Array.prototype.forEach.call(this.element, (element) => {
      element.removeEventListener(event, functionCallback , false);
    })
  }
  DOM.prototype.get = function get(index) {
    if(!index){
      return this.element[0];
    }
    return this.element[index];
  }
  
  DOM.prototype.forEach = function forEach() {
    return Array.prototype.forEach.apply(this.element, arguments);
  }
  DOM.prototype.map = function map() {
    return Array.prototype.map.apply(this.element, arguments);
  }
  DOM.prototype.filter = function filter() {
    return Array.prototype.filter.apply(this.element, arguments);
  }
  DOM.prototype.reduce = function reduce() {
    return Array.prototype.reduce.apply(this.element, arguments);
  }
  DOM.prototype.reduceRight = function reduceRight() {
    return Array.prototype.reduceRight.apply(this.element, arguments);
  }
  DOM.prototype.every = function every() {
    return Array.prototype.every.apply(this.element, arguments);
  }
  DOM.prototype.some = function some() {
    return Array.prototype.some.apply(this.element, arguments);
  }
  
  function getType(value) {
    return Object.prototype.toString.call(value);
  }
  
  window.DOM = DOM;
  
  }(document))