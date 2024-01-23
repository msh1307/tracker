get_location_gps = () => {
    return new Promise((resolve, reject) => {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
        navigator.geolocation.getCurrentPosition((pos) => { 
            let crd = pos.coords;
            let location = {'latitude' : crd.latitude , 'longitude' : crd.longitude, 'accuracy' : crd.accuracy};
            resolve(location);
        }, (err) => {reject(err)}, options); 
    });
};

var module = {
    options: [],
    header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
    dataos: [
        { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
        { name: 'Windows', value: 'Win', version: 'NT' },
        { name: 'iPhone', value: 'iPhone', version: 'OS' },
        { name: 'iPad', value: 'iPad', version: 'OS' },
        { name: 'Kindle', value: 'Silk', version: 'Silk' },
        { name: 'Android', value: 'Android', version: 'Android' },
        { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
        { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
        { name: 'Macintosh', value: 'Mac', version: 'OS X' },
        { name: 'Linux', value: 'Linux', version: 'rv' },
        { name: 'Palm', value: 'Palm', version: 'PalmOS' }
    ],
    databrowser: [
        { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
        { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
        { name: 'Safari', value: 'Safari', version: 'Version' },
        { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
        { name: 'Opera', value: 'Opera', version: 'Opera' },
        { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
        { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
    ],
    init: async function () {
        // no gps 
        const fpPromise = await import('https://openfpcdn.io/fingerprintjs/v4');
        const asdf = await fpPromise.load();
        const hash = await asdf.get();
        const visitor_hash = (hash.visitorId);
        
        var agent = this.header.join(' '),
            os = this.matchItem(agent, this.dataos),
            browser = this.matchItem(agent, this.databrowser),
            resolution = this.get_resolution(),
            languages = window.navigator.languages,
            canvasfp = this.get_canvas_fp();
        try {
            ip = await this.get_ip();
        } catch (error) {
            console.log(error);
            ip = undefined;
        };

        return { 
            visitor_hash : visitor_hash,
            os: os, 
            browser: browser,
            languages: languages,
            hardware_concurrency :window.navigator.hardwareConcurrency,
            canvasfp: canvasfp,
            resolution: resolution,
            referrer: document.referrer,
            ip: ip,
        };
    },
    matchItem: function (string, data) {
        var i = 0,
            j = 0,
            html = '',
            regex,
            regexv,
            match,
            matches,
            version;
        
        for (i = 0; i < data.length; i += 1) {
            regex = new RegExp(data[i].value, 'i');
            match = regex.test(string);
            if (match) {
                regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                matches = string.match(regexv);
                version = '';
                if (matches) { if (matches[1]) { matches = matches[1]; } }
                if (matches) {
                    matches = matches.split(/[._]+/);
                    for (j = 0; j < matches.length; j += 1) {
                        if (j === 0) {
                            version += matches[j] + '.';
                        } else {
                            version += matches[j];
                        }
                    }
                } else {
                    version = '0';
                }
                return {
                    name: data[i].name,
                    version: parseFloat(version)
                };
            }
        }
        return { name: 'unknown', version: 0 };
    },
    get_resolution : function () {
        const res = {'width': window.screen.width * window.devicePixelRatio ,'height' : window.screen.height * window.devicePixelRatio};
        return res
    },
    get_ip : async function() {
        const url = 'https://api.my-ip.io/v2/ip.json';
        const resp = await fetch(url);
        return await resp.json();
    },
    get_canvas_fp: function() {
        var canvas = document.createElement("canvas");
        canvas.width = 100;
        canvas.height = 40;
        canvas.style.zIndex = -10;
        canvas.style.position = "absolute";
        canvas.style.display = "none";
      
        var ctx = canvas.getContext("2d");
      
        ctx.fillStyle = "rgb(255,0,255)";
        ctx.beginPath();
        ctx.rect(20, 20, 150, 100);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.beginPath();
        ctx.fillStyle = "rgb(0,255,255)";
        ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      
        txt = "praveen1180#$%^@£éú";
        ctx.textBaseline = "top";
        ctx.font = '17px "Arial 17"';
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "rgb(255,5,5)";
        ctx.rotate(.03);
        ctx.fillText(txt, 4, 17);
        ctx.fillStyle = "rgb(155,255,5)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "red";
        ctx.fillRect(20, 12, 100, 5);
      
        // hashing function
        src = canvas.toDataURL();
        hash = 0;
      
        for (i = 0; i < src.length; i++) {
          char = src.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
      
        return hash;
      }


};

