console.log("working");

const themeSwitch = document.getElementById('theme-switch');
const body = document.body;

// Set the initial theme based on local storage
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark');
    themeSwitch.checked = true;
} else {
    body.classList.add('light');
}

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        body.classList.remove('light');
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark');
        body.classList.add('light');
        localStorage.setItem('theme', 'light');
    }
});

const getData = async (e) => {
    e.preventDefault();
    let query = document.getElementsByClassName("searchbar")[0].value;
    let id = '';

    if (query === '') {
        console.log("no url");
        return;
    }

    try {
        if (query.includes('watch?v=')) {
            id = query.split('=')[1];
            console.log('has');
        } else {
            let lastSlashIndex = query.lastIndexOf("/");
            let url = query.slice(0, lastSlashIndex + 1) + "=" + query.slice(lastSlashIndex + 1);
            id = url.split('=')[1];
            console.log(id);
        }
        console.log(id);
    } catch (error) {
        console.log('check your link again', error);
        return;
    }

    const url = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${id}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd40c265118mshdc90194a533aa99p18842bjsn18247c206e8e',
            'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        setData(result);
    } catch (error) {
        console.error(error);
    }
}

const setData = (data) => {
    let container = document.getElementsByClassName('container')[0];
    container.innerHTML = '';

    for (let i = 0; i < data.formats.length; i++) {
        let item = `
        <div class="item">
            <img src=${data.thumbnail[3].url} class="thumbnail" alt="">
            <div class="info">
                <p class="name">${data.title}</p>
                <div class="action">
                    <p class="video-resolution">${data.formats[i].qualityLabel}</p>
                    <a download=${data.formats[i].url} href=${data.formats[i].url}><img src="img/icons/download-svgrepo-com.svg" class="down-icon" alt=""></a>
                </div>
            </div>
        </div>`;
        container.innerHTML += item;
    }
}
