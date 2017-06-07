var upvotes = document.getElementsByClassName('upvote');

Array.prototype.forEach.call(upvotes, function(element) {
  element.addEventListener('click', function(event) {
    var payload = {
      id: event.target.baseURI.split('/').pop(),
      option: event.target.value
    }

    fetch(event.target.baseURI, {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    })
      .then(location.reload())
      .catch(function(err) {
        console.error(err);
      });

  });
});