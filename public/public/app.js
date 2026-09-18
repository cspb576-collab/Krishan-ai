async function askAI() {
  const imageInput = document.getElementById("imageInput");
  const question = document.getElementById("question").value.trim();
  const answer = document.getElementById("answer");
  const loading = document.getElementById("loading");

  if (!imageInput.files.length) {
    answer.innerText = "⚠️ पहले कोई फोटो चुनें।";
    return;
  }

  const file = imageInput.files[0];

  loading.style.display = "block";
  answer.innerText = "";

  try {
    const reader = new FileReader();

    reader.onload = async function () {
      const image = reader.result;

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: image,
          question: question || "इस फोटो को विस्तार से समझाइए।"
        })
      });

      const data = await response.json();

      if (response.ok) {
        answer.innerText =
          data.answer ||
          data.result ||
          "AI से कोई जवाब नहीं मिला।";
      } else {
        answer.innerText =
          "❌ Error: " + (data.error || "कुछ समस्या हुई।");
      }

      loading.style.display = "none";
    };

    reader.readAsDataURL(file);

  } catch (error) {
    loading.style.display = "none";
    answer.innerText =
      "❌ Server से connection नहीं हो पाया।";
    console.error(error);
  }
}


// फोटो चुनते ही preview दिखाएँ
document.getElementById("imageInput").addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("preview");

  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});
