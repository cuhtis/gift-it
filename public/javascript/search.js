document.addEventListener("DOMContentLoaded", function(event) {

  var searchForm = document.querySelector('form');
  var byGiftLink = document.getElementById('byGift');
  var byTagLink = document.getElementById('byTag');
  var byUserLink = document.getElementById('byUser');
  var byEventLink = document.getElementById('byEvent');

  var searchBy = searchByGift;
  getSearchResults();

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
  
  searchForm.addEventListener('submit', getSearchResults);
   
  function getSearchResults (evt) {
    if (evt) evt.preventDefault();
    var searchQuery = document.getElementById('search_query');
    searchBy.call(this, searchQuery.value);
    return false;
  };

  function searchByGift (search_query) {
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
        listUsers(data);
      }
    });

    req.send();
  }

  function listResults (resultList) {
    var results = document.getElementById('results');
    if (resultList.length == 0) results.innerHTML = "<p>No results found.</p>";
    else {
      var html = [];
      html.push('<p>Click on a gift name to learn more!</p>');
      html.push('<table><tr><td>Item</td><td>Price</td><td>Tags</td></tr>');
      resultList.forEach(function (result) {
        html.push('<tr>' + 
            '<td><a href="/gift/info?id=' + result.id + '">' + result.name + '</a></td>' +
            '<td>' + parsePrice(result.price) + '</td>' +
            '<td>' + parseTags(result.tags) + '</td>' +
            '</tr>');
      });
      html.push('</table>');
      results.innerHTML = html.join("");
    }
  }

  function listUsers (resultList) {
    var results = document.getElementById('results');
    if (resultList.length == 0) results.innerHTML = "<p>No results found.</p>";
    else {
      var html = [];
      html.push('<p>Click on a username to see their profile!</p>');
      html.push('<table><tr><td>Username</td><td>Name</td><td>Email</td></tr>');
      resultList.forEach(function (result) {
        html.push('<tr>' + 
            '<td><a href="/user/' + result.username + '">' + result.username + '</a></td>' +
            '<td>' + result.name + '</td>' +
            '<td>' + result.email + '</td>' +
            '</tr>');
      });
      html.push('</table>');
      results.innerHTML = html.join("");
    }
  }

  function parseTags (tags) {
    if (!tags || tags.length == 0) return "N/A";
    return tags.join(', ');
  }

  function parsePrice (price) {
    if (!price) return "N/A";
    var str = "";
    for (var i = price; i > 0; i--) {
      str = str + "$";
    }
    return str;
  }

});
