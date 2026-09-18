const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const previewWrap = document.getElementById("previewWrap");
const question = document.getElementById("question");
const result = document.getElementById("result");
const analyzeBtn = document.getElementById("analyzeBtn");
const analyzeStatus = document.getElementById("analyzeStatus");
const removeBtn = document.getElementById("removeBtn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchStatus = document.getElementById("searchStatus");
const copyBtn = document.getElementById("copyBtn");

let imageData = "";

imageInput.addEventListener("change", async () => {
  const file = imageInput.files?.[0];
  if (!file) return;
  imageData = await resizeImage(file, 1600, 0.82);
  preview.src = imageData;
  previewWrap.classList.remove("hidden");
  result.textContent = "Image ready. अब Analyze करें।";
});

removeBtn.addEventListener("click", () => {
  imageData = "";
  imageInput.value = "";
  preview.src = "";
  previewWrap.classList.add("hidden");
});

analyzeBtn.addEventListener("click", async () => {
  if (!imageData) {
    analyzeStatus.textContent = "पहले photo/image चुनें।";
    return;
  }

  analyzeBtn.disabled = true;
  analyzeStatus.textContent = "AI image को analyze कर रहा है…";
  result.textContent = "कृपया थोड़ा इंतज़ार करें…";

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        image: imageData,
        question: question.value
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    result.textContent = data.answer;
    analyzeStatus.textContent = "Analysis complete ✅";
  } catch (e) {
    result.textContent = "Error: " + e.message;
    analyzeStatus.textContent = "Analysis failed.";
  } finally {
    analyzeBtn.disabled = false;
  }
});

searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  if (!query) {
    searchStatus.textContent = "पहले search लिखें।";
    return;
  }

  searchBtn.disabled = true;
  searchStatus.textContent = "Public web information खोजी जा रही है…";
  try {
    const res = await fetch("/api/public-info", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    result.textContent = data.answer;
    searchStatus.textContent = "Search complete ✅";
  } catch (e) {
    result.textContent = "Error: " + e.message;
    searchStatus.textContent = "Search failed.";
  } finally {
    searchBtn.disabled = false;
  }
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(result.textContent);
  copyBtn.textContent = "Copied ✓";
  setTimeout(() => copyBtn.textContent = "Copy", 1200);
});

function resizeImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}