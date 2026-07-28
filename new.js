/* =========================================
   SAVED ADDRESSES POPUP
========================================= */

(function(){

  const scrubSavedAddressesPopup =
    document.getElementById(
      "scrubSavedAddressesPopup"
    );

  const scrubSavedAddressesList =
    document.getElementById(
      "scrubSavedAddressesList"
    );

  const scrubSavedAddressesEmpty =
    document.getElementById(
      "scrubSavedAddressesEmpty"
    );


  /* =========================================
     GET ADDRESS FROM LOCAL STORAGE
  ========================================= */

  function getScrubSavedLocalAddress(){

    const village =
      localStorage.getItem(
        "scurbMateVillage"
      ) || "";

    const street =
      localStorage.getItem(
        "scurbMateStreetName"
      ) || "";

    const city =
      localStorage.getItem(
        "scurbMateCity"
      ) || "";

    const fullAddress =
      localStorage.getItem(
        "scurbMateFullAddress"
      ) || "";


    const address =
      fullAddress ||
      [
        street,
        village,
        city
      ]
        .filter(Boolean)
        .join(", ");


    const title =
      village ||
      street ||
      city ||
      "Saved address";


    return {
      title,
      address
    };

  }


  /* =========================================
     RENDER ADDRESS
  ========================================= */

  function renderScrubSavedAddress(){

    if(
      !scrubSavedAddressesList ||
      !scrubSavedAddressesEmpty
    ){
      return;
    }


    const savedAddress =
      getScrubSavedLocalAddress();


    scrubSavedAddressesList
      .replaceChildren();


    if(!savedAddress.address){

      scrubSavedAddressesEmpty.hidden =
        false;

      return;

    }


    scrubSavedAddressesEmpty.hidden =
      true;


    const card =
      document.createElement(
        "article"
      );

    card.className =
      "scrubSavedAddressCard";


    const top =
      document.createElement(
        "div"
      );

    top.className =
      "scrubSavedAddressTop";


    const icon =
      document.createElement(
        "div"
      );

    icon.className =
      "scrubSavedAddressIcon";

    icon.innerHTML =
      '<i class="fa-solid fa-location-dot"></i>';


    const info =
      document.createElement(
        "div"
      );

    info.className =
      "scrubSavedAddressInfo";


    const title =
      document.createElement(
        "h3"
      );

    title.className =
      "scrubSavedAddressTitle";

    title.textContent =
      savedAddress.title;


    const addressText =
      document.createElement(
        "p"
      );

    addressText.className =
      "scrubSavedAddressText";

    addressText.textContent =
      savedAddress.address;


    info.appendChild(
      title
    );


    top.append(
      icon,
      info
    );


    card.append(
      top,
      addressText
    );


    scrubSavedAddressesList
      .appendChild(
        card
      );

  }


  /* =========================================
     OPEN POPUP
  ========================================= */

  function openScrubSavedAddresses(){

    if(!scrubSavedAddressesPopup){

      console.error(
        "scrubSavedAddressesPopup not found"
      );

      return;

    }


    renderScrubSavedAddress();


    document
      .getElementById(
        "scrubProfilePage"
      )
      ?.classList.remove(
        "show"
      );


    scrubSavedAddressesPopup
      .classList.add(
        "show"
      );


    scrubSavedAddressesPopup
      .setAttribute(
        "aria-hidden",
        "false"
      );


    document.body.style.overflow =
      "hidden";

  }


  /* =========================================
     CLOSE POPUP
  ========================================= */

  function closeScrubSavedAddresses(){

    if(!scrubSavedAddressesPopup){
      return;
    }


    scrubSavedAddressesPopup
      .classList.remove(
        "show"
      );


    scrubSavedAddressesPopup
      .setAttribute(
        "aria-hidden",
        "true"
      );


    document.body.style.overflow =
      "";


    document
      .getElementById(
        "scrubProfilePage"
      )
      ?.classList.add(
        "show"
      );

  }


  /*
    Make functions available in Console.
    Now openScrubSavedAddresses() will work.
  */

  window.openScrubSavedAddresses =
    openScrubSavedAddresses;

  window.closeScrubSavedAddresses =
    closeScrubSavedAddresses;


  /* =========================================
     BUTTON EVENTS
  ========================================= */

  document.addEventListener(
    "click",
    function(event){

      const openButton =
        event.target.closest(
          "#scrubSavedAddressesButton"
        );


      if(openButton){

        event.preventDefault();

        openScrubSavedAddresses();

        return;

      }


      const backButton =
        event.target.closest(
          "#scrubSavedAddressesBackButton"
        );


      if(backButton){

        event.preventDefault();

        closeScrubSavedAddresses();

      }

    }
  );


  /* =========================================
     ESCAPE KEY
  ========================================= */

  document.addEventListener(
    "keydown",
    function(event){

      if(
        event.key === "Escape" &&
        scrubSavedAddressesPopup
          ?.classList.contains("show")
      ){

        closeScrubSavedAddresses();

      }

    }
  );


  /* =========================================
     SWIPE BACK — BOTH SIDES
  ========================================= */

  let swipeStartX = 0;
  let swipeStartY = 0;
  let swipeCurrentX = 0;
  let swipeCurrentY = 0;

  let swipeFromLeft = false;
  let swipeFromRight = false;
  let swipeActive = false;

  const edgeSize = 45;
  const closeDistance = 85;


  scrubSavedAddressesPopup
    ?.addEventListener(
      "touchstart",
      function(event){

        if(
          !scrubSavedAddressesPopup
            .classList.contains("show") ||
          event.touches.length !== 1
        ){
          return;
        }


        const touch =
          event.touches[0];


        swipeStartX =
          touch.clientX;

        swipeStartY =
          touch.clientY;

        swipeCurrentX =
          touch.clientX;

        swipeCurrentY =
          touch.clientY;


        swipeFromLeft =
          touch.clientX <=
          edgeSize;


        swipeFromRight =
          touch.clientX >=
          window.innerWidth -
          edgeSize;


        swipeActive =
          swipeFromLeft ||
          swipeFromRight;

      },
      {
        passive:true
      }
    );


  scrubSavedAddressesPopup
    ?.addEventListener(
      "touchmove",
      function(event){

        if(
          !swipeActive ||
          event.touches.length !== 1
        ){
          return;
        }


        const touch =
          event.touches[0];


        swipeCurrentX =
          touch.clientX;

        swipeCurrentY =
          touch.clientY;


        const moveX =
          swipeCurrentX -
          swipeStartX;

        const moveY =
          swipeCurrentY -
          swipeStartY;


        if(
          Math.abs(moveY) >
          Math.abs(moveX)
        ){

          swipeActive =
            false;

          return;

        }


        const validMovement =
          (
            swipeFromLeft &&
            moveX > 0
          ) ||
          (
            swipeFromRight &&
            moveX < 0
          );


        if(validMovement){

          event.preventDefault();

        }

      },
      {
        passive:false
      }
    );


  scrubSavedAddressesPopup
    ?.addEventListener(
      "touchend",
      function(){

        if(!swipeActive){
          return;
        }


        const moveX =
          swipeCurrentX -
          swipeStartX;

        const moveY =
          swipeCurrentY -
          swipeStartY;


        const validLeftSwipe =
          swipeFromLeft &&
          moveX >=
          closeDistance;


        const validRightSwipe =
          swipeFromRight &&
          moveX <=
          -closeDistance;


        swipeActive =
          false;


        if(
          Math.abs(moveX) >
          Math.abs(moveY) &&
          (
            validLeftSwipe ||
            validRightSwipe
          )
        ){

          closeScrubSavedAddresses();

        }


        swipeFromLeft =
          false;

        swipeFromRight =
          false;

      },
      {
        passive:true
      }
    );

})();
