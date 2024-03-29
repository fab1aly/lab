
    import WebTorrent from 'https://esm.sh/webtorrent'
    // import {WebTorrent} from './webtorrent.min.js'

export class VideoWebTorrent extends HTMLElement {
    constructor () {
        super();

        this.innerHTML = `
            <div id="hero">
            <div id="output">
                <div id="progressBar"></div>
                <!-- The video player will be added here -->
                <video controls autoplay></video>
            </div>
            <!-- Statistics -->
            <div id="status">
                <div>
                <span class="show-leech">Downloading </span>
                <span class="show-seed">Seeding </span>
                <code>
                    <!-- Informative link to the torrent file -->
                    <a id="torrentLink" href="https://webtorrent.io/torrents/sintel.torrent">sintel.torrent</a>
                    </code>
                <span class="show-leech"> from </span>
                <span class="show-seed"> to </span>
                <code id="numPeers">0 peers</code>.
                </div>
                <div>
                <code id="downloaded"></code>
                of <code id="total"></code>
                — <span id="remaining"></span><br />
                &#x2198;<code id="downloadSpeed">0 b/s</code>
                / &#x2197;<code id="uploadSpeed">0 b/s</code>
                </div>
            </div>
            <!-- Buttons -->
            <div>
                <button onclick="download()">Download</button>
                <button onclick="stop()">Destroy</button>
            </div>
            </div>
        `

        
    }

    connectedCallback() {
        this.client = window.client = new WebTorrent()

        const magnet = `magnet:?xt=urn:btih:` + this.getAttribute('hash')
        // const magnet = 'magnet:?xt=urn:btih:b061491677f17718c29a9b42068b61ba61b52d28&dn=THX-1138_Original_Cut.mkv'
        

        const tracker = "&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.dev"
        const torrentId = magnet + tracker

        // HTML elements
        const $hero = document.querySelector('#hero')
        const $progressBar = document.querySelector('#progressBar')
        const $numPeers = document.querySelector('#numPeers')
        const $downloaded = document.querySelector('#downloaded')
        const $total = document.querySelector('#total')
        const $remaining = document.querySelector('#remaining')
        const $uploadSpeed = document.querySelector('#uploadSpeed')
        const $downloadSpeed = document.querySelector('#downloadSpeed')

        function download(instance) {                                                                ////     instance ?

            // Download the torrent
            client.add(torrentId, function (torrent) {
    
            // Deselect all files on initial download                                                   //////////////
            torrent.files.forEach(file => file.deselect());                                             // auto stop all dl
            torrent.deselect(0, torrent.pieces.length - 1, false);                                      /////////////
    
            // Torrents can contain many files. Let's use the .mp4 file
            const file = torrent.files.find(function (file) {
                return file.name.endsWith('.mp4')
            })
    
            // Select file with provided index                                               ///////////////////////
            if (file) torrent.select(file._startPiece, file._endPiece, false);                       // dl one file
    
            // Stream the file in the browser
            const video = document.querySelector('video')
            video.src = file.streamURL
            console.log('Ready to play!')
            // video.autoplay = "true"
    
    
            // Trigger statistics refresh
            torrent.on('done', onDone)
            setInterval(onProgress, 500)
            onProgress()
    
            // Statistics
            function onProgress() {
                // Peers
                $numPeers.innerHTML = torrent.numPeers + (torrent.numPeers === 1 ? ' peer' : ' peers')
    
                // Progress
                const percent = Math.round(file.progress * 100 * 100) / 100                       ////
                $progressBar.style.width = percent + '%'
                $downloaded.innerHTML = prettyBytes(file.downloaded)                             ///// 
                $total.innerHTML = prettyBytes(file.length)                                     /////
    
                // Remaining time
                let remaining
                if (torrent.done) {                                                                   ////
                remaining = 'Done.'
                } else {
                remaining = moment.duration(torrent.timeRemaining / 1000, 'seconds').humanize()       /////
                remaining = remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.'
                }
                $remaining.innerHTML = remaining
    
                // Speed rates
                $downloadSpeed.innerHTML = prettyBytes(torrent.downloadSpeed) + '/s'                  ///////
                $uploadSpeed.innerHTML = prettyBytes(torrent.uploadSpeed) + '/s'                      ////
            }
            function onDone() {
                $hero.className += ' is-seed'
                onProgress()
            }
            })
        }

        // Human readable bytes util
        function prettyBytes(num) {
            const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
            const neg = num < 0
            if (neg) num = -num
            if (num < 1) return (neg ? '-' : '') + num + ' B'
            const exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1)
            const unit = units[exponent]
            num = Number((num / Math.pow(1000, exponent)).toFixed(2))
            return (neg ? '-' : '') + num + ' ' + unit
        }

        navigator.serviceWorker.register('./sw.min.js', { scope: './' }).then(reg => {
            const worker = reg.active || reg.waiting || reg.installing
            function checkState(worker) {
              return worker.state === 'activated' && client.createServer({ controller: reg }) && download()
            }
            if (!checkState(worker)) {
              worker.addEventListener('statechange', ({ target }) => checkState(target))
            }
        })

    }

    

    

    disconnectedCallback() {
        // le navigateur appelle cette méthode lorsque l'élément est supprimé du document
        // elle peut-être appelé autant de fois que lélément est ajouté ou supprimé)

        this.client._server.close()
        this.client.destroy()
    }
    
}


