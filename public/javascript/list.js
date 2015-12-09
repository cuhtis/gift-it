document.addEventListener("DOMContentLoaded", function(event) {

  var giftList = document.getElementById('gift_list');
  var eventList = document.getElementById('event_list');
  
  var giftRemLinks = giftList.getElementsByClassName('rem_link');
  var eventRemLinks = eventList.getElementsByClassName('rem_link');

  Array.prototype.forEach.call(giftRemLinks, function (link) {
    link.addEventListener('click', removeGift);
  });

  Array.prototype.forEach.call(eventRemLinks, function (link) {
    link.addEventListener('click', removeEvent);
  });

  function removeGift (evt) {
    evt.preventDefault();

    var target = evt.target || evt.srcElement;
    var row = target.parentNode.parentNode;

    var req = new XMLHttpRequest();
    req.open('POST', '/gift/remove', true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.send('id=' + target.id);
   
    removeRow(row, giftList);
    return false;
  }

  function removeEvent (evt) {
    evt.preventDefault();

    var target = evt.target || evt.srcElement;
    var row = target.parentNode.parentNode;

    var req = new XMLHttpRequest();
    req.open('POST', '/gift/remove_event', true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.send('id=' + target.id);
   
    removeRow(row, eventList);
    return false;
  }

  function removeRow (row, list) {
    var table = list.getElementsByTagName('tbody')[0];
    table.removeChild(row);

    if (table.children.length == 1)
      list.innerHTML = "<p>Nothing in your list.</p>";
  }
});
