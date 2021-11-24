
    // 1. Render songs --> ok
    // 2. Scroll top --> ok
    // 3. Play/pause/seek --> ok
    // 4. CD rotate --> ok
    // 5. Next/prev --> ok
    // 6. Random --> ok
    // 7. Next/Repeat when ended --> ok 
    // 8. Active song --> ok
    // 9. Scroll active song into view --> ok
    // 10.Play song when click --> ok

    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'

    const player = $('.player')
    const heading = $('header h2')
    const cdThumb = $('.cd-thumb')
    const progress = $('#progress')
    const audio = $('#audio')
    const cd = $('.cd')
    const playBtn = $('.btn-toggle-play')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')
    const randomBtn = $('.btn-random')
    const repeatBtn = $('.btn-repeat')
    const playlist = $('.playlist')

    const app = {
        currentIndex: 0,
        isPlaying: false,
        isRandom: false,
        isRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        songs: [
            {
              name: 'Đường chân trời',
              singer: 'Chillies',
              path: './assets/music/song1.mp3',
              image: './assets/img/song1.jpg'
            },
            {
              name: 'Bớt lo một ngày',
              singer: 'Kelly',
              path: './assets/music/song2.mp3',
              image: './assets/img/song2.jpg'
            },
            {
              name: 'Đừng khóc một mình',
              singer: 'Huy Vạc',
              path: './assets/music/song3.mp3',
              image: './assets/img/song3.jpg'
            },
            {
              name: 'Thằng điên',
              singer: 'Justatee ft. Phương Ly',
              path: './assets/music/song4.mp3',
              image: './assets/img/song4.jpg'
            },
            {
              name: 'Xe đạp (lofi)',
              singer: 'Charles',
              path: './assets/music/song5.mp3',
              image: './assets/img/song5.jpg'
            }
        ],
        setConfig(key, value) {
            this.config[key] = value; 
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },
        render(){
            const htmls = this.songs.map((song, index) =>{
                return `
                <div class="song ${index == this.currentIndex ? 'active' : ''}" data-index="${index}";>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
            })
            .join('')

            playlist.innerHTML = htmls

        },
        defineProperties(){
            Object.defineProperty(this, 'currentSong', {
                get(){
                    return this.songs[this.currentIndex]
                }
            })
        },
        handleEvents(){
            const that = this
            const cdWidth = cd.offsetWidth
            
            // Xử lý CD quay / dừng
            const cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg)'}
            ], {
                duration: 30000, //10 seconds
                interations: Infinity
            })

            cdThumbAnimate.pause()
            

            // Xử lý phóng to/thu nhỏ đĩa nhạc khi scroll
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = (cdWidth - scrollTop)<0?0: (cdWidth - scrollTop) 

                cd.style.width = newCdWidth + 'px'
                cd.style.opacity = newCdWidth / cdWidth
            }

            // Xử lý khi click play
            playBtn.onclick = ()=>{
                if (that.isPlaying){
                    audio.pause()
                } else {
                    audio.play()
                }
            }
            // Khi bài hát được play
            audio.onplay = ()=>{
                that.isPlaying = true 
                player.classList.add('playing')
                cdThumbAnimate.play()
            }
            // Khi bài hát bị pause
            audio.onpause = ()=>{
                that.isPlaying = false
                player.classList.remove('playing')
                cdThumbAnimate.pause()
            }
            
            // Khi tiến độ bài hát thay đổi
            audio.ontimeupdate = ()=>{
                if (audio.duration){
                    const progressPercent = audio.currentTime/audio.duration *100
                    progress.value = progressPercent
                }
            }

            // Xử lý khi tua bài hát
            progress.onchange = (e)=>{
                const seekTime = e.target.value / 100 * audio.duration
                audio.currentTime = seekTime
            }

            // Xử lý khi next
            nextBtn.onclick = ()=>{
                if (that.isRandom) {
                    that.playRandomSong()
                } else {
                    that.nextSong()
                }
                that.render()
                audio.play()
                that.scrollToActiveSong()
            }

            // Xử lý khi prev
            prevBtn.onclick = ()=>{
                if (that.isRandom) {
                    that.playRandomSong()
                } else {
                    that.prevSong()
                }
                that.render()
                audio.play()
                that.scrollToActiveSong()
            }
                
            // Xử lý bật / tắt random song
            randomBtn.onclick = ()=>{
                that.isRandom = !that.isRandom
                that.setConfig('isRandom', that.isRandom)
                randomBtn.classList.toggle('active', that.isRandom)
            }

            // Xử lý next song khi audio ended
            audio.onended = ()=>{
                if (that.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                }
            }

            // Xử lỷ bật / tắt repeat song
            repeatBtn.onclick = ()=>{
                that.isRepeat = !that.isRepeat
                that.setConfig('isRepeat', that.isRepeat)
                repeatBtn.classList.toggle('active', that.isRepeat)
            }

            // Lắng nghe hành vi click vào playlist
            playlist.onclick = (e)=>{
                const songNode = e.target.closest('.song:not(.active)')
                console.log(songNode)
                if ( songNode || e.target.closest('.option')) {
                    // Xử lý khi bấm vào bài hát
                    if (songNode) {
                        that.currentIndex = Number(songNode.dataset.index)
                        that.loadCurrentSong()
                        that.render()
                        audio.play()
                    }
                    // Xử lý khi click vào option
                    if (e.target.closest('.option')) {
                        // console.log(e.target)
                    }
                }
            }
        },
        scrollToActiveSong(){
            setTimeout(()=>{
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 200)
        },
        loadCurrentSong(){
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
            audio.src = this.currentSong.path

        },
        loadConfig(){
            this.isRandom = this.config.isRandom
            this.isRepeat = this.config.isRepeat

            randomBtn.classList.toggle('active', this.isRandom)
            repeatBtn.classList.toggle('active', this.isRepeat)
        },
        nextSong(){
            this.currentIndex++
            if (this.currentIndex == this.songs.length){
                this.currentIndex = 0
            }
            this.loadCurrentSong()
        },
        prevSong(){
            this.currentIndex--
            if (this.currentIndex == -1) {
                this.currentIndex = this.songs.length - 1
            }
            this.loadCurrentSong()
        },
        playRandomSong(){
            let newIndex
            do {
                newIndex = Math.floor(Math.random() * this.songs.length)
            } while (newIndex === this.currentIndex)

            this.currentIndex = newIndex
            this.loadCurrentSong()
        },
        start(){
            // Gán cấu hình của config vào ứng dụng
            this.loadConfig()

            // Định nghĩa các thuộc tính cho object
            this.defineProperties()

            // Lắng nghe / Xử lý các sự kiện (DOM events)
            this.handleEvents()

            // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
            this.loadCurrentSong()

            // Render playlist
            this.render() 
        }
    }

    app.start()