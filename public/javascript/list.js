document.addEventListener("DOMContentLoaded", function(event) {

  var giftList = document.getElementById('gift_list');
  var links = document.getElementsByClassName('rem_link');

  Array.prototype.forEach.call(links, function (link) {
    link.addEventListener('click', removeGift);
  });

  function removeGift (evt) {
    evt.preventDefault();

    var target = evt.target || evt.srcElement;
    var row = target.parentNode.parentNode;

    var req = new XMLHttpRequest();
    req.open('POST', '/gift/remove', true);
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    req.send('id=' + target.id);
   
    removeRow(row);
    return false;
  }

  function removeRow (row) {
    var table = giftList.getElementsByTagName('tbody')[0];
    console.log(table);
    console.log(row);
    table.removeChild(row);

    if (table.children.length == 1)
      giftList.innerHTML = "<p>No gifts in your list.</p>";
  }
});
