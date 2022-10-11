let slides = [];
let searchTerm = ''


const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const imgContainerDiv = document.getElementById('imgContainerDiv');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

const duration = 300;
const SLIDES_PER_SCREEN = 3;

let currentSlideIndex = 0;

const commonClass = 'overflow-hidden flex justify-center items-center text-5xl transition-all absolute rounded-2xl cursor-pointer shadow-xl select-none'

const leftSlideDisappearClass = `${commonClass} duration-[${duration}ms] w-[10%] h-[10%] -left-[10%] top-[50%] -translate-x-[50%] -translate-y-[50%] opacity-0`;
const leftSlideClass = `${commonClass} duration-[${duration}ms] w-[10%] h-[10%] left-[10%] top-[50%] -translate-x-[50%] -translate-y-[50%] opacity-50`;
const centerSlideClass = `${commonClass} duration-[${duration}ms] w-[60%] h-[60%] left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-10`;
const rightSlideClass = `${commonClass} duration-[${duration}ms] w-[10%] h-[10%] left-[90%] top-[50%] -translate-x-[50%] -translate-y-[50%] opacity-50`;
const rightSlideDisappearClass = `${commonClass} duration-[${duration}ms] w-[10%] h-[10%] left-[110%] top-[50%] -translate-x-[50%] -translate-y-[50%] opacity-0`;

const centerSlideZoomedClass = `${commonClass} duration-[${duration}ms] w-[100%] h-[100%] left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-10 rounded-none`;

const imgClass = `h-full w-full object-cover pointer-events-none`;

const assignEventListeners = () => {
    const leftDiv = imgContainerDiv.querySelectorAll('div')[0];
    const centerDiv = imgContainerDiv.querySelectorAll('div')[1];
    const rightDiv = imgContainerDiv.querySelectorAll('div')[2];
    let clone;

    clone = leftDiv.cloneNode(true);
    leftDiv.replaceWith(clone)
    clone.addEventListener('click', showPrev)

    clone = centerDiv.cloneNode(true);
    centerDiv.replaceWith(clone)
    clone.addEventListener('click', (e)=>{
        const elem = e.target;
        if (elem.classList == centerSlideZoomedClass) elem.classList = centerSlideClass;
        else { elem.classList = centerSlideZoomedClass; }
     })

    clone = rightDiv.cloneNode(true);
    rightDiv.replaceWith(clone)
    clone.addEventListener('click', showNext)
}

const showNext = () => {
    if (!window.animatingSlides){
        currentSlideIndex++;
        if(currentSlideIndex > slides.length - 1 ) currentSlideIndex = 0;
        window.animatingSlides = true;
        const newDiv = document.createElement('div');
        imgContainerDiv.append(newDiv);
        newDiv.className = rightSlideDisappearClass;
        const imageIndexToLoad = currentSlideIndex + 1 > slides.length - 1 ? 0 : currentSlideIndex + 1; 
        newDiv.append(createImageFromSlides(imageIndexToLoad))


        imgContainerDiv.querySelectorAll('div')[0].classList = leftSlideDisappearClass;
        imgContainerDiv.querySelectorAll('div')[1].classList = leftSlideClass;
        imgContainerDiv.querySelectorAll('div')[2].classList = centerSlideClass;
        setTimeout(() => { newDiv.classList = rightSlideClass; }, 10);

        setTimeout(() => {
            imgContainerDiv.querySelectorAll('div')[0].remove()
            window.animatingSlides = false;
            assignEventListeners()
        }, duration);
    }
}
const showPrev = () => {
    if (!window.animatingSlides){
        window.animatingSlides = true;
        currentSlideIndex--;
        if(currentSlideIndex < 0 ) currentSlideIndex = slides.length - 1 ;
        const newDiv = document.createElement('div');
        imgContainerDiv.prepend(newDiv);
        newDiv.className = leftSlideDisappearClass;
        const imageIndexToLoad = currentSlideIndex - 1 < 0 ? slides.length - 1 : currentSlideIndex - 1 
        newDiv.append(createImageFromSlides(imageIndexToLoad))


        imgContainerDiv.querySelectorAll('div')[1].classList = centerSlideClass;
        imgContainerDiv.querySelectorAll('div')[2].classList = rightSlideClass;
        imgContainerDiv.querySelectorAll('div')[3].classList = rightSlideDisappearClass;
        setTimeout(() => { newDiv.classList = leftSlideClass; }, 10);

        setTimeout(() => {
            imgContainerDiv.querySelectorAll('div')[3].remove()
            window.animatingSlides = false;
            assignEventListeners()
        }, duration);
    }
}

const createImageFromSlides = (index) => {
    let img;
    img = document.createElement('img');
    img.src= slides[index]
    img.className = imgClass;
    return img;
}

const createInitialSlides = () => {
    imgContainerDiv.innerHTML = '';

    const leftSlideDiv = document.createElement('div');
    leftSlideDiv.className = leftSlideClass;
    leftSlideDiv.append(createImageFromSlides(currentSlideIndex - 1 < 0 ? slides.length - 1 : currentSlideIndex - 1));

    const centerSlideDiv = document.createElement('div');
    centerSlideDiv.className = centerSlideClass;
    centerSlideDiv.append(createImageFromSlides(currentSlideIndex))

    const rightSlideDiv = document.createElement('div');
    rightSlideDiv.className = rightSlideClass;
    rightSlideDiv.append(createImageFromSlides(currentSlideIndex + 1 > slides.length -1 ? 0 : currentSlideIndex + 1));


    imgContainerDiv.append(leftSlideDiv, centerSlideDiv, rightSlideDiv)
    assignEventListeners();
    
}

const showNoResults = () => {
    imgContainerDiv.innerHTML = '';

    const noResultsDiv = document.createElement('div');
    noResultsDiv.classList = 'text-slate-900 text-center mt-4'
    noResultsDiv.innerText = `Nothing found for "${searchTerm}"`

    imgContainerDiv.append(noResultsDiv)
}

const search = async (e) => {
    e?.preventDefault();
    if (searchInput?.value && searchInput?.value === searchTerm) return
    if (searchInput?.value ) { searchTerm = searchInput?.value }
    else { 
        const wordResponse = await fetch('https://random-word-api.herokuapp.com/word')
        const data = await wordResponse.json();
        searchInput.value = data[0]
        searchTerm = data[0]
    }

    const response = await fetch(`https://pixabay.com/api/?key=14648474-f85b08a1dc4b9a00f47b281de&q=${searchTerm.split(' ').join('+')}&image_type=photo&pretty=true`)
    const data = await response.json()
    if (data.hits.length === 0)
    {
        showNoResults();
        return
    }
    slides = data.hits.map(({ webformatURL }) => webformatURL)
    createInitialSlides()
}



search()

nextBtn.addEventListener('click', showNext)
prevBtn.addEventListener('click', showPrev)
searchForm.addEventListener('submit', search)


