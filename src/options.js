function onError(error) {
    console.error(`Error: ${error}`);
}

function save_options(e) {
    e.preventDefault();
    var use6Channels = document.getElementById('5.1').checked;
    var setMaxBitrate = document.getElementById('setMaxBitrate').checked;
    var useVP9 = document.getElementById('useVP9').checked;
    browser.storage.local.set({
        use6Channels: use6Channels,
        setMaxBitrate: setMaxBitrate,
        useVP9: useVP9
    }).then(() => {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 750);
        return;
    }).catch(onError);
}

function restore_options() {
    browser.storage.local.get({
        use6Channels: false,
        setMaxBitrate: false,
        useVP9: true
    }).then(result => {
        document.getElementById('5.1').checked = result.use6Channels;
        document.getElementById('setMaxBitrate').checked = result.setMaxBitrate;
        document.getElementById('useVP9').checked = result.useVP9;
        return;
    }).catch(onError);

}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);