import 'dotenv/config';

export default {
  expo: {
    name: "Helip",
    slug: "Helip",
    extra: {
      googleMapsApiKey: process.env.GOOGLE_API_KEY,
    },
  },
};