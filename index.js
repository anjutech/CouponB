import app from "./server.js";

const PORT = 5000;



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
