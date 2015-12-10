document.addEventListener("DOMContentLoaded", function(event) {
  
  var form = document.forms["form"];
  var error = document.getElementById("message");
  form.addEventListener("submit", validateForm);

  function validateForm (evt) {
    var ret = true;
    var message = "";
   
    if (form["username"].value.match(/^[a-zA-Z0-9]+$/) == null) { 
      message = "Please enter a valid username.\nAlphanumeric characters only.";
      ret = false; 
    } else
    if (form["password"].value.match(/^[a-zA-Z0-9]+$/) == null) { 
      message = "Please enter a valid password.\nAlphanumeric characters only.";
      ret = false; 
    } else
    if (form["verify_password"].value != form["password"].value) { 
      message = "Your password was not repeated correctly.";
      ret = false; 
    } else
    if (form["first_name"].value.match(/^[a-zA-z]+$/) == null) {
      message = "Please enter a valid first name.\nAlphabetic characters only.";
      ret = false; 
    } else
    if (form["last_name"].value.match(/^[a-zA-z]+$/) == null) {
      message = "Please enter a valid last name.\nAlphabetic characters only.";
      ret = false; 
    } else
    if (form["email"].value.match(/^[a-zA-z0-9]+@[a-zA-z0-9]+$/) == null) {
      message = "Please enter a valid email";
      ret = false; 
    } else
    if (form["birthday"].value == null || form["birthday"].value == "") { 
      message = "Please enter a valid birthday";
      ret = false; 
    } else
    if (new Date(form["birthday"].value) > new Date()) { 
      message = "Please enter a valid birthday";
      ret = false; 
    }

    if (!ret) evt.preventDefault();

    error.innerHTML = message;
    return ret;
  }

});

