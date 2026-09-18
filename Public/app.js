async function askAI() {
  const input = document.getElementById("imageInput");
  const question = document.getElementById("question").value;
  const loading = document.getElementById("loading");
  const answer = document.getElementById("answer");

  answer.innerText = "";
  loading.style.display = "block";

  try {
    // अगर फोटो चुनी है
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: image,
          question: question
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      answer.innerText = data.answer || "कोई जवाब नहीं मिला";
    }

    // अगर सिर्फ सवाल पूछा है
    else {
      const response = await fetch("/api/public-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: question
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      answer.innerText = data.answer || "कोई जवाब नहीं मिला";
    }
  } catch (error) {
    answer.innerText = "❌ Error: " + error.message;
  } finally {
    loading.style.display = "none";
  }
}
