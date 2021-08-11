import { galleryItems } from './app.js';

const gallery = document.querySelector('.js-gallery');
const lightbox = document.querySelector('.js-lightbox');
const lightboxImage = document.querySelector('.lightbox__image');
const lightboxOverlay = document.querySelector('.lightbox__overlay');
const lightboxCloseBtn = document.querySelector('[data-action="close-lightbox"]');

gallery.insertAdjacentHTML('beforeend', makeGalleryItemsMarkup(galleryItems));

gallery.addEventListener('click', onGalleryClick);

function makeGalleryItemsMarkup(items) {
  return items
    .map(
      ({ preview, original, description }) => `
    <li class="gallery__item">
      <a
        class="gallery__link"
        href="${original}"
      >
        <img
          class="gallery__image"
          src="${preview}"
          data-source="${original}"
          alt="${description}"
        />
      </a>
    </li>
    `,
    )
    .join('');
}

function onGalleryClick(e) {
  if (!e.target.classList.contains('gallery__image')) return;

  e.preventDefault();

  setLightboxImageSrc(e.target.dataset?.source, e.target.alt);
  toggleLightboxVisibility();
  addEventListeners();
}

function closeLightbox() {
  toggleLightboxVisibility();
  setLightboxImageSrc('', '');
  removeEventListeners();
}

function setLightboxImageSrc(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt;
}

function toggleLightboxVisibility() {
  lightbox.classList.toggle('is-open');
  document.body.classList.toggle('lightbox-open');
}

function addEventListeners() {
  lightbox.addEventListener('click', onLightboxClick);
  window.addEventListener('keydown', onKeydown);
}

function removeEventListeners() {
  lightbox.removeEventListener('click', onLightboxClick);
  window.removeEventListener('keydown', onKeydown);
}

function onLightboxClick(e) {
  switch (e.target) {
    case lightboxOverlay:
    case lightboxCloseBtn:
      closeLightbox();
      break;
    case lightboxImage:
      setNextImage();
      break;
  }
}

function onKeydown(e) {
  switch (e.code) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowRight':
      setNextImage();
      break;
    case 'ArrowLeft':
      setPrevImage();
      break;
  }
}

function setNextImage() {
  let nextImageIdx = getCurrentLightboxImageIdx() + 1;

  if (nextImageIdx >= gallery.childElementCount) {
    nextImageIdx = 0;
  }

  setLightboxImageSrc(
    galleryItems[nextImageIdx].original,
    galleryItems[nextImageIdx].description,
  );
}

function setPrevImage() {
  let prevImageIdx = getCurrentLightboxImageIdx() - 1;

  if (prevImageIdx < 0) {
    prevImageIdx = gallery.childElementCount - 1;
  }

  setLightboxImageSrc(
    galleryItems[prevImageIdx].original,
    galleryItems[prevImageIdx].description,
  );
}

function getCurrentLightboxImageIdx() {
  return galleryItems.findIndex(item => item.original === lightboxImage.src);
}
