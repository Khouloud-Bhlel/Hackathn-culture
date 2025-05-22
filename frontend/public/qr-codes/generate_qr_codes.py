import os
import qrcode
import json

# Corrected paths to images and videos folders
images_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "../images"))
videos_folder = os.path.abspath(os.path.join(os.path.dirname(__file__), "../videos"))
qr_codes_folder = os.path.abspath(os.path.dirname(__file__))

# Path to the mapping file
mapping_file = os.path.join(qr_codes_folder, "qr_mapping.json")

# Initialize the mapping dictionary
qr_mapping = {}

# Corrected base URL for the network
base_url = "http://192.168.0.237:5173"

# Function to generate QR code
def generate_qr_code(file_path, output_folder):
    relative_path = os.path.relpath(file_path, os.path.join(os.path.dirname(qr_codes_folder), ".."))
    full_url = f"{base_url}/{relative_path.replace(os.sep, '/')}"

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(full_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    file_name = os.path.basename(file_path) + ".png"
    qr_code_path = os.path.join(output_folder, file_name)
    img.save(qr_code_path)

    # Add to the mapping
    qr_mapping[file_path] = full_url

# Generate QR codes for images
for image_file in os.listdir(images_folder):
    image_path = os.path.join(images_folder, image_file)
    if os.path.isfile(image_path):
        generate_qr_code(image_path, qr_codes_folder)

# Generate QR codes for videos
for video_file in os.listdir(videos_folder):
    video_path = os.path.join(videos_folder, video_file)
    if os.path.isfile(video_path):
        generate_qr_code(video_path, qr_codes_folder)

# Save the mapping to a JSON file
with open(mapping_file, "w") as f:
    json.dump(qr_mapping, f, indent=4)
