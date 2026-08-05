/* ===========================================================================
   Meridian help center - small site enhancements

   This file adds two things Flare does not provide for HTML5 output:

     1. The "On this page" list in the right-hand panel. It is built from the
        headings in the topic, and highlights the section being read.
     2. A collapse button for that panel, remembered between pages.

   It is deliberately self-contained and defensive. If anything in here fails,
   the page still works: the navigation, search, breadcrumbs and footer are all
   plain HTML built by Flare and do not depend on this file.

   The only Flare-generated names it relies on are the content container
   (#mc-main-content) and the two layout panes (.body-container and
   .sidenav-wrapper). If a future Flare release renames those, the panels stop
   appearing but nothing breaks - see MAINTENANCE.md.
   =========================================================================== */

(function () {
	'use strict';

	var STORE_ASIDE = 'meridian.asideCollapsed';

	/* localStorage is unavailable on some locked-down browsers and in some
	   file:// contexts, so every access is guarded. */
	function readFlag(key) {
		try { return window.localStorage.getItem(key) === '1'; }
		catch (e) { return false; }
	}

	function writeFlag(key, value) {
		try { window.localStorage.setItem(key, value ? '1' : '0'); }
		catch (e) { /* ignore - the choice just will not persist */ }
	}

	function slugify(text, used) {
		var base = text.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '') || 'section';
		var candidate = base;
		var n = 2;
		while (used[candidate]) { candidate = base + '-' + n; n++; }
		used[candidate] = true;
		return candidate;
	}

	/* On wide screens Flare scrolls .body-container rather than the window.
	   Below 1280px it reverts to normal page scrolling. Rather than assume
	   either, find whichever element actually scrolls. */
	function findScroller(el) {
		var node = el.parentElement;
		while (node && node !== document.body) {
			var overflowY = window.getComputedStyle(node).overflowY;
			if (overflowY === 'auto' || overflowY === 'scroll') { return node; }
			node = node.parentElement;
		}
		return null; /* null means the window scrolls */
	}

	function buildOnThisPage() {
		var body = document.querySelector('.topic-body');
		var aside = document.querySelector('.topic-aside');
		var list = document.querySelector('.on-this-page');
		if (!body || !aside || !list) { return; }

		var headings = body.querySelectorAll('h2, h3');
		var used = {};
		var entries = [];
		var i;

		for (i = 0; i < headings.length; i++) {
			var heading = headings[i];
			if (!heading.textContent.trim()) { continue; }
			if (!heading.id) { heading.id = slugify(heading.textContent, used); }
			else { used[heading.id] = true; }
			entries.push(heading);
		}

		/* One heading is not worth a panel. Hide it and let the topic use the
		   full width. */
		if (entries.length < 2) {
			document.documentElement.classList.add('no-on-this-page');
			return;
		}

		var scroller = findScroller(body);

		for (i = 0; i < entries.length; i++) {
			var target = entries[i];
			var link = document.createElement('a');
			link.href = '#' + target.id;
			link.textContent = target.textContent.trim();
			link.className = target.tagName === 'H3' ? 'otp-link otp-sub' : 'otp-link';

			/* Scroll ourselves rather than letting the browser jump, so the
			   heading is not hidden under the sticky header. */
			link.addEventListener('click', function (heading) {
				return function (event) {
					event.preventDefault();
					var top = heading.offsetTop - 12;
					if (scroller) { scroller.scrollTo({ top: top, behavior: 'smooth' }); }
					else { window.scrollTo({ top: heading.getBoundingClientRect().top + window.pageYOffset - 90, behavior: 'smooth' }); }
					if (history.replaceState) { history.replaceState(null, '', '#' + heading.id); }
				};
			}(target));

			list.appendChild(link);
		}

		highlightWhileScrolling(entries, list, scroller);
	}

	function highlightWhileScrolling(headings, list, scroller) {
		var links = list.querySelectorAll('.otp-link');
		var ticking = false;

		function update() {
			ticking = false;
			var reference = scroller
				? scroller.getBoundingClientRect().top + 80
				: 100;
			var active = 0;
			for (var i = 0; i < headings.length; i++) {
				if (headings[i].getBoundingClientRect().top <= reference) { active = i; }
			}
			for (var j = 0; j < links.length; j++) {
				if (j === active) { links[j].classList.add('selected'); }
				else { links[j].classList.remove('selected'); }
			}
		}

		function onScroll() {
			if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
		}

		(scroller || window).addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		update();
	}

	function wireToggle(button, key, htmlClass, labelWhenOpen, labelWhenClosed) {
		if (!button) { return; }
		var root = document.documentElement;

		function apply(collapsed) {
			if (collapsed) { root.classList.add(htmlClass); }
			else { root.classList.remove(htmlClass); }
			button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
			button.setAttribute('title', collapsed ? labelWhenClosed : labelWhenOpen);
			button.setAttribute('aria-label', collapsed ? labelWhenClosed : labelWhenOpen);
		}

		apply(readFlag(key));

		button.addEventListener('click', function () {
			var collapsed = !root.classList.contains(htmlClass);
			apply(collapsed);
			writeFlag(key, collapsed);
		});
	}

	function start() {
		/* Tells the stylesheet the buttons are safe to show. */
		document.documentElement.classList.add('js-ready');

		buildOnThisPage();

		wireToggle(
			document.querySelector('.aside-toggle'),
			STORE_ASIDE, 'aside-collapsed',
			'Hide this panel', 'Show this panel'
		);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', start);
	} else {
		start();
	}
}());
