// --- AOS animation setup -----
AOS.init({
    duration: 800,
    easing: 'slide',
    once: true,
});

// ------ handle loading effect on user profile image upload ----------
const uploadImgBtn = document.querySelector('#uploadProfileImgBtn');
if (uploadImgBtn) {
    uploadImgBtn.addEventListener('click', function () {
        this.innerHTML =
            '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
    });
}

// ---------- handle the price range filer on the shop page ---------------
const rangeInput = document.querySelectorAll('.range-input input');
const priceInput = document.querySelectorAll('.price-input input');
const range = document.querySelector('.slider .progress');
const priceGap = 100;

priceInput.forEach((input) => {
    input.addEventListener('input', (e) => {
        const minPrice = parseInt(priceInput[0].value);
        const maxPrice = parseInt(priceInput[1].value);

        if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
            if (e.target.className === 'input-min') {
                rangeInput[0].value = minPrice;
                range.style.left =
                    ((minPrice / rangeInput[0].max) * 100).toString() + '%';
            } else {
                rangeInput[1].value = maxPrice;
                range.style.right =
                    (100 - (maxPrice / rangeInput[1].max) * 100).toString() +
                    '%';
            }
        }
    });
});

rangeInput.forEach((input) => {
    input.addEventListener('input', (e) => {
        const minVal = parseInt(rangeInput[0].value);
        const maxVal = parseInt(rangeInput[1].value);

        if (maxVal - minVal < priceGap) {
            if (e.target.className === 'range-min') {
                rangeInput[0].value = maxVal - priceGap;
            } else {
                rangeInput[1].value = minVal + priceGap;
            }
        } else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            range.style.left = ((minVal / rangeInput[0].max) * 100).toString() + '%';
            range.style.right = (100 - (maxVal / rangeInput[1].max) * 100).toString() + '%';
        }
    });
});
