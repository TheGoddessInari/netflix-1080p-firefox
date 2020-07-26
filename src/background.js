const base_profiles = JSON.stringify([
  "heaac-2-dash",
  "heaac-2hq-dash",
  "dfxp-ls-sdh",
  "simplesdh",
  "nflx-cmisc",
  "BIF240",
  "BIF320",
]);

const avc_profiles = JSON.stringify([
"playready-h264mpl30-dash",
"playready-h264mpl31-dash",
"playready-h264mpl40-dash",
"playready-h264hpl30-dash",
"playready-h264hpl31-dash",
"playready-h264hpl40-dash",
]);
const vp9_profile0_levels = ["L21", "L30", "L31", "L40"];
const vp9_profiles = JSON.stringify([
  ...vp9_profile0_levels.map((level) => {
    return `vp9-profile0-${level}-dash-cenc`;
  })]);

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let encoder = new TextEncoder();

    filter.onstop = event => {
      fetch(browser.extension.getURL("cadmium-playercore.js")).
        then(response => response.text()).
        then(text => {
          // Version 6.0023.745.051 from https://assets.nflxext.com/en_us/ffe/player/html/cadmium-playercore-6.0023.745.051.js
          if (text.includes(`this.version="6.0023.745.051";`)) {
            // Use our profile list
            text = text.replace(`q={type:"standard",viewableId:p,profiles:m,`, `profiles=${base_profiles},profiles.push(...${avc_profiles}),use6Channels&&profiles.push("heaac-5.1-dash"),useVP9&&profiles.push(...${vp9_profiles}),q={type:"standard",viewableId:p,profiles:profiles,`);
            // Re-enable Ctrl-Shift-S menu
            text = text.replace(`this.tY.xga&&this.toggle()`, `this.toggle();`);
            // Add Audio Format Description
            text = text.replace(`displayName:a.yZ`, `displayName:a.yZ+" - "+a.channelsFormat`);
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
