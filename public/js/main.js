AOS.init({
	duration: 800,
	easing: 'slide',
	once: true
});

const uploadImgBtn = document.querySelector('#uploadProfileImgBtn');
if (uploadImgBtn) {
	uploadImgBtn.addEventListener('click', function () {
		this.innerHTML = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>';
	})
}
