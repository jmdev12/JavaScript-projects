const pause = document.querySelector('.pause');
const progress = document.querySelector('.progress-bar');
const progressContainer = document.querySelector('.progress1');
const audio = document.querySelector('.main-audio');
const songContainer = document.querySelector('.song-name');
const volume = document.querySelector('.volume-control');
const skipNext = document.querySelector('.skip-next');
const skipPrev = document.querySelector('.skip-prev');
const changingDiv = document.querySelector('.main'); // Background for changing image
const icon = pause.querySelector('i');
const songs = [
    {
        name: "Last Heroes - Dimensions [NCS Release]",
        src: "songs/Last Heroes - Dimensions [NCS Release].mp3",
        img: 'images/1.jpg'
    },
    {
        name: "LFZ - Popsicle",
        src: "songs/LFZ - Popsicle.mp3",
        img: 'images/2c.jpg'
    },
    {
        name: "Itro - Translucent",
        src: "songs/Unison - Translucent _NCS Release_.mp3",
        img: 'images/4.jpg'
    },
    {
        name: "Elektronomia - Energy",
        src: 'songs/Elektronomia - Energy.mp3',
        img: 'images/7.jpg'
    },
    {
        name: "Kontinuum - First Rain ",
        src: 'songs/Kontinuum - First Rain _NCS Release_.mp3',
        img: 'images/x.jpg'
    },
    {
        name: "Kygo - Stranger Things (feat. OneRepublic)",
        src: 'songs/Kygo - Stranger Things (feat. OneRepublic).mp3',
        img: 'images/3.jpg'
    },
    {
        name: "One Republic - Counting Stars",
        src: 'songs/One Republic - Counting Stars.mp3',
        img: 'images/5.jpg'
    },
];

const playlistLength = songs.length - 1;
let isClicked = false;
let currentSong = 0;

const playAudio = () => {

    if (audio.paused) {
        audio.play();
        icon.classList.replace('fa-play', 'fa-pause');
    } else {
        audio.pause();
        icon.classList.replace('fa-pause', 'fa-play');
    }

}

const rewindAudio = () => {
    // Set audio time depending on which part of progress bar was pressed
    const audioTime = (e.offsetX / progressContainer.offsetWidth) * audio.duration;
    audio.currentTime = audioTime;
}

const checkProgress = () => {
    // Update the timeline when song is playing
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
}

const changeVolume = () => {
    if (isClicked) {
        audio.volume = volume.value / 100;
    }
}

const nextSong = () => {
    if (currentSong < playlistLength) {
        currentSong++;
    } else {
        currentSong = 0;
    }
    changeSong();
}

const prevSong = () => {
    if (currentSong > 0) {
        currentSong--;
    } else {
        currentSong = playlistLength;
    }
    changeSong();
}

const changeSong = () => {
    audio.src = songs[currentSong].src;
    songContainer.innerHTML = songs[currentSong].name;
    progress.style.width = '0';
    changeBackground(currentSong);
    if (icon.classList.contains('fa-pause')) {
        audio.play();
    }
}

const changeBackground = () => {
    // Add timeouts to create fading effect
    changingDiv.style.opacity = '0';
    setTimeout(() => {
        changingDiv.style.backgroundImage = `url(${songs[song].img})`;
    }, 500)
    setTimeout(() => {
        changingDiv.style.opacity = '1';
    }, 800);

}

window.addEventListener('load', () => {
    songContainer.innerHTML = songs[currentSong].name;
    changingDiv.style.backgroundImage = `url(${songs[currentSong].img})`;

});
audio.addEventListener('timeupdate', checkProgress);
progressContainer.addEventListener('click', rewindAudio);
volume.addEventListener('mousedown', changeVolume);
volume.addEventListener('mousemove', changeVolume);
volume.addEventListener('mousedown', () => isClicked = true);
volume.addEventListener('mouseup', () => isClicked = false);
pause.addEventListener('click', playAudio);
skipNext.addEventListener('click', nextSong);
skipPrev.addEventListener('click', prevSong);