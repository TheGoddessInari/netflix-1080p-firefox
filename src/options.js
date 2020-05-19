function onError(error) {
    console.error(`Error: ${error}`);
}

function save_options(e) {
    e.preventDefault();
    var use6Channels = document.getElementById('5.1').checked;
    var setMaxBitrate = document.getElementById('setMaxBitrate').checked;
    browser.storage.sync.set({
        use6Channels: use6Channels,
        setMaxBitrate: setMaxBitrate
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
    browser.storage.sync.get({
        use6Channels: false,
        setMaxBitrate: false
    }).then(result => {
        document.getElementById('5.1').checked = result.use6Channels;
        document.getElementById('setMaxBitrate').checked = result.setMaxBitrate;
        return;
    }).catch(onError);

}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);