console.log("rating.js");

const ratingHandler = async (event) => {
  event.preventDefault();
  console.log("ratingHandler");
  // if (!event.target.matches('select.action')) {
  //   console.log("in first if statement");
  //   return;
  // } 
  const ratingSelect = event.target;
  const album_id = ratingSelect.getAttribute("data-albumID");
  const artist_id = ratingSelect.getAttribute("data-aristID");
  const score = ratingSelect.value;
  console.log("albumID:", album_id, "aristID:", artist_id, "score:", score);
  if (score == "") {
      //delete rating
      return;
  }

  let body = JSON.stringify({ album_id, artist_id, score });
  console.log("body:", body);
  const response = await fetch("/api/ratings/", {
    method: "POST",
    body: body,
    headers: { "Content-Type": "application/json" },
  });

  const resJson = await response.json(); 
  console.log("resJon:", resJson);
  if (resJson == "Log In") {
    document.location.replace("/login");
  } else if (response.ok) {
    document.location.replace(`/artist/${artist_id}`);
  } else {
    alert("Failed to save rating");
  }


  // const response = await fetch("/api/users/login", {
  // method: "POST",
  // body: JSON.stringify({ email, password }),
  // headers: { "Content-Type": "application/json" },
  // });

  // const resJson = await response.json(); 
  // console.log("userID:", resJson.userID);

  // if (response.ok) {
  // document.location.replace("/login");
  // } else {
  // alert("Failed to log in.");
  // }
    
};

var elements = document.getElementsByClassName("album-rating");
for (var i = 0; i < elements.length; i++) {
  elements[i].addEventListener("change", ratingHandler, false);
}