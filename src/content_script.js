// From EME Logger extension


// very messy workaround for accessing browser's storage outside of background / content scripts
browser.storage.local.get({
    use6Channels: false,
    setMaxBitrate: false,
    useVP9: true
}).then(items => {
    const include_urls = [
        'netflix_max_bitrate.js',
    ];
    const use6Channels = items.use6Channels;
    const setMaxBitrate = items.setMaxBitrate;
    const useVP9 = items.useVP9;
    const main_script = document.createElement('script');
    main_script.type = 'application/javascript';
    main_script.text = `var use6Channels = ${use6Channels};
                    var setMaxBitrate = ${setMaxBitrate};
                    var useVP9 = ${useVP9};`;
    document.documentElement.appendChild(main_script);

    for (const include_url of include_urls) {
        const secondary_url = browser.extension.getURL(include_url);

        const include_xhr = new XMLHttpRequest();
        include_xhr.open('GET', secondary_url, true);

        include_xhr.onload = function(e) {
            const onload_xhr = e.target;
            if (onload_xhr.status == 200) {
                const xhr_script = document.createElement('script');
                xhr_script.type = 'application/javascript';
                    xhr_script.text = onload_xhr.responseText;
                document.documentElement.appendChild(xhr_script);
            }
        };

        include_xhr.send();
    }
    return;
}).catch(err => {
    console.error(`Error: ${error}`);
});


