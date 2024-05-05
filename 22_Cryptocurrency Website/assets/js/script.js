function _classPrivateFieldGet(receiver, privateMap) {var descriptor = privateMap.get(receiver);if (!descriptor) {throw new TypeError("attempted to get private field on non-instance");}if (descriptor.get) {return descriptor.get.call(receiver);}return descriptor.value;}function _classPrivateMethodGet(receiver, privateSet, fn) {if (!privateSet.has(receiver)) {throw new TypeError("attempted to get private field on non-instance");}return fn;}var _togglerBtn = new WeakMap();var _togglerContent = new WeakMap();var _activeClassName = new WeakMap();var _onInit = new WeakSet();class NavbarToggler {




  constructor() {_onInit.add(this);_togglerBtn.set(this, { writable: true, value: document.querySelector(".navbar-toggler") });_togglerContent.set(this, { writable: true, value: document.querySelector(".navbar-toggle-content") });_activeClassName.set(this, { writable: true, value: "open" });
    _classPrivateMethodGet(this, _onInit, _onInit2).call(this);
  }

  close() {
    _classPrivateFieldGet(this, _togglerBtn).classList.remove(_classPrivateFieldGet(this, _activeClassName));
    _classPrivateFieldGet(this, _togglerContent).classList.remove(_classPrivateFieldGet(this, _activeClassName));
  }

  toggle() {
    _classPrivateFieldGet(this, _togglerBtn).classList.toggle(_classPrivateFieldGet(this, _activeClassName));
    _classPrivateFieldGet(this, _togglerContent).classList.toggle(_classPrivateFieldGet(this, _activeClassName));
  }}var _onInit2 = function _onInit2()

{
  _classPrivateFieldGet(this, _togglerBtn).addEventListener("click", () => this.toggle());
};var _navbar = new WeakMap();var _activeClassName2 = new WeakMap();var _onInit3 = new WeakSet();var _setLinksEventListener = new WeakSet();


class Navbar {



  constructor(toggler) {_setLinksEventListener.add(this);_onInit3.add(this);_navbar.set(this, { writable: true, value: document.querySelector(".navbar") });_activeClassName2.set(this, { writable: true, value: "active" });
    this.toggler = toggler;
    _classPrivateMethodGet(this, _onInit3, _onInit4).call(this);
  }

  setActive() {
    _classPrivateFieldGet(this, _navbar).classList.add(_classPrivateFieldGet(this, _activeClassName2));
  }

  removeActive() {
    _classPrivateFieldGet(this, _navbar).classList.remove(_classPrivateFieldGet(this, _activeClassName2));
  }}var _onInit4 = function _onInit4()

{
  _classPrivateMethodGet(this, _setLinksEventListener, _setLinksEventListener2).call(this);
};var _setLinksEventListener2 = function _setLinksEventListener2()

{
  const linksList = document.querySelectorAll(".navbar a[data-anchor-link]");

  linksList.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();

      this.toggler.close();

      if (!link.getAttribute("href") || link.getAttribute("href") === "#") {
        return;
      }

      const section = document.querySelector(link.getAttribute("href"));

      window.scrollTo({
        top: section.offsetTop - _classPrivateFieldGet(this, _navbar).offsetHeight,
        behavior: "smooth" });

    });
  });
};


const navbarToggler = new NavbarToggler();
const navbar = new Navbar(navbarToggler);

window.addEventListener("scroll", () => {
  const heightActivateState = 400;
  const scrolled = window.pageYOffset || document.documentElement.scrollTop;

  if (scrolled > heightActivateState) {
    navbar.setActive();
  } else {
    navbar.removeActive();
  }
});