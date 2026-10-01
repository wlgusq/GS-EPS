$(document).ready(function() {

  // 헤더 올라가기
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('header').outerHeight();

  $(window).scroll(function(event){
    // 1750px 이상일 때만 스크롤 감지 활성화
    if (window.innerWidth >= 1750) {
      didScroll = true;
    } else {
      // 1750px 미만으로 줄어들면 헤더를 무조건 보이게 처리
      didScroll = false;
      $('header').removeClass('nav-up');
    }
  });

  setInterval(function(){
    if (didScroll) {
      hasScrolled();
      didScroll = false;
    }
  }, 200);

  function hasScrolled(){
    const st = $(window).scrollTop();
    
    // 실행 시점에도 다시 한번 해상도 체크 (안전장치)
    if (window.innerWidth < 1750) {
        $('header').removeClass('nav-up');
        return;
    }

    // 스크롤 양이 delta보다 적으면 무시
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // 스크롤 내릴 때 (헤더 높이보다 더 많이 내려갔을 때만)
    if(st > lastScrollTop && st > navbarHeight){
        $('header').addClass('nav-up');
    } 
    // 스크롤 올릴 때
    else {
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('nav-up');
        }
    }
    
    lastScrollTop = st;
    }









  // 스크롤 내리면 배경색 변경
  window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    
    // 스크롤이 50px 이상 내려가면 scrolled 클래스 추가
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });










  // 페이지 시작 시 애니메이션
  $(window).on('load', function(){

    setTimeout(function(){
      $('.intro-wrap > .img-wrap > img').addClass('active');
      $('.intro-inner > .txt-box > .tit > p > span').addClass('up');
      $('.intro-inner > .txt-box > p > span').addClass('up');
    });

  });










  // 스크롤 시 커지는 박스
  window.addEventListener("DOMContentLoaded", () => {
    const resizeWrap = document.querySelector(".resize-wrap");
    const imgWrap = document.querySelector(".resize-wrap .img-wrap");
    const darkOverlay = document.querySelector(".resize-wrap .img-wrap .dark");
    const titWrap = document.querySelector(".resize-wrap .tit-wrap");
    const downParagraphs = document.querySelectorAll(".scroll-txt.down > p");

    if (!resizeWrap || !imgWrap || !titWrap) return;

    function handleScroll() {
      const rect = resizeWrap.getBoundingClientRect();
      const totalScrollHeight = resizeWrap.clientHeight - window.innerHeight;
      const currentScroll = -rect.top;
      
      // 진행도 (0.0 ~ 1.0)
      const progress = Math.min(Math.max(currentScroll / totalScrollHeight, 0), 1);

      // ----------------------------------------------------
      // [1단계] 0.0 ~ 0.20 : 이미지 확대
      // ----------------------------------------------------
      const zoomProgress = Math.min(progress / 0.20, 1);

      const startW = 559, startH = 339;
      const targetW = window.innerWidth - (window.innerWidth * 0.05);
      const targetH = window.innerHeight - (window.innerHeight * 0.05);

      imgWrap.style.width = `${startW + (targetW - startW) * zoomProgress}px`;
      imgWrap.style.height = `${startH + (targetH - startH) * zoomProgress}px`;
      
      if (darkOverlay) {
        darkOverlay.style.opacity = zoomProgress;
      }

      // ----------------------------------------------------
      // [2단계] 0.20 ~ 1.00 : 스크롤 이동 및 글자 채우기
      // ----------------------------------------------------
      if (progress <= 0.20) {
        titWrap.style.transform = `translateY(100vh)`;
        downParagraphs.forEach(p => p.style.backgroundPositionX = "100%");
        return;
      }

      // .down 요소가 화면 중앙에 안착하는 Y축 위치
      const TARGET_Y = -65; 

      // A. .down 문단이 화면 중앙(-65vh)까지 올라오는 구간 (0.20 ~ 0.50)
      if (progress > 0.20 && progress <= 0.50) {
        const stepA = (progress - 0.20) / 0.30;
        
        const currentY = 100 - (stepA * (100 - TARGET_Y)); 
        titWrap.style.transform = `translateY(${currentY}vh)`;
        
        downParagraphs.forEach(p => p.style.backgroundPositionX = "100%");
      } 
      
      // B. .down이 화면 중앙(-65vh)에 멈춘 채 글자가 순차적으로 채워지는 구간 (0.50 ~ 0.80)
      else if (progress > 0.50 && progress <= 0.80) {
        titWrap.style.transform = `translateY(${TARGET_Y}vh)`;

        const fillProgress = (progress - 0.50) / 0.30;

        if (downParagraphs.length >= 2) {
          // 첫 번째 문장 (0.0 ~ 0.5)
          let p1Pos = 100;
          if (fillProgress <= 0.5) {
            p1Pos = 100 - ((fillProgress / 0.5) * 100);
          } else {
            p1Pos = 0;
          }
          downParagraphs[0].style.backgroundPositionX = `${p1Pos}%`;

          // 두 번째 문장 (0.5 ~ 1.0)
          let p2Pos = 100;
          if (fillProgress > 0.5) {
            p2Pos = 100 - (((fillProgress - 0.5) / 0.5) * 100);
          }
          downParagraphs[1].style.backgroundPositionX = `${p2Pos}%`;
        }
      } 
      
      // C. ★ 글자가 다 채워진 후 끝까지 화면 중앙에 고정(Hold) (0.80 ~ 1.00)
      else if (progress > 0.80) {
        // 위로 빠져나가지 않고 중앙(-65vh) 고정 유지
        titWrap.style.transform = `translateY(${TARGET_Y}vh)`;
        
        // 글자는 완전히 채워진 흰색(0%) 유지
        downParagraphs.forEach(p => p.style.backgroundPositionX = "0%");
      }
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();
  });










  // 위로 올라오는 액션
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if(entry.isIntersecting){
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.6
  });

  document.querySelectorAll('.scroll-up').forEach((el) => {
    observer.observe(el);
  });



});
