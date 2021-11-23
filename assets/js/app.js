
    // 1. Render songs --> ok
    // 2. Scroll top --> ok
    // 3. Play/pause/seek
    // 4. CD rotate
    // 5. Next/prev
    // 6. Random
    // 7. Next/Repeat when ended
    // 8. Active song
    // 9. Scroll active song into view
    // 10.Play song when click

    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const player = $('.player')
    const heading = $('header h2')
    const cdThumb = $('.cd-thumb')
    const progress = $('#progress')
    const audio = $('#audio')
    const cd = $('.cd')
    const playBtn = $('.btn-toggle-play')
    const nextBtn = $('.btn-next')
    const prevBtn = $('.btn-prev')

    const app = {
        currentIndex: 0,
        isPlaying: false,
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
        render(){
            const htmls = this.songs.map(song =>{
                return `
                <div class="song">
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

            $('.playlist').innerHTML = htmls

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
                that.nextSong()
                audio.play()
            }

            // Xử lý khi prev
            prevBtn.onclick = ()=>{
                that.prevSong()
                audio.play()
            }
                
            
        },
        loadCurrentSong(){
            heading.textContent = this.currentSong.name
            cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
            audio.src = this.currentSong.path

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
        start(){
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