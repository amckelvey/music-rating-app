console.log("In review.js");

const ratingSelect = document.getElementById('rating');
const reviewForm = document.getElementById('review-form')
console.log(ratingSelect);

if (typeof(ratingSelect.dataset.ratingid) != "undefined") {
  const score = ratingSelect.dataset.userscore;
  ratingSelect.value = score;
}

const reviewHandler = async (event) => {
  event.preventDefault();
  console.log("reviewHandler");
  const album_id = ratingSelect.getAttribute("data-albumID");
  const artist_id = ratingSelect.getAttribute("data-aristID");
  const score = ratingSelect.value;
  let review = document.getElementById("review-text").value;
  if (score == "") {
      //delete rating
      alert("You must select a rating");
      location.reload();
  }

  if (review == "") {
    review = null;
  }
  console.log("review:", review);
  let body = JSON.stringify({ album_id, artist_id, score, review });
  let response;
  if (typeof(ratingSelect.dataset.ratingid) != "undefined") {
    const ratingID = ratingSelect.dataset.ratingid;
    response = await fetch(`/api/reviews/${ratingID}`, {
      method: "PUT",
      body: body,
      headers: { "Content-Type": "application/json" },
    });
  } else {
    response = await fetch("/api/reviews/", {
      method: "POST",
      body: body,
      headers: { "Content-Type": "application/json" },
    });  
  }
  const resJson = await response.json(); 
  console.log("resJon:", resJson);
  if (resJson == "Log In") {
    document.location.replace("/login");
  } else if (response.ok) {
    location.reload();;
  } else {
    alert("Failed to save rating");
  } 
};

reviewForm.addEventListener("submit", reviewHandler);