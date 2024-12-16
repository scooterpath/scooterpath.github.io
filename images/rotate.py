import cv2
import numpy as np

# Load the 360 equirectangular image
for i in range(5):
    image = cv2.imread(f"bushnell{i}.jpg")
    

    # Get the width and height of the image
    height, width = image.shape[:2]

    # Rotate the image by shifting pixels horizontally by half the width
    shifted_image = np.roll(image, width // 2, axis=1)

    # Save the rotated image
    cv2.imwrite(f"rbushnell{i}.jpg", shifted_image)
