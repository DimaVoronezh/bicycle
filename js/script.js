window.addEventListener('DOMContentLoaded', () => {
	ibg();
	burgerMenu();
	initScreen();
	window.addEventListener('resize', initScreen);
	slider({
		dots: true,
		scrollByMouse: false,
		dragByMouse: false,
		scrollByTouch: true,
		dragByTouch: true,
		transitionDuration: 1000,
		transitionProperty: 'ease-in-out',
		adaptiveHeight: true,
		autoPlay: true,
		autoPlayingInterval: 5000,
		waitForAnimation: false
	});
	window.addEventListener('resize', slider);
	placeholderInputs();



	function placeholderInputs() {
		let input = document.querySelector('.form_input');
		let prevPlaceholder = input.placeholder;
		input.addEventListener('focus', () => {
			input.placeholder = '';
		});
		input.addEventListener('blur', () => {
			input.placeholder = prevPlaceholder;
		});
	}


	function slider(obj) {
		const startSettings = {
			dots: true,
			scrollByMouse: true,
			dragByMouse: true,
			scrollByTouch: true,
			dragByTouch: true,
			transitionDuration: 1000,
			transitionProperty: 'ease-in-out',
			adaptiveHeight: true,
			autoPlay: true,
			autoPlayingInterval: 5000,
			waitForAnimation: true
		};
		let {
			dots,
			scrollByMouse,
			scrollByTouch,
			dragByTouch,
			dragByMouse,
			transitionDuration,
			transitionProperty,
			adaptiveHeight,
			autoPlay,
			autoPlayingInterval,
			waitForAnimation
		} = obj || startSettings;

		let inner = document.querySelector('.slider_inner');
		let wrapper = document.querySelector('.slider_wrapper');

		let slides = document.querySelectorAll('.slider_item');
		let widthSlide = window.getComputedStyle(wrapper).width.replace(/\D/gi, '');
		let btnsWrapper = document.querySelector('.slider_btns');

		let btns = [];
		let currentSlide = 0;
		let startPos;
		let endPos;
		let timer;
		let canClickToNextSlide = true;

		// почему то высота сначала равна меньшему числу, чем при клике на этот же элемент WTF???
		inner.style.width = slides.length * widthSlide + 'px';

		slides.forEach((item, i) => {
			item.style.flex = `1 1 ${widthSlide + 'px'}`;

			// создаю кнопки слайдера
			if (dots) {
				let btn = document.createElement('li');
				if (i == 0) {
					btn.classList.add('active');
				}
				btn.classList.add('slider_btn');
				btnsWrapper.append(btn);
				btns.push(btn);
			}
		});

		if (adaptiveHeight) {
			let heightInner = window.getComputedStyle(slides[0]).height.replace(/\D/gi, '');
			inner.style.height = +heightInner + 13 + 'px';
		}



		if (dots) {
			btns.forEach((item, i) => {
				item.addEventListener('click', function () {
					if (canClickToNextSlide === false) {
						return;
					}
					currentSlide = i;
					btns.forEach(btn => {
						btn.classList.remove('active');
					});
					item.classList.add('active');

					if (adaptiveHeight) {
						adaptiveHeightSlider();
					}
					if (autoPlay) {
						autoPlaying();
					}
					transitionsInner();
				});
			});
		}

		if (autoPlay) {
			autoPlaying();
			inner.addEventListener('mouseenter', () => {
				clearInterval(timer);
			});
			inner.addEventListener('mouseleave', () => {
				autoPlaying();
			});
		}

		inner.addEventListener('touchstart', (e) => {
			startPos = e.touches[0].pageX;
			clearInterval(timer);
		});
		inner.addEventListener('touchend', (e) => {
			if (canClickToNextSlide === false) {
				return;
			}
			if (scrollByTouch) {
				endPos = e.changedTouches[0].pageX;
				if (endPos >= startPos + 150) {
					if (currentSlide != btns.length - 1) {
						currentSlide++;
					}
				} else if (endPos <= startPos - 150) {
					if (currentSlide != 0) {
						currentSlide--;
					}
				}
				activeBtnClass();
			}
			if (adaptiveHeight) {
				adaptiveHeightSlider();
			}
			if (autoPlay) {
				autoPlaying();
			}
			transitionsInner();
		});
		inner.addEventListener('touchmove', (e) => {
			if (canClickToNextSlide === false) {
				return;
			}
			if (dragByTouch) {
				let move = e.targetTouches[0].pageX - startPos;
				inner.style.transform = `translateX(-${currentSlide * widthSlide + move + 'px'})`;
			}
		});


		inner.addEventListener('mousedown', (e) => {
			if (canClickToNextSlide === false) {
				return;
			}
			startPos = e.pageX;
			if (dragByMouse) {
				inner.addEventListener('mousemove', mouseMove);
			}
			clearInterval(timer);
		})
		inner.addEventListener('mouseup', (e) => {
			if (canClickToNextSlide === false) {
				return;
			}
			if (scrollByMouse) {
				endPos = e.pageX;
				if (endPos >= startPos + 150) {
					if (currentSlide != btns.length - 1) {
						currentSlide++;
					}
				} else if (endPos <= startPos - 150) {
					if (currentSlide != 0) {
						currentSlide--;
					}
				}
				activeBtnClass();
			}
			if (adaptiveHeight) {
				adaptiveHeightSlider();
			}
			if (autoPlay) {
				autoPlaying();
			}
			transitionsInner();
			if (dragByMouse) {
				inner.removeEventListener('mousemove', mouseMove);
			}
		});



		function autoPlaying() {
			clearInterval(timer);
			timer = setTimeout(() => {
				if (currentSlide != slides.length - 1) {
					currentSlide++;
				} else {
					currentSlide = 0;
				}
				activeBtnClass();
				transitionsInner();
				if (adaptiveHeight) {
					adaptiveHeightSlider();
				}
				autoPlaying();
			}, autoPlayingInterval);
		}

		function mouseMove() {
			let move = e.pageX - startPos;
			inner.style.transform = `translateX(-${currentSlide * widthSlide + move + 'px'})`;
		}

		function transitionsInner() {
			inner.style.transition = `${transitionDuration}ms all ${transitionProperty}`;
			inner.style.transform = `translateX(-${currentSlide * widthSlide + 'px'})`;
			if (waitForAnimation) {
				canClickToNextSlide = false;
				setTimeout(() => {
					canClickToNextSlide = true;
				}, transitionDuration);
			}
		}

		function adaptiveHeightSlider() {
			slides.forEach((slide, j) => {
				if (currentSlide == j) {
					let heightSlide = window.getComputedStyle(slide).height;
					inner.style.height = heightSlide;
				}
			})
		}

		function activeBtnClass() {
			btns.forEach((item, i) => {
				item.classList.remove('active');
				if (i == currentSlide) {
					item.classList.add('active');
				}
			});
		}
	}


	function initScreen() {
		let burger_page = document.querySelector('.burger_page');
		let menu_list = document.querySelector('.menu_list');
		let logo = document.querySelector('.main_logo');
		let fullscreen = document.querySelector('.fullscreen');
		if (document.documentElement.clientWidth <= 630) {
			burger_page.append(menu_list);
			fullscreen.append(logo);
		} else {
			menu_list.append(logo);
			fullscreen.append(menu_list);
		}
	}


	function burgerMenu() {
		let burger = document.querySelector('.burger_menu');
		let burger_page = document.querySelector('.burger_page');
		burger.addEventListener('click', () => {
			burger.classList.toggle('active');
			burger_page.classList.toggle('active');
			document.body.classList.toggle('lock');
		});
	}


	function ibg() {
		let ibg = document.querySelectorAll('.ibg');
		for (let i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img')) {
				ibg[i].style.backgroundImage = `url(${ibg[i].querySelector('img').getAttribute('src')})`;
			}
		}
	}
});