import { ABOUT_ROUTE, CONTACT_ROUTE, HOME_ROUTE ,VENDOR_REGISTER_ROUTE,SHOP_ROUTE, STORE_ROUTE } from "./routes";

const navMenu = [
    {
      route: HOME_ROUTE,
      label: "Home"
    },
    {
        route: SHOP_ROUTE,
        label: "Shop"
    },
    {
        route: STORE_ROUTE,
      label: "Store Manager"
    },
    {
        route: VENDOR_REGISTER_ROUTE,
        label: "Vendor Registration"
    },
    {
      route: ABOUT_ROUTE,
      label: "About Us"
    },
    {
      route: CONTACT_ROUTE,
      label: "Contact"
    },
  ]

  export default navMenu;