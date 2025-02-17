const audio_profiles = JSON.stringify([
  "heaac-2-dash",
  "heaac-2hq-dash"
]);
const base_profiles = JSON.stringify([
  "dfxp-ls-sdh",
  "simplesdh",
  "nflx-cmisc",
  "imsc1.1",
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
      fetch(browser.runtime.getURL("cadmium-playercore.js"), {
        cache: "no-store"
      })
        .then(response => response.text())
        .then(text => {
          // Version 6.0034.588.911 from https://assets.nflxext.com/en_us/ffe/player/html/cadmium-playercore-6.0041.305.911.js
          if (text.includes(`return {version:"6.0041.305.911",`)) {
            // Use our profile lists
            text = text.replace(`K={type:"standard",manifestVersion:A.Wg.lWa?"v2":"v1",viewableId:F,profiles:N`, `profiles=[];profiles.push(...${audio_profiles});use6Channels&&profiles.push(...["heaac-5.1-dash"]);profiles.push(...${avc_main_profiles});profiles.push(...${avc_high_profiles});useVP9&&profiles.push(...${vp9_profiles});profiles.push(...${base_profiles});K={type:"standard",manifestVersion:A.Wg.lWa?"v2":"v1",viewableId:F,profiles:profiles`);
            // Use our profiles in the profile group
            text = text.replace(`K.profileGroups=[{name:"default",profiles:N}],`, `K.profileGroups=[{name:"default",profiles:profiles}],`);
            // Re-enable Ctrl-Shift-S menu
            text = text.replace(`this.yT.Qoa && this.toggle();`, `this.toggle();`);
            // Add Audio Format Description
            text = text.replace(`displayName:v.displayName`, `displayName:v.displayName+ ("channels" in v ? " - "+v.channels : "")`);
            //text = text.replace(`displayName:u.displayName`, `displayName:u.displayName+ ("channels" in u ? " - "+u.channels : "")`);
            // Add max_bitrate logic
            // text = text.replace(`:this.setMediaKeys(t);}`, `:this.setMediaKeys(t),setMaxBitrate&&(console.info("Attempting to set max bitrate:"),fnSetMaxBitrate()?console.info("max bitrate set"):console.error("failed to set max bitrate"));}`)
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
      "*://*.a.nflxso.net/sec/*/ffe/player/html/*"
    ], types: ["script"]
  }, ["blocking"]
);
