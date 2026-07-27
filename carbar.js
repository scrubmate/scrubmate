/* =========================================
   FLOATING SERVICE CART
========================================= */

const scurbFloatingCartBar =
  document.getElementById("scurbFloatingCartBar");

const scurbFloatingCartImages =
  document.getElementById("scurbFloatingCartImages");

const scurbFloatingCartSavings =
  document.getElementById("scurbFloatingCartSavings");

const scurbFloatingCartCount =
  document.getElementById("scurbFloatingCartCount");

const scurbFloatingCartButton =
  document.getElementById("scurbFloatingCartButton");
const scurbCartDeliveryFee =
  document.getElementById(
    "scurbCartDeliveryFee"
  );

const scurbCartDeliveryDistance =
  document.getElementById(
    "scurbCartDeliveryDistance"
  );

const scurbCartDeliveryRow =
  scurbCartDeliveryFee?.closest(
    ".scurbCartDeliveryRow"
  );
/* =========================================
   FULL CART PAGE ELEMENTS
========================================= */

const scurbCartPage =
  document.getElementById("scurbCartPage");

const scurbCartBackButton =
  document.getElementById("scurbCartBackButton");

const scurbCartItems =
  document.getElementById("scurbCartItems");

const scurbCartServiceCount =
  document.getElementById(
    "scurbCartServiceCount"
  );

const scurbCartAddMoreButton =
  document.getElementById(
    "scurbCartAddMoreButton"
  );

const scurbCartCustomerName =
  document.getElementById(
    "scurbCartCustomerName"
  );

const scurbCartCustomerMobile =
  document.getElementById(
    "scurbCartCustomerMobile"
  );
const scurbCartCustomerNameRow =
  scurbCartCustomerName?.closest(
    ".scurbCartDetailRow"
  );

const scurbCartCustomerMobileRow =
  scurbCartCustomerMobile?.closest(
    ".scurbCartDetailRow"
  );
const scurbCartCustomerAddress =
  document.getElementById(
    "scurbCartCustomerAddress"
  );

const scurbCartServiceTotal =
  document.getElementById(
    "scurbCartServiceTotal"
  );

const scurbCartDiscount =
  document.getElementById(
    "scurbCartDiscount"
  );

const scurbCartBillTotal =
  document.getElementById(
    "scurbCartBillTotal"
  );

const scurbCartBottomTotal =
  document.getElementById(
    "scurbCartBottomTotal"
  );
  const scurbCartPromoCard =
  document.getElementById(
    "scurbCartPromoCard"
  );

const scurbCartPromoTitle =
  document.getElementById(
    "scurbCartPromoTitle"
  );

const scurbCartPromoSubtitle =
  document.getElementById(
    "scurbCartPromoSubtitle"
  );


const scurbCouponPopup =
  document.getElementById(
    "scurbCouponPopup"
  );

const scurbCouponBackdrop =
  document.getElementById(
    "scurbCouponBackdrop"
  );

const scurbCouponCloseButton =
  document.getElementById(
    "scurbCouponCloseButton"
  );

const scurbCouponInput =
  document.getElementById(
    "scurbCouponInput"
  );

const scurbCouponApplyButton =
  document.getElementById(
    "scurbCouponApplyButton"
  );

const scurbCouponQuickApplyButton =
  document.getElementById(
    "scurbCouponQuickApplyButton"
  );

const scurbCouponMessage =
  document.getElementById(
    "scurbCouponMessage"
  );

const scurbCouponAvailableCard =
  document.querySelector(
    ".scurbCouponAvailableCard"
  );

const scurbCouponEmptyState =
  document.getElementById(
    "scurbCouponEmptyState"
  );


const scurbCartCouponDiscountRow =
  document.getElementById(
    "scurbCartCouponDiscountRow"
  );

const scurbCartCouponDiscount =
  document.getElementById(
    "scurbCartCouponDiscount"
  );
let scurbServiceCart = [];


/* =========================================
   CONVERT PRICE TEXT TO NUMBER
========================================= */

function getScurbPriceNumber(value){

  const cleanValue =
    String(value || "")
      .replace(/[^\d.]/g, "");

  return Number(cleanValue) || 0;
}


/* =========================================
   GET SERVICE NAME
========================================= */

function getScurbServiceName(serviceCard){

  return (
    serviceCard?.dataset.service?.trim() ||
    "Cleaning Service"
  );
}


/* =========================================
   FIND SERVICE FROM CART
========================================= */

function findScurbCartService(serviceCard){

  const serviceName =
    getScurbServiceName(serviceCard);

  return scurbServiceCart.find(function(item){

    return item.name === serviceName;

  });
}


/* =========================================
   SAVE CART
========================================= */

function saveScurbServiceCart(){

  localStorage.setItem(
    "scurbMateServiceCart",
    JSON.stringify(scurbServiceCart)
  );
}


/* =========================================
   LOAD SAVED CART
========================================= */

function loadScurbServiceCart(){

  try{

    const savedCart =
      JSON.parse(
        localStorage.getItem(
          "scurbMateServiceCart"
        ) || "[]"
      );

    scurbServiceCart =
      Array.isArray(savedCart)
        ? savedCart.filter(function(item){

            return Number(item.quantity || 0) > 0;

          })
        : [];

  }catch(error){

    scurbServiceCart = [];

  }

  updateScurbServiceButtons();

  updateScurbFloatingCartBar();
}


/* =========================================
   CREATE NEW CART SERVICE
========================================= */

function createScurbCartService(serviceCard){

  const serviceName =
    getScurbServiceName(serviceCard);

  const serviceImage =
    serviceCard.querySelector(
      ".scurbServiceImg"
    );

  const cartImage =
    serviceImage?.dataset.cartImg || "";

  const currentPrice =
    getScurbPriceNumber(
      serviceCard.querySelector(
        ".scurbServicePrice"
      )?.textContent
    );

  const originalPrice =
    getScurbPriceNumber(
      serviceCard.querySelector(
        ".scurbServiceOldPrice"
      )?.textContent
    );

  return {

    name:serviceName,

    price:currentPrice,

    originalPrice:
      originalPrice || currentPrice,

    quantity:1,

    cartImage:cartImage

  };
}


/* =========================================
   CHANGE SERVICE QUANTITY
========================================= */

function changeScurbServiceQuantity(
  serviceCard,
  quantityChange
){

  if(!serviceCard){
    return;
  }

  const serviceName =
    getScurbServiceName(serviceCard);

  const serviceIndex =
    scurbServiceCart.findIndex(
      function(item){

        return item.name === serviceName;

      }
    );


  /* ADD NEW SERVICE */

  if(serviceIndex === -1){

    if(quantityChange > 0){

      const newService =
        createScurbCartService(
          serviceCard
        );

      scurbServiceCart.push(
        newService
      );

    }

  }else{

    const service =
      scurbServiceCart[serviceIndex];

    service.quantity =
      Number(service.quantity || 0) +
      quantityChange;


    /* REMOVE WHEN QUANTITY BECOMES ZERO */

    if(service.quantity <= 0){

      scurbServiceCart.splice(
        serviceIndex,
        1
      );

    }else if(quantityChange > 0){

      /*
       Move recently increased service to
       the end so its image appears first.
      */

      scurbServiceCart.splice(
        serviceIndex,
        1
      );

      scurbServiceCart.push(
        service
      );

    }

  }

saveScurbServiceCart();

updateScurbServiceButtons();

updateScurbFloatingCartBar();

updateScurbPopupBookButtons();
}


/* =========================================
   GET SHORT QUANTITY LABEL
========================================= */

function getScurbServiceShortName(
  serviceCard,
  quantity
){

  const serviceName =
    getScurbServiceName(serviceCard)
      .toLowerCase();

  const single =
    Number(quantity || 0) <= 1;

  if(serviceName.includes("utilities")){
    return single ? "Item" : "Items";
  }

  if(serviceName.includes("kitchen help")){
    return single ? "Hour" : "Hours";
  }

  if(
  serviceName.includes("dusting") ||
  serviceName.includes("wiping") ||
  serviceName.includes("sweeping") ||
  serviceName.includes("mopping")
){
  return single ? "Room" : "Rooms";
}

  if(
    serviceName.includes("packing") ||
    serviceName.includes("unpacking")
  ){
    return single
      ? "Box or Bag"
      : "Boxes or Bags";
  }

  if(serviceName.includes("ironing")){
    return single ? "Piece" : "Pieces";
  }

  if(serviceName.includes("laundry")){
    return single ? "Piece" : "Pieces";
  }

  return getScurbServiceName(serviceCard)
    .replace(/\s+Cleaning$/i, "")
    .replace(/\s+Service$/i, "")
    .replace(/\s+Help$/i, "")
    .trim();
}
/* =========================================
   UPDATE ALL SERVICE + / − BUTTONS
========================================= */


/* =========================================
   UPDATE SERVICE + / − BUTTONS
   WITHOUT RE-RENDERING ALL BUTTONS
========================================= */

function updateScurbServiceButtons(){

  document.querySelectorAll(
    ".scurbServiceCard"
  ).forEach(function(serviceCard){

    const addButton =
      serviceCard.querySelector(
        ".scurbServiceAddBtn"
      );

    if(!addButton){
      return;
    }


    const imageBox =
      serviceCard.querySelector(
        ".scurbServiceImageBox"
      );


    const cartService =
      findScurbCartService(
        serviceCard
      );


    const quantity =
      Number(
        cartService?.quantity || 0
      );


    const previousQuantity =
      Number(
        addButton.dataset.quantity || 0
      );


    let quantityLabel =
      imageBox?.querySelector(
        ".scurbServiceQuantityLabel"
      );


    /*
     Do nothing when this service quantity
     has not changed.

     This prevents all other + buttons
     from re-rendering and blinking.
    */

    if(previousQuantity === quantity){

  if(quantity > 0 && quantityLabel){

    const shortName =
      getScurbServiceShortName(
        serviceCard,
        quantity
      );

    if(
      quantityLabel.textContent !==
      shortName
    ){

      quantityLabel.textContent =
        shortName;

    }

  }

  return;
}
    addButton.dataset.quantity =
      String(quantity);


    /* SHOW − QUANTITY + */

    if(quantity > 0){

      addButton.classList.add(
        "scurbQtyMode"
      );


      /*
       Create quantity structure only when
       changing from normal + to quantity mode.
      */

      if(previousQuantity === 0){

        addButton.replaceChildren();


        const minus =
          document.createElement("span");

        minus.className =
          "scurbServiceMinus";

        minus.setAttribute(
          "aria-label",
          "Decrease quantity"
        );

        minus.textContent = "−";


        const quantityText =
          document.createElement("span");

        quantityText.className =
          "scurbServiceQty";

        quantityText.textContent =
          String(quantity);


        const plus =
          document.createElement("span");

        plus.className =
          "scurbServicePlus";

        plus.setAttribute(
          "aria-label",
          "Increase quantity"
        );

        plus.textContent = "+";


        addButton.append(
          minus,
          quantityText,
          plus
        );

      }else{

        /*
         Quantity mode already exists.
         Update number only.
        */

        const quantityText =
          addButton.querySelector(
            ".scurbServiceQty"
          );

        if(
          quantityText &&
          quantityText.textContent !==
            String(quantity)
        ){

          quantityText.textContent =
            String(quantity);

        }

      }


      addButton.setAttribute(
        "aria-label",
        `Quantity ${quantity}`
      );


      /* CREATE SMALL SERVICE NAME */

      if(imageBox && !quantityLabel){

        quantityLabel =
          document.createElement("span");

        quantityLabel.className =
          "scurbServiceQuantityLabel";

        imageBox.appendChild(
          quantityLabel
        );

      }


      if(quantityLabel){

       quantityLabel.textContent =
  getScurbServiceShortName(
    serviceCard,
    quantity
  );

        quantityLabel.classList.add(
          "show"
        );

      }

    }else{

      /* RESTORE NORMAL SINGLE + */

      addButton.classList.remove(
        "scurbQtyMode"
      );

      addButton.replaceChildren();


      const singlePlus =
        document.createElement("span");

      singlePlus.className =
        "scurbSinglePlus";

      singlePlus.textContent =
        "+";


      addButton.appendChild(
        singlePlus
      );


      addButton.setAttribute(
        "aria-label",
        "Add service"
      );


      if(quantityLabel){

        quantityLabel.remove();

      }

    }

  });
}







/* =========================================
   UPDATE FLOATING CART BAR
========================================= */

function updateScurbFloatingCartBar(){

  if(!scurbFloatingCartBar){
    return;
  }


  /* Number of different service cards */

const totalServices =
  scurbServiceCart.filter(
    function(item){

      return Number(item.quantity || 0) > 0;

    }
  ).length;


  const totalCurrentPrice =
    scurbServiceCart.reduce(
      function(total, item){

        return total +
          (
            Number(item.price || 0) *
            Number(item.quantity || 0)
          );

      },
      0
    );


  const totalOriginalPrice =
    scurbServiceCart.reduce(
      function(total, item){

        return total +
          (
            Number(item.originalPrice || 0) *
            Number(item.quantity || 0)
          );

      },
      0
    );


  const totalSavings =
    Math.max(
      0,
      totalOriginalPrice -
      totalCurrentPrice
    );


  if(scurbFloatingCartSavings){

    scurbFloatingCartSavings.textContent =
      `You saved ₹${totalSavings}`;

  }


  if(scurbFloatingCartCount){

  scurbFloatingCartCount.textContent =
    totalServices === 1
      ? "1 Service"
      : `${totalServices} Services`;

}

if(scurbFloatingCartImages){

  const latestServices =
    scurbServiceCart
      .filter(function(item){

        return item.cartImage;

      })
      .slice(-3)
      .reverse();


  const latestImagesKey =
    latestServices
      .map(function(item){

        return `${item.name}:${item.cartImage}`;

      })
      .join("|");


  /*
   Re-render images only when services change.
   Quantity changes will not blink the images.
  */

  if(
    scurbFloatingCartImages.dataset.imagesKey !==
    latestImagesKey
  ){

    scurbFloatingCartImages.dataset.imagesKey =
      latestImagesKey;

    scurbFloatingCartImages.replaceChildren();


    latestServices.forEach(function(item){

      const image =
        document.createElement("img");

      image.className =
        "scurbFloatingCartImage";

      image.alt =
        item.name;

      image.decoding =
        "async";

      image.draggable =
        false;


      image.addEventListener(
        "error",
        function(){

          image.remove();

        },
        {
          once:true
        }
      );


      image.src =
        item.cartImage;


      scurbFloatingCartImages.appendChild(
        image
      );

    });

  }

}
  


  const homeVisible =
    scurbHomeContent &&
    scurbHomeContent.style.display !==
      "none";


  scurbFloatingCartBar.classList.toggle(
  "show",
  totalServices > 0 &&
  homeVisible
);
}


/* =========================================
   SERVICE BUTTON CLICK
========================================= */

document.querySelectorAll(
  ".scurbServiceAddBtn"
).forEach(function(addButton){

  addButton.addEventListener(
    "click",
    function(event){

      event.preventDefault();

      event.stopPropagation();


      const serviceCard =
        addButton.closest(
          ".scurbServiceCard"
        );

      if(!serviceCard){
        return;
      }


      /* MINUS CLICK */

      if(
       event.target.closest(".scurbServiceMinus")
      ){

        changeScurbServiceQuantity(
          serviceCard,
          -1
        );

        return;
      }


      /* QUANTITY NUMBER CLICK */

      if(
        event.target.closest(".scurbServiceQty")
      ){

        return;
      }


      /*
       Single + or quantity +
       both increase the service.
      */

      changeScurbServiceQuantity(
        serviceCard,
        1
      );

    }
  );

});


/* =========================================
   GO TO CART
========================================= */

scurbFloatingCartButton
  ?.addEventListener(
    "click",
    openScurbCartPage
  );


scurbCartBackButton
  ?.addEventListener(
    "click",
    closeScurbCartPage
  );


scurbCartAddMoreButton
  ?.addEventListener(
    "click",
    closeScurbCartPage
  );


/* =========================================
   LOAD CART WHEN APP OPENS
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  loadScurbServiceCart
);
/* =========================================
   GET CART USER DETAILS
========================================= */
/* =========================================
   GET CART USER DETAILS
========================================= */

function updateScurbCartCustomerDetails(){

  const isLoggedIn =
    localStorage.getItem(
      "scrubMateLoggedIn"
    ) === "true";

  const isGuest =
    localStorage.getItem(
      "scrubMateGuestMode"
    ) === "true";


  let user = null;

  try{

    user =
      JSON.parse(
        localStorage.getItem(
          "scrubMateUser"
        ) || "null"
      );

  }catch(error){

    user = null;

  }


  const validLoggedInUser =
    isLoggedIn &&
    !isGuest &&
    user &&
    user.login === true &&
    user.verified === true;


  /* HIDE NAME + MOBILE FOR GUEST USER */

  if(!validLoggedInUser){

    if(scurbCartCustomerNameRow){

      scurbCartCustomerNameRow.style.display =
        "none";

    }

    if(scurbCartCustomerMobileRow){

      scurbCartCustomerMobileRow.style.display =
        "none";

    }

  }else{

    if(scurbCartCustomerNameRow){

      scurbCartCustomerNameRow.style.display =
        "flex";

    }

    if(scurbCartCustomerMobileRow){

      scurbCartCustomerMobileRow.style.display =
        "flex";

    }


    const userName =
      user.name ||
      localStorage.getItem(
        "scrubMateName"
      ) ||
      user.firstName ||
      "Scrub Mate User";


    const mobile =
      String(
        user.mobile ||
        user.phoneNumber ||
        localStorage.getItem(
          "scrubMateMobile"
        ) ||
        ""
      )
      .replace(/\D/g, "")
      .slice(-10);


    if(scurbCartCustomerName){

      scurbCartCustomerName.textContent =
        userName;

    }


    if(scurbCartCustomerMobile){

      scurbCartCustomerMobile.textContent =
        mobile.length === 10
          ? `+91 ${mobile}`
          : "";

    }

  }


  /* ADDRESS ALWAYS VISIBLE */

  const address =
    localStorage.getItem(
      "scurbMateFullAddress"
    ) ||
    [
      localStorage.getItem(
        "scurbMateStreetName"
      ),
      localStorage.getItem(
        "scurbMateNeighbourhood"
      ),
      localStorage.getItem(
        "scurbMateVillage"
      ),
      localStorage.getItem(
        "scurbMateCity"
      )
    ]
    .filter(Boolean)
    .join(", ") ||
    "Your selected address";


  if(scurbCartCustomerAddress){

    scurbCartCustomerAddress.textContent =
      address;

  }

}

/* =========================================
   UPDATE CART ITEM QUANTITY
========================================= */

function changeScurbCartItemQuantity(
  serviceName,
  change
){

  const serviceIndex =
    scurbServiceCart.findIndex(
      function(item){

        return item.name === serviceName;

      }
    );


  if(serviceIndex === -1){
    return;
  }


  const item =
    scurbServiceCart[serviceIndex];


  item.quantity =
    Number(item.quantity || 0) +
    change;


  if(item.quantity <= 0){

    scurbServiceCart.splice(
      serviceIndex,
      1
    );

  }


  saveScurbServiceCart();

updateScurbServiceButtons();

updateScurbFloatingCartBar();

updateScurbPopupBookButtons();

renderScurbCartPage();


  if(scurbServiceCart.length === 0){

    closeScurbCartPage();

  }

}

/* =========================================
   GET CART QUANTITY LABEL
========================================= */



function getScurbCartQuantityLabel(
  serviceName,
  quantity
){

  const originalName =
    String(serviceName || "");

  const lowerName =
    originalName.toLowerCase();

  const single =
    Number(quantity || 0) <= 1;

  if(lowerName.includes("utilities")){
    return single ? "Item" : "Items";
  }

  if(lowerName.includes("kitchen help")){
    return single ? "Hour" : "Hours";
  }

 if(
  lowerName.includes("dusting") ||
  lowerName.includes("wiping") ||
  lowerName.includes("sweeping") ||
  lowerName.includes("mopping")
){
  return single ? "Room" : "Rooms";
}

  if(
    lowerName.includes("packing") ||
    lowerName.includes("unpacking")
  ){
    return single
      ? "Box or Bag"
      : "Boxes or Bags";
  }

  if(
    lowerName.includes("ironing") ||
    lowerName.includes("laundry")
  ){
    return single ? "Piece" : "Pieces";
  }

  return originalName
    .replace(/\s+Cleaning$/i, "")
    .replace(/\s+Service$/i, "")
    .replace(/\s+Help$/i, "")
    .trim();
}


/* =========================================
   DELIVERY FEE CONFIGURATION
========================================= */

const SCURB_SERVICE_CENTER_LAT =
  16.747578614935353;

const SCURB_SERVICE_CENTER_LON =
  81.68208423275695;

const SCURB_FREE_DISTANCE_KM = 1;

const SCURB_DELIVERY_RATE_PER_KM = 5;

const SCURB_MAX_DELIVERY_FEE = 40;


/* =========================================
   CONVERT DEGREES TO RADIANS
========================================= */

function scurbDegreesToRadians(value){

  return Number(value) * Math.PI / 180;
}


/* =========================================
   CALCULATE DISTANCE USING HAVERSINE
========================================= */

function calculateScurbDistanceKm(
  startLatitude,
  startLongitude,
  endLatitude,
  endLongitude
){

  const earthRadiusKm = 6371;

  const latitudeDifference =
    scurbDegreesToRadians(
      endLatitude - startLatitude
    );

  const longitudeDifference =
    scurbDegreesToRadians(
      endLongitude - startLongitude
    );

  const startLatitudeRadians =
    scurbDegreesToRadians(
      startLatitude
    );

  const endLatitudeRadians =
    scurbDegreesToRadians(
      endLatitude
    );

  const value =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(startLatitudeRadians) *
    Math.cos(endLatitudeRadians) *
    Math.sin(longitudeDifference / 2) ** 2;

  const angularDistance =
    2 * Math.atan2(
      Math.sqrt(value),
      Math.sqrt(1 - value)
    );

  return earthRadiusKm * angularDistance;
}


/* =========================================
   GET USER LOCATION FROM LOCAL STORAGE
========================================= */

function getScurbStoredCoordinates(){

  const latitudeKeys = [
    "scurbMateLatitude",
    "scurbMateLat",
    "scrubMateLatitude",
    "scrubMateLat",
    "cezooUserLat"
  ];

  const longitudeKeys = [
    "scurbMateLongitude",
    "scurbMateLon",
    "scurbMateLng",
    "scrubMateLongitude",
    "scrubMateLon",
    "scrubMateLng",
    "cezooUserLon"
  ];


  let latitude = null;
  let longitude = null;


  for(const key of latitudeKeys){

    const storedValue =
      Number(localStorage.getItem(key));

    if(Number.isFinite(storedValue)){

      latitude = storedValue;
      break;
    }
  }


  for(const key of longitudeKeys){

    const storedValue =
      Number(localStorage.getItem(key));

    if(Number.isFinite(storedValue)){

      longitude = storedValue;
      break;
    }
  }


  if(
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ){

    return null;
  }


  return {
    latitude,
    longitude
  };
}


/* =========================================
   FORMAT DELIVERY DISTANCE
========================================= */

function formatScurbDeliveryDistance(
  distanceKm
){

  if(distanceKm < 1){

    const distanceMeters =
      Math.round(distanceKm * 1000);

    return `${distanceMeters} m away`;
  }


  if(distanceKm < 10){

    return `${distanceKm.toFixed(2)} km away`;
  }


  return `${distanceKm.toFixed(1)} km away`;
}


/* =========================================
   CALCULATE DELIVERY FEE
========================================= */

function getScurbDeliveryDetails(){

  const coordinates =
    getScurbStoredCoordinates();


  if(!coordinates){

    return {
      distanceKm:null,
      distanceText:"Location unavailable",
      fee:0
    };
  }


  const distanceKm =
    calculateScurbDistanceKm(
      SCURB_SERVICE_CENTER_LAT,
      SCURB_SERVICE_CENTER_LON,
      coordinates.latitude,
      coordinates.longitude
    );


  let deliveryFee = 0;


  /*
     First 1 km is free.

     Examples:

     0.8 km  = ₹0
     1.2 km  = ₹5
     2.1 km  = ₹10
     5.5 km  = ₹25
     10 km   = ₹40 maximum
  */

  if(distanceKm > SCURB_FREE_DISTANCE_KM){

    const chargeableDistance =
      distanceKm -
      SCURB_FREE_DISTANCE_KM;

    const chargeableKilometres =
      Math.ceil(chargeableDistance);

    deliveryFee =
      chargeableKilometres *
      SCURB_DELIVERY_RATE_PER_KM;
  }


  deliveryFee =
    Math.min(
      deliveryFee,
      SCURB_MAX_DELIVERY_FEE
    );


  return {
    distanceKm,
    distanceText:
      formatScurbDeliveryDistance(
        distanceKm
      ),
    fee:deliveryFee
  };
}


/* =========================================
   RENDER CART PAGE
========================================= */

function renderScurbCartPage(){

  if(!scurbCartItems){
    return;
  }


  const activeItems =
    scurbServiceCart.filter(
      function(item){

        return Number(item.quantity || 0) > 0;

      }
    );


  scurbCartItems.replaceChildren();


  activeItems.forEach(function(item){

    const cartItem =
      document.createElement("article");

    cartItem.className =
      "scurbCartItem";


    const image =
      document.createElement("img");

    image.className =
      "scurbCartItemImage";

    image.src =
      item.cartImage || "";

    image.alt =
      item.name;

    image.draggable =
      false;


    const info =
      document.createElement("div");

    info.className =
      "scurbCartItemInfo";


    const name =
      document.createElement("h3");

    name.textContent =
      item.name;


    const priceHolder =
      document.createElement("div");

    priceHolder.className =
      "scurbCartItemPrice";


    const currentPrice =
      document.createElement("span");

    currentPrice.className =
      "scurbCartItemCurrentPrice";

    currentPrice.textContent =
      `₹${Number(item.price || 0)}`;


    const originalPrice =
      document.createElement("span");

    originalPrice.className =
      "scurbCartItemOldPrice";

    originalPrice.textContent =
      `₹${Number(
        item.originalPrice ||
        item.price ||
        0
      )}`;


    priceHolder.append(
      currentPrice,
      originalPrice
    );


    info.append(
      name,
      priceHolder
    );


   const quantityWrap =
  document.createElement("div");

quantityWrap.className =
  "scurbCartItemQuantityWrap";


const quantityHolder =
  document.createElement("div");

quantityHolder.className =
  "scurbCartItemQuantity";


    const minusButton =
      document.createElement("button");

    minusButton.type =
      "button";

    minusButton.className =
      "scurbCartItemMinus";

    minusButton.textContent =
      "−";

    minusButton.setAttribute(
      "aria-label",
      `Decrease ${item.name}`
    );


    const quantityText =
      document.createElement("span");

    quantityText.className =
      "scurbCartItemQty";

    quantityText.textContent =
      String(item.quantity);


    const plusButton =
      document.createElement("button");

    plusButton.type =
      "button";

    plusButton.className =
      "scurbCartItemPlus";

    plusButton.textContent =
      "+";

    plusButton.setAttribute(
      "aria-label",
      `Increase ${item.name}`
    );


    minusButton.addEventListener(
      "click",
      function(){

        changeScurbCartItemQuantity(
          item.name,
          -1
        );

      }
    );


    plusButton.addEventListener(
      "click",
      function(){

        changeScurbCartItemQuantity(
          item.name,
          1
        );

      }
    );


   quantityHolder.append(
  minusButton,
  quantityText,
  plusButton
);


const quantityLabel =
  document.createElement("span");

quantityLabel.className =
  "scurbCartItemQuantityLabel";

quantityLabel.textContent =
  getScurbCartQuantityLabel(
    item.name,
    item.quantity
  );


quantityWrap.append(
  quantityHolder,
  quantityLabel
);


    cartItem.append(
  image,
  info,
  quantityWrap
);

    scurbCartItems.appendChild(
      cartItem
    );

  });


  const serviceCount =
    activeItems.length;


  if(scurbCartServiceCount){

    scurbCartServiceCount.textContent =
      serviceCount === 1
        ? "1 service"
        : `${serviceCount} services`;

  }


  const originalTotal =
    activeItems.reduce(
      function(total, item){

        return total +
          (
            Number(
              item.originalPrice ||
              item.price ||
              0
            ) *
            Number(item.quantity || 0)
          );

      },
      0
    );


  const currentTotal =
    activeItems.reduce(
      function(total, item){

        return total +
          (
            Number(item.price || 0) *
            Number(item.quantity || 0)
          );

      },
      0
    );


  const discount =
    Math.max(
      0,
      originalTotal -
      currentTotal
    );


  if(scurbCartServiceTotal){

    scurbCartServiceTotal.textContent =
      `₹${originalTotal}`;

  }


  if(scurbCartDiscount){

    scurbCartDiscount.textContent =
      `− ₹${discount}`;

  }


/* DELIVERY DETAILS */

const deliveryDetails =
  getScurbDeliveryDetails();

const deliveryFee =
  Number(deliveryDetails.fee || 0);


/* COUPON DISCOUNT */

let couponDiscount =
  getScurbCouponDiscount(
    currentTotal
  );


/*
   Automatically remove coupon if
   service total goes below ₹400.
*/

if(
  scurbAppliedCoupon &&
  currentTotal < 400
){

  scurbAppliedCoupon = false;

  localStorage.removeItem(
    "scurbMateAppliedCoupon"
  );

  couponDiscount = 0;
}


/* FINAL AMOUNT */

const finalTotal =
  Math.max(
    0,
    currentTotal +
    deliveryFee -
    couponDiscount
  );


/* DELIVERY DISTANCE */

if(scurbCartDeliveryDistance){

  scurbCartDeliveryDistance.textContent =
    deliveryDetails.distanceText;

}


/* DELIVERY FEE */

if(scurbCartDeliveryFee){

  scurbCartDeliveryFee.textContent =
    deliveryFee === 0
      ? "FREE"
      : `₹${deliveryFee}`;

}


if(scurbCartDeliveryRow){

  scurbCartDeliveryRow.classList.toggle(
    "deliveryFree",
    deliveryFee === 0
  );

}


/* COUPON BILL ROW */

if(scurbCartCouponDiscountRow){

  if(couponDiscount > 0){

    scurbCartCouponDiscountRow.hidden =
      false;

    scurbCartCouponDiscountRow.style.display =
      "";

  }else{

    scurbCartCouponDiscountRow.hidden =
      true;

    scurbCartCouponDiscountRow.style.display =
      "none";

  }

}


if(
  scurbCartCouponDiscount &&
  couponDiscount > 0
){

  scurbCartCouponDiscount.textContent =
    `− ₹${couponDiscount}`;

}


/* PROMO CARD STATUS */

if(scurbCartPromoTitle){

  scurbCartPromoTitle.textContent =
    couponDiscount > 0
      ? "SCRUBMATE applied"
      : "Apply promo code";

}


if(scurbCartPromoSubtitle){

  scurbCartPromoSubtitle.textContent =
    couponDiscount > 0
      ? `You saved ₹${couponDiscount}`
      : "Save more on your booking";

}


/* FINAL TO PAY */

if(scurbCartBillTotal){

  scurbCartBillTotal.textContent =
    `₹${finalTotal}`;

}


if(scurbCartBottomTotal){

  scurbCartBottomTotal.textContent =
    `₹${finalTotal}`;

}


  updateScurbCartCustomerDetails();

}
function refreshScurbCartDeviceLocation(){

  if(!navigator.geolocation){
    return;
  }

  navigator.geolocation.getCurrentPosition(
    function(position){

      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;


      localStorage.setItem(
        "scurbMateLatitude",
        String(latitude)
      );

      localStorage.setItem(
        "scurbMateLongitude",
        String(longitude)
      );


      if(
        scurbCartPage?.classList.contains(
          "show"
        )
      ){

        renderScurbCartPage();
      }

    },

    function(error){

      console.warn(
        "Unable to get cart location:",
        error.message
      );

    },

    {
      enableHighAccuracy:true,
      timeout:10000,
      maximumAge:30000
    }
  );
}

/* =========================================
   OPEN CART PAGE
========================================= */

function openScurbCartPage(){

  if(scurbServiceCart.length === 0){
    return;
  }

  resetScurbCartSwipeStyles();

  renderScurbCartPage();
refreshScurbCartDeviceLocation();
  scurbCartPage.style.transition = "";
  scurbCartPage.style.transform = "";
  scurbCartPage.style.opacity = "";

  scurbCartPage.classList.add(
    "show"
  );

  document.body.style.overflow =
    "hidden";

}


/* =========================================
   CLOSE CART PAGE
========================================= */

function closeScurbCartPage(){

  scurbCartPage.classList.remove(
    "show"
  );

  resetScurbCartSwipeStyles();

  document.body.style.overflow = "";

}
/* =========================================
   CART PAGE SWIPE CLOSE
   LEFT + RIGHT
========================================= */

let scurbCartSwipeStartX = 0;
let scurbCartSwipeStartY = 0;

let scurbCartSwipeCurrentX = 0;
let scurbCartSwipeCurrentY = 0;

let scurbCartSwipeActive = false;
let scurbCartSwipeDirectionLocked = false;
let scurbCartSwipeHorizontal = false;


/* RESET CART SWIPE */

function resetScurbCartSwipeStyles(){

  scurbCartSwipeActive = false;

  scurbCartSwipeDirectionLocked = false;

  scurbCartSwipeHorizontal = false;

  scurbCartSwipeStartX = 0;
  scurbCartSwipeStartY = 0;

  scurbCartSwipeCurrentX = 0;
  scurbCartSwipeCurrentY = 0;

  if(!scurbCartPage){
    return;
  }

  scurbCartPage.style.transition = "";

  scurbCartPage.style.transform = "";

  scurbCartPage.style.opacity = "";

}


/* TOUCH START */

scurbCartPage?.addEventListener(
  "touchstart",
  function(event){

    if(
      !scurbCartPage.classList.contains(
        "show"
      )
    ){
      return;
    }

    if(event.touches.length !== 1){
      return;
    }


    const touch =
      event.touches[0];


    scurbCartSwipeStartX =
      touch.clientX;

    scurbCartSwipeStartY =
      touch.clientY;

    scurbCartSwipeCurrentX =
      touch.clientX;

    scurbCartSwipeCurrentY =
      touch.clientY;


    scurbCartSwipeActive = true;

    scurbCartSwipeDirectionLocked =
      false;

    scurbCartSwipeHorizontal =
      false;


    scurbCartPage.style.transition =
      "none";

  },
  {
    passive:true
  }
);


/* TOUCH MOVE */

scurbCartPage?.addEventListener(
  "touchmove",
  function(event){

    if(
      !scurbCartSwipeActive ||
      event.touches.length !== 1
    ){
      return;
    }


    const touch =
      event.touches[0];


    scurbCartSwipeCurrentX =
      touch.clientX;

    scurbCartSwipeCurrentY =
      touch.clientY;


    const moveX =
      scurbCartSwipeCurrentX -
      scurbCartSwipeStartX;

    const moveY =
      scurbCartSwipeCurrentY -
      scurbCartSwipeStartY;


    /*
     First detect whether the gesture
     is horizontal or vertical.
    */

    if(!scurbCartSwipeDirectionLocked){

      if(
        Math.abs(moveX) < 10 &&
        Math.abs(moveY) < 10
      ){
        return;
      }


      scurbCartSwipeDirectionLocked =
        true;


      scurbCartSwipeHorizontal =
        Math.abs(moveX) >
        Math.abs(moveY) * 1.2;

    }


    /*
     Vertical gesture:
     allow normal cart scrolling.
    */

    if(!scurbCartSwipeHorizontal){
      return;
    }


    event.preventDefault();


    const maximumMove =
      window.innerWidth;


    const limitedMoveX =
      Math.max(
        -maximumMove,
        Math.min(
          maximumMove,
          moveX
        )
      );


    const progress =
      Math.min(
        Math.abs(limitedMoveX) /
        maximumMove,
        1
      );


    scurbCartPage.style.transform =
      `translate3d(${limitedMoveX}px,0,0)`;


    scurbCartPage.style.opacity =
      String(
        Math.max(
          0.55,
          1 - progress * 0.45
        )
      );

  },
  {
    passive:false
  }
);


/* TOUCH END */

scurbCartPage?.addEventListener(
  "touchend",
  function(){

    if(!scurbCartSwipeActive){
      return;
    }


    scurbCartSwipeActive = false;


    const moveX =
      scurbCartSwipeCurrentX -
      scurbCartSwipeStartX;

    const moveY =
      scurbCartSwipeCurrentY -
      scurbCartSwipeStartY;


    const swipeDistance =
      Math.abs(moveX);


    const shouldClose =
      scurbCartSwipeHorizontal &&
      swipeDistance >= 90 &&
      swipeDistance >
      Math.abs(moveY);


    scurbCartPage.style.transition =
      "transform .25s ease, opacity .2s ease";


    if(shouldClose){

      const closeDirection =
        moveX > 0
          ? window.innerWidth
          : -window.innerWidth;


      scurbCartPage.style.transform =
        `translate3d(${closeDirection}px,0,0)`;


      scurbCartPage.style.opacity =
        "0";


      setTimeout(function(){

        scurbCartPage.classList.remove(
          "show"
        );

        document.body.style.overflow =
          "";

        resetScurbCartSwipeStyles();

      }, 250);


      return;
    }


    /* Gesture too short: return cart to center */

    scurbCartPage.style.transform =
      "translate3d(0,0,0)";


    scurbCartPage.style.opacity =
      "1";


    setTimeout(function(){

      resetScurbCartSwipeStyles();

    }, 250);

  }
);


/* TOUCH CANCEL */

scurbCartPage?.addEventListener(
  "touchcancel",
  function(){

    if(!scurbCartSwipeActive){
      return;
    }


    scurbCartSwipeActive = false;


    scurbCartPage.style.transition =
      "transform .25s ease, opacity .2s ease";


    scurbCartPage.style.transform =
      "translate3d(0,0,0)";


    scurbCartPage.style.opacity =
      "1";


    setTimeout(function(){

      resetScurbCartSwipeStyles();

    }, 250);

  }
);


/* =========================================
   POPUP BOOK BUTTONS
   SYNCHRONIZED WITH HOME + CART
========================================= */

const scurbPopupBookButtonMap = {

  fridgeCleaningBookBtn:
    "openFridgeCleaningPopup",

  sweepingMoppingBookBtn:
    "openSweepingMoppingPopup",

  windowCleaningBookBtn:
    "openWindowCleaningPopup",

  bikeCleaningBookBtn:
    "openBikeCleaningPopup",

  bedroomCleaningBookBtn:
    "openBedroomCleaningPopup",

  bathroomCleaningBookBtn:
    "openBathroomCleaningPopup",

  acCleaningBookBtn:
    "openAcCleaningPopup",

  utilitiesCleaningBookBtn:
    "openUtilitiesCleaningPopup",

  fanCleaningBookBtn:
    "openFanCleaningPopup",

  ironingBookBtn:
    "openIroningPopup",

  kitchenHelpBookBtn:
    "openKitchenHelpPopup",

  laundryServiceBookBtn:
    "openLaundryServicePopup",

  packingUnpackingBookBtn:
    "openPackingUnpackingPopup",

  shopCleaningBookBtn:
    "openShopCleaningPopup",

  dustingWipingBookBtn:
    "openDustingWipingPopup",

  stageCleaningBookBtn:
    "openStageCleaningPopup"

};


/* GET HOME SERVICE CARD FROM POPUP BUTTON */

function getScurbCardFromPopupButton(
  popupButton
){

  if(!popupButton){
    return null;
  }

  const serviceCardId =
    scurbPopupBookButtonMap[
      popupButton.id
    ];

  if(!serviceCardId){
    return null;
  }

  return document.getElementById(
    serviceCardId
  );
}


/* GET CURRENT SERVICE QUANTITY */

function getScurbPopupServiceQuantity(
  serviceCard
){

  const cartService =
    findScurbCartService(
      serviceCard
    );

  return Number(
    cartService?.quantity || 0
  );
}

function getScurbPopupQuantityLabel(
  serviceCard,
  quantity
){

  const serviceName =
    getScurbServiceName(serviceCard)
      .toLowerCase();

  const single =
    Number(quantity || 0) <= 1;

  if(serviceName.includes("utilities")){
    return single ? "Item" : "Items";
  }

  if(serviceName.includes("kitchen help")){
    return single ? "Hour" : "Hours";
  }

  if(
    serviceName.includes("dusting") ||
    serviceName.includes("wiping") ||
    serviceName.includes("sweeping") ||
    serviceName.includes("mopping")
  ){
    return single ? "Room" : "Rooms";
  }

  if(
    serviceName.includes("packing") ||
    serviceName.includes("unpacking")
  ){
    return single
      ? "Box or Bag"
      : "Boxes or Bags";
  }

  if(
    serviceName.includes("ironing") ||
    serviceName.includes("laundry")
  ){
    return single
      ? "Piece"
      : "Pieces";
  }

  return getScurbServiceName(serviceCard)
    .replace(/\s+Cleaning$/i, "")
    .replace(/\s+Service$/i, "")
    .replace(/\s+Help$/i, "")
    .trim();
}
/* RENDER ONE POPUP BOOK BUTTON */
function renderScurbPopupBookButton(
  popupButton
){

  const serviceCard =
    getScurbCardFromPopupButton(
      popupButton
    );

  if(!serviceCard){
    return;
  }

  const quantity =
    getScurbPopupServiceQuantity(
      serviceCard
    );


  /* NO QUANTITY — SHOW BOOK */

  if(quantity <= 0){

    popupButton.classList.remove(
      "scurbPopupQtyMode"
    );

    popupButton.replaceChildren();

    popupButton.textContent =
      "Book";

    popupButton.setAttribute(
      "aria-label",
      "Book service"
    );

    return;
  }


  /* SHOW − NUMBER + WITH UNIT */

  popupButton.classList.add(
    "scurbPopupQtyMode"
  );

  popupButton.replaceChildren();


  const quantityRow =
    document.createElement("span");

  quantityRow.className =
    "scurbPopupBookQuantityRow";


  const minus =
    document.createElement("span");

  minus.className =
    "scurbPopupBookMinus";

  minus.textContent =
    "−";


  const quantityText =
    document.createElement("span");

  quantityText.className =
    "scurbPopupBookQty";

  quantityText.textContent =
    String(quantity);


  const plus =
    document.createElement("span");

  plus.className =
    "scurbPopupBookPlus";

  plus.textContent =
    "+";


  quantityRow.append(
    minus,
    quantityText,
    plus
  );


  const quantityLabel =
    document.createElement("span");

  quantityLabel.className =
    "scurbPopupBookQuantityLabel";

  quantityLabel.textContent =
    getScurbPopupQuantityLabel(
      serviceCard,
      quantity
    );


  popupButton.append(
    quantityRow,
    quantityLabel
  );


  popupButton.setAttribute(
    "aria-label",
    `Quantity ${quantity}`
  );
}


/* UPDATE ALL OPEN POPUP BUTTONS */

function updateScurbPopupBookButtons(){

  Object.keys(
    scurbPopupBookButtonMap
  ).forEach(function(buttonId){

    const popupButton =
      document.getElementById(
        buttonId
      );

    if(popupButton){

      renderScurbPopupBookButton(
        popupButton
      );

    }

  });
}
/* =========================================
   POPUP BOOK / − / + CLICK
========================================= */

document.addEventListener(
  "click",
  function(event){

    const popupButton =
      event.target.closest(
        ".scurbServiceHeaderBookBtn"
      );

    if(!popupButton){
      return;
    }

    const serviceCardId =
      scurbPopupBookButtonMap[
        popupButton.id
      ];

    if(!serviceCardId){
      return;
    }

    const serviceCard =
      document.getElementById(
        serviceCardId
      );

    if(!serviceCard){
      console.error(
        "Service card not found:",
        serviceCardId
      );

      return;
    }

    event.preventDefault();
    event.stopPropagation();


    /* MINUS */

    if(
      event.target.closest(
        ".scurbPopupBookMinus"
      )
    ){

      changeScurbServiceQuantity(
        serviceCard,
        -1
      );

      return;
    }


    /* QUANTITY NUMBER — DO NOTHING */

    if(
      event.target.closest(
        ".scurbPopupBookQty"
      )
    ){
      return;
    }


    /* BOOK OR PLUS */

    changeScurbServiceQuantity(
      serviceCard,
      1
    );

  }
);
/* =========================================
   UPDATE BOOK BUTTON AFTER POPUP OPENS
========================================= */

document.addEventListener(
  "click",
  function(event){

    const serviceCard =
      event.target.closest(
        ".scurbServiceCard"
      );

    if(!serviceCard){
      return;
    }

    if(
      event.target.closest(
        ".scurbServiceAddBtn"
      )
    ){
      return;
    }

    /*
      Popup HTML is inserted by the service
      popup file. Wait until that finishes.
    */

    setTimeout(function(){

      updateScurbPopupBookButtons();

    }, 0);

  }
);

/* =========================================
   SCRUBMATE COUPON
========================================= */

const SCURB_COUPON_CODE =
  "SCRUBMATE";

let scurbAppliedCoupon =
  localStorage.getItem(
    "scurbMateAppliedCoupon"
  ) === SCURB_COUPON_CODE;


/* =========================================
   GET COUPON DISCOUNT
========================================= */

function getScurbCouponDiscount(
  serviceTotal
){

  if(!scurbAppliedCoupon){
    return 0;
  }

  const total =
    Number(serviceTotal || 0);

  if(total >= 600){
    return 60;
  }

  if(total >= 400){
    return 50;
  }

  return 0;
}


/* =========================================
   OPEN COUPON POPUP
========================================= */

function openScurbCouponPopup(){

  if(!scurbCouponPopup){
    return;
  }

  scurbCouponPopup.classList.add(
    "show"
  );

  scurbCouponPopup.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  resetScurbCouponPopupState();

  setTimeout(function(){

    scurbCouponInput?.focus();

  }, 250);
}


/* =========================================
   CLOSE COUPON POPUP
========================================= */

function closeScurbCouponPopup(){

  if(!scurbCouponPopup){
    return;
  }

  scurbCouponPopup.classList.remove(
    "show"
  );

  scurbCouponPopup.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    scurbCartPage?.classList.contains("show")
      ? "hidden"
      : "";
}


/* =========================================
   RESET POPUP STATE
========================================= */

function resetScurbCouponPopupState(){

  if(scurbCouponInput){

    scurbCouponInput.value =
      scurbAppliedCoupon
        ? SCURB_COUPON_CODE
        : "";
  }

  if(scurbCouponMessage){

    scurbCouponMessage.textContent = "";
    scurbCouponMessage.classList.remove(
      "success"
    );
  }
/* WRONG COUPON SEARCH */

if(scurbCouponAvailableCard){

  scurbCouponAvailableCard.hidden =
    true;

  scurbCouponAvailableCard.style.display =
    "none";

}

if(scurbCouponEmptyState){

  scurbCouponEmptyState.hidden =
    false;

  scurbCouponEmptyState.style.display =
    "flex";

}
}


/* =========================================
   APPLY COUPON
========================================= */

function applyScurbCoupon(){

  const enteredCode =
    String(
      scurbCouponInput?.value || ""
    )
      .trim()
      .toUpperCase();

if(enteredCode !== SCURB_COUPON_CODE){

  /* HIDE SCRUBMATE COUPON CARD */

  if(scurbCouponAvailableCard){

    scurbCouponAvailableCard.hidden =
      true;

    scurbCouponAvailableCard.style.display =
      "none";

  }


  /* SHOW NO COUPON AVAILABLE */

  if(scurbCouponEmptyState){

    scurbCouponEmptyState.hidden =
      false;

    scurbCouponEmptyState.style.display =
      "flex";

  }


  if(scurbCouponMessage){

    scurbCouponMessage.textContent = "";

    scurbCouponMessage.classList.remove(
      "success"
    );

  }

  return;
}

  const serviceTotal =
    scurbServiceCart.reduce(
      function(total, item){

        return total +
          (
            Number(item.price || 0) *
            Number(item.quantity || 0)
          );

      },
      0
    );


  if(serviceTotal < 400){

    if(scurbCouponAvailableCard){

      scurbCouponAvailableCard.hidden =
        false;
    }

    if(scurbCouponEmptyState){

      scurbCouponEmptyState.hidden =
        true;
    }

    if(scurbCouponMessage){

      scurbCouponMessage.textContent =
        `Add ₹${400 - serviceTotal} more to use this coupon`;

      scurbCouponMessage.classList.remove(
        "success"
      );
    }

    return;
  }


  scurbAppliedCoupon = true;

  localStorage.setItem(
    "scurbMateAppliedCoupon",
    SCURB_COUPON_CODE
  );


  if(scurbCouponMessage){

    scurbCouponMessage.textContent =
      serviceTotal >= 600
        ? "Coupon applied! You saved ₹60"
        : "Coupon applied! You saved ₹50";

    scurbCouponMessage.classList.add(
      "success"
    );
  }


  renderScurbCartPage();


  setTimeout(function(){

    closeScurbCouponPopup();

  }, 650);
}
scurbCartPromoCard
  ?.addEventListener(
    "click",
    openScurbCouponPopup
  );


scurbCouponCloseButton
  ?.addEventListener(
    "click",
    closeScurbCouponPopup
  );


scurbCouponBackdrop
  ?.addEventListener(
    "click",
    closeScurbCouponPopup
  );


scurbCouponApplyButton
  ?.addEventListener(
    "click",
    applyScurbCoupon
  );


scurbCouponQuickApplyButton
  ?.addEventListener(
    "click",
    function(){

      if(scurbCouponInput){

        scurbCouponInput.value =
          SCURB_COUPON_CODE;
      }

      applyScurbCoupon();
    }
  );


scurbCouponInput
  ?.addEventListener(
    "input",
    function(){

      const searchedCode =
        String(
          scurbCouponInput.value || ""
        )
          .trim()
          .toUpperCase()
          .replace(/\s/g, "");


      /* KEEP INPUT CAPITAL */

      scurbCouponInput.value =
        searchedCode;


      /* CLEAR OLD MESSAGE */

      if(scurbCouponMessage){

        scurbCouponMessage.textContent = "";

        scurbCouponMessage.classList.remove(
          "success"
        );
      }


      /*
         EMPTY INPUT:
         Show available SCRUBMATE coupon.
      */

      if(searchedCode === ""){

  if(scurbCouponAvailableCard){

    scurbCouponAvailableCard.hidden =
      false;

    scurbCouponAvailableCard.style.display =
      "";

  }

  if(scurbCouponEmptyState){

    scurbCouponEmptyState.hidden =
      true;

    scurbCouponEmptyState.style.display =
      "none";

  }

  return;
}


      /*
         MATCHING SEARCH:
         Show SCRUBMATE coupon while typing.

         Examples:
         S
         SCR
         SCRUB
         SCRUBMATE
      */

      const couponMatches =
        SCURB_COUPON_CODE.startsWith(
          searchedCode
        );


     if(couponMatches){

  if(scurbCouponAvailableCard){

    scurbCouponAvailableCard.hidden =
      false;

    scurbCouponAvailableCard.style.display =
      "";

  }

  if(scurbCouponEmptyState){

    scurbCouponEmptyState.hidden =
      true;

    scurbCouponEmptyState.style.display =
      "none";

  }

  return;
}


      /*
         WRONG SEARCH:
         Hide coupon and show no results.
      */

     if(scurbCouponAvailableCard){

  scurbCouponAvailableCard.hidden =
    true;

  scurbCouponAvailableCard.style.display =
    "none";

}

if(scurbCouponEmptyState){

  scurbCouponEmptyState.hidden =
    false;

  scurbCouponEmptyState.style.display =
    "flex";

}

    }
  );