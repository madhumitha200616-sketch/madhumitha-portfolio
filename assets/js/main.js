/* Mark JS as available so reveal animations only apply when scripts run */
document.documentElement.classList.add('js')

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* 3D effects only when the browser supports them and motion is allowed; otherwise the flat layout is used */
const supports3d = !!(window.CSS && CSS.supports &&
   CSS.supports('transform-style', 'preserve-3d') && CSS.supports('perspective', '1px'))
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
if(supports3d && !reduceMotion) document.documentElement.classList.add('has-3d')

/*=============== SHOW & CLOSE MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Show menu */
if(navToggle){
   navToggle.addEventListener('click', () =>{
      navMenu.classList.add('show-menu')
      navToggle.setAttribute('aria-expanded', 'true')
   })
}

/* Hide menu */
if(navClose){
   navClose.addEventListener('click', () =>{
      navMenu.classList.remove('show-menu')
      if(navToggle) navToggle.setAttribute('aria-expanded', 'false')
   })
}

/*=============== REMOVE MOBILE MENU ===============*/
const navLink = document.querySelectorAll('.nav__link, .nav__contact')

const linkAction = () =>{
   const navMenu = document.getElementById('nav-menu')
   // When we click on each nav__link, we remove the show-menu class
   navMenu.classList.remove('show-menu')
   if(navToggle) navToggle.setAttribute('aria-expanded', 'false')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== HOME TYPED TEXT (vanilla) ===============*/
const typedEl = document.getElementById('home-typed')

if(typedEl){
   const roles = (typedEl.dataset.roles || '').split('|').filter(Boolean)

   if(roles.length > 1 && !reduceMotion){
      let roleIndex = 0, charIndex = roles[0].length, deleting = true

      const tick = () =>{
         const role = roles[roleIndex]
         typedEl.textContent = role.slice(0, charIndex)

         let delay = deleting ? 40 : 80

         if(!deleting && charIndex === role.length){
            deleting = true
            delay = 1800
         }else if(deleting && charIndex === 0){
            deleting = false
            roleIndex = (roleIndex + 1) % roles.length
            delay = 300
         }else{
            charIndex += deleting ? -1 : 1
         }
         setTimeout(tick, delay)
      }
      setTimeout(tick, 1800)
   }
}

/*=============== CHANGE HEADER STYLES + SHOW SCROLL UP ===============*/
const header = document.getElementById('header'),
      scrollUp = document.getElementById('scroll-up')

const progressBar = document.getElementById('scroll-progress')

const onScroll = () =>{
   header.classList.toggle('bg-header', window.scrollY >= 50)
   if(scrollUp) scrollUp.classList.toggle('show-scroll', window.scrollY >= 350)
   if(progressBar){
      const max = document.documentElement.scrollHeight - window.innerHeight
      progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')'
   }
}
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('main section[id]')

const setActiveLink = () =>{
   const scrollY = window.scrollY + 120
   let currentId = sections[0] ? sections[0].id : ''

   sections.forEach(section =>{
      if(scrollY >= section.offsetTop) currentId = section.id
   })

   document.querySelectorAll('.nav__link').forEach(link =>{
      link.classList.toggle('active-link', link.getAttribute('href') === '#' + currentId)
   })
}
window.addEventListener('scroll', setActiveLink, { passive: true })
setActiveLink()

/*=============== REVEAL ON SCROLL (vanilla) ===============*/
const revealItems = document.querySelectorAll('.reveal')

if('IntersectionObserver' in window && !reduceMotion){
   const observer = new IntersectionObserver((entries) =>{
      entries.forEach(entry =>{
         if(entry.isIntersecting){
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
         }
      })
   }, { threshold: 0.12 })

   revealItems.forEach(item => observer.observe(item))
}else{
   revealItems.forEach(item => item.classList.add('revealed'))
}

/*=============== FOOTER YEAR ===============*/
const yearEl = document.getElementById('year')
if(yearEl) yearEl.textContent = new Date().getFullYear()

/*=============== HERO 3D: pointer depth + pause when off-screen ===============*/
const scene = document.getElementById('home-scene'),
      stage = document.getElementById('home-stage'),
      homeSection = document.getElementById('home')

if(scene && stage && document.documentElement.classList.contains('has-3d')){
   if('IntersectionObserver' in window){
      new IntersectionObserver(([entry]) =>{
         scene.classList.toggle('paused', !entry.isIntersecting)
      }).observe(scene)
   }

   if(finePointer && homeSection){
      let raf = 0
      homeSection.addEventListener('pointermove', (e) =>{
         if(raf) return
         raf = requestAnimationFrame(() =>{
            const r = scene.getBoundingClientRect()
            const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / window.innerWidth * 2))
            const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / window.innerHeight * 2))
            stage.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg')
            stage.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg')
            raf = 0
         })
      })
      homeSection.addEventListener('pointerleave', () =>{
         stage.style.setProperty('--ry', '0deg')
         stage.style.setProperty('--rx', '0deg')
      })
   }
}

/*=============== PROJECT CARDS: subtle 3D tilt ===============*/
if(document.documentElement.classList.contains('has-3d') && finePointer){
   document.querySelectorAll('[data-tilt]').forEach(card =>{
      let raf = 0

      card.addEventListener('pointermove', (e) =>{
         if(raf) return
         raf = requestAnimationFrame(() =>{
            const r = card.getBoundingClientRect()
            const px = (e.clientX - r.left) / r.width
            const py = (e.clientY - r.top) / r.height
            card.style.transition = 'transform .12s ease-out, border-color .4s'
            card.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 7).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 9).toFixed(2) + 'deg) translateY(-4px)'
            card.style.setProperty('--mx', (px * 100).toFixed(1) + '%')
            card.style.setProperty('--my', (py * 100).toFixed(1) + '%')
            raf = 0
         })
      })

      card.addEventListener('pointerleave', () =>{
         card.style.transition = 'transform .5s ease, border-color .4s'
         card.style.transform = ''
      })
   })
}

/*=============== HOME TEXT CIRCULAR (original) ===============*/
const homeText = document.getElementById('home-text')

if(homeText){
   const letters = homeText.textContent.trim().split(''),
         angleStep = 360 / letters.length
   homeText.textContent = ' '

   letters.forEach((char, i) =>{
      const span = document.createElement('span')
      span.textContent = char
      span.style.transform = 'rotate(' + (i * angleStep) + 'deg)'
      homeText.appendChild(span)
   })
}

/*=============== CUSTOM CURSOR (original) ===============*/
const cursor = document.querySelector('.cursor')

if(cursor && finePointer){
   document.addEventListener('mousemove', (e) =>{
      cursor.classList.add('cursor--on')
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
   })

   document.querySelectorAll('a').forEach(item =>{
      item.addEventListener('mouseover', () => cursor.classList.add('hide-cursor'))
      item.addEventListener('mouseleave', () => cursor.classList.remove('hide-cursor'))
   })
}

/*=============== SWIPER WORK (same settings as the original portfolio) ===============*/
if(typeof Swiper !== 'undefined'){
   const swiperWork = new Swiper('.work__swiper',{
      loop: true,
      spaceBetween: 24,
      slidesPerView: 'auto',
      grabCursor: true,
      speed: 600,

      pagination:{
         el: '.swiper-pagination',
         clickable: true,
      },
      autoplay: {
         delay: 3000,
         disableOnInteraction: false,
      }
   })
}else{
   // Swiper could not be loaded: keep the cards in a horizontal, scrollable row
   const workSwiper = document.querySelector('.work__swiper')
   if(workSwiper) workSwiper.classList.add('work__swiper--static')
}
