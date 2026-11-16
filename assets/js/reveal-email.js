// "Click to show email" link in the sidebar.
// The address is stored as two reversed halves in data attributes. Clicking
// the link opens an "I'm not a robot" popup centered above it; ticking the
// box assembles the address and turns the link into a mailto link.
(function () {
	var reverse = function (s) { return s.split('').reverse().join(''); };

	function reveal(link) {
		var address = reverse(link.dataset.u) + '@' + reverse(link.dataset.d);
		link.textContent = address;
		link.href = 'mailto:' + address;
		link.dataset.revealed = 'true';
	}

	function open(link) {
		var host = link.parentNode;
		if (host.querySelector('.human-check-pop')) return;

		var pop = document.createElement('div');
		pop.className = 'human-check-pop';
		pop.setAttribute('role', 'dialog');
		pop.setAttribute('aria-label', 'Verification');
		pop.innerHTML =
			'<label class="human-check-row">' +
				'<input type="checkbox" />' +
				'<span class="human-check-mark" aria-hidden="true"></span>' +
				'<span>I\'m not a robot</span>' +
			'</label>';
		host.classList.add('human-check-host');
		host.appendChild(pop);

		// Center above the link text; the arrow sits in the middle.
		var hostBox = host.getBoundingClientRect();
		var linkBox = link.getBoundingClientRect();
		pop.style.left = (linkBox.left - hostBox.left + linkBox.width / 2 - pop.offsetWidth / 2) + 'px';
		pop.style.top = (linkBox.top - hostBox.top - pop.offsetHeight - 12) + 'px';

		var checkbox = pop.querySelector('input');
		var mark = pop.querySelector('.human-check-mark');

		function close() {
			pop.remove();
			document.removeEventListener('click', onOutside, true);
			document.removeEventListener('keydown', onKey);
		}
		function onOutside(event) {
			if (checkbox.disabled || pop.contains(event.target)) return;
			if (event.target === link) { event.preventDefault(); event.stopPropagation(); }
			close();
		}
		function onKey(event) {
			if (event.key === 'Escape' && !checkbox.disabled) { close(); link.focus(); }
		}

		// Checkbox -> spinner -> green check -> half a second -> email.
		checkbox.addEventListener('change', function () {
			if (!checkbox.checked) return;
			checkbox.disabled = true;
			mark.className = 'human-check-mark is-loading';
			setTimeout(function () {
				mark.className = 'human-check-mark is-done';
				setTimeout(function () { reveal(link); close(); }, 500);
			}, 900);
		});

		setTimeout(function () {
			document.addEventListener('click', onOutside, true);
			document.addEventListener('keydown', onKey);
		}, 0);
		checkbox.focus({ preventScroll: true });
	}

	document.querySelectorAll('.reveal-email').forEach(function (link) {
		link.addEventListener('click', function (event) {
			if (link.dataset.revealed) return; // after reveal, it's a normal mailto link
			event.preventDefault();
			open(link);
		});
	});
})();
