document.addEventListener("DOMContentLoaded", function(event) {

  var tagList = document.getElementById('tags');
  var addTagButton = tagList.getElementsByTagName('button')[0];
  var remTagButton = tagList.getElementsByTagName('button')[1];

  addTagButton.addEventListener("click", addTagBox);
  remTagButton.addEventListener("click", remTagBox);
  
  function addTagBox(evt) {
    if (evt) evt.preventDefault();

    var input = createElement('input', { 'name': "tag", 'type': "text" });
    var addBtn = createElement('button', { 'class': "btn" }, '+');
    var remBtn = createElement('button', { 'class': "btn" }, '-');
    addBtn.addEventListener("click", addTagBox);
    remBtn.addEventListener("click", remTagBox);

    var newTag = createElement('p', {}, input, addBtn, remBtn);
    tagList.appendChild(newTag);
    
    return false;
  }

  function remTagBox(evt) {
    if (evt) evt.preventDefault();

    var target = evt.target || evt.srcElement;
    if (tagList.children.length > 1)
      tagList.removeChild(target.parentNode);

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
