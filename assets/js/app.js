
    // 1. Render songs
    // 2. Scroll top
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

    const app = {
        songs: [
            {
              name: 'Đường chân trời',
              singer: 'Chillies',
              path: './music/song1.mp3',
              image: './assets/img/song1.jpg'
            },
            {
              name: 'Bớt lo một ngày',
              singer: 'Kelly',
              path: './music/song2.mp3',
              image: './assets/img/song2.jpg'
            },
            {
              name: 'Đừng khóc một mình',
              singer: 'Huy Vạc',
              path: './music/song3.mp3',
              image: './assets/img/song3.jpg'
            },
            {
              name: 'Thằng điên',
              singer: 'Justatee ft. Phương Ly',
              path: './music/song4.mp3',
              image: './assets/img/song4.jpg'
            },
            {
              name: 'Xe đạp (lofi)',
              singer: 'Charles',
              path: './music/song5.mp3',
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
        handleEvents(){
            const cd = $('.cd')
            const cdWidth = cd.offsetWidth
            
            document.onscroll = function(){
                const scrollTop = window.scrollY || document.documentElement.scrollTop
                const newCdWidth = (cdWidth - scrollTop)<0?0: (cdWidth - scrollTop) 

                
                console.log(newCdWidth)
                cd.style.width = newCdWidth + 'px'
            }
        },
        start(){
            this.handleEvents()

            this.render() 
        }
    }

    app.start()