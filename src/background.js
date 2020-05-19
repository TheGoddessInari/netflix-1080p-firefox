browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let encoder = new TextEncoder();
  
    filter.onstop = event => {
      fetch(browser.extension.getURL("cadmium-playercore-1080p.js")).
        then(response => response.text()).
        then(text => {
          filter.write(encoder.encode(text));
          filter.disconnect();
          return;
        }).catch(err => {
          console.error(`Error: ${error}`);
      });
    };
    return {};
  }, {
    urls: [
      "*://assets.nflxext.com/*/ffe/player/html/*",
      "*://www.assets.nflxext.com/*/ffe/player/html/*"
    ]
  }, ["blocking"]
);
