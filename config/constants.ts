// Purpose: To store all the constants used in the application.
export const config = {
  PORT: 5000,

  MESSAGE: {
    WELCOME: "You're successfully connected to MONGO API.",
  },

  DB: {
    // Create you own mongodb URI from Atlas MongoDB and use it here.
    URI: "mongodb+srv://darielavila43:m5JcyIOUCcN6IjfJ@tarlac.yjnmgso.mongodb.net/?retryWrites=true&w=majority&appName=Tarlac",
    ERROR: "Error connecting to database: ",
    NOT_INITIALIZED: "Database connection not initialized",
    CONNECTED: "Connected to database",
  },

  CLOUDINARY: {
    CLOUD_NAME: "plaque-dev",
    API_KEY: "479834719534576",
    API_SECRET: "0GgNG5UZbls7f2ecgjVbc5AcUtM",
  },
};
