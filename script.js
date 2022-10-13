const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const copyLinkBtn = document.getElementById('copyLinkBtn');
const downloadBtn = document.getElementById('downloadBtn');
const imgContainerDiv = document.getElementById('imgContainerDiv');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const reloadBtn = document.getElementById('reloadBtn');

let slides = [];
let searchTerm = ''
const duration = 300;
const SLIDES_PER_SCREEN = 3;
let currentSlideIndex = 0;

// Classes
const commonClass = 'overflow-hidden flex justify-center items-center text-5xl transition-all absolute rounded-2xl cursor-pointer shadow-xl select-none'
const leftSlideDisappearClass = `${commonClass} duration-[${duration}ms] w-[10%] h-[10%] -left-[10%] top-[50%] -translate-x-[50%] -translate-y-[50%] opacity-0`;
const leftSlideClass = `${commonClass} duration-[${duration}ms] w-[10%] h-[10%] left-[10%] top-[50%] -translate-x-[50%] -translate-y-[50%] opacity-50`;
const centerSlideClass = `${commonClass} duration-[${duration}ms] w-[60%] h-[60%] left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-10 `;
const rightSlideClass = `${commonClass} duration-[${duration}ms] w-[10%] h-[10%] left-[90%] top-[50%] -translate-x-[50%] -translate-y-[50%] opacity-50`;
const rightSlideDisappearClass = `${commonClass} duration-[${duration}ms] w-[10%] h-[10%] left-[110%] top-[50%] -translate-x-[50%] -translate-y-[50%] opacity-0`;

const centerSlideZoomedClass = `${commonClass} duration-[${duration}ms] w-[100%] h-[100%] left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%] z-10 rounded-none shadow-none`;

const imgClass = `h-full w-full object-cover pointer-events-none`;

const createBackDrop = () => {
    const backDiv = document.createElement('div');
    backDiv.id = 'backDrop'
    backDiv.className = 'absolute bg-black left-0 top-0 right-0 bottom-0 opacity-90 z-[2]';
    document.body.append(backDiv)
}
const removeBackDrop = () => {
    const backDiv = document.getElementById('backDrop');
    if(backDiv) backDiv.remove()
}

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


        if (elem.classList == centerSlideZoomedClass) {
            removeBackDrop();
            elem.classList.add('opacity-0')
            elem.querySelector('img').classList.replace('object-contain', 'object-cover')
            elem.classList = centerSlideClass;
            elem.classList.remove('opacity-0')

        }
        else { 
            createBackDrop()
            elem.classList.add('opacity-0')
            elem.querySelector('img').src = slides[currentSlideIndex].largeImageURL;
            elem.querySelector('img').classList.replace('object-cover', 'object-contain')
            elem.classList.remove('opacity-0')
            elem.classList = centerSlideZoomedClass; 
        }
     })

    clone = rightDiv.cloneNode(true);
    rightDiv.replaceWith(clone)
    clone.addEventListener('click', showNext)
}

const setImagesToObjectCover = () => {
    const images = imgContainerDiv.querySelectorAll('img');
    images.forEach( img => img.classList.replace('object-contain', 'object-cover'))
}

const showNext = () => {
    if (!window.animatingSlides){
        removeBackDrop()
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
            setImagesToObjectCover()
        }, duration);
    }
}
const showPrev = () => {
    if (!window.animatingSlides){
        removeBackDrop();
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
    img.src= slides[index].webformatURL
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
        const wordResponse = await fetch('./assets/jsons/countries.json')
        const data = await wordResponse.json();
        const randomIndex = Math.floor(Math.random() * (data.length - 0 + 1)) + 0;
        const randomCountry = data[randomIndex].name
        searchInput.value = randomCountry
        searchTerm = randomCountry
    }

    const response = await fetch(`https://pixabay.com/api/?key=14648474-f85b08a1dc4b9a00f47b281de&q=${searchTerm.split(' ').join('+')}&image_type=photo&pretty=true`)
    const data = await response.json()
    if (data.hits.length === 0)
    {
        showNoResults();
        return
    }
    slides = data.hits;
    createInitialSlides()
}

const copyLink = () => {
    navigator.clipboard.writeText(slides[currentSlideIndex].largeImageURL)
    
}

const download = () => {
    var gh = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADNQTFRFAAAAPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09EvTTBAAAABB0Uk5TAA8fLz9PX29/j5+vv8/f7/rfIY4AAARsSURBVHja7VvZkusqDAyrAQvQ/3/teZjExrHDZoGrbl0/z0RtLY1oya/X/8+Nh/NHzYuAGPRz9llERET1GACJiIgYngaAkmvNnwTgERHtgwDefngawDofgDkAwPlp4I4AzHQA/gggstk0jF/P7ELQ3wBQPBoBRPRzTyI8P/bBGvh79FMstFXCvDSAt0kHzyBYNv7jj/iAx48DEiwzEfj0AFi/EEw4F+2B/5mfXQsbB4ZDQOKGwM2ioE+4hUdEm3jCjzybRbw4gIXkrxfbySnqCfYhS48rG23fs/wRGYdcGIQv1PsOcIgTkp//xTcs4WbyTEjs67pmFfh8+3+X1s0Jy3z7rxezaZ9EdTjI2MC1MpA37LqN65kjdoJuPmtUUpC40NmvLy2WntM3OcH09RupE8KdMLjefufgBE1gvz2blnj/2pDY7wikSPold9M+dCVSWpDuln1HUMLuCfsHEndP2H+9uO+kJEfVaicNq+zin9udxY6gQcrRlFeNHUG1oCfpjpIjAtmaukQXHRabpJwdMNlFSzZFdL3Dv4WkrlH4lyH6Y6jOgj0BSPUGWV0InrQAztISr2UgahFe1r3XJgHRC9C+qhK3CqC/4H6Sm1XV64ApCKt5NegOgFTGGGPMIlnhx22NA64zhUsppTxVMtcuvY5hcCqX31DhgAu+EgZ+WLjSjoPJvF6mBH5lIFvC7wHBJ7kAAAByjFdkAvdDg0o7/PPByiOCSSIvbfhBo6HExvES/ftwjOs7v7iyoZCl0qhMhHWpDQoX9QvH/xJd+osriAbr9ZktEQONCm3yAD5EEU833YWIlgsA1PD5UwGAGz4DLAAIw0eAeQBs/CTaZi2o8VNYyAIwP2qAHsCSZYGR6xD5xtgPTwGeBzB+I0Xlj+Oajo2kCEK+GRqfg2sWwEAaKhCNLDdsRCkgnwLg8kEeDyDmLQwHoAp3w+EA1kJPPBoAL6lEYnAZmuLtfCwRbToZLwEYNP7X5Vs33NEFuI15BS6U7+auuydmGkoKXI1Kt9RlIZPHIIllLbfzWwboCm2AF480b7WUQkipDWySkhPlg7ggU9apWPFqkWzV2TZC1Am1a1UMltMWW8F6Xve4qpRCX86U3ZQkcEtFF79UKtW8RSJnsvr+IDK7N23HRScH+mrtWQ/RCF3D+DYOaM337bOKftvQ78iKps3fjbDIrkeX22cVLqAKAovVFfD1DzRi/V4AgbWmDMW8ivmO7Qto9FlV/FvGr5xsZilj3/hXI00UTPcKi6PYgkrXR5qnb/72ZuRho03fSF5E1xOGg7qvb5VPz2akTmcbnT48LExDCysycxitdGfRcWUbar2gvj59cDfqyH3NoMpNyt+k5r77t1B+tb/eZNzJtTt1y+4umXM49b9g1AmFUPvloDdzqsppDweA/RuSOoDLv6D7GvRAKPUP5ceo3DWbX4nFXm5iy8ubEfqCWiut22HDDqZcyBuP6zL6s0euLVzbBqunfWbFpTZmhfdjjVFy9seO/6nnH0Mpp/3TjvofAAAAAElFTkSuQmCC"

    var a  = document.createElement('a');
    a.href = gh;
    a.download = 'image.png';

    a.click()
}

const reload = () => {
    searchInput.value = '';
    reload();
}

imgContainerDiv.addEventListener('touchstart', handleTouchStart, false);        
imgContainerDiv.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     
                                                                         
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                
                                                                         
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            showNext() 
        } else {
            showPrev()
        }                       
    } else {
        if ( yDiff > 0 ) {
            //Swipe Down
        } else { 
            //Swipe Up
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};


// Resize hack for mobile Safari for 100vh
const resizeVh = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
resizeVh();
//



nextBtn.addEventListener('click', showNext)
prevBtn.addEventListener('click', showPrev)
searchForm.addEventListener('submit', search)
copyLinkBtn.addEventListener('click', copyLink)
downloadBtn.addEventListener('click', download)
reloadBtn.addEventListener('click', reload)
document.body.addEventListener('resize', resizeVh)

// Make Initial Search
search()



