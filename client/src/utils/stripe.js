import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_test_51THzAmItNPa7FHOqTrtAv1VsgMDCWD5D1gxgEKan2wSZaNHDKgQ82G1huOuFjaS3Felse5kcyjoguIBOfsXlaxIG00bxu3Ozvz"
);