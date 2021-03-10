const audio_profiles = JSON.stringify([
  "heaac-2-dash",
  "heaac-2hq-dash"
]);
const base_profiles = JSON.stringify([
  "dfxp-ls-sdh",
  "simplesdh",
  "nflx-cmisc",
  "BIF240",
  "BIF320",
]);

const avc_main_profiles = JSON.stringify([
  "playready-h264mpl30-dash",
  "playready-h264mpl31-dash",
  "playready-h264mpl40-dash",
]);

const avc_high_profiles = JSON.stringify([
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

    filter.onstart = event => {
      fetch(browser.extension.getURL("cadmium-playercore.js"), {
        cache: "no-store"
      })
        .then(response => response.text())
        .then(text => {
          // Version 6.0029.052.051 from https://assets.nflxext.com/en_us/ffe/player/html/cadmium-playercore-6.0029.052.051.js
          if (text.includes(`this.version="6.0029.052.051";`)) {
            // Use our profile lists
            text = text.replace(`r={type:"standard",viewableId:n,profiles:g,`, `profiles=[];profiles.push(...${audio_profiles});use6Channels&&profiles.push(...["heaac-5.1-dash"]);profiles.push(...${avc_main_profiles});profiles.push(...${avc_high_profiles});useVP9&&profiles.push(...${vp9_profiles});profiles.push(...${base_profiles});r={type:"standard",viewableId:n,profiles:profiles,`);
            // Use our profiles in the profile group
            text = text.replace(`r.profileGroups=[{name:"default",profiles:g}],`, `r.profileGroups=[{name:"default",profiles:profiles}],`);
            // Re-enable Ctrl-Shift-S menu
            text = text.replace(`this.o2.Jma && this.toggle();`, `this.toggle();`);
            // Add Audio Format Description
            text = text.replace(`displayName:a.displayName`, `displayName:a.displayName+ ("Lr" in a ? " - "+a.Lr : "")`);
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
    ], types: ["script"]
  }, ["blocking"]
);
