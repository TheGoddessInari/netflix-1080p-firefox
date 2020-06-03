browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let encoder = new TextEncoder();

    filter.onstop = event => {
      fetch(browser.extension.getURL("cadmium-playercore.js")).
        then(response => response.text()).
        then(text => {
          // Version 6.0023.327.011 from https://assets.nflxext.com/en_us/ffe/player/html/cadmium-playercore-6.0023.327.011.js
          if (text.includes(`this.version="6.0023.327.011";`)) {
            // Add global variable for overriding manifest
            text = `var manifestOverridden=false;${text}`;
            // Unconditionally push 1080p formats
            text = text.replace(`b.KH=[y.V.gI,y.V.CC,y.V.GQ,y.V.HQ,y.V.cJ,y.V.dJ]`, `b.KH=[y.V.gI,y.V.CC,y.V.GQ,y.V.HQ,y.V.cJ,y.V.dJ,y.V.JQ, y.V.IQ, y.V.eJ]`);
            // Use our profile list
            text = text.replace(`g={type:"standard",viewableId:h,profiles:p,`, `profiles=["playready-h264mpl30-dash","playready-h264mpl31-dash","playready-h264mpl40-dash","playready-h264hpl30-dash","playready-h264hpl31-dash","playready-h264hpl40-dash","vp9-profile0-L30-dash-cenc","vp9-profile0-L31-dash-cenc","vp9-profile0-L40-dash-cenc","heaac-2-dash","simplesdh","nflx-cmisc","BIF240","BIF320"],use6Channels&&profiles.push("heaac-5.1-dash"),g={type:"standard",viewableId:h,profiles:profiles,`);
            // Re-enable Ctrl-Shift-S menu
            text = text.replace(`this.aX.pca&&this.toggle()`, `this.toggle();`);
            // Replace w/ Windows Edge esnPrefix
            text = text.replace(`/Windows NT/.test(a)?"NFCDCH-02-"`, `/Windows NT/.test(a)?"NFCDIE-03-"`);
            // Replace w/ MacOS Edge esnPrefix
            text = text.replace(`/Intel Mac OS X/.test(a)?"NFCDCH-MC-"`, `/Intel Mac OS X/.test(a)?"NFCDIE-04-"`);
            // Add Audio Format Description
            text = text.replace(`displayName:a.ZX`, `displayName:a.ZX+" - "+a.channelsFormat`);
          }
          filter.write(encoder.encode(text));
          filter.close();
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
