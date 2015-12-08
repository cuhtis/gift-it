document.addEventListener("DOMContentLoaded", function(event) {

  var searchForm = document.querySelector('form');
  var byGiftLink = document.getElementById('byGift');
  var byTagLink = document.getElementById('byTag');
  var byUserLink = document.getElementById('byUser');
  var byEventLink = document.getElementById('byEvent');

  byGiftLink.addEventListener('click', function() {
    searchBy = searchByGift;
    byGiftLink.className = "bold";
    byTagLink.className = "";
    byUserLink.className = "";
    byEventLink.className = "";
  });

  byTagLink.addEventListener('click', function() {
    searchBy = searchByTag;
    byTagLink.className = "bold";
    byGiftLink.className = "";
    byUserLink.className = "";
    byEventLink.className = "";
  });

  byUserLink.addEventListener('click', function() {
    searchBy = searchByUser;
    byUserLink.className = "bold";
    byTagLink.className = "";
    byGiftLink.className = "";
    byEventLink.className = "";
  });

  byEventLink.addEventListener('click', function() {
    searchBy = searchByGift;
    byEventLink.className = "bold";
    byTagLink.className = "";
    byUserLink.className = "";
    byGiftLink.className = "";
  });
  
  searchForm.addEventListener('submit', function(evt) {
    evt.preventDefault();
    var searchQuery = document.getElementById('search_query');
    searchBy.call(this, searchQuery.value);
    return false;
  });

  var searchByGift = function (search_query) {
    var req = new XMLHttpRequest();
    var url = '/search/gift_results?search_query=' + search_query || "";
    req.open('GET', url, true);

    req.addEventListener('load', function() {
      if (req.status >= 200 && req.status < 400) {
        var data = JSON.parse(req.responseText);
        listResults(data);
      }
    });

    req.send();
  }
  
  function searchByTag(search_query) {
    var req = new XMLHttpRequest();
    var url = '/search/tag_results?search_query=' + search_query || "";
    req.open('GET', url, true);

    req.addEventListener('load', function() {
      if (req.status >= 200 && req.status < 400) {
        var data = JSON.parse(req.responseText);
        listResults(data);
      }
    });

    req.send();
  }
  
  function searchByUser(search_query) {
    var req = new XMLHttpRequest();
    var url = '/search/user_results?search_query=' + search_query || "";
    req.open('GET', url, true);

    req.addEventListener('load', function() {
      if (req.status >= 200 && req.status < 400) {
        var data = JSON.parse(req.responseText);
        listResults(data);
      }
    });

    req.send();
  }

  function listResults (resultList) {
    var results = document.getElementById('results');
    if (resultList.length == 0) results.innerHTML = "<p>No results found.</p>";
    else {
      var html = [];
      html.push('<table><tr><td>Item</td><td>Price</td><td>Link</td></tr>');
      resultList.forEach(function (result) {
        html.push('<tr>' + 
            '<td>' + result.name + '</td>' +
            '<td>' + result.name + '</td>' +
            '<td>' + result.name + '</td>' +
            '</tr>');
      });
      results.innerHTML = html.join("");
    }
  }

  var searchBy = searchByGift;
});
