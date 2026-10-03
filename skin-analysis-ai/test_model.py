from huggingface_hub import hf_hub_download
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np

MODEL_ID = "SopanhaZinII/facial-condition-model"

# Download/load the AI model
model_path = hf_hub_download(
    repo_id=MODEL_ID,
    filename="finetuned_best.h5"
)

model = load_model(model_path)

# Load test image
img = image.load_img("test2.jpg", target_size=(224, 224))
img_array = image.img_to_array(img)
img_array = np.expand_dims(img_array, axis=0)
img_array = img_array / 255.0

# AI prediction
predictions = model.predict(img_array)

labels = [
    "Acne",
    "Dry Skin",
    "Oily Skin",
    "Dark Spots",
    "Wrinkles"
]

print("\n--- SKIN ANALYSIS ---")

for label, score in zip(labels, predictions[0]):
    print(f"{label}: {score:.2f}")