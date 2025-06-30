
(async () => {
  let result = await fetch("http://127.0.0.1:8000/auth/me", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJicnlhbkBnbWFpbC5jb20iLCJleHAiOjE3NTEyNTU0OTR9.x5dn0MrjXem3xidy1VaoheTvOMNXhNBu1MSDhsVpS3Y",
    },
  });

  console.log("Response status:", result.status);
  console.log("Response body:", await result.text());
})();