export const downloadAiImage = async (imageUrl: string, name: string) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    // Use a default name if name is null or undefined
    a.download = name || "image";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};
