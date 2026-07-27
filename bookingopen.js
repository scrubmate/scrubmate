(function(){

  /* =========================================
     SCRUB MATE BOOKINGS
  ========================================= */

  const scurbUpcomingTab =
    document.getElementById("scurbUpcomingTab");

  const scurbPastTab =
    document.getElementById("scurbPastTab");

  const scurbBookingsIndicator =
    document.getElementById("scurbBookingsIndicator");

  const scurbBookingsList =
    document.getElementById("scurbBookingsList");

  const scurbBookingsEmpty =
    document.getElementById("scurbBookingsEmpty");

  const scurbBookingsEmptyText =
    document.getElementById("scurbBookingsEmptyText");

  const scurbBookingsEmptyIcon =
    document.getElementById("scurbBookingsEmptyIcon");

  const scurbBookingsLoading =
    document.getElementById("scurbBookingsLoading");


  /*
    Keep all the remaining bookings code here.
    Do not close this function until the very end.
  */


 // ADD THIS ONLY AT THE VERY END


let scurbAllBookings = [];

let scurbActiveBookingTab =
  "upcoming";

let scurbBookingsRequestId = 0;


/* =========================================
   GET LOGGED-IN MOBILE NUMBER
========================================= */

function getScurbLoggedInMobile(){

  const isLoggedIn =
    localStorage.getItem(
      "scrubMateLoggedIn"
    ) === "true";

  const isGuest =
    localStorage.getItem(
      "scrubMateGuestMode"
    ) === "true";


  if(!isLoggedIn || isGuest){
    return "";
  }


  let user = null;

  try{

    user =
      JSON.parse(
        localStorage.getItem(
          "scrubMateUser"
        ) || "null"
      );

  }catch(error){

    console.error(
      "Unable to read Scrub Mate user:",
      error
    );

  }


  return String(
    user?.mobile ||
    user?.phoneNumber ||
    localStorage.getItem(
      "scrubMateMobile"
    ) ||
    ""
  )
    .replace(/\D/g, "")
    .slice(-10);
}


/* =========================================
   NORMALIZE BOOKING STATUS
========================================= */

function normalizeScurbBookingStatus(status){

  return String(status || "placed")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}


/* =========================================
   CHECK WHETHER BOOKING IS PAST
========================================= */

function isScurbPastBooking(booking){

  const status =
    normalizeScurbBookingStatus(
      booking?.booking_status
    );

  return [
    "completed",
    "delivered",
    "cancelled",
    "canceled",
    "rejected",
    "refunded"
  ].includes(status);
}


/* =========================================
   FORMAT BOOKING STATUS
========================================= */

function formatScurbBookingStatus(status){

  const normalized =
    normalizeScurbBookingStatus(status);

  const statusNames = {

    placed:"Placed",

    confirmed:"Confirmed",

    accepted:"Confirmed",

    assigned:"Partner Assigned",

    partner_assigned:"Partner Assigned",

    on_the_way:"On the Way",

    arrived:"Partner Arrived",

    in_progress:"In Progress",

    completed:"Completed",

    delivered:"Completed",

    cancelled:"Cancelled",

    canceled:"Cancelled",

    rejected:"Rejected",

    refunded:"Refunded"

  };


  return (
    statusNames[normalized] ||
    normalized
      .replace(/_/g, " ")
      .replace(/\b\w/g, function(letter){
        return letter.toUpperCase();
      })
  );
}


/* =========================================
   GET STATUS CLASS
========================================= */

function getScurbBookingStatusClass(status){

  const normalized =
    normalizeScurbBookingStatus(status);

  if(
    normalized === "completed" ||
    normalized === "delivered"
  ){
    return "completed";
  }

  if(
    normalized === "cancelled" ||
    normalized === "canceled" ||
    normalized === "rejected" ||
    normalized === "refunded"
  ){
    return "cancelled";
  }

  return "";
}


/* =========================================
   GET BOOKING DATE
========================================= */

function getScurbBookingDateValue(booking){

  return (
    booking?.created_at ||
    booking?.metadata?.booked_at ||
    null
  );
}


/* =========================================
   FORMAT BOOKING DATE
========================================= */

function formatScurbBookingDate(value){

  if(!value){
    return "Date unavailable";
  }

  const date =
    new Date(value);

  if(Number.isNaN(date.getTime())){
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day:"numeric",
      month:"short",
      year:"numeric",
      hour:"numeric",
      minute:"2-digit"
    }
  ).format(date);
}


/* =========================================
   GET BOOKING SERVICES
========================================= */

function getScurbBookingServices(booking){

  const services =
    booking?.services;

  if(Array.isArray(services)){
    return services;
  }

  if(typeof services === "string"){

    try{

      const parsedServices =
        JSON.parse(services);

      return Array.isArray(parsedServices)
        ? parsedServices
        : [];

    }catch(error){

      return [];

    }

  }

  return [];
}


/* =========================================
   CREATE BOOKING CARD
========================================= */

function createScurbBookingCard(booking){

  const card =
    document.createElement("article");

  card.className =
    "scurb-booking-card";
card.setAttribute(
  "role",
  "button"
);

card.setAttribute(
  "tabindex",
  "0"
);

card.addEventListener(
  "click",
  function(){

    openScurbBookingDetails(
      booking
    );

  }
);

card.addEventListener(
  "keydown",
  function(event){

    if(
      event.key === "Enter" ||
      event.key === " "
    ){

      event.preventDefault();

      openScurbBookingDetails(
        booking
      );

    }

  }
);

  const status =
    normalizeScurbBookingStatus(
      booking.booking_status
    );

  const formattedStatus =
    formatScurbBookingStatus(status);

  const statusClass =
    getScurbBookingStatusClass(status);

  const services =
    getScurbBookingServices(booking);

  const visibleServices =
    services.slice(0, 3);


  /* TOP */

  const top =
    document.createElement("div");

  top.className =
    "scurb-booking-card-top";


  const idWrap =
    document.createElement("div");

  idWrap.className =
    "scurb-booking-id-wrap";


  const idLabel =
    document.createElement("span");

  idLabel.className =
    "scurb-booking-label";

  idLabel.textContent =
    "Booking ID";


  const bookingId =
    document.createElement("strong");

  bookingId.className =
    "scurb-booking-id";

  bookingId.textContent =
    booking.order_id ||
    booking.id ||
    "Scrub Mate Booking";


  idWrap.append(
    idLabel,
    bookingId
  );


  const statusElement =
    document.createElement("span");

  statusElement.className =
    [
      "scurb-booking-status",
      statusClass
    ]
      .filter(Boolean)
      .join(" ");

  statusElement.textContent =
    formattedStatus;


  top.append(
    idWrap,
    statusElement
  );


  /* SERVICES */

  const servicesHolder =
    document.createElement("div");

  servicesHolder.className =
    "scurb-booking-services";


  if(visibleServices.length){

    visibleServices.forEach(function(service){

      const serviceRow =
        document.createElement("div");

      serviceRow.className =
        "scurb-booking-service";


      const serviceName =
        document.createElement("span");

      serviceName.className =
        "scurb-booking-service-name";

      serviceName.textContent =
        service?.name ||
        service?.service_name ||
        "Cleaning Service";


      const serviceQuantity =
        document.createElement("span");

      serviceQuantity.className =
        "scurb-booking-service-quantity";

      serviceQuantity.textContent =
        `× ${Number(
          service?.quantity || 1
        )}`;


      serviceRow.append(
        serviceName,
        serviceQuantity
      );

      servicesHolder.appendChild(
        serviceRow
      );

    });


    if(services.length > 3){

      const remaining =
        document.createElement("span");

      remaining.className =
        "scurb-booking-more-services";

      remaining.textContent =
        `+${services.length - 3} more services`;

      servicesHolder.appendChild(
        remaining
      );

    }

  }else{

    const fallback =
      document.createElement("span");

    fallback.className =
      "scurb-booking-service-name";

    fallback.textContent =
      "Cleaning service";

    servicesHolder.appendChild(
      fallback
    );

  }


  /* DIVIDER */

  const divider =
    document.createElement("div");

  divider.className =
    "scurb-booking-divider";


  /* BOTTOM */

  const bottom =
    document.createElement("div");

  bottom.className =
    "scurb-booking-bottom";


 const dateHolder =
  document.createElement("div");

dateHolder.className =
  "scurb-booking-date";


/* BOOKING DATE */

const dateText =
  document.createElement("span");

dateText.className =
  "scurb-booking-created-date";


const dateIcon =
  document.createElement("i");

dateIcon.className =
  "fa-regular fa-calendar";


dateText.appendChild(
  dateIcon
);

dateText.append(
  document.createTextNode(
    formatScurbBookingDate(
      getScurbBookingDateValue(
        booking
      )
    )
  )
);


/* CUSTOMER DETAILS */

const customerDetails =
  document.createElement("div");

customerDetails.className =
  "scurb-booking-customer-details";


/* CUSTOMER NAME */

const customerNameRow =
  document.createElement("div");

customerNameRow.className =
  "scurb-booking-customer-row";


const customerNameIcon =
  document.createElement("i");

customerNameIcon.className =
  "fa-regular fa-user";


const customerNameText =
  document.createElement("span");

customerNameText.textContent =
  booking.customer_name ||
  "Scrub Mate User";


customerNameRow.append(
  customerNameIcon,
  customerNameText
);


/* MOBILE NUMBER */

const mobileRow =
  document.createElement("div");

mobileRow.className =
  "scurb-booking-customer-row";


const mobileIcon =
  document.createElement("i");

mobileIcon.className =
  "fa-solid fa-phone";


const mobileText =
  document.createElement("span");

const bookingMobile =
  String(
    booking.customer_mobile || ""
  )
    .replace(/\D/g, "")
    .slice(-10);

mobileText.textContent =
  bookingMobile.length === 10
    ? `+91 ${bookingMobile}`
    : "Mobile unavailable";


mobileRow.append(
  mobileIcon,
  mobileText
);


/* SERVICE ADDRESS */

const addressRow =
  document.createElement("div");

addressRow.className =
  "scurb-booking-customer-row scurb-booking-address-row";


const addressIcon =
  document.createElement("i");

addressIcon.className =
  "fa-solid fa-location-dot";


const addressText =
  document.createElement("span");

const bookingAddress =
  booking.service_address ||
  [
    booking.street_name,
    booking.neighbourhood,
    booking.village,
    booking.city
  ]
    .filter(Boolean)
    .join(", ");

addressText.textContent =
  bookingAddress ||
  "Address unavailable";


addressRow.append(
  addressIcon,
  addressText
);


customerDetails.append(
  customerNameRow,
  mobileRow,
  addressRow
);


dateHolder.append(
  dateText,
  customerDetails
);

  


  bottom.appendChild(
  dateHolder
);


  card.append(
    top,
    servicesHolder,
    divider,
    bottom
  );


  return card;
}


/* =========================================
   SHOW BOOKINGS EMPTY STATE
========================================= */

function showScurbBookingsEmpty(){

  if(scurbBookingsList){
    scurbBookingsList.replaceChildren();
  }

  if(scurbBookingsEmpty){
    scurbBookingsEmpty.classList.remove(
      "hide"
    );
  }

  if(scurbBookingsEmptyText){

    scurbBookingsEmptyText.textContent =
      scurbActiveBookingTab === "upcoming"
        ? "No upcoming bookings"
        : "No past bookings";

  }

  if(scurbBookingsEmptyIcon){

    scurbBookingsEmptyIcon.className =
      scurbActiveBookingTab === "upcoming"
        ? "fa-regular fa-calendar-check"
        : "fa-solid fa-clock-rotate-left";

  }

}


/* =========================================
   RENDER BOOKINGS
========================================= */

function renderScurbBookings(){

  if(!scurbBookingsList){
    return;
  }


  const filteredBookings =
    scurbAllBookings.filter(
      function(booking){

        const past =
          isScurbPastBooking(booking);

        return scurbActiveBookingTab ===
          "past"
            ? past
            : !past;

      }
    );


  scurbBookingsList.replaceChildren();


  if(!filteredBookings.length){

    showScurbBookingsEmpty();

    return;
  }


  scurbBookingsEmpty?.classList.add(
    "hide"
  );


  const fragment =
    document.createDocumentFragment();


  filteredBookings.forEach(
    function(booking){

      fragment.appendChild(
        createScurbBookingCard(
          booking
        )
      );

    }
  );


  scurbBookingsList.appendChild(
    fragment
  );
}


/* =========================================
   SET BOOKINGS TAB
========================================= */

function setScurbBookingsTab(tab){

  scurbActiveBookingTab =
    tab === "past"
      ? "past"
      : "upcoming";


  scurbUpcomingTab?.classList.toggle(
    "active",
    scurbActiveBookingTab === "upcoming"
  );

  scurbPastTab?.classList.toggle(
    "active",
    scurbActiveBookingTab === "past"
  );


  /*
    Keep your existing indicator animation.
    This moves it to the second tab for Past.
  */

  if(scurbBookingsIndicator){

    scurbBookingsIndicator.style.transform =
      scurbActiveBookingTab === "past"
        ? "translateX(100%)"
        : "translateX(0)";

  }


  renderScurbBookings();
}


/* =========================================
   LOAD BOOKINGS FROM SUPABASE
========================================= */

async function loadScurbBookings(){

  const currentRequestId =
    ++scurbBookingsRequestId;

  const mobile =
    getScurbLoggedInMobile();


  scurbAllBookings = [];

  scurbBookingsList?.replaceChildren();

  scurbBookingsEmpty?.classList.add(
    "hide"
  );


  /*
    Guest or not logged in:
    do not call Supabase.
    Keep same empty UI.
  */

  if(mobile.length !== 10){

    scurbBookingsLoading.hidden =
      true;

    showScurbBookingsEmpty();

    return;
  }


  scurbBookingsLoading.hidden =
    false;


  try{

    const client =
      window.supabaseClient ||
      supabaseClient;


    const result =
      await client
        .from("scrubmate_orders")
.select(`
  id,
  order_id,

  customer_name,
  customer_mobile,
  customer_email,

  service_address,
  street_name,
  neighbourhood,
  village,
  city,

  latitude,
  longitude,

  cleaner_name,
  cleaner_mobile,
  cleaner_latitude,
  cleaner_longitude,
  estimated_arrival_minutes,

  services,
  total_quantity,

  original_service_total,
  service_total,
  service_discount,
  delivery_fee,
  coupon_discount,
  final_amount,

  payment_amount,
  payment_method,
  payment_status,

  booking_status,
  metadata,
  created_at
`)
        .eq(
          "customer_mobile",
          mobile
        )
        .order(
          "created_at",
          {
            ascending:false
          }
        );


    /*
      Prevent an older request from replacing
      the latest bookings request.
    */

    if(
      currentRequestId !==
      scurbBookingsRequestId
    ){
      return;
    }


    if(result.error){
      throw result.error;
    }


    scurbAllBookings =
      Array.isArray(result.data)
        ? result.data
        : [];


    renderScurbBookings();

  }catch(error){

    console.error(
      "Unable to load Scrub Mate bookings:",
      error
    );

    scurbAllBookings = [];

    showScurbBookingsEmpty();

  }finally{

    if(
      currentRequestId ===
      scurbBookingsRequestId &&
      scurbBookingsLoading
    ){

      scurbBookingsLoading.hidden =
        true;

    }

  }

}


/* =========================================
   BOOKINGS TAB CLICKS
========================================= */

scurbUpcomingTab?.addEventListener(
  "click",
  function(){

    setScurbBookingsTab(
      "upcoming"
    );

  }
);


scurbPastTab?.addEventListener(
  "click",
  function(){

    setScurbBookingsTab(
      "past"
    );

  }
);


/* =========================================
   LOAD WHEN BOOKINGS NAVIGATION OPENS
========================================= */

scurbBookingsNavButton?.addEventListener(
  "click",
  function(){

    setScurbBookingsTab(
      scurbActiveBookingTab
    );

    loadScurbBookings();

  }
);


/* =========================================
   INITIAL EMPTY UI
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function(){

    setScurbBookingsTab(
      "upcoming"
    );

  }
);

/* =========================================
   ORDER TRACKING ELEMENTS
========================================= */

const scurbOrderTrackingPage =
  document.getElementById(
    "scurbOrderTrackingPage"
  );

const scurbOrderBackButton =
  document.getElementById(
    "scurbOrderBackButton"
  );


const scurbOrderStatusIcon =
  document.getElementById(
    "scurbOrderStatusIcon"
  );

const scurbOrderStatusTitle =
  document.getElementById(
    "scurbOrderStatusTitle"
  );

const scurbOrderStatusDescription =
  document.getElementById(
    "scurbOrderStatusDescription"
  );

const scurbOrderCleanerCard =
  document.getElementById(
    "scurbOrderCleanerCard"
  );

const scurbOrderCleanerName =
  document.getElementById(
    "scurbOrderCleanerName"
  );

const scurbOrderCleanerArrival =
  document.getElementById(
    "scurbOrderCleanerArrival"
  );

const scurbOrderCleanerCall =
  document.getElementById(
    "scurbOrderCleanerCall"
  );

const scurbOrderStatusBadge =
  document.getElementById(
    "scurbOrderStatusBadge"
  );

const scurbOrderBookingId =
  document.getElementById(
    "scurbOrderBookingId"
  );

const scurbOrderBookingDate =
  document.getElementById(
    "scurbOrderBookingDate"
  );

const scurbOrderServicesList =
  document.getElementById(
    "scurbOrderServicesList"
  );

const scurbOrderCustomerName =
  document.getElementById(
    "scurbOrderCustomerName"
  );

const scurbOrderCustomerMobile =
  document.getElementById(
    "scurbOrderCustomerMobile"
  );

const scurbOrderCustomerAddress =
  document.getElementById(
    "scurbOrderCustomerAddress"
  );

const scurbOrderServiceTotal =
  document.getElementById(
    "scurbOrderServiceTotal"
  );

const scurbOrderServiceDiscount =
  document.getElementById(
    "scurbOrderServiceDiscount"
  );

const scurbOrderDeliveryFee =
  document.getElementById(
    "scurbOrderDeliveryFee"
  );

const scurbOrderCouponRow =
  document.getElementById(
    "scurbOrderCouponRow"
  );

const scurbOrderCouponDiscount =
  document.getElementById(
    "scurbOrderCouponDiscount"
  );

const scurbOrderFinalAmount =
  document.getElementById(
    "scurbOrderFinalAmount"
  );


let scurbTrackingMap = null;

let scurbTrackingCustomerMarker = null;

let scurbTrackingCleanerMarker = null;

let scurbTrackingRouteLine = null;


/* =========================================
   CLEANER DETAILS
========================================= */

function getScurbTrackingCleanerName(
  booking
){

  return (
    booking.cleaner_name ||
    booking.service_partner_name ||
    booking.assigned_partner_name ||
    booking.delivery_boy_name ||
    ""
  );
}


function getScurbTrackingCleanerMobile(
  booking
){

  return String(
    booking.cleaner_mobile ||
    booking.service_partner_mobile ||
    booking.assigned_partner_mobile ||
    booking.delivery_boy_mobile ||
    ""
  )
    .replace(/\D/g, "")
    .slice(-10);
}


/* =========================================
   CHECK CLEANER ASSIGNMENT
========================================= */

function hasScurbCleanerAccepted(
  booking
){

  const status =
    normalizeScurbBookingStatus(
      booking.booking_status
    );

  const cleanerName =
    getScurbTrackingCleanerName(
      booking
    );

  return Boolean(cleanerName) || [
    "confirmed",
    "accepted",
    "assigned",
    "partner_assigned",
    "on_the_way",
    "arrived",
    "in_progress",
    "completed",
    "delivered"
  ].includes(status);
}


/* =========================================
   UPDATE STATUS
========================================= */

function updateScurbOrderTrackingStatus(
  booking
){

  const status =
    normalizeScurbBookingStatus(
      booking.booking_status
    );

  const cleanerAccepted =
    hasScurbCleanerAccepted(
      booking
    );

  const cleanerName =
    getScurbTrackingCleanerName(
      booking
    );

  const arrivalMinutes =
    Math.max(
      1,
      Number(
        booking.estimated_arrival_minutes ||
        15
      )
    );


  scurbOrderStatusBadge.textContent =
    formatScurbBookingStatus(
      status
    );

  scurbOrderStatusBadge.className =
    [
      "scurbOrderStatusBadge",
      getScurbBookingStatusClass(
        status
      )
    ]
      .filter(Boolean)
      .join(" ");


  /*
    WAITING STATE
  */

  if(
    status === "placed" &&
    !cleanerAccepted
  ){

    scurbOrderStatusIcon.className =
      "fa-solid fa-person-dress";

    scurbOrderStatusTitle.textContent =
      "Waiting for a professional cleaner";

    scurbOrderStatusDescription.textContent =
      "We are finding an available professional cleaner near your location.";

    scurbOrderCleanerCard.hidden =
      true;

    

    return;
  }


  /*
    CLEANER ACCEPTED
  */

  if(
    status === "confirmed" ||
    status === "accepted" ||
    status === "assigned" ||
    status === "partner_assigned"
  ){

    scurbOrderStatusIcon.className =
      "fa-solid fa-circle-check";

    scurbOrderStatusTitle.textContent =
      "Professional cleaner assigned";

    scurbOrderStatusDescription.textContent =
      `${cleanerName || "Your cleaner"} accepted your booking and will arrive soon.`;

    showScurbAcceptedCleaner(
      booking,
      arrivalMinutes
    );

 

    return;
  }


  /*
    ON THE WAY
  */

  if(status === "on_the_way"){

    scurbOrderStatusIcon.className =
      "fa-solid fa-location-arrow";

    scurbOrderStatusTitle.textContent =
      "Your cleaner is on the way";

    scurbOrderStatusDescription.textContent =
      `${cleanerName || "Your professional cleaner"} is travelling towards your service location.`;

    showScurbAcceptedCleaner(
      booking,
      arrivalMinutes
    );

   

    return;
  }


  /*
    ARRIVED
  */

  if(status === "arrived"){

    scurbOrderStatusIcon.className =
      "fa-solid fa-location-dot";

    scurbOrderStatusTitle.textContent =
      "Your cleaner has arrived";

    scurbOrderStatusDescription.textContent =
      `${cleanerName || "Your professional cleaner"} reached your service location.`;

    showScurbAcceptedCleaner(
      booking,
      0
    );

    scurbOrderCleanerArrival.textContent =
      "Cleaner reached your doorstep";

   
    return;
  }


  /*
    SERVICE IN PROGRESS
  */

  if(status === "in_progress"){

    scurbOrderStatusIcon.className =
      "fa-solid fa-broom";

    scurbOrderStatusTitle.textContent =
      "Cleaning service is in progress";

    scurbOrderStatusDescription.textContent =
      "Your selected cleaning services are currently being completed.";

    showScurbAcceptedCleaner(
      booking,
      0
    );

    scurbOrderCleanerArrival.textContent =
      "Service is currently in progress";



    return;
  }


  /*
    COMPLETED
  */

  if(
    status === "completed" ||
    status === "delivered"
  ){

    scurbOrderStatusIcon.className =
      "fa-solid fa-circle-check";

    scurbOrderStatusTitle.textContent =
      "Cleaning service completed";

    scurbOrderStatusDescription.textContent =
      "Your booking has been completed successfully.";

    if(cleanerAccepted){

      showScurbAcceptedCleaner(
        booking,
        0
      );

      scurbOrderCleanerArrival.textContent =
        "Service completed successfully";

    }else{

      scurbOrderCleanerCard.hidden =
        true;

    }

   

    return;
  }


  /*
    CANCELLED
  */

  if(
    status === "cancelled" ||
    status === "canceled" ||
    status === "rejected"
  ){

    scurbOrderStatusIcon.className =
      "fa-solid fa-circle-xmark";

    scurbOrderStatusTitle.textContent =
      "Booking cancelled";

    scurbOrderStatusDescription.textContent =
      "This booking is no longer active.";

    scurbOrderCleanerCard.hidden =
      true;


    return;
  }


  /*
    FALLBACK
  */

  scurbOrderStatusIcon.className =
    "fa-solid fa-person-dress";

  scurbOrderStatusTitle.textContent =
    formatScurbBookingStatus(
      status
    );

  scurbOrderStatusDescription.textContent =
    "Your booking status has been updated.";

  scurbOrderCleanerCard.hidden =
    !cleanerAccepted;


  if(cleanerAccepted){

    showScurbAcceptedCleaner(
      booking,
      arrivalMinutes
    );

  }

}


/* =========================================
   SHOW ACCEPTED CLEANER
========================================= */

function showScurbAcceptedCleaner(
  booking,
  arrivalMinutes
){

  const cleanerName =
    getScurbTrackingCleanerName(
      booking
    );

  const cleanerMobile =
    getScurbTrackingCleanerMobile(
      booking
    );


  scurbOrderCleanerCard.hidden =
    false;


  scurbOrderCleanerName.textContent =
    cleanerName ||
    "Assigned professional";


  scurbOrderCleanerArrival.textContent =
    arrivalMinutes > 0
      ? `Arriving in approximately ${arrivalMinutes} minutes`
      : "Professional cleaner assigned";


  if(cleanerMobile.length === 10){

    scurbOrderCleanerCall.href =
      `tel:+91${cleanerMobile}`;

    scurbOrderCleanerCall.style.display =
      "flex";

  }else{

    scurbOrderCleanerCall.removeAttribute(
      "href"
    );

    scurbOrderCleanerCall.style.display =
      "none";

  }

}


/* =========================================
   RENDER SERVICES
========================================= */

function renderScurbOrderTrackingServices(
  booking
){

  scurbOrderServicesList.replaceChildren();


  const services =
    getScurbBookingServices(
      booking
    );


  if(!services.length){

    const unavailable =
      document.createElement("p");

    unavailable.textContent =
      "Service details unavailable.";

    scurbOrderServicesList.appendChild(
      unavailable
    );

    return;
  }


  services.forEach(function(service){

    const row =
      document.createElement("div");

    row.className =
      "scurbOrderServiceRow";


    const information =
      document.createElement("div");

    information.className =
      "scurbOrderServiceInformation";


    const name =
      document.createElement("strong");

    name.textContent =
      service.name ||
      service.service_name ||
      "Cleaning Service";


    const quantity =
      Number(
        service.quantity || 1
      );


    const price =
      Number(
        service.price ||
        service.discount_price ||
        0
      );


    const lineTotal =
      Number(
        service.line_total ||
        service.total ||
        price * quantity
      );


    const priceText =
      document.createElement("span");

    priceText.textContent =
      lineTotal > 0
        ? `₹${lineTotal}`
        : "";


    const quantityText =
      document.createElement("span");

    quantityText.className =
      "scurbOrderServiceQuantity";

    quantityText.textContent =
      `× ${quantity}`;


    information.append(
      name,
      priceText
    );


    row.append(
      information,
      quantityText
    );


    scurbOrderServicesList.appendChild(
      row
    );

  });

}


/* =========================================
   RENDER BOOKED LOCATION MAP
========================================= */

function renderScurbBookedLocationMap(
  booking
){

  if(
    !window.L ||
    !document.getElementById(
      "scurbOrderMap"
    )
  ){
    return;
  }


  /*
    These are the exact coordinates saved
    when the customer placed the booking.
  */

  const customerLatitude =
  parseFloat(
    booking.latitude
  );

const customerLongitude =
  parseFloat(
    booking.longitude
  );

const cleanerLatitude =
  parseFloat(
    booking.cleaner_latitude
  );

const cleanerLongitude =
  parseFloat(
    booking.cleaner_longitude
  );


const validCustomerLocation =
  Number.isFinite(customerLatitude) &&
  Number.isFinite(customerLongitude) &&
  customerLatitude !== 0 &&
  customerLongitude !== 0 &&
  Math.abs(customerLatitude) <= 90 &&
  Math.abs(customerLongitude) <= 180;


const validCleanerLocation =
  Number.isFinite(cleanerLatitude) &&
  Number.isFinite(cleanerLongitude) &&
  cleanerLatitude !== 0 &&
  cleanerLongitude !== 0 &&
  Math.abs(cleanerLatitude) <= 90 &&
  Math.abs(cleanerLongitude) <= 180;

  const mapLatitude =
    validCustomerLocation
      ? customerLatitude
      : 16.747578614935353;


  const mapLongitude =
    validCustomerLocation
      ? customerLongitude
      : 81.68208423275695;


  if(!scurbTrackingMap){

    scurbTrackingMap =
      L.map(
        "scurbOrderMap",
        {
          zoomControl:false,
          attributionControl:false
        }
      );


    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom:19
      }
    ).addTo(
      scurbTrackingMap
    );

  }


  scurbTrackingCustomerMarker?.remove();

  scurbTrackingCleanerMarker?.remove();

  scurbTrackingRouteLine?.remove();


  /*
    USER BOOKED LOCATION ICON
  */

  const customerIcon =
  L.divIcon(
    {
      className:"",
      html:`
        <div class="scurbOrderCustomerPin">
          <div class="scurbOrderCustomerPinCircle">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div class="scurbOrderCustomerPinPoint"></div>
        </div>
      `,
      iconSize:[52,62],
      iconAnchor:[26,58]
    }
  );


  if(validCustomerLocation){

  scurbTrackingCustomerMarker =
  L.marker(
    [
      customerLatitude,
      customerLongitude
    ],
    {
      icon:customerIcon,
      zIndexOffset:1000
    }
  )
  .addTo(
    scurbTrackingMap
  );

scurbTrackingMap.setView(
  [
    customerLatitude,
    customerLongitude
  ],
  18
);

  }


  /*
    CLEANER WOMAN ICON
  */

  if(validCleanerLocation){

    const cleanerIcon =
      L.divIcon(
        {
          className:"",
          html:`
            <div class="scurbOrderCleanerMarker">
              <i class="fa-solid fa-person-dress"></i>
            </div>
          `,
          iconSize:[48,48],
          iconAnchor:[24,44]
        }
      );


    scurbTrackingCleanerMarker =
      L.marker(
        [
          cleanerLatitude,
          cleanerLongitude
        ],
        {
          icon:cleanerIcon
        }
      )
      .addTo(
        scurbTrackingMap
      )
      .bindPopup(
        getScurbTrackingCleanerName(
          booking
        ) ||
        "Professional cleaner"
      );


    if(validCustomerLocation){

      scurbTrackingRouteLine =
        L.polyline(
          [
            [
              cleanerLatitude,
              cleanerLongitude
            ],
            [
              customerLatitude,
              customerLongitude
            ]
          ],
          {
            weight:4,
            opacity:.8
          }
        )
        .addTo(
          scurbTrackingMap
        );


      scurbTrackingMap.fitBounds(
        scurbTrackingRouteLine.getBounds(),
        {
          padding:[55,55],
          maxZoom:17
        }
      );

    }else{

      scurbTrackingMap.setView(
        [
          cleanerLatitude,
          cleanerLongitude
        ],
        16
      );

    }

  }else{

    scurbTrackingMap.setView(
      [
        mapLatitude,
        mapLongitude
      ],
      17
    );

  }


  setTimeout(function(){

    scurbTrackingMap.invalidateSize();

  }, 250);

}


/* =========================================
   OPEN ORDER TRACKING
========================================= */

function openScurbBookingDetails(
  booking
){

  if(!scurbOrderTrackingPage){
    return;
  }


  const mobile =
    String(
      booking.customer_mobile || ""
    )
      .replace(/\D/g, "")
      .slice(-10);


  const address =
    booking.service_address ||
    [
      booking.street_name,
      booking.neighbourhood,
      booking.village,
      booking.city
    ]
      .filter(Boolean)
      .join(", ");


  scurbOrderBookingId.textContent =
    booking.order_id ||
    booking.id ||
    "Scrub Mate Booking";


  scurbOrderBookingDate.textContent =
    formatScurbBookingDate(
      getScurbBookingDateValue(
        booking
      )
    );


  scurbOrderCustomerName.textContent =
    booking.customer_name ||
    "Scrub Mate User";


  scurbOrderCustomerMobile.textContent =
    mobile.length === 10
      ? `+91 ${mobile}`
      : "Mobile unavailable";


  scurbOrderCustomerAddress.textContent =
    address ||
    "Address unavailable";


  /*
    BILL DETAILS
  */

  const originalServiceTotal =
    Number(
      booking.original_service_total ||
      booking.service_total ||
      0
    );


  const serviceDiscount =
    Number(
      booking.service_discount ||
      0
    );


  const deliveryFee =
    Number(
      booking.delivery_fee ||
      0
    );


  const couponDiscount =
    Number(
      booking.coupon_discount ||
      0
    );


  const finalAmount =
    Number(
      booking.final_amount ||
      booking.payment_amount ||
      0
    );


  scurbOrderServiceTotal.textContent =
    `₹${originalServiceTotal}`;


  scurbOrderServiceDiscount.textContent =
    `− ₹${serviceDiscount}`;


  scurbOrderDeliveryFee.textContent =
    deliveryFee === 0
      ? "FREE"
      : `₹${deliveryFee}`;


  /*
    COUPON ROW:
    hide fully when discount is zero.
  */

  if(couponDiscount > 0){

    scurbOrderCouponRow.hidden =
      false;

    scurbOrderCouponRow.style.display =
      "flex";

    scurbOrderCouponDiscount.textContent =
      `− ₹${couponDiscount}`;

  }else{

    scurbOrderCouponRow.hidden =
      true;

    scurbOrderCouponRow.style.display =
      "none";

  }


  scurbOrderFinalAmount.textContent =
    `₹${finalAmount}`;


  updateScurbOrderTrackingStatus(
    booking
  );


  renderScurbOrderTrackingServices(
    booking
  );


  scurbOrderTrackingPage.classList.add(
    "show"
  );


  scurbOrderTrackingPage.setAttribute(
    "aria-hidden",
    "false"
  );


  document.body.style.overflow =
    "hidden";


  setTimeout(function(){

    renderScurbBookedLocationMap(
      booking
    );

  }, 80);

}


/* =========================================
   CLOSE ORDER TRACKING
========================================= */

function closeScurbOrderTracking(){

  if(!scurbOrderTrackingPage){
    return;
  }


  scurbOrderTrackingPage.classList.remove(
    "show"
  );


  scurbOrderTrackingPage.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.style.overflow =
    "hidden";

}


scurbOrderBackButton?.addEventListener(
  "click",
  closeScurbOrderTracking
);

})();
let scurbOrderSwipeStartX = 0;
let scurbOrderSwipeCurrentX = 0;
let scurbOrderSwipeDragging = false;

const SCURB_ORDER_EDGE_SIZE = 35;
const SCURB_ORDER_CLOSE_DISTANCE = 90;
function setupScurbOrderSwipeBack(){

  if(!scurbOrderTrackingPage){
    return;
  }

  scurbOrderTrackingPage.addEventListener(
    "touchstart",
    function(event){

      if(event.touches.length !== 1){
        return;
      }

      const touch =
        event.touches[0];

      const startX =
        touch.clientX;

      const screenWidth =
        window.innerWidth;

      if(
        startX <= SCURB_ORDER_EDGE_SIZE ||
        startX >=
        screenWidth -
        SCURB_ORDER_EDGE_SIZE
      ){

        scurbOrderSwipeDragging =
          true;

        scurbOrderSwipeStartX =
          startX;

        scurbOrderSwipeCurrentX =
          startX;

      }

    },
    { passive:true }
  );


  scurbOrderTrackingPage.addEventListener(
    "touchmove",
    function(event){

      if(!scurbOrderSwipeDragging){
        return;
      }

      scurbOrderSwipeCurrentX =
        event.touches[0].clientX;

    },
    { passive:true }
  );


  scurbOrderTrackingPage.addEventListener(
    "touchend",
    function(){

      if(!scurbOrderSwipeDragging){
        return;
      }

      const delta =
        Math.abs(
          scurbOrderSwipeCurrentX -
          scurbOrderSwipeStartX
        );

      scurbOrderSwipeDragging =
        false;

      if(
        delta >=
        SCURB_ORDER_CLOSE_DISTANCE
      ){

        closeScurbOrderTracking();

      }

    }
  );

}
