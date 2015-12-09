document.addEventListener("DOMContentLoaded", function(event) {

  var optionList = document.getElementById('options');
  var addButton = optionList.getElementsByTagName('button')[0];
  var remButton = optionList.getElementsByTagName('button')[1];

  addButton.addEventListener("click", addBox);
  remButton.addEventListener("click", remBox);
  
  function addBox(evt) {
    if (evt) evt.preventDefault();

    var target = evt.target || evt.srcElement;
    var newOption = target.parentNode.cloneNode(true);
    
    newOption.getElementsByTagName('button')[0].addEventListener("click", addBox);
    newOption.getElementsByTagName('button')[1].addEventListener("click", remBox);

    optionList.appendChild(newOption);
    
    return false;
  }

  function remBox(evt) {
    if (evt) evt.preventDefault();

    var target = evt.target || evt.srcElement;
    if (optionList.children.length > 1)
      optionList.removeChild(target.parentNode);

    return false;
  }

  function createElement(type, attributes) {
    var newElement = document.createElement(type);

    if (arguments[1]) {
      Object.keys(attributes).forEach(function(key) {
        newElement.setAttribute(key, attributes[key]);
      });
    }

    for (var i = 2; i < arguments.length; i++) {
      var child = arguments[i];
      if (typeof child === "string") {
        child = document.createTextNode(child);
      }
      newElement.appendChild(child);
    }

    return newElement;
  }

});
